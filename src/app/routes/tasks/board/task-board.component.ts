import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS, TaskService, Task, TaskStatus, BlueprintService } from '@shared';
import { WorkspaceContextFacade } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务看板'" [extra]="extraTemplate">
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
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任务
        </button>
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
            <button nz-button nzType="primary" (click)="createBlueprint()">
              创建蓝图
            </button>
          </ng-container>
        </nz-empty>
      } @else if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large" nzTip="加载任务中..."></nz-spin>
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
  readonly blueprintService = inject(BlueprintService);
  readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly currentBlueprintIds = this.workspaceContext.currentBlueprintIds;

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
    // 自动加载：监听视角变化和蓝图变化
    effect(() => {
      const blueprintIds = this.currentBlueprintIds();
      const contextType = this.workspaceContext.contextType();

      if (contextType !== 'app' && blueprintIds.length > 0) {
        // 自动选择第一个蓝图（如果还没有选择）
        if (!this.selectedBlueprintId() || !blueprintIds.includes(this.selectedBlueprintId()!)) {
          this.selectedBlueprintId.set(blueprintIds[0]);
        }

        // 自动加载任务
        const blueprintId = this.selectedBlueprintId();
        if (blueprintId) {
          this.loadTasksForBlueprint(blueprintId);
        }
      }
      // 注意：app 视角下不清空任务，保持上次加载的状态
    });
  }

  ngOnInit(): void {
    // 初始化不需要做任何事，effect 会自动处理
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
