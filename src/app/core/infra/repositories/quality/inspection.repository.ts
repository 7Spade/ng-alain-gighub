import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { toCamelCaseData } from '../../utils/transformers';
import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * Inspection 实体类型（camelCase）
 */
type InspectionRow = Database['public']['Tables']['inspections']['Row'];
type InspectionInsert = Database['public']['Tables']['inspections']['Insert'];
type InspectionUpdate = Database['public']['Tables']['inspections']['Update'];

export type Inspection = InspectionRow;
export type { InspectionInsert, InspectionUpdate };

/**
 * Inspection Repository
 *
 * 提供验收记录相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class InspectionRepository extends BaseRepository<Inspection, InspectionInsert, InspectionUpdate> {
  protected tableName = 'inspections';

  /**
   * 根据任务 ID 查询验收记录
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<Inspection[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<Inspection[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      },
      orderBy: 'inspected_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据检查员 ID 查询验收记录
   *
   * @param inspectorId 检查员 ID
   * @param options 查询选项
   * @returns Observable<Inspection[]>
   */
  findByInspectorId(inspectorId: string, options?: QueryOptions): Observable<Inspection[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        inspectorId // 会自动转换为 inspector_id
      },
      orderBy: 'inspected_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据状态查询验收记录
   *
   * @param status 状态
   * @param options 查询选项
   * @returns Observable<Inspection[]>
   */
  findByStatus(status: string, options?: QueryOptions): Observable<Inspection[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      },
      orderBy: 'inspected_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据检查类型查询验收记录
   *
   * @param inspectionType 检查类型
   * @param options 查询选项
   * @returns Observable<Inspection[]>
   *
   * @example
   * ```typescript
   * inspectionRepo.findByInspectionType('final').subscribe(inspections => {
   *   console.log('最终验收记录:', inspections);
   * });
   * ```
   */
  findByInspectionType(inspectionType: string, options?: QueryOptions): Observable<Inspection[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        inspectionType // 会自动转换为 inspection_type
      },
      orderBy: 'inspected_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 搜索验收记录（支持模糊查询）
   *
   * @param query 搜索关键词 - 用于搜索备注和检查结果
   * @param options 查询选项 - 包含排序、分页等配置
   * @returns Observable<Inspection[]> - 返回匹配的验收记录列表
   * @throws Error - 当查询失败时抛出错误
   *
   * @example
   * ```typescript
   * inspectionRepo.search('验收通过', { page: 1, pageSize: 20 }).subscribe(inspections => {
   *   console.log('找到验收记录:', inspections);
   * });
   * ```
   */
  search(query: string, options?: QueryOptions): Observable<Inspection[]> {
    // 空查询返回空数组（不是错误）
    if (!query || query.trim().length === 0) {
      return from(Promise.resolve([]));
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .or(`notes.ilike.%${trimmedQuery}%,inspection_result.ilike.%${trimmedQuery}%`) as any;

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      searchQuery = searchQuery.order(snakeOrderBy, {
        ascending: options.orderDirection !== 'desc'
      });
    } else {
      // 默认按验收时间降序排序
      searchQuery = searchQuery.order('inspected_at', { ascending: false });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      searchQuery = searchQuery.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(searchQuery) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '搜索验收记录失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Inspection>(item));
      })
    );
  }
}
