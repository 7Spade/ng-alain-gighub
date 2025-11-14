import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'文档列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/documents/upload">
          <span nz-icon nzType="upload"></span>
          上传文档
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档列表" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="文档管理功能建设中"
        nzDescription="此页面将展示文档库与过滤条件。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class DocumentListComponent {}


