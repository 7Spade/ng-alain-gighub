import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'通知中心'"></page-header>

    <nz-card nzTitle="通知中心" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="通知中心功能建设中"
        nzDescription="此页面将集中展示系统通知，并支持已读/未读与筛选。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class NotificationCenterComponent {}


