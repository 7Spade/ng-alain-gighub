import { Injectable, inject, signal } from '@angular/core';
import { ActivityLogRepository, ActivityLog as ActivityLogDb } from '@core';
import { ActivityLog, ActivityLogDetail, ActivityLogFilters, ActivityLogResourceType } from '@shared';
import type { ActivityLogInsert } from '@shared';
import { firstValueFrom } from 'rxjs';

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
  private activityLogRepository = inject(ActivityLogRepository);

  // 使用 Signals 管理狀態
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 將資料庫類型轉換為應用模型類型（camelCase）
   * 注意：返回的對象使用 camelCase 屬性名稱
   */
  private mapToActivityLog(dbLog: ActivityLogDb): {
    id: string;
    blueprintId: string;
    branchId: string | null;
    actorId: string;
    action: string;
    resourceType: string;
    resourceId: string | null;
    actionDetails: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
  } {
    return {
      id: dbLog.id,
      blueprintId: dbLog.blueprint_id,
      branchId: dbLog.branch_id,
      actorId: dbLog.actor_id,
      action: dbLog.action,
      resourceType: dbLog.resource_type,
      resourceId: dbLog.resource_id,
      actionDetails: dbLog.action_details as Record<string, unknown> | null,
      ipAddress: dbLog.ip_address as string | null,
      userAgent: dbLog.user_agent,
      createdAt: dbLog.created_at ?? new Date().toISOString()
    };
  }

  /**
   * 根據 ID 取得活動記錄詳情
   */
  async getActivityLogById(id: string): Promise<ActivityLogDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const dbLog = await firstValueFrom(this.activityLogRepository.findById(id));

      if (!dbLog) {
        return null;
      }

      // 將資料庫類型轉換為應用模型類型
      const activityLog = this.mapToActivityLog(dbLog);

      // 將資料轉換為 ActivityLogDetail 格式
      const activityLogDetail: ActivityLogDetail = {
        id: activityLog.id,
        blueprintId: activityLog.blueprintId,
        branchId: activityLog.branchId,
        actorId: activityLog.actorId,
        action: activityLog.action,
        resourceType: activityLog.resourceType as ActivityLogResourceType,
        resourceId: activityLog.resourceId,
        actionDetails: activityLog.actionDetails,
        ipAddress: activityLog.ipAddress,
        userAgent: activityLog.userAgent,
        createdAt: activityLog.createdAt,
        // TODO: 載入關聯的 actor, blueprint, branch 資料
        actor: undefined,
        blueprint: undefined,
        branch: undefined
      };

      return activityLogDetail;
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
      const options: any = {
        limit,
        filters: {}
      };

      if (filters.blueprintId) {
        options.filters.blueprintId = filters.blueprintId;
      }
      if (filters.branchId !== undefined) {
        options.filters.branchId = filters.branchId;
      }
      if (filters.actorId) {
        options.filters.actorId = filters.actorId;
      }
      if (filters.resourceType) {
        options.filters.resourceType = filters.resourceType;
      }
      if (filters.resourceId) {
        options.filters.resourceId = filters.resourceId;
      }

      const dbLogs = await firstValueFrom(this.activityLogRepository.findAll(options));
      return dbLogs.map(dbLog => this.mapToActivityLog(dbLog));
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
      // 使用 camelCase，BaseRepository 會自動轉換為 snake_case
      const dbInsertData = {
        actorId: data.actorId,
        blueprintId: data.blueprintId,
        branchId: data.branchId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        actionDetails: data.actionDetails,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      } as any; // 類型斷言，因為 BaseRepository 會處理轉換

      const dbLog = await firstValueFrom(this.activityLogRepository.create(dbInsertData));
      return this.mapToActivityLog(dbLog);
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
