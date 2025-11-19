import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-bot-config',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="botId() ? '编辑机器人' : '创建机器人'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        <button nz-button nzType="primary" (click)="saveConfig()" [disabled]="configForm.invalid">
          <span nz-icon nzType="save"></span>
          保存配置
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="机器人配置" style="margin-top: 16px;">
      <form nz-form [formGroup]="configForm" (ngSubmit)="saveConfig()">
        <!-- 机器人名称 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>机器人名称</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入机器人名称'">
            <input nz-input formControlName="name" placeholder="请输入机器人名称" />
          </nz-form-control>
        </nz-form-item>

        <!-- 描述 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4">描述</nz-form-label>
          <nz-form-control [nzSpan]="20">
            <textarea nz-input rows="3" formControlName="description" placeholder="可选，简要描述该机器人的功能"></textarea>
          </nz-form-control>
        </nz-form-item>

        <!-- 类型 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>类型</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择机器人类型'">
            <nz-select formControlName="type" nzPlaceHolder="请选择机器人类型">
              <nz-option nzValue="report" nzLabel="报表"></nz-option>
              <nz-option nzValue="notification" nzLabel="通知"></nz-option>
              <nz-option nzValue="backup" nzLabel="备份"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 触发条件 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>触发条件</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择触发条件'">
            <nz-select formControlName="trigger" nzPlaceHolder="请选择触发条件">
              <nz-option nzValue="schedule" nzLabel="定时任务"></nz-option>
              <nz-option nzValue="event" nzLabel="事件触发"></nz-option>
              <nz-option nzValue="manual" nzLabel="手动执行"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- Cron 表达式（如果是定时任务） -->
        @if (configForm.get('trigger')?.value === 'schedule') {
          <nz-form-item>
            <nz-form-label [nzSpan]="4" nzRequired>Cron 表达式</nz-form-label>
            <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入 Cron 表达式'">
              <input nz-input formControlName="cronExpression" placeholder="例如: 0 0 * * * (每天午夜)" />
            </nz-form-control>
          </nz-form-item>
        }

        <!-- 脚本内容 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>脚本内容</nz-form-label>
          <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入脚本内容'">
            <textarea nz-input rows="10" formControlName="script" placeholder="请输入机器人执行的脚本内容"></textarea>
          </nz-form-control>
        </nz-form-item>

        <!-- 启用状态 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="4">启用状态</nz-form-label>
          <nz-form-control [nzSpan]="20">
            <label nz-checkbox formControlName="enabled">启用机器人</label>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzSpan]="24" [nzOffset]="4">
            <button nz-button nzType="primary" [nzLoading]="loading()" [disabled]="configForm.invalid">
              <span nz-icon nzType="save"></span>
              保存配置
            </button>
            <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;"> 取消 </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class BotConfigComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  message = inject(NzMessageService);

  // Component signals
  loading = signal(false);
  botId = signal<string | null>(null);
  configForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    type: ['', [Validators.required]],
    trigger: ['', [Validators.required]],
    cronExpression: [''],
    script: ['', [Validators.required]],
    enabled: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.botId.set(id);
      this.loadConfig(id);
    }
  }

  loadConfig(id: string): void {
    // TODO: 加载机器人配置
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

  goBack(): void {
    this.router.navigate(['/bots/list']);
  }
}
