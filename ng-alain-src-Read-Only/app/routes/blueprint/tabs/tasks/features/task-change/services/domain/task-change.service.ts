/**
 * Task Change Service
 *
 * 任務變更維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：M. 變更維度
 *
 * 職責：
 * - 管理變更申請與審批流程
 * - 分析變更影響（範圍、時程、成本、品質、資源、風險）
 * - 處理替代方案評估
 * - 追蹤變更實施與驗證狀態
 *
 * @see @ETMS_DESIGN_SPEC.md M. 變更維度
 */

import { Injectable, inject } from '@angular/core';
import type { ChangeRequest, TaskChange, TaskIdentityComplete } from '@models';
import { TaskCostService } from '@tasks/features/task-cost/services/domain/task-cost.service';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskQualityService } from '@tasks/features/task-quality/services/domain/task-quality.service';
import { TaskTimeService } from '@tasks/features/task-time/services/domain/task-time.service';
import { analyzeChangeImpact, convertChangeFromDb, deserializeStoredChange } from '@tasks/shared/domain/change.domain';
import { TaskChangeRepository, CreateTaskChangeInput } from '@tasks/shared/repository/task-change.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskChangeService {
  private readonly timeService = inject(TaskTimeService);
  private readonly costService = inject(TaskCostService);
  private readonly identityService = inject(TaskIdentityService);
  private readonly qualityService = inject(TaskQualityService);
  private readonly repository = inject(TaskChangeRepository);

  /**
   * 創建變更請求
   *
   * @param taskId 任務 ID
   * @param changeRequest 變更請求數據
   * @returns 創建的變更請求
   */
  async createChangeRequest(taskId: string, changeRequest: Omit<ChangeRequest, 'id'>): Promise<ChangeRequest> {
    // 分析變更影響
    const impact = analyzeChangeImpact(changeRequest);

    // 插入到 blueprint_task_changes 表
    const payload: CreateTaskChangeInput = {
      taskId,
      changeNumber: changeRequest.changeNumber,
      type: changeRequest.type,
      title: changeRequest.title,
      description: changeRequest.description,
      impact: impact as unknown as Record<string, unknown>,
      status: changeRequest.status,
      priority: changeRequest.priority,
      submittedDate: changeRequest.initiatedDate ?? new Date(),
      submittedBy: changeRequest.initiator,
      approvedBy: changeRequest.approver ?? undefined,
      approvedDate: changeRequest.approvedDate,
      rejectedReason: changeRequest.rejectionReason,
      implementationDate: changeRequest.implementedDate,
      relatedChanges: changeRequest.relatedDocuments ?? [],
      attachments: []
    };

    const data = await this.repository.createChange(payload);

    // 更新任務的 change_data JSONB 欄位
    await this.repository.mutateChangeData(taskId, changes => {
      changes.push({
        id: data.id,
        ...changeRequest,
        impact
      });
      return changes;
    });

    return convertChangeFromDb(data);
  }

  /**
   * 更新變更請求
   *
   * @param taskId 任務 ID
   * @param changeId 變更 ID
   * @param updates 更新數據
   */
  async updateChangeRequest(taskId: string, changeId: string, updates: Partial<ChangeRequest>): Promise<void> {
    // 如果狀態變為 approved，應用變更到任務
    if (updates.status === 'approved') {
      await this.applyChange(taskId, changeId);
    }

    // 更新 blueprint_task_changes 表
    await this.repository.updateChange({
      changeId,
      taskId,
      patch: {
        changeNumber: updates.changeNumber,
        type: updates.type,
        title: updates.title,
        description: updates.description,
        impact: updates.impact as Record<string, unknown> | undefined,
        status: updates.status,
        priority: updates.priority,
        approvedBy: updates.approver,
        approvedDate: updates.approvedDate,
        rejectedReason: updates.rejectionReason,
        implementationDate: updates.implementedDate,
        implementedBy: updates.implementedBy,
        relatedChanges: updates.relatedDocuments
      }
    });

    // 更新任務的 change_data JSONB 欄位
    await this.repository.mutateChangeData(taskId, changes => {
      const index = changes.findIndex((c: any) => c.id === changeId);
      if (index >= 0) {
        changes[index] = {
          ...changes[index],
          ...updates
        };
      }
      return changes;
    });
  }

  /**
   * 獲取任務的所有變更請求
   *
   * @param taskId 任務 ID
   * @returns 完整的變更資訊
   */
  async getTaskChanges(taskId: string): Promise<TaskChange | null> {
    // 從 blueprint_task_changes 表查詢變更
    const changes = await this.repository.listChanges(taskId);

    if (!changes || changes.length === 0) {
      // 嘗試從 JSONB 欄位獲取
      const changeData = await this.repository.getLegacyChangeData(taskId);

      if (changeData) {
        const management = (changeData['management'] as Record<string, unknown> | undefined) ?? {};
        const storedChanges = (management['changes'] as Array<Record<string, unknown>> | undefined) ?? [];
        return {
          changes: {
            changes: storedChanges.map(c => deserializeStoredChange(c))
          }
        };
      }

      return null;
    }

    return {
      changes: {
        changes: changes.map(c => convertChangeFromDb(c))
      }
    };
  }
  /**
   * 應用變更到任務
   */
  private async applyChange(taskId: string, changeId: string): Promise<void> {
    // 獲取變更請求
    const change = await this.repository.getChangeById(taskId, changeId);

    if (!change) {
      throw new Error('Failed to get change request');
    }

    const changeRequest = convertChangeFromDb(change);
    const impact = changeRequest.impact;

    // 根據變更類型應用變更
    switch (changeRequest.type) {
      case 'schedule':
        // 應用時程變更
        if (impact.schedule && impact.schedule.totalDelayDays !== 0) {
          const plannedTime = await this.timeService.getPlannedTime(taskId);
          if (plannedTime) {
            const newEndDate = new Date(plannedTime.plannedEndDate);
            newEndDate.setDate(newEndDate.getDate() + impact.schedule.totalDelayDays);
            await this.timeService.updatePlannedTime(taskId, {
              ...plannedTime,
              plannedEndDate: newEndDate
            });
          }
        }
        break;

      case 'cost':
        // 應用成本變更
        if (impact.cost && impact.cost.netCost !== 0) {
          await this.costService.addChangeOrder(taskId, {
            changeNumber: changeRequest.changeNumber,
            type: 'budget',
            amount: impact.cost.netCost,
            currency: 'TWD',
            status: 'approved',
            date: new Date(),
            description: changeRequest.description || '',
            reason: changeRequest.reason || '',
            approvedBy: changeRequest.approver || changeRequest.initiator || ''
          });
        }
        break;

      case 'scope':
        // 處理範圍變更，整合 TaskIdentityService 以更新任務範圍
        if (changeRequest.impact?.scope) {
          await this.applyScopeChange(taskId, changeRequest);
        }
        break;

      case 'quality':
        // 處理品質變更，整合 TaskQualityService 以更新品質標準
        if (changeRequest.impact?.quality) {
          await this.applyQualityChange(taskId, changeRequest);
        }
        break;
    }
  }

  /**
   * 更新變更數據（內部方法）
   */
  private async updateChangeData(taskId: string, updater: (changes: any[]) => any[]): Promise<void> {
    await this.repository.mutateChangeData(taskId, updater);
  }

  /**
   * 處理範圍變更，整合 TaskIdentityService 以更新任務範圍
   *
   * @param taskId 任務 ID
   * @param changeRequest 變更請求
   */
  private async applyScopeChange(taskId: string, changeRequest: ChangeRequest): Promise<void> {
    const impact = changeRequest.impact;
    if (!impact?.scope) {
      return;
    }

    const scopeImpact = impact.scope;
    const currentTask = await this.identityService.getTaskById(taskId);
    if (!currentTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const updates: Partial<TaskIdentityComplete> = {};

    // 處理新增項目（added）
    if (scopeImpact.added && scopeImpact.added.length > 0) {
      // 更新任務描述（添加新增項目描述）
      const currentDescription = currentTask.description || '';
      const addedDescription = scopeImpact.added.join('\n');
      updates.description = currentDescription
        ? `${currentDescription}\n\n新增項目：\n${addedDescription}`
        : `新增項目：\n${addedDescription}`;

      // 更新任務標籤（添加 "範圍變更" 標籤）
      const currentTags = currentTask.tags || [];
      if (!currentTags.includes('範圍變更')) {
        updates.tags = [...currentTags, '範圍變更'];
      }
    }

    // 處理移除項目（removed）
    if (scopeImpact.removed && scopeImpact.removed.length > 0) {
      // 更新任務描述（添加移除項目描述）
      const currentDescription = updates.description || currentTask.description || '';
      const removedDescription = scopeImpact.removed.join('\n');
      updates.description = currentDescription
        ? `${currentDescription}\n\n移除項目：\n${removedDescription}`
        : `移除項目：\n${removedDescription}`;

      // 更新任務標籤（添加 "範圍變更" 標籤）
      const currentTags = updates.tags || currentTask.tags || [];
      if (!currentTags.includes('範圍變更')) {
        updates.tags = [...currentTags, '範圍變更'];
      }
    }

    // 處理修改項目（modified）
    if (scopeImpact.modified && scopeImpact.modified.length > 0) {
      // 更新任務描述（添加修改項目描述）
      const currentDescription = updates.description || currentTask.description || '';
      const modifiedDescription = scopeImpact.modified.join('\n');
      updates.description = currentDescription
        ? `${currentDescription}\n\n修改項目：\n${modifiedDescription}`
        : `修改項目：\n${modifiedDescription}`;

      // 更新任務標籤（添加 "範圍變更" 標籤）
      const currentTags = updates.tags || currentTask.tags || [];
      if (!currentTags.includes('範圍變更')) {
        updates.tags = [...currentTags, '範圍變更'];
      }
    }

    // 如果有更新，使用 TaskIdentityService 更新任務
    if (Object.keys(updates).length > 0) {
      try {
        await this.identityService.updateTask(taskId, updates);

        // 記錄變更歷史到 change_data
        await this.updateChangeData(taskId, changes => {
          const index = changes.findIndex((c: any) => c.id === changeRequest.id);
          if (index >= 0) {
            changes[index] = {
              ...changes[index],
              ...changeRequest,
              implementedDate: new Date()
            };
          }
          return changes;
        });
      } catch (error) {
        // 更新失敗時需要回滾變更狀態
        await this.updateChangeRequest(taskId, changeRequest.id, {
          status: 'rejected' as any,
          rejectionReason: `Failed to apply scope change: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        throw error;
      }
    }
  }

  /**
   * 處理品質變更，整合 TaskQualityService 以更新品質標準
   *
   * @param taskId 任務 ID
   * @param changeRequest 變更請求
   */
  private async applyQualityChange(taskId: string, changeRequest: ChangeRequest): Promise<void> {
    const impact = changeRequest.impact;
    if (!impact?.quality) {
      return;
    }

    const qualityDescription = impact.quality;

    // 處理品質標準更新
    // 注意：quality 是 string 類型，不是 QualityImpact 介面
    // 這裡需要根據實際需求調整處理邏輯
    if (qualityDescription) {
      // 獲取當前品質資訊
      const currentQuality = await this.qualityService.getTaskQuality(taskId);

      if (currentQuality?.summary) {
        // 創建新的檢查記錄（品質變更）
        await this.qualityService.recordInspection(taskId, {
          type: 'quality-change',
          date: new Date(),
          inspector: changeRequest.approver || changeRequest.initiator || '',
          result: 'pass',
          score: 100,
          reportNumber: `QC-${changeRequest.changeNumber || Date.now()}`,
          report: `品質標準變更：${qualityDescription}`,
          attachments: []
        });
      }
    }

    // 記錄變更歷史到 change_data
    try {
      await this.updateChangeData(taskId, changes => {
        const index = changes.findIndex((c: any) => c.id === changeRequest.id);
        if (index >= 0) {
          changes[index] = {
            ...changes[index],
            ...changeRequest,
            implementedDate: new Date()
          };
        }
        return changes;
      });
    } catch (error) {
      // 更新失敗時需要回滾變更狀態
      await this.updateChangeRequest(taskId, changeRequest.id, {
        status: 'rejected' as any,
        rejectionReason: `Failed to apply quality change: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }
}
