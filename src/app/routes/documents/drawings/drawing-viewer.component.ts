import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-drawing-viewer',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'图纸查看器'"></page-header>

    <nz-card nzTitle="图纸查看器" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="图纸查看器功能建设中"
        nzDescription="此页面将支持大型图纸浏览、缩略图以及批注。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DrawingViewerComponent {}


