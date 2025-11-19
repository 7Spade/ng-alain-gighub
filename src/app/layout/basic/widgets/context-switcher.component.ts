import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MenuContextService, Team } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { AccountService, SHARED_IMPORTS } from '@shared';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

/**
 * 账户上下文切换器组件
 *
 * 允许用户在个人、组织、团队之间切换，自动更新菜单
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
        <!-- 应用菜单 -->
        <div nz-menu-item (click)="switchToApp()" [class.ant-menu-item-selected]="menuContextService.contextType() === 'app'">
          <i nz-icon nzType="appstore" class="mr-sm"></i>
          <span>应用菜单</span>
        </div>
        <li nz-menu-divider></li>

        <!-- 个人账户菜单 -->
        @if (userAccounts().length > 0) {
          <div nz-submenu nzTitle="个人账户" nzIcon="user">
            <ul nz-menu>
              @for (account of userAccounts(); track account.id) {
                <li
                  nz-menu-item
                  (click)="switchToUser(account.id)"
                  [class.ant-menu-item-selected]="
                    menuContextService.contextType() === 'user' && menuContextService.contextId() === account.id
                  "
                >
                  <i nz-icon nzType="user" class="mr-sm"></i>
                  <span>{{ account.name }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- 组织与团队菜单（层级显示） -->
        @if (organizationAccounts().length > 0) {
          <div nz-submenu nzTitle="组织与团队" nzIcon="team">
            <ul nz-menu>
              @for (account of organizationAccounts(); track account.id) {
                <!-- 组织项目 -->
                <li
                  nz-menu-item
                  (click)="switchToOrganization(account.id)"
                  [class.ant-menu-item-selected]="
                    menuContextService.contextType() === 'organization' && menuContextService.contextId() === account.id
                  "
                >
                  <i nz-icon nzType="team" class="mr-sm"></i>
                  <span>{{ account.name }}</span>
                </li>
                <!-- 该组织下的团队（带缩进显示） -->
                @if (teamsByOrganization().has(account.id) && teamsByOrganization().get(account.id)!.length > 0) {
                  @for (team of teamsByOrganization().get(account.id)!; track team.id) {
                    <li
                      nz-menu-item
                      (click)="switchToTeam(team.id)"
                      [class.ant-menu-item-selected]="
                        menuContextService.contextType() === 'team' && menuContextService.contextId() === team.id
                      "
                      style="padding-left: 48px;"
                    >
                      <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                      <span>{{ team.name }}</span>
                    </li>
                  }
                }
              }
            </ul>
          </div>
        }

        <!-- 如果没有账户，显示提示 -->
        @if (userAccounts().length === 0 && organizationAccounts().length === 0) {
          <li nz-menu-item nzDisabled>
            <i nz-icon nzType="info-circle" class="mr-sm"></i>
            <span>暂无可用账户</span>
          </li>
        }
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContextSwitcherComponent implements OnInit {
  readonly menuContextService = inject(MenuContextService);
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
      const orgId = (team as any).organization_id || (team as any).organizationId;
      if (orgId && teamsMap.has(orgId)) {
        teamsMap.get(orgId)!.push(team);
      }
    });

    return teamsMap;
  });

  // 当前上下文标签和图标
  readonly contextLabel = computed(() => {
    const type = this.menuContextService.contextType();
    const id = this.menuContextService.contextId();

    switch (type) {
      case 'user':
        if (id) {
          const account = this.userAccounts().find(a => a.id === id);
          return account?.name || '个人账户';
        }
        return '个人账户';
      case 'organization':
        if (id) {
          const account = this.organizationAccounts().find(a => a.id === id);
          return account?.name || '组织账户';
        }
        return '组织账户';
      case 'team':
        if (id) {
          const team = this.userTeams().find(t => t.id === id);
          return team?.name || '团队';
        }
        return '团队';
      default:
        return '应用菜单';
    }
  });

  readonly contextIcon = computed(() => {
    const type = this.menuContextService.contextType();
    switch (type) {
      case 'user':
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
   * 切换到应用菜单
   */
  switchToApp(): void {
    this.menuContextService.switchToApp();
  }

  /**
   * 切换到个人用户菜单
   */
  switchToUser(userId: string): void {
    this.menuContextService.switchToUser(userId);
    // 同时更新 AccountService 的选中账户
    const account = this.userAccounts().find(a => a.id === userId);
    if (account) {
      this.accountService.selectAccount(account);
    }
  }

  /**
   * 切换到组织菜单
   */
  switchToOrganization(organizationId: string): void {
    this.menuContextService.switchToOrganization(organizationId);
    // 同时更新 AccountService 的选中账户
    const account = this.organizationAccounts().find(a => a.id === organizationId);
    if (account) {
      this.accountService.selectAccount(account);
    }
  }

  /**
   * 切换到团队菜单
   */
  switchToTeam(teamId: string): void {
    this.menuContextService.switchToTeam(teamId);
    // 注意：Team 不是 Account，所以不需要调用 selectAccount
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
