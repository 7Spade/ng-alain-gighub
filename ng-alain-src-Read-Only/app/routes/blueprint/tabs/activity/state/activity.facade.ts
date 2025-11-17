import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrganizationContextService } from '@core';
import type { BlueprintActivityAggregation, BlueprintActivityListItem } from '@shared/models/blueprint-aggregation.model';
import type { Blueprint, BlueprintActivityType } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BlueprintTabRepository } from '../../shared/data-access/blueprint-tab.repository';
import { BlueprintAggregationRefreshService } from '../../shared/state/blueprint-aggregation-refresh.service';

type ActivityFilterType = 'all' | BlueprintActivityType;

@Injectable({ providedIn: 'any' })
export class BlueprintActivityFacade {
  private readonly repository = inject(BlueprintTabRepository);
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

  private readonly loadingSignal = signal(false);
  private readonly blueprintSignal = signal<Blueprint | null>(null);
  private readonly activitiesSignal = signal<BlueprintActivityListItem[]>([]);
  private readonly aggregationSignal = signal<BlueprintActivityAggregation | null>(null);
  private readonly searchSignal = signal('');
  private readonly typeFilterSignal = signal<ActivityFilterType>('all');
  private readonly errorSignal = signal<string | null>(null);

  constructor() {
    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        this.resetState();
        return;
      }
      void this.loadData(blueprintId);
    });

    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        return;
      }
      const subscription = this.refreshService.listen(blueprintId, ['activities']).subscribe(() => {
        void this.loadData(blueprintId);
      });
      return () => subscription.unsubscribe();
    });
  }

  readonly loading = computed(() => this.loadingSignal());

  readonly blueprint = computed(() => this.blueprintSignal());

  readonly activities = computed(() => this.activitiesSignal());

  readonly filteredActivities = computed(() => {
    const list = this.activitiesSignal();
    const search = this.searchSignal().trim().toLowerCase();
    const type = this.typeFilterSignal();

    return list.filter(item => {
      const matchesType = type === 'all' || item.type === type;
      if (!matchesType) {
        return false;
      }
      if (!search) {
        return true;
      }
      const target = `${item.description} ${item.action} ${item.userName}`.toLowerCase();
      return target.includes(search);
    });
  });

  readonly typeFilter = computed(() => this.typeFilterSignal());
  readonly searchText = computed(() => this.searchSignal());
  readonly error = computed(() => this.errorSignal());

  readonly typeDistribution = computed(() => this.aggregationSignal()?.byType ?? []);
  readonly userDistribution = computed(() => this.aggregationSignal()?.byUser ?? []);
  readonly timeline = computed(() => this.aggregationSignal()?.timeline ?? []);
  readonly totals = computed(() => this.aggregationSignal()?.totals ?? { total: 0, uniqueUsers: 0, since: null });

  setSearch(value: string): void {
    this.searchSignal.set(value ?? '');
  }

  setType(value: ActivityFilterType): void {
    this.typeFilterSignal.set(value);
  }

  private async loadData(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const [aggregationResult, infoResult] = await Promise.all([
        this.repository.getBlueprintAggregation(blueprintId, {
          includeDimensions: ['activities']
        }),
        this.repository.getBlueprintInfo(blueprintId)
      ]);

      if (aggregationResult.error) {
        this.msg.error(aggregationResult.error.message || '載入活動聚合資料失敗');
        this.errorSignal.set(aggregationResult.error.message || '載入活動資料失敗');
        this.activitiesSignal.set([]);
        this.aggregationSignal.set(null);
      } else {
        const aggregation = aggregationResult.data?.activities ?? null;
        this.activitiesSignal.set([...(aggregation?.recent ?? [])]);
        this.aggregationSignal.set(aggregation);
      }

      if (infoResult.error) {
        this.msg.error(infoResult.error.message || '載入藍圖資訊失敗');
        this.blueprintSignal.set(null);
      } else {
        this.blueprintSignal.set(infoResult.data?.blueprint ?? null);
      }
    } catch (error) {
      console.error('載入藍圖活動資料失敗', error);
      this.msg.error(error instanceof Error ? error.message : '載入藍圖活動資料失敗');
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.activitiesSignal.set([]);
      this.aggregationSignal.set(null);
      this.blueprintSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const slug = params['slug'];
    const org = this.orgContext.currentOrganization();
    return this.repository.getBlueprintId(org?.id ?? null, slug);
  }

  private resetState(): void {
    this.loadingSignal.set(false);
    this.activitiesSignal.set([]);
    this.aggregationSignal.set(null);
    this.blueprintSignal.set(null);
    this.errorSignal.set(null);
  }
}
