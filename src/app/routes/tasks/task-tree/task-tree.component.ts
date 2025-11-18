import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { SHARED_IMPORTS, Task, TaskTreeNode, TaskStatus } from '@shared';
import { TaskTreeFacade } from './task-tree.facade';
import { TaskTreeDragService } from './task-tree-drag.service';
import { TaskStatusSwitcherComponent } from './task-status-switcher/task-status-switcher.component';
import { TaskAssigneeSelectorComponent } from './task-assignee-selector/task-assignee-selector.component';
import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { AssignmentChangeEvent } from './task-assignment.types';
import { NzMessageService } from 'ng-zorro-antd/message';

interface NzTreeNodeOptions {
  title: string;
  key: string;
  icon?: string;
  isLeaf?: boolean;
  checked?: boolean;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  expanded?: boolean;
  children?: NzTreeNodeOptions[];
  [key: string]: unknown;
}

/**
 * Task Tree Component
 *
 * Displays tasks in a hierarchical tree structure
 * - Phase 1.1: Basic tree display with NzTree
 * - Phase 1.2: Expand/collapse functionality
 * - Phase 1.3: Task icons, names, and assignee display
 * - Phase 2.1: Drag-drop for hierarchy adjustment (CDK DragDrop integration)
 * - Phase 2.2: Optimistic updates with rollback
 * - Phase 3.1: Interactive status management
 * - Phase 3.2: Task assignment selector
 * - Phase 3.3: Realtime subscriptions
 * - Phase 5.1: Conflict resolution
 * - Phase 5.2: Connection status indicator
 *
 * Features:
 * - Signal-based reactive tree structure
 * - OnPush change detection for performance
 * - Facade pattern for business logic separation
 * - Automatic audit logging via TaskTreeFacade
 * - Drag-drop with circular dependency prevention
 * - Realtime updates via Supabase
 *
 * Implements Phases 2-3 from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 *
 * @example
 * Route: /tasks/tree
 */
@Component({
  selector: 'app-task-tree',
  standalone: true,
  imports: [
    SHARED_IMPORTS, 
    CdkDrag, 
    CdkDropList, 
    TaskStatusSwitcherComponent, 
    TaskAssigneeSelectorComponent,
    ConnectionStatusComponent
  ],
  providers: [TaskTreeDragService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.less']
})
export class TaskTreeComponent implements OnInit, OnDestroy {
  readonly facade = inject(TaskTreeFacade);
  readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly dragService = inject(TaskTreeDragService);

  // Blueprint selection
  readonly selectedBlueprintId = signal<string | null>(null);

  // Facade signals (exposed for template)
  readonly taskTree = this.facade.taskTree;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly taskStats = this.facade.taskStats;
  
  // Phase 5: Connection status signals
  readonly connectionStatus = this.facade.connectionStatus;
  readonly lastConnectionUpdate = this.facade.lastConnectionUpdate;
  readonly conflicts = this.facade.conflicts;
  
  // Reconnect function for connection status component
  readonly reconnectFn = (): void => {
    this.facade.reconnect();
  };

  // Expanded nodes tracking (for collapse/expand state)
  readonly expandedNodeIds = signal<Set<string>>(new Set());

  // Drag state
  readonly isDragging = signal<boolean>(false);
  readonly draggedNodeId = signal<string | null>(null);

  // NzTree data nodes
  readonly treeData = computed(() => {
    return this.convertToNzTreeData(this.taskTree());
  });

  ngOnInit(): void {
    // Load tasks if blueprint is available
    // TODO: Get blueprint from route params or user selection
    const blueprintId = this.getBlueprintIdFromRoute();
    if (blueprintId) {
      this.selectedBlueprintId.set(blueprintId);
      this.loadTasks(blueprintId);
    }
  }

  ngOnDestroy(): void {
    // Cleanup will be handled by facade if needed
    // Realtime subscriptions should be cleaned up here
  }

  /**
   * Load tasks for selected blueprint
   */
  async loadTasks(blueprintId: string): Promise<void> {
    try {
      await this.facade.loadTasks(blueprintId);
    } catch (error) {
      this.message.error('載入任務失敗');
      console.error('Failed to load tasks:', error);
    }
  }

  /**
   * Handle blueprint selection change
   */
  async onBlueprintChange(blueprintId: string): Promise<void> {
    this.selectedBlueprintId.set(blueprintId);
    await this.loadTasks(blueprintId);
  }

  /**
   * Handle tree node expand/collapse
   */
  onExpandChange(event: NzFormatEmitEvent): void {
    const nodeKey = event.node?.key;
    if (!nodeKey) return;

    const expanded = this.expandedNodeIds();
    if (event.node?.isExpanded) {
      expanded.add(nodeKey);
    } else {
      expanded.delete(nodeKey);
    }
    this.expandedNodeIds.set(new Set(expanded));
  }

  /**
   * Handle tree node click
   */
  onTreeNodeClick(event: NzFormatEmitEvent): void {
    const node = event.node?.origin;
    if (node && typeof node === 'object' && 'id' in node) {
      const id = (node as unknown as { id: string }).id;
      if (id) {
        this.router.navigate(['/tasks', id]);
      }
    }
  }

  /**
   * Handle drag-drop event
   * Phase 2.1.4: CDK DragDrop integration
   */
  async onDrop(event: CdkDragDrop<TaskTreeNode[]>): Promise<void> {
    console.log('[TaskTreeComponent] Drop event:', event);
    
    try {
      await this.dragService.handleDrop(event, this.taskTree());
    } catch (error) {
      // Error already handled by dragService with message
      console.error('[TaskTreeComponent] Drop failed:', error);
    } finally {
      this.isDragging.set(false);
      this.draggedNodeId.set(null);
    }
  }

  /**
   * Handle drag start
   */
  onDragStarted(node: TaskTreeNode): void {
    this.isDragging.set(true);
    this.draggedNodeId.set(node.id);
    console.log('[TaskTreeComponent] Drag started:', node.title);
  }

  /**
   * Handle drag end
   */
  onDragEnded(): void {
    this.isDragging.set(false);
    this.draggedNodeId.set(null);
  }

  /**
   * Handle task status change
   * Phase 3.1.3: Status switcher integration
   */
  async onStatusChange(event: { taskId: string; newStatus: string }): Promise<void> {
    try {
      await this.facade.updateTaskStatus(event.taskId, event.newStatus);
      this.message.success('任務狀態已更新');
    } catch (error) {
      this.message.error('更新失敗：' + (error as Error).message);
      console.error('[TaskTreeComponent] Status change failed:', error);
    }
  }

  /**
   * Handle task assignment change
   * 
   * Note: Facade updateTaskAssignment method requires task_assignments table integration
   * Current implementation logs the event pending full implementation.
   * 
   * Phase 3.2: Assignment integration
   */
  async onAssignmentChange(event: AssignmentChangeEvent): Promise<void> {
    try {
      console.log('[TaskTreeComponent] Assignment change:', event);
      
      // TODO: Uncomment when facade.updateTaskAssignment is fully implemented
      // await this.facade.updateTaskAssignment(event.taskId, event.assigneeId);
      
      // For now, just show success message (implementation pending)
      if (event.assigneeId) {
        this.message.success('任務已指派 (功能實作中)');
      } else {
        this.message.success('已取消指派 (功能實作中)');
      }
    } catch (error) {
      this.message.error('指派失敗：' + (error as Error).message);
      console.error('[TaskTreeComponent] Assignment change failed:', error);
    }
  }

  /**
   * Check if node can be dropped on target
   * Provides visual feedback during drag
   */
  canDropOn(nodeId: string): boolean {
    const draggedId = this.draggedNodeId();
    if (!draggedId || draggedId === nodeId) {
      return false;
    }
    return this.dragService.canDropOn(draggedId, nodeId, this.taskTree());
  }

  /**
   * Get status icon type
   */
  getStatusIcon(status: string | null): string {
    if (!status) return 'file';
    const iconMap: Record<string, string> = {
      pending: 'clock-circle',
      assigned: 'user',
      in_progress: 'sync',
      staging: 'save',
      in_qa: 'search',
      in_inspection: 'eye',
      completed: 'check-circle',
      cancelled: 'close-circle'
    };
    return iconMap[status] || 'file';
  }

  /**
   * Get status color
   */
  getStatusColor(status: string | null): string {
    if (!status) return 'default';
    const colorMap: Record<string, string> = {
      pending: 'default',
      assigned: 'blue',
      in_progress: 'processing',
      staging: 'warning',
      in_qa: 'orange',
      in_inspection: 'purple',
      completed: 'success',
      cancelled: 'error'
    };
    return colorMap[status] || 'default';
  }

  /**
   * Get status label (Chinese)
   */
  getStatusLabel(status: string | null): string {
    if (!status) return '未知';
    const labelMap: Record<string, string> = {
      pending: '待處理',
      assigned: '已指派',
      in_progress: '進行中',
      staging: '暫存中',
      in_qa: '品管中',
      in_inspection: '驗收中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return labelMap[status] || status;
  }

  /**
   * Convert TaskTreeNode[] to NzTree compatible data
   */
  private convertToNzTreeData(nodes: TaskTreeNode[]): NzTreeNodeOptions[] {
    return nodes.map(node => this.taskNodeToTreeNode(node));
  }

  /**
   * Convert single TaskTreeNode to NzTreeNodeOptions
   */
  private taskNodeToTreeNode(node: TaskTreeNode): NzTreeNodeOptions {
    return {
      title: node.title || 'Untitled Task',
      key: node.id,
      icon: this.getStatusIcon(node.status),
      expanded: this.expandedNodeIds().has(node.id),
      isLeaf: !node.children || node.children.length === 0,
      origin: node, // Store original node data
      children: node.children ? node.children.map(child => this.taskNodeToTreeNode(child)) : []
    };
  }

  /**
   * Get blueprint ID from route params or query
   * TODO: Implement actual route param extraction
   */
  private getBlueprintIdFromRoute(): string | null {
    // For now, return null - will be implemented with actual routing
    return null;
  }
}
