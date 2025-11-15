import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-comment-create',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'发表评论'"></page-header>

    <nz-card nzTitle="发布评论" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="评论提交流程建设中"
        nzDescription="此页面将提供富文本编辑、附件与 @ 提及功能。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class CommentCreateComponent {}
