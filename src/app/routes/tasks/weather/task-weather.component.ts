import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-weather',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'天气记录'"></page-header>

    <nz-card nzTitle="天气记录管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="天气记录功能开发中"
        nzDescription="此页面将用于管理天气记录。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskWeatherComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载天气记录数据
  }
}

