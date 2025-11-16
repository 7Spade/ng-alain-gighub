import { Component, inject, signal, OnInit } from '@angular/core';
import { DailyReportRepository } from '@core';
import { SHARED_IMPORTS, DailyReport } from '@shared';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface DailyReportDetailData {
  reportId: string;
}

@Component({
  selector: 'app-daily-report-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 40px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    } @else if (report()) {
      <nz-descriptions nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="报告ID" [nzSpan]="2">{{ report()!.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="任务ID" [nzSpan]="2">{{ report()!.task_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="报告日期" [nzSpan]="1">{{ report()!.report_date }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="工人数量" [nzSpan]="1">
          {{ report()!.worker_count || '未记录' }}
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="工作描述" [nzSpan]="2">
          <pre style="white-space: pre-wrap; margin: 0;">{{ report()!.work_description }}</pre>
        </nz-descriptions-item>
        @if (report()!.equipment_used) {
          <nz-descriptions-item nzTitle="使用设备" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ report()!.equipment_used }}</pre>
          </nz-descriptions-item>
        }
        @if (report()!.materials_used) {
          <nz-descriptions-item nzTitle="使用材料" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ report()!.materials_used }}</pre>
          </nz-descriptions-item>
        }
        @if (report()!.progress_notes) {
          <nz-descriptions-item nzTitle="进度说明" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ report()!.progress_notes }}</pre>
          </nz-descriptions-item>
        }
        @if (report()!.issues_encountered) {
          <nz-descriptions-item nzTitle="遇到的问题" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ report()!.issues_encountered }}</pre>
          </nz-descriptions-item>
        }
        @if (report()!.weather_info) {
          <nz-descriptions-item nzTitle="天气信息" [nzSpan]="2">
            {{ report()!.weather_info | json }}
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="报告者ID" [nzSpan]="1">{{ report()!.reported_by }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="创建时间" [nzSpan]="1">{{
          report()!.created_at | date: 'yyyy-MM-dd HH:mm:ss'
        }}</nz-descriptions-item>
      </nz-descriptions>

      <div style="margin-top: 16px; text-align: right;">
        <button nz-button nzType="default" (click)="close()">关闭</button>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="日志不存在"></nz-empty>
    }
  `
})
export class DailyReportDetailComponent implements OnInit {
  private modalRef = inject(NzModalRef);
  private dailyReportRepo = inject(DailyReportRepository);

  readonly data: DailyReportDetailData = inject(NZ_MODAL_DATA);
  readonly loading = signal(false);
  readonly report = signal<DailyReport | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadReport();
  }

  async loadReport(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.dailyReportRepo.findById(this.data.reportId));
      this.report.set(result);
    } catch (error) {
      console.error('加载日志详情失败:', error);
      this.report.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.modalRef.close();
  }
}
