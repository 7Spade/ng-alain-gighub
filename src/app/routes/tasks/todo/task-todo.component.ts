import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TaskAssignmentRepository } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, Task, TaskStatus, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-todo',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'待办列表'">
      <ng-template #extra>
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
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
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
  private readonly taskAssignmentRepository = inject(TaskAssignmentRepository);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly currentUserId = signal<string>('current-user-id'); // TODO: 从认证服务获取

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
    this.loadBlueprints();
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
