import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-task-photos',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'施工照片'"></page-header>

    <nz-card nzTitle="施工照片管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="施工照片功能开发中"
        nzDescription="此页面将用于管理施工照片。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TaskPhotosComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载施工照片数据
  }
}
