import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-sync-logs',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'问题同步日志'"></page-header>

    <nz-card nzTitle="同步日志" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题同步日志功能建设中"
        nzDescription="此页面将展示问题从分支同步到主分支的历史记录。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class SyncLogs {}
