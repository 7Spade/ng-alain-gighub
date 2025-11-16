import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamMemberInsert, TeamMemberRepository, TeamMemberRole } from '@core';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface TeamMemberAddData {
  teamId: string;
}

/**
 * 添加团队成员组件
 * 职责：仅负责添加成员，默认角色为 MEMBER
 * 注意：设置成员角色是单独的功能，不在此组件中
 */
@Component({
  selector: 'app-team-member-add',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>选择成员</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择成员'">
          <nz-select
            formControlName="accountId"
            nzPlaceHolder="请选择用户账户"
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
        nzDescription="添加成员后，该用户将能够访问团队相关的资源和数据。新成员默认角色为普通成员，可在成员列表中修改角色。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            添加成员
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class TeamMemberAddComponent implements OnInit {
  private teamMemberRepository = inject(TeamMemberRepository);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  readonly accountService = inject(AccountService);

  readonly data: TeamMemberAddData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);

  form = new FormGroup({
    accountId: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  async ngOnInit(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      this.message.error('加载用户列表失败');
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
      const memberData: TeamMemberInsert = {
        team_id: this.data.teamId,
        account_id: accountId,
        role: TeamMemberRole.MEMBER // 默认角色为 MEMBER
      };

      await firstValueFrom(this.teamMemberRepository.create(memberData));
      this.message.success('成员添加成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '添加失败，请重试';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
