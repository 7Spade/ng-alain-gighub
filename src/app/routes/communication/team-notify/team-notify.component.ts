import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TeamNotificationItem {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly type: 'announcement' | 'broadcast' | 'alert';
  readonly status: 'draft' | 'published' | 'archived';
  readonly targetTeams: string[];
  readonly publishedAt: string | null;
  readonly createdAt: string;
}

@Component({
  selector: 'app-team-notify',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'团队通知'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createNotification()">
          <span nz-icon nzType="plus"></span>
          新建通知
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="团队通知管理" style="margin-top: 16px;">
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
              <nz-option nzValue="announcement" nzLabel="公告"></nz-option>
              <nz-option nzValue="broadcast" nzLabel="广播"></nz-option>
              <nz-option nzValue="alert" nzLabel="警报"></nz-option>
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
              <nz-option nzValue="draft" nzLabel="草稿"></nz-option>
              <nz-option nzValue="published" nzLabel="已发布"></nz-option>
              <nz-option nzValue="archived" nzLabel="已归档"></nz-option>
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
            @case ('announcement') {
              <nz-tag nzColor="blue">公告</nz-tag>
            }
            @case ('broadcast') {
              <nz-tag nzColor="green">广播</nz-tag>
            }
            @case ('alert') {
              <nz-tag nzColor="red">警报</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('draft') {
              <nz-tag nzColor="default">草稿</nz-tag>
            }
            @case ('published') {
              <nz-tag nzColor="success">已发布</nz-tag>
            }
            @case ('archived') {
              <nz-tag nzColor="default">已归档</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class TeamNotifyComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  filterType = signal<string | null>(null);
  filterStatus = signal<string | null>(null);
  notifications = signal<TeamNotificationItem[]>([]);

  // Computed filtered notifications
  filteredNotifications = computed(() => {
    let result = this.notifications();

    if (this.filterType()) {
      result = result.filter(item => item.type === this.filterType());
    }

    if (this.filterStatus()) {
      result = result.filter(item => item.status === this.filterStatus());
    }

    return result;
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '标题', index: 'title', width: 300 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
    { title: '状态', index: 'status', width: 120, render: 'status' },
    { title: '目标团队', index: 'targetTeams', width: 200, format: (item: TeamNotificationItem) => item.targetTeams.join(', ') },
    { title: '发布时间', index: 'publishedAt', type: 'date', width: 180 },
    { title: '创建时间', index: 'createdAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: TeamNotificationItem) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: TeamNotificationItem) => this.edit(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: TeamNotificationItem) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    // TODO: 加载团队通知列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.notifications.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  createNotification(): void {
    // TODO: 创建新通知
    this.message.info('创建通知功能开发中');
  }

  viewDetail(id: string): void {
    // TODO: 查看通知详情
    this.message.info('查看详情功能开发中');
  }

  edit(id: string): void {
    // TODO: 编辑通知
    this.message.info('编辑功能开发中');
  }

  delete(id: string): void {
    // TODO: 删除通知
    this.message.info('删除功能开发中');
  }
}
