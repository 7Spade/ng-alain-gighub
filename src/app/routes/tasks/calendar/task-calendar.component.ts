import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS, TaskService, Task } from '@shared';
import { BranchContextService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务日历'" [extra]="extraTemplate">
      <ng-template #extraTemplate>
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任务
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!currentBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
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
  private readonly branchContext = inject(BranchContextService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 從 BranchContextService 獲取當前藍圖 ID
  readonly currentBlueprintId = this.branchContext.currentBlueprintId;
  readonly selectedDate = signal<Date>(new Date());

  readonly tasksForSelectedDate = computed(() => {
    const date = this.selectedDate();
    return this.getTasksForDate(date);
  });

  constructor() {
    // 監聽藍圖變更，自動載入任務
    effect(() => {
      const blueprintId = this.currentBlueprintId();
      if (blueprintId) {
        this.loadTasks(blueprintId);
      }
    });
  }

  ngOnInit(): void {
    // ngOnInit 保持空實現，任務載入由 effect 處理
  }

  async loadTasks(blueprintId: string): Promise<void> {
    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      this.message.error('加载任务列表失败');
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

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
