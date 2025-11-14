import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-branch-report',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'分支报告'"></page-header>

    <nz-card nzTitle="分支报告" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="分支报告功能建设中"
        nzDescription="此页面将提供分支级别的执行报告与对比。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BranchReportComponent {}


