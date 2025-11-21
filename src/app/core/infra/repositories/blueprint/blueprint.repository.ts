import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { BlueprintStatus } from '../../types/blueprint';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * Blueprint 实体类型（camelCase）
 * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
 */
type BlueprintRow = Database['public']['Tables']['blueprints']['Row'];
type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];

/**
 * Blueprint 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Blueprint = BlueprintRow;
export type { BlueprintInsert, BlueprintUpdate };

/**
 * Blueprint Repository
 *
 * 提供蓝图相关的数据访问方法
 *
 * @example
 * ```typescript
 * const blueprintRepo = inject(BlueprintRepository);
 * blueprintRepo.findByOwnerId('user-id').subscribe(blueprints => {
 *   console.log('User blueprints:', blueprints);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
  protected tableName = 'blueprints';

  /**
   * 根据拥有者 ID 查询蓝图
   *
   * @param ownerId 拥有者 ID
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findByOwnerId(ownerId: string, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        ownerId // 会自动转换为 owner_id
      }
    });
  }

  /**
   * 根据状态查询蓝图
   *
   * @param status 蓝图状态
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findByStatus(status: BlueprintStatus, options?: QueryOptions): Observable<Blueprint[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 根据项目代码查询蓝图
   *
   * @param projectCode 项目代码
   * @returns Observable<Blueprint | null>
   */
  findByProjectCode(projectCode: string): Observable<Blueprint | null> {
    return this.findAll({
      filters: {
        projectCode // 会自动转换为 project_code
      }
    }).pipe(map(blueprints => (blueprints.length > 0 ? blueprints[0] : null)));
  }

  /**
   * 查询活跃的蓝图（状态为 active）
   *
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  findActive(options?: QueryOptions): Observable<Blueprint[]> {
    return this.findByStatus(BlueprintStatus.ACTIVE, options);
  }

  /**
   * 搜索蓝图（支持模糊查询）
   *
   * @param query 搜索关键词
   * @param options 查询选项
   * @returns Observable<Blueprint[]>
   */
  search(query: string, options?: QueryOptions): Observable<Blueprint[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%,project_code.ilike.%${trimmedQuery}%`);

    // 只搜索规划中或进行中的蓝图
    searchQuery = searchQuery.in('status', [BlueprintStatus.PLANNING, BlueprintStatus.ACTIVE]);

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      searchQuery = searchQuery.order(snakeOrderBy, {
        ascending: options.orderDirection !== 'desc'
      });
    } else {
      // 默认按名称排序
      searchQuery = searchQuery.order('name', { ascending: true });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      searchQuery = searchQuery.range(fromIndex, toIndex);
    }

    return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<Blueprint>(item)) : [];
      })
    );
  }
}
