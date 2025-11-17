/**
 * Task Tree Service
 *
 * 任務樹狀結構服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A.3 階層屬性
 *
 * 職責：
 * - 提供任務樹的查詢與操作介面
 * - 處理樹節點的展開/摺疊狀態
 * - 管理樹的選取、篩選、排序
 * - 提供樹狀結構的序列化與反序列化
 * - 任務的移動、複製、刪除等樹操作
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性
 */

import { Injectable, inject } from '@angular/core';
import type { TaskIdentityComplete } from '@models';
import { TaskCommunicationService } from '@tasks/features/task-communication/services/domain/task-communication.service';
import { TaskCostService } from '@tasks/features/task-cost/services/domain/task-cost.service';
import { TaskDocumentService } from '@tasks/features/task-document/services/task-document.service';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';
import { TaskQualityService } from '@tasks/features/task-quality/services/domain/task-quality.service';
import { TaskSafetyService } from '@tasks/features/task-safety/services/domain/task-safety.service';

import { TaskHierarchyService } from '../domain/task-hierarchy.service';

@Injectable({
  providedIn: 'root'
})
export class TaskTreeService {
  private readonly identityService = inject(TaskIdentityService);
  private readonly hierarchyService = inject(TaskHierarchyService);
  private readonly progressService = inject(TaskProgressService);
  private readonly costService = inject(TaskCostService);
  private readonly qualityService = inject(TaskQualityService);
  private readonly safetyService = inject(TaskSafetyService);
  private readonly documentService = inject(TaskDocumentService);
  private readonly communicationService = inject(TaskCommunicationService);

  /**
   * 節點展開狀態映射（taskId -> isExpanded）
   */
  private readonly expandedNodes = new Map<string, boolean>();

  /**
   * 展開節點，載入子任務
   *
   * @param taskId 任務 ID
   * @returns 子任務列表
   */
  async expandNode(taskId: string): Promise<TaskIdentityComplete[]> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 如果沒有子任務，直接返回空陣列
    if (task.childrenCount === 0) {
      this.expandedNodes.set(taskId, true);
      return [];
    }

    // 標記為展開
    this.expandedNodes.set(taskId, true);

    // 載入子任務
    const children = await this.hierarchyService.getChildren(taskId);
    return children;
  }

  /**
   * 收合節點，隱藏子任務
   *
   * @param taskId 任務 ID
   */
  collapseNode(taskId: string): void {
    this.expandedNodes.set(taskId, false);
  }

  /**
   * 切換節點展開/收合狀態
   *
   * @param taskId 任務 ID
   * @returns 展開後的子任務列表（如果展開），否則返回空陣列
   */
  async toggleNode(taskId: string): Promise<TaskIdentityComplete[]> {
    const isExpanded = this.expandedNodes.get(taskId) ?? false;
    if (isExpanded) {
      this.collapseNode(taskId);
      return [];
    } else {
      return await this.expandNode(taskId);
    }
  }

  /**
   * 檢查節點是否展開
   *
   * @param taskId 任務 ID
   * @returns 是否展開
   */
  isNodeExpanded(taskId: string): boolean {
    return this.expandedNodes.get(taskId) ?? false;
  }

  /**
   * 移動任務到新的父任務下
   *
   * @param taskId 任務 ID
   * @param newParentId 新父任務 ID（null 表示移動到根層級）
   * @param userId 用戶 ID（用於更新記錄）
   * @returns 更新後的任務
   */
  async moveTask(taskId: string, newParentId: string | null, userId: string): Promise<TaskIdentityComplete> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 使用 TaskHierarchyService 的 moveTask 方法（它已經處理了循環檢測和層級限制）
    const movedTask = await this.hierarchyService.moveTask(taskId, newParentId);

    // 重新生成編碼（如果移動到不同的父任務下）
    if (task.parentId !== newParentId) {
      // 獲取藍圖 ID
      const blueprintId = await this.getBlueprintId(taskId);

      // 遞迴更新任務及其所有子任務的編碼
      await this.updateTaskCodeRecursive(taskId, newParentId, blueprintId, userId);
    }

    return movedTask;
  }

  /**
   * 遞迴更新任務及其所有子任務的編碼
   *
   * @param taskId 任務 ID
   * @param newParentId 新父任務 ID
   * @param blueprintId 藍圖 ID
   * @param userId 用戶 ID
   */
  private async updateTaskCodeRecursive(taskId: string, newParentId: string | null, blueprintId: string, userId: string): Promise<void> {
    // 生成新編碼
    const newCode = await this.identityService.generateTaskCode(newParentId, blueprintId);

    // 更新當前任務的編碼
    await this.identityService.updateTask(taskId, {
      code: newCode,
      updatedBy: userId
    });

    // 更新階層快取（包含 path 與層級資訊）
    await this.hierarchyService.updateHierarchyCache(taskId);

    // 遞迴更新所有子任務的編碼
    const children = await this.hierarchyService.getChildren(taskId);
    for (const child of children) {
      await this.updateTaskCodeRecursive(child.id, taskId, blueprintId, userId);
    }
  }

  /**
   * 複製任務及其子任務（遞迴複製）
   *
   * @param taskId 任務 ID
   * @param newParentId 新父任務 ID（null 表示複製到根層級）
   * @param userId 用戶 ID
   * @returns 新創建的任務（包含所有子任務）
   */
  async copyTask(taskId: string, newParentId: string | null, userId: string): Promise<TaskIdentityComplete> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 獲取藍圖 ID
    const blueprintId = await this.getBlueprintId(taskId);

    // 遞迴複製任務及其子任務
    return await this.copyTaskRecursive(task, newParentId, blueprintId, userId);
  }

  /**
   * 遞迴複製任務及其子任務
   *
   * @param task 要複製的任務
   * @param newParentId 新父任務 ID
   * @param blueprintId 藍圖 ID
   * @param userId 用戶 ID
   * @returns 新創建的任務
   */
  private async copyTaskRecursive(
    task: TaskIdentityComplete,
    newParentId: string | null,
    blueprintId: string,
    userId: string
  ): Promise<TaskIdentityComplete> {
    // 創建新任務（複製基本資訊）
    const newTask = await this.identityService.createTask(
      {
        name: `${task.name} (複本)`,
        description: task.description,
        notes: task.notes,
        tags: task.tags,
        category: task.category,
        subcategory: task.subcategory,
        workType: task.workType,
        discipline: task.discipline,
        contractorId: task.contractorId,
        subcontractorId: task.subcontractorId,
        clientReference: task.clientReference,
        parentId: newParentId,
        sortOrder: task.sortOrder,
        createdBy: userId,
        updatedBy: userId
      },
      blueprintId
    );

    // 遞迴複製所有子任務
    const children = await this.hierarchyService.getChildren(task.id);
    for (const child of children) {
      await this.copyTaskRecursive(child, newTask.id, blueprintId, userId);
    }

    // 更新階層緩存
    await this.hierarchyService.updateHierarchyCache(newTask.id);

    return newTask;
  }

  /**
   * 刪除任務分支（包含所有子任務）
   *
   * @param taskId 任務 ID
   * @param userId 用戶 ID
   */
  async deleteBranch(taskId: string, userId: string): Promise<void> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 遞迴刪除所有子任務
    await this.deleteBranchRecursive(taskId, userId);

    await this.progressService.removeProgress(taskId);
    await this.costService.removeCost(taskId);
    await this.qualityService.removeQuality(taskId);
    await this.safetyService.removeSafety(taskId);
    await this.documentService.removeDocuments(taskId);
    await this.communicationService.removeCommunications(taskId);

    // 軟刪除當前任務
    await this.identityService.deleteTask(taskId, userId);

    // 更新父任務的 childrenCount
    if (task.parentId) {
      await this.hierarchyService.updateHierarchyCache(task.parentId);
    }

    // 移除展開狀態
    this.expandedNodes.delete(taskId);
  }

  /**
   * 遞迴刪除任務分支
   *
   * @param taskId 任務 ID
   * @param userId 用戶 ID
   */
  private async deleteBranchRecursive(taskId: string, userId: string): Promise<void> {
    // 獲取所有子任務
    const children = await this.hierarchyService.getChildren(taskId);

    // 遞迴刪除每個子任務
    for (const child of children) {
      await this.deleteBranchRecursive(child.id, userId);
      await this.progressService.removeProgress(child.id);
      await this.costService.removeCost(child.id);
      await this.qualityService.removeQuality(child.id);
      await this.safetyService.removeSafety(child.id);
      await this.documentService.removeDocuments(child.id);
      await this.communicationService.removeCommunications(child.id);
      await this.identityService.deleteTask(child.id, userId);
      this.expandedNodes.delete(child.id);
    }
  }

  /**
   * 獲取任務的藍圖 ID
   *
   * @param taskId 任務 ID
   * @returns 藍圖 ID
   */
  private async getBlueprintId(taskId: string): Promise<string> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (!task.blueprintId) {
      throw new Error(`Blueprint ID missing on task: ${taskId}`);
    }

    return task.blueprintId;
  }

  /**
   * 清除所有展開狀態
   */
  clearExpandedNodes(): void {
    this.expandedNodes.clear();
  }

  /**
   * 展開所有節點（遞迴展開）
   *
   * @param rootTaskIds 根任務 ID 列表
   */
  async expandAll(rootTaskIds: string[]): Promise<void> {
    const expandRecursive = async (taskId: string) => {
      const task = await this.identityService.getTaskById(taskId);
      if (!task || task.childrenCount === 0) {
        return;
      }

      await this.expandNode(taskId);
      const children = await this.hierarchyService.getChildren(taskId);

      for (const child of children) {
        await expandRecursive(child.id);
      }
    };

    for (const rootId of rootTaskIds) {
      await expandRecursive(rootId);
    }
  }

  /**
   * 收合所有節點
   */
  collapseAll(): void {
    this.expandedNodes.clear();
  }
}
