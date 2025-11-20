import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { OrganizationMember, OrganizationMemberRole, TeamMember, TeamMemberRole } from '@core';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS, TeamMemberService, TeamService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrgRoleEditComponent } from '../org-role-edit/org-role-edit.component';
import { OrgTeamRoleEditComponent } from '../teams/members/team-role-edit/team-role-edit.component';

/**
 * 角色管理组件
 *
 * 职责：在组织上下文中管理组织角色和团队角色
 * - 组织角色：显示组织成员及其角色，支持编辑
 * - 团队角色：显示所有团队的成员及其角色，支持编辑
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 Service 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org-role-manage',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'角色管理'" />
    <div style="display: flex; gap: 16px; flex-direction: column;">
      <!-- 组织角色 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>組織角色</h2>
            <p class="text-muted">管理組織成員的角色</p>
          </div>
        </div>

        @if (organizationMemberService.loading()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (organizationMemberService.error()) {
          <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="organizationMemberService.error()" nzShowIcon style="margin: 16px;"></nz-alert>
        } @else if (organizationMemberService.members().length === 0) {
          <nz-empty nzNotFoundContent="尚無成員"></nz-empty>
        } @else {
          <st
            #stOrg
            [columns]="orgRoleColumns"
            [data]="organizationMemberService.members()"
            [loading]="organizationMemberService.loading()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="accountName" let-record>
              {{ getAccountName(record.account_id) }}
            </ng-template>
            <ng-template st-row="role" let-record>
              @switch (record.role) {
                @case ('owner') {
                  <nz-tag nzColor="red">擁有者</nz-tag>
                }
                @case ('admin') {
                  <nz-tag nzColor="orange">管理員</nz-tag>
                }
                @case ('member') {
                  <nz-tag nzColor="blue">成員</nz-tag>
                }
              }
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="editOrgRole(record)">編輯角色</button>
            </ng-template>
          </st>
        }
      </nz-card>

      <!-- 团队角色 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>團隊角色</h2>
            <p class="text-muted">管理所有團隊成員的角色</p>
          </div>
        </div>

        @if (loadingTeamRoles()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (teamRoles().length === 0) {
          <nz-empty nzNotFoundContent="尚無團隊成員"></nz-empty>
        } @else {
          <st
            #stTeam
            [columns]="teamRoleColumns"
            [data]="teamRoles()"
            [loading]="loadingTeamRoles()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="teamName" let-record>
              {{ getTeamName(record.team_id) }}
            </ng-template>
            <ng-template st-row="accountName" let-record>
              {{ getAccountName(record.account_id) }}
            </ng-template>
            <ng-template st-row="role" let-record>
              @switch (record.role) {
                @case ('leader') {
                  <nz-tag nzColor="red">負責人</nz-tag>
                }
                @case ('member') {
                  <nz-tag nzColor="blue">成員</nz-tag>
                }
              }
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="editTeamRole(record)">編輯角色</button>
            </ng-template>
          </st>
        }
      </nz-card>
    </div>
  `,
  styles: [
    `
      .flex {
        display: flex;
      }
      .justify-between {
        justify-content: space-between;
      }
      .mb-md {
        margin-bottom: 16px;
      }
      .text-muted {
        color: rgba(0, 0, 0, 0.45);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrgRoleManageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly accountService = inject(AccountService);
  private readonly teamService = inject(TeamService);
  private readonly teamMemberService = inject(TeamMemberService);
  readonly organizationMemberService = inject(OrganizationMemberService);

  // 支持通过 input 或路由参数获取 organizationId
  readonly organizationIdInput = input<string | null>(null);
  readonly organizationId = signal<string | null>(null);
  readonly teamRoles = signal<TeamMember[]>([]);
  readonly loadingTeamRoles = signal<boolean>(false);

  orgRoleColumns: STColumn[] = [
    { title: '帳戶名稱', render: 'accountName', width: 200 },
    { title: '角色', render: 'role', width: 120 },
    { title: '加入時間', index: 'joined_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 150 }
  ];

  teamRoleColumns: STColumn[] = [
    { title: '團隊名稱', render: 'teamName', width: 200 },
    { title: '帳戶名稱', render: 'accountName', width: 200 },
    { title: '角色', render: 'role', width: 120 },
    { title: '加入時間', index: 'joined_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 150 }
  ];

  async ngOnInit(): Promise<void> {
    // 优先使用 input，如果没有则从路由参数获取组织 ID
    const idFromInput = this.organizationIdInput();
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    const id = idFromInput || idFromRoute;

    if (!id) {
      this.message.error('缺少組織 ID');
      this.router.navigate(['/accounts/org']);
      return;
    }

    this.organizationId.set(id);

    // 先清空状态，确保加载的是当前组织的数据
    this.organizationMemberService.clearState();
    await this.loadData();

    // 如果账户列表为空，加载账户列表以便显示账户名称
    if (this.accountService.accounts().length === 0) {
      await this.accountService.loadAccounts();
    }
  }

  /**
   * 加载数据
   */
  async loadData(): Promise<void> {
    const orgId = this.organizationId();
    if (!orgId) {
      return;
    }

    // 并行加载组织成员和团队角色
    await Promise.all([this.loadOrgMembers(orgId), this.loadTeamRoles(orgId)]);
  }

  /**
   * 加载组织成员
   */
  async loadOrgMembers(organizationId: string): Promise<void> {
    try {
      await this.organizationMemberService.loadMembersByOrganizationId(organizationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入組織成員失敗';
      this.message.error(errorMessage);
    }
  }

  /**
   * 加载团队角色（所有团队的成员）
   */
  async loadTeamRoles(organizationId: string): Promise<void> {
    this.loadingTeamRoles.set(true);
    try {
      // 1. 加载组织下的所有团队
      const teams = await this.teamService.loadTeamsByOrganizationId(organizationId);
      if (teams.length === 0) {
        this.teamRoles.set([]);
        return;
      }

      // 2. 加载所有团队的成员
      const teamMembersPromises = teams.map(team => this.teamMemberService.loadMembersByTeamId(team.id).catch(() => [] as TeamMember[]));
      const teamMembersArrays = await Promise.all(teamMembersPromises);
      const allTeamMembers = teamMembersArrays.flat();

      this.teamRoles.set(allTeamMembers);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入團隊角色失敗';
      this.message.error(errorMessage);
    } finally {
      this.loadingTeamRoles.set(false);
    }
  }

  /**
   * 编辑组织角色
   */
  editOrgRole(member: OrganizationMember): void {
    const modalRef = this.modal.create({
      nzTitle: '編輯組織角色',
      nzContent: OrgRoleEditComponent,
      nzData: { member },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        const orgId = this.organizationId();
        if (orgId) {
          this.loadOrgMembers(orgId);
        }
      }
    });
  }

  /**
   * 编辑团队角色
   */
  editTeamRole(member: TeamMember): void {
    const modalRef = this.modal.create({
      nzTitle: '編輯團隊角色',
      nzContent: OrgTeamRoleEditComponent,
      nzData: { member },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        const orgId = this.organizationId();
        if (orgId) {
          this.loadTeamRoles(orgId);
        }
      }
    });
  }

  /**
   * 获取账户名称
   */
  getAccountName(accountId: string): string {
    const accounts = this.accountService.accounts();
    const account = accounts.find(a => a.id === accountId);
    return account?.name || accountId;
  }

  /**
   * 获取团队名称
   */
  getTeamName(teamId: string): string {
    const teams = this.teamService.teams();
    const team = teams.find(t => t.id === teamId);
    return team?.name || teamId;
  }

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }
}

