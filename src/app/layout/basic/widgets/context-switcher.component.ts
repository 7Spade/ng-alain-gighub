import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { WorkspaceContextService } from '@core';
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
      [nzDisabled]="switching()"
    >
      @if (switching()) {
        <i nz-icon nzType="loading" class="mr-sm"></i>
      } @else {
        <i nz-icon [nzType]="contextIcon()" class="mr-sm"></i>
      }
      <span>{{ contextLabel() }}</span>
    </div>
    <nz-dropdown-menu #contextMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <!-- 应用菜单 -->
        <div nz-menu-item (click)="switchToApp()" [class.ant-menu-item-selected]="workspaceContext.contextType() === 'app'">
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
                  [class.ant-menu-item-selected]="workspaceContext.contextType() === 'user' && workspaceContext.contextId() === account.id"
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
                    workspaceContext.contextType() === 'organization' && workspaceContext.contextId() === account.id
                  "
                >
                  <i nz-icon nzType="team" class="mr-sm"></i>
                  <span>{{ account.name }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <!-- 团队账户菜单 -->
        @if (userTeams().length > 0) {
          <div nz-submenu nzTitle="团队账户" nzIcon="usergroup-add">
            <ul nz-menu>
              @for (org of organizationAccounts(); track org.id) {
                @if (teamsByOrganization().has(org.id) && teamsByOrganization().get(org.id)!.length > 0) {
                  <li nz-submenu [nzTitle]="org.name" nzIcon="team">
                    <ul nz-menu>
                      @for (team of teamsByOrganization().get(org.id)!; track team.id) {
                        <li
                          nz-menu-item
                          (click)="switchToTeam(team.id)"
                          [class.ant-menu-item-selected]="
                            workspaceContext.contextType() === 'team' && workspaceContext.contextId() === team.id
                          "
                        >
                          <i nz-icon nzType="usergroup-add" class="mr-sm"></i>
                          <span>{{ team.name }}</span>
                        </li>
                      }
                    </ul>
                  </li>
                }
              }
            </ul>
          </div>
        }

        <!-- 如果没有账户，显示提示 -->
        @if (userAccounts().length === 0 && organizationAccounts().length === 0 && userTeams().length === 0) {
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
  readonly accountService = inject(AccountService);
  readonly workspaceContext = inject(WorkspaceContextService);
  readonly settings = inject(SettingsService);

  // 使用 WorkspaceContextService 的 signals
  readonly userAccounts = computed(() => this.accountService.userAccounts());
  readonly organizationAccounts = this.workspaceContext.allOrganizations;
  readonly userTeams = this.workspaceContext.userTeams;
  readonly teamsByOrganization = this.workspaceContext.teamsByOrganization;
  readonly contextLabel = this.workspaceContext.contextLabel;
  readonly contextIcon = this.workspaceContext.contextIcon;
  readonly switching = this.workspaceContext.switching;

  /**
   * 切换到应用菜单
   */
  switchToApp(): void {
    this.workspaceContext.switchToApp();
  }

  /**
   * 切换到个人用户菜单
   */
  switchToUser(userId: string): void {
    this.workspaceContext.switchToUser(userId);
  }

  /**
   * 切换到组织菜单
   */
  switchToOrganization(organizationId: string): void {
    this.workspaceContext.switchToOrganization(organizationId);
  }

  /**
   * 切换到团队菜单
   */
  switchToTeam(teamId: string): void {
    this.workspaceContext.switchToTeam(teamId);
  }

  ngOnInit(): void {
    // WorkspaceContextService 会自动加载数据，无需手动调用
    // 此方法保留以满足 OnInit 接口要求
  }
}
