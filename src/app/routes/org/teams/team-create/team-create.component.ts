import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService, SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrgTeamCreateData {
  organizationId: string;
}

/**
 * 组织团队创建组件
 *
 * 职责：在组织上下文中创建团队
 *
 * 特点：
 * - 组织ID从 Modal 数据传入，不需要用户选择
 * - 仅支持 Modal 模式
 */
@Component({
  selector: 'app-org-team-create',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- 团队名称 -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>團隊名稱</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'請輸入團隊名稱'">
          <input nz-input formControlName="name" placeholder="請輸入團隊名稱" />
        </nz-form-control>
      </nz-form-item>

      <!-- 描述 -->
      <nz-form-item>
        <nz-form-label [nzSpan]="6">描述</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <textarea nz-input rows="3" formControlName="description" placeholder="可選，簡要描述該團隊"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="teamService.loading()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="teamService.loading()" [disabled]="form.invalid">
            <span nz-icon nzType="save"></span>
            建立團隊
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrgTeamCreateComponent implements OnInit {
  readonly teamService = inject(TeamService);
  readonly accountService = inject(AccountService);
  readonly tokenService = inject(DA_SERVICE_TOKEN);
  readonly message = inject(NzMessageService);
  readonly modalRef = inject(NzModalRef);
  readonly modalData = inject<OrgTeamCreateData>(NZ_MODAL_DATA);

  form = new FormGroup<{
    name: FormControl<string>;
    description: FormControl<string | null>;
  }>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null)
  });

  async ngOnInit(): Promise<void> {
    // 组件初始化，组织ID已从 modalData 传入
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(c => {
        c.markAsTouched();
        c.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    // 获取当前用户的 account.id 作为创建者
    const currentUserAuthId = this.tokenService.get()?.['user']?.id;
    if (!currentUserAuthId) {
      this.message.error('系統錯誤：無法獲取用戶資訊');
      return;
    }

    // 查找当前用户对应的 account.id
    const userAccount = this.accountService.userAccounts().find(a => (a as any).authUserId === currentUserAuthId);
    if (!userAccount) {
      this.message.error('系統錯誤：無法找到用戶帳戶');
      return;
    }

    const value = this.form.value;
    try {
      const team = await this.teamService.createTeam({
        name: value.name!,
        description: value.description ?? undefined,
        organizationId: this.modalData.organizationId,
        createdBy: userAccount.id
      });
      this.message.success('建立團隊成功');
      this.modalRef.close(team);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '建立團隊失敗';
      this.message.error(errorMessage);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
