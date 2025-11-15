import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, TaskService, TaskDetail, TaskStatus, TaskType, TaskPriority } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="taskDetail() ? taskDetail()!.title : '任务详情'">
      <ng-template #extra>
        <button nz-button (click)="edit()" [disabled]="!taskDetail()">
          <span nz-icon nzType="edit"></span>
          编辑
        </button>
        <button nz-button nzType="default" (click)="goBack()" style="margin-left: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (taskService.error()) {
        <nz-alert [nzMessage]="taskService.error()" nzType="error" [nzShowIcon]="true" style="margin-bottom: 16px;"></nz-alert>
        <button nz-button nzType="primary" (click)="loadTask()">重新加载</button>
      } @else if (!taskDetail()) {
        <nz-empty nzNotFoundContent="任务不存在"></nz-empty>
      } @else {
        <sv-container [col]="2" [gutter]="16">
          <sv label="任务ID">{{ taskDetail()!.id }}</sv>
          <sv label="标题">{{ taskDetail()!.title }}</sv>
          <sv label="类型">
            @switch (taskDetail()!.task_type) {
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
          </sv>
          <sv label="状态">
            @switch (taskDetail()!.status) {
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
          </sv>
          <sv label="优先级">
            @switch (taskDetail()!.priority) {
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
          </sv>
          <sv label="进度">
            <nz-progress
              [nzPercent]="taskDetail()!.progress_percentage || 0"
              [nzStatus]="taskDetail()!.progress_percentage === 100 ? 'success' : 'active'"
            ></nz-progress>
          </sv>
          <sv label="计划开始日期">
            {{ taskDetail()!.planned_start_date | date: 'yyyy-MM-dd' }}
          </sv>
          <sv label="计划结束日期">
            {{ taskDetail()!.planned_end_date | date: 'yyyy-MM-dd' }}
          </sv>
          <sv label="实际开始日期">
            {{ taskDetail()!.actual_start_date ? (taskDetail()!.actual_start_date | date: 'yyyy-MM-dd') : '-' }}
          </sv>
          <sv label="实际结束日期">
            {{ taskDetail()!.actual_end_date ? (taskDetail()!.actual_end_date | date: 'yyyy-MM-dd') : '-' }}
          </sv>
          <sv label="描述" [col]="2">
            {{ taskDetail()!.description || '-' }}
          </sv>
          <sv label="创建时间" [col]="2">
            {{ taskDetail()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
          </sv>
          <sv label="更新时间" [col]="2">
            {{ taskDetail()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
          </sv>
        </sv-container>

        @if (taskDetail()!.assignments && taskDetail()!.assignments!.length > 0) {
          <nz-divider nzText="任务分配"></nz-divider>
          <nz-table [nzData]="taskDetail()!.assignments || []" [nzShowPagination]="false" [nzSize]="'small'">
            <thead>
              <tr>
                <th>指派对象</th>
                <th>指派类型</th>
                <th>指派时间</th>
              </tr>
            </thead>
            <tbody>
              @for (assignment of taskDetail()!.assignments; track assignment.id) {
                <tr>
                  <td>{{ assignment.assignee_id }}</td>
                  <td>{{ assignment.assignee_type }}</td>
                  <td>{{ assignment.assigned_at | date: 'yyyy-MM-dd HH:mm:ss' }}</td>
                </tr>
              }
            </tbody>
          </nz-table>
        }

        @if (taskDetail()!.children && taskDetail()!.children!.length > 0) {
          <nz-divider nzText="子任务"></nz-divider>
          <nz-table [nzData]="taskDetail()!.children || []" [nzShowPagination]="false" [nzSize]="'small'">
            <thead>
              <tr>
                <th>标题</th>
                <th>状态</th>
                <th>进度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              @for (child of taskDetail()!.children; track child.id) {
                <tr>
                  <td>{{ child.title }}</td>
                  <td>
                    @switch (child.status) {
                      @case ('pending') {
                        <nz-tag nzColor="default">待处理</nz-tag>
                      }
                      @case ('in_progress') {
                        <nz-tag nzColor="processing">进行中</nz-tag>
                      }
                      @case ('completed') {
                        <nz-tag nzColor="success">已完成</nz-tag>
                      }
                      @default {
                        <nz-tag>{{ child.status }}</nz-tag>
                      }
                    }
                  </td>
                  <td>{{ child.progress_percentage || 0 }}%</td>
                  <td>
                    <button nz-button nzType="link" nzSize="small" (click)="viewChildTask(child.id)"> 查看 </button>
                  </td>
                </tr>
              }
            </tbody>
          </nz-table>
        }
      }
    </nz-card>
  `
})
export class TaskDetailComponent implements OnInit {
  readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly taskDetail = signal<TaskDetail | null>(null);
  readonly taskId = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('任务ID不存在');
      this.router.navigate(['/tasks']);
      return;
    }
    this.taskId.set(id);
    this.loadTask();
  }

  async loadTask(): Promise<void> {
    const id = this.taskId();
    if (!id) return;

    try {
      const detail = await this.taskService.loadTaskById(id);
      this.taskDetail.set(detail);
    } catch (error) {
      this.message.error('加载任务详情失败');
    }
  }

  edit(): void {
    this.router.navigate(['/tasks', this.taskId(), 'edit']);
  }

  goBack(): void {
    this.router.navigate(['/tasks/list']);
  }

  viewChildTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }
}
