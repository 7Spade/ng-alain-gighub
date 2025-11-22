import { Injectable, computed, inject, signal } from '@angular/core';
import { TaskAssignmentRepository, TaskInsert, TaskListRepository, TaskRepository, TaskUpdate } from '@core';
import { Task, TaskDetail, TaskPriority, TaskStatus, TaskTreeNode } from '@shared';
import { firstValueFrom } from 'rxjs';

import { getAllowedTransitions, getNextStatus, isFinalStatus, isWithdrawableStatus, validateStateTransition } from './task-state-machine';

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
   * 根据任务 ID 列表批量加载任务
   *
   * @param taskIds 任务 ID 列表
   */
  async loadTasksByIds(taskIds: string[]): Promise<void> {
    if (taskIds.length === 0) {
      this.tasksState.set([]);
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findByIds(taskIds));
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
   * 加載所有任務（無過濾）
   *
   * ⚠️ 此方法會返回所有可訪問的任務，可能返回大量數據。
   * 建議使用 loadTasksByBlueprint 或 searchTasks 來過濾結果。
   */
  async loadTasks(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findAll());
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加載任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 搜索任務
   *
   * @param query 搜索查詢字串
   * @param options 搜索選項
   */
  async searchTasks(
    query: string,
    options?: {
      status?: TaskStatus;
      priority?: TaskPriority;
      blueprintId?: string;
      assigneeId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.search(query, options));
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '搜索任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據狀態加載任務
   *
   * @param status 任務狀態
   */
  async loadTasksByStatus(status: TaskStatus): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findByStatus(status));
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加載任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據分配人加載任務
   *
   * @param assigneeId 分配人 ID
   * @param assigneeType 分配人類型
   */
  async loadTasksByAssignee(
    assigneeId: string,
    assigneeType: 'individual' | 'team' | 'organization' | 'contractor'
  ): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 先通過 task_assignments 表找到所有相關的 task_id
      // 根據 assignee_id 和 assignee_type 查詢
      const assignments = await firstValueFrom(
        this.taskAssignmentRepository.findAll({
          filters: {
            assigneeId,
            assigneeType
          }
        })
      );
      const taskIds = assignments.map(a => a.taskId);

      if (taskIds.length === 0) {
        this.tasksState.set([]);
        return;
      }

      // 然後加載這些任務
      const tasks = await firstValueFrom(this.taskRepository.findByIds(taskIds));
      this.tasksState.set(tasks);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加載任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 選擇任務
   *
   * @param task 要選擇的任務（或 null 來清除選擇）
   */
  selectTask(task: Task | null): void {
    this.selectedTaskState.set(task);
  }
}
