import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MenuContextService, Team, ContextService } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

/**
 * 账户上下文切换器组件
 *
 * 允许用户在个人、组织、团队之间切换
 * 使用全局 ContextService 管理上下文狀態，自動同步菜單、ACL、ReuseTab
 * 支援階層式導航：組織 → 團隊
 */
@Component({
  selector: 'header-context-switcher',
  standalone: true,
  imports: [SHARED_IMPORTS, NzDropDownModule, NzMenuModule, NzIconModule],
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="contextMenu"
    >
      <i nz-icon [nzType]="contextIcon()" class="mr-sm"></i>
      <span>{{ contextLabel() }}</span>
    </div>
    <nz-dropdown-menu #contextMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <!-- 个人视角 -->
        <div nz-menu-item (click)="switchToPersonal()" [class.ant-menu-item-selected]="contextService.isPersonal()">
          <i nz-icon nzType="user" class="mr-sm"></i>
          <span>個人視角</span>
        </div>
        <li nz-menu-divider></li>

        <!-- 组织列表（包含其下的团队） -->
        @if (organizationAccounts().length > 0) {
          @for (org of organizationAccounts(); track org.id) {
            <div nz-submenu [nzTitle]="org.name" nzIcon="team">
              <ul nz-menu>
                <!-- 组织本身 -->
                <li
                  nz-menu-item
                  (click)="switchToOrganization(org.id, org.name)"
                  [class.ant-menu-item-selected]="contextService.isOrganization() && contextService.contextId() === org.id"
                >
                  <i nz-icon nzType="team" class="mr-sm"></i>
                  <span>{{ org.name }}（組織）</span>
                </li>

                <!-- 该组织下的团队列表 -->
                @if (teamsByOrganization().has(org.id) && teamsByOrganization().get(org.id)!.length > 0) {
                  <li nz-menu-divider></li>
                  @for (team of teamsByOrganization().get(org.id)!; track team.id) {
                    <li
                      nz-menu-item
                      (click)="switchToTeam(team.id, team.name, org.id)"
                      [class.ant-menu-item-selected]="contextService.isTeam() && contextService.contextId() === team.id"
                    >
                      <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                      <span>{{ team.name }}（團隊）</span>
                    </li>
                  }
                }
              </ul>
            </div>
          }
        }

        <!-- 如果没有组织，显示提示 -->
        @if (organizationAccounts().length === 0) {
          <li nz-menu-item nzDisabled>
            <i nz-icon nzType="info-circle" class="mr-sm"></i>
            <span>暂无可用组织</span>
          </li>
        }
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContextSwitcherComponent implements OnInit {
  readonly menuContextService = inject(MenuContextService);
  readonly contextService = inject(ContextService);
  readonly accountService = inject(AccountService);
  readonly settings = inject(SettingsService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // Computed signals
  readonly userAccounts = computed(() => this.accountService.userAccounts());
  readonly organizationAccounts = computed(() => this.accountService.organizationAccounts());

  // 团队列表状态
  readonly userTeams = signal<Team[]>([]);

  // 按组织分组的团队列表
  readonly teamsByOrganization = computed(() => {
    const teams = this.userTeams();
    const orgs = this.organizationAccounts();
    const teamsMap = new Map<string, Team[]>();

    // 初始化所有组织的团队列表
    orgs.forEach(org => {
      teamsMap.set(org.id, []);
    });

    // 按组织分组团队
    teams.forEach(team => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orgId = (team as any).organization_id || (team as any).organizationId;
      if (orgId && teamsMap.has(orgId)) {
        teamsMap.get(orgId)!.push(team);
      }
    });

    return teamsMap;
  });

  // 当前上下文标签和图标（基於 ContextService）
  readonly contextLabel = computed(() => {
    const context = this.contextService.context();

    if (context.name) {
      return context.name;
    }

    switch (context.type) {
      case 'personal':
        return '個人視角';
      case 'organization':
        if (context.id) {
          const account = this.organizationAccounts().find(a => a.id === context.id);
          return account?.name || '組織';
        }
        return '組織';
      case 'team':
        if (context.id) {
          const team = this.userTeams().find(t => t.id === context.id);
          return team?.name || '團隊';
        }
        return '團隊';
      default:
        return '應用選單';
    }
  });

  readonly contextIcon = computed(() => {
    const context = this.contextService.context();
    switch (context.type) {
      case 'personal':
        return 'user';
      case 'organization':
        return 'team';
      case 'team':
        return 'usergroup-add';
      default:
        return 'appstore';
    }
  });

  /**
   * 切換到個人視角
   */
  switchToPersonal(): void {
    this.contextService.switchToPersonal();
  }

  /**
   * 切換到組織視角
   */
  switchToOrganization(organizationId: string, name?: string): void {
    this.contextService.switchToOrganization(organizationId, name);
    // 同時更新 AccountService 的選中帳戶
    const account = this.organizationAccounts().find(a => a.id === organizationId);
    if (account) {
      this.accountService.selectAccount(account);
    }
  }

  /**
   * 切換到團隊視角
   */
  switchToTeam(teamId: string, name?: string, organizationId?: string): void {
    this.contextService.switchToTeam(teamId, name, organizationId);
    // 注意：Team 不是 Account，所以不需要調用 selectAccount
  }

  ngOnInit(): void {
    // 监听用户登录状态，自动加载团队列表
    effect(() => {
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        this.loadUserTeams(token['user']['id']);
      }
    });

    // 如果已有 token，立即加载团队列表
    const token = this.tokenService.get();
    if (token?.['user']?.['id']) {
      this.loadUserTeams(token['user']['id']);
    }
  }

  /**
   * 加载用户的团队列表
   */
  private async loadUserTeams(authUserId: string): Promise<void> {
    try {
      // 1. 获取用户账户信息
      const userAccount = await this.accountService.findByAuthUserId(authUserId);
      if (!userAccount) {
        return;
      }

      // 2. 加载团队列表
      const teams = await this.accountService.getUserTeams(userAccount.id);
      this.userTeams.set(teams);
    } catch (error) {
      console.error('加载用户团队列表失败:', error);
    }
  }
}
