import { Component, OnInit, inject, input } from '@angular/core';
import { OrganizationMember } from '@core';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrganizationMemberAddComponent } from '../organization-member/organization-member-add.component';
import {
  OrganizationMemberDeleteComponent,
  OrganizationMemberDeleteData
} from '../organization-member/organization-member-delete.component';
import { OrganizationRoleEditComponent } from '../organization-role/organization-role-edit.component';

/**
 * 组织成员和角色管理组件
 * 职责：显示成员列表、添加成员、编辑角色、移除成员
 */
@Component({
  selector: 'app-organization-role-manage',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card nzTitle="组织成员" [nzExtra]="cardExtra" style="margin-bottom: 16px;">
      <ng-template #cardExtra>
        <button nz-button nzType="primary" nzSize="small" (click)="addMember()">
          <span nz-icon nzType="plus"></span>
          添加成员
        </button>
      </ng-template>

      @if (organizationMemberService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;"></nz-spin>
      } @else if (organizationMemberService.error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="'加载失败'"
          [nzDescription]="organizationMemberService.error()"
          nzShowIcon
          style="margin: 16px;"
        ></nz-alert>
      } @else if (organizationMemberService.members().length > 0) {
        <nz-table [nzData]="organizationMemberService.members()" [nzShowPagination]="false" [nzSize]="'small'">
          <thead>
            <tr>
              <th>账户名称</th>
              <th>角色</th>
              <th>加入时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            @for (member of organizationMemberService.members(); track member.id) {
              <tr>
                <td>{{ getAccountName(member.account_id) }}</td>
                <td>
                  @switch (member.role) {
                    @case ('owner') {
                      <nz-tag nzColor="red">拥有者</nz-tag>
                    }
                    @case ('admin') {
                      <nz-tag nzColor="orange">管理员</nz-tag>
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
export class OrganizationRoleManageComponent implements OnInit {
  private accountService = inject(AccountService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  readonly organizationMemberService = inject(OrganizationMemberService);

  readonly organizationId = input.required<string>();

  async ngOnInit(): Promise<void> {
    // 先清空状态，确保加载的是当前组织的成员
    this.organizationMemberService.clearState();
    await this.loadMembers();

    // 如果账户列表为空，才加载账户列表以便显示账户名称
    // 注意：不等待加载完成，避免阻塞页面渲染
    if (this.accountService.accounts().length === 0) {
      this.accountService.loadAccounts().catch(error => {
        console.error('加载账户列表失败:', error);
      });
    }
  }

  /**
   * 加载组织成员列表
   */
  async loadMembers(): Promise<void> {
    try {
      await this.organizationMemberService.loadMembersByOrganizationId(this.organizationId());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载成员列表失败';
      this.message.error(errorMessage);
    }
  }

  /**
   * 添加成员
   */
  addMember(): void {
    const modalRef = this.modal.create({
      nzTitle: '添加组织成员',
      nzContent: OrganizationMemberAddComponent,
      nzData: {
        organizationId: this.organizationId()
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
  editRole(member: OrganizationMember): void {
    const modalRef = this.modal.create({
      nzTitle: '编辑成员角色',
      nzContent: OrganizationRoleEditComponent,
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
  removeMember(member: OrganizationMember): void {
    const accountName = this.getAccountName(member.account_id);
    const modalRef = this.modal.create({
      nzTitle: '移除组织成员',
      nzContent: OrganizationMemberDeleteComponent,
      nzData: {
        memberId: member.id,
        accountName
      } as OrganizationMemberDeleteData,
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
