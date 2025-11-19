import { Component, OnInit, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, OrganizationMemberService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 组织成员显示组件（只读）
 *
 * 职责：在账户详情页中显示组织成员信息（只读）
 * 完整的管理功能请前往 /org/:id/members
 *
 * 遵循职责边界：
 * - routes/accounts：账户管理视角，成员信息只读显示
 * - routes/org：组织上下文视角，提供完整的成员管理功能
 */
@Component({
  selector: 'app-organization-role-manage',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card nzTitle="组织成员" [nzExtra]="cardExtra" style="margin-bottom: 16px;">
      <ng-template #cardExtra>
        <button nz-button nzType="primary" nzSize="small" (click)="goToOrganizationManagement()">
          <span nz-icon nzType="setting"></span>
          前往组织管理
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
        <nz-alert
          nzType="info"
          nzMessage="提示"
          nzDescription="此处仅显示成员信息。如需添加、编辑或删除成员，请点击右上角「前往组织管理」按钮。"
          nzShowIcon
          style="margin-bottom: 16px;"
        ></nz-alert>
        <nz-table [nzData]="organizationMemberService.members()" [nzShowPagination]="false" [nzSize]="'small'">
          <thead>
            <tr>
              <th>账户名称</th>
              <th>角色</th>
              <th>加入时间</th>
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
              </tr>
            }
          </tbody>
        </nz-table>
      } @else {
        <nz-empty nzNotFoundContent="暂无成员">
          <button nz-button nzType="primary" (click)="goToOrganizationManagement()">前往组织管理添加成员</button>
        </nz-empty>
      }
    </nz-card>
  `
})
export class OrganizationRoleManageComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
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
   * 加载组织成员列表（只读显示）
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
   * 前往组织管理页面（完整功能）
   */
  goToOrganizationManagement(): void {
    this.router.navigate(['/org', this.organizationId(), 'members']);
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
