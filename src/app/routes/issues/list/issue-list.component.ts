import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'问题列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createIssue()">
          <span nz-icon nzType="plus"></span>
          新建问题
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="问题跟踪管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题跟踪功能开发中"
        nzDescription="此页面将用于显示和管理所有问题。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueListComponent implements OnInit {
  router = inject(Router);
  message = inject(NzMessageService);

  ngOnInit(): void {
    // TODO: 加载问题列表
  }

  createIssue(): void {
    this.router.navigate(['/issues/create']);
  }
}

