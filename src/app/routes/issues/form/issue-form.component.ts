import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="isEdit ? '编辑问题' : '新建问题'"></page-header>

    <nz-card nzTitle="问题表单" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="问题表单功能开发中"
        nzDescription="此页面将用于创建或编辑问题。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class IssueFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  isEdit = false;
  issueId = '';

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.issueId;
  }
}

