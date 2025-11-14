import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-quality-inspections',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收管理'"></page-header>

    <nz-card nzTitle="验收管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="验收管理功能开发中"
        nzDescription="此页面将用于管理验收流程。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class QualityInspectionsComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载验收管理数据
  }
}

