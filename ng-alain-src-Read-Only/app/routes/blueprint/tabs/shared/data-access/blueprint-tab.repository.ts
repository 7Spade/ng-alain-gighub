import { inject, Injectable } from '@angular/core';
import { BlueprintService } from '@core';
import { UserService } from '@core/account/user/user.service';
import type { BlueprintAggregationFilters, BlueprintAggregationResult } from '@shared/models/blueprint-aggregation.model';
import type { Blueprint } from '@shared/models/blueprint.model';
import type { User } from '@shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class BlueprintTabRepository {
  private readonly blueprintService = inject(BlueprintService);
  private readonly userService = inject(UserService);

  async getBlueprintId(orgId: string | null, slug: string): Promise<string | null> {
    if (!slug) {
      return null;
    }

    if (!orgId) {
      const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
      return data?.id ?? null;
    }

    const { data } = await this.blueprintService.getBlueprintBySlug(orgId, slug);
    return data?.id ?? null;
  }

  async getBlueprintAggregation(
    blueprintId: string,
    filters?: BlueprintAggregationFilters
  ): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> {
    return this.blueprintService.getBlueprintAggregation(blueprintId, filters);
  }

  async getBlueprintInfo(blueprintId: string): Promise<{
    data: { blueprint: Blueprint; projectManager: User | null } | null;
    error: Error | null;
  }> {
    const { data, error } = await this.blueprintService.getBlueprintById(blueprintId);

    if (error || !data) {
      return { data: null, error };
    }

    let projectManager: User | null = null;
    if (data.project_manager_id) {
      const { data: manager } = await this.userService.getUserById(data.project_manager_id);
      projectManager = manager;
    }

    return {
      data: { blueprint: data, projectManager },
      error: null
    };
  }
}
