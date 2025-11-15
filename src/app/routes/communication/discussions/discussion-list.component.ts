import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'讨论区'"></page-header>

    <nz-card nzTitle="讨论区" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="讨论区功能建设中"
        nzDescription="此页面将展示协作讨论串及其最新动态。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DiscussionListComponent {}
