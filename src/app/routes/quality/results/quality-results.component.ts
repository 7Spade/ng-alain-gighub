import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-quality-results',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收结果'"></page-header>

    <nz-card nzTitle="验收结果管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="验收结果功能开发中"
        nzDescription="此页面将用于查看和管理验收结果。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class QualityResultsComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载验收结果数据
  }
}

