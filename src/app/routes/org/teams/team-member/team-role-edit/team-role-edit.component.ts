import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamMember, TeamMemberRepository, TeamMemberRole, TeamMemberUpdate } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

export interface OrgTeamRoleEditData {
  member: TeamMember;
}

/**
 * 组织团队成员角色编辑组件
 *
 * 职责：在组织上下文中编辑团队成员角色
 *
 * 特点：
 * - 仅支持 Modal 模式
 * - 仅负责编辑单个成员的角色
 */
@Component({
  selector: 'app-org-team-role-edit',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>成員帳戶</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input [value]="data.member.account_id" [disabled]="true" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>角色</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'請選擇角色'">
          <nz-radio-group formControlName="role">
            <label nz-radio [nzValue]="TeamMemberRole.LEADER">負責人</label>
            <label nz-radio [nzValue]="TeamMemberRole.MEMBER">成員</label>
          </nz-radio-group>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            儲存
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrgTeamRoleEditComponent implements OnInit {
  private teamMemberRepository = inject(TeamMemberRepository);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrgTeamRoleEditData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly TeamMemberRole = TeamMemberRole;

  form = new FormGroup({
    role: new FormControl<TeamMemberRole>(TeamMemberRole.MEMBER, { nonNullable: true, validators: [Validators.required] })
  });

  ngOnInit(): void {
    // 设置当前角色
    const currentRole = this.data.member.role === TeamMemberRole.LEADER ? TeamMemberRole.LEADER : TeamMemberRole.MEMBER;
    this.form.controls.role.setValue(currentRole);
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
      const updateData: TeamMemberUpdate = {
        role: this.form.value.role!
      };

      await firstValueFrom(this.teamMemberRepository.update(this.data.member.id, updateData));
      this.message.success('角色更新成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失敗，請重試';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
