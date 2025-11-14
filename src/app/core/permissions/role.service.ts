import { Injectable, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { SupabaseService } from '../supabase/supabase.service';
import { PermissionService } from './permission.service';
import { Role, Permission, UserRole } from './types';

/**
 * 角色管理服务
 * 
 * 提供角色查询和管理功能
 * 
 * @example
 * ```typescript
 * const roleService = inject(RoleService);
 * roleService.getRoles().subscribe(roles => {
 *   console.log('All roles:', roles);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly permissionService = inject(PermissionService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  /**
   * 获取当前用户 ID
   */
  private getCurrentUserId(): string | null {
    const token = this.tokenService.get();
    return token?.user?.id || null;
  }

  /**
   * 获取所有角色
   * 
   * @returns Observable<Role[]>
   */
  getRoles(): Observable<Role[]> {
    return from(
      this.supabaseService.client
        .from('roles')
        .select('*')
        .order('priority', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw new Error(`Failed to get roles: ${error.message}`);
        }
        return (data || []) as Role[];
      })
    );
  }

  /**
   * 获取用户角色
   * 
   * @param userId 用户 ID
   * @returns Observable<Role[]>
   */
  getUserRoles(userId: string): Observable<Role[]> {
    return from(
      this.supabaseService.client
        .from('user_roles')
        .select('roles(*)')
        .eq('account_id', userId)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw new Error(`Failed to get user roles: ${error.message}`);
        }
        return (data || []).map((ur: any) => ur.roles as Role);
      })
    );
  }

  /**
   * 获取角色权限
   * 
   * @param roleId 角色 ID
   * @returns Observable<Permission[]>
   */
  getRolePermissions(roleId: string): Observable<Permission[]> {
    return from(
      this.supabaseService.client
        .from('role_permissions')
        .select('permissions(*)')
        .eq('role_id', roleId)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw new Error(`Failed to get role permissions: ${error.message}`);
        }
        return (data || []).map((rp: any) => rp.permissions as Permission);
      })
    );
  }

  /**
   * 根据 ID 获取角色
   * 
   * @param roleId 角色 ID
   * @returns Observable<Role | null>
   */
  getRoleById(roleId: string): Observable<Role | null> {
    return from(
      this.supabaseService.client
        .from('roles')
        .select('*')
        .eq('id', roleId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          if (error.code === 'PGRST116') {
            return null; // 未找到
          }
          throw new Error(`Failed to get role: ${error.message}`);
        }
        return data as Role;
      })
    );
  }

  /**
   * 分配角色给用户
   * 
   * 需要权限：role.assign
   * 
   * @param userId 用户 ID
   * @param roleId 角色 ID
   * @param scope 作用域（可选）
   * @returns Observable<void>
   * @throws Error 如果权限不足
   */
  assignRole(
    userId: string,
    roleId: string,
    scope?: { blueprintId?: string; branchId?: string }
  ): Observable<void> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated'));
    }

    // 先验证权限
    return this.permissionService.can('role.assign').pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          return throwError(() => new Error('Permission denied: role.assign'));
        }

        return from(
          this.supabaseService.client
            .from('user_roles')
            .insert({
              account_id: userId,
              role_id: roleId,
              blueprint_id: scope?.blueprintId || null,
              branch_id: scope?.branchId || null,
              granted_by: currentUserId
            })
        ).pipe(
          map(({ error }) => {
            if (error) {
              throw new Error(`Failed to assign role: ${error.message}`);
            }
          })
        );
      })
    );
  }

  /**
   * 移除用户角色
   * 
   * 需要权限：role.remove
   * 
   * @param userId 用户 ID
   * @param roleId 角色 ID
   * @param scope 作用域（可选）
   * @returns Observable<void>
   * @throws Error 如果权限不足
   */
  removeRole(
    userId: string,
    roleId: string,
    scope?: { blueprintId?: string; branchId?: string }
  ): Observable<void> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated'));
    }

    // 先验证权限
    return this.permissionService.can('role.remove').pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          return throwError(() => new Error('Permission denied: role.remove'));
        }

        let query = this.supabaseService.client
          .from('user_roles')
          .delete()
          .eq('account_id', userId)
          .eq('role_id', roleId);

        if (scope?.blueprintId) {
          query = query.eq('blueprint_id', scope.blueprintId);
        }
        if (scope?.branchId) {
          query = query.eq('branch_id', scope.branchId);
        }

        return from(query).pipe(
          map(({ error }) => {
            if (error) {
              throw new Error(`Failed to remove role: ${error.message}`);
            }
          })
        );
      })
    );
  }

  /**
   * 更新角色
   * 
   * 需要权限：role.update
   * 
   * @param roleId 角色 ID
   * @param data 更新数据
   * @returns Observable<void>
   * @throws Error 如果权限不足
   */
  updateRole(roleId: string, data: Partial<Role>): Observable<void> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated'));
    }

    // 先验证权限
    return this.permissionService.can('role.update').pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          return throwError(() => new Error('Permission denied: role.update'));
        }

        return from(
          this.supabaseService.client
            .from('roles')
            .update(data)
            .eq('id', roleId)
        ).pipe(
          map(({ error }) => {
            if (error) {
              throw new Error(`Failed to update role: ${error.message}`);
            }
          })
        );
      })
    );
  }

  /**
   * 分配权限给角色
   * 
   * 需要权限：role.permission.assign
   * 
   * @param roleId 角色 ID
   * @param permissionId 权限 ID
   * @returns Observable<void>
   * @throws Error 如果权限不足
   */
  assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated'));
    }

    // 先验证权限
    return this.permissionService.can('role.permission.assign').pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          return throwError(() => new Error('Permission denied: role.permission.assign'));
        }

        return from(
          this.supabaseService.client
            .from('role_permissions')
            .insert({
              role_id: roleId,
              permission_id: permissionId
            })
        ).pipe(
          map(({ error }) => {
            if (error) {
              throw new Error(`Failed to assign permission: ${error.message}`);
            }
          })
        );
      })
    );
  }

  /**
   * 移除角色权限
   * 
   * 需要权限：role.permission.remove
   * 
   * @param roleId 角色 ID
   * @param permissionId 权限 ID
   * @returns Observable<void>
   * @throws Error 如果权限不足
   */
  removePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated'));
    }

    // 先验证权限
    return this.permissionService.can('role.permission.remove').pipe(
      switchMap(hasPermission => {
        if (!hasPermission) {
          return throwError(() => new Error('Permission denied: role.permission.remove'));
        }

        return from(
          this.supabaseService.client
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId)
            .eq('permission_id', permissionId)
        ).pipe(
          map(({ error }) => {
            if (error) {
              throw new Error(`Failed to remove permission: ${error.message}`);
            }
          })
        );
      })
    );
  }
}

