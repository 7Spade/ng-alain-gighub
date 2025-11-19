import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TaskAssignmentRepository } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, Task, TaskAssignment, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-task-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务分配'">
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
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else {
        <st #st [data]="assignments()" [columns]="columns" [loading]="loading()" [page]="{ front: false, show: true, showSize: true }">
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
  private readonly taskAssignmentRepository = inject(TaskAssignmentRepository);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly assignments = signal<TaskAssignment[]>([]);

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

      this.assignments.set(allAssignments);
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
