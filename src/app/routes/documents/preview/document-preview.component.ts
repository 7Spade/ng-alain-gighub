import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档预览'"></page-header>

    <nz-card nzTitle="文档预览" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="文档预览功能建设中"
        nzDescription="此页面将支持 Office、PDF 以及 CAD 图纸等格式。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentPreviewComponent {}
