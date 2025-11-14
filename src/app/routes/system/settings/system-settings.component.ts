import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系统设置'"></page-header>

    <nz-card nzTitle="系统设置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="系统设置功能建设中"
        nzDescription="此页面将集中维护平台级参数与主题配置。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class SystemSettingsComponent {}


