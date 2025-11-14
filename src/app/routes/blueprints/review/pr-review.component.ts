import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-pr-review',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'PR 审查'">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprints">蓝图列表</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>
            <a [routerLink]="['/blueprints', blueprintId, 'pull-requests']">Pull Requests</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>审查</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <nz-card nzTitle="Pull Request 审查" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="PR 审查功能开发中"
        nzDescription="此页面将用于审查和批准 Pull Request。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class PrReviewComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  blueprintId = '';
  prId = '';

  ngOnInit(): void {
    this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
    this.prId = this.route.snapshot.paramMap.get('prId') || '';
    if (!this.blueprintId || !this.prId) {
      this.message.error('蓝图ID或PR ID不存在');
      this.router.navigate(['/blueprints']);
    }
  }
}

