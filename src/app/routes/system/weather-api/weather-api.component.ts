import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-weather-api',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'天气 API 配置'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="resetForm()" style="margin-right: 8px;">
          <span nz-icon nzType="reload"></span>
          重置
        </button>
        <button nz-button nzType="primary" (click)="saveConfig()" [disabled]="configForm.invalid">
          <span nz-icon nzType="save"></span>
          保存配置
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="天气 API 配置" style="margin-top: 16px;">
      <form nz-form [formGroup]="configForm" (ngSubmit)="saveConfig()">
        <!-- API 提供商 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>API 提供商</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择 API 提供商'">
            <nz-select formControlName="provider" nzPlaceHolder="请选择 API 提供商">
              <nz-option nzValue="openweathermap" nzLabel="OpenWeatherMap"></nz-option>
              <nz-option nzValue="weatherapi" nzLabel="WeatherAPI"></nz-option>
              <nz-option nzValue="accuweather" nzLabel="AccuWeather"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- API Key -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>API Key</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入 API Key'">
            <input nz-input formControlName="apiKey" type="password" placeholder="请输入 API Key" />
          </nz-form-control>
        </nz-form-item>

        <!-- 每日配额 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>每日配额</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入每日配额'">
            <nz-input-number
              formControlName="dailyQuota"
              [nzMin]="1"
              [nzMax]="10000"
              style="width: 100%;"
              placeholder="请输入每日配额"
            ></nz-input-number>
          </nz-form-control>
        </nz-form-item>

        <!-- 缓存时间（小时） -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>缓存时间（小时）</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入缓存时间'">
            <nz-input-number
              formControlName="cacheHours"
              [nzMin]="1"
              [nzMax]="24"
              style="width: 100%;"
              placeholder="请输入缓存时间"
            ></nz-input-number>
          </nz-form-control>
        </nz-form-item>

        <!-- 启用状态 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4">启用状态</nz-form-label>
          <nz-form-control [nzSpan]="20">
            <label nz-checkbox formControlName="enabled">启用天气 API</label>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzSpan]="24" [nzOffset]="4">
            <button nz-button nzType="primary" [nzLoading]="loading()" [disabled]="configForm.invalid">
              <span nz-icon nzType="save"></span>
              保存配置
            </button>
            <button nz-button nzType="default" type="button" (click)="resetForm()" style="margin-left: 8px;"> 重置 </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class WeatherApiComponent implements OnInit {
  fb = inject(FormBuilder);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  configForm: FormGroup = this.fb.group({
    provider: ['', [Validators.required]],
    apiKey: ['', [Validators.required]],
    dailyQuota: [1000, [Validators.required, Validators.min(1)]],
    cacheHours: [6, [Validators.required, Validators.min(1), Validators.max(24)]],
    enabled: [true]
  });

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig(): void {
    // TODO: 加载天气 API 配置
    // 暂时使用默认值，实际开发时连接真实数据
  }

  saveConfig(): void {
    if (this.configForm.invalid) {
      Object.values(this.configForm.controls).forEach(c => {
        c.markAsTouched();
        c.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    // TODO: 保存配置
    this.message.info('保存配置功能开发中');
  }

  resetForm(): void {
    this.configForm.reset({
      provider: '',
      apiKey: '',
      dailyQuota: 1000,
      cacheHours: 6,
      enabled: true
    });
  }
}
