import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyReportRepository } from '@core';
import { SHARED_IMPORTS, Task, DailyReportInsert } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface DailyReportFormData {
  task: Task;
  blueprintId: string;
  branchId?: string;
}

@Component({
  selector: 'app-daily-report-form',
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
        <nz-form-label [nzSpan]="6" nzRequired>报告日期</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择报告日期">
          <nz-date-picker formControlName="reportDate" style="width: 100%;" nzPlaceHolder="选择日期"></nz-date-picker>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>工作描述</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请输入工作描述">
          <textarea
            nz-input
            formControlName="workDescription"
            [nzAutosize]="{ minRows: 4, maxRows: 8 }"
            placeholder="详细描述今日完成的工作内容"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">工人数量</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <nz-input-number
            formControlName="workerCount"
            [nzMin]="0"
            [nzStep]="1"
            style="width: 100%;"
            nzPlaceHolder="今日在场工人数量"
          ></nz-input-number>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">使用设备</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="equipmentUsed"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="使用的设备清单（例如：挖掘机、起重机等）"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">使用材料</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="materialsUsed"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="使用的材料清单（例如：水泥 10 吨、钢筋 5 吨等）"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">进度说明</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="progressNotes"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="工程进度说明和备注"
          ></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6">遇到的问题</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea
            nz-input
            formControlName="issuesEncountered"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="施工过程中遇到的问题或障碍"
          ></textarea>
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
export class DailyReportFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private dailyReportRepo = inject(DailyReportRepository);

  readonly data: DailyReportFormData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      reportDate: [new Date(), [Validators.required]],
      workDescription: ['', [Validators.required, Validators.minLength(10)]],
      workerCount: [null],
      equipmentUsed: [''],
      materialsUsed: [''],
      progressNotes: [''],
      issuesEncountered: ['']
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

      // Format date to YYYY-MM-DD
      const reportDate = new Date(formValue.reportDate);
      const formattedDate = reportDate.toISOString().split('T')[0];

      const dailyReport: DailyReportInsert = {
        task_id: this.data.task.id,
        blueprint_id: this.data.blueprintId,
        branch_id: this.data.branchId || null,
        report_date: formattedDate,
        work_description: formValue.workDescription,
        worker_count: formValue.workerCount,
        equipment_used: formValue.equipmentUsed || null,
        materials_used: formValue.materialsUsed || null,
        progress_notes: formValue.progressNotes || null,
        issues_encountered: formValue.issuesEncountered || null,
        weather_info: null, // TODO: 将来可以集成天气API
        reported_by: this.data.task.created_by // 使用任务创建者ID，实际应该用当前登录用户ID
      };

      await firstValueFrom(this.dailyReportRepo.create(dailyReport));
      this.message.success('施工日志创建成功');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('创建施工日志失败:', error);
      this.message.error(error.message || '创建施工日志失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
