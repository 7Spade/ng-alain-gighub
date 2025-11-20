import { Component, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isValidUUID } from '@core';
import { AccountService, AccountStatus, AccountType, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'账户详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (account()) {
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

    @if (accountService.loading()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (accountService.error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'加载失败'"
        [nzDescription]="accountService.error()"
        nzShowIcon
        style="margin: 16px;"
      ></nz-alert>
    } @else if (account()) {
      <div style="padding: 16px;">
        <!-- 账户基本信息 -->
        <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ account()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="名称">{{ account()!.name }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="邮箱">{{ account()!.email || '-' }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="类型">
              @switch (account()!.type) {
                @case ('User') {
                  <nz-tag nzColor="blue">用户</nz-tag>
                }
                @case ('Bot') {
                  <nz-tag nzColor="purple">机器人</nz-tag>
                }
                @case ('Organization') {
                  <nz-tag nzColor="green">组织</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态">
              @switch (account()!.status) {
                @case ('active') {
                  <nz-tag nzColor="success">活跃</nz-tag>
                }
                @case ('inactive') {
                  <nz-tag nzColor="default">非活跃</nz-tag>
                }
                @case ('suspended') {
                  <nz-tag nzColor="error">已暂停</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ account()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ account()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 组织账户：快速操作入口 -->
        @if (account()!.type === AccountType.ORGANIZATION) {
          <nz-card nzTitle="快速操作" style="margin-bottom: 16px;">
            <div class="flex gap-md">
              <button nz-button nzType="default" (click)="manageMembers(account()!.id)">
                <span nz-icon nzType="team"></span>
                成員管理
              </button>
              <button nz-button nzType="default" (click)="manageTeams(account()!.id)">
                <span nz-icon nzType="usergroup-add"></span>
                團隊管理
              </button>
              <button nz-button nzType="default" (click)="manageRoles(account()!.id)">
                <span nz-icon nzType="safety-certificate"></span>
                角色管理
              </button>
              <button nz-button nzType="default" (click)="manageSchedules(account()!.id)">
                <span nz-icon nzType="calendar"></span>
                排班管理
              </button>
            </div>
          </nz-card>
        }
      </div>
    } @else {
      <nz-empty nzNotFoundContent="账户不存在"></nz-empty>
    }
  `
})
export class AccountDetailComponent implements OnInit {
  readonly accountService = inject(AccountService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 使用 computed 从 Service 获取账户信息
  readonly account = computed(() => this.accountService.selectedAccount());

  // 导出枚举供模板使用
  readonly AccountType = AccountType;
  readonly AccountStatus = AccountStatus;

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      // 验证 id 是否为有效的 UUID 格式，避免将非 UUID 字符串（如 "users", "teams" 等）传递给数据库查询
      if (!isValidUUID(accountId)) {
        // 如果不是有效的 UUID，可能是路由匹配错误，导航回账户列表
        console.warn(`Invalid account ID format: ${accountId}. Redirecting to account list.`);
        this.goBack();
        return;
      }
      this.loadAccount(accountId);
    }
  }

  async loadAccount(id: string): Promise<void> {
    try {
      const account = await this.accountService.loadAccountById(id);
      if (!account) {
        this.message.warning('帳戶不存在');
        this.goBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入帳戶詳情失敗';
      this.message.error(errorMessage);
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts/org']);
  }

  edit(): void {
    if (this.account()) {
      this.router.navigate(['/accounts', this.account()!.id, 'edit']);
    }
  }

  async delete(): Promise<void> {
    if (!this.account()) {
      return;
    }

    // 使用 nz-modal 确认删除（这里简化处理，实际应该使用 ModalHelper）
    if (confirm('確定要刪除此帳戶嗎？此操作不可恢復。')) {
      try {
        await this.accountService.deleteAccount(this.account()!.id);
        this.message.success('刪除成功');
        this.goBack();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '刪除失敗';
        this.message.error(errorMessage);
      }
    }
  }

  manageMembers(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'members']);
  }

  manageTeams(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'teams']);
  }

  manageRoles(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'roles']);
  }

  manageSchedules(organizationId: string): void {
    this.router.navigate(['/accounts/org', organizationId, 'schedules']);
  }
}
