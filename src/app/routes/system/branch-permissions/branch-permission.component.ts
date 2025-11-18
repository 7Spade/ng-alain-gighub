import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-branch-permission',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'分支权限管理'"></page-header>

    <nz-card nzTitle="分支权限管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="分支权限功能建设中"
        nzDescription="此页面将校验 Git-like 分支模型下的访问控制。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BranchPermissionComponent {}
