/**
 * Task Identity Service
 *
 * 任務本體屬性管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A. 任務本體屬性
 *
 * 職責：
 * - 管理任務的識別屬性（ID、編碼、版本控制）
 * - 管理任務的描述屬性（名稱、說明、標籤、分類）
 * - 處理任務的創建、更新、軟刪除等基本操作
 * - 提供任務唯一性驗證與編碼生成邏輯
 *
 * @see @ETMS_DESIGN_SPEC.md A. 任務本體屬性
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import type { TaskIdentityComplete } from '@models';
import { TaskIdentityRepository, type TaskIdentityDbRecord } from '@tasks/shared/repository/task-identity.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskIdentityService {
  private readonly repository = inject(TaskIdentityRepository);
  private readonly userService = inject(UserService);

  /**
   * 生成階層式編碼
   * 根據父任務編碼生成子編碼（10 -> 10.1, 10.1 -> 10.1.2）
   *
   * @param parentId 父任務 ID，null 表示根節點
   * @param blueprintId 藍圖 ID
   * @returns 生成的編碼
   */
  async generateTaskCode(parentId: string | null, blueprintId: string): Promise<string> {
    return this.repository.generateTaskCode(parentId, blueprintId);
  }

  /**
   * 創建任務
   *
   * @param task 任務數據（部分）
   * @param blueprintId 藍圖 ID
   * @returns 創建的完整任務
   */
  async createTask(task: Partial<TaskIdentityComplete>, blueprintId: string): Promise<TaskIdentityComplete> {
    if (!blueprintId) {
      throw new Error('Blueprint ID is required');
    }

    const userId = await this.resolveCurrentUserId();
    const code = await this.generateTaskCode(task.parentId ?? null, blueprintId);
    const now = new Date();

    const dbTask: Partial<TaskIdentityDbRecord> = {
      ...this.convertToDb({
        ...task,
        code,
        version: 1,
        createdAt: now,
        updatedAt: now,
        isArchived: false,
        level: 1,
        path: code,
        sortOrder: task.sortOrder || 0,
        isLeaf: true,
        isExpandable: true,
        childrenCount: 0,
        tags: task.tags || []
      } as Partial<TaskIdentityComplete>),
      blueprint_id: blueprintId,
      created_by: userId,
      updated_by: userId
    };

    const createdTask = await this.repository.insertTask(dbTask);
    return this.convertFromDb(createdTask);
  }

  /**
   * 更新任務
   *
   * @param id 任務 ID
   * @param updates 更新數據
   * @returns 更新後的完整任務
   */
  async updateTask(id: string, updates: Partial<TaskIdentityComplete>): Promise<TaskIdentityComplete> {
    // 獲取當前任務以獲取版本號
    const currentTask = await this.getTaskById(id);
    if (!currentTask) {
      throw new Error(`Task not found: ${id}`);
    }

    // 獲取當前用戶 ID
    const userId = await this.resolveCurrentUserId();

    // 轉換為數據庫格式
    const dbUpdates: Partial<TaskIdentityDbRecord> = {
      ...this.convertToDb({
        ...updates,
        version: currentTask.version + 1,
        updatedAt: new Date()
      } as Partial<TaskIdentityComplete>),
      updated_by: userId
    };

    const updatedTask = await this.repository.updateTask(id, dbUpdates);
    return this.convertFromDb(updatedTask);
  }

  /**
   * 獲取任務
   *
   * @param id 任務 ID
   * @returns 任務或 null
   */
  async getTaskById(id: string): Promise<TaskIdentityComplete | null> {
    const data = await this.repository.getTaskById(id);
    return data ? this.convertFromDb(data) : null;
  }

  /**
   * 軟刪除任務
   *
   * @param id 任務 ID
   * @param userId 用戶 ID
   */
  async deleteTask(id: string, userId: string): Promise<void> {
    await this.repository.archiveTask(id, userId);
  }

  /**
   * 歸檔任務
   * 與軟刪除相同，但語義上表示長期歸檔
   *
   * @param id 任務 ID
   * @param userId 用戶 ID
   */
  async archiveTask(id: string, userId: string): Promise<void> {
    await this.repository.archiveTask(id, userId);
  }

  /**
   * 恢復任務
   *
   * @param id 任務 ID
   * @param userId 用戶 ID
   */
  async restoreTask(id: string, userId: string): Promise<void> {
    await this.repository.restoreTask(id, userId);
  }

  /**
   * 從數據庫格式轉換為領域格式（snake_case -> camelCase）
   *
   * @param dbTask 數據庫任務格式
   * @returns 領域任務格式
   */
  convertFromDb(dbTask: TaskIdentityDbRecord | Record<string, any>): TaskIdentityComplete {
    return this.repository.convertFromDb(dbTask);
  }

  /**
   * 轉換為數據庫格式（camelCase -> snake_case）
   *
   * @param task 領域任務格式
   * @returns 數據庫任務格式
   */
  convertToDb(task: Partial<TaskIdentityComplete>): Partial<TaskIdentityDbRecord> {
    return this.repository.convertToDb(task);
  }

  private async resolveCurrentUserId(): Promise<string> {
    const { data, error } = await this.userService.getCurrentUser();

    if (data?.id) {
      return data.id;
    }

    if (error) {
      throw error;
    }

    throw new Error('User not authenticated');
  }
}
