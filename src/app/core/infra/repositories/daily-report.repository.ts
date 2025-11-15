import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * DailyReport 实体类型（camelCase）
 */
type DailyReportRow = Database['public']['Tables']['daily_reports']['Row'];
type DailyReportInsert = Database['public']['Tables']['daily_reports']['Insert'];
type DailyReportUpdate = Database['public']['Tables']['daily_reports']['Update'];

export type DailyReport = DailyReportRow;
export type { DailyReportInsert, DailyReportUpdate };

/**
 * DailyReport Repository
 *
 * 提供施工日志相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class DailyReportRepository extends BaseRepository<DailyReport, DailyReportInsert, DailyReportUpdate> {
  protected tableName = 'daily_reports';

  /**
   * 根据任务 ID 查询施工日志
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<DailyReport[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<DailyReport[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      },
      orderBy: 'report_date',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据蓝图 ID 查询施工日志
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<DailyReport[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<DailyReport[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      },
      orderBy: 'report_date',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据分支 ID 查询施工日志
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<DailyReport[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<DailyReport[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      },
      orderBy: 'report_date',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据报告日期查询施工日志
   *
   * @param reportDate 报告日期
   * @param options 查询选项
   * @returns Observable<DailyReport[]>
   */
  findByReportDate(reportDate: string, options?: QueryOptions): Observable<DailyReport[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        reportDate // 会自动转换为 report_date
      }
    });
  }

  /**
   * 根据报告者 ID 查询施工日志
   *
   * @param reportedBy 报告者 ID
   * @param options 查询选项
   * @returns Observable<DailyReport[]>
   */
  findByReportedBy(reportedBy: string, options?: QueryOptions): Observable<DailyReport[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        reportedBy // 会自动转换为 reported_by
      },
      orderBy: 'report_date',
      orderDirection: 'desc'
    });
  }
}

