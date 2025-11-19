import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-notification-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="notification() ? notification()!.title : '通知详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div class="page-section">
      @if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (error()) {
        <nz-alert [nzMessage]="error()" nzType="error" [nzShowIcon]="true" style="margin: 16px;"></nz-alert>
        <button nz-button nzType="primary" (click)="loadNotification()" style="margin: 16px;">重新加载</button>
      } @else if (!notification()) {
        <nz-empty nzNotFoundContent="通知不存在"></nz-empty>
      } @else {
        <nz-card nzTitle="通知详情" class="section-card">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="标题" [nzSpan]="3">{{ notification()!.title }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="类型" [nzSpan]="1">
              @switch (notification()!.type) {
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
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态" [nzSpan]="1">
              @if (notification()!.read) {
                <nz-tag nzColor="default">已读</nz-tag>
              } @else {
                <nz-tag nzColor="blue">未读</nz-tag>
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间" [nzSpan]="1">
              {{ notification()!.createdAt | date: 'yyyy-MM-dd HH:mm' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="内容" [nzSpan]="3">
              {{ notification()!.content }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>
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
  ]
})
export class NotificationDetail implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  error = signal<string | null>(null);
  notification = signal<{
    id: string;
    title: string;
    content: string;
    type: 'system' | 'task' | 'issue' | 'blueprint' | 'comment';
    read: boolean;
    createdAt: string;
  } | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadNotification();
    } else {
      this.error.set('通知ID不存在');
    }
  }

  loadNotification(): void {
    // TODO: 加载通知详情
    // 暂时使用空数据，实际开发时连接真实数据
    this.loading.set(false);
    this.error.set(null);
  }

  goBack(): void {
    this.router.navigate(['/communication/notifications']);
  }
}
