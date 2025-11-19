import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Injectable, inject } from '@angular/core';
import { TaskTreeNode } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TaskTreeFacade } from './task-tree.facade';

/**
 * Task Tree Drag Service
 *
 * Handles drag-drop logic for task tree operations
 * - Validates drop legality (prevents circular dependencies)
 * - Calculates new parent task and sorting
 * - Triggers Facade updates with optimistic UI
 * - Provides visual feedback for invalid operations
 *
 * Implements Phase 2 (Task 2.1-2.2) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 */
@Injectable()
export class TaskTreeDragService {
  private facade = inject(TaskTreeFacade);
  private message = inject(NzMessageService);

  /**
   * Handle drop event from CDK DragDrop
   *
   * @param event CDK DragDrop event
   * @param containerTasks Tasks in the drop container
   */
  async handleDrop(event: CdkDragDrop<TaskTreeNode[]>, containerTasks: TaskTreeNode[]): Promise<void> {
    // Step 1: Extract drag information
    const draggedNode = event.item.data as TaskTreeNode;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    console.log('[DragService] Drop event:', {
      draggedNodeId: draggedNode.id,
      draggedNodeTitle: draggedNode.title,
      previousIndex,
      currentIndex,
      containerLength: containerTasks.length
    });

    // Step 2: If dropped in same position, do nothing
    if (previousIndex === currentIndex && event.previousContainer === event.container) {
      console.log('[DragService] Dropped in same position, skipping');
      return;
    }

    // Step 3: Calculate new parent and sequence order
    const { newParentId, newSequenceOrder } = this.calculateNewPosition(draggedNode, containerTasks, currentIndex);

    // Step 4: Validate drop legality
    if (newParentId && !this.isValidDrop(draggedNode.id, newParentId, containerTasks)) {
      this.message.error('無法移動：會造成循環依賴');
      console.warn('[DragService] Invalid drop: circular dependency detected');
      return;
    }

    // Step 5: Execute optimistic update
    try {
      await this.facade.updateTaskHierarchyOptimistic(draggedNode.id, newParentId, newSequenceOrder);
      this.message.success('任務位置已更新');
    } catch (error) {
      this.message.error('更新失敗，請重試');
      console.error('[DragService] Update failed:', error);
    }
  }

  /**
   * Calculate new parent ID and sequence order based on drop position
   *
   * @private
   */
  private calculateNewPosition(
    draggedNode: TaskTreeNode,
    containerTasks: TaskTreeNode[],
    dropIndex: number
  ): { newParentId: string | null; newSequenceOrder: number } {
    // If dropped at the beginning
    if (dropIndex === 0) {
      const firstTask = containerTasks[0];
      return {
        newParentId: firstTask?.parent_task_id || null,
        newSequenceOrder: 0
      };
    }

    // Get the task before drop position
    const taskBefore = containerTasks[dropIndex - 1];

    if (!taskBefore) {
      return {
        newParentId: null,
        newSequenceOrder: dropIndex
      };
    }

    // Same parent as task before
    return {
      newParentId: taskBefore.parent_task_id || null,
      newSequenceOrder: (taskBefore.sequence_order ?? 0) + 1
    };
  }

  /**
   * Validate if drop operation is legal
   * Prevents circular dependencies: child cannot become ancestor of itself
   *
   * @private
   */
  private isValidDrop(taskId: string, newParentId: string, allTasks: TaskTreeNode[]): boolean {
    // Cannot make a task its own parent
    if (taskId === newParentId) {
      return false;
    }

    // Check if newParentId is a descendant of taskId
    return !this.isDescendant(newParentId, taskId, allTasks);
  }

  /**
   * Check if potentialDescendantId is a descendant of ancestorId
   * Uses breadth-first search to detect circular dependency
   *
   * @private
   */
  private isDescendant(potentialDescendantId: string, ancestorId: string, allTasks: TaskTreeNode[]): boolean {
    const visited = new Set<string>();
    let currentId: string | null = potentialDescendantId;

    // Walk up the parent chain
    while (currentId) {
      if (currentId === ancestorId) {
        return true; // Circular dependency found
      }

      if (visited.has(currentId)) {
        break; // Already visited, avoid infinite loop
      }
      visited.add(currentId);

      // Find parent
      const currentNode = allTasks.find(n => n.id === currentId);
      currentId = currentNode?.parent_task_id || null;
    }

    return false;
  }

  /**
   * Check if a node can be dropped on a specific target
   * Used for visual feedback during drag
   *
   * @param dragNodeId ID of the node being dragged
   * @param dropTargetId ID of the potential drop target
   * @param allTasks All tasks for circular dependency check
   */
  canDropOn(dragNodeId: string, dropTargetId: string, allTasks: TaskTreeNode[]): boolean {
    return this.isValidDrop(dragNodeId, dropTargetId, allTasks);
  }
}
