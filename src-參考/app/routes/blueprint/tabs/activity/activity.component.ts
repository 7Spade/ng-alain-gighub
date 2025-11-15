import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { BlueprintActivityType } from '@shared/models/blueprint.model';

import { BlueprintActivityFacade } from './state/activity.facade';

@Component({
  selector: 'app-blueprint-activity',
  standalone: true,
  templateUrl: './activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintActivityComponent {
  private readonly facade = inject(BlueprintActivityFacade);

  readonly loading = this.facade.loading;
  readonly blueprint = this.facade.blueprint;
  readonly filteredActivities = this.facade.filteredActivities;
  readonly typeFilter = this.facade.typeFilter;
  readonly searchText = this.facade.searchText;

  readonly totals = this.facade.totals;
  readonly typeDistribution = this.facade.typeDistribution;
  readonly timeline = this.facade.timeline;

  onFilterChange(): void {
    // 視圖層只需響應 facade 的信號，無額外動作
  }

  onSearch(): void {
    // 同上
  }

  setSearch(value: string): void {
    this.facade.setSearch(value);
  }

  setType(value: 'all' | BlueprintActivityType): void {
    this.facade.setType(value);
  }

  getActivityTypeColor(type: BlueprintActivityType): string {
    const colors: Record<BlueprintActivityType, string> = {
      blueprint: 'geekblue',
      task: 'blue',
      milestone: 'green',
      document: 'orange',
      member: 'purple',
      progress: 'cyan',
      comment: 'default',
      report: 'gold',
      issue: 'red',
      discussion: 'magenta',
      quality: 'volcano'
    };
    return colors[type] ?? 'default';
  }

  getActivityTypeText(type: BlueprintActivityType): string {
    const texts: Record<BlueprintActivityType, string> = {
      blueprint: '藍圖',
      task: '任務',
      milestone: '里程碑',
      document: '文件',
      member: '成員',
      progress: '進度',
      comment: '評論',
      report: '報告',
      issue: '議題',
      discussion: '討論',
      quality: '品質'
    };
    return texts[type] ?? type;
  }
}
