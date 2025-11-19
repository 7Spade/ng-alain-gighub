import { inject, Injectable } from '@angular/core';
import type { BlueprintAggregationFilters, BlueprintAggregationResult } from '@shared/models/blueprint-aggregation.model';
import type { Blueprint } from '@shared/models/blueprint.model';
import type { User } from '@shared/models/user.model';

import { BlueprintTabRepository } from '../../shared/data-access/blueprint-tab.repository';

@Injectable({
  providedIn: 'root'
})
export class OverviewRepository {
  private readonly repo = inject(BlueprintTabRepository);

  async getBlueprintId(orgId: string | null, slug: string): Promise<string | null> {
    return this.repo.getBlueprintId(orgId, slug);
  }

  async getBlueprintAggregation(
    blueprintId: string,
    filters?: BlueprintAggregationFilters
  ): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> {
    return this.repo.getBlueprintAggregation(blueprintId, filters);
  }

  async getBlueprintInfo(blueprintId: string): Promise<{
    data: { blueprint: Blueprint; projectManager: User | null } | null;
    error: Error | null;
  }> {
    return this.repo.getBlueprintInfo(blueprintId);
  }
}
