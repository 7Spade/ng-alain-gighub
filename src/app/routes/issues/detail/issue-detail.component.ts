import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'问题详情'">
      <ng-template #extra>
        <button nz-button (click)="handle()">处理</button>
        <button nz-button nzType="primary" (click)="close()" style="margin-left: 8px;">关闭</button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="问题详细信息" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题详情功能开发中"
        nzDescription="此页面将用于显示问题的详细信息。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueDetailComponent implements OnInit {
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

  handle(): void {
    this.router.navigate(['/issues', this.issueId, 'handle']);
  }

  close(): void {
    this.router.navigate(['/issues', this.issueId, 'close']);
  }
}
