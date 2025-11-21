import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type PermissionRow = Database['public']['Tables']['permissions']['Row'];
type PermissionInsert = Database['public']['Tables']['permissions']['Insert'];
type PermissionUpdate = Database['public']['Tables']['permissions']['Update'];

/**
 * Permission 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 * 注意：此类型与 core/permissions/types.ts 中的 Permission 接口不同，此类型用于数据访问层
 */
// 注意：不导出 Permission 类型，避免与 core/permissions/types.ts 中的 Permission 接口冲突
// 如果需要使用此类型，请使用 PermissionEntity 或直接从 Repository 方法返回类型推断
type PermissionEntity = PermissionRow;
export type { PermissionInsert, PermissionUpdate };

/**
 * Permission Repository
 *
 * 提供权限相关的数据访问方法
 *
 * @example
 * ```typescript
 * const permissionRepo = inject(PermissionRepository);
 * permissionRepo.findByResource('blueprint').subscribe(permissions => {
 *   console.log('Permissions:', permissions);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionRepository extends BaseRepository<PermissionEntity, PermissionInsert, PermissionUpdate> {
  protected tableName = 'permissions';

  /**
   * 根据名称查询权限
   *
   * @param name 权限名称
   * @returns Observable<Permission | null>
   */
  findByName(name: string): Observable<PermissionEntity | null> {
    return this.findAll({
      filters: {
        name
      }
    }).pipe(map(permissions => (permissions.length > 0 ? permissions[0] : null)));
  }

  /**
   * 根据资源查询权限
   *
   * @param resource 资源名称
   * @param options 查询选项
   * @returns Observable<Permission[]>
   */
  findByResource(resource: string, options?: QueryOptions): Observable<PermissionEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        resource
      }
    });
  }

  /**
   * 查询系统权限
   *
   * @param options 查询选项
   * @returns Observable<Permission[]>
   */
  findSystemPermissions(options?: QueryOptions): Observable<PermissionEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isSystemPermission: true // 会自动转换为 is_system_permission
      }
    });
  }

  /**
   * 根据资源和操作查询权限
   *
   * @param resource 资源名称
   * @param action 操作名称
   * @returns Observable<Permission | null>
   */
  findByResourceAndAction(resource: string, action: string): Observable<PermissionEntity | null> {
    return this.findAll({
      filters: {
        resource,
        action
      }
    }).pipe(map(permissions => (permissions.length > 0 ? permissions[0] : null)));
  }
}
