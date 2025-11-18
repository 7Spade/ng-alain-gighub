import { Injectable, inject, signal, computed, effect, Injector } from '@angular/core';
import { Router } from '@angular/router';
import type { Organization } from '@shared';

import { OrganizationService } from './organization.service';

/**
 * Organization Context Service
 *
 * 管理當前選擇的組織上下文，類似 GitHub 的組織切換
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationContextService {
  private readonly organizationService = inject(OrganizationService);
  private readonly injector = inject(Injector);
  private router: Router | null = null;

  private readonly STORAGE_KEY = 'current_organization_id';
  private readonly skipStorageSync = signal(false); // 標記是否跳過 localStorage 同步（初始化時使用）

  // Signals for reactive state management
  readonly currentOrganizationId = signal<string | null>(null);
  readonly currentOrganization = signal<Organization | null>(null);
  readonly isUserView = computed(() => this.currentOrganizationId() === null);

  constructor() {
    // 從 localStorage 恢復（設置標記避免觸發 effect）
    this.skipStorageSync.set(true);
    this.loadFromStorage();
    this.skipStorageSync.set(false);

    // 使用 effect() 處理副作用
    this.setupEffects();
  }

  /**
   * 設置 effect 來處理副作用
   */
  private setupEffects(): void {
    // Effect: 同步 currentOrganizationId 到 localStorage
    effect(() => {
      const orgId = this.currentOrganizationId();
      // 初始化時跳過同步
      if (this.skipStorageSync()) return;

      if (typeof window !== 'undefined') {
        if (orgId) {
          localStorage.setItem(this.STORAGE_KEY, orgId);
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    });

    // Effect: 更新 blueprint 路由
    effect(() => {
      const org = this.currentOrganization();
      // 初始化時可能 Router 尚未準備好，延遲執行
      setTimeout(() => {
        this.updateBlueprintRoute(org);
      }, 0);
    });
  }

  /**
   * 獲取 Router 實例（延遲注入以避免循環依賴）
   */
  private getRouter(): Router | null {
    if (!this.router) {
      try {
        this.router = this.injector.get(Router, null);
      } catch {
        // Router 可能尚未初始化
        return null;
      }
    }
    return this.router;
  }

  /**
   * 更新藍圖路由結構
   */
  private updateBlueprintRoute(org: Organization | null): void {
    const router = this.getRouter();
    if (!router) return;

    const currentUrl = router.url;
    if (!currentUrl.startsWith('/blueprint/')) return;

    // 解析當前路由段
    const segments = currentUrl.split('/').filter(s => s);
    if (segments.length < 2) return; // 至少需要 /blueprint/slug

    // 找到藍圖 slug（最後一個非 tab 的段）
    const tabRoutes = [
      'tasks',
      'issues',
      'progress',
      'report',
      'activity',
      'discussions',
      'documents',
      'charts',
      'quality',
      'weather',
      'settings'
    ];
    let blueprintSlugIndex = segments.length - 1;
    if (tabRoutes.includes(segments[segments.length - 1])) {
      // 如果最後一個是 tab，則藍圖 slug 是倒數第二個
      blueprintSlugIndex = segments.length - 2;
    }

    const blueprintSlug = segments[blueprintSlugIndex];
    const subRoute = segments.length > blueprintSlugIndex + 1 ? segments[segments.length - 1] : null;

    // 構建新的路由
    let newSegments: string[];

    if (org) {
      // 組織視角：/blueprint/org-slug/blueprint-slug
      newSegments = ['/blueprint', org.slug, blueprintSlug];
    } else {
      // 個人視角：/blueprint/blueprint-slug
      newSegments = ['/blueprint', blueprintSlug];
    }

    // 保持當前 tab 狀態（如果有子路由）
    if (subRoute && !newSegments.includes(subRoute) && tabRoutes.includes(subRoute)) {
      newSegments = [...newSegments, subRoute];
    }

    // 導航到新路由（使用 replaceUrl 避免歷史記錄堆積）
    router.navigate(newSegments, { replaceUrl: true });
  }

  /**
   * 從 localStorage 載入
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem(this.STORAGE_KEY);
      if (storedId) {
        // 只設置 ID，不觸發完整載入（避免初始化時的重複操作）
        this.currentOrganizationId.set(storedId);
        // 異步載入組織資料
        this.loadOrganization(storedId);
      }
    }
  }

  /**
   * 載入組織資料（內部方法）
   */
  private async loadOrganization(organizationId: string): Promise<void> {
    const { data: org, error } = await this.organizationService.getOrganizationById(organizationId);

    if (error || !org) {
      console.error('Failed to load organization:', error);
      // 載入失敗時清除狀態
      this.currentOrganizationId.set(null);
      this.currentOrganization.set(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
      return;
    }

    this.currentOrganization.set(org);
  }

  /**
   * 切換到指定組織
   */
  async switchToOrganization(organizationId: string | null): Promise<void> {
    if (organizationId === null) {
      // 切換到個人視角
      this.currentOrganizationId.set(null);
      this.currentOrganization.set(null);
      return;
    }

    // 先設置 ID（觸發 effect 更新 localStorage）
    this.currentOrganizationId.set(organizationId);

    // 載入組織資料
    await this.loadOrganization(organizationId);
  }

  /**
   * 切換回個人視角
   */
  switchToUserView(): void {
    this.switchToOrganization(null);
  }

  /**
   * 刷新當前組織資料
   */
  async refreshCurrentOrganization(): Promise<void> {
    const orgId = this.currentOrganizationId();
    if (orgId) {
      await this.loadOrganization(orgId);
    }
  }

  /**
   * 獲取當前視圖名稱（組織名稱或個人視角）
   */
  getCurrentViewName(): string {
    const org = this.currentOrganization();
    return org ? org.name : '';
  }

  /**
   * 獲取當前視圖頭像（組織頭像或個人頭像）
   */
  getCurrentViewAvatar(): string | null {
    const org = this.currentOrganization();
    return org?.avatar_url ?? null;
  }
}
