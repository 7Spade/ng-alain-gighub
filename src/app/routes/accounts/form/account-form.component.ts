import { Component, OnInit, inject, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, AccountService, Account, AccountType, AccountStatus, AccountInsert, AccountUpdate } from '@shared';
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
    <page-header [title]="isEditMode() ? '编辑账户' : '创建账户'">
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
        <nz-card [nzTitle]="isEditMode() ? '编辑账户信息' : '创建新账户'">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>账户名称</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入账户名称'">
                <input nz-input formControlName="name" placeholder="请输入账户名称" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>邮箱</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="form.get('email')?.hasError('required') ? '请输入邮箱' : '请输入有效的邮箱地址'">
                <input nz-input formControlName="email" type="email" placeholder="请输入邮箱地址" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>账户类型</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择账户类型'">
                <nz-select formControlName="type" nzPlaceHolder="请选择账户类型">
                  <nz-option [nzValue]="AccountType.USER" nzLabel="用户"></nz-option>
                  <nz-option [nzValue]="AccountType.BOT" nzLabel="机器人"></nz-option>
                  <nz-option [nzValue]="AccountType.ORGANIZATION" nzLabel="组织"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            @if (isEditMode()) {
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
            }

            <nz-form-item>
              <nz-form-control [nzSpan]="24" [nzOffset]="4">
                <button nz-button nzType="primary" [nzLoading]="accountService.loading()" [disabled]="form.invalid">
                  <span nz-icon nzType="save"></span>
                  {{ isEditMode() ? '保存' : '创建' }}
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
    if (this.isEditMode()) {
      const accountId = this.route.snapshot.paramMap.get('id');
      if (accountId) {
        this.loadAccount(accountId);
      }
    }
  }

  async loadAccount(id: string): Promise<void> {
    try {
      const account = await this.accountService.loadAccountById(id);
      if (account) {
        this.form.patchValue({
          name: account.name,
          email: account.email,
          type: account.type as AccountType,
          status: account.status as AccountStatus
        });
      } else {
        this.message.warning('账户不存在');
        this.goBack();
      }
    } catch (error) {
      this.message.error('加载账户信息失败');
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
      if (this.isEditMode()) {
        const accountId = this.route.snapshot.paramMap.get('id')!;
        const updateData: AccountUpdate = {
          name: formValue.name,
          email: formValue.email || undefined,
          type: formValue.type,
          status: formValue.status
        };
        await this.accountService.updateAccount(accountId, updateData);
        this.message.success('更新成功');
        this.router.navigate(['/accounts', accountId]);
      } else {
        const insertData: AccountInsert = {
          name: formValue.name,
          email: formValue.email || undefined,
          type: formValue.type,
          status: formValue.status || AccountStatus.ACTIVE
        };
        const account = await this.accountService.createAccount(insertData);
        this.message.success('创建成功');
        this.router.navigate(['/accounts', account.id]);
      }
    } catch (error) {
      this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
    }
  }

  goBack(): void {
    if (this.isEditMode()) {
      const accountId = this.route.snapshot.paramMap.get('id');
      if (accountId) {
        this.router.navigate(['/accounts', accountId]);
      } else {
        this.router.navigate(['/accounts']);
      }
    } else {
      this.router.navigate(['/accounts']);
    }
  }
}
