import { Injectable, effect, inject, signal } from '@angular/core';
import { BlueprintService } from '@core';
import type { BlueprintAggregationDimension, BlueprintAggregationResult } from '@shared/models/blueprint-aggregation.model';

import { BlueprintAggregationRefreshService } from '../../shared/state/blueprint-aggregation-refresh.service';

const CHARTS_DIMENSIONS: BlueprintAggregationDimension[] = ['tasks', 'progress', 'milestones', 'dailyReports', 'quality'];

@Injectable({ providedIn: 'root' })
export class BlueprintChartsFacade {
  private readonly blueprintService = inject(BlueprintService);
  private readonly refreshService = inject(BlueprintAggregationRefreshService);

  private readonly aggregationSignal = signal<BlueprintAggregationResult | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly currentBlueprintIdSignal = signal<string | null>(null);

  constructor() {
    effect(() => {
      const blueprintId = this.currentBlueprintIdSignal();
      if (!blueprintId) {
        return;
      }
      const subscription = this.refreshService.listen(blueprintId, CHARTS_DIMENSIONS).subscribe(() => {
        void this.load(blueprintId);
      });
      return () => subscription.unsubscribe();
    });
  }

  readonly aggregation = this.aggregationSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(blueprintId: string): Promise<void> {
    if (!blueprintId) {
      this.aggregationSignal.set(null);
      this.currentBlueprintIdSignal.set(null);
      return;
    }

    this.currentBlueprintIdSignal.set(blueprintId);
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const { data, error } = await this.blueprintService.getBlueprintAggregation(blueprintId, {
        includeDimensions: CHARTS_DIMENSIONS
      });

      if (error || !data) {
        this.errorSignal.set(error?.message || '無法載入藍圖聚合資料');
        this.aggregationSignal.set(null);
        return;
      }

      this.aggregationSignal.set(data);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.aggregationSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  reset(): void {
    this.aggregationSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
    this.currentBlueprintIdSignal.set(null);
  }
}
