import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamUpdate } from '@core';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 编辑团队组件
 * 职责：编辑团队基本信息（名称、描述）
 */
@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="'编辑团队'" [extra]="headerExtra">
      <ng-template #headerExtra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div style="padding: 16px;">
      @if (teamService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;"></nz-spin>
      } @else if (teamService.error()) {
        <nz-alert nzType="error" [nzMessage]="'加载失败'" [nzDescription]="teamService.error()" nzShowIcon style="margin: 16px;"></nz-alert>
      } @else {
        <nz-card nzTitle="团队信息">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
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
export class TeamEditComponent implements OnInit {
  readonly teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);

  form = new FormGroup<{
    name: FormControl<string>;
    description: FormControl<string | null>;
  }>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string | null>(null)
  });

  async ngOnInit(): Promise<void> {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (!teamId) {
      this.message.error('团队ID不存在');
      this.goBack();
      return;
    }

    try {
      const team = await this.teamService.loadTeamById(teamId);
      if (!team) {
        this.message.warning('团队不存在');
        this.goBack();
        return;
      }

      // 填充表单
      this.form.patchValue({
        name: team.name,
        description: team.description
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载团队信息失败';
      this.message.error(errorMessage);
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

    const teamId = this.route.snapshot.paramMap.get('id');
    if (!teamId) {
      this.message.error('团队ID不存在');
      return;
    }

    const value = this.form.value;
    try {
      const updateData: TeamUpdate = {
        name: value.name!,
        description: value.description ?? undefined
      };

      await this.teamService.updateTeam(teamId, updateData);
      this.message.success('更新成功');
      this.router.navigate(['/accounts/teams', teamId]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新失败';
      this.message.error(errorMessage);
    }
  }

  goBack(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.router.navigate(['/accounts/teams', teamId]);
    } else {
      this.router.navigate(['/accounts/teams']);
    }
  }
}
