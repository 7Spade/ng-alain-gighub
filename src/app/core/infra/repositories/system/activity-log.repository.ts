import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

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
}
