import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-handle',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'处理问题'"></page-header>

    <nz-card nzTitle="问题处理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题处理功能开发中"
        nzDescription="此页面将用于处理问题。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueHandleComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  issueId = '';

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.issueId) {
      this.message.error('问题ID不存在');
      this.router.navigate(['/issues']);
    }
  }
}
