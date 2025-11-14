import { Injectable, inject } from '@angular/core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Observable, from, of, throwError, forkJoin } from 'rxjs';
import { map, switchMap, catchError, tap, shareReplay } from 'rxjs/operators';

import { SupabaseService } from '../supabase/supabase.service';
import { Permission, PermissionCacheItem } from './types';

/**
 * 权限检查服务
 * 
 * 整合 @delon/acl 和 Supabase 数据库，实现 RBAC 权限控制
 * 
 * 功能：
 * 1. 权限检查（can, canAny, canAll）
 * 2. Git-like 分支权限检查
 * 3. 权限缓存（内存缓存）
 * 4. 权限同步到 @delon/acl
 * 5. 权限检查日志记录（后续实现）
 * 
 * @example
 * ```typescript
 * const permissionService = inject(PermissionService);
 * permissionService.can('blueprint.read').subscribe(hasPermission => {
 *   if (!hasPermission) {
 *     throw new Error('Permission denied');
 *   }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly aclService = inject(ACLService);
  private readonly supabaseService = inject(SupabaseService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  /**
   * 权限缓存（内存缓存）
   * key: permission string, value: PermissionCacheItem
   */
  private readonly permissionCache = new Map<string, PermissionCacheItem>();

  /**
   * 缓存过期时间（毫秒），默认 5 分钟
   */
  private readonly CACHE_TTL = 5 * 60 * 1000;

  /**
   * 当前用户权限缓存（Observable）
   */
  private userPermissions$?: Observable<Permission[]>;

  /**
   * 获取当前用户 ID
   */
  private getCurrentUserId(): string | null {
    const token = this.tokenService.get();
    return token?.['user']?.id || null;
  }

  /**
   * 检查单个权限
   * 
   * @param permission 权限名称（如 'blueprint.read'）
   * @returns Observable<boolean> 是否有权限
   * @throws Error 如果权限检查失败（根据配置）
   */
  can(permission: string): Observable<boolean> {
    // 1. 检查本地 ACLService 缓存
    if (this.aclService.can(permission)) {
      return of(true);
    }

    // 2. 检查内存缓存
    const cached = this.permissionCache.get(permission);
    if (cached && cached.expiresAt > Date.now()) {
      return of(cached.hasPermission);
    }

    // 3. 查询数据库
    return this.checkDatabasePermission(permission).pipe(
      tap(hasPermission => {
        // 更新内存缓存
        this.permissionCache.set(permission, {
          permission,
          hasPermission,
          expiresAt: Date.now() + this.CACHE_TTL
        });
      }),
      catchError(error => {
        // 权限检查失败时抛出异常
        return throwError(() => new Error(`Permission check failed: ${permission} - ${error.message}`));
      })
    );
  }

  /**
   * 检查任一权限（OR 逻辑）
   * 
   * @param permissions 权限数组
   * @returns Observable<boolean> 是否有任一权限
   */
  canAny(permissions: string[]): Observable<boolean> {
    if (permissions.length === 0) {
      return of(false);
    }

    // 并行检查所有权限，任一为 true 即返回 true
    const checks = permissions.map(p => 
      this.can(p).pipe(
        catchError(() => of(false))
      )
    );

    return forkJoin(checks).pipe(
      map(results => results.some(r => r === true))
    );
  }

  /**
   * 检查所有权限（AND 逻辑）
   * 
   * @param permissions 权限数组
   * @returns Observable<boolean> 是否有所有权限
   */
  canAll(permissions: string[]): Observable<boolean> {
    if (permissions.length === 0) {
      return of(true);
    }

    // 并行检查所有权限，全部为 true 才返回 true
    const checks = permissions.map(p => 
      this.can(p).pipe(
        catchError(() => of(false))
      )
    );

    return forkJoin(checks).pipe(
      map(results => results.every(r => r === true))
    );
  }

  /**
   * 从数据库查询权限
   * 
   * @param permission 权限名称
   * @returns Observable<boolean>
   */
  private checkDatabasePermission(permission: string): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(false);
    }

    // 查询用户角色 -> 角色权限 -> 权限详情
    return from(
      this.supabaseService.client
        .from('user_roles')
        .select(`
          roles!inner(
            role_permissions!inner(
              permissions!inner(
                name,
                resource,
                action
              )
            )
          )
        `)
        .eq('account_id', userId)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw new Error(`Database query failed: ${error.message}`);
        }

        if (!data || data.length === 0) {
          return false;
        }

        // 检查是否有匹配的权限
        for (const userRole of data) {
          const role = userRole.roles as any;
          if (role?.role_permissions) {
            for (const rolePerm of role.role_permissions) {
              const perm = rolePerm.permissions as Permission;
              if (perm.name === permission || `${perm.resource}.${perm.action}` === permission) {
                return true;
              }
            }
          }
        }

        return false;
      }),
      tap(hasPermission => {
        // 如果权限存在，同步到 ACLService
        if (hasPermission) {
          this.syncPermissionToACL(permission);
        }
      })
    );
  }

  /**
   * 同步权限到 @delon/acl ACLService
   * 
   * @param permission 权限名称
   */
  private syncPermissionToACL(permission: string): void {
    // 解析权限格式：resource.action
    const parts = permission.split('.');
    if (parts.length === 2) {
      const currentData = this.aclService.data;
      const abilities = currentData.abilities || [];
      if (!abilities.includes(permission)) {
        // 使用 ACLService.set() 设置权限
        this.aclService.set({
          ...currentData,
          abilities: [...abilities, permission]
        });
      }
    }
  }

  /**
   * 检查蓝图访问权限
   * 
   * @param blueprintId 蓝图 ID
   * @param action 操作类型
   * @returns Observable<boolean>
   */
  canAccessBlueprint(blueprintId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(false);
    }

    // 查询蓝图拥有者或用户角色
    return from(
      this.supabaseService.client
        .from('blueprints')
        .select('owner_id')
        .eq('id', blueprintId)
        .single()
    ).pipe(
      switchMap(({ data: blueprint, error: blueprintError }) => {
        if (blueprintError || !blueprint) {
          return of(false);
        }

        // 如果是拥有者，拥有所有权限
        if (blueprint.owner_id === userId) {
          return of(true);
        }

        // 检查用户角色权限
        return from(
          this.supabaseService.client
            .from('user_roles')
            .select('roles(code)')
            .eq('account_id', userId)
            .eq('blueprint_id', blueprintId)
        ).pipe(
          map(({ data: userRoles }) => {
            if (!userRoles || userRoles.length === 0) {
              return false;
            }

            // 根据角色代码判断权限
            const roleCodes = userRoles.map(ur => (ur.roles as any).code);
            
            switch (action) {
              case 'read':
                return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager', 'viewer'].includes(code));
              case 'write':
                return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager'].includes(code));
              case 'admin':
                return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin'].includes(code));
              default:
                return false;
            }
          })
        );
      })
    );
  }

  /**
   * 检查分支访问权限
   * 
   * @param branchId 分支 ID
   * @param action 操作类型
   * @returns Observable<boolean>
   */
  canAccessBranch(branchId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(false);
    }

    // 查询分支权限
    return from(
      this.supabaseService.client
        .from('branch_permissions')
        .select('permission_level, blueprint_branches(blueprint_id, blueprints(owner_id))')
        .eq('branch_id', branchId)
        .eq('account_id', userId)
        .single()
    ).pipe(
      switchMap(({ data: branchPerm, error }) => {
        // 如果没有分支权限，检查是否是蓝图拥有者
        if (error || !branchPerm) {
          return from(
            this.supabaseService.client
              .from('blueprint_branches')
              .select('blueprint_id, blueprints(owner_id)')
              .eq('id', branchId)
              .single()
          ).pipe(
            map(({ data: branch }) => {
              const blueprint = (branch as any)?.blueprints;
              return blueprint?.owner_id === userId;
            })
          );
        }

        const level = branchPerm.permission_level as 'owner' | 'admin' | 'write' | 'read';
        
        switch (action) {
          case 'read':
            return of(true); // 所有级别都可以读取
          case 'write':
            return of(['owner', 'admin', 'write'].includes(level));
          case 'admin':
            return of(['owner', 'admin'].includes(level));
          default:
            return of(false);
        }
      })
    );
  }

  /**
   * 检查是否可以修改任务结构（只有拥有者可以）
   * 
   * @param blueprintId 蓝图 ID
   * @returns Observable<boolean>
   */
  canModifyTaskStructure(blueprintId: string): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(false);
    }

    return from(
      this.supabaseService.client
        .from('blueprints')
        .select('owner_id')
        .eq('id', blueprintId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return false;
        }
        return data.owner_id === userId;
      })
    );
  }

  /**
   * 检查是否可以填写承攬欄位（协作组织可以）
   * 
   * @param branchId 分支 ID
   * @returns Observable<boolean>
   */
  canFillContractorFields(branchId: string): Observable<boolean> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(false);
    }

    // 检查是否是分支所属组织
    return from(
      this.supabaseService.client
        .from('blueprint_branches')
        .select('organization_id')
        .eq('id', branchId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return false;
        }
        return data.organization_id === userId;
      })
    );
  }

  /**
   * 检查是否可以审核 PR（只有拥有者可以）
   * 
   * @param blueprintId 蓝图 ID
   * @returns Observable<boolean>
   */
  canReviewPR(blueprintId: string): Observable<boolean> {
    return this.canModifyTaskStructure(blueprintId);
  }

  /**
   * 检查是否可以创建 PR（分支所属组织可以）
   * 
   * @param branchId 分支 ID
   * @returns Observable<boolean>
   */
  canCreatePR(branchId: string): Observable<boolean> {
    return this.canFillContractorFields(branchId);
  }

  /**
   * 从数据库同步用户角色到 ACLService
   * 
   * @param userId 用户 ID
   * @returns Promise<void>
   */
  async syncRolesFromDatabase(userId: string): Promise<void> {
    const { data: userRoles, error } = await this.supabaseService.client
      .from('user_roles')
      .select('roles(code, name)')
      .eq('account_id', userId);

    if (error) {
      throw new Error(`Failed to sync roles: ${error.message}`);
    }

    if (userRoles && userRoles.length > 0) {
      const roles = userRoles.map(ur => (ur.roles as any).code);
      this.aclService.set({ role: roles });
    }
  }

  /**
   * 加载用户所有权限
   * 
   * @param userId 用户 ID
   * @returns Observable<Permission[]>
   */
  loadUserPermissions(userId: string): Observable<Permission[]> {
    if (this.userPermissions$) {
      return this.userPermissions$;
    }

    this.userPermissions$ = from(
      this.supabaseService.client
        .from('user_roles')
        .select(`
          roles!inner(
            role_permissions!inner(
              permissions!inner(*)
            )
          )
        `)
        .eq('account_id', userId)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw new Error(`Failed to load permissions: ${error.message}`);
        }

        const permissions: Permission[] = [];
        if (data) {
          for (const userRole of data) {
            const role = userRole.roles as any;
            if (role?.role_permissions) {
              for (const rolePerm of role.role_permissions) {
                const perm = rolePerm.permissions as Permission;
                if (!permissions.find(p => p.id === perm.id)) {
                  permissions.push(perm);
                }
              }
            }
          }
        }

        return permissions;
      }),
      tap(permissions => {
        // 同步权限到 ACLService
        const currentData = this.aclService.data;
        const abilities = permissions.map(p => `${p.resource}.${p.action}`);
        this.aclService.set({
          ...currentData,
          abilities: abilities
        });
      }),
      shareReplay(1)
    );

    return this.userPermissions$;
  }

  /**
   * 刷新当前用户权限
   * 
   * @returns Observable<void>
   */
  refreshPermissions(): Observable<void> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return of(undefined);
    }

    // 清除缓存
    this.permissionCache.clear();
    this.userPermissions$ = undefined;

    // 重新加载权限
    return this.loadUserPermissions(userId).pipe(
      switchMap(() => this.syncRolesFromDatabase(userId)),
      map(() => undefined),
      catchError(error => {
        return throwError(() => new Error(`Failed to refresh permissions: ${error.message}`));
      })
    );
  }

  /**
   * 清除权限缓存
   */
  clearCache(): void {
    this.permissionCache.clear();
    this.userPermissions$ = undefined;
  }
}

