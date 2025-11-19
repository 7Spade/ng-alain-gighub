import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ReportMetric {
  readonly label: string;
  readonly value: number;
  readonly unit: string;
}

@Component({
  selector: 'app-main-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'主分支报告'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="exportReport()" style="margin-right: 8px;">
          <span nz-icon nzType="download"></span>
          导出报告
        </button>
        <button nz-button nzType="primary" (click)="refreshReport()" [nzLoading]="loading()">
          <span nz-icon nzType="reload"></span>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="主分支报告" style="margin-top: 16px;">
      <!-- 报告指标 -->
      <div nz-row [nzGutter]="16" style="margin-bottom: 24px;">
        @for (metric of metrics(); track metric.label) {
          <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="6">
            <nz-card [nzBordered]="true" style="text-align: center;">
              <div style="font-size: 20px; font-weight: bold;">
                {{ metric.value }}{{ metric.unit }}
              </div>
              <div style="margin-top: 8px; color: #666;">{{ metric.label }}</div>
            </nz-card>
          </div>
        }
      </div>

      <!-- 报告内容 -->
      <nz-card nzTitle="执行摘要" [nzBordered]="true" style="margin-bottom: 16px;">
        <div style="min-height: 200px; padding: 16px;">
          <nz-empty nzNotFoundContent="报告内容开发中"></nz-empty>
        </div>
      </nz-card>

      <!-- 图表区域 -->
      <nz-row [nzGutter]="16">
        <nz-col [nzXs]="24" [nzLg]="12">
          <nz-card nzTitle="任务完成情况" [nzBordered]="true">
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
              <nz-empty nzNotFoundContent="图表开发中"></nz-empty>
            </div>
          </nz-card>
        </nz-col>
        <nz-col [nzXs]="24" [nzLg]="12">
          <nz-card nzTitle="问题处理情况" [nzBordered]="true">
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #999;">
              <nz-empty nzNotFoundContent="图表开发中"></nz-empty>
            </div>
          </nz-card>
        </nz-col>
      </nz-row>
    </nz-card>
  `
})
export class MainReportComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  metrics = signal<ReportMetric[]>([]);

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    // TODO: 加载主分支报告数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.metrics.set([]);
  }

  refreshReport(): void {
    this.loadReport();
  }

  exportReport(): void {
    // TODO: 实现导出逻辑
    this.message.info('导出功能开发中');
  }
}
