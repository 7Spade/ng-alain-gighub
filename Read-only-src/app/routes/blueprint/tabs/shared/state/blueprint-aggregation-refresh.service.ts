import { Injectable } from '@angular/core';
import type { BlueprintAggregationDimension } from '@shared/models/blueprint-aggregation.model';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface BlueprintAggregationRefreshEvent {
  readonly blueprintId: string;
  readonly dimensions: readonly BlueprintAggregationDimension[];
}

@Injectable({ providedIn: 'root' })
export class BlueprintAggregationRefreshService {
  private readonly refreshSubject = new Subject<BlueprintAggregationRefreshEvent>();

  emit(blueprintId: string | null | undefined, dimensions: readonly BlueprintAggregationDimension[]): void {
    if (!blueprintId || !dimensions.length) {
      return;
    }
    const uniqueDimensions = Array.from(new Set(dimensions));
    this.refreshSubject.next({ blueprintId, dimensions: uniqueDimensions });
  }

  listen(
    blueprintId: string | null | undefined,
    dimensions: readonly BlueprintAggregationDimension[]
  ): Observable<BlueprintAggregationRefreshEvent> {
    const source$ = this.refreshSubject.asObservable();
    if (!blueprintId || !dimensions.length) {
      return source$.pipe(filter(() => false));
    }
    const dimensionSet = new Set(dimensions);
    return source$.pipe(
      filter(
        (event): event is BlueprintAggregationRefreshEvent =>
          event.blueprintId === blueprintId && event.dimensions.some(dimension => dimensionSet.has(dimension))
      )
    );
  }
}
