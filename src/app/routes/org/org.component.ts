import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Account, AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 组织列表组件
 *
 * 职责：显示当前用户的组织列表
 * - 我的组织：用户创建/拥有的组织
 * - 我加入的组织：用户作为成员加入的组织
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 AccountService 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-org',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'組織管理'" />
    <div style="display: flex; gap: 16px; flex-direction: column;">
      <!-- 我的组织 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>我的組織</h2>
            <p class="text-muted">我創建或擁有的組織</p>
          </div>
          <button nz-button nzType="primary" (click)="createOrganization()">
            <span nz-icon nzType="plus"></span>
            建立組織
          </button>
        </div>

        @if (loadingCreated()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (errorCreated()) {
          <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="errorCreated()" nzShowIcon style="margin: 16px;"></nz-alert>
        } @else if (createdOrganizations().length === 0) {
          <nz-empty nzNotFoundContent="尚無組織">
            <button nz-button nzType="primary" (click)="createOrganization()">建立第一個組織</button>
          </nz-empty>
        } @else {
          <st
            #stCreated
            [columns]="columns"
            [data]="createdOrganizations()"
            [loading]="loadingCreated()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="status" let-record>
              @switch (record.status) {
                @case ('active') {
                  <nz-tag nzColor="success">活躍</nz-tag>
                }
                @case ('inactive') {
                  <nz-tag nzColor="default">非活躍</nz-tag>
                }
                @case ('suspended') {
                  <nz-tag nzColor="error">已暫停</nz-tag>
                }
              }
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="viewOrganization(record.id)">查看</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageRoles(record.id)">角色管理</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageTeams(record.id)">團隊管理</button>
            </ng-template>
          </st>
        }
      </nz-card>

      <!-- 我加入的组织 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>我加入的組織</h2>
            <p class="text-muted">我作為成員加入的組織</p>
          </div>
        </div>

        @if (loadingJoined()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (errorJoined()) {
          <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="errorJoined()" nzShowIcon style="margin: 16px;"></nz-alert>
        } @else if (joinedOrganizations().length === 0) {
          <nz-empty nzNotFoundContent="尚無加入的組織"></nz-empty>
        } @else {
          <st
            #stJoined
            [columns]="columns"
            [data]="joinedOrganizations()"
            [loading]="loadingJoined()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="status" let-record>
              @switch (record.status) {
                @case ('active') {
                  <nz-tag nzColor="success">活躍</nz-tag>
                }
                @case ('inactive') {
                  <nz-tag nzColor="default">非活躍</nz-tag>
                }
                @case ('suspended') {
                  <nz-tag nzColor="error">已暫停</nz-tag>
                }
              }
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="viewOrganization(record.id)">查看</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageRoles(record.id)">角色管理</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageTeams(record.id)">團隊管理</button>
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
export class OrgComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 我的组织状态
  readonly createdOrganizations = signal<Account[]>([]);
  readonly loadingCreated = signal<boolean>(false);
  readonly errorCreated = signal<string | null>(null);

  // 我加入的组织状态
  readonly joinedOrganizations = signal<Account[]>([]);
  readonly loadingJoined = signal<boolean>(false);
  readonly errorJoined = signal<string | null>(null);

  columns: STColumn[] = [
    { title: '組織名稱', index: 'name', width: 200 },
    { title: '郵箱', index: 'email', width: 200 },
    { title: '狀態', index: 'status', width: 120, render: 'status' },
    { title: '創建時間', index: 'created_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 300 }
  ];

  async ngOnInit(): Promise<void> {
    await this.loadOrganizations();
  }

  /**
   * 加载组织列表
   */
  async loadOrganizations(): Promise<void> {
    // 获取当前用户信息
    const currentUserAuthId = this.tokenService.get()?.['user']?.id;
    if (!currentUserAuthId) {
      this.message.error('無法獲取用戶資訊');
      return;
    }

    // 查找当前用户对应的 account
    let userAccount = await this.accountService.findByAuthUserId(currentUserAuthId);
    if (!userAccount) {
      // 如果找不到，先加载账户列表再查找
      await this.accountService.loadAccounts();
      userAccount = await this.accountService.findByAuthUserId(currentUserAuthId);
      if (!userAccount) {
        this.message.error('無法找到用戶帳戶');
        return;
      }
    }

    await this.loadUserOrganizations(currentUserAuthId, userAccount.id);
  }

  /**
   * 加载用户的组织列表
   */
  private async loadUserOrganizations(authUserId: string, userAccountId: string): Promise<void> {
    // 并行加载创建的组织和加入的组织
    this.loadingCreated.set(true);
    this.loadingJoined.set(true);
    this.errorCreated.set(null);
    this.errorJoined.set(null);

    try {
      const [createdOrgs, joinedOrgs] = await Promise.all([
        this.accountService.getUserCreatedOrganizations(authUserId).catch(error => {
          const errorMessage = error instanceof Error ? error.message : '載入我的組織失敗';
          this.errorCreated.set(errorMessage);
          return [] as Account[];
        }),
        this.accountService.getUserJoinedOrganizations(userAccountId).catch(error => {
          const errorMessage = error instanceof Error ? error.message : '載入我加入的組織失敗';
          this.errorJoined.set(errorMessage);
          return [] as Account[];
        })
      ]);

      this.createdOrganizations.set(createdOrgs);
      this.joinedOrganizations.set(joinedOrgs);
    } finally {
      this.loadingCreated.set(false);
      this.loadingJoined.set(false);
    }
  }

  /**
   * 创建组织
   */
  createOrganization(): void {
    this.router.navigate(['/accounts/create/organization']);
  }

  /**
   * 查看组织详情
   */
  viewOrganization(organizationId: string): void {
    this.router.navigate(['/accounts', organizationId]);
  }

  /**
   * 管理组织成员
   */
  manageMembers(organizationId: string): void {
    this.router.navigate(['/org', organizationId, 'members']);
  }

  /**
   * 管理组织角色
   */
  manageRoles(organizationId: string): void {
    this.router.navigate(['/org', organizationId, 'roles']);
  }

  /**
   * 管理组织团队
   */
  manageTeams(organizationId: string): void {
    this.router.navigate(['/org', organizationId, 'teams']);
  }

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }
}
