import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-bot-config',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'机器人配置'"></page-header>

    <nz-card nzTitle="机器人配置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="机器人配置功能建设中"
        nzDescription="此页面将配置机器人脚本、触发条件与安全策略。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BotConfigComponent {}


