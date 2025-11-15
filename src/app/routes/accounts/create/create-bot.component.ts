import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppError } from '@core';
import { AccountService, AccountStatus, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * Bot 账户创建表单类型定义
 */
interface BotFormValue {
  name: string;
}

@Component({
  selector: 'app-create-bot',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="'创建机器人账户'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div style="padding: 16px;">
      @if (accountService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
          <ng-template #indicator>
            <span nz-icon nzType="loading" style="font-size: 24px;"></span>
          </ng-template>
        </nz-spin>
      } @else {
        <nz-card nzTitle="创建新机器人账户">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>机器人名称</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入机器人名称'">
                <input nz-input formControlName="name" placeholder="请输入机器人名称" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzSpan]="24" [nzOffset]="4">
                <button nz-button nzType="primary" [nzLoading]="accountService.loading()" [disabled]="form.invalid">
                  <span nz-icon nzType="save"></span>
                  创建机器人
                </button>
                <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;"> 取消 </button>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-card>
      }
    </div>
  `
})
export class CreateBotComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);

  // 表单定义
  form = new FormGroup<{
    name: FormControl<string>;
  }>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit(): void {
    // 创建 Bot 账户时的初始化逻辑
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      // 标记所有字段为 touched，显示验证错误
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const formValue = this.form.value as BotFormValue;

    try {
      // 使用 SECURITY DEFINER 函数创建 Bot 账户，绕过 RLS 限制
      const account = await this.accountService.createBotAccount(formValue.name, null, AccountStatus.ACTIVE);
      this.message.success('创建机器人账户成功');
      this.router.navigate(['/accounts', account.id]);
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '创建机器人账户失败';

      if (error instanceof Error) {
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          errorMessage = appError.message || errorMessage;

          if (appError.code) {
            errorMessage += ` (错误代码: ${appError.code})`;
          }

          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }

          if (appError.metadata && appError.metadata['hint']) {
            errorMessage += `\n提示: ${appError.metadata['hint']}`;
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      console.error('创建机器人账户失败:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts/bots']);
  }
}
