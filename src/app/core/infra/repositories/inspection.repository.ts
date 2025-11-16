import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

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
}
