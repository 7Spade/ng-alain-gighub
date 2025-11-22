import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
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
   * 搜索验收记录（按备注和结果）
   *
   * 使用全文搜索功能在验收记录的备注和结果中查找匹配的关键字
   *
   * @param query 搜索关键字
   * @param options 搜索选项
   * @param options.status 按状态筛选
   * @param options.inspectionType 按检查类型筛选
   * @param options.taskId 按任务筛选
   * @param options.inspectorId 按检查员筛选
   * @param options.page 页码（默认 1）
   * @param options.pageSize 每页数量（默认 50）
   * @returns Observable<Inspection[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"合格"的验收记录
   * inspectionRepo.search('合格').subscribe(inspections => {
   *   console.log('Found inspections:', inspections);
   * });
   *
   * // 搜索已通过的验收记录
   * inspectionRepo.search('合格', {
   *   status: InspectionStatus.PASSED
   * }).subscribe(inspections => {
   *   console.log('Passed inspections:', inspections);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      status?: string;
      inspectionType?: string;
      taskId?: string;
      inspectorId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<Inspection[]> {
    // 构建基础查询 - 搜索备注和结果字段
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or(`remarks.ilike.%${query}%,result.ilike.%${query}%`) as any;

    // 应用筛选条件
    if (options?.status) {
      supabaseQuery = supabaseQuery.eq('status', options.status);
    }

    if (options?.inspectionType) {
      supabaseQuery = supabaseQuery.eq('inspection_type', options.inspectionType);
    }

    if (options?.taskId) {
      supabaseQuery = supabaseQuery.eq('task_id', options.taskId);
    }

    if (options?.inspectorId) {
      supabaseQuery = supabaseQuery.eq('inspector_id', options.inspectorId);
    }

    // 应用分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按检查时间倒序排序
    supabaseQuery = supabaseQuery.order('inspected_at', { ascending: false });

    return from(Promise.resolve(supabaseQuery) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<Inspection>(item)) : [toCamelCaseData<Inspection>(data)];
      })
    );
  }
}
