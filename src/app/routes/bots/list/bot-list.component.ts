import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-bot-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'机器人列表'">
      <ng-template #extra>
        <button nz-button nzType="primary" routerLink="/bots/config">
          <span nz-icon nzType="plus"></span>
          创建机器人
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="机器人列表" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="机器人列表功能建设中"
        nzDescription="此页面将展示所有自动化任务机器人及其状态。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BotListComponent {}
