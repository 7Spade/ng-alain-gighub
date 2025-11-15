import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'上传文档'"></page-header>

    <nz-card nzTitle="上传文档" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="上传流程建设中"
        nzDescription="此页面将提供批量上传、版本注释与权限配置。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentUploadComponent {}
