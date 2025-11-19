import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface BranchReportItem {
  readonly branchId: string;
  readonly branchName: string;
  readonly progress: number;
  readonly taskCount: number;
  readonly completedCount: number;
  readonly issueCount: number;
  readonly resolvedCount: number;
}

@Component({
  selector: 'app-branch-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'分支报告'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="选择蓝图"
          style="width: 250px; margin-right: 8px;"
        >
          <!-- TODO: 加载蓝图列表 -->
        </nz-select>
        <button nz-button nzType="primary" (click)="exportReport()" [nzLoading]="loading()">
          <span nz-icon nzType="download"></span>
          导出报告
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="分支报告" style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else {
        <!-- 分支报告列表 -->
        <div nz-row [nzGutter]="16" style="margin-bottom: 24px;">
          @for (report of branchReports(); track report.branchId) {
            <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
              <nz-card [nzBordered]="true" [nzTitle]="report.branchName" style="margin-bottom: 16px;">
                <div style="margin-bottom: 12px;">
                  <strong>进度：</strong>
                  <nz-progress [nzPercent]="report.progress" [nzShowInfo]="true"></nz-progress>
                </div>
                <div style="margin-bottom: 8px;"> <strong>任务：</strong>{{ report.completedCount }}/{{ report.taskCount }} </div>
                <div> <strong>问题：</strong>{{ report.resolvedCount }}/{{ report.issueCount }} </div>
              </nz-card>
            </div>
          }
        </div>

        <!-- 对比图表 -->
        <nz-card nzTitle="分支对比" [nzBordered]="true">
          <div style="height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">
            <nz-empty nzNotFoundContent="对比图表开发中"></nz-empty>
          </div>
        </nz-card>
      }
    </nz-card>
  `
})
export class BranchReportComponent implements OnInit {
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  selectedBlueprintId = signal<string | null>(null);
  branchReports = signal<BranchReportItem[]>([]);

  ngOnInit(): void {
    // TODO: 初始化
  }

  onBlueprintChange(): void {
    this.loadBranchReports();
  }

  loadBranchReports(): void {
    // TODO: 加载分支报告数据
    // 暂时使用空数组，实际开发时连接真实数据
    this.branchReports.set([]);
  }

  exportReport(): void {
    // TODO: 实现导出逻辑
    this.message.info('导出功能开发中');
  }
}
