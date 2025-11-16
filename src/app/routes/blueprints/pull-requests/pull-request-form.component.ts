import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SHARED_IMPORTS, PullRequestService } from '@shared';

export interface PRFormData {
  blueprintId: string;
  branchId: string;
  submittedBy: string;
}

@Component({
  selector: 'app-pull-request-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>PR 标题</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请输入 PR 标题">
          <input
            nz-input
            formControlName="title"
            placeholder="例如：提交第一期施工数据"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>描述</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请输入描述">
          <textarea
            nz-input
            formControlName="description"
            [nzAutosize]="{ minRows: 4, maxRows: 8 }"
            placeholder="详细描述本次提交的变更内容和目的"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">变更摘要</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="changesSummary"
            [nzAutosize]="{ minRows: 3, maxRows: 6 }"
            placeholder="列出主要变更内容（可选）&#10;例如：&#10;- 完成任务 A 的施工日志&#10;- 提交品质检查报告&#10;- 更新进度数据"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="提交 Pull Request 后，将等待蓝图拥有者审核。审核通过后，您的变更将被合并到主分支。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            提交 PR
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class PullRequestFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private prService = inject(PullRequestService);
  
  readonly data: PRFormData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      changesSummary: ['']
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
      
      // Parse changes summary as JSON array
      let changesSummary = null;
      if (formValue.changesSummary) {
        const changesArray = formValue.changesSummary
          .split('\n')
          .filter((item: string) => item.trim())
          .map((item: string) => item.trim());
        
        if (changesArray.length > 0) {
          changesSummary = { changes: changesArray };
        }
      }

      await this.prService.createPullRequest({
        blueprint_id: this.data.blueprintId,
        branch_id: this.data.branchId,
        title: formValue.title,
        description: formValue.description,
        changes_summary: changesSummary,
        submitted_by: this.data.submittedBy
      });

      this.message.success('Pull Request 创建成功，等待审核');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('创建 Pull Request 失败:', error);
      this.message.error(error.message || '创建 Pull Request 失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
