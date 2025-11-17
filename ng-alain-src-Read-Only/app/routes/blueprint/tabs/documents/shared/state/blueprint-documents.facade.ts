import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrganizationContextService } from '@core';
import type { BlueprintAggregationResult, BlueprintDocumentAggregation } from '@shared/models/blueprint-aggregation.model';
import type { Blueprint } from '@shared/models/blueprint.model';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BlueprintTabRepository } from '../../../shared/data-access/blueprint-tab.repository';
import { BlueprintAggregationRefreshService } from '../../../shared/state/blueprint-aggregation-refresh.service';

interface BlueprintDocumentsViewModel {
  readonly blueprint: Blueprint | null;
  readonly aggregation: BlueprintDocumentAggregation | null;
  readonly generatedAt: string | null;
}

@Injectable({ providedIn: 'any' })
export class BlueprintDocumentsFacade {
  private readonly tabRepository = inject(BlueprintTabRepository);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly refreshService = inject(BlueprintAggregationRefreshService);

  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintIdSignal = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([orgId, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.tabRepository.getBlueprintId(orgId ?? null, slug)).pipe(
          catchError(error => {
            console.error('取得 Blueprint ID 失敗', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly viewModelSignal = signal<BlueprintDocumentsViewModel | null>(null);

  constructor() {
    effect(() => {
      const blueprintId = this.blueprintIdSignal();
      if (!blueprintId) {
        this.viewModelSignal.set(null);
        return;
      }
      void this.load(blueprintId);
    });

    effect(() => {
      const blueprintId = this.blueprintIdSignal();
      if (!blueprintId) {
        return;
      }
      const subscription = this.refreshService.listen(blueprintId, ['documents']).subscribe(() => {
        void this.load(blueprintId);
      });
      return () => subscription.unsubscribe();
    });
  }

  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly blueprintId = computed(() => this.blueprintIdSignal());
  readonly viewModel = computed(() => this.viewModelSignal());
  readonly blueprint = computed(() => this.viewModelSignal()?.blueprint ?? null);
  readonly aggregation = computed(() => this.viewModelSignal()?.aggregation ?? null);
  readonly generatedAt = computed(() => this.viewModelSignal()?.generatedAt ?? null);
  readonly totals = computed(() => this.aggregation()?.totals ?? null);
  readonly distributionByType = computed(() => this.aggregation()?.byType ?? []);
  readonly distributionByDirectory = computed(() => this.aggregation()?.byDirectory ?? []);
  readonly classification = computed(() => this.aggregation()?.classification ?? null);
  readonly disciplineSummary = computed(() => this.classification()?.discipline ?? []);
  readonly phaseSummary = computed(() => this.classification()?.phase ?? []);
  readonly packageSummary = computed(() => this.classification()?.package ?? []);
  readonly recentDocuments = computed(() => this.aggregation()?.recent ?? []);

  async refresh(): Promise<void> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      return;
    }
    await this.load(blueprintId);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const [aggregationResult, infoResult] = await Promise.all([
        this.tabRepository.getBlueprintAggregation(blueprintId, { includeDimensions: ['documents'] }),
        this.tabRepository.getBlueprintInfo(blueprintId)
      ]);

      if (aggregationResult.error) {
        throw aggregationResult.error;
      }

      if (infoResult.error) {
        throw infoResult.error;
      }

      this.viewModelSignal.set({
        blueprint: infoResult.data?.blueprint ?? null,
        aggregation: this.extractDocumentsAggregation(aggregationResult.data),
        generatedAt: aggregationResult.data?.generatedAt ?? null
      });
    } catch (error) {
      console.error('載入文件聚合失敗', error);
      this.errorSignal.set(error instanceof Error ? error.message : '載入文件資訊失敗');
      this.viewModelSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private extractDocumentsAggregation(result: BlueprintAggregationResult | null | undefined): BlueprintDocumentAggregation | null {
    return result?.documents ?? null;
  }
}
