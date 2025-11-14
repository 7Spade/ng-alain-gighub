import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-todo',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'待办列表'"></page-header>

    <nz-card nzTitle="任务待办列表" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="待办列表功能开发中"
        nzDescription="此页面将用于显示所有待办任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskTodoComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载待办列表数据
  }
}

