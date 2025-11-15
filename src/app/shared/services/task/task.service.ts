import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskRepository, TaskInsert, TaskUpdate, TaskAssignmentRepository, TaskListRepository } from '@core';
import { Task, TaskStatus, TaskPriority, TaskDetail, TaskTreeNode } from '@shared';
import { firstValueFrom } from 'rxjs';

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
}
