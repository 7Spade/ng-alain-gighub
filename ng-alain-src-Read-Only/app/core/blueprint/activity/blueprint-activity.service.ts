/**
 * Blueprint Activity Service
 *
 * 藍圖活動管理服務
 *
 * 職責：
 * - 記錄藍圖的所有活動（創建、更新、刪除、狀態變更等）
 * - 提供活動查詢和篩選功能
 * - 支援活動類型分類和統計
 *
 * @see 表: blueprint_activities (9 個欄位)
 */

import { Injectable, inject } from '@angular/core';
import type {
  BlueprintActivity,
  BlueprintActivityQuery,
  BlueprintActivityStatistics,
  BlueprintActivityType,
  CreateBlueprintActivityInput
} from '@shared';

import { ErrorStateService } from '../../net/error';
import { SupabaseService } from '../../supabase/supabase.service';

interface BlueprintActivityUserRow {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface BlueprintActivityRow {
  id: string;
  blueprint_id: string;
  type: BlueprintActivityType;
  action: string;
  description: string;
  user_id: string;
  user?: BlueprintActivityUserRow | BlueprintActivityUserRow[] | null;
  related_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const DEFAULT_LIMIT = 100;

@Injectable({
  providedIn: 'root'
})
export class BlueprintActivityService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  /**
   * 取得指定藍圖的活動記錄
   */
  async getActivities(
    blueprintId: string,
    query: BlueprintActivityQuery = {}
  ): Promise<{ data: BlueprintActivity[]; error: Error | null }> {
    try {
      const request = this.supabase.client
        .from('blueprint_activities')
        .select(
          `
            id,
            blueprint_id,
            type,
            action,
            description,
            user_id,
            related_id,
            metadata,
            created_at,
            user:users(id, display_name, email, avatar_url)
          `
        )
        .eq('blueprint_id', blueprintId)
        .order('created_at', { ascending: false });

      if (query.types?.length) {
        request.in('type', query.types);
      }

      if (query.userIds?.length) {
        request.in('user_id', query.userIds);
      }

      if (query.since) {
        request.gte('created_at', query.since);
      }

      if (query.until) {
        request.lte('created_at', query.until);
      }

      request.limit(query.limit ?? DEFAULT_LIMIT);

      const { data, error } = await request;

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '載入活動記錄失敗',
          details: error.message || '無法獲取藍圖活動資料',
          source: 'BlueprintActivityService.getActivities',
          retryable: true,
          metadata: { blueprintId, query }
        });
        return { data: [], error };
      }

      let normalized = (data ?? []).map(activity => this.normalizeActivity(activity as BlueprintActivityRow));

      if (query.search) {
        const search = query.search.toLowerCase();
        normalized = normalized.filter(
          item =>
            item.description.toLowerCase().includes(search) ||
            item.action.toLowerCase().includes(search) ||
            (item.user_name ?? '').toLowerCase().includes(search)
        );
      }

      return { data: normalized, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '載入活動記錄失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintActivityService.getActivities',
        retryable: false,
        metadata: { blueprintId, query }
      });
      return { data: [], error: error as Error };
    }
  }

  /**
   * 建立活動記錄
   */
  async createActivity(input: CreateBlueprintActivityInput): Promise<{ data: BlueprintActivity | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_activities')
        .insert({
          blueprint_id: input.blueprintId,
          type: input.type,
          action: input.action,
          description: input.description,
          user_id: input.userId,
          related_id: input.relatedId ?? null,
          metadata: input.metadata ?? null
        })
        .select(
          `
            id,
            blueprint_id,
            type,
            action,
            description,
            user_id,
            related_id,
            metadata,
            created_at,
            user:users(id, display_name, email, avatar_url)
          `
        )
        .single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '新增活動記錄失敗',
          details: error.message || '無法寫入藍圖活動資料',
          source: 'BlueprintActivityService.createActivity',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error };
      }

      // TODO(ETMS_SPEC §0.7): 成功寫入後需串接通知/審計流水線，將活動事件推送至 NotificationService 與稽核紀錄。
      return { data: this.normalizeActivity(data as BlueprintActivityRow), error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '新增活動記錄失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintActivityService.createActivity',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 取得單一活動記錄
   */
  async getActivityById(id: string): Promise<{ data: BlueprintActivity | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_activities')
        .select(
          `
            id,
            blueprint_id,
            type,
            action,
            description,
            user_id,
            related_id,
            metadata,
            created_at,
            user:users(id, display_name, email, avatar_url)
          `
        )
        .eq('id', id)
        .single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取活動記錄失敗',
          details: error.message || '無法獲取活動資料',
          source: 'BlueprintActivityService.getActivityById',
          retryable: true,
          metadata: { id }
        });
        return { data: null, error };
      }

      return { data: this.normalizeActivity(data as BlueprintActivityRow), error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取活動記錄失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'BlueprintActivityService.getActivityById',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 取得特定類型的活動
   */
  async getActivitiesByType(
    blueprintId: string,
    type: BlueprintActivityType,
    query: Omit<BlueprintActivityQuery, 'types'> = {}
  ): Promise<{ data: BlueprintActivity[]; error: Error | null }> {
    return this.getActivities(blueprintId, { ...query, types: [type] });
  }

  /**
   * 依使用者取得活動
   */
  async getActivitiesByUser(
    blueprintId: string,
    userId: string,
    query: Omit<BlueprintActivityQuery, 'userIds'> = {}
  ): Promise<{ data: BlueprintActivity[]; error: Error | null }> {
    return this.getActivities(blueprintId, { ...query, userIds: [userId] });
  }

  /**
   * 依日期區間取得活動
   */
  async getActivitiesByDateRange(
    blueprintId: string,
    startDate: string,
    endDate: string,
    query: Omit<BlueprintActivityQuery, 'since' | 'until'> = {}
  ): Promise<{ data: BlueprintActivity[]; error: Error | null }> {
    return this.getActivities(blueprintId, { ...query, since: startDate, until: endDate });
  }

  /**
   * 取得活動統計資料
   */
  async getActivityStatistics(
    blueprintId: string,
    query: BlueprintActivityQuery = {}
  ): Promise<{ data: BlueprintActivityStatistics; error: Error | null }> {
    const { data, error } = await this.getActivities(blueprintId, {
      ...query,
      limit: query.limit ?? 500
    });

    if (error) {
      return {
        data: {
          total: 0,
          byType: {},
          byUser: {},
          byDate: []
        },
        error
      };
    }

    const byType: Partial<Record<BlueprintActivityType, number>> = {};
    const byUser: Record<string, number> = {};
    const byDateMap = new Map<string, number>();

    for (const activity of data) {
      const currentType = byType[activity.type] ?? 0;
      byType[activity.type] = currentType + 1;

      const userKey = activity.user_id;
      byUser[userKey] = (byUser[userKey] ?? 0) + 1;

      const dateKey = activity.created_at.substring(0, 10);
      byDateMap.set(dateKey, (byDateMap.get(dateKey) ?? 0) + 1);
    }

    const byDate = Array.from(byDateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return {
      data: {
        total: data.length,
        byType,
        byUser,
        byDate
      },
      error: null
    };
  }

  private normalizeActivity(activity: BlueprintActivityRow): BlueprintActivity {
    const user = Array.isArray(activity.user) ? (activity.user[0] ?? null) : (activity.user ?? null);

    return {
      id: activity.id,
      blueprint_id: activity.blueprint_id,
      type: activity.type,
      action: activity.action,
      description: activity.description,
      user_id: activity.user_id,
      user_name: user?.display_name ?? user?.email ?? undefined,
      user_avatar: user?.avatar_url ?? null,
      related_id: activity.related_id,
      metadata: activity.metadata,
      created_at: activity.created_at
    };
  }
}
