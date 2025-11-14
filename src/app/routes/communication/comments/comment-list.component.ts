import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'评论管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/communication/comments/create">
          <span nz-icon nzType="plus"></span>
          新建评论
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="评论列表" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="评论管理功能建设中"
        nzDescription="此页面将提供评论筛选、搜索以及状态管理能力。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class CommentListComponent {}


