import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationMember } from '@core';
import { STChange, STColumn } from '@delon/abc/st';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrganizationMemberAddComponent } from '../../accounts/organizations/organization-member/organization-member-add.component';
import {
  OrganizationMemberDeleteComponent,
  OrganizationMemberDeleteData
} from '../../accounts/organizations/organization-member/organization-member-delete.component';
import { OrganizationRoleEditComponent } from '../../accounts/organizations/organization-role/organization-role-edit.component';

/**
 * 组织成员列表组件
 *
 * 职责：显示组织成员列表、添加成员、编辑角色、移除成员
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 OrganizationMemberService 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org-members',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'成員管理'" />
    <nz-card [nzBordered]="false">
      <div class="flex justify-between mb-md">
        <div>
          <h2>組織成員</h2>
          <p class="text-muted">管理組織成員</p>
        </div>
        <button nz-button nzType="primary" (click)="addMember()">
          <span nz-icon nzType="plus"></span>
          邀請成員
        </button>
      </div>

      @if (organizationMemberService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
      } @else if (organizationMemberService.error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="'載入失敗'"
          [nzDescription]="organizationMemberService.error()"
          nzShowIcon
          style="margin: 16px;"
        ></nz-alert>
      } @else if (organizationMemberService.members().length === 0) {
        <nz-empty nzNotFoundContent="尚無成員">
          <button nz-button nzType="primary" (click)="addMember()">邀請第一個成員</button>
        </nz-empty>
      } @else {
        <st
          #st
          [columns]="columns"
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
export class OrgMembersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly accountService = inject(AccountService);
  readonly organizationMemberService = inject(OrganizationMemberService);

  readonly organizationId = signal<string | null>(null);

  columns: STColumn[] = [
    { title: '帳戶名稱', render: 'accountName', width: 200 },
    { title: '角色', render: 'role', width: 120 },
    { title: '加入時間', index: 'joined_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 200 }
  ];

  async ngOnInit(): Promise<void> {
    // 从路由参数获取组织 ID
    const orgId = this.route.snapshot.paramMap.get('id');
    if (!orgId) {
      this.message.error('缺少組織 ID');
      this.router.navigate(['/accounts/organizations']);
      return;
    }

    this.organizationId.set(orgId);

    // 先清空状态，确保加载的是当前组织的成员
    this.organizationMemberService.clearState();
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
   * 加载组织成员列表
   */
  async loadMembers(): Promise<void> {
    const orgId = this.organizationId();
    if (!orgId) {
      return;
    }

    try {
      await this.organizationMemberService.loadMembersByOrganizationId(orgId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入成員列表失敗';
      this.message.error(errorMessage);
    }
  }

  /**
   * 添加成员
   */
  addMember(): void {
    const orgId = this.organizationId();
    if (!orgId) {
      this.message.warning('缺少組織 ID');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '添加組織成員',
      nzContent: OrganizationMemberAddComponent,
      nzData: {
        organizationId: orgId
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
      nzTitle: '編輯成員角色',
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
      nzTitle: '移除組織成員',
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

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: STChange): void {
    // 处理表格变化事件（分页、排序等）
  }
}
