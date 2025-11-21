import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type RoleRow = Database['public']['Tables']['roles']['Row'];
type RoleInsert = Database['public']['Tables']['roles']['Insert'];
type RoleUpdate = Database['public']['Tables']['roles']['Update'];

/**
 * Role 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 * 注意：此类型与 core/permissions/types.ts 中的 Role 接口不同，此类型用于数据访问层
 */
// 注意：不导出 Role 类型，避免与 core/permissions/types.ts 中的 Role 接口冲突
// 如果需要使用此类型，请使用 RoleEntity 或直接从 Repository 方法返回类型推断
type RoleEntity = RoleRow;
export type { RoleInsert, RoleUpdate };

/**
 * Role Repository
 *
 * 提供角色相关的数据访问方法
 *
 * @example
 * ```typescript
 * const roleRepo = inject(RoleRepository);
 * roleRepo.findByName('admin').subscribe(role => {
 *   console.log('Role:', role);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class RoleRepository extends BaseRepository<RoleEntity, RoleInsert, RoleUpdate> {
  protected tableName = 'roles';

  /**
   * 根据名称查询角色
   *
   * @param name 角色名称
   * @returns Observable<Role | null>
   */
  findByName(name: string): Observable<RoleEntity | null> {
    return this.findAll({
      filters: {
        name
      }
    }).pipe(map(roles => (roles.length > 0 ? roles[0] : null)));
  }

  /**
   * 查询系统角色
   *
   * @param options 查询选项
   * @returns Observable<Role[]>
   */
  findSystemRoles(options?: QueryOptions): Observable<RoleEntity[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isSystemRole: true // 会自动转换为 is_system_role
      }
    });
  }

  /**
   * 查询自定义角色
   *
   * @param options 查询选项
   * @returns Observable<Role[]>
   */
  findCustomRoles(options?: QueryOptions): Observable<RoleEntity[]> {
    // 自定义角色：is_system_role = false 或 null
    // 由于 BaseRepository 的 filters 只支持等值查询，这里需要特殊处理
    // 使用 Supabase client 直接查询
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or('is_system_role.is.null,is_system_role.eq.false');

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询自定义角色失败');
        }
        return (response.data || []).map(item => toCamelCaseData<RoleEntity>(item));
      })
    );
  }
}
