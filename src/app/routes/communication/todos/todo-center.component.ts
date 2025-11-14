import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-todo-center',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'待办中心'"></page-header>

    <nz-card nzTitle="待办中心" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="待办中心功能建设中"
        nzDescription="此页面将联动任务与评论生成的待办列表。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class TodoCenterComponent {}


