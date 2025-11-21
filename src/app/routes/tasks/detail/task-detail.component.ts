import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS, TaskDetail, TaskService, TaskStatus } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ChecklistItem {
  readonly content: string;
  readonly done: boolean;
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="pageTitle()">
      <ng-template #extra>
        @if (canEdit()) {
          <button nz-button nzType="default" (click)="schedule()" [disabled]="!taskDetail()" style="margin-right: 8px;">
            <span nz-icon nzType="schedule"></span>
            排程
          </button>
          <button nz-button nzType="primary" (click)="assign()" [disabled]="!taskDetail()" style="margin-right: 8px;">
            <span nz-icon nzType="team"></span>
            指派
          </button>
          <button nz-button (click)="edit()" [disabled]="!taskDetail()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
        }
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div class="page-section">
      @if (taskService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (taskService.error()) {
        <nz-alert [nzMessage]="taskService.error()" nzType="error" [nzShowIcon]="true" style="margin: 16px;"></nz-alert>
        <button nz-button nzType="primary" (click)="loadTask()" style="margin: 16px;">重新加载</button>
      } @else if (!taskDetail()) {
        <nz-empty nzNotFoundContent="任务不存在"></nz-empty>
      } @else {
        <!-- Context Information Card -->
        @if (contextLabel()) {
          <nz-card nzTitle="上下文信息" class="section-card" [nzSize]="'small'">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span nz-icon [nzType]="contextIcon()" style="font-size: 20px;"></span>
              <div>
                <div style="font-weight: 500;">{{ contextLabel() }}</div>
                <div style="color: #999; font-size: 12px;">
                  @switch (contextType()) {
                    @case ('user') { 個人視角 }
                    @case ('organization') { 組織視角 }
                    @case ('team') { 團隊視角 }
                  }
                </div>
              </div>
            </div>
          </nz-card>
        }

        <!-- 任务 Metadata -->
        <nz-card nzTitle="任務 Metadata" class="section-card">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="名稱">{{ taskDetail()!.title }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="狀態">
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
                @default {
                  <nz-tag>{{ taskDetail()!.status }}</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="負責人">
              @if (taskDetail()!.assignments && taskDetail()!.assignments!.length > 0) {
                @for (assignment of taskDetail()!.assignments; track assignment.id) {
                  <span>{{ assignment.assignee_id }}</span>
                }
              } @else {
                <span style="color: #999;">未指派</span>
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="開始時間">
              {{ taskDetail()!.planned_start_date ? (taskDetail()!.planned_start_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="任務ID">{{ taskDetail()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="类型">
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
                @default {
                  <nz-tag>{{ taskDetail()!.task_type }}</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="优先级">
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
                @default {
                  <nz-tag>{{ taskDetail()!.priority }}</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="进度">
              <nz-progress
                [nzPercent]="taskDetail()!.progress_percentage || 0"
                [nzStatus]="taskDetail()!.progress_percentage === 100 ? 'success' : 'active'"
              ></nz-progress>
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="计划结束日期">
              {{ taskDetail()!.planned_end_date ? (taskDetail()!.planned_end_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="实际开始日期">
              {{ taskDetail()!.actual_start_date ? (taskDetail()!.actual_start_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="实际结束日期">
              {{ taskDetail()!.actual_end_date ? (taskDetail()!.actual_end_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="描述" [nzSpan]="3">
              {{ taskDetail()!.description || '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间" [nzSpan]="1">
              {{ taskDetail()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间" [nzSpan]="2">
              {{ taskDetail()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- Checklist -->
        @if (checklist().length > 0) {
          <nz-card nzTitle="Checklist" class="section-card">
            <nz-timeline>
              @for (item of checklist(); track item.content) {
                <nz-timeline-item [nzColor]="item.done ? 'green' : 'gray'">
                  {{ item.content }}
                </nz-timeline-item>
              }
            </nz-timeline>
          </nz-card>
        }

        <!-- 任务分配 -->
        @if (taskDetail()!.assignments && taskDetail()!.assignments!.length > 0) {
          <nz-card nzTitle="任务分配" class="section-card">
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
          </nz-card>
        }

        <!-- 子任务 -->
        @if (taskDetail()!.children && taskDetail()!.children!.length > 0) {
          <nz-card nzTitle="子任务" class="section-card">
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
          </nz-card>
        }
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .section-card {
        margin-bottom: 0;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly workspaceContext = inject(WorkspaceContextFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  readonly taskDetail = signal<TaskDetail | null>(null);
  readonly taskId = signal<string>('');

  // Workspace context computed signals
  readonly contextType = this.workspaceContext.contextType;
  readonly contextId = this.workspaceContext.contextId;
  readonly contextLabel = this.workspaceContext.contextLabel;
  readonly contextIcon = this.workspaceContext.contextIcon;

  // Page title with task name and context
  readonly pageTitle = computed(() => {
    const task = this.taskDetail();
    const label = this.contextLabel();
    const taskName = task?.title || '任务详情';
    return label ? `${label} - ${taskName}` : taskName;
  });

  // Check if user can edit (Org/Team context)
  readonly canEdit = computed(() => {
    const contextType = this.contextType();
    return contextType === 'organization' || contextType === 'team';
  });

  // 计算 Checklist（基于任务状态和子任务状态）
  readonly checklist = computed<ChecklistItem[]>(() => {
    const task = this.taskDetail();
    if (!task) return [];

    const items: ChecklistItem[] = [];

    // 根据任务状态生成 Checklist
    if (task.status === TaskStatus.PENDING) {
      items.push({ content: '確認需求', done: false });
    } else {
      items.push({ content: '確認需求', done: true });
    }

    if (task.status === TaskStatus.IN_PROGRESS || task.status === TaskStatus.STAGING) {
      items.push({ content: '完成設計', done: true });
      items.push({ content: '安排測試', done: false });
    } else if (task.status === TaskStatus.IN_QA || task.status === TaskStatus.IN_INSPECTION) {
      items.push({ content: '完成設計', done: true });
      items.push({ content: '安排測試', done: true });
    } else if (task.status === TaskStatus.COMPLETED) {
      items.push({ content: '完成設計', done: true });
      items.push({ content: '安排測試', done: true });
    } else {
      items.push({ content: '完成設計', done: false });
      items.push({ content: '安排測試', done: false });
    }

    return items;
  });

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

  schedule(): void {
    this.message.info('排程功能开发中');
    // TODO: 实现排程功能
  }

  assign(): void {
    this.message.info('指派功能开发中');
    // TODO: 实现指派功能
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
