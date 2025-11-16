import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SHARED_IMPORTS, PullRequestService, PullRequest } from '@shared';

export interface PRReviewData {
  pr: PullRequest;
  reviewerId: string;
}

@Component({
  selector: 'app-pull-request-review',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <div style="margin-bottom: 16px;">
      <nz-descriptions nzBordered [nzColumn]="1" nzSize="small">
        <nz-descriptions-item nzTitle="PR 标题">{{ data.pr.title }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="提交者">{{ data.pr.submitted_by }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="提交时间">{{ data.pr.submitted_at | date:'yyyy-MM-dd HH:mm:ss' }}</nz-descriptions-item>
      </nz-descriptions>
    </div>

    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>审核决定</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择审核决定">
          <nz-radio-group formControlName="decision">
            <label nz-radio nzValue="approved">批准</label>
            <label nz-radio nzValue="rejected">拒绝</label>
          </nz-radio-group>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">审核意见</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="comments"
            [nzAutosize]="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入审核意见或建议（可选）"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      @if (form.value.decision === 'approved') {
        <nz-alert
          nzType="success"
          nzMessage="批准提示"
          nzDescription="批准后，此 PR 将进入已批准状态，等待合并操作。"
          nzShowIcon
          style="margin-bottom: 16px;"
        ></nz-alert>
      }

      @if (form.value.decision === 'rejected') {
        <nz-alert
          nzType="warning"
          nzMessage="拒绝提示"
          nzDescription="拒绝后，提交者需要根据审核意见进行修改，并重新提交。"
          nzShowIcon
          style="margin-bottom: 16px;"
        ></nz-alert>
      }

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            提交审核
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class PullRequestReviewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private prService = inject(PullRequestService);
  
  readonly data: PRReviewData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      decision: ['approved', [Validators.required]],
      comments: ['']
    });
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.submitting.set(true);
    try {
      const formValue = this.form.value;
      
      if (formValue.decision === 'approved') {
        await this.prService.approvePullRequest(
          this.data.pr.id,
          this.data.reviewerId
        );
      } else {
        await this.prService.rejectPullRequest(
          this.data.pr.id,
          this.data.reviewerId
        );
      }

      this.message.success(`Pull Request 已${formValue.decision === 'approved' ? '批准' : '拒绝'}`);
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('审核 Pull Request 失败:', error);
      this.message.error(error.message || '审核失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
