import { Component, inject, signal } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SHARED_IMPORTS, PullRequestService, PullRequest } from '@shared';

export interface PRMergeData {
  pr: PullRequest;
  mergedBy: string;
}

@Component({
  selector: 'app-pull-request-merge',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="margin-bottom: 16px;">
      <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
        <nz-descriptions-item nzTitle="PR 标题">{{ data.pr.title }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="提交者">{{ data.pr.submitted_by }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="分支">{{ data.pr.branch_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="状态">
          @switch (data.pr.status) {
            @case ('approved') {
              <nz-tag nzColor="green">已批准</nz-tag>
            }
            @default {
              <nz-tag nzColor="orange">{{ data.pr.status }}</nz-tag>
            }
          }
        </nz-descriptions-item>
      </nz-descriptions>
    </div>

    @if (data.pr.status !== 'approved') {
      <nz-alert
        nzType="warning"
        nzMessage="无法合并"
        nzDescription="只有已批准的 Pull Request 才能合并。请先完成审核流程。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>
    } @else {
      <nz-alert
        nzType="info"
        nzMessage="合并说明"
        nzDescription="合并操作将把分支中的承揽字段数据更新到主分支。此操作不可撤销，请确认后继续。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <div style="margin-top: 16px; text-align: center;">
        <nz-checkbox [(ngModel)]="confirmedValue" (ngModelChange)="confirmed.set($event)">
          我已确认变更内容，同意合并此 Pull Request
        </nz-checkbox>
      </div>
    }

    <div style="margin-top: 24px; text-align: right;">
      <button nz-button nzType="default" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
        取消
      </button>
      <button 
        nz-button 
        nzType="primary" 
        nzDanger
        (click)="merge()" 
        [nzLoading]="submitting()" 
        [disabled]="!canMerge() || submitting()"
      >
        确认合并
      </button>
    </div>
  `
})
export class PullRequestMergeComponent {
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private prService = inject(PullRequestService);
  
  readonly data: PRMergeData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly confirmed = signal(false);
  confirmedValue = false;

  canMerge(): boolean {
    return this.data.pr.status === 'approved' && this.confirmed();
  }

  async merge(): Promise<void> {
    if (!this.canMerge()) {
      return;
    }

    this.submitting.set(true);
    try {
      await this.prService.mergePullRequest(
        this.data.pr.id,
        this.data.mergedBy
      );

      this.message.success('Pull Request 合并成功');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('合并 Pull Request 失败:', error);
      this.message.error(error.message || '合并失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
