import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
   * 搜索驗收記錄（支持模糊查詢）
   * 
   * @param query 搜索關鍵詞 - 用於搜索驗收項目和備註
   * @param options 查詢選項 - 包含排序、分頁等配置
   * @returns Observable<Inspection[]> - 返回匹配的驗收記錄列表
   * @example
   * inspectionRepository.search('水電', { page: 1, pageSize: 10 })
   */
  search(query: string, options?: QueryOptions): Observable<Inspection[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName)
      .select(options?.select || '*')
      .or(`inspection_item.ilike.%${trimmedQuery}%,remarks.ilike.%${trimmedQuery}%`);

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
