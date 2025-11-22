import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

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

  /**
   * 搜索施工日志（按內容和摘要）
   *
   * 使用全文搜索功能在施工日志的內容和摘要中查找匹配的關鍵字
   *
   * @param query 搜索關鍵字
   * @param options 搜索選項
   * @param options.blueprintId 按藍圖篩選
   * @param options.branchId 按分支篩選
   * @param options.taskId 按任務篩選
   * @param options.reportedBy 按報告者篩選
   * @param options.page 頁碼（默認 1）
   * @param options.pageSize 每頁數量（默認 50）
   * @returns Observable<DailyReport[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"進度"的施工日志
   * dailyReportRepo.search('進度').subscribe(reports => {
   *   console.log('Found reports:', reports);
   * });
   *
   * // 搜索特定任務的施工日志
   * dailyReportRepo.search('進度', { 
   *   taskId: 'task-id' 
   * }).subscribe(reports => {
   *   console.log('Task reports:', reports);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      blueprintId?: string;
      branchId?: string;
      taskId?: string;
      reportedBy?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<DailyReport[]> {
    // 構建基礎查詢
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or(`content.ilike.%${query}%,summary.ilike.%${query}%`) as any;

    // 應用篩選條件
    if (options?.blueprintId) {
      supabaseQuery = supabaseQuery.eq('blueprint_id', options.blueprintId);
    }

    if (options?.branchId) {
      supabaseQuery = supabaseQuery.eq('branch_id', options.branchId);
    }

    if (options?.taskId) {
      supabaseQuery = supabaseQuery.eq('task_id', options.taskId);
    }

    if (options?.reportedBy) {
      supabaseQuery = supabaseQuery.eq('reported_by', options.reportedBy);
    }

    // 應用分頁
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按報告日期倒序排序
    supabaseQuery = supabaseQuery.order('report_date', { ascending: false });

    return this.executeQuery(supabaseQuery, `${this.constructor.name}.search`);
  }
}
