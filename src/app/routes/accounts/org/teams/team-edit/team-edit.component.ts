import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Team, TeamUpdate } from '@core';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface OrgTeamEditData {
  team: Team;
}

/**
 * 组织团队编辑组件
 *
 * 职责：在组织上下文中编辑团队基本信息（名称、描述）
 *
 * 特点：
 * - 仅支持 Modal 模式
 * - 从 NZ_MODAL_DATA 获取 team 数据
 */
@Component({
  selector: 'app-org-team-edit',
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
            儲存
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class OrgTeamEditComponent implements OnInit {
  readonly teamService = inject(TeamService);
  private readonly message = inject(NzMessageService);
  private readonly modalRef = inject(NzModalRef);
  private readonly modalData = inject<OrgTeamEditData>(NZ_MODAL_DATA);

  form = new FormGroup<{
    name: FormControl<string>;
    description: FormControl<string | null>;
  }>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null)
  });

  async ngOnInit(): Promise<void> {
    // 从 NZ_MODAL_DATA 获取 team 数据
    const team = this.modalData?.team;
    if (!team) {
      this.message.error('團隊資料不存在');
      this.modalRef.close(false);
      return;
    }

    // 填充表单
    this.form.patchValue({
      name: team.name,
      description: team.description
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(c => {
        c.markAsTouched();
        c.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }

    const teamId = this.modalData?.team?.id;
    if (!teamId) {
      this.message.error('團隊ID不存在');
      return;
    }

    const value = this.form.value;
    try {
      const updateData: TeamUpdate = {
        name: value.name!,
        description: value.description ?? undefined
      };

      const updatedTeam = await this.teamService.updateTeam(teamId, updateData);
      this.message.success('更新成功');
      this.modalRef.close(updatedTeam);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失敗';
      this.message.error(errorMessage);
    }
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
