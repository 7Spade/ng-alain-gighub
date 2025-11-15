import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-main-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'主分支报告'"></page-header>

    <nz-card nzTitle="主分支报告" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="主分支报告功能建设中"
        nzDescription="此页面将输出主分支的整体执行报告与 KPI。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class MainReportComponent {}
