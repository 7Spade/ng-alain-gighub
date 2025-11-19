import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type UserRoleRow = Database['public']['Tables']['user_roles']['Row'];
type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert'];
type UserRoleUpdate = Database['public']['Tables']['user_roles']['Update'];

/**
 * UserRole 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 * 注意：此类型与 core/permissions/types.ts 中的 UserRole 接口不同，此类型用于数据访问层
 */
// 注意：不导出 UserRole 类型，避免与 core/permissions/types.ts 中的 UserRole 接口冲突
// 如果需要使用此类型，请使用 UserRoleEntity 或直接从 Repository 方法返回类型推断
type UserRoleEntity = UserRoleRow;
export type { UserRoleInsert, UserRoleUpdate };

/**
 * UserRole Repository
 *
 * 提供用户角色关联相关的数据访问方法
 *
 * @example
 * ```typescript
 * const userRoleRepo = inject(UserRoleRepository);
 * userRoleRepo.findByAccountId('account-id').subscribe(userRoles => {
 *   console.log('User roles:', userRoles);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class UserRoleRepository extends BaseRepository<UserRoleEntity, UserRoleInsert, UserRoleUpdate> {
  protected tableName = 'user_roles';

  /**
   * 根据账户 ID 查询用户角色
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<UserRole[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<UserRoleEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据角色 ID 查询用户角色
   *
   * @param roleId 角色 ID
   * @param options 查询选项
   * @returns Observable<UserRole[]>
   */
  findByRoleId(roleId: string, options?: QueryOptions): Observable<UserRoleEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        roleId // 会自动转换为 role_id
      }
    });
  }

  /**
   * 根据蓝图 ID 查询用户角色
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<UserRole[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<UserRoleEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据分支 ID 查询用户角色
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<UserRole[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<UserRoleEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 查询账户在蓝图中的角色
   *
   * @param accountId 账户 ID
   * @param blueprintId 蓝图 ID
   * @returns Observable<UserRole | null>
   */
  findByAccountAndBlueprint(accountId: string, blueprintId: string): Observable<UserRoleEntity | null> {
    return this.findAll({
      filters: {
        accountId,
        blueprintId
      }
    }).pipe(map(userRoles => (userRoles.length > 0 ? userRoles[0] : null)));
  }
}
