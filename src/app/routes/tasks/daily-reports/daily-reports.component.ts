import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-daily-reports',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'日报管理'"></page-header>

    <nz-card nzTitle="每日工作报告" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="日报功能开发中"
        nzDescription="此页面将用于管理每日工作报告。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DailyReportsComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载日报数据
  }
}
