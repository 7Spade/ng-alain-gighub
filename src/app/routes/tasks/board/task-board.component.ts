import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS, TaskService, Task, TaskStatus } from '@shared';
import { BranchContextService } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务看板'" [extra]="extraTemplate">
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
        <div nz-row [nzGutter]="16">
          @for (column of boardColumns; track column.status) {
            <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="6">
              <nz-card [nzTitle]="column.title" [nzBordered]="true" style="margin-bottom: 16px;">
                @for (task of column.tasks(); track task.id) {
                  <nz-card
                    [nzType]="'inner'"
                    [nzTitle]="task.title"
                    style="margin-bottom: 8px; cursor: pointer;"
                    (click)="viewTask(task.id)"
                  >
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      {{ task.description || '无描述' }}
                    </p>
                    <div style="margin-top: 8px;">
                      @switch (task.priority) {
                        @case ('low') {
                          <nz-tag nzColor="default" nzSize="small">低</nz-tag>
                        }
                        @case ('medium') {
                          <nz-tag nzColor="blue" nzSize="small">中</nz-tag>
                        }
                        @case ('high') {
                          <nz-tag nzColor="orange" nzSize="small">高</nz-tag>
                        }
                        @case ('urgent') {
                          <nz-tag nzColor="red" nzSize="small">紧急</nz-tag>
                        }
                      }
                      <nz-progress
                        [nzPercent]="task.progress_percentage || 0"
                        [nzShowInfo]="false"
                        [nzSize]="'small'"
                        style="margin-top: 4px;"
                      ></nz-progress>
                    </div>
                  </nz-card>
                } @empty {
                  <nz-empty [nzNotFoundContent]="'暂无任务'"></nz-empty>
                }
              </nz-card>
            </div>
          }
        </div>
      }
    </nz-card>
  `
})
export class TaskBoardComponent implements OnInit {
  readonly taskService = inject(TaskService);
  private readonly branchContext = inject(BranchContextService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 從 BranchContextService 獲取當前藍圖 ID
  readonly currentBlueprintId = this.branchContext.currentBlueprintId;

  readonly boardColumns = [
    {
      title: '待处理',
      status: TaskStatus.PENDING,
      tasks: computed(() => this.taskService.tasks().filter(t => t.status === TaskStatus.PENDING))
    },
    {
      title: '进行中',
      status: TaskStatus.IN_PROGRESS,
      tasks: computed(() => this.taskService.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS))
    },
    {
      title: '暂存中',
      status: TaskStatus.STAGING,
      tasks: computed(() => this.taskService.tasks().filter(t => t.status === TaskStatus.STAGING))
    },
    {
      title: '已完成',
      status: TaskStatus.COMPLETED,
      tasks: computed(() => this.taskService.tasks().filter(t => t.status === TaskStatus.COMPLETED))
    }
  ];

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

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
