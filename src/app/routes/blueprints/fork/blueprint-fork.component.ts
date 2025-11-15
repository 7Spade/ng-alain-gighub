import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-blueprint-fork',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'Fork 任务'">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprints">蓝图列表</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>Fork 任务</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <nz-card nzTitle="创建 Fork 任务" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="Fork 任务功能开发中"
        nzDescription="此页面将用于从现有蓝图创建 Fork 任务。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BlueprintForkComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  blueprintId = '';

  ngOnInit(): void {
    this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.blueprintId) {
      this.message.error('蓝图ID不存在');
      this.router.navigate(['/blueprints']);
    }
  }
}
