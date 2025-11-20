import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { WorkspaceContextFacade } from '@core';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { AccountService } from '@shared';
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
            @if (currentUserAccountId()) {
              <li nz-menu-divider></li>
              <li
                nz-menu-item
                (click)="workspaceContext.switchToUser()"
                [nzDisabled]="workspaceContext.switching()"
                [class.ant-menu-item-selected]="
                  workspaceContext.contextType() === 'user' && workspaceContext.contextId() === currentUserAccountId()
                "
              >
                @if (workspaceContext.switching()) {
                  <i nz-icon nzType="loading" class="mr-sm"></i>
                } @else {
                  <i nz-icon nzType="user" class="mr-sm"></i>
                }
                <span>{{ currentUserAccount()?.name || '個人視角' }}</span>
              </li>
            }
            @if (allOrganizations().length > 0) {
              <li nz-menu-divider></li>
              @for (org of allOrganizations(); track org.id) {
                <li nz-menu-item (click)="workspaceContext.switchToOrganization(org.id)" [nzDisabled]="workspaceContext.switching()">
                  @if (workspaceContext.switching()) {
                    <i nz-icon nzType="loading" class="mr-sm"></i>
                  } @else {
                    <i nz-icon nzType="team" class="mr-sm"></i>
                  }
                  <span>{{ org.name }}</span>
                </li>
                @if (teamsByOrganization().has(org.id) && teamsByOrganization().get(org.id)!.length > 0) {
                  @for (team of teamsByOrganization().get(org.id)!; track team.id) {
                    <li
                      nz-menu-item
                      (click)="workspaceContext.switchToTeam(team.id)"
                      [nzDisabled]="workspaceContext.switching()"
                      style="padding-left: 32px;"
                    >
                      @if (workspaceContext.switching()) {
                        <i nz-icon nzType="loading" class="mr-sm"></i>
                      } @else {
                        <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                      }
                      <span>{{ team.name }}</span>
                    </li>
                  }
                }
              }
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
  readonly workspaceContext = inject(WorkspaceContextFacade);

  // 使用 WorkspaceContextFacade 的 signals
  readonly allOrganizations = this.workspaceContext.allOrganizations;
  readonly teamsByOrganization = this.workspaceContext.teamsByOrganization;
  readonly currentUserAccountId = this.workspaceContext.currentUserAccountId;
  readonly currentUserAccount = this.workspaceContext.currentUserAccount;

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`
  };
  searchToggleStatus = false;
  showSettingDrawer = true;

  get user(): User {
    return this.settings.user;
  }

  ngOnInit(): void {
    // WorkspaceContextFacade 会自动加载数据，无需手动调用
  }
}
