import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '@core';
import { ActivityLog, ActivityLogDetail, ActivityLogInsert, ActivityLogFilters } from '@shared';

/**
 * Analytics Service
 *
 * 提供活動記錄與分析相關的業務邏輯
 * 使用 Signals 管理狀態
 *
 * @example
 * ```typescript
 * const analyticsService = inject(AnalyticsService);
 *
 * // 載入活動記錄詳情
 * await analyticsService.getActivityLogById('log-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private supabase = inject(SupabaseService);

  // 使用 Signals 管理狀態
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根據 ID 取得活動記錄詳情
   */
  async getActivityLogById(id: string): Promise<ActivityLogDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const { data, error } = await this.supabase.client
        .from('activity_logs')
        .select(
          `
          *,
          actor:accounts!activity_logs_actor_id_fkey(id, name, email),
          blueprint:blueprints!activity_logs_blueprint_id_fkey(id, name),
          branch:blueprint_branches!activity_logs_branch_id_fkey(id, name)
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        return null;
      }

      // 將 snake_case 轉換為 camelCase
      const activityLog: ActivityLogDetail = {
        id: data.id,
        blueprintId: data.blueprint_id,
        branchId: data.branch_id,
        actorId: data.actor_id,
        action: data.action,
        resourceType: data.resource_type,
        resourceId: data.resource_id,
        actionDetails: data.action_details,
        ipAddress: data.ip_address,
        userAgent: data.user_agent,
        createdAt: data.created_at,
        actor: data.actor
          ? {
              id: data.actor.id,
              name: data.actor.name,
              email: data.actor.email
            }
          : undefined,
        blueprint: data.blueprint
          ? {
              id: data.blueprint.id,
              name: data.blueprint.name
            }
          : undefined,
        branch: data.branch
          ? {
              id: data.branch.id,
              name: data.branch.name
            }
          : undefined
      };

      return activityLog;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入活動記錄失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 查詢活動記錄列表
   */
  async getActivityLogs(filters: ActivityLogFilters = {}, limit = 50): Promise<ActivityLog[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      let query = this.supabase.client.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);

      if (filters.blueprintId) {
        query = query.eq('blueprint_id', filters.blueprintId);
      }
      if (filters.branchId !== undefined) {
        query = filters.branchId === null ? query.is('branch_id', null) : query.eq('branch_id', filters.branchId);
      }
      if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId);
      }
      if (filters.resourceType) {
        query = query.eq('resource_type', filters.resourceType);
      }
      if (filters.resourceId) {
        query = query.eq('resource_id', filters.resourceId);
      }
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // 將 snake_case 轉換為 camelCase
      const activityLogs: ActivityLog[] = (data || []).map((item: any) => ({
        id: item.id,
        blueprintId: item.blueprint_id,
        branchId: item.branch_id,
        actorId: item.actor_id,
        action: item.action,
        resourceType: item.resource_type,
        resourceId: item.resource_id,
        actionDetails: item.action_details,
        ipAddress: item.ip_address,
        userAgent: item.user_agent,
        createdAt: item.created_at
      }));

      return activityLogs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入活動記錄列表失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 新增活動記錄
   */
  async createActivityLog(data: ActivityLogInsert): Promise<ActivityLog> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const insertData = {
        blueprint_id: data.blueprintId,
        branch_id: data.branchId,
        actor_id: data.actorId,
        action: data.action,
        resource_type: data.resourceType,
        resource_id: data.resourceId,
        action_details: data.actionDetails,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        created_at: data.createdAt || new Date().toISOString()
      };

      const { data: result, error } = await this.supabase.client.from('activity_logs').insert(insertData).select().single();

      if (error) {
        throw error;
      }

      // 將 snake_case 轉換為 camelCase
      const activityLog: ActivityLog = {
        id: result.id,
        blueprintId: result.blueprint_id,
        branchId: result.branch_id,
        actorId: result.actor_id,
        action: result.action,
        resourceType: result.resource_type,
        resourceId: result.resource_id,
        actionDetails: result.action_details,
        ipAddress: result.ip_address,
        userAgent: result.user_agent,
        createdAt: result.created_at
      };

      return activityLog;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '新增活動記錄失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
