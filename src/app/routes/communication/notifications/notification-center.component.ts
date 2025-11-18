import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface NotificationItem {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly type: 'system' | 'task' | 'issue' | 'blueprint' | 'comment';
  readonly read: boolean;
  readonly createdAt: string;
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'通知中心'"></page-header>

    <nz-card nzTitle="通知中心" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
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
              <nz-option nzValue="system" nzLabel="系统"></nz-option>
              <nz-option nzValue="task" nzLabel="任务"></nz-option>
              <nz-option nzValue="issue" nzLabel="问题"></nz-option>
              <nz-option nzValue="blueprint" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="comment" nzLabel="评论"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>状态</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterRead()"
              (ngModelChange)="filterRead.set($event)"
              nzPlaceHolder="全部状态"
              nzAllowClear
              style="width: 150px;"
            >
              <nz-option [nzValue]="false" nzLabel="未读"></nz-option>
              <nz-option [nzValue]="true" nzLabel="已读"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 通知列表表格 -->
      <st
        #st
        [data]="filteredNotifications()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('system') {
              <nz-tag nzColor="default">系统</nz-tag>
            }
            @case ('task') {
              <nz-tag nzColor="blue">任务</nz-tag>
            }
            @case ('issue') {
              <nz-tag nzColor="orange">问题</nz-tag>
            }
            @case ('blueprint') {
              <nz-tag nzColor="purple">蓝图</nz-tag>
            }
            @case ('comment') {
              <nz-tag nzColor="green">评论</nz-tag>
            }
          }
        </ng-template>

        <ng-template #read let-record>
          @if (record.read) {
            <nz-tag nzColor="default">已读</nz-tag>
          } @else {
            <nz-tag nzColor="blue">未读</nz-tag>
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class NotificationCenterComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterType = signal<string | null>(null);
  filterRead = signal<boolean | null>(null);
  notifications = signal<NotificationItem[]>([]);

  // Computed filtered notifications
  filteredNotifications = computed(() => {
    let result = this.notifications();

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    if (this.filterRead() !== null) {
      result = result.filter(item => item.read === this.filterRead());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '内容', index: 'content', width: 400 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '状态', index: 'read', width: 100, render: 'read' },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '查看',
          click: (record: NotificationItem) => this.viewDetail(record.id)
        },
        {
          text: '标记已读',
          iif: (record: NotificationItem) => !record.read,
          click: (record: NotificationItem) => this.markAsRead(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    // TODO: 加载通知列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.notifications.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  viewDetail(id: string): void {
    this.router.navigate(['/communication/notifications/detail'], { queryParams: { id } });
  }

  markAsRead(id: string): void {
    // TODO: 标记为已读
    this.message.info('标记已读功能开发中');
  }
}
