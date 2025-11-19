import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { CacheService } from '@delon/cache';
import { MenuService } from '@delon/theme';
import { Account, AccountType, BlueprintBranch } from '@shared';

import { BranchContextService } from './branch-context.service';
import { MenuContextService } from '../menu-context/menu-context.service';

/**
 * 工作空間上下文類型
 */
export type WorkspaceContextType = 'app' | 'user' | 'organization' | 'team';

/**
 * 工作空間上下文狀態
 */
export interface WorkspaceContextState {
  /** 上下文類型 */
  type: WorkspaceContextType;
  /** 上下文 ID（app 類型時為 null） */
  id: string | null;
  /** 組織 ID（僅 organization 和 team 類型有值） */
  organizationId: string | null;
  /** 團隊 ID（僅 team 類型有值） */
  teamId: string | null;
  /** 當前分支（可選） */
  branch: BlueprintBranch | null;
}

/**
 * Workspace Context Service
 *
 * 全局工作空間上下文管理服務
 * - 整合多組織、多團隊、多分支的切換功能
 * - 自動同步 MenuService、ACLService、ReuseTabService、CacheService
 * - 使用 CacheService 持久化上下文狀態，支援頁面重載後恢復
 *
 * @example
 * ```typescript
 * const workspaceContext = inject(WorkspaceContextService);
 *
 * // 切換到組織上下文
 * await workspaceContext.switchToOrganization(orgId);
 *
 * // 切換到團隊上下文
 * await workspaceContext.switchToTeam(teamId, orgId);
 *
 * // 獲取當前上下文
 * const context = workspaceContext.currentContext();
 *
 * // 檢查當前是否在組織上下文
 * const isOrg = workspaceContext.isOrganizationContext();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly menuService = inject(MenuService);
  private readonly menuContextService = inject(MenuContextService);
  private readonly branchContextService = inject(BranchContextService);
  private readonly aclService = inject(ACLService);
  private readonly cacheService = inject(CacheService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly router = inject(Router);

  // 快取鍵
  private readonly CACHE_KEY = 'workspace_context';
  private readonly CACHE_TTL = 7 * 24 * 60 * 60; // 7 天（秒）

  // 當前工作空間上下文狀態
  private readonly contextState = signal<WorkspaceContextState>({
    type: 'app',
    id: null,
    organizationId: null,
    teamId: null,
    branch: null
  });

  // 暴露只讀信號
  readonly currentContext = this.contextState.asReadonly();

  // Computed signals - 方便組件使用
  readonly contextType = computed(() => this.contextState().type);
  readonly contextId = computed(() => this.contextState().id);
  readonly organizationId = computed(() => this.contextState().organizationId);
  readonly teamId = computed(() => this.contextState().teamId);
  readonly currentBranch = computed(() => this.contextState().branch);

  // 上下文類型檢查
  readonly isAppContext = computed(() => this.contextType() === 'app');
  readonly isUserContext = computed(() => this.contextType() === 'user');
  readonly isOrganizationContext = computed(() => this.contextType() === 'organization');
  readonly isTeamContext = computed(() => this.contextType() === 'team');
  readonly hasOrganizationContext = computed(() => this.organizationId() !== null);
  readonly hasTeamContext = computed(() => this.teamId() !== null);

  constructor() {
    // 監聽上下文變化，自動持久化到 Cache
    effect(
      () => {
        const context = this.contextState();
        this.persistContext(context);
      },
      { allowSignalWrites: true }
    );

    // 監聽分支上下文變化，自動同步到工作空間上下文
    effect(
      () => {
        const branch = this.branchContextService.currentBranch();
        if (branch !== this.contextState().branch) {
          this.contextState.update(state => ({
            ...state,
            branch
          }));
        }
      },
      { allowSignalWrites: true }
    );
  }

  /**
   * 初始化工作空間上下文
   * 從 Cache 恢復上次的上下文狀態（如果存在）
   */
  async initialize(): Promise<void> {
    try {
      const cached = this.cacheService.getNone<WorkspaceContextState>(this.CACHE_KEY);
      if (cached) {
        // 恢復上下文狀態（但不立即執行切換，等待 UI 組件觸發）
        this.contextState.set(cached);
        console.log('[WorkspaceContextService] Restored context from cache:', cached);
      }
    } catch (error) {
      console.warn('[WorkspaceContextService] Failed to restore context from cache:', error);
    }
  }

  /**
   * 切換到應用菜單（默認菜單）
   */
  switchToApp(): void {
    this.updateContext({
      type: 'app',
      id: null,
      organizationId: null,
      teamId: null,
      branch: null
    });

    // 同步到 MenuContextService
    this.menuContextService.switchToApp();

    // 清除分支上下文
    this.branchContextService.clearCurrentBranch();

    // 清除頁籤快取
    this.clearReuseTabCache();
  }

  /**
   * 切換到個人用戶菜單
   */
  switchToUser(userId: string, clearTabs = true): void {
    this.updateContext({
      type: 'user',
      id: userId,
      organizationId: null,
      teamId: null,
      branch: null
    });

    // 同步到 MenuContextService
    this.menuContextService.switchToUser(userId);

    // 清除分支上下文
    this.branchContextService.clearCurrentBranch();

    // 清除頁籤快取
    if (clearTabs) {
      this.clearReuseTabCache();
    }
  }

  /**
   * 切換到組織菜單
   */
  switchToOrganization(organizationId: string, clearTabs = true): void {
    this.updateContext({
      type: 'organization',
      id: organizationId,
      organizationId,
      teamId: null,
      branch: null
    });

    // 同步到 MenuContextService
    this.menuContextService.switchToOrganization(organizationId);

    // 清除分支上下文
    this.branchContextService.clearCurrentBranch();

    // 清除頁籤快取
    if (clearTabs) {
      this.clearReuseTabCache();
    }
  }

  /**
   * 切換到團隊菜單
   */
  switchToTeam(teamId: string, organizationId: string, clearTabs = true): void {
    this.updateContext({
      type: 'team',
      id: teamId,
      organizationId,
      teamId,
      branch: null
    });

    // 同步到 MenuContextService
    this.menuContextService.switchToTeam(teamId);

    // 清除分支上下文
    this.branchContextService.clearCurrentBranch();

    // 清除頁籤快取
    if (clearTabs) {
      this.clearReuseTabCache();
    }
  }

  /**
   * 根據 Account 對象自動切換上下文
   */
  switchByAccount(account: Account, clearTabs = true): void {
    const accountType = account.type as AccountType;
    switch (accountType) {
      case AccountType.USER:
        this.switchToUser(account.id, clearTabs);
        break;
      case AccountType.ORGANIZATION:
        this.switchToOrganization(account.id, clearTabs);
        break;
      default:
        // Bot 或其他類型，使用應用菜單
        this.switchToApp();
        break;
    }
  }

  /**
   * 設置當前分支（不改變組織/團隊上下文）
   */
  setCurrentBranch(branch: BlueprintBranch | null): void {
    // 更新分支上下文
    this.branchContextService.setCurrentBranch(branch);

    // 更新工作空間上下文狀態
    this.contextState.update(state => ({
      ...state,
      branch
    }));
  }

  /**
   * 根據分支 ID 設置當前分支
   */
  async setCurrentBranchById(branchId: string | null): Promise<void> {
    await this.branchContextService.setCurrentBranchById(branchId);

    // 更新工作空間上下文狀態
    const branch = this.branchContextService.currentBranch();
    this.contextState.update(state => ({
      ...state,
      branch
    }));
  }

  /**
   * 清除當前分支（切換到主分支）
   */
  clearCurrentBranch(): void {
    this.branchContextService.clearCurrentBranch();

    // 更新工作空間上下文狀態
    this.contextState.update(state => ({
      ...state,
      branch: null
    }));
  }

  /**
   * 同步權限（從 ACLService）
   * 通常在切換組織/團隊時調用
   */
  async syncPermissions(roles: string[] | string): Promise<void> {
    try {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      this.aclService.setRole(roleArray);
    } catch (error) {
      console.error('[WorkspaceContextService] Failed to sync permissions:', error);
    }
  }

  /**
   * 清除所有權限（切換到全量權限）
   */
  clearPermissions(): void {
    this.aclService.setFull(true);
  }

  /**
   * 獲取當前上下文的顯示名稱
   */
  getContextDisplayName(accounts?: Map<string, Account>): string {
    const context = this.contextState();
    switch (context.type) {
      case 'user':
        if (context.id && accounts) {
          const account = accounts.get(context.id);
          return account?.name || '個人賬戶';
        }
        return '個人賬戶';
      case 'organization':
        if (context.id && accounts) {
          const account = accounts.get(context.id);
          return account?.name || '組織賬戶';
        }
        return '組織賬戶';
      case 'team':
        // 團隊名稱需要從 Team 資料獲取
        return '團隊';
      default:
        return '應用菜單';
    }
  }

  /**
   * 檢查當前上下文是否匹配指定條件
   */
  isCurrentContext(type: WorkspaceContextType, id?: string): boolean {
    const context = this.contextState();
    if (context.type !== type) {
      return false;
    }
    if (id !== undefined && context.id !== id) {
      return false;
    }
    return true;
  }

  /**
   * 更新上下文狀態
   */
  private updateContext(newContext: WorkspaceContextState): void {
    this.contextState.set(newContext);
  }

  /**
   * 持久化上下文到 Cache
   */
  private persistContext(context: WorkspaceContextState): void {
    try {
      // 使用 CacheService 持久化上下文（7 天 TTL）
      this.cacheService.set(this.CACHE_KEY, context, { type: 's', expire: this.CACHE_TTL });
    } catch (error) {
      console.warn('[WorkspaceContextService] Failed to persist context:', error);
    }
  }

  /**
   * 清除 ReuseTabService 頁籤快取
   */
  private clearReuseTabCache(): void {
    try {
      this.reuseTabService?.clear();
    } catch (error) {
      console.warn('[WorkspaceContextService] Failed to clear reuse tab cache:', error);
    }
  }

  /**
   * 清除持久化的上下文
   */
  clearPersistedContext(): void {
    try {
      this.cacheService.remove(this.CACHE_KEY);
    } catch (error) {
      console.warn('[WorkspaceContextService] Failed to clear persisted context:', error);
    }
  }

  /**
   * 重置上下文到默認狀態
   */
  reset(): void {
    this.switchToApp();
    this.clearPersistedContext();
  }
}
