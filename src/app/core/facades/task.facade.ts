import { Injectable, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import {
  TaskRepository,
  TaskInsert,
  TaskUpdate,
  type Task
} from '@core';
import {
  TaskService,
  TaskAssignmentService,
  TaskListService,
  TaskStatus,
  TaskPriority,
  type TaskDetail,
  type TaskTreeNode,
  type TaskAssignment,
  type TaskAssignmentInsert,
  type TaskAssignmentUpdate,
  type TaskList,
  type TaskListInsert,
  type TaskListUpdate
} from '@shared';
import { BlueprintActivityService, ErrorStateService } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task Facade
 *
 * Enterprise-grade facade for Task management.
 * Orchestrates TaskService, TaskAssignmentService, and TaskListService to provide a unified
 * interface for all task operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Automatic audit logging via BlueprintActivityService
 * - Task hierarchy management (tree_path, tree_level)
 * - Task assignment and list management
 *
 * Key Features:
 * - Task CRUD operations (Create, Read, Update, Delete)
 * - Task hierarchy management (parent-child relationships)
 * - Task assignment management
 * - Task list management (personal, team, organization lists)
 * - Task status and priority management
 * - Task tree building and navigation
 * - Computed state for filtered views and statistics
 * - Activity logging and audit trail
 *
 * @example
 * ```typescript
 * const facade = inject(TaskFacade);
 *
 * // Load tasks by blueprint
 * await facade.loadTasksByBlueprint('blueprint-id');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Tasks:', facade.tasks());
 *   console.log('Pending tasks:', facade.pendingTasks());
 *   console.log('Loading:', facade.loading());
 * });
 *
 * // Create new task
 * const newTask = await facade.createTask({
 *   title: 'New Task',
 *   blueprint_id: 'bp-123',
 *   created_by: userId
 * });
 *
 * // Assign task
 * await facade.assignTask('task-id', 'user-id', 'user');
 *
 * // Add to list
 * await facade.addTaskToList('task-id', 'list-id');
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class TaskFacade implements OnDestroy {
  // Inject dependencies
  private readonly taskService = inject(TaskService);
  private readonly taskAssignmentService = inject(TaskAssignmentService);
  private readonly taskListService = inject(TaskListService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);
  private readonly taskRepository = inject(TaskRepository);

  // Signal state - Facade-specific state
  private readonly currentTaskIdState = signal<string | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentTaskId = this.currentTaskIdState.asReadonly();
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly tasks = this.taskService.tasks;
  readonly selectedTask = this.taskService.selectedTask;
  readonly taskTree = this.taskService.taskTree;
  readonly loading = this.taskService.loading;
  readonly error = this.taskService.error;

  // Task assignment signals
  readonly assignments = this.taskAssignmentService.assignments;
  readonly assignmentLoading = this.taskAssignmentService.loading;
  readonly assignmentError = this.taskAssignmentService.error;

  // Task list signals
  readonly taskLists = this.taskListService.taskLists;
  readonly taskListLoading = this.taskListService.loading;
  readonly taskListError = this.taskListService.error;

  // Computed: Task filters
  readonly pendingTasks = this.taskService.pendingTasks;
  readonly inProgressTasks = this.taskService.inProgressTasks;
  readonly completedTasks = this.taskService.completedTasks;
  readonly stagingTasks = this.taskService.stagingTasks;
  readonly highPriorityTasks = this.taskService.highPriorityTasks;

  // Computed: Current task (based on currentTaskId)
  readonly currentTask = computed(() => {
    const taskId = this.currentTaskId();
    if (!taskId) return null;
    return this.tasks().find(t => t.id === taskId) || null;
  });

  // Computed: Task statistics
  readonly taskStats = computed(() => {
    const allTasks = this.tasks();
    return {
      total: allTasks.length,
      pending: this.pendingTasks().length,
      inProgress: this.inProgressTasks().length,
      completed: this.completedTasks().length,
      staging: this.stagingTasks().length,
      highPriority: this.highPriorityTasks().length,
      byStatus: {
        pending: this.pendingTasks().length,
        assigned: allTasks.filter(t => t.status === TaskStatus.ASSIGNED).length,
        inProgress: this.inProgressTasks().length,
        staging: this.stagingTasks().length,
        inQa: allTasks.filter(t => t.status === TaskStatus.IN_QA).length,
        inInspection: allTasks.filter(t => t.status === TaskStatus.IN_INSPECTION).length,
        completed: this.completedTasks().length,
        cancelled: allTasks.filter(t => t.status === TaskStatus.CANCELLED).length
      },
      byPriority: {
        low: allTasks.filter(t => t.priority === TaskPriority.LOW).length,
        medium: allTasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
        high: allTasks.filter(t => t.priority === TaskPriority.HIGH).length,
        urgent: allTasks.filter(t => t.priority === TaskPriority.URGENT).length
      }
    };
  });

  // Computed: Assignment statistics
  readonly assignmentStats = computed(() => {
    const allAssignments = this.assignments();
    return {
      total: allAssignments.length,
      byType: {
        individual: allAssignments.filter(a => (a as any).assigneeType === 'individual').length,
        team: allAssignments.filter(a => (a as any).assigneeType === 'team').length,
        organization: allAssignments.filter(a => (a as any).assigneeType === 'organization').length,
        contractor: allAssignments.filter(a => (a as any).assigneeType === 'contractor').length
      }
    };
  });

  /**
   * Initialize facade
   */
  constructor() {
    // Monitor for errors
    effect(() => {
      const error = this.error();
      if (error) {
        this.errorStateService.addError({
          message: error,
          category: 'BusinessLogic',
          severity: 'error'
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ============================================================================
  // Task CRUD Operations
  // ============================================================================

  /**
   * Load tasks by blueprint ID
   *
   * @param blueprintId Blueprint ID
   */
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_blueprint');

    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      console.error('[TaskFacade] Failed to load tasks by blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load task by ID with full details
   *
   * @param taskId Task ID
   * @returns Task detail or null
   */
  async loadTaskById(taskId: string): Promise<TaskDetail | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_task_by_id');
    this.currentTaskIdState.set(taskId);

    try {
      const taskDetail = await this.taskService.loadTaskById(taskId);
      return taskDetail;
    } catch (error) {
      console.error('[TaskFacade] Failed to load task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load task tree by blueprint ID
   *
   * @param blueprintId Blueprint ID
   */
  async loadTaskTree(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_task_tree');

    try {
      await this.taskService.loadTaskTree(blueprintId);
    } catch (error) {
      console.error('[TaskFacade] Failed to load task tree:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create new task
   *
   * @param data Task data
   * @returns Created task
   */
  async createTask(data: TaskInsert): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_task');

    try {
      const task = await this.taskService.createTask(data);

      // Log activity
      if (data.blueprint_id) {
        await this.activityService
          .logActivity(
            data.blueprint_id,
            'task',
            task.id,
            'created',
            [],
            { title: task.title }
          )
          .catch(err => console.warn('[TaskFacade] Failed to log activity:', err));
      }

      return task;
    } catch (error) {
      console.error('[TaskFacade] Failed to create task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update task
   *
   * @param taskId Task ID
   * @param data Update data
   * @returns Updated task
   */
  async updateTask(taskId: string, data: TaskUpdate): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_task');

    try {
      const task = await this.taskService.updateTask(taskId, data);

      // Log activity
      const currentTask = this.tasks().find(t => t.id === taskId);
      if (currentTask) {
        const taskData = currentTask as any;
        const blueprintId = taskData.blueprintId || taskData.blueprint_id;
        if (blueprintId) {
          const changes = Object.keys(data).map(key => ({
            field: key,
            oldValue: (currentTask as any)[key],
            newValue: (data as any)[key]
          }));
          await this.activityService
            .logActivity(blueprintId, 'task', taskId, 'updated', changes, {})
            .catch(err => console.warn('[TaskFacade] Failed to log activity:', err));
        }
      }

      return task;
    } catch (error) {
      console.error('[TaskFacade] Failed to update task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete task
   *
   * @param taskId Task ID
   */
  async deleteTask(taskId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_task');

    try {
      // Log activity before deletion
      const currentTask = this.tasks().find(t => t.id === taskId);
      if (currentTask) {
        const taskData = currentTask as any;
        const blueprintId = taskData.blueprintId || taskData.blueprint_id;
        if (blueprintId) {
          await this.activityService
            .logActivity(blueprintId, 'task', taskId, 'deleted', [], { title: currentTask.title })
            .catch(err => console.warn('[TaskFacade] Failed to log activity:', err));
        }
      }

      await this.taskService.deleteTask(taskId);

      if (this.currentTaskId() === taskId) {
        this.currentTaskIdState.set(null);
      }
    } catch (error) {
      console.error('[TaskFacade] Failed to delete task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update task status
   *
   * @param taskId Task ID
   * @param newStatus New status
   * @returns Updated task
   */
  async updateTaskStatus(taskId: string, newStatus: TaskStatus): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_task_status');

    try {
      const task = await this.taskService.updateTaskStatus(taskId, newStatus);

      // Log activity
      const taskData = task as any;
      const blueprintId = taskData.blueprintId || taskData.blueprint_id;
      if (blueprintId) {
        const currentTask = this.tasks().find(t => t.id === taskId);
        const changes = currentTask
          ? [{ field: 'status', oldValue: currentTask.status, newValue: newStatus }]
          : [];
        await this.activityService
          .logActivity(blueprintId, 'task', taskId, 'updated', changes, { status: newStatus })
          .catch(err => console.warn('[TaskFacade] Failed to log activity:', err));
      }

      return task;
    } catch (error) {
      console.error('[TaskFacade] Failed to update task status:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Select task
   *
   * @param task Task or null
   */
  selectTask(task: Task | null): void {
    this.taskService.selectTask(task);
    this.currentTaskIdState.set(task?.id || null);
  }

  // ============================================================================
  // Task Assignment Operations
  // ============================================================================

  /**
   * Load assignments by task ID
   *
   * @param taskId Task ID
   */
  async loadAssignmentsByTaskId(taskId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_assignments_by_task');

    try {
      await this.taskAssignmentService.loadByTaskId(taskId);
    } catch (error) {
      console.error('[TaskFacade] Failed to load assignments:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Assign task to assignee
   *
   * @param taskId Task ID
   * @param assigneeId Assignee ID
   * @param assigneeType Assignee type
   * @param assignedBy Assigned by user ID
   * @returns Created assignment
   */
  async assignTask(
    taskId: string,
    assigneeId: string,
    assigneeType: 'individual' | 'team' | 'organization' | 'contractor',
    assignedBy: string
  ): Promise<TaskAssignment> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('assign_task');

    try {
      const assignment = await this.taskAssignmentService.create({
        task_id: taskId,
        assignee_id: assigneeId,
        assignee_type: assigneeType,
        assigned_by: assignedBy
      } as TaskAssignmentInsert);

      // Log activity
      const currentTask = this.tasks().find(t => t.id === taskId);
      if (currentTask) {
        const taskData = currentTask as any;
        const blueprintId = taskData.blueprintId || taskData.blueprint_id;
        if (blueprintId) {
          await this.activityService
            .logActivity(
              blueprintId,
              'task',
              taskId,
              'updated',
              [{ field: 'assignment', oldValue: null, newValue: { assigneeId, assigneeType } }],
              { assignment: { assigneeId, assigneeType } }
            )
            .catch(err => console.warn('[TaskFacade] Failed to log activity:', err));
        }
      }

      return assignment;
    } catch (error) {
      console.error('[TaskFacade] Failed to assign task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Remove task assignment
   *
   * @param assignmentId Assignment ID
   */
  async removeAssignment(assignmentId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('remove_assignment');

    try {
      await this.taskAssignmentService.delete(assignmentId);
    } catch (error) {
      console.error('[TaskFacade] Failed to remove assignment:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Task List Operations
  // ============================================================================

  /**
   * Load task lists by account ID
   *
   * @param accountId Account ID
   */
  async loadTaskListsByAccountId(accountId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_task_lists_by_account');

    try {
      await this.taskListService.loadByAccountId(accountId);
    } catch (error) {
      console.error('[TaskFacade] Failed to load task lists:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Add task to list
   *
   * @param taskId Task ID
   * @param listId List ID
   */
  async addTaskToList(taskId: string, listId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('add_task_to_list');

    try {
      // Check if task is already in list
      const existingLists = this.taskLists();
      const list = existingLists.find(l => l.id === listId);
      if (!list) {
        throw new Error(`Task list not found: ${listId}`);
      }

      const listData = list as any;
      const taskIds = listData.taskIds || listData.task_ids || [];
      if (taskIds.includes(taskId)) {
        // Already in list
        return;
      }

      // Add task to list (this would typically be done via a junction table)
      // For now, we'll just log the operation
      console.log(`[TaskFacade] Adding task ${taskId} to list ${listId}`);
    } catch (error) {
      console.error('[TaskFacade] Failed to add task to list:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create task list
   *
   * @param data Task list data
   * @returns Created task list
   */
  async createTaskList(data: TaskListInsert): Promise<TaskList> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_task_list');

    try {
      return await this.taskListService.create(data);
    } catch (error) {
      console.error('[TaskFacade] Failed to create task list:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Get allowed next statuses for task
   *
   * @param taskId Task ID
   * @returns Allowed statuses
   */
  async getAllowedNextStatuses(taskId: string): Promise<TaskStatus[]> {
    return await this.taskService.getAllowedNextStatuses(taskId);
  }

  /**
   * Get recommended next status for task
   *
   * @param taskId Task ID
   * @returns Recommended status or null
   */
  async getRecommendedNextStatus(taskId: string): Promise<TaskStatus | null> {
    return await this.taskService.getRecommendedNextStatus(taskId);
  }

  /**
   * Check if task is finalized
   *
   * @param taskId Task ID
   * @returns True if finalized
   */
  async isTaskFinalized(taskId: string): Promise<boolean> {
    return await this.taskService.isTaskFinalized(taskId);
  }

  /**
   * Check if task is withdrawable
   *
   * @param taskId Task ID
   * @returns True if withdrawable
   */
  async isTaskWithdrawable(taskId: string): Promise<boolean> {
    return await this.taskService.isTaskWithdrawable(taskId);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.taskService.clearError();
    this.taskAssignmentService.clear();
    this.taskListService.clear();
  }

  /**
   * Reset facade state
   */
  reset(): void {
    this.currentTaskIdState.set(null);
    this.operationInProgressState.set(false);
    this.lastOperationState.set(null);
    this.clearError();
  }
}

