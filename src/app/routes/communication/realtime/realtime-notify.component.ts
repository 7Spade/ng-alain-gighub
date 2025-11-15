import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-realtime-notify',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'即时通知'"></page-header>

    <nz-card nzTitle="实时通知" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="实时通知功能建设中"
        nzDescription="此页面将展示 WebSocket 推送与订阅配置。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class RealtimeNotifyComponent {}
