import { Component, OnInit, OnDestroy, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import {
  SHARED_IMPORTS,
  TaskService,
  Task,
  TaskStatus,
  TaskType,
  TaskPriority,
  BlueprintService,
  Blueprint,
  TaskStagingService,
  AuthStateService
} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'任务列表'" [extra]="extraTemplate">
      <ng-template #extraTemplate>
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任务
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="任务列表" style="margin-top: 16px;">
      <!-- Blueprint and Filters -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>选择蓝图</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="selectedBlueprintId()"
              (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
              nzPlaceHolder="请选择蓝图"
              style="width: 250px;"
            >
              @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
                <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        @if (selectedBlueprintId()) {
          <nz-form-item style="margin-bottom: 0;">
            <nz-form-label>状态</nz-form-label>
            <nz-form-control>
              <nz-select
                [ngModel]="filterStatus()"
                (ngModelChange)="filterStatus.set($event)"
                nzPlaceHolder="全部状态"
                nzAllowClear
                style="width: 150px;"
              >
                <nz-option nzValue="pending" nzLabel="待处理"></nz-option>
                <nz-option nzValue="assigned" nzLabel="已指派"></nz-option>
                <nz-option nzValue="in_progress" nzLabel="进行中"></nz-option>
                <nz-option nzValue="staging" nzLabel="暂存中"></nz-option>
                <nz-option nzValue="in_qa" nzLabel="品管中"></nz-option>
                <nz-option nzValue="in_inspection" nzLabel="验收中"></nz-option>
                <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
                <nz-option nzValue="cancelled" nzLabel="已取消"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item style="margin-bottom: 0;">
            <nz-form-label>优先级</nz-form-label>
            <nz-form-control>
              <nz-select
                [ngModel]="filterPriority()"
                (ngModelChange)="filterPriority.set($event)"
                nzPlaceHolder="全部优先级"
                nzAllowClear
                style="width: 120px;"
              >
                <nz-option nzValue="low" nzLabel="低"></nz-option>
                <nz-option nzValue="medium" nzLabel="中"></nz-option>
                <nz-option nzValue="high" nzLabel="高"></nz-option>
                <nz-option nzValue="urgent" nzLabel="紧急"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item style="margin-bottom: 0;">
            <nz-form-label>类型</nz-form-label>
            <nz-form-control>
              <nz-select
                [ngModel]="filterType()"
                (ngModelChange)="filterType.set($event)"
                nzPlaceHolder="全部类型"
                nzAllowClear
                style="width: 120px;"
              >
                <nz-option nzValue="milestone" nzLabel="里程碑"></nz-option>
                <nz-option nzValue="phase" nzLabel="阶段"></nz-option>
                <nz-option nzValue="task" nzLabel="任务"></nz-option>
                <nz-option nzValue="subtask" nzLabel="子任务"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        }
      </div>

      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else {
        <st
          #st
          [data]="filteredTasks()"
          [columns]="columns"
          [loading]="taskService.loading()"
          [page]="{ front: false, show: true, showSize: true }"
          (change)="onTableChange()"
        >
          <ng-template #type let-record>
            @switch (record.task_type) {
              @case ('milestone') {
                <nz-tag nzColor="purple">里程碑</nz-tag>
              }
              @case ('phase') {
                <nz-tag nzColor="blue">阶段</nz-tag>
              }
              @case ('task') {
                <nz-tag nzColor="cyan">任务</nz-tag>
              }
              @case ('subtask') {
                <nz-tag nzColor="default">子任务</nz-tag>
              }
            }
          </ng-template>

          <ng-template #status let-record>
            @switch (record.status) {
              @case ('pending') {
                <nz-tag nzColor="default">待处理</nz-tag>
              }
              @case ('assigned') {
                <nz-tag nzColor="blue">已指派</nz-tag>
              }
              @case ('in_progress') {
                <nz-tag nzColor="processing">进行中</nz-tag>
              }
              @case ('staging') {
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <nz-tag nzColor="orange">暂存中</nz-tag>
                  @if (stagingInfo()[record.id]) {
                    <small style="color: #ff7a45;"> 剩余 {{ stagingInfo()[record.id].remainingHours }}h </small>
                  }
                </div>
              }
              @case ('in_qa') {
                <nz-tag nzColor="gold">品管中</nz-tag>
              }
              @case ('in_inspection') {
                <nz-tag nzColor="lime">验收中</nz-tag>
              }
              @case ('completed') {
                <nz-tag nzColor="success">已完成</nz-tag>
              }
              @case ('cancelled') {
                <nz-tag nzColor="error">已取消</nz-tag>
              }
            }
          </ng-template>

          <ng-template #priority let-record>
            @switch (record.priority) {
              @case ('low') {
                <nz-tag nzColor="default">低</nz-tag>
              }
              @case ('medium') {
                <nz-tag nzColor="blue">中</nz-tag>
              }
              @case ('high') {
                <nz-tag nzColor="orange">高</nz-tag>
              }
              @case ('urgent') {
                <nz-tag nzColor="red">紧急</nz-tag>
              }
            }
          </ng-template>

          <ng-template #statusActions let-record>
            @if (record.status !== 'completed' && record.status !== 'cancelled') {
              <button nz-button nzType="link" nz-dropdown [nzDropdownMenu]="statusMenu" nzSize="small">
                变更状态
                <span nz-icon nzType="down"></span>
              </button>
              <nz-dropdown-menu #statusMenu="nzDropdownMenu">
                <ul nz-menu>
                  @for (status of allowedStatuses()[record.id]; track status) {
                    <li nz-menu-item (click)="changeTaskStatus(record.id, status)">
                      {{ getStatusLabel(status) }}
                    </li>
                  }
                  @if (!allowedStatuses()[record.id] || allowedStatuses()[record.id].length === 0) {
                    <li nz-menu-item nzDisabled>无可用转换</li>
                  }
                </ul>
              </nz-dropdown-menu>
            }
          </ng-template>

          <ng-template #stagingActions let-record>
            @if (record.status === 'staging' && stagingInfo()[record.id]?.canWithdraw) {
              <button nz-button nzType="link" nzDanger nzSize="small" (click)="withdrawStaging(record.id)"> 撤回 </button>
            }
          </ng-template>
        </st>
      }
    </nz-card>
  `
})
export class TaskListComponent implements OnInit, OnDestroy {
  taskService = inject(TaskService);
  blueprintService = inject(BlueprintService);
  taskStagingService = inject(TaskStagingService);
  authState = inject(AuthStateService);
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  selectedBlueprintId = signal<string | null>(null);
  filterStatus = signal<TaskStatus | null>(null);
  filterPriority = signal<TaskPriority | null>(null);
  filterType = signal<TaskType | null>(null);

  // Staging info map: taskId -> { remainingHours, canWithdraw, stagingId }
  stagingInfo = signal<Record<string, { remainingHours: number; canWithdraw: boolean; stagingId: string }>>({});

  // Allowed statuses map: taskId -> TaskStatus[]
  allowedStatuses = signal<Record<string, TaskStatus[]>>({});

  // Computed filtered tasks
  filteredTasks = computed(() => {
    let tasks = this.taskService.tasks();

    if (this.filterStatus()) {
      tasks = tasks.filter(t => t.status === this.filterStatus());
    }

    if (this.filterPriority()) {
      tasks = tasks.filter(t => t.priority === this.filterPriority());
    }

    if (this.filterType()) {
      tasks = tasks.filter(t => t.task_type === this.filterType());
    }

    return tasks;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 250 },
    { title: '类型', index: 'task_type', width: 100, render: 'type' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '优先级', index: 'priority', width: 100, render: 'priority' },
    { title: '计划开始', index: 'planned_start_date', type: 'date', width: 120 },
    { title: '计划结束', index: 'planned_end_date', type: 'date', width: 120 },
    { title: '进度', index: 'progress_percentage', width: 100, format: (item: Task) => `${item.progress_percentage || 0}%` },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 320,
      buttons: [
        {
          text: '查看',
          click: (record: Task) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Task) => this.edit(record.id)
        },
        {
          text: '变更状态',
          type: 'none',
          render: 'statusActions'
        },
        {
          text: '暂存操作',
          type: 'none',
          render: 'stagingActions',
          iif: (record: Task) => record.status === 'staging'
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: Task) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadBlueprints();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (blueprintId) {
      try {
        await this.taskService.loadTasksByBlueprint(blueprintId);
        await this.loadStagingInfo();
        await this.loadAllowedStatuses();
      } catch (error) {
        this.message.error('加载任务列表失败');
      }
    }
  }

  /**
   * Load staging information for all staging tasks
   */
  async loadStagingInfo(): Promise<void> {
    const stagingTasks = this.taskService.stagingTasks();
    const info: Record<string, { remainingHours: number; canWithdraw: boolean; stagingId: string }> = {};

    for (const task of stagingTasks) {
      try {
        await this.taskStagingService.loadStagingByTaskId(task.id);
        const stagingItems = this.taskStagingService.stagingItems();
        const stagingItem = stagingItems.find(s => s.task_id === task.id);

        if (stagingItem) {
          const now = new Date();
          const expiresAt = new Date(stagingItem.expires_at);
          const remainingMs = expiresAt.getTime() - now.getTime();
          const remainingHours = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60)));

          const canWithdraw = await this.taskStagingService.canWithdraw(stagingItem.id);

          info[task.id] = {
            remainingHours,
            canWithdraw,
            stagingId: stagingItem.id
          };
        }
      } catch (error) {
        console.error(`Failed to load staging info for task ${task.id}:`, error);
      }
    }

    this.stagingInfo.set(info);
  }

  /**
   * Load allowed next statuses for all tasks
   */
  async loadAllowedStatuses(): Promise<void> {
    const tasks = this.taskService.tasks();
    const allowed: Record<string, TaskStatus[]> = {};

    for (const task of tasks) {
      try {
        const statuses = await this.taskService.getAllowedNextStatuses(task.id);
        allowed[task.id] = statuses;
      } catch (error) {
        console.error(`Failed to load allowed statuses for task ${task.id}:`, error);
        allowed[task.id] = [];
      }
    }

    this.allowedStatuses.set(allowed);
  }

  /**
   * Change task status
   */
  async changeTaskStatus(taskId: string, newStatus: TaskStatus): Promise<void> {
    try {
      await this.taskService.updateTaskStatus(taskId, newStatus);
      this.message.success('状态更新成功');

      // Reload staging info if transitioning to/from staging
      await this.loadStagingInfo();
      await this.loadAllowedStatuses();
    } catch (error) {
      this.message.error(error instanceof Error ? error.message : '状态更新失败');
    }
  }

  /**
   * Withdraw task from staging
   */
  async withdrawStaging(taskId: string): Promise<void> {
    const info = this.stagingInfo()[taskId];
    if (!info) {
      this.message.error('找不到暂存信息');
      return;
    }

    const currentUser = this.authState.user();
    if (!currentUser) {
      this.message.error('未登录用户无法执行此操作');
      return;
    }

    try {
      await this.taskStagingService.withdrawStaging(info.stagingId, currentUser.id);
      this.message.success('撤回成功');

      // Reload data
      await this.onBlueprintChange();
    } catch (error) {
      this.message.error(error instanceof Error ? error.message : '撤回失败');
    }
  }

  /**
   * Get status label in Chinese
   */
  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: '待处理',
      [TaskStatus.ASSIGNED]: '已指派',
      [TaskStatus.IN_PROGRESS]: '进行中',
      [TaskStatus.STAGING]: '暂存中',
      [TaskStatus.IN_QA]: '品管中',
      [TaskStatus.IN_INSPECTION]: '验收中',
      [TaskStatus.COMPLETED]: '已完成',
      [TaskStatus.CANCELLED]: '已取消'
    };
    return labels[status] || status;
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.taskService.deleteTask(id);
      this.message.success('删除成功');
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}
