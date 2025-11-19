import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';
import { toCamelCaseData } from '../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type ProgressTrackingRow = Database['public']['Tables']['progress_tracking']['Row'];
type ProgressTrackingInsert = Database['public']['Tables']['progress_tracking']['Insert'];
type ProgressTrackingUpdate = Database['public']['Tables']['progress_tracking']['Update'];

/**
 * ProgressTracking 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type ProgressTracking = ProgressTrackingRow;
export type { ProgressTrackingInsert, ProgressTrackingUpdate };

/**
 * ProgressTracking Repository
 *
 * 提供进度追踪相关的数据访问方法
 *
 * @example
 * ```typescript
 * const trackingRepo = inject(ProgressTrackingRepository);
 * trackingRepo.findByBlueprintId('blueprint-id').subscribe(trackings => {
 *   console.log('Progress tracking:', trackings);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingRepository extends BaseRepository<ProgressTracking, ProgressTrackingInsert, ProgressTrackingUpdate> {
  protected tableName = 'progress_tracking';

  /**
   * 根据蓝图 ID 查询进度追踪
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<ProgressTracking[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<ProgressTracking[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      },
      orderBy: 'trackingDate',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据分支 ID 查询进度追踪
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<ProgressTracking[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<ProgressTracking[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      },
      orderBy: 'trackingDate',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据追踪日期查询进度追踪
   *
   * @param trackingDate 追踪日期
   * @param options 查询选项
   * @returns Observable<ProgressTracking[]>
   */
  findByTrackingDate(trackingDate: Date, options?: QueryOptions): Observable<ProgressTracking[]> {
    const dateStr = trackingDate.toISOString().split('T')[0]; // 只取日期部分
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        trackingDate: dateStr // 会自动转换为 tracking_date
      }
    });
  }

  /**
   * 查询最新的进度追踪
   *
   * @param blueprintId 蓝图 ID
   * @param branchId 分支 ID（可选）
   * @returns Observable<ProgressTracking | null>
   */
  findLatestByBlueprintId(blueprintId: string, branchId?: string): Observable<ProgressTracking | null> {
    return this.findAll({
      filters: {
        blueprintId,
        ...(branchId ? { branchId } : {})
      },
      orderBy: 'trackingDate',
      orderDirection: 'desc'
    }).pipe(map(trackings => (trackings.length > 0 ? trackings[0] : null)));
  }

  /**
   * 根据日期范围查询进度追踪
   *
   * @param blueprintId 蓝图 ID
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param branchId 分支 ID（可选）
   * @returns Observable<ProgressTracking[]>
   */
  findByDateRange(blueprintId: string, startDate: Date, endDate: Date, branchId?: string): Observable<ProgressTracking[]> {
    // 需要日期范围查询，使用 Supabase client 直接查询
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .eq('blueprint_id', blueprintId)
      .gte('tracking_date', startDateStr)
      .lte('tracking_date', endDateStr);

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    query = query.order('tracking_date', { ascending: false });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '日期范围查询失败');
        }
        return (response.data || []).map(item => toCamelCaseData<ProgressTracking>(item));
      })
    );
  }
}
