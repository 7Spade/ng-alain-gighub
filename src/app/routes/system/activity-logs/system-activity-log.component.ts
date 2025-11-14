import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-system-activity-log',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系统活动日志'"></page-header>

    <nz-card nzTitle="系统活动日志" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="系统活动日志功能建设中"
        nzDescription="此页面将展示平台级操作日志与审计轨迹。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class SystemActivityLogComponent {}


