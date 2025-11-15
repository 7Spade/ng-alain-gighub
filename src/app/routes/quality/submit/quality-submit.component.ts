import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-quality-submit',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'提交验收'"></page-header>

    <nz-card nzTitle="提交验收申请" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="提交验收功能开发中"
        nzDescription="此页面将用于提交验收申请。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class QualitySubmitComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载提交验收表单
  }
}
