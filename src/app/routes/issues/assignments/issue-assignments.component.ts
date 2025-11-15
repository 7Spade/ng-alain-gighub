import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-issue-assignments',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'问题分配'"></page-header>

    <nz-card nzTitle="问题分配管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题分配功能开发中"
        nzDescription="此页面将用于管理问题的分配。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueAssignmentsComponent implements OnInit {
  ngOnInit(): void {
    // TODO: 加载问题分配数据
  }
}
