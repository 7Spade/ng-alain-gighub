import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';
import { BranchPermissionLevel } from '../../types/permission';

/**
 * BranchPermission 实体类型（camelCase）
 * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
 */
type BranchPermissionRow = Database['public']['Tables']['branch_permissions']['Row'];
type BranchPermissionInsert = Database['public']['Tables']['branch_permissions']['Insert'];
type BranchPermissionUpdate = Database['public']['Tables']['branch_permissions']['Update'];

/**
 * BranchPermission 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BranchPermission = BranchPermissionRow;
export type { BranchPermissionInsert, BranchPermissionUpdate };

/**
 * BranchPermission Repository
 *
 * 提供分支權限相關的數據訪問方法
 *
 * @example
 * ```typescript
 * const branchPermRepo = inject(BranchPermissionRepository);
 * branchPermRepo.findByBranchId('branch-id').subscribe(permissions => {
 *   console.log('Branch permissions:', permissions);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchPermissionRepository extends BaseRepository<BranchPermission, BranchPermissionInsert, BranchPermissionUpdate> {
  protected tableName = 'branch_permissions';

  /**
   * 根据分支 ID 查询权限
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<BranchPermission[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<BranchPermission[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 根据账户 ID 查询权限
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<BranchPermission[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<BranchPermission[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据分支 ID 和账户 ID 查询权限（唯一查询）
   *
   * @param branchId 分支 ID
   * @param accountId 账户 ID
   * @returns Observable<BranchPermission | null>
   */
  findByBranchAndAccount(branchId: string, accountId: string): Observable<BranchPermission | null> {
    return this.findAll({
      filters: {
        branchId,
        accountId
      }
    }).pipe(map(permissions => (permissions.length > 0 ? permissions[0] : null)));
  }

  /**
   * 根据权限级别查询权限
   *
   * @param permissionLevel 权限级别
   * @param options 查询选项
   * @returns Observable<BranchPermission[]>
   */
  findByPermissionLevel(permissionLevel: BranchPermissionLevel, options?: QueryOptions): Observable<BranchPermission[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        permissionLevel // 会自动转换为 permission_level
      }
    });
  }

  /**
   * 授予分支权限
   *
   * @param branchId 分支 ID
   * @param accountId 账户 ID
   * @param permissionLevel 权限级别
   * @param grantedBy 授予者 ID
   * @returns Observable<BranchPermission>
   */
  grantPermission(
    branchId: string,
    accountId: string,
    permissionLevel: BranchPermissionLevel,
    grantedBy: string
  ): Observable<BranchPermission> {
    const insertData = {
      branchId,
      accountId,
      permissionLevel,
      grantedBy,
      grantedAt: new Date().toISOString()
    } as any as BranchPermissionInsert;

    return this.create(insertData);
  }

  /**
   * 更新权限级别
   *
   * @param id 权限 ID
   * @param permissionLevel 新的权限级别
   * @param grantedBy 更新者 ID
   * @returns Observable<BranchPermission>
   */
  updatePermissionLevel(id: string, permissionLevel: BranchPermissionLevel, grantedBy: string): Observable<BranchPermission> {
    const updateData = {
      permissionLevel,
      grantedBy,
      grantedAt: new Date().toISOString()
    } as any as BranchPermissionUpdate;

    return this.update(id, updateData);
  }

  /**
   * 撤销权限
   *
   * @param branchId 分支 ID
   * @param accountId 账户 ID
   * @returns Observable<void>
   */
  revokePermission(branchId: string, accountId: string): Observable<void> {
    return this.findAll({
      filters: {
        branchId,
        accountId
      }
    }).pipe(
      map(permissions => {
        if (permissions.length > 0) {
          return this.delete(permissions[0].id);
        }
        throw new Error('权限不存在');
      }),
      map(() => undefined)
    );
  }
}
