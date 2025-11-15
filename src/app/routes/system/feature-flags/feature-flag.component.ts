import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-feature-flag',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'功能开关'"></page-header>

    <nz-card nzTitle="功能开关" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="功能开关模块建设中"
        nzDescription="此页面将管理功能标记、灰度策略与快照。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class FeatureFlagComponent {}
