import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-permission',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限设置'"></page-header>

    <nz-card nzTitle="文档权限设置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="文档权限功能建设中"
        nzDescription="此页面将管理文档 ACL、分享链接与审计信息。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentPermissionComponent {}


