import { Injectable, inject, signal, computed } from '@angular/core';
import { ActivityLogRepository, type ActivityLog, type ActivityLogInsert, type Json } from '@core';
import { firstValueFrom } from 'rxjs';

import { type ActivityLogFilters } from '../../models/data.models';
import { AuthStateService } from '../auth';
import { ErrorStateService } from '../common';

/**
 * Activity Change Detail
 * 描述單一欄位的變更
 */
export interface ActivityChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

/**
 * Blueprint Activity Service
 *
 * 提供審計追蹤（Audit Trail）功能，記錄所有對 Blueprint 相關資源的操作
 *
 * 核心功能：
 * 1. 記錄所有操作活動（建立、更新、刪除、合併等）
 * 2. 計算變更差異（old value vs new value）
 * 3. 過濾敏感資料（密碼、Token等）
 * 4. 提供查詢介面（支援多種過濾條件）
 *
 * 設計原則：
 * - 非侵入式：記錄失敗不影響主流程
 * - Signal-based：使用 Angular Signals 管理狀態
 * - 類型安全：完整的 TypeScript 類型定義
 * - 效能優化：批次寫入、索引優化
 *
 * 使用範例：
 * ```typescript
 * const activityService = inject(BlueprintActivityService);
 *
 * // 記錄任務變更
 * await activityService.logTaskChange(task, 'updated', oldTask);
 *
 * // 查詢活動記錄
 * const logs = await activityService.getActivityLogs(blueprintId, { resourceType: 'task' });
 * ```
 *
 * @see docs/IMPLEMENTATION-Blueprint-Tasks-詳細規劃.md Task 1.5
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintActivityService {
  private readonly activityLogRepository = inject(ActivityLogRepository);
  private readonly authState = inject(AuthStateService);
  private readonly errorService = inject(ErrorStateService);

  // Signal 狀態管理
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);
  private readonly logsState = signal<ActivityLog[]>([]);

  // 暴露 ReadonlySignal
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly logs = this.logsState.asReadonly();

  // Computed: 最近的活動記錄（前 10 筆）
  readonly recentLogs = computed(() => this.logs().slice(0, 10));

  // Computed: 活動統計
  readonly activityStats = computed(() => {
    const logs = this.logs();
    return {
      total: logs.length,
      byAction: this.groupByAction(logs),
      byResourceType: this.groupByResourceType(logs),
      byActor: this.groupByActor(logs)
    };
  });

  // 敏感欄位列表（這些欄位的值會被遮蔽）
  private readonly SENSITIVE_FIELDS = [
    'password',
    'token',
    'api_key',
    'apiKey',
    'secret',
    'secretKey',
    'accessToken',
    'refreshToken',
    'privateKey'
  ];

  /**
   * 記錄活動日誌（核心方法）
   *
   * 所有操作都應透過此方法記錄，確保審計追蹤的完整性
   *
   * @param blueprintId 藍圖 ID
   * @param resourceType 資源類型（task, pull_request, issue, document等）
   * @param resourceId 資源 ID
   * @param action 操作類型（created, updated, deleted, merged, forked, assigned等）
   * @param changes 變更內容（欄位級別的差異）
   * @param actionDetails 附加資訊（可選）
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await activityService.logActivity(
   *   'blueprint-123',
   *   'task',
   *   'task-456',
   *   'updated',
   *   [{ field: 'status', oldValue: 'pending', newValue: 'in_progress' }],
   *   { context: 'Task status updated via UI' }
   * );
   * ```
   */
  async logActivity(
    blueprintId: string,
    resourceType: string,
    resourceId: string,
    action: string,
    changes: ActivityChange[],
    actionDetails?: Record<string, unknown>
  ): Promise<void> {
    const currentUser = this.authState.user();

    if (!currentUser) {
      console.warn('[BlueprintActivityService] Cannot log activity: No authenticated user');
      return;
    }

    // 過濾敏感資料
    const sanitizedChanges = this.sanitizeChanges(changes);

    const logEntry: ActivityLogInsert = {
      blueprint_id: blueprintId,
      resource_type: resourceType,
      resource_id: resourceId,
      action,
      actor_id: currentUser.id,
      action_details: JSON.parse(
        JSON.stringify({
          changes: sanitizedChanges,
          ...actionDetails
        })
      ) as unknown as Json
    };

    try {
      await firstValueFrom(this.activityLogRepository.create(logEntry));
    } catch (error) {
      // 記錄失敗不拋出錯誤，避免影響主流程
      console.error('[BlueprintActivityService] Failed to log activity:', error);
      this.errorState.set(error instanceof Error ? error.message : 'Failed to log activity');

      // Also report to ErrorStateService for centralized error tracking
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: 'Failed to log activity',
        details: error,
        context: 'BlueprintActivityService.logActivity'
      });
    }
  }

  /**
   * 記錄任務變更
   *
   * 專門用於記錄任務相關的操作（建立、更新、刪除）
   * 自動計算新舊版本的差異
   *
   * @param task 任務物件（新版本）
   * @param action 操作類型
   * @param oldTask 任務物件（舊版本，用於計算差異）
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await activityService.logTaskChange(updatedTask, 'updated', originalTask);
   * ```
   */
  async logTaskChange(
    task: { id: string; blueprintId: string; name: string; [key: string]: unknown },
    action: 'created' | 'updated' | 'deleted',
    oldTask?: Record<string, unknown>
  ): Promise<void> {
    const changes = oldTask ? this.computeChanges(oldTask, task) : [];

    await this.logActivity(task.blueprintId, 'task', task.id, action, changes, {
      context: `Task ${action}: ${task.name}`
    });
  }

  /**
   * 記錄 Pull Request 合併
   *
   * 記錄 PR 合併操作，包含變更內容和合併者資訊
   *
   * @param pr Pull Request 物件
   * @param mergedBy 合併者 ID
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await activityService.logPRMerge(pullRequest, userId);
   * ```
   */
  async logPRMerge(pr: { id: string; targetBranchId: string; title: string; changes: ActivityChange[] }, mergedBy: string): Promise<void> {
    await this.logActivity(pr.targetBranchId, 'pull_request', pr.id, 'merged', pr.changes, {
      context: `PR merged: ${pr.title}`,
      mergedBy
    });
  }

  /**
   * 記錄 Issue 變更
   *
   * @param issue Issue 物件
   * @param action 操作類型
   * @param oldIssue Issue 物件（舊版本）
   * @returns Promise<void>
   */
  async logIssueChange(
    issue: { id: string; blueprintId: string; title: string; [key: string]: unknown },
    action: 'created' | 'updated' | 'deleted' | 'assigned' | 'resolved',
    oldIssue?: Record<string, unknown>
  ): Promise<void> {
    const changes = oldIssue ? this.computeChanges(oldIssue, issue) : [];

    await this.logActivity(issue.blueprintId, 'issue', issue.id, action, changes, {
      context: `Issue ${action}: ${issue.title}`
    });
  }

  /**
   * 記錄 contractor_fields 更新
   *
   * 專門用於記錄承攬欄位的更新（PR 合併時的核心操作）
   * 這是 v2.0 IMPLEMENTATION 文件中 Task 1.3 的關鍵功能
   *
   * @param taskId 任務 ID
   * @param blueprintId 藍圖 ID
   * @param field 欄位路徑（如 "contractor_fields.work_hours"）
   * @param oldValue 舊值
   * @param newValue 新值
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await activityService.logContractorFieldsUpdate(
   *   'task-123',
   *   'blueprint-456',
   *   'contractor_fields.work_hours',
   *   8,
   *   10
   * );
   * ```
   */
  async logContractorFieldsUpdate(taskId: string, blueprintId: string, field: string, oldValue: unknown, newValue: unknown): Promise<void> {
    await this.logActivity(blueprintId, 'task', taskId, 'contractor_fields_updated', [{ field, oldValue, newValue }], {
      context: 'Contractor fields updated via PR merge'
    });
  }

  /**
   * 查詢活動記錄
   *
   * 支援多種過濾條件，返回符合條件的活動記錄列表
   * 結果按時間倒序排列（最新的在前）
   *
   * @param blueprintId 藍圖 ID
   * @param filters 過濾條件（可選）
   * @returns Promise<ActivityLog[]>
   *
   * @example
   * ```typescript
   * // 查詢特定資源的活動記錄
   * const taskLogs = await activityService.getActivityLogs('blueprint-123', {
   *   resourceType: 'task',
   *   resourceId: 'task-456'
   * });
   *
   * // 查詢特定使用者的活動記錄
   * const userLogs = await activityService.getActivityLogs('blueprint-123', {
   *   actorId: 'user-789'
   * });
   *
   * // 查詢特定時間範圍的活動記錄
   * const recentLogs = await activityService.getActivityLogs('blueprint-123', {
   *   startDate: '2024-01-01T00:00:00Z',
   *   endDate: '2024-01-31T23:59:59Z'
   * });
   * ```
   */
  async getActivityLogs(blueprintId: string, filters?: ActivityLogFilters): Promise<ActivityLog[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const logs = await firstValueFrom(
        this.activityLogRepository.findByBlueprintId(blueprintId, {
          // TODO: 實現更細緻的過濾邏輯
          // 目前 BaseRepository 的 findAll 方法支援基本過濾
          // 未來可以擴展 ActivityLogRepository 增加更多查詢方法
        })
      );

      // 前端過濾（臨時方案，未來應該在 Repository 層實現）
      let filteredLogs = logs;

      if (filters?.resourceType) {
        filteredLogs = filteredLogs.filter(log => log.resource_type === filters.resourceType);
      }

      if (filters?.resourceId) {
        filteredLogs = filteredLogs.filter(log => log.resource_id === filters.resourceId);
      }

      if (filters?.actorId) {
        filteredLogs = filteredLogs.filter(log => log.actor_id === filters.actorId);
      }

      if (filters?.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }

      if (filters?.startDate) {
        const startDate = new Date(filters.startDate);
        filteredLogs = filteredLogs.filter(log => new Date(log.created_at!) >= startDate);
      }

      if (filters?.endDate) {
        const endDate = new Date(filters.endDate);
        filteredLogs = filteredLogs.filter(log => new Date(log.created_at!) <= endDate);
      }

      this.logsState.set(filteredLogs);
      return filteredLogs;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : 'Failed to fetch activity logs');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批次記錄活動日誌
   *
   * 用於一次性記錄多個活動，提高效能
   *
   * @param logs 活動日誌列表
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await activityService.logBatchActivities([
   *   { blueprintId: 'bp-1', resourceType: 'task', resourceId: 't-1', action: 'created', changes: [] },
   *   { blueprintId: 'bp-1', resourceType: 'task', resourceId: 't-2', action: 'created', changes: [] }
   * ]);
   * ```
   */
  async logBatchActivities(
    logs: Array<{
      blueprintId: string;
      resourceType: string;
      resourceId: string;
      action: string;
      changes: ActivityChange[];
      actionDetails?: Record<string, unknown>;
    }>
  ): Promise<void> {
    const currentUser = this.authState.user();

    if (!currentUser) {
      console.warn('[BlueprintActivityService] Cannot log batch activities: No authenticated user');
      return;
    }

    const logEntries: ActivityLogInsert[] = logs.map(log => {
      const sanitizedChanges = this.sanitizeChanges(log.changes);

      return {
        blueprint_id: log.blueprintId,
        resource_type: log.resourceType,
        resource_id: log.resourceId,
        action: log.action,
        actor_id: currentUser.id,
        action_details: JSON.parse(
          JSON.stringify({
            changes: sanitizedChanges,
            ...log.actionDetails
          })
        ) as unknown as Json
      };
    });

    try {
      // Create all logs in parallel
      await Promise.all(logEntries.map(entry => firstValueFrom(this.activityLogRepository.create(entry))));

      console.log(`[BlueprintActivityService] Logged ${logEntries.length} activities in batch`);
    } catch (error) {
      console.error('[BlueprintActivityService] Failed to log batch activities:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: 'Failed to log batch activities',
        details: error,
        context: 'BlueprintActivityService.logBatchActivities'
      });
    }
  }

  /**
   * 查詢特定日期範圍的活動記錄
   *
   * @param blueprintId 藍圖 ID
   * @param startDate 開始日期 (ISO 8601)
   * @param endDate 結束日期 (ISO 8601)
   * @returns Promise<ActivityLog[]>
   *
   * @example
   * ```typescript
   * const logs = await activityService.getActivitiesByDateRange(
   *   'blueprint-123',
   *   new Date('2024-01-01'),
   *   new Date('2024-01-31')
   * );
   * ```
   */
  async getActivitiesByDateRange(blueprintId: string, startDate: Date, endDate: Date): Promise<ActivityLog[]> {
    return this.getActivityLogs(blueprintId, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    } as ActivityLogFilters);
  }

  /**
   * 匯出活動記錄
   *
   * 將活動記錄匯出為 JSON 或 CSV 格式
   *
   * @param blueprintId 藍圖 ID
   * @param format 匯出格式
   * @param filters 過濾條件（可選）
   * @returns Promise<Blob>
   *
   * @example
   * ```typescript
   * const blob = await activityService.exportActivities('blueprint-123', 'csv');
   * const url = URL.createObjectURL(blob);
   * const a = document.createElement('a');
   * a.href = url;
   * a.download = 'activity-logs.csv';
   * a.click();
   * ```
   */
  /**
   * 導出活動記錄
   *
   * 支援導出為 JSON 或 CSV 格式
   *
   * @param blueprintId 藍圖 ID
   * @param format 導出格式（'json' 或 'csv'）
   * @param filters 篩選條件（選填）
   * @returns Promise<Blob> 檔案 Blob
   *
   * @example
   * ```typescript
   * const blob = await service.exportActivities('blueprint-123', 'csv');
   * const url = URL.createObjectURL(blob);
   * const a = document.createElement('a');
   * a.href = url;
   * a.download = 'activities.csv';
   * a.click();
   * ```
   */
  async exportActivities(blueprintId: string, format: 'json' | 'csv', filters?: ActivityLogFilters): Promise<Blob> {
    this.loadingState.set(true);

    try {
      const logs = await this.getActivityLogs(blueprintId, filters);

      if (format === 'json') {
        const json = JSON.stringify(logs, null, 2);
        return new Blob([json], { type: 'application/json' });
      } else {
        // CSV format
        const csv = this.convertToCsv(logs);
        return new Blob([csv], { type: 'text/csv' });
      }
    } catch (error) {
      console.error('[BlueprintActivityService] Failed to export activities:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: 'Failed to export activities',
        details: error,
        context: 'BlueprintActivityService.exportActivities'
      });
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 取得資源活動記錄
   *
   * 快捷方法，用於查詢特定資源的所有活動記錄
   *
   * @param blueprintId 藍圖 ID
   * @param resourceType 資源類型
   * @param resourceId 資源 ID
   * @returns Promise<ActivityLog[]>
   */
  async getResourceActivityLogs(blueprintId: string, resourceType: string, resourceId: string): Promise<ActivityLog[]> {
    return this.getActivityLogs(blueprintId, { resourceType: resourceType as unknown, resourceId } as ActivityLogFilters);
  }

  /**
   * 計算變更差異
   *
   * 比較新舊物件，返回有差異的欄位列表
   *
   * @param oldObj 舊物件
   * @param newObj 新物件
   * @returns ActivityChange[]
   *
   * @private
   */
  private computeChanges(oldObj: Record<string, unknown>, newObj: Record<string, unknown>): ActivityChange[] {
    if (!oldObj) return [];

    const changes: ActivityChange[] = [];
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    for (const key of allKeys) {
      // 跳過內部欄位
      if (key.startsWith('_') || key === 'updatedAt' || key === 'createdAt') {
        continue;
      }

      const oldValue = oldObj[key];
      const newValue = newObj[key];

      // 使用 JSON 序列化比較（處理物件和陣列）
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key,
          oldValue,
          newValue
        });
      }
    }

    return changes;
  }

  /**
   * 過濾敏感資料
   *
   * 將敏感欄位的值替換為 "***REDACTED***"
   *
   * @param changes 變更列表
   * @returns ActivityChange[] 過濾後的變更列表
   *
   * @private
   */
  private sanitizeChanges(changes: ActivityChange[]): ActivityChange[] {
    return changes.map(change => {
      const fieldLower = change.field.toLowerCase();
      const isSensitive = this.SENSITIVE_FIELDS.some(sensitiveField => fieldLower.includes(sensitiveField.toLowerCase()));

      if (isSensitive) {
        return {
          ...change,
          oldValue: '***REDACTED***',
          newValue: '***REDACTED***'
        };
      }

      return change;
    });
  }

  /**
   * 清除狀態
   *
   * 清除所有 Signal 狀態，用於組件銷毀或重置
   */
  clear(): void {
    this.loadingState.set(false);
    this.errorState.set(null);
    this.logsState.set([]);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * 統計活動按動作分組
   *
   * @private
   */
  private groupByAction(logs: ActivityLog[]): Record<string, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * 統計活動按資源類型分組
   *
   * @private
   */
  private groupByResourceType(logs: ActivityLog[]): Record<string, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.resource_type] = (acc[log.resource_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * 統計活動按操作者分組
   *
   * @private
   */
  private groupByActor(logs: ActivityLog[]): Record<string, number> {
    return logs.reduce(
      (acc, log) => {
        acc[log.actor_id] = (acc[log.actor_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }

  /**
   * 轉換為 CSV 格式
   *
   * @private
   */
  private convertToCsv(logs: ActivityLog[]): string {
    if (logs.length === 0) {
      return 'No data';
    }

    // CSV headers
    const headers = ['ID', 'Blueprint ID', 'Resource Type', 'Resource ID', 'Action', 'Actor ID', 'Created At'];
    const rows = logs.map(log => [
      log.id,
      log.blueprint_id,
      log.resource_type,
      log.resource_id || '',
      log.action,
      log.actor_id,
      log.created_at || ''
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    return csvContent;
  }
}
