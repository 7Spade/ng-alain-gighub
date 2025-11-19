import { Injectable, effect, inject, signal } from '@angular/core';
import { MenuService } from '@delon/theme';
import { AccountService, AccountType } from '@shared';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ContextService } from '../services/context.service';

/**
 * 菜单上下文服务
 *
 * 管理不同账户类型（个人/组织/团队）的菜单切换
 * 监听账户切换事件，自动更新菜单
 *
 * @example
 * ```typescript
 * const menuContextService = inject(MenuContextService);
 *
 * // 切换菜单上下文
 * await menuContextService.switchToUser();
 * await menuContextService.switchToOrganization(orgId);
 * await menuContextService.switchToTeam(teamId);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MenuContextService {
  private readonly menuService = inject(MenuService);
  private readonly accountService = inject(AccountService);
  private readonly contextService = inject(ContextService);

  // 菜单数据缓存
  private userMenuData: NzSafeAny[] = [];
  private organizationMenuData: NzSafeAny[] = [];
  private teamMenuData: NzSafeAny[] = [];
  private appMenuData: NzSafeAny[] = [];

  // 当前菜单上下文类型
  private currentContextType = signal<'user' | 'organization' | 'team' | 'app'>('app');
  private currentContextId = signal<string | null>(null);

  // 暴露只读信号
  readonly contextType = this.currentContextType.asReadonly();
  readonly contextId = this.currentContextId.asReadonly();

  constructor() {
    // 监听账户切换，自动更新菜单
    effect(() => {
      const selectedAccount = this.accountService.selectedAccount();
      if (selectedAccount) {
        this.updateMenuByAccount(selectedAccount);
      }
    });
  }

  /**
   * 初始化菜单数据
   * 在 StartupService 中调用，保存不同账户类型的菜单数据
   */
  initializeMenuData(data: {
    appMenu?: NzSafeAny[];
    userMenu?: NzSafeAny[];
    organizationMenu?: NzSafeAny[];
    teamMenu?: NzSafeAny[];
  }): void {
    if (data.appMenu) {
      this.appMenuData = data.appMenu;
    }
    if (data.userMenu) {
      this.userMenuData = data.userMenu;
    }
    if (data.organizationMenu) {
      this.organizationMenuData = data.organizationMenu;
    }
    if (data.teamMenu) {
      this.teamMenuData = data.teamMenu;
    }

    // 同時初始化 ContextService 的菜單資料
    this.contextService.initializeMenuData({
      personalMenu: this.userMenuData,
      organizationMenu: this.organizationMenuData,
      teamMenu: this.teamMenuData
    });

    // 默认使用应用菜单
    this.switchToApp();
  }

  /**
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    this.currentContextType.set('app');
    this.currentContextId.set(null);
    this.menuService.clear();
    this.menuService.add(this.appMenuData);
    this.menuService.resume();
  }

  /**
   * 切换到个人用户菜单
   */
  switchToUser(userId?: string): void {
    this.currentContextType.set('user');
    this.currentContextId.set(userId || null);
    this.menuService.clear();
    this.menuService.add(this.userMenuData);
    this.menuService.resume();
  }

  /**
   * 切换到组织菜单
   */
  switchToOrganization(organizationId: string): void {
    this.currentContextType.set('organization');
    this.currentContextId.set(organizationId);
    this.menuService.clear();
    // 处理菜单链接中的动态 ID 替换
    const processedMenu = this.processMenuLinks(this.organizationMenuData, organizationId);
    this.menuService.add(processedMenu);
    this.menuService.resume();
  }

  /**
   * 切换到团队菜单
   */
  switchToTeam(teamId: string): void {
    this.currentContextType.set('team');
    this.currentContextId.set(teamId);
    this.menuService.clear();
    // 处理菜单链接中的动态 ID 替换
    const processedMenu = this.processMenuLinks(this.teamMenuData, teamId);
    this.menuService.add(processedMenu);
    this.menuService.resume();
  }

  /**
   * 根据账户类型自动更新菜单
   */
  private updateMenuByAccount(account: { type: AccountType | string; id: string }): void {
    const accountType = account.type as AccountType;
    switch (accountType) {
      case AccountType.USER:
        this.switchToUser(account.id);
        break;
      case AccountType.ORGANIZATION:
        this.switchToOrganization(account.id);
        break;
      default:
        // Bot 或其他类型，使用应用菜单
        this.switchToApp();
        break;
    }
  }

  /**
   * 获取当前菜单数据
   */
  getCurrentMenuData(): NzSafeAny[] {
    switch (this.currentContextType()) {
      case 'user':
        return this.userMenuData;
      case 'organization':
        return this.organizationMenuData;
      case 'team':
        return this.teamMenuData;
      default:
        return this.appMenuData;
    }
  }

  /**
   * 处理菜单链接，替换动态 ID 占位符
   *
   * @param menu 菜单数据
   * @param id 要替换的 ID（组织ID或团队ID）
   * @returns 处理后的菜单数据
   */
  private processMenuLinks(menu: NzSafeAny[], id: string): NzSafeAny[] {
    if (!id) return menu;

    return menu.map(item => {
      const processed: NzSafeAny = { ...item };

      // 处理链接中的 :id 占位符
      if (processed.link && typeof processed.link === 'string') {
        processed.link = processed.link.replace(/:id/g, id);
      }

      // 递归处理子菜单
      if (processed.children && Array.isArray(processed.children)) {
        processed.children = this.processMenuLinks(processed.children, id);
      }

      return processed;
    });
  }

  /**
   * 合并菜单数据（用于组合多个菜单）
   */
  mergeMenuData(...menuArrays: NzSafeAny[][]): NzSafeAny[] {
    const merged: NzSafeAny[] = [];
    const seen = new Set<string>();

    for (const menuArray of menuArrays) {
      for (const item of menuArray) {
        // 根据 link 或 text 去重
        const key = item.link || item.text || item.i18n;
        if (key && !seen.has(key)) {
          seen.add(key);
          merged.push(item);
        } else if (!key) {
          // 没有唯一标识的项直接添加
          merged.push(item);
        }
      }
    }

    return merged;
  }
}
