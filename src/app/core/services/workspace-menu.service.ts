import { Injectable, inject, signal } from '@angular/core';
import { MenuService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

/**
 * Workspace Menu Service
 *
 * 工作区菜单管理服务（Core 层）
 * 负责菜单切换和菜单数据处理
 *
 * 职责：
 * - 管理菜单数据缓存
 * - 处理菜单切换
 * - 处理菜单链接中的动态 ID 替换
 *
 * @example
 * ```typescript
 * const menuService = inject(WorkspaceMenuService);
 *
 * // 初始化菜单数据
 * menuService.initializeMenuData({
 *   appMenu: appMenuData,
 *   userMenu: userMenuData,
 *   organizationMenu: orgMenuData,
 *   teamMenu: teamMenuData
 * });
 *
 * // 切换菜单
 * menuService.switchToApp();
 * menuService.switchToOrganization('org-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceMenuService {
  private readonly menuService = inject(MenuService);

  // 菜单数据初始化状态
  private initializedState = signal<boolean>(false);

  // 菜单数据缓存
  private userMenuData: NzSafeAny[] = [];
  private organizationMenuData: NzSafeAny[] = [];
  private teamMenuData: NzSafeAny[] = [];
  private appMenuData: NzSafeAny[] = [];

  // 暴露初始化状态
  readonly initialized = this.initializedState.asReadonly();

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

    // 标记菜单数据已初始化
    this.initializedState.set(true);
  }

  /**
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    // 如果菜单数据未初始化，跳过菜单切换
    if (!this.initializedState()) {
      console.warn('[WorkspaceMenuService] Menu data not initialized, skipping switchToApp');
      return;
    }

    this.menuService.clear();
    this.menuService.add(this.appMenuData);
    this.menuService.resume();
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 当前用户账户 ID（可选，用于替换菜单链接中的 :userId 占位符）
   */
  switchToUser(userId?: string): void {
    // 如果菜单数据未初始化，跳过菜单切换
    if (!this.initializedState()) {
      console.warn('[WorkspaceMenuService] Menu data not initialized, skipping switchToUser');
      return;
    }

    this.menuService.clear();
    // 如果有用户 ID，处理菜单链接中的动态 ID 替换
    const processedMenu = userId ? this.processMenuLinks(this.userMenuData, userId, 'userId') : this.userMenuData;
    this.menuService.add(processedMenu);
    this.menuService.resume();
  }

  /**
   * 切换到组织菜单
   *
   * @param organizationId 组织账户 ID
   */
  switchToOrganization(organizationId: string): void {
    // 如果菜单数据未初始化，跳过菜单切换
    if (!this.initializedState()) {
      console.warn('[WorkspaceMenuService] Menu data not initialized, skipping switchToOrganization');
      return;
    }

    this.menuService.clear();
    // 处理菜单链接中的动态 ID 替换
    const processedMenu = this.processMenuLinks(this.organizationMenuData, organizationId);
    this.menuService.add(processedMenu);
    this.menuService.resume();
  }

  /**
   * 切换到团队菜单
   *
   * @param teamId 团队 ID
   */
  switchToTeam(teamId: string): void {
    // 如果菜单数据未初始化，跳过菜单切换
    if (!this.initializedState()) {
      console.warn('[WorkspaceMenuService] Menu data not initialized, skipping switchToTeam');
      return;
    }

    this.menuService.clear();
    // 处理菜单链接中的动态 ID 替换
    const processedMenu = this.processMenuLinks(this.teamMenuData, teamId);
    this.menuService.add(processedMenu);
    this.menuService.resume();
  }

  /**
   * 获取当前菜单数据
   */
  getCurrentMenuData(): NzSafeAny[] {
    // 注意：此方法无法准确判断当前菜单类型，仅用于调试
    return this.appMenuData;
  }

  /**
   * 处理菜单链接，替换动态 ID 占位符
   *
   * @param menu 菜单数据
   * @param id 要替换的 ID（组织ID、团队ID或用户ID）
   * @param placeholder 占位符名称（默认为 'id'，可以是 'id' 或 'userId'）
   * @returns 处理后的菜单数据
   */
  private processMenuLinks(menu: NzSafeAny[], id: string, placeholder: string = 'id'): NzSafeAny[] {
    if (!id) return menu;

    const placeholderPattern = new RegExp(`:${placeholder}`, 'g');

    return menu.map(item => {
      const processed: NzSafeAny = { ...item };

      // 处理链接中的占位符（:id 或 :userId）
      if (processed.link && typeof processed.link === 'string') {
        processed.link = processed.link.replace(placeholderPattern, id);
        // 同时处理通用的 :id 占位符（向后兼容）
        if (placeholder !== 'id') {
          processed.link = processed.link.replace(/:id/g, id);
        }
      }

      // 递归处理子菜单
      if (processed.children && Array.isArray(processed.children)) {
        processed.children = this.processMenuLinks(processed.children, id, placeholder);
      }

      return processed;
    });
  }
}
