import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { toCamelCaseData } from '../../utils/transformers';
import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * QualityCheck 实体类型（camelCase）
 */
type QualityCheckRow = Database['public']['Tables']['quality_checks']['Row'];
type QualityCheckInsert = Database['public']['Tables']['quality_checks']['Insert'];
type QualityCheckUpdate = Database['public']['Tables']['quality_checks']['Update'];

export type QualityCheck = QualityCheckRow;
export type { QualityCheckInsert, QualityCheckUpdate };

/**
 * QualityCheck Repository
 *
 * 提供品质检查相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class QualityCheckRepository extends BaseRepository<QualityCheck, QualityCheckInsert, QualityCheckUpdate> {
  protected tableName = 'quality_checks';

  /**
   * 根据任务 ID 查询品质检查
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<QualityCheck[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<QualityCheck[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      },
      orderBy: 'checked_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据检查员 ID 查询品质检查
   *
   * @param inspectorId 检查员 ID
   * @param options 查询选项
   * @returns Observable<QualityCheck[]>
   */
  findByInspectorId(inspectorId: string, options?: QueryOptions): Observable<QualityCheck[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        inspectorId // 会自动转换为 inspector_id
      },
      orderBy: 'checked_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据状态查询品质检查
   *
   * @param status 状态
   * @param options 查询选项
   * @returns Observable<QualityCheck[]>
   */
  findByStatus(status: string, options?: QueryOptions): Observable<QualityCheck[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      },
      orderBy: 'checked_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 搜索品质检查记录（支持模糊查询）
   *
   * @param query 搜索关键词 - 用于搜索备注和检查结果
   * @param options 查询选项 - 包含排序、分页等配置
   * @returns Observable<QualityCheck[]> - 返回匹配的品质检查记录列表
   * @throws Error - 当查询失败时抛出错误
   *
   * @example
   * ```typescript
   * qcRepo.search('不合格', { page: 1, pageSize: 20 }).subscribe(checks => {
   *   console.log('找到品质检查记录:', checks);
   * });
   * ```
   */
  search(query: string, options?: QueryOptions): Observable<QualityCheck[]> {
    // 空查询返回空数组（不是错误）
    if (!query || query.trim().length === 0) {
      return from(Promise.resolve([]));
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .or(`notes.ilike.%${trimmedQuery}%,check_result.ilike.%${trimmedQuery}%`) as any;

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      searchQuery = searchQuery.order(snakeOrderBy, {
        ascending: options.orderDirection !== 'desc'
      });
    } else {
      // 默认按检查时间降序排序
      searchQuery = searchQuery.order('checked_at', { ascending: false });
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
          throw new Error(response.error.message || '搜索品质检查记录失败');
        }
        return (response.data || []).map(item => toCamelCaseData<QualityCheck>(item));
      })
    );
  }
}
