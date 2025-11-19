/**
 * Task Hierarchy Service
 *
 * 任務階層結構管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A.3 階層屬性
 *
 * 職責：
 * - 管理任務的父子關係與階層結構
 * - 維護任務路徑、層級、排序等屬性
 * - 提供樹狀結構的查詢與操作（祖先、後代、兄弟節點）
 * - 處理任務移動、重組等階層變更操作
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性
 */

import { Injectable, inject } from '@angular/core';
import type { TaskIdentityComplete } from '@models';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskIdentityRepository } from '@tasks/shared/repository/task-identity.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskHierarchyService {
  private readonly identityService = inject(TaskIdentityService);
  private readonly repository = inject(TaskIdentityRepository);

  /**
   * 更新任務的階層緩存屬性
   *
   * @param taskId 任務 ID
   * @returns 更新後的階層屬性
   */
  async updateHierarchyCache(taskId: string): Promise<TaskIdentityComplete> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const updates: Partial<TaskIdentityComplete> = {};

    // 計算 level（根據 parentId）
    if (task.parentId) {
      const parent = await this.identityService.getTaskById(task.parentId);
      if (!parent) {
        throw new Error(`Parent task not found: ${task.parentId}`);
      }
      updates.level = Math.min(parent.level + 1, 6); // 最多 6 層
    } else {
      updates.level = 1; // 根節點
    }

    // 計算 path（父路徑 + '/' + 當前 code）
    if (task.parentId) {
      const parent = await this.identityService.getTaskById(task.parentId);
      if (parent) {
        updates.path = parent.path ? `${parent.path}/${task.code}` : task.code;
      } else {
        updates.path = task.code;
      }
    } else {
      updates.path = task.code;
    }

    // 計算 childrenCount（直接子任務數量）
    updates.childrenCount = await this.repository.countChildren(taskId);

    // 更新 isLeaf
    updates.isLeaf = updates.childrenCount === 0;
    updates.isExpandable = !updates.isLeaf;

    // 更新任務
    return await this.identityService.updateTask(taskId, updates);
  }

  /**
   * 獲取任務的所有祖先（父任務、祖父任務等）
   *
   * @param taskId 任務 ID
   * @returns 祖先任務列表（從根到當前）
   */
  async getAncestors(taskId: string): Promise<TaskIdentityComplete[]> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      return [];
    }

    const ancestors: TaskIdentityComplete[] = [];
    let currentParentId = task.parentId;

    while (currentParentId) {
      const parent = await this.identityService.getTaskById(currentParentId);
      if (!parent) {
        break;
      }
      ancestors.unshift(parent);
      currentParentId = parent.parentId;
    }

    return ancestors;
  }

  /**
   * 獲取任務的所有後代（子任務、孫任務等）
   *
   * @param taskId 任務 ID
   * @returns 後代任務列表（從子到孫）
   */
  async getDescendants(taskId: string): Promise<TaskIdentityComplete[]> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      return [];
    }

    return await this.getDescendantsRecursive(taskId);
  }

  /**
   * 遞迴查詢所有後代任務
   */
  private async getDescendantsRecursive(taskId: string): Promise<TaskIdentityComplete[]> {
    const descendants: TaskIdentityComplete[] = [];
    const visited = new Set<string>();

    const collectDescendants = async (currentId: string) => {
      if (visited.has(currentId)) {
        return;
      }
      visited.add(currentId);

      const children = await this.repository.findChildren(currentId);

      for (const child of children) {
        const childTask = this.identityService.convertFromDb(child);
        descendants.push(childTask);
        await collectDescendants(childTask.id);
      }
    };

    await collectDescendants(taskId);
    return descendants.sort((a, b) => a.level - b.level);
  }

  /**
   * 獲取任務的直接子任務
   *
   * @param taskId 任務 ID
   * @returns 子任務列表
   */
  async getChildren(taskId: string): Promise<TaskIdentityComplete[]> {
    const children = await this.repository.findChildren(taskId);
    return children.map(t => this.identityService.convertFromDb(t));
  }

  /**
   * 獲取任務的同層兄弟節點
   *
   * @param taskId 任務 ID
   * @returns 兄弟任務列表
   */
  async getSiblings(taskId: string): Promise<TaskIdentityComplete[]> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      return [];
    }

    // 直接查詢同層兄弟節點
    if (task.parentId) {
      const siblings = await this.repository.findChildren(task.parentId);
      return siblings.filter(s => s.id !== taskId).map(s => this.identityService.convertFromDb(s));
    } else {
      const roots = await this.repository.findChildren(null);
      return roots.filter(s => s.id !== taskId).map(s => this.identityService.convertFromDb(s));
    }
  }

  /**
   * 移動任務到新的父任務下（改變父子關係）
   *
   * @param taskId 任務 ID
   * @param newParentId 新父任務 ID（null 表示移動到根層級）
   * @returns 更新後的任務
   */
  async moveTask(taskId: string, newParentId: string | null): Promise<TaskIdentityComplete> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 驗證目標父任務存在（如果不是 null）
    if (newParentId) {
      const newParent = await this.identityService.getTaskById(newParentId);
      if (!newParent) {
        throw new Error(`Target parent task not found: ${newParentId}`);
      }

      // 檢查是否會造成循環依賴（新父任務不能是當前任務的後代）
      const newParentDescendants = await this.getDescendantsRecursive(newParentId);
      if (newParentDescendants.some(d => d.id === taskId)) {
        throw new Error(`Cannot move task to its descendant: circular dependency detected`);
      }

      // 檢查層級是否超過 6 層限制
      if (newParent.level >= 6) {
        throw new Error(`Cannot move task: maximum level (6) would be exceeded`);
      }
    }

    // 更新 parentId
    const updatedTask = await this.identityService.updateTask(taskId, {
      parentId: newParentId
    });

    // 觸發階層緩存更新
    await this.updateHierarchyCache(taskId);

    // 更新原父任務的 childrenCount
    if (task.parentId) {
      await this.updateHierarchyCache(task.parentId);
    }

    // 更新新父任務的 childrenCount
    if (newParentId) {
      await this.updateHierarchyCache(newParentId);
    }

    // 遞迴更新所有後代的層級與路徑
    const descendants = await this.getDescendantsRecursive(taskId);
    for (const descendant of descendants) {
      await this.updateHierarchyCache(descendant.id);
    }

    return updatedTask;
  }

  /**
   * 更新任務在同層的排序順序
   *
   * @param taskId 任務 ID
   * @param sortOrder 新的排序順序
   * @returns 更新後的任務
   */
  async updateSortOrder(taskId: string, sortOrder: number): Promise<TaskIdentityComplete> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    // 更新 sortOrder
    const updatedTask = await this.identityService.updateTask(taskId, {
      sortOrder
    });

    await this.updateHierarchyCache(taskId);

    return updatedTask;
  }

  /**
   * 檢查指定任務是否為當前任務的祖先
   *
   * @param taskId 當前任務 ID
   * @param ancestorId 祖先任務 ID
   * @returns 是否為祖先
   */
  async isAncestor(taskId: string, ancestorId: string): Promise<boolean> {
    let current = await this.identityService.getTaskById(taskId);
    while (current?.parentId) {
      if (current.parentId === ancestorId) {
        return true;
      }
      current = await this.identityService.getTaskById(current.parentId);
    }
    return false;
  }

  /**
   * 檢查指定任務是否為當前任務的後代
   *
   * @param taskId 當前任務 ID
   * @param descendantId 後代任務 ID
   * @returns 是否為後代
   */
  async isDescendant(taskId: string, descendantId: string): Promise<boolean> {
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      return false;
    }

    // 遞迴檢查
    const descendants = await this.getDescendantsRecursive(taskId);
    return descendants.some(d => d.id === descendantId);
  }

  /**
   * 獲取任務的完整路徑名稱（如 '專案 > 階段一 > 任務A > 子任務B'）
   *
   * @param taskId 任務 ID
   * @returns 完整路徑字串
   */
  async getFullPathName(taskId: string): Promise<string> {
    const ancestors = await this.getAncestors(taskId);
    const task = await this.identityService.getTaskById(taskId);

    if (!task) {
      return '';
    }

    const pathParts = [...ancestors.map(a => a.name), task.name];

    return pathParts.join(' > ');
  }
}
