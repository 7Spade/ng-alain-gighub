import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-staging',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'暂存区'"></page-header>

    <nz-card nzTitle="任务暂存区" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="暂存区功能开发中"
        nzDescription="此页面将用于管理48小时内可撤回的任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskStagingComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载暂存区数据
  }
}
