import { Component, OnInit, inject, input, signal } from '@angular/core';
import { TeamMember, TeamMemberRepository } from '@core';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

import { TeamMemberAddComponent } from '../team-member/team-member-add.component';
import { TeamMemberDeleteComponent, TeamMemberDeleteData } from '../team-member/team-member-delete.component';
import { TeamRoleEditComponent } from '../team-role/team-role-edit.component';

/**
 * 团队成员和角色管理组件
 * 职责：显示成员列表、添加成员、编辑角色、移除成员
 */
@Component({
  selector: 'app-team-role-manage',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card nzTitle="团队成员" [nzExtra]="cardExtra" style="margin-bottom: 16px;">
      <ng-template #cardExtra>
        <button nz-button nzType="primary" nzSize="small" (click)="addMember()">
          <span nz-icon nzType="plus"></span>
          添加成员
        </button>
      </ng-template>

      @if (loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;"></nz-spin>
      } @else if (members().length > 0) {
        <nz-table [nzData]="members()" [nzShowPagination]="false" [nzSize]="'small'">
          <thead>
            <tr>
              <th>账户名称</th>
              <th>角色</th>
              <th>加入时间</th>
              <th>操作</th>
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
                <td>
                  <button nz-button nzType="link" nzSize="small" (click)="editRole(member)">编辑角色</button>
                  <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(member)">移除</button>
                </td>
              </tr>
            }
          </tbody>
        </nz-table>
      } @else {
        <nz-empty nzNotFoundContent="暂无成员"></nz-empty>
      }
    </nz-card>
  `
})
export class TeamRoleManageComponent implements OnInit {
  private teamMemberRepository = inject(TeamMemberRepository);
  private accountService = inject(AccountService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

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
   * 加载团队成员列表
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
   * 添加成员
   */
  addMember(): void {
    const modalRef = this.modal.create({
      nzTitle: '添加团队成员',
      nzContent: TeamMemberAddComponent,
      nzData: {
        teamId: this.teamId()
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
      nzTitle: '编辑成员角色',
      nzContent: TeamRoleEditComponent,
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
      nzTitle: '移除团队成员',
      nzContent: TeamMemberDeleteComponent,
      nzData: {
        memberId: member.id,
        accountName
      } as TeamMemberDeleteData,
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
}
