import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService, SHARED_IMPORTS, Team } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 团队列表组件（个人视角）
 *
 * 职责：显示当前用户的团队列表
 * - 我的团队：用户创建的团队
 * - 我加入的团队：用户作为成员加入的团队
 *
 * 遵循 SRP 原则：
 * - Component 只处理 UI 展示和用户交互
 * - 业务逻辑由 AccountService 处理
 * - 数据访问由 Repository 层处理
 */
@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'團隊管理'" />
    <div style="display: flex; gap: 16px; flex-direction: column;">
      <!-- 我的团队 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>我的團隊</h2>
            <p class="text-muted">我創建的團隊</p>
          </div>
        </div>

        @if (loadingCreated()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (errorCreated()) {
          <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="errorCreated()" nzShowIcon style="margin: 16px;"></nz-alert>
        } @else if (createdTeams().length === 0) {
          <nz-empty nzNotFoundContent="尚無團隊"></nz-empty>
        } @else {
          <st
            #stCreated
            [columns]="columns"
            [data]="createdTeams()"
            [loading]="loadingCreated()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="description" let-record>
              {{ record.description || '-' }}
            </ng-template>
            <ng-template st-row="organizationName" let-record>
              {{ getOrganizationName(record.organization_id) }}
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="viewTeam(record.id)">查看</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
            </ng-template>
          </st>
        }
      </nz-card>

      <!-- 我加入的团队 -->
      <nz-card [nzBordered]="false">
        <div class="flex justify-between mb-md">
          <div>
            <h2>我加入的團隊</h2>
            <p class="text-muted">我作為成員加入的團隊</p>
          </div>
        </div>

        @if (loadingJoined()) {
          <nz-spin nzSimple [nzSize]="'large'"></nz-spin>
        } @else if (errorJoined()) {
          <nz-alert nzType="error" [nzMessage]="'載入失敗'" [nzDescription]="errorJoined()" nzShowIcon style="margin: 16px;"></nz-alert>
        } @else if (joinedTeams().length === 0) {
          <nz-empty nzNotFoundContent="尚無加入的團隊"></nz-empty>
        } @else {
          <st
            #stJoined
            [columns]="columns"
            [data]="joinedTeams()"
            [loading]="loadingJoined()"
            [page]="{ front: false, show: true, showSize: true }"
            (change)="stChange($event)"
          >
            <ng-template st-row="description" let-record>
              {{ record.description || '-' }}
            </ng-template>
            <ng-template st-row="organizationName" let-record>
              {{ getOrganizationName(record.organization_id) }}
            </ng-template>
            <ng-template st-row="action" let-record>
              <button nz-button nzType="link" nzSize="small" (click)="viewTeam(record.id)">查看</button>
              <button nz-button nzType="link" nzSize="small" (click)="manageMembers(record.id)">成員管理</button>
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
export class TeamsComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  // 我的团队状态
  readonly createdTeams = signal<Team[]>([]);
  readonly loadingCreated = signal<boolean>(false);
  readonly errorCreated = signal<string | null>(null);

  // 我加入的团队状态
  readonly joinedTeams = signal<Team[]>([]);
  readonly loadingJoined = signal<boolean>(false);
  readonly errorJoined = signal<string | null>(null);

  columns: STColumn[] = [
    { title: '團隊名稱', index: 'name', width: 200 },
    { title: '描述', index: 'description', width: 300, render: 'description' },
    { title: '所屬組織', index: 'organization_id', width: 200, render: 'organizationName' },
    { title: '創建時間', index: 'created_at', type: 'date', width: 180 },
    { title: '操作', render: 'action', width: 200 }
  ];

  async ngOnInit(): Promise<void> {
    await this.loadTeams();
  }

  /**
   * 加载团队列表
   */
  async loadTeams(): Promise<void> {
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

    await this.loadUserTeams(userAccount.id);
  }

  /**
   * 加载用户的团队列表
   */
  private async loadUserTeams(userAccountId: string): Promise<void> {
    // 并行加载创建的团队和加入的团队
    this.loadingCreated.set(true);
    this.loadingJoined.set(true);
    this.errorCreated.set(null);
    this.errorJoined.set(null);

    try {
      const [createdTeams, joinedTeams] = await Promise.all([
        this.accountService.getUserCreatedTeams(userAccountId).catch(error => {
          const errorMessage = error instanceof Error ? error.message : '載入我的團隊失敗';
          this.errorCreated.set(errorMessage);
          return [] as Team[];
        }),
        this.accountService.getUserTeams(userAccountId).catch(error => {
          const errorMessage = error instanceof Error ? error.message : '載入我加入的團隊失敗';
          this.errorJoined.set(errorMessage);
          return [] as Team[];
        })
      ]);

      this.createdTeams.set(createdTeams);
      this.joinedTeams.set(joinedTeams);

      // 如果账户列表为空，加载账户列表以便显示组织名称
      if (this.accountService.accounts().length === 0) {
        await this.accountService.loadAccounts();
      }
    } finally {
      this.loadingCreated.set(false);
      this.loadingJoined.set(false);
    }
  }

  /**
   * 获取组织名称
   */
  getOrganizationName(organizationId: string): string {
    const accounts = this.accountService.accounts();
    const org = accounts.find(a => a.id === organizationId);
    return org?.name || organizationId;
  }

  /**
   * 查看团队详情
   */
  viewTeam(teamId: string): void {
    this.router.navigate(['/accounts/teams', teamId]);
  }

  /**
   * 管理团队成员
   */
  manageMembers(teamId: string): void {
    // 从团队列表中查找团队信息
    const allTeams = [...this.createdTeams(), ...this.joinedTeams()];
    const team = allTeams.find(t => t.id === teamId);
    if (team) {
      // 导航到组织上下文下的团队成员管理页面
      const orgId = (team as any).organization_id || (team as any).organizationId;
      if (orgId) {
        this.router.navigate(['/org/teams', teamId, 'members']);
      } else {
        this.message.warning('無法獲取團隊所屬組織');
      }
    } else {
      this.message.warning('無法找到團隊信息');
    }
  }

  /**
   * 处理表格变化事件
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  stChange(_e: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }
}
