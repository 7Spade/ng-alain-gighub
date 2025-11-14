import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-cross-branch',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'跨分支总览'"></page-header>

    <nz-card nzTitle="跨分支总览" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="跨分支总览功能建设中"
        nzDescription="此页面将对比多个分支的执行指标与风险。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class CrossBranchComponent {}


