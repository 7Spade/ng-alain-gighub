import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TaskAssignmentRepository, WorkspaceContextFacade } from '@core';
import { STColumn } from '@delon/abc/st';
import { BlueprintService, SHARED_IMPORTS, TaskAssignment, TaskAssignmentService, TaskService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务分配'">
      <ng-template #extra>
        @if (!isUserContext()) {
          <nz-select
            [ngModel]="selectedBlueprintId()"
            (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
            nzPlaceHolder="请选择蓝图"
            style="width: 300px; margin-right: 8px;"
          >
            @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
              <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
            }
          </nz-select>
        }
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!isUserContext() && !selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading() || (isUserContext() && taskAssignmentService.loading())) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (assignments().length === 0) {
        <nz-empty nzNotFoundContent="暂无任务分配"></nz-empty>
      } @else {
        <st
          #st
          [data]="assignments()"
          [columns]="columns"
          [loading]="loading() || (isUserContext() && taskAssignmentService.loading())"
          [page]="{ front: false, show: true, showSize: true }"
        >
          <ng-template #assigneeType let-record>
            @switch (record.assignee_type) {
              @case ('user') {
                <nz-tag nzColor="blue">用户</nz-tag>
              }
              @case ('team') {
                <nz-tag nzColor="green">团队</nz-tag>
              }
              @case ('organization') {
                <nz-tag nzColor="purple">组织</nz-tag>
              }
              @case ('contractor') {
                <nz-tag nzColor="orange">承包商</nz-tag>
              }
            }
          </ng-template>
        </st>
      }
    </nz-card>
  `
})
export class TaskAssignmentsComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  readonly taskAssignmentService = inject(TaskAssignmentService);
  private readonly taskAssignmentRepository = inject(TaskAssignmentRepository);
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly isUserContext = computed(() => this.contextFacade.contextType() === 'user');
  readonly assignments = computed(() => {
    if (this.isUserContext()) {
      // 个人视角：使用 TaskAssignmentService 的状态
      return this.taskAssignmentService.assignments();
    }
    // 其他视角：使用本地状态
    return this.localAssignments();
  });
  private readonly localAssignments = signal<TaskAssignment[]>([]);

  columns: STColumn[] = [
    { title: '任务ID', index: 'task_id', width: 120 },
    { title: '任务标题', index: 'task_title', width: 200, format: (item: TaskAssignment) => this.getTaskTitle(item.task_id) },
    { title: '指派对象ID', index: 'assignee_id', width: 120 },
    { title: '指派类型', index: 'assignee_type', width: 100, render: 'assigneeType' },
    { title: '指派者ID', index: 'assigned_by', width: 120 },
    { title: '指派时间', index: 'assigned_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看任务',
          click: (record: TaskAssignment) => this.viewTask(record.task_id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    // 如果是个人视角，自动加载用户的任务分配
    if (this.isUserContext()) {
      this.loadUserAssignments();
    } else {
      // 其他视角需要选择蓝图
      this.loadBlueprints();
    }
  }

  /**
   * 加载用户的任务分配（个人视角）
   */
  async loadUserAssignments(): Promise<void> {
    const currentUserAccountId = this.contextFacade.currentUserAccountId();
    if (!currentUserAccountId) {
      this.message.warning('无法获取当前用户信息');
      return;
    }

    try {
      // 加载用户的所有任务分配
      await this.taskAssignmentService.loadByAssigneeId(currentUserAccountId);

      // 加载相关任务信息（用于显示任务标题）
      const assignments = this.taskAssignmentService.assignments();
      const taskIds = assignments.map(a => a.task_id);
      if (taskIds.length > 0) {
        await this.taskService.loadTasksByIds(taskIds);
      }
    } catch (error) {
      console.error('加载用户任务分配失败:', error);
      this.message.error('加载任务分配失败');
    }
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
    if (!blueprintId) return;

    this.loading.set(true);
    try {
      // 先加载任务列表
      await this.taskService.loadTasksByBlueprint(blueprintId);

      // 然后加载所有任务的分配信息
      const tasks = this.taskService.tasks();
      const assignmentPromises = tasks.map(task => firstValueFrom(this.taskAssignmentRepository.findByTaskId(task.id)));
      const assignmentArrays = await Promise.all(assignmentPromises);
      const allAssignments = assignmentArrays.flat();

      this.localAssignments.set(allAssignments);
    } catch (error) {
      this.message.error('加载任务分配失败');
    } finally {
      this.loading.set(false);
    }
  }

  getTaskTitle(taskId: string): string {
    const task = this.taskService.tasks().find(t => t.id === taskId);
    return task?.title || taskId;
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }
}
