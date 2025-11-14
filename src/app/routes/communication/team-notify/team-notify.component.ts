import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-team-notify',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'团队通知'"></page-header>

    <nz-card nzTitle="团队通知" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="团队通知功能建设中"
        nzDescription="此页面将管理跨团队公告与站内广播。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TeamNotifyComponent {}


