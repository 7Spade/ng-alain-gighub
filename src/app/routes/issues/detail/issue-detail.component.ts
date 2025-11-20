import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, IssueService, IssueDetail, AccountService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TimelineItem {
  readonly title: string;
  readonly description: string;
  readonly color: string;
  readonly timestamp: string;
}

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="issueDetail() ? issueDetail()!.title : '问题详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="edit()" [disabled]="!issueDetail()" style="margin-right: 8px;">
          <span nz-icon nzType="edit"></span>
          編輯
        </button>
        <button nz-button nzType="primary" (click)="handle()" [disabled]="!issueDetail()" style="margin-right: 8px;">
          <span nz-icon nzType="share-alt"></span>
          派送
        </button>
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div class="page-section">
      @if (issueService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (issueService.error()) {
        <nz-alert [nzMessage]="issueService.error()" nzType="error" [nzShowIcon]="true" style="margin: 16px;"></nz-alert>
        <button nz-button nzType="primary" (click)="loadIssue()" style="margin: 16px;">重新加载</button>
      } @else if (!issueDetail()) {
        <nz-empty nzNotFoundContent="问题不存在"></nz-empty>
      } @else {
        <!-- 基本資訊 -->
        <nz-card nzTitle="基本資訊" class="section-card">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="問題標題" [nzSpan]="3">{{ issueDetail()!.title }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="狀態">
              @switch (issueDetail()!.status) {
                @case ('open') {
                  <nz-tag nzColor="orange">進行中</nz-tag>
                }
                @case ('in_progress') {
                  <nz-tag nzColor="processing">處理中</nz-tag>
                }
                @case ('resolved') {
                  <nz-tag nzColor="success">已解決</nz-tag>
                }
                @case ('closed') {
                  <nz-tag nzColor="default">已關閉</nz-tag>
                }
                @case ('wont_fix') {
                  <nz-tag nzColor="default">不修復</nz-tag>
                }
                @default {
                  <nz-tag>{{ issueDetail()!.status }}</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="優先度">
              @switch (issueDetail()!.priority) {
                @case ('low') {
                  <nz-rate [ngModel]="1" nzDisabled></nz-rate>
                }
                @case ('medium') {
                  <nz-rate [ngModel]="2" nzDisabled></nz-rate>
                }
                @case ('high') {
                  <nz-rate [ngModel]="3" nzDisabled></nz-rate>
                }
                @case ('urgent') {
                  <nz-rate [ngModel]="4" nzDisabled></nz-rate>
                }
                @default {
                  <nz-rate [ngModel]="0" nzDisabled></nz-rate>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="嚴重程度">
              @switch (issueDetail()!.severity) {
                @case ('low') {
                  <nz-tag nzColor="default">低</nz-tag>
                }
                @case ('medium') {
                  <nz-tag nzColor="blue">中</nz-tag>
                }
                @case ('high') {
                  <nz-tag nzColor="orange">高</nz-tag>
                }
                @case ('critical') {
                  <nz-tag nzColor="red">緊急</nz-tag>
                }
                @default {
                  <nz-tag>{{ issueDetail()!.severity }}</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="建立時間">
              {{ issueDetail()!.reported_at ? (issueDetail()!.reported_at | date: 'yyyy-MM-dd HH:mm') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="指派給">
              @if (issueDetail()!.assignments && issueDetail()!.assignments.length > 0) {
                @for (assignment of issueDetail()!.assignments; track assignment.id) {
                  <span>{{ getAccountName(assignment.assignee_id) || assignment.assignee_id }}</span>
                }
              } @else {
                <span style="color: #999;">未指派</span>
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="問題描述" [nzSpan]="3">
              {{ issueDetail()!.description || '-' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 時間線 -->
        @if (timeline().length > 0) {
          <nz-card nzTitle="時間線" class="section-card">
            <nz-timeline>
              @for (item of timeline(); track item.title) {
                <nz-timeline-item [nzColor]="item.color">
                  <div class="timeline-title">{{ item.title }}</div>
                  <div class="timeline-desc">{{ item.description }}</div>
                  <div class="timeline-time">{{ item.timestamp }}</div>
                </nz-timeline-item>
              }
            </nz-timeline>
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

      .timeline-title {
        font-weight: 600;
      }

      .timeline-desc {
        color: rgba(0, 0, 0, 0.55);
        margin-top: 4px;
      }

      .timeline-time {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-top: 4px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueDetailComponent implements OnInit {
  issueService = inject(IssueService);
  accountService = inject(AccountService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  issueDetail = signal<IssueDetail | null>(null);
  issueId = signal<string>('');

  // 计算时间线（基于问题状态、指派记录、同步记录）
  readonly timeline = computed<TimelineItem[]>(() => {
    const issue = this.issueDetail();
    if (!issue) return [];

    const items: TimelineItem[] = [];

    // 问题创建
    if (issue.reported_at) {
      items.push({
        title: '建立問題',
        description: `由 ${this.getAccountName(issue.reported_by) || issue.reported_by} 建立`,
        color: 'blue',
        timestamp: issue.reported_at
      });
    }

    // 指派记录
    if (issue.assignments && issue.assignments.length > 0) {
      issue.assignments.forEach(assignment => {
        items.push({
          title: `派送給 ${this.getAccountName(assignment.assignee_id) || assignment.assignee_id}`,
          description: assignment.assignment_note || '待人工確認',
          color: 'green',
          timestamp: assignment.assigned_at || ''
        });
      });
    }

    // 同步记录
    if (issue.syncLogs && issue.syncLogs.length > 0) {
      issue.syncLogs.forEach(log => {
        items.push({
          title: `同步至主分支`,
          description: `同步類型：${log.sync_type || 'create'}`,
          color: 'orange',
          timestamp: log.synced_at || ''
        });
      });
    }

    // 按时间排序
    return items.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('问题ID不存在');
      this.router.navigate(['/issues']);
      return;
    }
    this.issueId.set(id);
    this.loadIssue();
  }

  async loadIssue(): Promise<void> {
    const id = this.issueId();
    if (!id) return;

    try {
      const detail = await this.issueService.loadIssueById(id);
      this.issueDetail.set(detail);

      // 加载账户信息
      if (detail) {
        if (detail.reported_by) {
          await this.accountService.loadAccountById(detail.reported_by).catch(() => {
            // 静默失败
          });
        }
        if (detail.assignments) {
          for (const assignment of detail.assignments) {
            await this.accountService.loadAccountById(assignment.assignee_id).catch(() => {
              // 静默失败
            });
          }
        }
      }
    } catch (error) {
      this.message.error('加载问题详情失败');
    }
  }

  getAccountName(accountId: string): string | null {
    const account = this.accountService.accounts().find(a => a.id === accountId);
    return account?.name || null;
  }

  edit(): void {
    this.message.info('編輯功能開發中');
    // TODO: 实现编辑功能
  }

  handle(): void {
    this.router.navigate(['/issues', this.issueId(), 'handle']);
  }

  close(): void {
    this.router.navigate(['/issues', this.issueId(), 'close']);
  }

  goBack(): void {
    this.router.navigate(['/issues']);
  }
}
