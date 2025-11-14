import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-bot-execution',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'执行日志'"></page-header>

    <nz-card nzTitle="机器人执行日志" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="执行日志功能建设中"
        nzDescription="此页面将展示机器人任务执行结果与异常详情。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class BotExecutionComponent {}


