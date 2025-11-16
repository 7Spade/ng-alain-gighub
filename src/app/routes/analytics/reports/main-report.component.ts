import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IssueRepository } from '@core/repositories/issue.repository';
import { ProgressTrackingRepository } from '@core/repositories/progress-tracking.repository';
import { forkJoin } from 'rxjs';

interface ReportSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  totalIssues: number;
  resolvedIssues: number;
  resolutionRate: number;
}

@Component({
  selector: 'app-main-report',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'蓝图主报告'">
      <ng-template #action>
        <button nz-button [nzLoading]="loading()" (click)="loadReportData()">
          <span nz-icon nzType="reload"></span>
          刷新
        </button>
        <button nz-button nzType="primary" style="margin-left: 8px;" (click)="printReport()">
          <span nz-icon nzType="printer"></span>
          打印
        </button>
        <button nz-button style="margin-left: 8px;" (click)="exportToCSV()">
          <span nz-icon nzType="export"></span>
          导出
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="报告摘要" style="margin-top: 16px;" [nzLoading]="loading()">
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="8">
          <nz-statistic 
            [nzValue]="summary().totalTasks" 
            nzTitle="任务总数"
            [nzPrefix]="taskIcon">
            <ng-template #taskIcon><span nz-icon nzType="check-square"></span></ng-template>
          </nz-statistic>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-statistic 
            [nzValue]="summary().completedTasks" 
            nzTitle="已完成"
            [nzValueStyle]="{ color: '#3f8600' }"
            [nzPrefix]="completedIcon">
            <ng-template #completedIcon><span nz-icon nzType="check-circle"></span></ng-template>
          </nz-statistic>
        </div>
        <div nz-col [nzSpan]="8">
          <nz-statistic 
            [nzValue]="summary().completionRate"
            [nzSuffix]="'%'"
            nzTitle="完成率"
            [nzValueStyle]="getCompletionColor(summary().completionRate)">
          </nz-statistic>
        </div>
      </div>
      
      <nz-divider></nz-divider>
      
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="12">
          <nz-statistic 
            [nzValue]="summary().totalIssues" 
            nzTitle="问题总数"
            [nzPrefix]="issueIcon">
            <ng-template #issueIcon><span nz-icon nzType="warning"></span></ng-template>
          </nz-statistic>
        </div>
        <div nz-col [nzSpan]="12">
          <nz-statistic 
            [nzValue]="summary().resolutionRate"
            [nzSuffix]="'%'"
            nzTitle="问题解决率"
            [nzValueStyle]="getResolutionColor(summary().resolutionRate)">
          </nz-statistic>
        </div>
      </div>
    </nz-card>

    <nz-card nzTitle="进度明细" style="margin-top: 16px;">
      <st 
        #st
        [data]="progressData()" 
        [columns]="progressColumns"
        [loading]="loading()"
        [scroll]="{ x: '900px' }"
        [page]="{ show: true, showSize: true, front: false }">
      </st>
    </nz-card>

    <nz-card nzTitle="问题清单" style="margin-top: 16px;">
      <st 
        #st2
        [data]="issueData()" 
        [columns]="issueColumns"
        [loading]="loading()"
        [scroll]="{ x: '800px' }"
        [page]="{ show: true, showSize: true, front: false }">
      </st>
    </nz-card>
  `
})
export class MainReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private progressRepo = inject(ProgressTrackingRepository);
  private issueRepo = inject(IssueRepository);

  loading = signal(false);
  summary = signal<ReportSummary>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    resolutionRate: 0
  });
  progressData = signal<STData[]>([]);
  issueData = signal<STData[]>([]);
  
  blueprintId: string | null = null;

  progressColumns: STColumn[] = [
    { title: '跟踪日期', index: 'tracking_date', type: 'date', width: 120 },
    { title: '类型', index: 'tracking_type', width: 100 },
    { title: '计划进度', index: 'planned_progress', type: 'number', width: 100, format: (item: any) => `${item.planned_progress || 0}%` },
    { title: '实际进度', index: 'actual_progress', type: 'number', width: 100, format: (item: any) => `${item.actual_progress || 0}%` },
    { title: '进度偏差', index: 'progress_variance', type: 'number', width: 100, format: (item: any) => {
      const variance = item.progress_variance || 0;
      return `${variance > 0 ? '+' : ''}${variance}%`;
    }},
    { title: '状态', index: 'tracking_status', type: 'badge', badge: {
      normal: { text: '正常', color: 'success' },
      delayed: { text: '延迟', color: 'error' },
      ahead: { text: '提前', color: 'processing' },
      paused: { text: '暂停', color: 'default' }
    }, width: 100 }
  ];

  issueColumns: STColumn[] = [
    { title: '编号', index: 'issue_number', width: 100 },
    { title: '标题', index: 'title', width: 200 },
    { title: '类型', index: 'issue_type', width: 120 },
    { title: '严重程度', index: 'severity', type: 'badge', badge: {
      low: { text: '低', color: 'default' },
      medium: { text: '中', color: 'processing' },
      high: { text: '高', color: 'warning' },
      critical: { text: '严重', color: 'error' }
    }, width: 100 },
    { title: '状态', index: 'status', type: 'badge', badge: {
      new: { text: '新建', color: 'blue' },
      in_progress: { text: '处理中', color: 'processing' },
      review: { text: '审核中', color: 'warning' },
      resolved: { text: '已解决', color: 'success' },
      closed: { text: '已关闭', color: 'default' }
    }, width: 100 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 150 }
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.blueprintId = params['blueprint_id'] || null;
      this.loadReportData();
    });
  }

  loadReportData(): void {
    if (!this.blueprintId) {
      this.message.warning('请提供蓝图ID参数');
      return;
    }

    this.loading.set(true);

    forkJoin({
      progress: this.progressRepo.findAll({
        filters: { blueprint_id: this.blueprintId },
        pageSize: 1000
      }),
      issues: this.issueRepo.findAll({
        filters: { blueprint_id: this.blueprintId },
        pageSize: 1000
      })
    }).subscribe({
      next: ({ progress, issues }) => {
        // Calculate summary statistics
        const totalTasks = progress.reduce((sum, p) => sum + (p.total_tasks || 0), 0);
        const completedTasks = progress.reduce((sum, p) => sum + (p.completed_tasks || 0), 0);
        const pendingTasks = totalTasks - completedTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const totalIssues = issues.length;
        const resolvedIssues = issues.filter(i => i.status === 'resolved' || i.status === 'closed').length;
        const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

        this.summary.set({
          totalTasks,
          completedTasks,
          pendingTasks,
          completionRate,
          totalIssues,
          resolvedIssues,
          resolutionRate
        });

        this.progressData.set(progress);
        this.issueData.set(issues);
        this.loading.set(false);
      },
      error: (err) => {
        this.message.error('加载报告数据失败');
        this.loading.set(false);
      }
    });
  }

  getCompletionColor(rate: number): any {
    if (rate >= 80) return { color: '#3f8600' };
    if (rate >= 60) return { color: '#faad14' };
    return { color: '#cf1322' };
  }

  getResolutionColor(rate: number): any {
    if (rate >= 80) return { color: '#3f8600' };
    return { color: '#cf1322' };
  }

  printReport(): void {
    window.print();
  }

  exportToCSV(): void {
    const progressCSV = this.convertToCSV(this.progressData());
    const issuesCSV = this.convertToCSV(this.issueData());
    
    const content = `蓝图主报告\n\n进度数据:\n${progressCSV}\n\n问题数据:\n${issuesCSV}`;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `main_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    const keys = Object.keys(data[0]);
    const header = keys.join(',');
    const rows = data.map(item => keys.map(key => item[key]).join(','));
    return [header, ...rows].join('\n');
  }
}
