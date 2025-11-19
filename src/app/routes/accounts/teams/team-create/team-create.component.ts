import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService, SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

interface CreateTeamFormValue {
  name: string;
  description: string | null;
  organizationId: string;
}

export interface CreateTeamData {
  organizationId: string | null;
}

@Component({
  selector: 'app-team-create',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    @if (isModalMode()) {
      <!-- Modal 模式：纯表单 -->
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- 组织选择 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>组织</nz-form-label>
          <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择组织'">
            <nz-select
              formControlName="organizationId"
              nzPlaceHolder="请选择组织"
              [nzLoading]="accountService.loading()"
              style="width: 100%;"
            >
              @for (org of accountService.organizationAccounts(); track org.id) {
                <nz-option [nzValue]="org.id" [nzLabel]="org.name"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <!-- 团队名称 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>团队名称</nz-form-label>
          <nz-form-control [nzSpan]="18" [nzErrorTip]="'请输入团队名称'">
            <input nz-input formControlName="name" placeholder="请输入团队名称" />
          </nz-form-control>
        </nz-form-item>

        <!-- 描述 -->
        <nz-form-item>
          <nz-form-label [nzSpan]="6">描述</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <textarea nz-input rows="3" formControlName="description" placeholder="可选，简要描述该团队"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzSpan]="18" [nzOffset]="6">
            <button
              nz-button
              nzType="default"
              type="button"
              (click)="cancel()"
              [disabled]="teamService.loading()"
              style="margin-right: 8px;"
            >
              取消
            </button>
            <button nz-button nzType="primary" type="submit" [nzLoading]="teamService.loading()" [disabled]="form.invalid">
              <span nz-icon nzType="save"></span>
              创建团队
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    } @else {
      <!-- 页面模式：带 page-header -->
      <page-header [title]="'创建团队'" [extra]="headerExtra">
        <ng-template #headerExtra>
          <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
            <span nz-icon nzType="arrow-left"></span>
            返回
          </button>
        </ng-template>
      </page-header>

      <div style="padding: 16px;">
        <nz-card nzTitle="团队信息">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- 组织选择 -->
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>组织</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择组织'">
                <nz-select
                  formControlName="organizationId"
                  nzPlaceHolder="请选择组织"
                  [nzLoading]="accountService.loading()"
                  style="width: 100%;"
                >
                  @for (org of accountService.organizationAccounts(); track org.id) {
                    <nz-option [nzValue]="org.id" [nzLabel]="org.name"></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <!-- 团队名称 -->
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>团队名称</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入团队名称'">
                <input nz-input formControlName="name" placeholder="请输入团队名称" />
              </nz-form-control>
            </nz-form-item>

            <!-- 描述 -->
            <nz-form-item>
              <nz-form-label [nzSpan]="4">描述</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <textarea nz-input rows="3" formControlName="description" placeholder="可选，简要描述该团队"></textarea>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzSpan]="24" [nzOffset]="4">
                <button nz-button nzType="primary" [nzLoading]="teamService.loading()" [disabled]="form.invalid">
                  <span nz-icon nzType="save"></span>
                  创建团队
                </button>
                <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;"> 取消 </button>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-card>
      </div>
    }
  `
})
export class TeamCreateComponent implements OnInit {
  readonly teamService = inject(TeamService);
  readonly accountService = inject(AccountService);
  readonly tokenService = inject(DA_SERVICE_TOKEN);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly message = inject(NzMessageService);
  readonly modalRef = inject(NzModalRef, { optional: true });
  readonly modalData = inject<CreateTeamData>(NZ_MODAL_DATA, { optional: true });

  form = new FormGroup<{
    organizationId: FormControl<string>;
    name: FormControl<string>;
    description: FormControl<string | null>;
  }>({
    organizationId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null)
  });

  // 判断是否为 Modal 模式
  isModalMode(): boolean {
    return !!this.modalRef;
  }

  async ngOnInit(): Promise<void> {
    // 加载组织账户列表以便选择
    await this.accountService.loadAccounts();

    // 优先使用 Modal 传入的 organizationId，否则使用路由参数
    const orgId = this.modalData?.organizationId || this.route.snapshot.queryParamMap.get('organizationId');
    if (orgId) {
      const exists = this.accountService.organizationAccounts().some(o => o.id === orgId);
      if (exists) this.form.controls.organizationId.setValue(orgId);
    }
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
      this.message.error('系统错误：无法获取用户信息');
      return;
    }

    // 查找当前用户对应的 account.id
    const userAccount = this.accountService.userAccounts().find(a => (a as any).authUserId === currentUserAuthId);
    if (!userAccount) {
      this.message.error('系统错误：无法找到用户账户');
      return;
    }

    const value = this.form.value as CreateTeamFormValue;
    try {
      const team = await this.teamService.createTeam({
        name: value.name,
        description: value.description ?? undefined,
        organizationId: value.organizationId,
        createdBy: userAccount.id
      });
      this.message.success('创建团队成功');

      if (this.isModalMode()) {
        this.modalRef?.close(team);
      } else {
        this.router.navigate(['/accounts/teams', team.id]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建团队失败';
      this.message.error(errorMessage);
    }
  }

  cancel(): void {
    if (this.isModalMode()) {
      this.modalRef?.close(false);
    }
  }

  goBack(): void {
    if (!this.isModalMode()) {
      this.router.navigate(['/accounts/teams']);
    }
  }
}
