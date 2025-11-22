import { Injectable, inject, signal, computed, effect, OnDestroy } from '@angular/core';
import { TaskInsert, TaskUpdate, type Task } from '@core';
import { ErrorStateService } from '@core';
import {
  TaskService,
  TaskAssignmentService,
  TaskListService,
  TaskTemplateService,
  TaskDependencyService,
  TaskStatus,
  TaskPriority,
  type TaskDetail,
  type TaskTreeNode,
  type TaskAssignment,
  type TaskAssignmentInsert,
  type TaskAssignmentUpdate,
  type TaskList,
  type TaskListInsert,
  type TaskListUpdate,
  type TaskTemplate,
  type TaskDependency,
  type DependencyGraph
} from '@shared';
import { BlueprintActivityService } from '@shared';
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
  private readonly taskTemplateService = inject(TaskTemplateService);
  private readonly taskDependencyService = inject(TaskDependencyService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);

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
   * Load all tasks (no filter)
   *
   * Loads tasks from all blueprints accessible to the user.
   * Use this method sparingly as it may return a large dataset.
   *
   * @example
   * ```typescript
   * await facade.loadTasks();
   * const allTasks = facade.tasks();
   * ```
   */
  async loadTasks(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_all_tasks');

    try {
      await this.taskService.loadTasks();
    } catch (error) {
      console.error('[TaskFacade] Failed to load tasks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Search tasks by query string
   *
   * Searches tasks by title and description using case-insensitive pattern matching.
   * Supports additional filtering by status, priority, blueprint, and assignee.
   *
   * @param query Search query string
   * @param options Search options
   * @param options.status Filter by task status
   * @param options.priority Filter by task priority
   * @param options.blueprintId Filter by blueprint ID
   * @param options.assigneeId Filter by assignee ID
   * @param options.page Page number (default: 1)
   * @param options.pageSize Items per page (default: 50)
   *
   * @example
   * ```typescript
   * // Search for tasks containing "API"
   * await facade.searchTasks('API');
   *
   * // Search pending tasks
   * await facade.searchTasks('test', { status: TaskStatus.PENDING });
   *
   * // Search tasks in specific blueprint
   * await facade.searchTasks('implement', { blueprintId: 'bp-123' });
   * ```
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
    this.operationInProgressState.set(true);
    this.lastOperationState.set('search_tasks');

    try {
      await this.taskService.searchTasks(query, options);
    } catch (error) {
      console.error('[TaskFacade] Failed to search tasks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load tasks by status
   *
   * Filters and loads tasks matching the specified status.
   *
   * @param status Task status to filter by
   *
   * @example
   * ```typescript
   * await facade.loadTasksByStatus(TaskStatus.IN_PROGRESS);
   * const inProgressTasks = facade.tasks();
   * ```
   */
  async loadTasksByStatus(status: TaskStatus): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_status');

    try {
      await this.taskService.loadTasksByStatus(status);
    } catch (error) {
      console.error('[TaskFacade] Failed to load tasks by status:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load tasks by assignee
   *
   * Loads tasks assigned to a specific user, team, organization, or contractor.
   *
   * @param assigneeId ID of the assignee
   * @param assigneeType Type of assignee ('individual' | 'team' | 'organization' | 'contractor')
   *
   * @example
   * ```typescript
   * // Load tasks assigned to a user
   * await facade.loadTasksByAssignee('user-123', 'individual');
   *
   * // Load tasks assigned to a team
   * await facade.loadTasksByAssignee('team-456', 'team');
   * ```
   */
  async loadTasksByAssignee(
    assigneeId: string,
    assigneeType: 'individual' | 'team' | 'organization' | 'contractor'
  ): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_assignee');

    try {
      await this.taskService.loadTasksByAssignee(assigneeId, assigneeType);
    } catch (error) {
      console.error('[TaskFacade] Failed to load tasks by assignee:', error);
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
          .logActivity(data.blueprint_id, 'task', task.id, 'created', [], { title: task.title })
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
        const changes = currentTask ? [{ field: 'status', oldValue: currentTask.status, newValue: newStatus }] : [];
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

  // ============================================================================
  // Task Template Management
  // ============================================================================

  /**
   * Create task from template
   *
   * @param templateId Template ID
   * @param blueprintId Blueprint ID
   * @param additionalData Additional task data
   * @returns Promise<Task>
   */
  async createTaskFromTemplate(templateId: string, blueprintId: string, additionalData?: Partial<TaskInsert>): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_task_from_template');

    try {
      // Get task data from template
      const taskData = await this.taskTemplateService.createTaskFromTemplate(templateId, blueprintId, additionalData);

      // Create task using TaskService
      const task = await this.taskService.createTask(taskData);

      // Log activity
      try {
        await this.activityService.logActivity(
          blueprintId,
          'task',
          task.id,
          'created',
          [{ field: 'source', oldValue: null, newValue: 'template' }],
          { templateId }
        );
      } catch (activityError) {
        console.warn('[TaskFacade] Failed to log activity:', activityError);
      }

      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '从模板创建任务失败';
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'TaskFacade.createTaskFromTemplate'
      });
      console.error('[TaskFacade] Failed to create task from template:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load templates
   *
   * @returns Promise<void>
   */
  async loadTemplates(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_templates');

    try {
      await this.taskTemplateService.loadTemplates();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载任务模板失败';
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'TaskFacade.loadTemplates'
      });
      console.error('[TaskFacade] Failed to load templates:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Task Dependency Management
  // ============================================================================

  /**
   * Create dependency
   *
   * @param taskId Task ID
   * @param dependsOnTaskId Depends on task ID
   * @param dependencyType Dependency type
   * @param lagDays Lag days
   * @returns Promise<TaskDependency>
   */
  async createDependency(
    taskId: string,
    dependsOnTaskId: string,
    dependencyType: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish' = 'finish_to_start',
    lagDays = 0
  ): Promise<TaskDependency> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_dependency');

    try {
      // Check for circular dependency first
      const hasCycle = await this.taskDependencyService.checkCircularDependency(taskId, dependsOnTaskId);
      if (hasCycle) {
        throw new Error('创建依赖关系会导致循环依赖');
      }

      const dependency = await this.taskDependencyService.createDependency({
        task_id: taskId,
        depends_on_task_id: dependsOnTaskId,
        dependency_type: dependencyType,
        lag_days: lagDays
      } as any);

      // Get blueprint ID from task
      const task = this.tasks().find(t => t.id === taskId);
      if (task) {
        const taskAny = task as any;
        const blueprintId = taskAny.blueprint_id;
        if (blueprintId) {
          // Log activity
          try {
            await this.activityService.logActivity(blueprintId, 'task_dependency', dependency.id, 'created', [
              { field: 'task_id', oldValue: null, newValue: taskId },
              { field: 'depends_on_task_id', oldValue: null, newValue: dependsOnTaskId }
            ]);
          } catch (activityError) {
            console.warn('[TaskFacade] Failed to log activity:', activityError);
          }
        }
      }

      return dependency;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建任务依赖失败';
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'TaskFacade.createDependency'
      });
      console.error('[TaskFacade] Failed to create dependency:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Check circular dependency
   *
   * @param taskId Task ID
   * @param dependsOnTaskId Depends on task ID
   * @returns Promise<boolean>
   */
  async checkCircularDependency(taskId: string, dependsOnTaskId: string): Promise<boolean> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('check_circular_dependency');

    try {
      return await this.taskDependencyService.checkCircularDependency(taskId, dependsOnTaskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '检查循环依赖失败';
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'TaskFacade.checkCircularDependency'
      });
      console.error('[TaskFacade] Failed to check circular dependency:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get dependency graph
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<DependencyGraph>
   */
  async getDependencyGraph(blueprintId: string): Promise<DependencyGraph> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_dependency_graph');

    try {
      return await this.taskDependencyService.getDependencyGraph(blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取依赖图失败';
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'TaskFacade.getDependencyGraph'
      });
      console.error('[TaskFacade] Failed to get dependency graph:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
