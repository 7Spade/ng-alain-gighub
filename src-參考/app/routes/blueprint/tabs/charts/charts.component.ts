import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { Chart } from '@antv/g2';
import { BlueprintService, OrganizationContextService } from '@core';
import { SHARED_IMPORTS } from '@shared';
import type {
  AggregatedSeriesPoint,
  AggregationDistributionEntry,
  BlueprintDailyReportAggregation,
  BlueprintMilestoneAggregation,
  BlueprintProgressAggregation,
  BlueprintTaskAggregation,
  BlueprintTaskStatusPriorityEntry,
  BlueprintTaskTimelinePoint
} from '@shared/models/blueprint-aggregation.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import type {
  BarChartData,
  LineChartData,
  PieChartData,
  RadarChartData,
  TagCloudData,
  TimelineData,
  EChartsCombinedData
} from './chart-types';
import { BlueprintChartsFacade } from './state/blueprint-charts.facade';

type TaskStatus = BlueprintTaskStatusPriorityEntry['status'];
type TaskPriority = BlueprintTaskStatusPriorityEntry['priority'];

@Component({
  selector: 'app-blueprint-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintChartsComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly chartsFacade = inject(BlueprintChartsFacade);

  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintId = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.getBlueprintIdBySlug()).pipe(
          catchError(error => {
            console.error('計算 Blueprint ID 失敗:', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  readonly aggregation = this.chartsFacade.aggregation;
  readonly loading = computed(() => this.chartsFacade.loading());
  readonly error = this.chartsFacade.error;

  private readonly tasksAggregation = computed<BlueprintTaskAggregation | null>(() => this.aggregation()?.tasks ?? null);
  private readonly progressAggregation = computed<BlueprintProgressAggregation | null>(() => this.aggregation()?.progress ?? null);
  private readonly milestonesAggregation = computed<BlueprintMilestoneAggregation | null>(() => this.aggregation()?.milestones ?? null);
  private readonly dailyReportsAggregation = computed<BlueprintDailyReportAggregation | null>(
    () => this.aggregation()?.dailyReports ?? null
  );

  readonly totalTasks = computed(() => this.tasksAggregation()?.totals.total ?? 0);
  readonly completedTasks = computed(() => this.tasksAggregation()?.totals.completed ?? 0);
  readonly inProgressTasks = computed(() => this.tasksAggregation()?.totals.inProgress ?? 0);
  readonly todoTasks = computed(() => this.tasksAggregation()?.totals.pending ?? 0);
  readonly totalMilestones = computed(() => this.milestonesAggregation()?.totals.total ?? 0);
  readonly completedMilestones = computed(() => this.milestonesAggregation()?.totals.completed ?? 0);
  readonly totalDailyReports = computed(() => this.dailyReportsAggregation()?.summary.total ?? 0);
  readonly totalMembers = computed(() => this.aggregation()?.members?.total ?? 0);

  readonly taskCompletionRate = computed(() => Math.round(this.tasksAggregation()?.totals.completionRate ?? 0));
  readonly taskCompletionTrend = this.taskCompletionRate;
  readonly milestoneCompletionRate = computed(() => Math.round(this.milestonesAggregation()?.totals.successPercent ?? 0));
  readonly milestoneCompletionTrend = this.milestoneCompletionRate;

  readonly taskStatusData = computed<PieChartData[]>(() => this.mapDistributionToPie(this.tasksAggregation()?.statusBreakdown ?? []));
  readonly taskPriorityData = computed<BarChartData[]>(() => this.mapDistributionToBar(this.tasksAggregation()?.priorityBreakdown ?? []));
  readonly milestoneStatusData = computed<PieChartData[]>(() => {
    const totals = this.milestonesAggregation()?.totals;
    if (!totals) {
      return [];
    }
    return [
      { x: '規劃中', y: totals.planned },
      { x: '進行中', y: totals.inProgress },
      { x: '已完成', y: totals.completed },
      { x: '已取消', y: totals.cancelled }
    ].filter(item => item.y > 0);
  });

  readonly taskPriorityRadarData = computed<RadarChartData[]>(() => {
    const matrix = this.tasksAggregation()?.statusPriorityMatrix ?? [];
    return matrix.map(entry => ({
      name: this.getPriorityLabel(entry.priority),
      label: this.getStatusLabel(entry.status),
      value: entry.count
    }));
  });

  readonly progressTrendData = computed<LineChartData[]>(() => {
    const history = this.progressAggregation()?.history ?? [];
    return history
      .map(point => ({
        x: this.formatShortDate(point.date),
        y: point.percent
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  });

  readonly taskTimelineData = computed<TimelineData[]>(() => {
    const timeline = this.tasksAggregation()?.timeline ?? [];
    return timeline.map(point => this.mapTimelinePoint(point)).sort((a, b) => a.time - b.time);
  });

  readonly progressTaskCombinedData = computed<EChartsCombinedData[]>(() => {
    const map = new Map<string, { tasks: number; progress: number }>();

    for (const point of this.tasksAggregation()?.timeline ?? []) {
      map.set(point.date, {
        tasks: point.taskCount,
        progress: map.get(point.date)?.progress ?? 0
      });
    }

    for (const history of this.progressAggregation()?.history ?? []) {
      const existing = map.get(history.date) ?? { tasks: 0, progress: 0 };
      map.set(history.date, {
        tasks: existing.tasks,
        progress: Math.max(existing.progress, history.percent)
      });
    }

    return Array.from(map.entries())
      .map(([date, values]) => ({ date, tasks: values.tasks, progress: values.progress }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });

  readonly dailyReportTimeSeriesData = computed<LineChartData[]>(() =>
    this.mapSeriesToLine(this.dailyReportsAggregation()?.progressSeries ?? [])
  );
  readonly dailyActivityData = computed<LineChartData[]>(() => this.mapSeriesToLine(this.dailyReportsAggregation()?.activitySeries ?? []));

  readonly weatherDistributionData = computed<PieChartData[]>(() =>
    this.mapDistributionToPie(this.dailyReportsAggregation()?.weatherDistribution ?? [])
  );
  readonly participantStatsData = computed<BarChartData[]>(() =>
    this.mapDistributionToBar(this.dailyReportsAggregation()?.participantDistribution ?? []).slice(0, 10)
  );
  readonly issuesStatsData = computed<PieChartData[]>(() =>
    this.mapDistributionToPie(this.dailyReportsAggregation()?.issueDistribution ?? [])
  );

  readonly taskTagCloudData = computed<TagCloudData[]>(() =>
    (this.tasksAggregation()?.tagCloud ?? []).map(tag => ({ name: tag.tag, value: tag.weight }))
  );

  constructor() {
    effect(() => {
      const blueprintId = this.blueprintId();
      if (blueprintId) {
        void this.chartsFacade.load(blueprintId);
      } else {
        this.chartsFacade.reset();
      }
    });

    effect(() => {
      const error = this.error();
      if (error) {
        this.msg.error(error);
      }
    });
  }

  fixDark(chart: Chart): void {
    const isDark = document.body.classList.contains('dark') || document.documentElement.classList.contains('dark');

    if (isDark) {
      chart.theme({
        styleSheet: {
          backgroundColor: 'transparent',
          brandColor: '#1890ff',
          paletteQualitative10: [
            '#1890ff',
            '#52c41a',
            '#faad14',
            '#f5222d',
            '#722ed1',
            '#13c2c2',
            '#eb2f96',
            '#fa8c16',
            '#2f54eb',
            '#a0d911'
          ],
          paletteQualitative20: [
            '#1890ff',
            '#52c41a',
            '#faad14',
            '#f5222d',
            '#722ed1',
            '#13c2c2',
            '#eb2f96',
            '#fa8c16',
            '#2f54eb',
            '#a0d911',
            '#1890ff',
            '#52c41a',
            '#faad14',
            '#f5222d',
            '#722ed1',
            '#13c2c2',
            '#eb2f96',
            '#fa8c16',
            '#2f54eb',
            '#a0d911'
          ]
        }
      });
    } else {
      chart.theme({
        styleSheet: {
          backgroundColor: 'transparent'
        }
      });
    }
  }

  getEChartsOption(): any {
    const data = this.progressTaskCombinedData();
    const dates = data.map(d => d.date);
    const tasks = data.map(d => d.tasks);
    const progress = data.map(d => d.progress);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['任務數', '進度百分比']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates
      },
      yAxis: [
        {
          type: 'value',
          name: '任務數',
          position: 'left'
        },
        {
          type: 'value',
          name: '進度百分比',
          position: 'right',
          max: 100
        }
      ],
      series: [
        {
          name: '任務數',
          type: 'bar',
          data: tasks,
          yAxisIndex: 0
        },
        {
          name: '進度百分比',
          type: 'line',
          data: progress,
          yAxisIndex: 1
        }
      ]
    };
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const orgSlug = params['org'];
    const slug = params['slug'];

    if (!slug) {
      return null;
    }

    const isUserView = !orgSlug;

    try {
      if (isUserView) {
        const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
        return data?.id || null;
      }

      const org = this.orgContext.currentOrganization();
      if (!org) {
        return null;
      }
      const { data } = await this.blueprintService.getBlueprintBySlug(org.id, slug);
      return data?.id || null;
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  private mapDistributionToPie(distribution: readonly AggregationDistributionEntry[]): PieChartData[] {
    return distribution.map(entry => ({ x: entry.label ?? entry.key, y: entry.value })).filter(item => item.y > 0);
  }

  private mapDistributionToBar(distribution: readonly AggregationDistributionEntry[]): BarChartData[] {
    return distribution
      .map(entry => ({ x: entry.label ?? entry.key, y: entry.value }))
      .filter(item => item.y > 0)
      .sort((a, b) => b.y - a.y);
  }

  private mapSeriesToLine(series: readonly AggregatedSeriesPoint[]): LineChartData[] {
    return series
      .map(point => ({
        x: this.formatShortDate(point.date),
        y: point.value
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  }

  private mapTimelinePoint(point: BlueprintTaskTimelinePoint): TimelineData {
    return {
      time: new Date(point.date).getTime(),
      y1: point.taskCount,
      y2: point.milestoneCount
    };
  }

  private getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      todo: '待辦',
      'in-progress': '進行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return labels[status] ?? status;
  }

  private getPriorityLabel(priority: TaskPriority): string {
    if (!priority) {
      return '未設定';
    }
    const labels: Record<Exclude<TaskPriority, null>, string> = {
      low: '低',
      medium: '中',
      high: '高',
      urgent: '緊急'
    };
    return labels[priority] ?? priority;
  }

  private formatShortDate(date: string): string {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return date;
    }
    return parsed.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }
}
