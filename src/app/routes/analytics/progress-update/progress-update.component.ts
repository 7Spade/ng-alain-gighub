import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-progress-update',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'进度更新'"></page-header>

    <nz-card nzTitle="进度更新记录" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="进度更新功能建设中"
        nzDescription="此页面将用于维护进度播报与关键里程碑。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class ProgressUpdateComponent {}


