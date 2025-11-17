import { Injectable, inject, signal, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { TaskRepository, type Task, type TaskUpdate } from '@core';
import { BlueprintActivityService } from '@shared';
import { type TaskTreeNode } from '@shared/models/task.models';

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
      if (newTask) {
        await this.activityService.logTaskChange(
          {
            id: newTask.id,
            blueprintId: blueprintId,
            name: newTask.name || 'Unnamed Task',
            status: newTask.status
          },
          'updated',
          {
            id: oldTask.id,
            status: oldTask.status
          }
        );
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
   * @param taskId Task ID
   * @param assignedTo User/Team/Org ID to assign
   * @returns Promise<void>
   */
  async updateTaskAssignment(taskId: string, assignedTo: string | null): Promise<void> {
    const oldTask = this.tasks().find(t => t.id === taskId);
    if (!oldTask) {
      throw new Error(`Task not found: ${taskId}`);
    }

    if (oldTask.assigned_to === assignedTo) {
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
        assigned_to: assignedTo
      };
      await firstValueFrom(this.taskRepository.update(taskId, update));

      // Reload to get fresh data
      await this.reloadTasks();

      // Log activity
      const newTask = this.tasks().find(t => t.id === taskId);
      if (newTask) {
        await this.activityService.logTaskChange(
          {
            id: newTask.id,
            blueprintId: blueprintId,
            name: newTask.name || 'Unnamed Task',
            assigned_to: newTask.assigned_to
          },
          'updated',
          {
            id: oldTask.id,
            assigned_to: oldTask.assigned_to
          }
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task assignment';
      this.errorState.set(errorMessage);
      console.error('[TaskTreeFacade] Update assignment error:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
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
