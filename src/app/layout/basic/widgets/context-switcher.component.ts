import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { MenuContextService } from '@core';
import { AccountService, SHARED_IMPORTS } from '@shared';

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

        <!-- 组织账户菜单 -->
        @if (organizationAccounts().length > 0) {
          <div nz-submenu nzTitle="组织账户" nzIcon="team">
            <ul nz-menu>
              @for (account of organizationAccounts(); track account.id) {
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
export class HeaderContextSwitcherComponent {
  readonly menuContextService = inject(MenuContextService);
  readonly accountService = inject(AccountService);
  readonly settings = inject(SettingsService);

  // Computed signals
  readonly userAccounts = computed(() => this.accountService.userAccounts());
  readonly organizationAccounts = computed(() => this.accountService.organizationAccounts());

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
}
