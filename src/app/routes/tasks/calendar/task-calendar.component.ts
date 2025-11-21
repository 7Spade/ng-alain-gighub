import { Component, OnInit, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS, TaskService, Task, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="pageTitle()" [extra]="extraTemplate">
      <ng-template #extraTemplate>
        @if (currentBlueprintIds().length > 1) {
          <nz-select
            [ngModel]="selectedBlueprintId()"
            (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
            nzPlaceHolder="切换蓝图"
            style="width: 300px; margin-right: 8px;"
          >
            @for (blueprint of workspaceContext.contextBlueprints(); track blueprint.id) {
              <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
            }
          </nz-select>
        }
        @if (canCreate()) {
          <button nz-button nzType="primary" (click)="createTask()">
            <span nz-icon nzType="plus"></span>
            新建任务
          </button>
        }
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (workspaceContext.contextType() === 'app') {
        <nz-empty nzNotFoundContent="请先切换到用户、组织或团队视角"></nz-empty>
      } @else if (workspaceContext.loadingBlueprints()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large" nzTip="加载蓝图中..."></nz-spin>
        </div>
      } @else if (currentBlueprintIds().length === 0) {
        <nz-empty nzNotFoundContent="当前视角下没有蓝图">
          <ng-container nz-empty-footer>
            <button nz-button nzType="primary" (click)="createBlueprint()"> 创建蓝图 </button>
          </ng-container>
        </nz-empty>
      } @else if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large" nzTip="加载任务中..."></nz-spin>
        </div>
      } @else {
        <nz-calendar [ngModel]="selectedDate()" (nzSelectChange)="onDateSelect($event)" [nzFullscreen]="false">
          <ul *nzDateCell="let date" class="events">
            @for (task of getTasksForDate(date); track task.id) {
              <li
                [style.background-color]="getTaskColor(task)"
                [title]="task.title"
                (click)="viewTask(task.id)"
                style="cursor: pointer; padding: 2px 4px; margin: 2px 0; border-radius: 2px; color: white; font-size: 12px;"
              >
                {{ task.title }}
              </li>
            }
          </ul>
        </nz-calendar>

        <nz-divider nzText="选中日期的任务"></nz-divider>
        @if (tasksForSelectedDate().length === 0) {
          <nz-empty [nzNotFoundContent]="'该日期暂无任务'"></nz-empty>
        } @else {
          <nz-list [nzDataSource]="tasksForSelectedDate()" [nzRenderItem]="item">
            <ng-template #item let-task>
              <nz-list-item>
                <nz-list-item-meta [nzTitle]="task.title" [nzDescription]="task.description || '无描述'">
                  <ng-template #nzAvatar>
                    <nz-tag [nzColor]="getPriorityColor(task.priority)">{{ task.priority }}</nz-tag>
                  </ng-template>
                </nz-list-item-meta>
                <ul nz-list-item-actions>
                  <nz-list-item-action>
                    <button nz-button nzType="link" nzSize="small" (click)="viewTask(task.id)"> 查看 </button>
                  </nz-list-item-action>
                </ul>
              </nz-list-item>
            </ng-template>
          </nz-list>
        }
      }
    </nz-card>
  `
})
export class TaskCalendarComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // Signals for workspace context
  readonly selectedBlueprintId = signal<string | null>(null);
  readonly currentBlueprintIds = this.workspaceContext.currentBlueprintIds;
  readonly selectedDate = signal<Date>(new Date());

  // Computed page title with context
  readonly pageTitle = computed(() => {
    const contextLabel = this.workspaceContext.contextLabel();
    return `${contextLabel} - 任务日历`;
  });

  // Computed permission check
  readonly canCreate = computed(() => {
    const contextType = this.workspaceContext.contextType();
    return contextType === 'organization' || contextType === 'team' || contextType === 'user';
  });

  readonly tasksForSelectedDate = computed(() => {
    const date = this.selectedDate();
    return this.getTasksForDate(date);
  });

  constructor() {
    // Auto-load: respond to context and blueprint changes
    effect(() => {
      const blueprintIds = this.currentBlueprintIds();
      const contextType = this.workspaceContext.contextType();

      if (contextType !== 'app' && blueprintIds.length > 0) {
        // Auto-select first blueprint if not selected or current selection is invalid
        if (!this.selectedBlueprintId() || !blueprintIds.includes(this.selectedBlueprintId()!)) {
          this.selectedBlueprintId.set(blueprintIds[0]);
        }

        // Auto-load tasks for selected blueprint
        const blueprintId = this.selectedBlueprintId();
        if (blueprintId) {
          this.loadTasksForBlueprint(blueprintId);
        }
      }
    });
  }

  ngOnInit(): void {
    // Initialization handled by effect in constructor
  }

  async loadTasksForBlueprint(blueprintId: string): Promise<void> {
    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      this.message.error('加载任务列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (blueprintId) {
      await this.loadTasksForBlueprint(blueprintId);
    }
  }

  onDateSelect(date: Date): void {
    this.selectedDate.set(date);
  }

  getTasksForDate(date: Date): Task[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.taskService.tasks().filter(task => {
      const startDate = task.planned_start_date ? task.planned_start_date.split('T')[0] : null;
      const endDate = task.planned_end_date ? task.planned_end_date.split('T')[0] : null;
      return startDate === dateStr || endDate === dateStr || (startDate && endDate && dateStr >= startDate && dateStr <= endDate);
    });
  }

  getTaskColor(task: Task): string {
    switch (task.priority) {
      case 'urgent':
        return '#ff4d4f';
      case 'high':
        return '#ff9800';
      case 'medium':
        return '#1890ff';
      case 'low':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'green';
      default:
        return 'default';
    }
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  createBlueprint(): void {
    this.router.navigate(['/blueprints/create']);
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
