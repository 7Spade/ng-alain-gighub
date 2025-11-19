import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-close',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'关闭问题'"></page-header>

    <nz-card nzTitle="关闭问题" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="关闭问题功能开发中"
        nzDescription="此页面将用于关闭问题。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueCloseComponent implements OnInit {
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
