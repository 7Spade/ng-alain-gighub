import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { I18nPipe, SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { environment } from '@env/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { firstValueFrom } from 'rxjs';

import { IdentityContextService, StartupService } from '@core';
import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
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
        <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
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
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="identityMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="currentIdentityAvatar() || user.avatar" />
          <div class="alain-default__aside-user-info">
            <strong>{{ currentIdentityName() }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #identityMenu="nzDropdownMenu">
          <ul nz-menu>
            <!-- 当前身份显示 -->
            <li nz-menu-item [nzSelected]="true">
              <span style="font-weight: bold;">{{ currentIdentityName() }}</span>
            </li>
            <li nz-menu-divider></li>

            <!-- 个人身份 -->
            <li nz-menu-item (click)="switchIdentity('personal')">
              <i nz-icon nzType="user"></i>
              <span>个人</span>
            </li>

            <!-- 组织列表 -->
            @if (availableOrganizations().length > 0) {
              @for (org of availableOrganizations(); track org.id) {
                <li nz-menu-item (click)="switchIdentity('organization', org.id)">
                  <i nz-icon nzType="team"></i>
                  <span>{{ org.name }}</span>
                </li>
              }
            }

            <!-- 团队列表 -->
            @if (availableTeams().length > 0) {
              @for (team of availableTeams(); track team.id) {
                <li nz-menu-item (click)="switchIdentity('team', team.id)">
                  <i nz-icon nzType="usergroup-add"></i>
                  <span>{{ team.name }}</span>
                </li>
              }
            }

            <li nz-menu-divider></li>

            <!-- 管理组织和建立组织 -->
            <li nz-menu-item routerLink="/accounts/organizations/manage">
              <i nz-icon nzType="setting"></i>
              <span>管理组织</span>
            </li>
            <li nz-menu-item routerLink="/accounts/organizations/create">
              <i nz-icon nzType="plus"></i>
              <span>建立组织</span>
            </li>

            <li nz-menu-divider></li>

            <!-- 账户中心、账户设置 -->
            <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
            <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
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
    HeaderUserComponent
  ]
})
export class LayoutBasicComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private readonly identityContextService = inject(IdentityContextService);
  private readonly startupService = inject(StartupService);
  private readonly httpClient = inject(HttpClient);

  // 应用数据缓存（用于菜单更新）
  private appData: NzSafeAny | null = null;

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`
  };
  searchToggleStatus = false;
  showSettingDrawer = !environment.production;

  // 身份相关 Signal
  readonly currentIdentityName = this.identityContextService.currentIdentityName;
  readonly currentIdentityAvatar = this.identityContextService.currentIdentityAvatar;
  readonly availableOrganizations = this.identityContextService.availableOrganizations;
  readonly availableTeams = this.identityContextService.availableTeams;

  get user(): User {
    return this.settings.user;
  }

  ngOnInit(): void {
    // 加载应用数据
    firstValueFrom(this.httpClient.get('./assets/tmp/app-data.json')).then(data => {
      this.appData = data;
      // 立即加载一次菜单
      if (this.identityContextService.currentIdentity()) {
        this.startupService.reloadMenuByIdentity(data);
      }
    });

    // 监听身份变化，更新菜单
    // 关键：effect 必须读取 Signal 才能响应变化
    effect(() => {
      // 读取 currentIdentity Signal，这样当身份变化时 effect 会重新执行
      const identity = this.identityContextService.currentIdentity();
      if (this.appData && identity) {
        this.startupService.reloadMenuByIdentity(this.appData);
      }
    });
  }

  /**
   * 切换身份
   */
  async switchIdentity(type: 'personal' | 'organization' | 'team', id?: string): Promise<void> {
    try {
      await this.identityContextService.switchIdentity(type, id);
      // 菜单更新由 effect 自动处理
    } catch (error) {
      console.error('Failed to switch identity:', error);
    }
  }
}
