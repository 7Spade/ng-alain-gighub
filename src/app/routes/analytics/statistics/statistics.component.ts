import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-analytics-statistics',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'统计总览'"></page-header>

    <nz-card nzTitle="统计总览" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="统计模块建设中"
        nzDescription="此页面将汇总各业务模块的 KPI 与运行指标。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class StatisticsComponent {}
