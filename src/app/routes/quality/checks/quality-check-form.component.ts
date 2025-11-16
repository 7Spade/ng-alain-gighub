import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QualityCheckRepository } from '@core';
import { SHARED_IMPORTS, Task } from '@shared';
import { firstValueFrom } from 'rxjs';

export interface QualityCheckFormData {
  task: Task;
}

@Component({
  selector: 'app-quality-check-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>任务</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input [value]="data.task.title" disabled />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>检查类型</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择检查类型">
          <nz-select formControlName="checkType" nzPlaceHolder="选择检查类型">
            <nz-option nzValue="routine" nzLabel="常规检查"></nz-option>
            <nz-option nzValue="milestone" nzLabel="里程碑检查"></nz-option>
            <nz-option nzValue="final" nzLabel="最终检查"></nz-option>
            <nz-option nzValue="spot_check" nzLabel="抽查"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>检查项目</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请输入检查项目">
          <textarea
            nz-input
            formControlName="checkItems"
            [nzAutosize]="{ minRows: 4, maxRows: 8 }"
            placeholder="每行一个检查项目，例如：&#10;- 混凝土强度检查&#10;- 钢筋绑扎规范检查&#10;- 模板安装质量检查"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">检查发现</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="findings"
            [nzAutosize]="{ minRows: 3, maxRows: 6 }"
            placeholder="记录检查过程中的发现和问题"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">建议</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="recommendations"
            [nzAutosize]="{ minRows: 3, maxRows: 6 }"
            placeholder="针对发现的问题提出改进建议"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>检查状态</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择检查状态">
          <nz-select formControlName="status" nzPlaceHolder="选择检查状态">
            <nz-option nzValue="pending" nzLabel="待检查"></nz-option>
            <nz-option nzValue="in_progress" nzLabel="检查中"></nz-option>
            <nz-option nzValue="passed" nzLabel="通过"></nz-option>
            <nz-option nzValue="failed" nzLabel="不通过"></nz-option>
            <nz-option nzValue="conditional_pass" nzLabel="有条件通过"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            提交
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class QualityCheckFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private qualityCheckRepo = inject(QualityCheckRepository);
  
  readonly data: QualityCheckFormData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      checkType: ['routine', [Validators.required]],
      checkItems: ['', [Validators.required, Validators.minLength(10)]],
      findings: [''],
      recommendations: [''],
      status: ['pending', [Validators.required]]
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
      
      // Parse check items as JSON array
      const checkItemsArray = formValue.checkItems
        .split('\n')
        .filter((item: string) => item.trim())
        .map((item: string) => item.trim());

      const qualityCheck = {
        task_id: this.data.task.id,
        inspector_id: this.data.task.created_by, // 使用任务创建者ID，实际应该用当前登录用户ID
        check_type: formValue.checkType,
        status: formValue.status,
        check_items: checkItemsArray,
        findings: formValue.findings || null,
        recommendations: formValue.recommendations || null,
        checked_at: new Date().toISOString(),
        completed_at: ['passed', 'failed', 'conditional_pass'].includes(formValue.status)
          ? new Date().toISOString()
          : null
      };

      await firstValueFrom(this.qualityCheckRepo.create(qualityCheck));
      this.message.success('品质检查创建成功');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('创建品质检查失败:', error);
      this.message.error(error.message || '创建品质检查失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
