import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface RealtimeNotificationItem {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly channel: string;
  readonly status: 'connected' | 'disconnected' | 'error';
  readonly receivedAt: string;
}

@Component({
  selector: 'app-realtime-notify',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'即时通知'"></page-header>

    <nz-card nzTitle="实时通知" style="margin-top: 16px;">
      <!-- 筛选器 -->
      <div style="margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap;">
        <nz-form-item style="margin-bottom: 0;">
          <nz-form-label>通道</nz-form-label>
          <nz-form-control>
            <nz-select
              [ngModel]="filterChannel()"
              (ngModelChange)="filterChannel.set($event)"
              nzPlaceHolder="全部通道"
              nzAllowClear
              style="width: 200px;"
            >
              <nz-option nzValue="tasks" nzLabel="任务"></nz-option>
              <nz-option nzValue="issues" nzLabel="问题"></nz-option>
              <nz-option nzValue="blueprints" nzLabel="蓝图"></nz-option>
              <nz-option nzValue="system" nzLabel="系统"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

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
              <nz-option nzValue="connected" nzLabel="已连接"></nz-option>
              <nz-option nzValue="disconnected" nzLabel="已断开"></nz-option>
              <nz-option nzValue="error" nzLabel="错误"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </div>

      <!-- 实时通知列表表格 -->
      <st
        #st
        [data]="filteredNotifications()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('connected') {
              <nz-tag nzColor="success">已连接</nz-tag>
            }
            @case ('disconnected') {
              <nz-tag nzColor="default">已断开</nz-tag>
            }
            @case ('error') {
              <nz-tag nzColor="error">错误</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class RealtimeNotifyComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterChannel = signal<string | null>(null);
  filterStatus = signal<string | null>(null);
  notifications = signal<RealtimeNotificationItem[]>([]);

  // Computed filtered notifications
  filteredNotifications = computed(() => {
    let result = this.notifications();

    if (this.filterChannel()) {
      result = result.filter(item => item.channel === this.filterChannel());
    }

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '内容', index: 'content', width: 400 },
    { title: '通道', index: 'channel', width: 120 },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '接收时间', index: 'receivedAt', type: 'date', width: 180 }
  ];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    // TODO: 加载实时通知列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.notifications.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }
}
