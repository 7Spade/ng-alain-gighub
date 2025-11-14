import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-calendar',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'任务日历'"></page-header>

    <nz-card nzTitle="任务日历视图" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="任务日历功能开发中"
        nzDescription="此页面将用于以日历形式展示任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskCalendarComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载任务日历数据
  }
}

