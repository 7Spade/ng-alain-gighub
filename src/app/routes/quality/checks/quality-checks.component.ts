import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-quality-checks',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'质量检查'"></page-header>

    <nz-card nzTitle="质量检查管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="质量检查功能开发中"
        nzDescription="此页面将用于管理质量检查。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class QualityChecksComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载质量检查数据
  }
}
