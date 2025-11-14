import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务分配'"></page-header>

    <nz-card nzTitle="任务分配管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="任务分配功能开发中"
        nzDescription="此页面将用于管理任务的分配。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskAssignmentsComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载任务分配数据
  }
}

