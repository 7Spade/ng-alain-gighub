import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-browser',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档浏览器'"></page-header>

    <nz-card nzTitle="文档浏览器" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="文档浏览器功能建设中"
        nzDescription="此页面将提供类似文件夹的层级浏览体验。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentBrowserComponent {}


