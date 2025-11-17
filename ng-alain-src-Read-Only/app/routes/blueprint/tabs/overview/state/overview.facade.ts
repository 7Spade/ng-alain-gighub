import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrganizationContextService } from '@core';
import type {
  BlueprintAggregationDimension,
  BlueprintAggregationFilters,
  BlueprintAggregationResult,
  BlueprintTaskPriority,
  BlueprintTaskStatus
} from '@shared/models/blueprint-aggregation.model';
import type { Blueprint, BlueprintMemberWithUser, BlueprintMilestone } from '@shared/models/blueprint.model';
import type { User } from '@shared/models/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BlueprintAggregationRefreshService } from '../../shared/state/blueprint-aggregation-refresh.service';
import { OverviewRepository } from '../data-access/overview.repository';
import type {
  OverviewMemberStats,
  OverviewMilestoneStats,
  OverviewProgressSummary,
  OverviewTaskSegments,
  OverviewTaskStats,
  OverviewTaskRecentItem
} from '../models/overview-view.model';
import { resolveProgressHealth } from '../utils/overview-health.utils';
import { getStatusColor, getStatusText } from '../utils/overview-status.utils';
import { getTaskPriorityColor, getTaskStatusColor } from '../utils/overview-task.utils';

type BlueprintStatus = Blueprint['status'];

const OVERVIEW_REFRESH_DIMENSIONS: BlueprintAggregationDimension[] = [
  'progress',
  'milestones',
  'tasks',
  'dailyReports',
  'quality',
  'members',
  'activities',
  'documents'
];

interface OverviewBlueprintInfo {
  readonly blueprint: Blueprint;
  readonly projectManager: User | null;
}

@Injectable({ providedIn: 'any' })
export class OverviewFacade {
  private readonly repository = inject(OverviewRepository);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);
  private readonly refreshService = inject(BlueprintAggregationRefreshService);

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

  private readonly aggregationSignal = signal<BlueprintAggregationResult | null>(null);
  private readonly blueprintInfoSignal = signal<OverviewBlueprintInfo | null>(null);
  private readonly loadingSignal = signal(false);

  constructor() {
    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        this.resetState();
        return;
      }
      void this.load(blueprintId);
    });

    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        return;
      }
      const subscription = this.refreshService.listen(blueprintId, OVERVIEW_REFRESH_DIMENSIONS).subscribe(() => {
        void this.load(blueprintId);
      });
      return () => subscription.unsubscribe();
    });
  }

  readonly loading = computed(() => this.loadingSignal());

  readonly blueprintInfo = computed(() => this.blueprintInfoSignal());

  readonly members = computed<BlueprintMemberWithUser[]>(() => {
    const list = this.aggregationSignal()?.members?.members ?? [];
    return [...list];
  });

  readonly milestones = computed<BlueprintMilestone[]>(() => {
    const list = this.aggregationSignal()?.milestones?.list ?? [];
    return [...list].sort((a, b) => {
      if (a.order_index !== b.order_index) {
        return a.order_index - b.order_index;
      }
      const aDate = a.target_date ? new Date(a.target_date).getTime() : Number.MAX_SAFE_INTEGER;
      const bDate = b.target_date ? new Date(b.target_date).getTime() : Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });
  });

  readonly milestoneStats = computed<OverviewMilestoneStats>(() => {
    const aggregation = this.aggregationSignal()?.milestones;
    if (!aggregation) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        cancelled: 0,
        averageProgress: 0,
        successPercent: 0,
        upcoming: []
      };
    }

    const totals = aggregation.totals;
    const list = aggregation.list ?? [];
    const upcoming = (aggregation.upcoming ?? []).map(snapshot => {
      const found = list.find(item => item.id === snapshot.id);
      if (found) {
        return found;
      }

      return {
        id: snapshot.id,
        blueprint_id: this.blueprintId() ?? '',
        name: snapshot.name,
        description: null,
        status: snapshot.status,
        target_date: snapshot.targetDate,
        completed_date: null,
        progress_percentage: snapshot.progressPercentage ?? 0,
        order_index: 0,
        created_at: snapshot.targetDate ?? new Date().toISOString(),
        updated_at: snapshot.targetDate ?? new Date().toISOString()
      } satisfies BlueprintMilestone;
    });

    return {
      total: totals.total,
      completed: totals.completed,
      inProgress: totals.inProgress,
      planned: totals.planned,
      cancelled: totals.cancelled,
      averageProgress: totals.averageProgress,
      successPercent: totals.successPercent,
      upcoming
    };
  });

  readonly taskStats = computed<OverviewTaskStats>(() => {
    const aggregation = this.aggregationSignal()?.tasks;
    if (!aggregation) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
        completionRate: 0,
        activeRate: 0,
        recent: []
      };
    }

    const totals = aggregation.totals;
    const recent: OverviewTaskRecentItem[] = (aggregation.recent ?? []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      status: item.status,
      priority: item.priority,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    return {
      total: totals.total,
      completed: totals.completed,
      inProgress: totals.inProgress,
      pending: totals.pending,
      cancelled: totals.cancelled,
      completionRate: totals.completionRate,
      activeRate: totals.activeRate,
      recent
    };
  });

  readonly progressSummary = computed<OverviewProgressSummary>(() => {
    const aggregation = this.aggregationSignal()?.progress?.summary;
    const info = this.blueprintInfoSignal();

    if (!aggregation || !info) {
      return {
        percent: 0,
        status: 'planning',
        lastUpdatedAt: null,
        startDate: null,
        endDate: null,
        hasDates: false,
        health: { status: 'processing', label: '尚無資料' }
      };
    }

    const lastUpdatedAt = aggregation.lastUpdatedAt ? new Date(aggregation.lastUpdatedAt) : null;
    const startDate = info.blueprint.start_date ? new Date(info.blueprint.start_date) : null;
    const endDate = info.blueprint.end_date ? new Date(info.blueprint.end_date) : null;
    const hasDates = Boolean(startDate || endDate);
    const health = resolveProgressHealth(aggregation.percent, aggregation.status, lastUpdatedAt);

    return {
      percent: aggregation.percent,
      status: aggregation.status,
      lastUpdatedAt,
      startDate,
      endDate,
      hasDates,
      health
    };
  });

  readonly progressStrokeColor = computed<string | Record<string, string>>(() => {
    const summary = this.progressSummary();
    if (summary.percent >= 90) {
      return { '0%': '#87d068', '100%': '#52c41a' };
    }
    if (summary.percent >= 60) {
      return { '0%': '#69c0ff', '100%': '#0050b3' };
    }
    return { '0%': '#ffd666', '100%': '#fa8c16' };
  });

  readonly milestoneProgressStroke = computed(() => {
    const stats = this.milestoneStats();
    if (stats.successPercent >= 80) {
      return { '0%': '#b7eb8f', '100%': '#52c41a' };
    }
    if (stats.successPercent >= 50) {
      return { '0%': '#91d5ff', '100%': '#1890ff' };
    }
    return { '0%': '#ffd666', '100%': '#fa8c16' };
  });

  readonly taskProgressSegments = computed<OverviewTaskSegments>(() => {
    const stats = this.taskStats();
    if (stats.total === 0) {
      return { completed: 0, active: 0 };
    }
    return {
      completed: stats.completionRate,
      active: stats.activeRate
    };
  });

  readonly memberStats = computed<OverviewMemberStats>(() => {
    const aggregation = this.aggregationSignal()?.members;
    if (!aggregation) {
      return { total: 0, owners: 0, managers: 0 };
    }

    const owners = aggregation.members.filter(member => member.role === 'owner').length;
    const managers = aggregation.members.filter(member => member.role === 'manager').length;

    return {
      total: aggregation.total,
      owners,
      managers
    };
  });

  getStatusColor(status: BlueprintStatus): string {
    return getStatusColor(status);
  }

  getStatusText(status: BlueprintStatus): string {
    return getStatusText(status);
  }

  getTaskPriorityColor(priority: BlueprintTaskPriority | null | undefined): string {
    return getTaskPriorityColor(priority);
  }

  getTaskStatusColor(status: BlueprintTaskStatus | null | undefined): string {
    return getTaskStatusColor(status);
  }

  private async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);

    const filters: BlueprintAggregationFilters = {
      includeDimensions: ['progress', 'milestones', 'tasks', 'members', 'dailyReports']
    };

    try {
      const [aggregationResult, infoResult] = await Promise.all([
        this.repository.getBlueprintAggregation(blueprintId, filters),
        this.repository.getBlueprintInfo(blueprintId)
      ]);

      if (aggregationResult.error) {
        this.msg.error(aggregationResult.error.message || '載入藍圖聚合資料失敗');
        this.aggregationSignal.set(null);
      } else {
        this.aggregationSignal.set(aggregationResult.data);
      }

      if (infoResult.error) {
        this.msg.error(infoResult.error.message || '載入藍圖資訊失敗');
        this.blueprintInfoSignal.set(null);
      } else {
        this.blueprintInfoSignal.set(infoResult.data);
      }
    } catch (error) {
      console.error('載入藍圖概覽資料失敗', error);
      this.msg.error(error instanceof Error ? error.message : '載入藍圖概覽資料失敗');
      this.aggregationSignal.set(null);
      this.blueprintInfoSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private resetState(): void {
    this.aggregationSignal.set(null);
    this.blueprintInfoSignal.set(null);
    this.loadingSignal.set(false);
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const slug = params['slug'];
    const org = this.orgContext.currentOrganization();
    return this.repository.getBlueprintId(org?.id ?? null, slug);
  }
}
