import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TaskRepository, type Task, type TaskUpdate } from '@core';
import { BlueprintActivityService, type TaskTreeNode } from '@shared';

/**
 * Task Tree Facade
 *
 * Facade pattern service for Task Tree component
 * - Manages task state with Signals
 * - Provides task tree transformation (flat → hierarchical)
 * - Orchestrates TaskRepository + BlueprintActivityService
 * - Handles all business logic for task operations
 *
 * Design principles:
 * - Signal-based state management (Angular 20)
 * - Non-invasive error handling
 * - Automatic audit logging via ActivityService
 * - Computed tree structure for performance
 *
 * @example
 * ```typescript
 * const facade = inject(TaskTreeFacade);
 *
 * // Load tasks
 * await facade.loadTasks('blueprint-123');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Task tree:', facade.taskTree());
 * });
 *
 * // Update task status
 * await facade.updateTaskStatus('task-456', 'in_progress');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskTreeFacade {
  private readonly taskRepository = inject(TaskRepository);
  private readonly activityService = inject(BlueprintActivityService);

  // Signal state
  private readonly tasksState = signal<Task[]>([]);
  private readonly selectedTaskIdState = signal<string | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);
  private readonly currentBlueprintIdState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly tasks = this.tasksState.asReadonly();
  readonly selectedTaskId = this.selectedTaskIdState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly currentBlueprintId = this.currentBlueprintIdState.asReadonly();

  // Computed: Transform flat task list to tree structure
  readonly taskTree = computed(() => {
    const tasks = this.tasks();
    if (tasks.length === 0) return [];
    return this.buildTree(tasks);
  });

  // Computed: Selected task object
  readonly selectedTask = computed(() => {
    const taskId = this.selectedTaskId();
    if (!taskId) return null;
    return this.tasks().find(t => t.id === taskId) || null;
  });

  // Computed: Root tasks (for tree display)
  readonly rootTasks = computed(() => {
    return this.tasks().filter(t => !t.parent_task_id);
  });

  // Computed: Task count by status
  readonly taskStats = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      staging: tasks.filter(t => t.status === 'staging').length
    };
  });

  /**
   * Load tasks for a specific blueprint
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async loadTasks(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.currentBlueprintIdState.set(blueprintId);

    try {
      const tasks = await firstValueFrom(this.taskRepository.findByBlueprintId(blueprintId));
      this.tasksState.set(tasks);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tasks';
      this.errorState.set(errorMessage);
      console.error('[TaskTreeFacade] Load tasks error:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Reload tasks for current blueprint
   *
   * @returns Promise<void>
   */
  async reloadTasks(): Promise<void> {
    const blueprintId = this.currentBlueprintId();
    if (!blueprintId) {
      console.warn('[TaskTreeFacade] Cannot reload: no blueprint ID set');
      return;
    }
    await this.loadTasks(blueprintId);
  }

  /**
   * Update task status with automatic audit logging
   *
   * @param taskId Task ID
   * @param newStatus New status value
   * @returns Promise<void>
   */
  async updateTaskStatus(taskId: string, newStatus: string): Promise<void> {
    const oldTask = this.tasks().find(t => t.id === taskId);
    if (!oldTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (oldTask.status === newStatus) {
      return; // No change needed
    }

    const blueprintId = this.currentBlueprintId();
    if (!blueprintId) {
      throw new Error('No blueprint ID set');
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // Update in database
      const update: TaskUpdate = {
        status: newStatus
      };
      await firstValueFrom(this.taskRepository.update(taskId, update));

      // Reload to get fresh data
      await this.reloadTasks();

      // Log activity
      const newTask = this.tasks().find(t => t.id === taskId);
      if (newTask && this.activityService) {
        // Note: logTaskChange expects specific task structure which may not match current Task type
        // TODO: Update logTaskChange signature or create adapter
        try {
          await this.activityService.logActivity(
            blueprintId,
            'task',
            taskId,
            'status_changed',
            [{ field: 'status', oldValue: oldTask.status, newValue: status }],
            {
              taskId,
              taskTitle: newTask.title || 'Unnamed Task'
            }
          );
        } catch (error) {
          console.error('[TaskTreeFacade] Failed to log activity:', error);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      this.errorState.set(errorMessage);
      console.error('[TaskTreeFacade] Update status error:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Update task assignment with automatic audit logging
   * 
   * TODO: Implement using task_assignments table instead of direct field
   * The tasks table doesn't have an assigned_to field - assignments are managed
   * through the task_assignments join table
   *
   * @param taskId Task ID
   * @param assignedTo User/Team/Org ID to assign
   * @returns Promise<void>
   */
  async updateTaskAssignment(taskId: string, assignedTo: string | null): Promise<void> {
    throw new Error('updateTaskAssignment not yet implemented - requires task_assignments table integration');
    
    // TODO: Implementation should:
    // 1. Query task_assignments table
    // 2. Create/update assignment record
    // 3. Log activity via BlueprintActivityService
    // 4. Reload tasks to refresh state
  }

  /**
   * Update task hierarchy (parent and sequence order)
   * 
   * Implements Phase 2 (Task 2.1.3) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
   * 
   * @param taskId Task ID
   * @param newParentId New parent task ID (null for root)
   * @param newSequenceOrder New sequence order
   * @returns Promise<void>
   */
  async updateTaskHierarchy(
    taskId: string,
    newParentId: string | null,
    newSequenceOrder: number
  ): Promise<void> {
    const oldTask = this.tasks().find(t => t.id === taskId);
    if (!oldTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const blueprintId = this.currentBlueprintId();
    if (!blueprintId) {
      throw new Error('No blueprint ID set');
    }

    // Validate: prevent circular dependency
    if (newParentId && this.wouldCreateCircularDependency(taskId, newParentId)) {
      throw new Error('Circular dependency detected');
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // Update in database
      const update: TaskUpdate = {
        parent_task_id: newParentId,
        sequence_order: newSequenceOrder
      };
      await firstValueFrom(this.taskRepository.update(taskId, update));

      // Recalculate sibling orders if needed
      await this.recalculateSiblingOrders(newParentId);

      // Reload to get fresh data
      await this.reloadTasks();

      // Log activity
      const newTask = this.tasks().find(t => t.id === taskId);
      if (newTask && this.activityService) {
        try {
          await this.activityService.logActivity(
            blueprintId,
            'task',
            taskId,
            'hierarchy_changed',
            [
              { field: 'parent_task_id', oldValue: oldTask.parent_task_id, newValue: newParentId },
              { field: 'sequence_order', oldValue: oldTask.sequence_order, newValue: newSequenceOrder }
            ],
            {
              taskId,
              taskTitle: newTask.title || 'Unnamed Task',
              oldParentId: oldTask.parent_task_id,
              newParentId
            }
          );
        } catch (error) {
          console.error('[TaskTreeFacade] Failed to log hierarchy change:', error);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task hierarchy';
      this.errorState.set(errorMessage);
      console.error('[TaskTreeFacade] Update hierarchy error:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * Optimistically update task hierarchy with automatic rollback on failure
   * 
   * Implements Phase 2 (Task 2.2.1) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
   * 
   * @param taskId Task ID
   * @param newParentId New parent task ID (null for root)
   * @param newSequenceOrder New sequence order
   * @returns Promise<void>
   */
  async updateTaskHierarchyOptimistic(
    taskId: string,
    newParentId: string | null,
    newSequenceOrder: number
  ): Promise<void> {
    // Save current state for rollback
    const previousTasks = [...this.tasks()];

    // Optimistic update: immediately update local state
    const updatedTasks = this.tasks().map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          parent_task_id: newParentId,
          sequence_order: newSequenceOrder
        };
      }
      return task;
    });

    this.tasksState.set(updatedTasks);

    try {
      // Actual server update
      await this.updateTaskHierarchy(taskId, newParentId, newSequenceOrder);
    } catch (error) {
      // Rollback on failure
      this.tasksState.set(previousTasks);
      console.warn('[TaskTreeFacade] Hierarchy update failed, rolled back to previous state');
      throw error;
    }
  }

  /**
   * Select a task (for detail view or editing)
   *
   * @param taskId Task ID or null to deselect
   */
  selectTask(taskId: string | null): void {
    this.selectedTaskIdState.set(taskId);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * Check if moving taskId under newParentId would create circular dependency
   * 
   * Implements circular dependency detection for Phase 2 (Task 2.1.3)
   * 
   * @param taskId Task being moved
   * @param newParentId Proposed new parent
   * @returns true if circular dependency would be created
   * @private
   */
  private wouldCreateCircularDependency(taskId: string, newParentId: string): boolean {
    // Walk up the parent chain of newParentId
    let currentId: string | null = newParentId;
    const visited = new Set<string>();

    while (currentId) {
      if (currentId === taskId) {
        return true; // Circular dependency found
      }

      if (visited.has(currentId)) {
        break; // Already visited, avoid infinite loop
      }
      visited.add(currentId);

      const task = this.tasks().find(t => t.id === currentId);
      currentId = task?.parent_task_id || null;
    }

    return false;
  }

  /**
   * Recalculate sequence orders for siblings to ensure they are continuous
   * 
   * Implements Phase 2 (Task 2.2.2) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
   * 
   * @param parentId Parent task ID (null for root level)
   * @returns Promise<void>
   * @private
   */
  private async recalculateSiblingOrders(parentId: string | null): Promise<void> {
    const siblings = this.tasks()
      .filter(t => t.parent_task_id === parentId)
      .sort((a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0));

    if (siblings.length === 0) {
      return; // No siblings to recalculate
    }

    // Check if recalculation is needed
    const needsRecalculation = siblings.some((task, index) => task.sequence_order !== index);

    if (!needsRecalculation) {
      return; // Sequence orders are already correct
    }

    // Batch update
    const updates = siblings.map((task, index) => ({
      id: task.id,
      sequence_order: index
    }));

    try {
      await Promise.all(
        updates.map(update =>
          firstValueFrom(this.taskRepository.update(update.id, { sequence_order: update.sequence_order }))
        )
      );

      console.log(`[TaskTreeFacade] Recalculated ${updates.length} sibling orders for parent ${parentId || 'root'}`);
    } catch (error) {
      console.error('[TaskTreeFacade] Failed to recalculate sibling orders:', error);
      // Non-critical error, don't throw
    }
  }

  /**
   * Build hierarchical tree structure from flat task list
   *
   * Algorithm:
   * 1. Create a map of tasks by ID for O(1) lookup
   * 2. Iterate through all tasks
   * 3. For each task, find its parent and add to parent's children
   * 4. Return root tasks (those without parents)
   *
   * @param tasks Flat array of tasks
   * @returns Hierarchical tree structure
   * @private
   */
  private buildTree(tasks: Task[]): TaskTreeNode[] {
    if (tasks.length === 0) return [];

    // Create a map for O(1) lookup
    const taskMap = new Map<string, TaskTreeNode>();
    const rootNodes: TaskTreeNode[] = [];

    // First pass: Create TaskTreeNode for each task
    tasks.forEach(task => {
      const node: TaskTreeNode = {
        ...task,
        children: [],
        expanded: false
      };
      taskMap.set(task.id, node);
    });

    // Second pass: Build parent-child relationships
    tasks.forEach(task => {
      const node = taskMap.get(task.id);
      if (!node) return;

      if (task.parent_task_id) {
        // Has a parent - add to parent's children
        const parent = taskMap.get(task.parent_task_id);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        } else {
          // Parent not found - treat as root
          rootNodes.push(node);
        }
      } else {
        // No parent - this is a root node
        rootNodes.push(node);
      }
    });

    // Sort children by sequence_order
    const sortBySequenceOrder = (nodes: TaskTreeNode[]): void => {
      nodes.sort((a, b) => {
        const orderA = a.sequence_order ?? 0;
        const orderB = b.sequence_order ?? 0;
        return orderA - orderB;
      });

      // Recursively sort children
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortBySequenceOrder(node.children);
        }
      });
    };

    sortBySequenceOrder(rootNodes);

    return rootNodes;
  }
}
