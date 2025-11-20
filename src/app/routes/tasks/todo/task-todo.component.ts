import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TaskAssignmentRepository, WorkspaceContextFacade } from '@core';
import { STColumn } from '@delon/abc/st';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { BlueprintService, SHARED_IMPORTS, Task, TaskAssignmentService, TaskService, TaskStatus } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-todo',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'待办列表'">
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
      } @else if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (todoTasks().length === 0) {
        <nz-empty nzNotFoundContent="暂无待办任务"></nz-empty>
      } @else {
        <st
          #st
          [data]="todoTasks()"
          [columns]="columns"
          [loading]="taskService.loading()"
          [page]="{ front: false, show: true, showSize: true }"
        >
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
                <nz-tag nzColor="orange">暂存中</nz-tag>
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
        </st>
      }
    </nz-card>
  `
})
export class TaskTodoComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  readonly taskAssignmentService = inject(TaskAssignmentService);
  private readonly taskAssignmentRepository = inject(TaskAssignmentRepository);
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly isUserContext = computed(() => this.contextFacade.contextType() === 'user');

  readonly todoTasks = computed(() => {
    const tasks = this.taskService.tasks();
    // 过滤出待办任务（待处理、已指派、进行中）
    return tasks.filter(
      task => task.status === TaskStatus.PENDING || task.status === TaskStatus.ASSIGNED || task.status === TaskStatus.IN_PROGRESS
    );
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 250 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '优先级', index: 'priority', width: 100, render: 'priority' },
    { title: '计划开始', index: 'planned_start_date', type: 'date', width: 120 },
    { title: '计划结束', index: 'planned_end_date', type: 'date', width: 120 },
    { title: '进度', index: 'progress_percentage', width: 100, format: (item: Task) => `${item.progress_percentage || 0}%` },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: Task) => this.viewTask(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    // 如果是个人视角，自动加载用户的待办任务
    if (this.isUserContext()) {
      this.loadUserTodos();
    } else {
      // 其他视角需要选择蓝图
      this.loadBlueprints();
    }
  }

  /**
   * 加载用户的待办任务（个人视角）
   */
  async loadUserTodos(): Promise<void> {
    const currentUserAccountId = this.contextFacade.currentUserAccountId();
    if (!currentUserAccountId) {
      this.message.warning('无法获取当前用户信息');
      return;
    }

    try {
      // 加载用户的所有任务分配（assignee_type = 'user'）
      await this.taskAssignmentService.loadByAssigneeId(currentUserAccountId);
      const assignments = this.taskAssignmentService.assignments();

      // 获取所有任务 ID
      const taskIds = assignments.map(a => a.task_id);

      if (taskIds.length === 0) {
        // 没有任务分配，清空任务列表
        await this.taskService.loadTasksByIds([]);
        return;
      }

      // 批量加载所有任务
      await this.taskService.loadTasksByIds(taskIds);

      // 过滤逻辑在 computed todoTasks 中处理
    } catch (error) {
      console.error('加载用户待办任务失败:', error);
      this.message.error('加载待办列表失败');
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
    if (blueprintId) {
      try {
        await this.taskService.loadTasksByBlueprint(blueprintId);
      } catch (error) {
        this.message.error('加载待办列表失败');
      }
    }
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
