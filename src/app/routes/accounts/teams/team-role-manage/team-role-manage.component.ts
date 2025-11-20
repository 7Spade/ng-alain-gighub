import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TeamMember, TeamMemberRepository } from '@core';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { firstValueFrom } from 'rxjs';

/**
 * 团队成员显示组件（只读）
 *
 * 职责：在团队详情页中显示团队成员信息（只读）
 * 完整的管理功能请前往 /org/teams/:id/members
 *
 * 遵循职责边界：
 * - routes/accounts：账户管理视角，成员信息只读显示
 * - routes/org：组织上下文视角，提供完整的成员管理功能
 */
@Component({
  selector: 'app-team-role-manage',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card nzTitle="团队成员" [nzExtra]="cardExtra" style="margin-bottom: 16px;">
      <ng-template #cardExtra>
        <button nz-button nzType="primary" nzSize="small" (click)="goToTeamManagement()">
          <span nz-icon nzType="setting"></span>
          前往团队管理
        </button>
      </ng-template>

      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;"></nz-spin>
      } @else if (members().length > 0) {
        <nz-alert
          nzType="info"
          nzMessage="提示"
          nzDescription="此处仅显示成员信息。如需添加、编辑或删除成员，请点击右上角「前往团队管理」按钮。"
          nzShowIcon
          style="margin-bottom: 16px;"
        ></nz-alert>
        <nz-table [nzData]="members()" [nzShowPagination]="false" [nzSize]="'small'">
          <thead>
            <tr>
              <th>账户名称</th>
              <th>角色</th>
              <th>加入时间</th>
            </tr>
          </thead>
          <tbody>
            @for (member of members(); track member.id) {
              <tr>
                <td>{{ getAccountName(member.account_id) }}</td>
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
              </tr>
            }
          </tbody>
        </nz-table>
      } @else {
        <nz-empty nzNotFoundContent="暂无成员">
          <button nz-button nzType="primary" (click)="goToTeamManagement()">前往团队管理添加成员</button>
        </nz-empty>
      }
    </nz-card>
  `
})
export class TeamRoleManageComponent implements OnInit {
  private readonly teamMemberRepository = inject(TeamMemberRepository);
  private readonly accountService = inject(AccountService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);

  readonly teamId = input.required<string>();
  readonly members = signal<TeamMember[]>([]);
  readonly loading = signal(false);

  async ngOnInit(): Promise<void> {
    // 加载账户列表以便显示账户名称
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      console.error('加载账户列表失败:', error);
    }
    await this.loadMembers();
  }

  /**
   * 加载团队成员列表（只读显示）
   */
  async loadMembers(): Promise<void> {
    this.loading.set(true);
    try {
      const members = await firstValueFrom(this.teamMemberRepository.findByTeamId(this.teamId()));
      this.members.set(members);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载成员列表失败';
      this.message.error(errorMessage);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * 前往团队管理页面（完整功能）
   */
  goToTeamManagement(): void {
    this.router.navigate(['/accounts/org/teams', this.teamId(), 'members']);
  }

  /**
   * 获取账户名称
   */
  getAccountName(accountId: string): string {
    const accounts = this.accountService.accounts();
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId;
  }
}
