import { Injectable, inject } from '@angular/core';
import { ActivityLogRepository } from '@core';
import { AuthStateService } from '../auth/auth-state.service';
import { firstValueFrom } from 'rxjs';

/**
 * Blueprint Activity Service
 *
 * 提供藍圖活動記錄服務，用於審計追蹤
 * 所有藍圖相關的操作都應記錄到 activity_logs 表
 *
 * @example
 * ```typescript
 * const activityService = inject(BlueprintActivityService);
 *
 * // 記錄 PR 合併
 * await activityService.logPRMerge(pullRequest);
 *
 * // 記錄任務更新
 * await activityService.logTaskUpdate(taskId, 'status', 'completed');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintActivityService {
  private activityRepo = inject(ActivityLogRepository);
  private authState = inject(AuthStateService);

  /**
   * 記錄通用活動
   *
   * @param params 活動參數
   */
  async logActivity(params: {
    blueprintId: string;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const user = this.authState.currentUser();

    await firstValueFrom(
      this.activityRepo.create({
        blueprint_id: params.blueprintId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        action: params.action,
        actor_id: user?.id,
        metadata: params.metadata,
        created_at: new Date().toISOString()
      } as any)
    );
  }

  /**
   * 記錄 Pull Request 合併
   *
   * @param pr Pull Request 對象
   */
  async logPRMerge(pr: any): Promise<void> {
    return this.logActivity({
      blueprintId: pr.blueprintId || pr.blueprint_id,
      entityType: 'pull_request',
      entityId: pr.id,
      action: 'merged',
      metadata: {
        changes_count: pr.changes?.length || 0,
        branch_id: pr.branchId || pr.branch_id,
        submitted_by: pr.submittedBy || pr.submitted_by
      }
    });
  }

  /**
   * 記錄任務更新
   *
   * @param taskId 任務 ID
   * @param field 更新的欄位
   * @param value 新值
   * @param blueprintId 藍圖 ID
   */
  async logTaskUpdate(taskId: string, field: string, value: any, blueprintId: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'task',
      entityId: taskId,
      action: 'updated',
      metadata: {
        field,
        new_value: value
      }
    });
  }

  /**
   * 記錄分支建立
   *
   * @param branchId 分支 ID
   * @param blueprintId 藍圖 ID
   * @param organizationId 組織 ID
   */
  async logBranchCreate(branchId: string, blueprintId: string, organizationId: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'blueprint_branch',
      entityId: branchId,
      action: 'created',
      metadata: {
        organization_id: organizationId
      }
    });
  }

  /**
   * 記錄分支 Fork
   *
   * @param forkId Fork ID
   * @param blueprintId 藍圖 ID
   * @param sourceBranchId 來源分支 ID
   * @param targetBranchId 目標分支 ID
   */
  async logBranchFork(
    forkId: string,
    blueprintId: string,
    sourceBranchId: string,
    targetBranchId: string
  ): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'branch_fork',
      entityId: forkId,
      action: 'forked',
      metadata: {
        source_branch_id: sourceBranchId,
        target_branch_id: targetBranchId
      }
    });
  }

  /**
   * 記錄藍圖建立
   *
   * @param blueprintId 藍圖 ID
   * @param name 藍圖名稱
   */
  async logBlueprintCreate(blueprintId: string, name: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'blueprint',
      entityId: blueprintId,
      action: 'created',
      metadata: {
        name
      }
    });
  }

  /**
   * 記錄藍圖更新
   *
   * @param blueprintId 藍圖 ID
   * @param changes 變更內容
   */
  async logBlueprintUpdate(blueprintId: string, changes: Record<string, any>): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'blueprint',
      entityId: blueprintId,
      action: 'updated',
      metadata: { changes }
    });
  }

  /**
   * 記錄藍圖刪除
   *
   * @param blueprintId 藍圖 ID
   */
  async logBlueprintDelete(blueprintId: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'blueprint',
      entityId: blueprintId,
      action: 'deleted',
      metadata: {}
    });
  }

  /**
   * 記錄任務建立
   *
   * @param taskId 任務 ID
   * @param blueprintId 藍圖 ID
   * @param taskName 任務名稱
   */
  async logTaskCreate(taskId: string, blueprintId: string, taskName: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'task',
      entityId: taskId,
      action: 'created',
      metadata: {
        name: taskName
      }
    });
  }

  /**
   * 記錄任務刪除
   *
   * @param taskId 任務 ID
   * @param blueprintId 藍圖 ID
   */
  async logTaskDelete(taskId: string, blueprintId: string): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'task',
      entityId: taskId,
      action: 'deleted',
      metadata: {}
    });
  }

  /**
   * 記錄承攬欄位更新（特殊用於 Git-like 模型）
   *
   * @param taskId 任務 ID
   * @param blueprintId 藍圖 ID
   * @param field 欄位路徑
   * @param value 新值
   */
  async logContractorFieldUpdate(
    taskId: string,
    blueprintId: string,
    field: string,
    value: any
  ): Promise<void> {
    return this.logActivity({
      blueprintId,
      entityType: 'task',
      entityId: taskId,
      action: 'contractor_field_updated',
      metadata: {
        field,
        new_value: value
      }
    });
  }
}
