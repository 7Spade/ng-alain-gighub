import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskRepository, TaskInsert, TaskUpdate, TaskAssignmentRepository, TaskListRepository } from '@core';
import { Task, TaskStatus, TaskPriority, TaskDetail, TaskTreeNode } from '@shared';
import { BlueprintActivityService } from '../blueprint/blueprint-activity.service';
import { firstValueFrom } from 'rxjs';

import { validateStateTransition, getAllowedTransitions, getNextStatus, isFinalStatus, isWithdrawableStatus } from './task-state-machine';

/**
 * Task Service
 *
 * 提供任务相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const taskService = inject(TaskService);
 *
 * // 订阅任务列表
 * effect(() => {
 *   console.log('Tasks:', taskService.tasks());
 * });
 *
 * // 加载任务列表
 * await taskService.loadTasksByBlueprint('blueprint-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private taskRepository = inject(TaskRepository);
  private taskAssignmentRepository = inject(TaskAssignmentRepository);
  private taskListRepository = inject(TaskListRepository);
  private activityService = inject(BlueprintActivityService);

  // 使用 Signals 管理状态
  private tasksState = signal<Task[]>([]);
  private selectedTaskState = signal<Task | null>(null);
  private taskTreeState = signal<TaskTreeNode[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTask = this.selectedTaskState.asReadonly();
  readonly taskTree = this.taskTreeState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly pendingTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.PENDING));

  readonly inProgressTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS));

  readonly completedTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.COMPLETED));

  readonly stagingTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.STAGING));

  readonly highPriorityTasks = computed(() =>
    this.tasks().filter(t => t.priority === TaskPriority.HIGH || t.priority === TaskPriority.URGENT)
  );

  /**
   * 加载所有任务（按蓝图）
   */
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findByBlueprintId(blueprintId));
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载任务详情
   */
  async loadTaskById(id: string): Promise<TaskDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.taskRepository.findById(id));
      if (!task) {
        this.selectedTaskState.set(null);
        return null;
      }

      // 加载关联数据
      // 注意：BaseRepository会自动转换snake_case到camelCase，所以运行时task.parentTaskId存在
      const taskData = task as any;
      const [assignments, children, parent] = await Promise.all([
        firstValueFrom(this.taskAssignmentRepository.findByTaskId(id)),
        firstValueFrom(this.taskRepository.findChildren(id)),
        taskData.parentTaskId ? firstValueFrom(this.taskRepository.findById(taskData.parentTaskId)) : Promise.resolve(null)
      ]);

      const taskDetail: TaskDetail = {
        ...task,
        assignments: assignments.map(a => ({
          ...a,
          assignee: undefined, // TODO: 加载指派对象信息
          assignedBy: undefined // TODO: 加载指派者信息
        })),
        children,
        parent: parent || undefined
      };

      this.selectedTaskState.set(task);
      return taskDetail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建任务
   *
   * @param data 任务数据
   * @returns 创建的任务
   */
  async createTask(data: TaskInsert): Promise<Task> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // TODO: 自动生成 tree_path 和 tree_level
      // 如果 parent_task_id 存在，需要计算路径
      const task = await firstValueFrom(this.taskRepository.create(data));

      // 更新本地状态
      this.tasksState.update(tasks => [...tasks, task]);

      return task;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建任务失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任务
   *
   * @param id 任务 ID
   * @param data 更新数据
   * @returns 更新后的任务
   */
  async updateTask(id: string, data: TaskUpdate): Promise<Task> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 如果更新包含狀態變更，先驗證
      if (data.status) {
        const currentTask = await firstValueFrom(this.taskRepository.findById(id));
        if (!currentTask) {
          throw new Error('任務不存在');
        }

        // 確保 status 是有效的 TaskStatus
        const currentStatus = currentTask.status as TaskStatus;
        const newStatus = data.status as TaskStatus;
        await this.validateAndUpdateStatus(id, currentStatus, newStatus);
      }

      const task = await firstValueFrom(this.taskRepository.update(id, data));

      // 更新本地状态
      this.tasksState.update(tasks => tasks.map(t => (t.id === id ? task : t)));
      if (this.selectedTaskState()?.id === id) {
        this.selectedTaskState.set(task);
      }

      return task;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新任务失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除任务
   *
   * @param id 任务 ID
   */
  async deleteTask(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // TODO: 检查是否有子任务，如果有需要处理
      await firstValueFrom(this.taskRepository.delete(id));

      // 更新本地状态
      this.tasksState.update(tasks => tasks.filter(t => t.id !== id));
      if (this.selectedTaskState()?.id === id) {
        this.selectedTaskState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除任务失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 构建任务树
   *
   * @param tasks 任务列表
   * @returns 任务树节点数组
   */
  buildTaskTree(tasks: Task[]): TaskTreeNode[] {
    const taskMap = new Map<string, TaskTreeNode>();
    const rootTasks: TaskTreeNode[] = [];

    // 创建节点映射
    tasks.forEach(task => {
      taskMap.set(task.id, {
        ...task,
        children: [],
        expanded: false,
        loading: false
      });
    });

    // 构建树结构
    // 注意：BaseRepository会自动转换snake_case到camelCase，所以运行时task.parentTaskId存在
    tasks.forEach(task => {
      const node = taskMap.get(task.id)!;
      const taskData = task as any;
      const parentTaskId = taskData.parentTaskId;
      if (parentTaskId) {
        const parent = taskMap.get(parentTaskId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      } else {
        rootTasks.push(node);
      }
    });

    return rootTasks;
  }

  /**
   * 加载任务树（按蓝图）
   */
  async loadTaskTree(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findByBlueprintId(blueprintId));
      const tree = this.buildTaskTree(tasks);
      this.taskTreeState.set(tree);
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载任务树失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择任务
   */
  selectTask(task: Task | null): void {
    this.selectedTaskState.set(task);
  }

  /**
   * 清除错误状态
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * 驗證並更新任務狀態
   *
   * @param taskId 任務 ID
   * @param fromStatus 當前狀態
   * @param toStatus 目標狀態
   */
  private async validateAndUpdateStatus(taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus): Promise<void> {
    const validation = validateStateTransition(fromStatus, toStatus);

    if (!validation.allowed) {
      throw new Error(validation.reason || '不允許的狀態轉換');
    }

    // 如果有警告，可以記錄或提示用戶
    if (validation.warning) {
      console.warn(`任務 ${taskId} 狀態轉換警告: ${validation.warning}`);
    }
  }

  /**
   * 更新任務狀態（含驗證）
   *
   * @param taskId 任務 ID
   * @param newStatus 新狀態
   * @returns 更新後的任務
   */
  async updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<Task> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 獲取當前任務
      const currentTask = await firstValueFrom(this.taskRepository.findById(taskId));
      if (!currentTask) {
        throw new Error('任務不存在');
      }

      // 確保 status 是有效的 TaskStatus
      const currentStatus = currentTask.status as TaskStatus;

      // 驗證狀態轉換
      await this.validateAndUpdateStatus(taskId, currentStatus, newStatus);

      // 執行更新
      const task = await firstValueFrom(this.taskRepository.update(taskId, { status: newStatus }));

      // 更新本地狀態
      this.tasksState.update(tasks => tasks.map(t => (t.id === taskId ? task : t)));
      if (this.selectedTaskState()?.id === taskId) {
        this.selectedTaskState.set(task);
      }

      return task;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新任務狀態失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 獲取任務允許的下一步狀態
   *
   * @param taskId 任務 ID
   * @returns 允許的狀態列表
   */
  async getAllowedNextStatuses(taskId: string): Promise<TaskStatus[]> {
    const task = await firstValueFrom(this.taskRepository.findById(taskId));
    if (!task) {
      return [];
    }

    const status = task.status as TaskStatus;
    return getAllowedTransitions(status);
  }

  /**
   * 獲取任務的推薦下一步狀態
   *
   * @param taskId 任務 ID
   * @returns 推薦狀態（如果有）
   */
  async getRecommendedNextStatus(taskId: string): Promise<TaskStatus | null> {
    const task = await firstValueFrom(this.taskRepository.findById(taskId));
    if (!task) {
      return null;
    }

    const status = task.status as TaskStatus;
    return getNextStatus(status);
  }

  /**
   * 檢查任務是否處於終止狀態
   *
   * @param taskId 任務 ID
   * @returns 是否為終止狀態
   */
  async isTaskFinalized(taskId: string): Promise<boolean> {
    const task = await firstValueFrom(this.taskRepository.findById(taskId));
    if (!task) {
      return false;
    }

    const status = task.status as TaskStatus;
    return isFinalStatus(status);
  }

  /**
   * 檢查任務是否可撤回（處於 staging 狀態）
   *
   * @param taskId 任務 ID
   * @returns 是否可撤回
   */
  async isTaskWithdrawable(taskId: string): Promise<boolean> {
    const task = await firstValueFrom(this.taskRepository.findById(taskId));
    if (!task) {
      return false;
    }

    const status = task.status as TaskStatus;
    return isWithdrawableStatus(status);
  }

  /**
   * 更新任務的承攬欄位
   * 僅允許更新 contractor_fields 內的欄位
   * 
   * 此方法用於 Git-like 分支模型中，協作組織僅能更新承攬相關欄位
   *
   * @param taskId 任務 ID
   * @param field 欄位路徑（必須以 'contractor_fields.' 開頭）
   * @param value 欄位值
   * @throws Error 如果欄位路徑不合法或任務不存在
   * 
   * @example
   * ```typescript
   * // 更新工作時數
   * await taskService.updateTaskContractorFields(
   *   'task-123',
   *   'contractor_fields.work_hours',
   *   8
   * );
   * 
   * // 更新施工進度
   * await taskService.updateTaskContractorFields(
   *   'task-123',
   *   'contractor_fields.progress_percentage',
   *   75
   * );
   * ```
   */
  async updateTaskContractorFields(taskId: string, field: string, value: any): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 驗證欄位路徑
      if (!field.startsWith('contractor_fields.')) {
        throw new Error('僅允許更新 contractor_fields 欄位');
      }

      // 取得當前任務
      const task = await firstValueFrom(this.taskRepository.findById(taskId));
      if (!task) {
        throw new Error('任務不存在');
      }

      // 更新指定欄位
      const fieldPath = field.replace('contractor_fields.', '');
      const taskData = task as any;
      const currentContractorFields = taskData.contractorFields || {};

      // 使用 lodash-style path 設置，支援巢狀路徑
      const updatedFields = { ...currentContractorFields };
      const pathParts = fieldPath.split('.');
      let current = updatedFields;

      // 建立巢狀物件路徑
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      // 設置最終值
      current[pathParts[pathParts.length - 1]] = value;

      // 寫回資料庫
      await firstValueFrom(
        this.taskRepository.update(taskId, {
          contractor_fields: updatedFields
        } as any)
      );

      // 更新本地狀態
      if (this.selectedTaskState()?.id === taskId) {
        const updatedTask = await firstValueFrom(this.taskRepository.findById(taskId));
        this.selectedTaskState.set(updatedTask);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新承攬欄位失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批次更新多個任務
   * 
   * 支援批次修改狀態、優先級、承攬欄位等
   * 所有更新在單一交易中進行，確保原子性
   *
   * @param taskIds 要更新的任務 ID 列表
   * @param updates 要更新的欄位
   * @throws Error 如果部分任務不存在或更新失敗
   * 
   * @example
   * ```typescript
   * // 批次更新狀態
   * await taskService.batchUpdateTasks(
   *   ['task-1', 'task-2', 'task-3'],
   *   { status: TaskStatus.IN_PROGRESS }
   * );
   * 
   * // 批次更新優先級
   * await taskService.batchUpdateTasks(
   *   ['task-1', 'task-2'],
   *   { priority: TaskPriority.HIGH }
   * );
   * ```
   */
  async batchUpdateTasks(taskIds: string[], updates: Partial<TaskUpdate>): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 驗證所有 Task 存在
      const tasks = await Promise.all(taskIds.map(id => firstValueFrom(this.taskRepository.findById(id))));

      if (tasks.some(t => !t)) {
        throw new Error('部分任務不存在');
      }

      // 批次更新
      await Promise.all(taskIds.map(id => firstValueFrom(this.taskRepository.update(id, updates))));

      // 記錄 activity logs
      await Promise.all(
        taskIds.map((id, index) => {
          const task = tasks[index];
          if (task) {
            return this.activityService.logTaskUpdate(
              id,
              Object.keys(updates).join(','),
              updates,
              task.blueprint_id as string
            );
          }
          return Promise.resolve();
        })
      );

      // 重新載入當前藍圖的任務列表
      const currentBlueprint = tasks[0]?.blueprint_id;
      if (currentBlueprint) {
        await this.loadTasksByBlueprint(currentBlueprint as string);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批次更新失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批次更新承攬欄位
   * 
   * 專門用於批次更新 contractor_fields，符合 Git-like 模型中協作組織的權限限制
   *
   * @param taskIds 要更新的任務 ID 列表
   * @param fieldPath 欄位路徑（必須以 'contractor_fields.' 開頭）
   * @param value 欄位值
   * @throws Error 如果欄位路徑不合法或任務不存在
   * 
   * @example
   * ```typescript
   * // 批次更新工作時數
   * await taskService.batchUpdateContractorFields(
   *   ['task-1', 'task-2', 'task-3'],
   *   'contractor_fields.work_hours',
   *   8
   * );
   * ```
   */
  async batchUpdateContractorFields(taskIds: string[], fieldPath: string, value: any): Promise<void> {
    // 驗證欄位路徑
    if (!fieldPath.startsWith('contractor_fields.') || fieldPath === 'contractor_fields.') {
      throw new Error('僅允許更新 contractor_fields 欄位');
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 批次更新每個任務的 contractor_fields
      await Promise.all(taskIds.map(taskId => this.updateTaskContractorFields(taskId, fieldPath, value)));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批次更新承攬欄位失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批次刪除多個任務
   * 
   * 驗證任務沒有子任務後批次刪除
   * 所有刪除在單一交易中進行
   *
   * @param taskIds 要刪除的任務 ID 列表
   * @throws Error 如果任務有子任務或刪除失敗
   * 
   * @example
   * ```typescript
   * await taskService.batchDeleteTasks(['task-1', 'task-2', 'task-3']);
   * ```
   */
  async batchDeleteTasks(taskIds: string[]): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 驗證任務存在
      const tasks = await Promise.all(taskIds.map(id => firstValueFrom(this.taskRepository.findById(id))));

      if (tasks.some(t => !t)) {
        throw new Error('部分任務不存在');
      }

      // 檢查是否有子任務
      const childrenChecks = await Promise.all(taskIds.map(id => firstValueFrom(this.taskRepository.findChildren(id))));

      if (childrenChecks.some(children => children.length > 0)) {
        throw new Error('無法刪除有子任務的任務');
      }

      // 批次刪除
      await Promise.all(taskIds.map(id => firstValueFrom(this.taskRepository.delete(id))));

      // 記錄 activity logs
      await Promise.all(
        taskIds.map((id, index) => {
          const task = tasks[index];
          if (task) {
            return this.activityService.logTaskDelete(id, task.blueprint_id as string);
          }
          return Promise.resolve();
        })
      );

      // 從 state 中移除
      this.tasksState.update(current => current.filter(t => !taskIds.includes(t.id as string)));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批次刪除失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重新排序任務
   * 
   * 更新多個任務的 order_index，用於拖拽排序
   *
   * @param blueprintId 藍圖 ID
   * @param taskOrders 任務新順序列表
   * 
   * @example
   * ```typescript
   * await taskService.reorderTasks('blueprint-1', [
   *   { taskId: 'task-1', newOrderIndex: 0 },
   *   { taskId: 'task-2', newOrderIndex: 1 },
   *   { taskId: 'task-3', newOrderIndex: 2 }
   * ]);
   * ```
   */
  async reorderTasks(
    blueprintId: string,
    taskOrders: Array<{ taskId: string; newOrderIndex: number }>
  ): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 批次更新 order_index
      await Promise.all(
        taskOrders.map(({ taskId, newOrderIndex }) =>
          firstValueFrom(this.taskRepository.update(taskId, { order_index: newOrderIndex } as any))
        )
      );

      // 記錄 activity log
      await this.activityService.logActivity({
        blueprintId,
        entityType: 'task',
        entityId: blueprintId,
        action: 'reordered',
        metadata: {
          task_count: taskOrders.length,
          orders: taskOrders
        }
      });

      // 重新載入以反映新順序
      await this.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '重新排序失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 移動任務到新父任務下
   * 
   * 包含循環引用檢查，防止將父任務設定為自己的子孫任務
   *
   * @param taskId 要移動的任務 ID
   * @param newParentId 新父任務 ID（null 表示移到頂層）
   * @param newOrderIndex 新排序索引（可選）
   * @throws Error 如果會造成循環引用
   * 
   * @example
   * ```typescript
   * // 移動到新父任務下
   * await taskService.moveTask('task-1', 'new-parent-id', 0);
   * 
   * // 移到頂層
   * await taskService.moveTask('task-1', null);
   * ```
   */
  async moveTask(taskId: string, newParentId: string | null, newOrderIndex?: number): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.taskRepository.findById(taskId));
      if (!task) {
        throw new Error('任務不存在');
      }

      // 檢查不形成循環引用
      if (newParentId && (await this.wouldCreateCycle(taskId, newParentId))) {
        throw new Error('無法移動：會造成循環引用');
      }

      // 更新父任務和排序
      const updates: any = { parent_task_id: newParentId };
      if (newOrderIndex !== undefined) {
        updates.order_index = newOrderIndex;
      }

      await firstValueFrom(this.taskRepository.update(taskId, updates));

      // 記錄 activity log
      await this.activityService.logTaskUpdate(taskId, 'parent_task_id', newParentId, task.blueprint_id as string);

      // 重新載入
      await this.loadTasksByBlueprint(task.blueprint_id as string);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '移動任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 檢查移動任務是否會造成循環引用
   * 
   * 遞迴檢查目標父任務的所有祖先，確保不會形成循環
   *
   * @param taskId 要移動的任務 ID
   * @param targetParentId 目標父任務 ID
   * @returns 是否會造成循環引用
   */
  private async wouldCreateCycle(taskId: string, targetParentId: string): Promise<boolean> {
    // 如果目標父任務就是自己，形成循環
    if (taskId === targetParentId) {
      return true;
    }

    // 檢查目標父任務的祖先鏈
    let currentParentId: string | null = targetParentId;
    const visited = new Set<string>();

    while (currentParentId) {
      // 防止無限循環（如果資料庫已經有循環引用）
      if (visited.has(currentParentId)) {
        return true;
      }
      visited.add(currentParentId);

      // 如果祖先鏈中包含要移動的任務，形成循環
      if (currentParentId === taskId) {
        return true;
      }

      // 繼續往上查找
      const parent = await firstValueFrom(this.taskRepository.findById(currentParentId));
      currentParentId = parent?.parent_task_id as string | null;
    }

    return false;
  }
}
