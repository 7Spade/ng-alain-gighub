import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, TaskService, Task, TaskStatus, TaskType, TaskPriority, BlueprintService, Blueprint } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createTask()">
          <span nz-icon nzType="plus"></span>
          新建任务
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="任务列表" style="margin-top: 16px;">
      <div style="margin-bottom: 16px;">
        <nz-form-item>
          <nz-form-label>选择蓝图</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="selectedBlueprintId()"
              (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
              nzPlaceHolder="请选择蓝图"
              style="width: 300px;"
            >
              @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
                <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else {
        <st
          #st
          [data]="taskService.tasks()"
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
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  blueprintService = inject(BlueprintService);
  router = inject(Router);
  message = inject(NzMessageService);

  selectedBlueprintId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 250 },
    { title: '类型', index: 'task_type', width: 100, render: 'type' },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '优先级', index: 'priority', width: 100, render: 'priority' },
    { title: '计划开始', index: 'planned_start_date', type: 'date', width: 120 },
    { title: '计划结束', index: 'planned_end_date', type: 'date', width: 120 },
    { title: '进度', index: 'progress_percentage', width: 100, format: (item: Task) => `${item.progress_percentage || 0}%` },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
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
        this.message.error('加载任务列表失败');
      }
    }
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
