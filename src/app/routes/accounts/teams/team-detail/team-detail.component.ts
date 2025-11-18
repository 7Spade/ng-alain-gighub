import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TeamDeleteComponent, TeamDeleteData } from '../team-delete/team-delete.component';
import { TeamRoleManageComponent } from '../team-role-manage/team-role-manage.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [SHARED_IMPORTS, TeamRoleManageComponent],
  template: `
    <page-header [title]="'团队详情'" [extra]="headerExtra">
      <ng-template #headerExtra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (team()) {
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>

    @if (teamService.loading()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (teamService.error()) {
      <nz-alert nzType="error" [nzMessage]="'加载失败'" [nzDescription]="teamService.error()" nzShowIcon style="margin: 16px;"></nz-alert>
    } @else if (team()) {
      <div style="padding: 16px;">
        <!-- 团队基本信息 -->
        <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ team()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="团队名称">{{ team()!.name }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="描述">{{ team()!.description || '-' }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="组织ID">{{ team()!.organization_id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ team()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ team()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 团队成员和角色管理 -->
        @if (team()?.id) {
          <app-team-role-manage [teamId]="team()!.id"></app-team-role-manage>
        }
      </div>
    } @else {
      <nz-empty nzNotFoundContent="团队不存在"></nz-empty>
    }
  `
})
export class TeamDetailComponent implements OnInit {
  teamService = inject(TeamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  team = computed(() => this.teamService.selectedTeam());

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeam(teamId);
    }
  }

  async loadTeam(id: string): Promise<void> {
    try {
      const team = await this.teamService.loadTeamById(id);
      if (!team) {
        this.message.warning('团队不存在');
        this.goBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载团队详情失败';
      this.message.error(errorMessage);
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts/teams']);
  }

  edit(): void {
    if (this.team()) {
      this.router.navigate(['/accounts/teams', this.team()!.id, 'edit']);
    }
  }

  delete(): void {
    if (!this.team()) {
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '删除团队',
      nzContent: TeamDeleteComponent,
      nzData: {
        teamId: this.team()!.id,
        teamName: this.team()!.name
      } as TeamDeleteData,
      nzWidth: 500,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.goBack();
      }
    });
  }
}
