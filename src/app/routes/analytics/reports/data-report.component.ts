import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-data-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'数据报告'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="generateReport()" [nzLoading]="generating()">
          <span nz-icon nzType="file-text"></span>
          生成报告
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="数据报告配置" style="margin-top: 16px;">
      <form nz-form [formGroup]="reportForm" nzLayout="vertical">
        <nz-row [nzGutter]="16">
          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label nzRequired>报告类型</nz-form-label>
              <nz-form-control [nzErrorTip]="'请选择报告类型'">
                <nz-select formControlName="reportType" nzPlaceHolder="请选择报告类型">
                  <nz-option nzValue="task" nzLabel="任务报告"></nz-option>
                  <nz-option nzValue="issue" nzLabel="问题报告"></nz-option>
                  <nz-option nzValue="blueprint" nzLabel="蓝图报告"></nz-option>
                  <nz-option nzValue="comprehensive" nzLabel="综合报告"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label nzRequired>时间范围</nz-form-label>
              <nz-form-control [nzErrorTip]="'请选择时间范围'">
                <nz-range-picker formControlName="dateRange" style="width: 100%;"></nz-range-picker>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </nz-row>

        <nz-form-item>
          <nz-form-label>包含字段</nz-form-label>
          <nz-form-control>
            <nz-checkbox-group formControlName="fields">
              <label nz-checkbox nzValue="tasks">任务</label>
              <label nz-checkbox nzValue="issues">问题</label>
              <label nz-checkbox nzValue="progress">进度</label>
              <label nz-checkbox nzValue="metrics">指标</label>
            </nz-checkbox-group>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>报告格式</nz-form-label>
          <nz-form-control>
            <nz-radio-group formControlName="format">
              <label nz-radio nzValue="pdf">PDF</label>
              <label nz-radio nzValue="excel">Excel</label>
              <label nz-radio nzValue="html">HTML</label>
            </nz-radio-group>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class DataReportComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  // Component signals
  generating = signal(false);

  reportForm: FormGroup = this.fb.group({
    reportType: ['', [Validators.required]],
    dateRange: [[], [Validators.required]],
    fields: [[]],
    format: ['pdf']
  });

  ngOnInit(): void {
    // TODO: 初始化表单数据
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      Object.values(this.reportForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请填写完整的表单信息');
      return;
    }

    this.generating.set(true);
    // TODO: 实现生成报告逻辑
    setTimeout(() => {
      this.generating.set(false);
      this.message.success('报告生成成功');
    }, 1000);
  }
}
