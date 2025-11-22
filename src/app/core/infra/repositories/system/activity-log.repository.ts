import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * ActivityLog 實體類型（camelCase）
 * 注意：BaseRepository 會自動進行 snake_case → camelCase 轉換
 */
type ActivityLogRow = Database['public']['Tables']['activity_logs']['Row'];
type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

export type ActivityLog = ActivityLogRow;
export type { ActivityLogInsert };

/**
 * ActivityLog Repository
 *
 * 提供活動記錄相關的資料存取方法
 */
@Injectable({
  providedIn: 'root'
})
export class ActivityLogRepository extends BaseRepository<ActivityLog, ActivityLogInsert, never> {
  protected tableName = 'activity_logs';

  /**
   * 根據藍圖 ID 查詢活動記錄
   *
   * @param blueprintId 藍圖 ID
   * @param options 查詢選項
   * @returns Observable<ActivityLog[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<ActivityLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 會自動轉換為 blueprint_id
      },
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根據操作者 ID 查詢活動記錄
   *
   * @param actorId 操作者 ID
   * @param options 查詢選項
   * @returns Observable<ActivityLog[]>
   */
  findByActorId(actorId: string, options?: QueryOptions): Observable<ActivityLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        actorId // 會自動轉換為 actor_id
      },
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 根據資源類型和 ID 查詢活動記錄
   *
   * @param resourceType 資源類型
   * @param resourceId 資源 ID
   * @param options 查詢選項
   * @returns Observable<ActivityLog[]>
   */
  findByResource(resourceType: string, resourceId: string, options?: QueryOptions): Observable<ActivityLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        resourceType, // 會自動轉換為 resource_type
        resourceId // 會自動轉換為 resource_id
      },
      orderBy: 'created_at',
      orderDirection: 'desc'
    });
  }

  /**
   * 搜索活動記錄（按描述和元數據）
   *
   * 使用全文搜索功能在活動記錄的描述中查找匹配的關鍵字
   *
   * @param query 搜索關鍵字
   * @param options 搜索選項
   * @param options.blueprintId 按藍圖篩選
   * @param options.actorId 按操作者篩選
   * @param options.resourceType 按資源類型篩選
   * @param options.actionType 按操作類型篩選
   * @param options.page 頁碼（默認 1）
   * @param options.pageSize 每頁數量（默認 50）
   * @returns Observable<ActivityLog[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"創建"的活動記錄
   * activityLogRepo.search('創建').subscribe(logs => {
   *   console.log('Found logs:', logs);
   * });
   *
   * // 搜索特定用戶的活動
   * activityLogRepo.search('創建', {
   *   actorId: 'user-id'
   * }).subscribe(logs => {
   *   console.log('User activities:', logs);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      blueprintId?: string;
      actorId?: string;
      resourceType?: string;
      actionType?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<ActivityLog[]> {
    // 構建基礎查詢
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .ilike('description', `%${query}%`) as any;

    // 應用篩選條件
    if (options?.blueprintId) {
      supabaseQuery = supabaseQuery.eq('blueprint_id', options.blueprintId);
    }

    if (options?.actorId) {
      supabaseQuery = supabaseQuery.eq('actor_id', options.actorId);
    }

    if (options?.resourceType) {
      supabaseQuery = supabaseQuery.eq('resource_type', options.resourceType);
    }

    if (options?.actionType) {
      supabaseQuery = supabaseQuery.eq('action_type', options.actionType);
    }

    // 應用分頁
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按創建時間倒序排序
    supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

    return from(Promise.resolve(supabaseQuery) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<ActivityLog>(item)) : [toCamelCaseData<ActivityLog>(data)];
      })
    );
  }
}
