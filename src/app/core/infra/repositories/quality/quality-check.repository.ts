import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
   * 搜索品质检查（按备注）
   *
   * 使用全文搜索功能在品质检查的备注中查找匹配的关键字
   *
   * @param query 搜索关键字
   * @param options 搜索选项
   * @param options.status 按状态筛选
   * @param options.taskId 按任务筛选
   * @param options.inspectorId 按检查员筛选
   * @param options.blueprintId 按蓝图筛选
   * @param options.page 页码（默认 1）
   * @param options.pageSize 每页数量（默认 50）
   * @returns Observable<QualityCheck[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"问题"的品质检查
   * qualityCheckRepo.search('问题').subscribe(checks => {
   *   console.log('Found checks:', checks);
   * });
   *
   * // 搜索待处理的品质检查
   * qualityCheckRepo.search('问题', { 
   *   status: QualityCheckStatus.PENDING 
   * }).subscribe(checks => {
   *   console.log('Pending checks:', checks);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      status?: string;
      taskId?: string;
      inspectorId?: string;
      blueprintId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<QualityCheck[]> {
    // 构建基础查询 - 搜索备注字段
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .ilike('remarks', `%${query}%`) as any;

    // 应用筛选条件
    if (options?.status) {
      supabaseQuery = supabaseQuery.eq('status', options.status);
    }

    if (options?.taskId) {
      supabaseQuery = supabaseQuery.eq('task_id', options.taskId);
    }

    if (options?.inspectorId) {
      supabaseQuery = supabaseQuery.eq('inspector_id', options.inspectorId);
    }

    if (options?.blueprintId) {
      supabaseQuery = supabaseQuery.eq('blueprint_id', options.blueprintId);
    }

    // 应用分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按检查时间倒序排序
    supabaseQuery = supabaseQuery.order('checked_at', { ascending: false });

    return this.executeQuery(supabaseQuery, `${this.constructor.name}.search`);
  }
}
