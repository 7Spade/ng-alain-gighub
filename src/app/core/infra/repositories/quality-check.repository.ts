import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

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
}
