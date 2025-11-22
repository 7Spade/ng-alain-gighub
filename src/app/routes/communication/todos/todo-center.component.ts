import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextFacade } from '@core';
import { STColumn } from '@delon/abc/st';
import { PersonalTodoService, SHARED_IMPORTS } from '@shared';
import type { PersonalTodo } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

// Import PersonalTodo type from models

interface TodoItem {
  readonly id: string;
  readonly title: string;
  readonly type: string;
  readonly status: string;
  readonly priority: string;
  readonly dueDate: string | null;
  readonly relatedResourceType: string;
  readonly relatedResourceId: string;
  readonly createdAt: string;
}

@Component({
  selector: 'app-todo-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'待办中心'"></page-header>

    <nz-card nzTitle="待办中心" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterStatus()"
              (ngModelChange)="filterStatus.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="pending" nzLabel="待处理"></nz-option>
              <nz-option nzValue="in_progress" nzLabel="进行中"></nz-option>
              <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
              <nz-option nzValue="cancelled" nzLabel="已取消"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>类型</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterType()"
              (ngModelChange)="filterType.set($event)"
              nzPlaceHolder="全部类型"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="comment" nzLabel="评论"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>优先级</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterPriority()"
              (ngModelChange)="filterPriority.set($event)"
              nzPlaceHolder="全部优先级"
              nzAllowClear
              style="width: 120px;"
            >
              <nz-option nzValue="low" nzLabel="低"></nz-option>
              <nz-option nzValue="medium" nzLabel="中"></nz-option>
              <nz-option nzValue="high" nzLabel="高"></nz-option>
              <nz-option nzValue="urgent" nzLabel="紧急"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 待办列表表格 -->
      <st
        #st
        [data]="filteredTodos()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待处理</nz-tag>
            }
            @case ('in_progress') {
              <nz-tag nzColor="processing">进行中</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="success">已完成</nz-tag>
            }
            @case ('cancelled') {
              <nz-tag nzColor="error">已取消</nz-tag>
            }
          }
        </ng-template>

        <ng-template #type let-record>
          @switch (record.type) {
            @case ('task') {
              <nz-tag nzColor="blue">任务</nz-tag>
            }
            @case ('comment') {
              <nz-tag nzColor="green">评论</nz-tag>
            }
            @case ('issue') {
              <nz-tag nzColor="orange">问题</nz-tag>
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
    </nz-card>
  `
})
export class TodoCenterComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly personalTodoService = inject(PersonalTodoService);
  private readonly contextFacade = inject(WorkspaceContextFacade);

  // Component signals
  readonly loading = this.personalTodoService.loading;
  readonly filterStatus = signal<string | null>(null);
  readonly filterType = signal<string | null>(null);
  readonly filterPriority = signal<string | null>(null);

  // Map PersonalTodo to TodoItem
  private readonly todos = computed(() => {
    return this.personalTodoService.todos().map(todo => this.mapToTodoItem(todo));
  });

  // Computed filtered todos
  filteredTodos = computed(() => {
    let result = this.todos();

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    if (this.filterPriority()) {
      result = result.filter(item => item.priority === this.filterPriority());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '优先级', index: 'priority', width: 100, render: 'priority' },
    { title: '截止日期', index: 'dueDate', type: 'date', width: 120 },
    { title: '关联资源', index: 'relatedResourceType', width: 150 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: TodoItem) => this.viewDetail(record.id)
        },
        {
          text: '完成',
          iif: (record: TodoItem) => record.status !== 'completed',
          click: (record: TodoItem) => this.complete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    // 取消订阅 Realtime 更新
    this.personalTodoService.unsubscribeFromUpdates();
  }

  async loadTodos(): Promise<void> {
    const currentUserAccountId = this.contextFacade.currentUserAccountId();
    if (!currentUserAccountId) {
      this.message.warning('无法获取当前用户信息');
      return;
    }

    try {
      // 订阅 Realtime 更新（会自动载入初始数据）
      await this.personalTodoService.subscribeToUpdates(currentUserAccountId);
    } catch (error) {
      console.error('加载待办列表失败:', error);
      this.message.error('加载待办列表失败');
    }
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }

  async complete(id: string): Promise<void> {
    const currentUserAccountId = this.contextFacade.currentUserAccountId();
    if (!currentUserAccountId) {
      this.message.warning('无法获取当前用户信息');
      return;
    }

    try {
      await this.personalTodoService.completeTodo(id, currentUserAccountId);
      this.message.success('待办已标记为完成');
    } catch (error) {
      console.error('完成待办失败:', error);
      this.message.error('完成待办失败');
    }
  }

  /**
   * 将 PersonalTodo 映射为 TodoItem
   */
  private mapToTodoItem(todo: PersonalTodo): TodoItem {
    return {
      id: todo.id,
      title: todo.title,
      type: todo.todo_type,
      status: todo.status || 'pending',
      priority: todo.priority || 'medium',
      dueDate: todo.due_date,
      relatedResourceType: todo.related_type || '',
      relatedResourceId: todo.related_id || '',
      createdAt: todo.created_at
    };
  }
}
