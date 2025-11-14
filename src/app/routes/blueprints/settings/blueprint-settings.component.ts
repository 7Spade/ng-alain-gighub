import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-blueprint-settings',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'蓝图设置'">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprints">蓝图列表</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>设置</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <nz-card nzTitle="蓝图配置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="蓝图设置功能开发中"
        nzDescription="此页面将用于配置蓝图的各种设置选项。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BlueprintSettingsComponent implements OnInit {
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

