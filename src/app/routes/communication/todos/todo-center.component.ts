import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

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
export class TodoCenterComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterStatus = signal<string | null>(null);
  filterType = signal<string | null>(null);
  filterPriority = signal<string | null>(null);
  todos = signal<TodoItem[]>([]);

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
          click: (record: TodoItem) => this.complete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    // TODO: 加载待办列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.todos.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    // TODO: 实现查看详情逻辑
    this.message.info('查看详情功能开发中');
  }

  complete(id: string): void {
    // TODO: 实现完成逻辑
    this.message.info('完成功能开发中');
  }
}
