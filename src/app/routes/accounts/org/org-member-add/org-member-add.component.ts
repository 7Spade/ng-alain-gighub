import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationMemberRole } from '@core';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrgMemberAddData {
  organizationId: string;
}

/**
 * 组织成员添加组件
 *
 * 职责：在组织上下文中添加组织成员
 *
 * 特点：
 * - 仅支持 Modal 模式
 * - 组织ID从 Modal 数据传入
 * - 默认角色为 MEMBER
 */
@Component({
  selector: 'app-org-member-add',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>選擇成員</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'請選擇成員'">
          <nz-select
            formControlName="accountId"
            nzPlaceHolder="請選擇用戶帳戶"
            nzShowSearch
            [nzLoading]="accountService.loading()"
            style="width: 100%;"
          >
            @for (user of accountService.userAccounts(); track user.id) {
              <nz-option [nzValue]="user.id" [nzLabel]="user.name || user.id"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="添加成員後，該用戶將能夠訪問組織相關的資源和資料。新成員預設角色為普通成員，可在成員列表中修改角色。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            添加成員
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrgMemberAddComponent implements OnInit {
  private organizationMemberService = inject(OrganizationMemberService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  readonly accountService = inject(AccountService);

  readonly data: OrgMemberAddData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form = new FormGroup({
    accountId: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  async ngOnInit(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      this.message.error('載入用戶列表失敗');
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    this.submitting.set(true);
    try {
      const accountId = this.form.value.accountId!;
      await this.organizationMemberService.addMember({
        organizationId: this.data.organizationId,
        accountId,
        role: OrganizationMemberRole.MEMBER
      });
      this.message.success('成員添加成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加失敗，請重試';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
