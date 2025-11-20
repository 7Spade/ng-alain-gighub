import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamMember } from '@core';
import { STChange, STColumn } from '@delon/abc/st';
import { AccountService, SHARED_IMPORTS, TeamMemberService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrgTeamMemberAddComponent } from './team-member-add/team-member-add.component';
import { OrgTeamMemberDeleteComponent, OrgTeamMemberDeleteData } from './team-member-delete/team-member-delete.component';
import { OrgTeamRoleEditComponent } from './team-role-edit/team-role-edit.component';

/**
 * 团队成员列表组件
 *
 * 职责：显示团队成员列表、添加成员、编辑角色、移除成员
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 TeamMemberService 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org-team-members',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'團隊成員管理'" />
    <nz-card [nzBordered]="false">
      <div class="flex justify-between mb-md">
        <div>
          <h2>團隊成員</h2>
          <p class="text-muted">管理團隊成員</p>
        </div>
        <button nz-button nzType="primary" (click)="addMember()">
          <span nz-icon nzType="plus"></span>
          邀請成員
        </button>
      </div>

      @if (teamMemberService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (teamMemberService.error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="'載入失敗'"
          [nzDescription]="teamMemberService.error()"
          nzShowIcon
          style="margin: 16px;"
        ></nz-alert>
      } @else if (teamMemberService.members().length === 0) {
        <nz-empty nzNotFoundContent="尚無成員">
          <button nz-button nzType="primary" (click)="addMember()">邀請第一個成員</button>
        </nz-empty>
      } @else {
        <st
          #st
          [columns]="columns"
          [data]="teamMemberService.members()"
          [loading]="teamMemberService.loading()"
          [page]="{ front: false, show: true, showSize: true }"
          (change)="stChange($event)"
        >
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
            <button nz-button nzType="link" nzSize="small" (click)="editRole(record)">編輯角色</button>
            <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(record)">移除</button>
          </ng-template>
        </st>
      }
    </nz-card>
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
export class OrgTeamMembersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly accountService = inject(AccountService);
  readonly teamMemberService = inject(TeamMemberService);

  readonly teamId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: '帳戶名稱', render: 'accountName', width: 200 },
    { title: '角色', render: 'role', width: 120 },
    { title: '加入時間', index: 'joined_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 200 }
  ];

  async ngOnInit(): Promise<void> {
    // 从路由参数获取团队 ID
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('缺少團隊 ID');
      // 导航到组织列表
      this.router.navigate(['/accounts/org']);
      return;
    }

    this.teamId.set(id);

    // 先清空状态，确保加载的是当前团队的成员
    this.teamMemberService.clearState();
    await this.loadMembers();

    // 如果账户列表为空，才加载账户列表以便显示账户名称
    // 注意：不等待加载完成，避免阻塞页面渲染
    if (this.accountService.accounts().length === 0) {
      this.accountService.loadAccounts().catch(error => {
        console.error('載入帳戶列表失敗:', error);
      });
    }
  }

  /**
   * 加载团队成员列表
   */
  async loadMembers(): Promise<void> {
    const id = this.teamId();
    if (!id) {
      return;
    }

    try {
      await this.teamMemberService.loadMembersByTeamId(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入成員列表失敗';
      this.message.error(errorMessage);
    }
  }

  /**
   * 添加成员
   */
  addMember(): void {
    const id = this.teamId();
    if (!id) {
      this.message.warning('缺少團隊 ID');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '添加團隊成員',
      nzContent: OrgTeamMemberAddComponent,
      nzData: {
        teamId: id
      },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  /**
   * 编辑角色
   */
  editRole(member: TeamMember): void {
    const modalRef = this.modal.create({
      nzTitle: '編輯成員角色',
      nzContent: OrgTeamRoleEditComponent,
      nzData: {
        member
      },
      nzWidth: 500,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  /**
   * 移除成员
   */
  removeMember(member: TeamMember): void {
    const accountName = this.getAccountName(member.account_id);
    const modalRef = this.modal.create({
      nzTitle: '移除團隊成員',
      nzContent: OrgTeamMemberDeleteComponent,
      nzData: {
        memberId: member.id,
        accountName
      } as OrgTeamMemberDeleteData,
      nzWidth: 500,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadMembers();
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
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: STChange): void {
    // 处理表格变化事件（分页、排序等）
  }
}
