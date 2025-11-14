import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-weather-api',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'天气 API 配置'"></page-header>

    <nz-card nzTitle="天气 API 配置" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="天气 API 配置功能建设中"
        nzDescription="此页面将配置第三方天气服务、配额与缓存策略。"
        [nzShowIcon]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>
      <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
    </nz-card>
  `
})
export class WeatherApiComponent {}


