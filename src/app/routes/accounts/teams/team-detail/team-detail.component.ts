import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS, TeamService, Team, TeamMember, TeamMemberRole } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { TeamMemberAddComponent } from './team-member-add.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'团队详情'">
      <ng-template #extra>
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

        <!-- 团队成员列表 -->
        <nz-card nzTitle="团队成员">
          <ng-template #extra>
            <button nz-button nzType="primary" nzSize="small" (click)="addMember()">
              <span nz-icon nzType="plus"></span>
              添加成员
            </button>
          </ng-template>

          @if (teamService.teamMembers().length > 0) {
            <nz-table [nzData]="teamService.teamMembers()" [nzShowPagination]="false" [nzSize]="'small'">
              <thead>
                <tr>
                  <th>账户ID</th>
                  <th>角色</th>
                  <th>加入时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                @for (member of teamService.teamMembers(); track member.id) {
                  <tr>
                    <td>{{ member.account_id }}</td>
                    <td>
                      @switch (member.role) {
                        @case ('leader') {
                          <nz-tag nzColor="red">负责人</nz-tag>
                        }
                        @case ('member') {
                          <nz-tag nzColor="blue">成员</nz-tag>
                        }
                      }
                    </td>
                    <td>{{ member.joined_at | date: 'yyyy-MM-dd' }}</td>
                    <td>
                      <button nz-button nzType="link" nzSize="small" (click)="changeRole(member)"> 变更角色 </button>
                      <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(member.id)"> 移除 </button>
                    </td>
                  </tr>
                }
              </tbody>
            </nz-table>
          } @else {
            <nz-empty nzNotFoundContent="暂无成员"></nz-empty>
          }
        </nz-card>
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

  // 使用 computed 从 Service 获取团队信息
  team = computed(() => this.teamService.selectedTeam());

  teamId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  // 导出枚举供模板使用
  TeamMemberRole = TeamMemberRole;

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
      this.message.error('加载团队详情失败');
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

  async delete(): Promise<void> {
    if (!this.team()) {
      return;
    }

    if (confirm('确定要删除此团队吗？此操作不可恢复。')) {
      try {
        await this.teamService.deleteTeam(this.team()!.id);
        this.message.success('删除成功');
        this.goBack();
      } catch (error) {
        this.message.error('删除失败');
      }
    }
  }

  addMember(): void {
    const teamId = this.teamId();
    if (!teamId) {
      this.message.warning('无法获取团队ID');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '添加团队成员',
      nzContent: TeamMemberAddComponent,
      nzData: {
        teamId
      },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        // Reload team to refresh members
        this.loadTeam(teamId);
      }
    });
  }

  async changeRole(member: TeamMember): Promise<void> {
    // TODO: 实现变更角色功能
    const newRole = member.role === TeamMemberRole.LEADER ? TeamMemberRole.MEMBER : TeamMemberRole.LEADER;
    try {
      await this.teamService.updateTeamMemberRole(member.id, newRole);
      this.message.success('角色变更成功');
    } catch (error) {
      this.message.error('角色变更失败');
    }
  }

  async removeMember(memberId: string): Promise<void> {
    if (confirm('确定要移除此成员吗？')) {
      try {
        await this.teamService.removeTeamMember(memberId);
        this.message.success('移除成功');
      } catch (error) {
        this.message.error('移除失败');
      }
    }
  }
}
