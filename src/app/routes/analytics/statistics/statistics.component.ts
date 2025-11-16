import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProgressTrackingRepository, IssueRepository, TaskRepository } from '@core';
import { forkJoin } from 'rxjs';

interface StatisticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
  totalIssues: number;
  openIssues: number;
  resolvedIssues: number;
  issueResolutionRate: number;
}

@Component({
  selector: 'app-analytics-statistics',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'统计总览'">
      <ng-template #action>
        <button nz-button nzType="primary" (click)="loadStatistics()">
          <i nz-icon nzType="reload"></i>
          刷新数据
        </button>
      </ng-template>
    </page-header>

    <div style="margin-top: 16px;">
      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; text-align: center; padding: 60px;"></nz-spin>
      } @else {
        <!-- Task Statistics Card -->
        <nz-card nzTitle="任务统计" style="margin-bottom: 16px;">
          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="6">
              <nz-statistic
                [nzValue]="stats().totalTasks"
                [nzTitle]="'总任务数'"
                [nzPrefix]="taskIcon"
              ></nz-statistic>
              <ng-template #taskIcon><i nz-icon nzType="project" nzTheme="outline"></i></ng-template>
            </div>
            <div nz-col [nzSpan]="6">
              <nz-statistic
                [nzValue]="stats().completedTasks"
                [nzTitle]="'已完成'"
                [nzPrefix]="checkIcon"
                [nzValueStyle]="{ color: '#3f8600' }"
              ></nz-statistic>
              <ng-template #checkIcon><i nz-icon nzType="check-circle" nzTheme="outline"></i></ng-template>
            </div>
            <div nz-col [nzSpan]="6">
              <nz-statistic
                [nzValue]="stats().inProgressTasks"
                [nzTitle]="'进行中'"
                [nzPrefix]="playIcon"
                [nzValueStyle]="{ color: '#1890ff' }"
              ></nz-statistic>
              <ng-template #playIcon><i nz-icon nzType="play-circle" nzTheme="outline"></i></ng-template>
            </div>
            <div nz-col [nzSpan]="6">
              <nz-statistic
                [nzValue]="stats().pendingTasks"
                [nzTitle]="'待处理'"
                [nzPrefix]="clockIcon"
                [nzValueStyle]="{ color: '#faad14' }"
              ></nz-statistic>
              <ng-template #clockIcon><i nz-icon nzType="clock-circle" nzTheme="outline"></i></ng-template>
            </div>
          </div>
          <nz-divider></nz-divider>
          <div nz-row>
            <div nz-col [nzSpan]="24">
              <nz-statistic
                [nzValue]="stats().completionRate"
                [nzTitle]="'完成率'"
                [nzSuffix]="'%'"
                [nzPrecision]="1"
                [nzValueStyle]="{ color: stats().completionRate >= 80 ? '#3f8600' : '#faad14' }"
              ></nz-statistic>
            </div>
          </div>
        </nz-card>

        <!-- Issue Statistics Card -->
        <nz-card nzTitle="问题统计" style="margin-bottom: 16px;">
          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="8">
              <nz-statistic
                [nzValue]="stats().totalIssues"
                [nzTitle]="'总问题数'"
                [nzPrefix]="issueIcon"
              ></nz-statistic>
              <ng-template #issueIcon><i nz-icon nzType="warning" nzTheme="outline"></i></ng-template>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-statistic
                [nzValue]="stats().openIssues"
                [nzTitle]="'待解决'"
                [nzPrefix]="exclamationIcon"
                [nzValueStyle]="{ color: '#cf1322' }"
              ></nz-statistic>
              <ng-template #exclamationIcon><i nz-icon nzType="exclamation-circle" nzTheme="outline"></i></ng-template>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-statistic
                [nzValue]="stats().resolvedIssues"
                [nzTitle]="'已解决'"
                [nzPrefix]="checkCircleIcon"
                [nzValueStyle]="{ color: '#3f8600' }"
              ></nz-statistic>
              <ng-template #checkCircleIcon><i nz-icon nzType="check-circle" nzTheme="outline"></i></ng-template>
            </div>
          </div>
          <nz-divider></nz-divider>
          <div nz-row>
            <div nz-col [nzSpan]="24">
              <nz-statistic
                [nzValue]="stats().issueResolutionRate"
                [nzTitle]="'解决率'"
                [nzSuffix]="'%'"
                [nzPrecision]="1"
                [nzValueStyle]="{ color: stats().issueResolutionRate >= 80 ? '#3f8600' : '#cf1322' }"
              ></nz-statistic>
            </div>
          </div>
        </nz-card>

        <!-- Progress Overview Card -->
        <nz-card nzTitle="整体进度概览">
          <nz-alert
            nzType="info"
            nzMessage="数据说明"
            nzDescription="以上统计数据基于当前系统中的所有任务和问题。数据每小时自动更新一次。"
            [nzShowIcon]="true"
          ></nz-alert>
        </nz-card>
      }
    </div>
  `
})
export class StatisticsComponent implements OnInit {
  private progressRepo = inject(ProgressTrackingRepository);
  private issueRepo = inject(IssueRepository);
  private taskRepo = inject(TaskRepository);
  private message = inject(NzMessageService);

  stats = signal<StatisticsData>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    totalIssues: 0,
    openIssues: 0,
    resolvedIssues: 0,
    issueResolutionRate: 0
  });
  loading = signal(false);

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loading.set(true);

    // Fetch progress tracking data to calculate task statistics
    forkJoin({
      progress: this.progressRepo.findAll({ pageSize: 1000 }),
      issues: this.issueRepo.findAll({ pageSize: 1000 })
    }).subscribe({
      next: ({ progress, issues }) => {
        // Calculate task statistics from progress tracking
        const totalTasks = progress.reduce((sum, p) => sum + (p.totalTasks || 0), 0);
        const completedTasks = progress.reduce((sum, p) => sum + (p.completedTasks || 0), 0);
        const inProgressTasks = progress.reduce((sum, p) => sum + (p.inProgressTasks || 0), 0);
        const pendingTasks = progress.reduce((sum, p) => sum + (p.pendingTasks || 0), 0);
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Calculate issue statistics
        const totalIssues = issues.length;
        const openIssues = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
        const resolvedIssues = issues.filter(i => i.status === 'resolved' || i.status === 'closed').length;
        const issueResolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

        this.stats.set({
          totalTasks,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          completionRate,
          totalIssues,
          openIssues,
          resolvedIssues,
          issueResolutionRate
        });

        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Failed to load statistics:', err);
        this.message.error('加载统计数据失败');
        this.loading.set(false);
      }
    });
  }
}
