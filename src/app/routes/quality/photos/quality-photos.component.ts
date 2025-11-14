import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-quality-photos',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'验收照片'"></page-header>

    <nz-card nzTitle="验收照片管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="验收照片功能开发中"
        nzDescription="此页面将用于管理验收照片。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class QualityPhotosComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载验收照片数据
  }
}

