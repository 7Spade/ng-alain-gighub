import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SHARED_IMPORTS, TeamService, TeamMemberRole, AccountService } from '@shared';

export interface TeamMemberAddData {
  teamId: string;
}

@Component({
  selector: 'app-team-member-add',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>选择成员</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择成员">
          <nz-select 
            formControlName="accountId" 
            nzPlaceHolder="请选择用户账户" 
            nzShowSearch
            [nzLoading]="accountService.loading()"
          >
            @for (user of accountService.userAccounts(); track user.id) {
              <nz-option [nzValue]="user.id" [nzLabel]="user.name || user.id"></nz-option>
            }
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>成员角色</nz-form-label>
        <nz-form-control [nzSpan]="18" nzErrorTip="请选择角色">
          <nz-radio-group formControlName="role">
            <label nz-radio [nzValue]="TeamMemberRole.LEADER">领导者</label>
            <label nz-radio [nzValue]="TeamMemberRole.MEMBER">成员</label>
          </nz-radio-group>
        </nz-form-control>
      </nz-form-item>

      <nz-alert
        nzType="info"
        nzMessage="提示"
        nzDescription="添加成员后，该用户将能够访问团队相关的资源和数据。领导者拥有更高的权限。"
        nzShowIcon
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            添加
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class TeamMemberAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private teamService = inject(TeamService);
  readonly accountService = inject(AccountService);
  
  readonly data: TeamMemberAddData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly TeamMemberRole = TeamMemberRole;

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      accountId: ['', [Validators.required]],
      role: [TeamMemberRole.MEMBER, [Validators.required]]
    });

    // Load user accounts
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      this.message.error('加载用户列表失败');
    }
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.submitting.set(true);
    try {
      const formValue = this.form.value;

      await this.teamService.addTeamMember(
        this.data.teamId,
        formValue.accountId,
        formValue.role
      );

      this.message.success('成员添加成功');
      this.modalRef.close(true);
    } catch (error: any) {
      console.error('添加团队成员失败:', error);
      this.message.error(error.message || '添加失败，请重试');
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
