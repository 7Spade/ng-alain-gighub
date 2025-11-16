import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { SHARED_IMPORTS, PullRequestService, PullRequest } from '@shared';

export interface PRDetailData {
  prId: string;
}

@Component({
  selector: 'app-pull-request-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 40px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    } @else if (pr()) {
      <nz-descriptions nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="PR ID" [nzSpan]="2">{{ pr()!.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="标题" [nzSpan]="2">{{ pr()!.title }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="蓝图ID" [nzSpan]="1">{{ pr()!.blueprint_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="分支ID" [nzSpan]="1">{{ pr()!.branch_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="状态" [nzSpan]="2">
          @switch (pr()!.status) {
            @case ('open') {
              <nz-tag nzColor="blue">打开</nz-tag>
            }
            @case ('reviewing') {
              <nz-tag nzColor="orange">审核中</nz-tag>
            }
            @case ('approved') {
              <nz-tag nzColor="green">已批准</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="red">已拒绝</nz-tag>
            }
            @case ('merged') {
              <nz-tag nzColor="purple">已合并</nz-tag>
            }
            @case ('closed') {
              <nz-tag nzColor="default">已关闭</nz-tag>
            }
            @default {
              <nz-tag>{{ pr()!.status }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="描述" [nzSpan]="2">
          <pre style="white-space: pre-wrap; margin: 0;">{{ pr()!.description }}</pre>
        </nz-descriptions-item>
        @if (changesList().length > 0) {
          <nz-descriptions-item nzTitle="变更摘要" [nzSpan]="2">
            <ul style="margin: 0; padding-left: 20px;">
              @for (change of changesList(); track $index) {
                <li>{{ change }}</li>
              }
            </ul>
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="提交者ID" [nzSpan]="1">{{ pr()!.submitted_by }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="提交时间" [nzSpan]="1">
          {{ pr()!.submitted_at | date:'yyyy-MM-dd HH:mm:ss' }}
        </nz-descriptions-item>
        @if (pr()!.reviewed_by) {
          <nz-descriptions-item nzTitle="审核者ID" [nzSpan]="1">{{ pr()!.reviewed_by }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="审核时间" [nzSpan]="1">
            {{ pr()!.reviewed_at | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        }
        @if (pr()!.merged_by) {
          <nz-descriptions-item nzTitle="合并者ID" [nzSpan]="1">{{ pr()!.merged_by }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="合并时间" [nzSpan]="1">
            {{ pr()!.merged_at | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        }
      </nz-descriptions>
      
      <div style="margin-top: 16px; text-align: right;">
        <button nz-button nzType="default" (click)="close()">关闭</button>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="Pull Request 不存在"></nz-empty>
    }
  `
})
export class PullRequestDetailComponent implements OnInit {
  private modalRef = inject(NzModalRef);
  private prService = inject(PullRequestService);
  
  readonly data: PRDetailData = inject(NZ_MODAL_DATA);
  readonly loading = signal(false);
  readonly pr = signal<PullRequest | null>(null);
  
  readonly changesList = computed(() => {
    const prData = this.pr();
    if (!prData || !prData.changes_summary) return [];
    
    // Try to parse changes_summary
    if (typeof prData.changes_summary === 'object') {
      const summary: any = prData.changes_summary;
      if (Array.isArray(summary.changes)) {
        return summary.changes;
      }
      // Try to extract any array values
      return Object.values(summary).filter(v => typeof v === 'string');
    }
    
    return [];
  });

  async ngOnInit(): Promise<void> {
    await this.loadPR();
  }

  async loadPR(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.prService.loadPullRequestById(this.data.prId);
      this.pr.set(result);
    } catch (error) {
      console.error('加载 Pull Request 详情失败:', error);
      this.pr.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.modalRef.close();
  }
}
