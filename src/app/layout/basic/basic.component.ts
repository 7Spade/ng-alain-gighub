import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuContextService, Team } from '@core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { Account, AccountService } from '@shared';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
import { HeaderContextSwitcherComponent } from './widgets/context-switcher.component';
import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
import { HeaderI18nComponent } from './widgets/i18n.component';
import { HeaderIconComponent } from './widgets/icon.component';
import { HeaderNotifyComponent } from './widgets/notify.component';
import { HeaderRTLComponent } from './widgets/rtl.component';
import { HeaderSearchComponent } from './widgets/search.component';
import { HeaderTaskComponent } from './widgets/task.component';
import { HeaderUserComponent } from './widgets/user.component';

@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <layout-default-header-item direction="left">
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain-gighub" target="_blank">
          <i nz-icon nzType="github"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="mobile">
        <a layout-default-header-item-trigger routerLink="/passport/lock">
          <i nz-icon nzType="lock"></i>
        </a>
      </layout-default-header-item>
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <i nz-icon nzType="search"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus" />
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-notify />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-task />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-icon />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <header-context-switcher />
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <header-rtl />
            </div>
            <div nz-menu-item>
              <header-fullscreen />
            </div>
            <div nz-menu-item>
              <header-clear-storage />
            </div>
            <div nz-menu-item>
              <header-i18n />
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-user />
      </layout-default-header-item>
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" nzPlacement="topLeft" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
            <!-- 切換上下文區域 -->
            @if (currentUserAccountId()) {
              <li nz-menu-divider></li>
              <li nz-submenu nzTitle="切換上下文" nzIcon="swap">
                <ul nz-menu>
                  <!-- 個人視角 -->
                  <li nz-menu-item (click)="switchToUser()" [class.ant-menu-item-selected]="menuContextService.contextType() === 'user'">
                    <i nz-icon nzType="user" class="mr-sm"></i>
                    <span>個人視角</span>
                  </li>
                  <!-- 組織與團隊 -->
                  @if (allOrganizations().length > 0) {
                    @for (org of allOrganizations(); track org.id) {
                      <li
                        nz-menu-item
                        (click)="switchToOrganization(org.id)"
                        [class.ant-menu-item-selected]="
                          menuContextService.contextType() === 'organization' && menuContextService.contextId() === org.id
                        "
                      >
                        <i nz-icon nzType="team" class="mr-sm"></i>
                        <span>{{ org.name }}</span>
                      </li>
                      <!-- 組織下的團隊 -->
                      @if (teamsByOrganization().has(org.id) && teamsByOrganization().get(org.id)!.length > 0) {
                        @for (team of teamsByOrganization().get(org.id)!; track team.id) {
                          <li
                            nz-menu-item
                            (click)="switchToTeam(team.id)"
                            style="padding-left: 32px;"
                            [class.ant-menu-item-selected]="
                              menuContextService.contextType() === 'team' && menuContextService.contextId() === team.id
                            "
                          >
                            <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                            <span>{{ team.name }}</span>
                          </li>
                        }
                      }
                    }
                  }
                </ul>
              </li>
            }
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <router-outlet />
      </ng-template>
    </layout-default>
    @if (showSettingDrawer) {
      <setting-drawer />
    }
    <theme-btn />
  `,
  imports: [
    RouterOutlet,
    RouterLink,
    I18nPipe,
    LayoutDefaultModule,
    NzIconModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    NzDividerModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    HeaderSearchComponent,
    HeaderNotifyComponent,
    HeaderTaskComponent,
    HeaderIconComponent,
    HeaderRTLComponent,
    HeaderI18nComponent,
    HeaderClearStorageComponent,
    HeaderFullScreenComponent,
    HeaderContextSwitcherComponent,
    HeaderUserComponent
  ]
})
export class LayoutBasicComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly accountService = inject(AccountService);
  readonly menuContextService = inject(MenuContextService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // 组织列表状态
  readonly createdOrganizations = signal<Account[]>([]);
  readonly joinedOrganizations = signal<Account[]>([]);
  readonly loadingOrganizations = signal<boolean>(false);

  // 团队列表状态
  readonly userTeams = signal<Team[]>([]);
  readonly loadingTeams = signal<boolean>(false);

  // 当前用户账户ID
  readonly currentUserAccountId = signal<string | null>(null);

  // 合并所有组织（去重）
  readonly allOrganizations = computed(() => {
    const all = [...this.createdOrganizations(), ...this.joinedOrganizations()];
    // 根据 ID 去重
    const uniqueMap = new Map<string, Account>();
    all.forEach(org => {
      if (!uniqueMap.has(org.id)) {
        uniqueMap.set(org.id, org);
      }
    });
    return Array.from(uniqueMap.values());
  });

  // 按组织分组的团队列表
  readonly teamsByOrganization = computed(() => {
    const teams = this.userTeams();
    const orgs = this.allOrganizations();
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

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`
  };
  searchToggleStatus = false;
  showSettingDrawer = true;

  get user(): User {
    return this.settings.user;
  }

  constructor() {
    // 监听用户登录状态，自动加载组织列表
    effect(() => {
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        this.loadUserOrganizations(token['user']['id']);
      }
    });
  }

  ngOnInit(): void {
    // 如果已有 token，立即加载组织列表
    const token = this.tokenService.get();
    if (token?.['user']?.['id']) {
      this.loadUserOrganizations(token['user']['id']);
    }
  }

  /**
   * 加载用户的组织列表和团队列表
   */
  private async loadUserOrganizations(authUserId: string): Promise<void> {
    this.loadingOrganizations.set(true);
    this.loadingTeams.set(true);

    try {
      // 1. 获取用户账户信息
      const userAccount = await this.accountService.findByAuthUserId(authUserId);
      if (!userAccount) {
        this.loadingOrganizations.set(false);
        this.loadingTeams.set(false);
        return;
      }

      // 2. 并行加载建立的组织、加入的组织和团队列表
      const [createdOrgs, joinedOrgs, teams] = await Promise.all([
        this.accountService.getUserCreatedOrganizations(authUserId),
        this.accountService.getUserJoinedOrganizations(userAccount.id),
        this.accountService.getUserTeams(userAccount.id)
      ]);

      this.createdOrganizations.set(createdOrgs);
      this.joinedOrganizations.set(joinedOrgs);
      this.userTeams.set(teams);
      this.currentUserAccountId.set(userAccount.id);
    } catch (error) {
      console.error('加载用户组织列表和团队列表失败:', error);
    } finally {
      this.loadingOrganizations.set(false);
      this.loadingTeams.set(false);
    }
  }

  /**
   * 切换到组织菜单
   */
  switchToOrganization(organizationId: string): void {
    this.menuContextService.switchToOrganization(organizationId);
    // 同时更新 AccountService 的选中账户
    const account = this.allOrganizations().find(org => org.id === organizationId);
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

  /**
   * 切换到用户视角
   */
  switchToUser(): void {
    const userAccountId = this.currentUserAccountId();
    if (userAccountId) {
      this.menuContextService.switchToUser(userAccountId);
      // 同时更新 AccountService 的选中账户
      const userAccount = this.accountService.userAccounts().find(a => a.id === userAccountId);
      if (userAccount) {
        this.accountService.selectAccount(userAccount);
      }
    }
  }
}
