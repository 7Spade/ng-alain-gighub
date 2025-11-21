import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
   * 搜索品質檢查（支持模糊查詢）
   * 
   * @param query 搜索關鍵詞 - 用於搜索檢查項目和備註
   * @param options 查詢選項 - 包含排序、分頁等配置
   * @returns Observable<QualityCheck[]> - 返回匹配的品質檢查列表
   * @example
   * qualityCheckRepository.search('牆面', { page: 1, pageSize: 10 })
   */
  search(query: string, options?: QueryOptions): Observable<QualityCheck[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName)
      .select(options?.select || '*')
      .or(`check_item.ilike.%${trimmedQuery}%,remarks.ilike.%${trimmedQuery}%`);

    // 應用排序
    if (options?.orderBy) {
      searchQuery = searchQuery.order(options.orderBy, {
        ascending: options.orderDirection === 'asc'
      });
    }

    // 應用分頁
    if (options?.page && options?.pageSize) {
      const from = (options.page - 1) * options.pageSize;
      const to = from + options.pageSize - 1;
      searchQuery = searchQuery.range(from, to);
    }

    return this.executeQuery(searchQuery);
  }
}
