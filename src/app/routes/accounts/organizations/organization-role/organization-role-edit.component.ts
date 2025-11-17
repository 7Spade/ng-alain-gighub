import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrganizationMember, OrganizationMemberRole } from '@core';
import { OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrganizationRoleEditData {
  member: OrganizationMember;
}

/**
 * 编辑组织成员角色组件
 * 职责：仅负责编辑单个成员的角色
 */
@Component({
  selector: 'app-organization-role-edit',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="submit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>成员账户</nz-form-label>
        <nz-form-control [nzSpan]="18">
          <input nz-input [value]="data.member.account_id" [disabled]="true" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="6" nzRequired>角色</nz-form-label>
        <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择角色'">
          <nz-radio-group formControlName="role">
            <label nz-radio [nzValue]="OrganizationMemberRole.OWNER">拥有者</label>
            <label nz-radio [nzValue]="OrganizationMemberRole.ADMIN">管理员</label>
            <label nz-radio [nzValue]="OrganizationMemberRole.MEMBER">成员</label>
          </nz-radio-group>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control [nzSpan]="18" [nzOffset]="6">
          <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()" style="margin-right: 8px;">
            取消
          </button>
          <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
            保存
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrganizationRoleEditComponent implements OnInit {
  private organizationMemberService = inject(OrganizationMemberService);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);

  readonly data: OrganizationRoleEditData = inject(NZ_MODAL_DATA);
  readonly submitting = signal(false);
  readonly OrganizationMemberRole = OrganizationMemberRole;

  form = new FormGroup({
    role: new FormControl<OrganizationMemberRole>(OrganizationMemberRole.MEMBER, {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  ngOnInit(): void {
    // 设置当前角色（简化逻辑，参考团队代码）
    const currentRole =
      this.data.member.role === OrganizationMemberRole.OWNER
        ? OrganizationMemberRole.OWNER
        : this.data.member.role === OrganizationMemberRole.ADMIN
          ? OrganizationMemberRole.ADMIN
          : OrganizationMemberRole.MEMBER;
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
      await this.organizationMemberService.updateMemberRole(this.data.member.id, this.form.value.role!);
      this.message.success('角色更新成功');
      this.modalRef.close(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失败，请重试';
      this.message.error(errorMessage);
    } finally {
      this.submitting.set(false);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
