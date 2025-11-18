import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-progress-tracking',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'进度追踪'"></page-header>

    <nz-card nzTitle="进度追踪" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="进度追踪功能建设中"
        nzDescription="此页面将展示蓝图与任务的整体进度趋势。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class ProgressTrackingComponent {}
