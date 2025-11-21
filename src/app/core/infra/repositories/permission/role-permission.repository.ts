import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type RolePermissionRow = Database['public']['Tables']['role_permissions']['Row'];
type RolePermissionInsert = Database['public']['Tables']['role_permissions']['Insert'];
type RolePermissionUpdate = Database['public']['Tables']['role_permissions']['Update'];

/**
 * RolePermission 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type RolePermission = RolePermissionRow;
export type { RolePermissionInsert, RolePermissionUpdate };

/**
 * RolePermission Repository
 *
 * 提供角色权限关联相关的数据访问方法
 *
 * @example
 * ```typescript
 * const rolePermissionRepo = inject(RolePermissionRepository);
 * rolePermissionRepo.findByRoleId('role-id').subscribe(rolePermissions => {
 *   console.log('Role permissions:', rolePermissions);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class RolePermissionRepository extends BaseRepository<RolePermission, RolePermissionInsert, RolePermissionUpdate> {
  protected tableName = 'role_permissions';

  /**
   * 根据角色 ID 查询角色权限关联
   *
   * @param roleId 角色 ID
   * @param options 查询选项
   * @returns Observable<RolePermission[]>
   */
  findByRoleId(roleId: string, options?: QueryOptions): Observable<RolePermission[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        roleId // 会自动转换为 role_id
      }
    });
  }

  /**
   * 根据权限 ID 查询角色权限关联
   *
   * @param permissionId 权限 ID
   * @param options 查询选项
   * @returns Observable<RolePermission[]>
   */
  findByPermissionId(permissionId: string, options?: QueryOptions): Observable<RolePermission[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        permissionId // 会自动转换为 permission_id
      }
    });
  }

  /**
   * 查询角色权限关联
   *
   * @param roleId 角色 ID
   * @param permissionId 权限 ID
   * @returns Observable<RolePermission | null>
   */
  findByRoleAndPermission(roleId: string, permissionId: string): Observable<RolePermission | null> {
    return this.findAll({
      filters: {
        roleId,
        permissionId
      }
    }).pipe(map(rolePermissions => (rolePermissions.length > 0 ? rolePermissions[0] : null)));
  }
}
