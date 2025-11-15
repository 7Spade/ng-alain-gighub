import { Component, computed, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppError, isValidUUID } from '@core';
import { AccountService, AccountStatus, AccountType, AccountUpdate, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 账户表单类型定义
 */
interface AccountFormValue {
  name: string;
  email: string | null;
  type: AccountType;
  status?: AccountStatus;
}

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="'编辑账户'">
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
        <nz-card nzTitle="编辑账户信息">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>账户名称</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入账户名称'">
                <input nz-input formControlName="name" placeholder="请输入账户名称" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" [nzRequired]="form.get('type')?.value === AccountType.USER">邮箱</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="getEmailErrorTip()">
                <input
                  nz-input
                  formControlName="email"
                  type="email"
                  [placeholder]="form.get('type')?.value === AccountType.USER ? '请输入邮箱地址' : '请输入邮箱地址（可选）'"
                />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>账户类型</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择账户类型'">
                <nz-select formControlName="type" nzPlaceHolder="请选择账户类型" [nzDisabled]="true">
                  <nz-option [nzValue]="AccountType.USER" nzLabel="用户"></nz-option>
                  <nz-option [nzValue]="AccountType.BOT" nzLabel="机器人"></nz-option>
                  <nz-option [nzValue]="AccountType.ORGANIZATION" nzLabel="组织"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">状态</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <nz-select formControlName="status" nzPlaceHolder="请选择状态">
                  <nz-option [nzValue]="AccountStatus.ACTIVE" nzLabel="活跃"></nz-option>
                  <nz-option [nzValue]="AccountStatus.INACTIVE" nzLabel="非活跃"></nz-option>
                  <nz-option [nzValue]="AccountStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzSpan]="24" [nzOffset]="4">
                <button nz-button nzType="primary" [nzLoading]="accountService.loading()" [disabled]="form.invalid">
                  <span nz-icon nzType="save"></span>
                  保存
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
export class AccountFormComponent implements OnInit {
  accountService = inject(AccountService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 导出枚举供模板使用
  AccountType = AccountType;
  AccountStatus = AccountStatus;

  // 判断是否为编辑模式
  // 注意：创建功能已迁移到 create/ 文件夹，此组件仅用于编辑
  // 如果路由中没有 id 参数，说明路由配置错误
  isEditMode = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return !!id;
  });

  // 表单定义
  form = new FormGroup<{
    name: FormControl<string>;
    email: FormControl<string | null>;
    type: FormControl<AccountType>;
    status?: FormControl<AccountStatus>;
  }>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
    type: new FormControl(AccountType.USER, { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl(AccountStatus.ACTIVE, { nonNullable: true })
  });

  ngOnInit(): void {
    // 此组件仅用于编辑，必须要有 id 参数
    const accountId = this.route.snapshot.paramMap.get('id');
    if (!accountId) {
      console.warn('AccountFormComponent: Missing account ID. Redirecting to account list.');
      this.goBack();
      return;
    }

    // 验证 id 是否为有效的 UUID 格式，避免将非 UUID 字符串传递给数据库查询
    if (!isValidUUID(accountId)) {
      console.warn(`Invalid account ID format: ${accountId}. Redirecting to account list.`);
      this.goBack();
      return;
    }

    this.loadAccount(accountId);
  }

  async loadAccount(id: string): Promise<void> {
    try {
      const account = await this.accountService.loadAccountById(id);
      if (account) {
        const accountType = account.type as AccountType;
        this.form.patchValue({
          name: account.name,
          email: account.email,
          type: accountType,
          status: account.status as AccountStatus
        });

        // 根据账户类型动态设置邮箱验证规则
        this.updateEmailValidation(accountType);
      } else {
        this.message.warning('账户不存在');
        this.goBack();
      }
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '加载账户信息失败';

      if (error instanceof Error) {
        // 检查是否是 AppError 类型
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          errorMessage = appError.message || errorMessage;
          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      console.error('加载账户信息失败:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
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

    const formValue = this.form.value as AccountFormValue;

    try {
      // 此组件仅用于编辑，必须要有 id 参数
      const accountId = this.route.snapshot.paramMap.get('id');
      if (!accountId) {
        this.message.error('缺少账户 ID，无法更新');
        this.goBack();
        return;
      }

      const updateData: AccountUpdate = {
        name: formValue.name,
        email: formValue.email || undefined,
        type: formValue.type,
        status: formValue.status
      };

      await this.accountService.updateAccount(accountId, updateData);
      this.message.success('更新成功');
      this.router.navigate(['/accounts', accountId]);
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '更新失败';

      if (error instanceof Error) {
        // 检查是否是 AppError 类型
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          // 使用 AppError 的详细错误信息
          errorMessage = appError.message || errorMessage;

          // 如果有错误代码，添加到消息中
          if (appError.code) {
            errorMessage += ` (错误代码: ${appError.code})`;
          }

          // 如果有详细信息，添加到消息中
          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }

          // 如果有提示信息，添加到消息中
          if (appError.metadata && appError.metadata['hint']) {
            errorMessage += `\n提示: ${appError.metadata['hint']}`;
          }
        } else {
          // 普通 Error，使用错误消息
          errorMessage = error.message || errorMessage;
        }
      }

      // 在控制台记录详细错误信息，便于调试
      console.error('账户操作失败:', error);

      // 显示错误消息（使用 NzMessageService 的 duration 参数确保消息显示足够长时间）
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
  }

  /**
   * 根据账户类型更新邮箱验证规则
   * - User 账户：邮箱必填
   * - Organization 和 Bot 账户：邮箱可选
   */
  private updateEmailValidation(accountType: AccountType): void {
    const emailControl = this.form.get('email');
    if (!emailControl) return;

    if (accountType === AccountType.USER) {
      // User 账户：邮箱必填
      emailControl.setValidators([Validators.required, Validators.email]);
    } else {
      // Organization 和 Bot 账户：邮箱可选
      emailControl.setValidators([Validators.email]);
    }
    emailControl.updateValueAndValidity();
  }

  /**
   * 获取邮箱错误提示信息
   */
  getEmailErrorTip(): string | undefined {
    const emailControl = this.form.get('email');
    const accountType = this.form.get('type')?.value;
    if (!emailControl || !emailControl.errors) return undefined;

    if (accountType === AccountType.USER) {
      // User 账户：显示必填或格式错误
      if (emailControl.hasError('required')) {
        return '请输入邮箱';
      }
      if (emailControl.hasError('email')) {
        return '请输入有效的邮箱地址';
      }
    } else {
      // Organization 和 Bot 账户：只显示格式错误
      if (emailControl.hasError('email')) {
        return '请输入有效的邮箱地址';
      }
    }
    return undefined;
  }

  goBack(): void {
    // 此组件仅用于编辑，返回账户详情页面
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.router.navigate(['/accounts', accountId]);
    } else {
      this.router.navigate(['/accounts']);
    }
  }
}
