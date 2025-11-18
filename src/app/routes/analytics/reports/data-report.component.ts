import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-data-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'数据报告'"></page-header>

    <nz-card nzTitle="数据报告" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="数据报告功能建设中"
        nzDescription="此页面将支持自定义报表配置与导出。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DataReportComponent {}
