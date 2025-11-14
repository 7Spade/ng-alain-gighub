import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'角色管理'"></page-header>

    <nz-card nzTitle="角色管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="角色管理功能建设中"
        nzDescription="此页面将维护角色定义、职责说明以及映射。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class RoleManagementComponent {}


