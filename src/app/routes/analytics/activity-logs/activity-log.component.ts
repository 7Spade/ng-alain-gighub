import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'活动日志'"></page-header>

    <nz-card nzTitle="活动日志" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="活动日志功能建设中"
        nzDescription="此页面将整合系统关键行为的审计记录。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class ActivityLogComponent {}


