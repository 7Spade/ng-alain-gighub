import { Injectable, inject, signal, computed } from '@angular/core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { CacheService } from '@delon/cache';
import { MenuService } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { PERSONAL_MENUS, ORG_MENUS, TEAM_MENUS } from './context-menus';
import type { AppContext } from './context.model';

/**
 * Context Service
 *
 * 全局上下文服務，管理應用的上下文狀態（個人/組織/團隊/應用）
 * 負責協調 Menu、ACL、ReuseTab 等服務的狀態同步
 *
 * 使用 Signals 進行狀態管理，提供響應式的上下文切換
 *
 * @example
 * ```typescript
 * const contextService = inject(ContextService);
 *
 * // 切換到應用菜單
 * contextService.switchToApp();
 *
 * // 切換到個人上下文
 * contextService.switchToUser('user-123');
 *
 * // 切換到組織上下文
 * contextService.switchToOrganization('org-123', '123組織');
 *
 * // 切換到團隊上下文
 * contextService.switchToTeam('team-456', '456團隊');
 *
 * // 訂閱上下文變化
 * effect(() => {
 *   const context = contextService.context();
 *   console.log('Context changed:', context);
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ContextService {
  private readonly CACHE_KEY = 'app-context';

  // 注入服務
  private cache = inject(CacheService);
  private menuService = inject(MenuService);
  private acl = inject(ACLService);
  private reuse = inject(ReuseTabService);

  // 使用 Signal 管理上下文狀態
  private _context = signal<AppContext>({
    type: 'personal'
  });

  // 暴露 ReadonlySignal 給組件
  readonly context = this._context.asReadonly();

  // Computed signals
  readonly contextType = computed(() => this._context().type);
  readonly contextId = computed(() => this._context().id);
  readonly contextName = computed(() => this._context().name);
  readonly isPersonal = computed(() => this._context().type === 'personal');
  readonly isOrganization = computed(() => this._context().type === 'organization');
  readonly isTeam = computed(() => this._context().type === 'team');
  readonly isApp = computed(() => this._context().type === 'app');

  // 菜單資料快取
  private appMenuData: NzSafeAny[] = [];
  private personalMenuData: NzSafeAny[] = [];
  private organizationMenuData: NzSafeAny[] = [];
  private teamMenuData: NzSafeAny[] = [];

  constructor() {
    // Init: load from cache
    const cached = this.cache.getNone(this.CACHE_KEY) as AppContext | null;
    if (cached) {
      this._context.set(cached);
      this.applyContext(cached);
    }
  }

  /**
   * 獲取當前上下文快照
   */
  get snapshot(): AppContext {
    return this._context();
  }

  /**
   * 初始化菜單資料
   * 由 StartupService 調用
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
      this.personalMenuData = data.userMenu;
    }
    if (data.organizationMenu) {
      this.organizationMenuData = data.organizationMenu;
    }
    if (data.teamMenu) {
      this.teamMenuData = data.teamMenu;
    }
  }

  /**
   * 切換上下文（核心方法）
   *
   * @param ctx 上下文配置
   */
  setContext(ctx: AppContext): void {
    this._context.set(ctx);

    // Cache 持久化
    this.cache.set(this.CACHE_KEY, ctx);

    // 套用到 UI 系統
    this.applyContext(ctx);
  }

  /**
   * 切換到應用菜單
   */
  switchToApp(): void {
    this.setContext({
      type: 'app',
      name: '應用菜單'
    });
  }

  /**
   * 切換到個人用戶上下文
   */
  switchToUser(userId?: string): void {
    this.setContext({
      type: 'personal',
      id: userId,
      name: '個人'
    });
  }

  /**
   * 切換到組織上下文
   */
  switchToOrganization(id: string, name?: string): void {
    this.setContext({
      type: 'organization',
      id,
      name: name || '組織'
    });
  }

  /**
   * 切換到團隊上下文
   */
  switchToTeam(id: string, name?: string, organizationId?: string): void {
    this.setContext({
      type: 'team',
      id,
      name: name || '團隊',
      data: {
        organizationId
      }
    });
  }

  /**
   * 套用上下文設定（私有方法）
   *
   * 根據上下文類型動態更新：
   * 1. 左側選單（MenuService）
   * 2. 權限控制（ACLService）
   * 3. 路由快取（ReuseTabService）
   */
  private applyContext(ctx: AppContext): void {
    // 1. 動態更新左側選單
    this.updateMenu(ctx);

    // 2. 動態切換 ACL 權限
    this.applyACL(ctx);

    // 3. 切換上下文時清除 ReuseTab 路由快取
    this.reuse.clear();
  }

  /**
   * 更新選單
   */
  private updateMenu(ctx: AppContext): void {
    this.menuService.clear();

    switch (ctx.type) {
      case 'app':
        if (this.appMenuData.length > 0) {
          this.menuService.add(this.appMenuData);
        }
        break;

      case 'personal':
        if (this.personalMenuData.length > 0) {
          this.menuService.add(this.personalMenuData);
        } else {
          this.menuService.add(PERSONAL_MENUS);
        }
        break;

      case 'organization':
        if (this.organizationMenuData.length > 0) {
          // 處理菜單連結中的動態 ID 替換
          const processedMenu = this.processMenuLinks(this.organizationMenuData, ctx.id || '');
          this.menuService.add(processedMenu);
        } else {
          this.menuService.add(ORG_MENUS);
        }
        break;

      case 'team':
        if (this.teamMenuData.length > 0) {
          // 處理菜單連結中的動態 ID 替換
          const processedMenu = this.processMenuLinks(this.teamMenuData, ctx.id || '');
          this.menuService.add(processedMenu);
        } else {
          this.menuService.add(TEAM_MENUS);
        }
        break;
    }

    this.menuService.resume();
  }

  /**
   * 處理菜單連結，替換動態 ID 佔位符
   *
   * @param menu 菜單資料
   * @param id 要替換的 ID（組織ID或團隊ID）
   * @returns 處理後的菜單資料
   */
  private processMenuLinks(menu: NzSafeAny[], id: string): NzSafeAny[] {
    if (!id) return menu;

    return menu.map(item => {
      const processed: NzSafeAny = { ...item };

      // 處理連結中的 :id 佔位符
      if (processed.link && typeof processed.link === 'string') {
        processed.link = processed.link.replace(/:id/g, id);
      }

      // 遞迴處理子選單
      if (processed.children && Array.isArray(processed.children)) {
        processed.children = this.processMenuLinks(processed.children, id);
      }

      return processed;
    });
  }

  /**
   * 動態套用權限（依 context）
   */
  private applyACL(ctx: AppContext): void {
    switch (ctx.type) {
      case 'app':
      case 'personal':
        // 應用模式和個人模式：全權限（開發階段）
        // TODO: 實際生產環境應該根據用戶角色設定權限
        this.acl.setFull(true);
        break;

      case 'organization':
        // 組織模式：設定為組織管理員角色
        // TODO: 應該根據用戶在該組織的實際角色動態設定
        this.acl.setRole(['org-admin']);
        break;

      case 'team':
        // 團隊模式：設定為團隊成員角色
        // TODO: 應該根據用戶在該團隊的實際角色動態設定
        this.acl.setRole(['team-member']);
        break;
    }
  }

  /**
   * 獲取當前菜單資料
   */
  getCurrentMenuData(): NzSafeAny[] {
    switch (this.contextType()) {
      case 'app':
        return this.appMenuData;
      case 'personal':
        return this.personalMenuData;
      case 'organization':
        return this.organizationMenuData;
      case 'team':
        return this.teamMenuData;
      default:
        return this.appMenuData;
    }
  }

  /**
   * 清除上下文（回到個人模式）
   */
  clear(): void {
    this.switchToUser();
  }
}
