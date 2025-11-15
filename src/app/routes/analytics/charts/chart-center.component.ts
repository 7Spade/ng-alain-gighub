import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-chart-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'图表中心'"></page-header>

    <nz-card nzTitle="图表中心" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="图表中心功能建设中"
        nzDescription="此页面将提供可配置的图表大屏。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class ChartCenterComponent {}
