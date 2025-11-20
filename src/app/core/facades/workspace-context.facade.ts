import { computed, effect, inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { WorkspaceContextService, WorkspaceDataService } from '@shared/services/workspace-context';

import { ErrorStateService } from '../services/error-state.service';
import { WorkspaceMenuService } from '../services/workspace-menu.service';

/**
 * Workspace Context Facade
 *
 * 工作区上下文门面（Core 层）
 * 统一对外接口，协调多个 Services
 *
 * 设计原则：
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - 统一管理工作区上下文和菜单切换
 *
 * 核心功能：
 * - 统一管理上下文状态（app/user/organization/team）
 * - 自动加载和缓存用户可访问的组织/团队列表
 * - 提供上下文切换的统一接口
 * - 统一管理菜单切换
 * - 持久化当前上下文到 localStorage
 * - 提供 computed signals 供组件使用
 *
 * @example
 * ```typescript
 * const facade = inject(WorkspaceContextFacade);
 *
 * // 切换上下文
 * await facade.switchToOrganization('org-id');
 * await facade.switchToTeam('team-id');
 *
 * // 订阅上下文状态
 * effect(() => {
 *   console.log('Current context:', facade.contextType());
 *   console.log('Current ID:', facade.contextId());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextFacade {
  private readonly contextService = inject(WorkspaceContextService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly menuService = inject(WorkspaceMenuService);
  private readonly errorStateService = inject(ErrorStateService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // 暴露上下文服务的状态（通过 Facade）
  readonly contextType = this.contextService.contextType;
  readonly contextId = this.contextService.contextId;
  readonly switching = this.contextService.switching;
  readonly contextLabel = this.contextService.contextLabel;
  readonly contextIcon = this.contextService.contextIcon;
  readonly contextAvatar = this.contextService.contextAvatar;
  readonly contextEmail = this.contextService.contextEmail;

  // 暴露数据服务的状态（通过 Facade）
  readonly currentUserAccount = this.dataService.currentUserAccount;
  readonly currentUserAccountId = this.dataService.currentUserAccountId;
  readonly createdOrganizations = this.dataService.createdOrganizations;
  readonly joinedOrganizations = this.dataService.joinedOrganizations;
  readonly loadingOrganizations = this.dataService.loadingOrganizations;
  readonly userTeams = this.dataService.userTeams;
  readonly loadingTeams = this.dataService.loadingTeams;
  readonly error = computed(() => {
    const dataError = this.dataService.error();
    if (dataError) {
      return dataError;
    }
    // 检查 ErrorStateService 中是否有 workspace 相关的错误
    const workspaceErrors = this.errorStateService.errors().filter(e => e.context === 'workspace' && !e.dismissed);
    return workspaceErrors.length > 0 ? workspaceErrors[0].message : null;
  });

  // 暴露上下文服务的 computed signals（通过 Facade）
  readonly allOrganizations = this.contextService.allOrganizations;
  readonly teamsByOrganization = this.contextService.teamsByOrganization;

  // 标记是否已尝试恢复上下文（避免重复恢复）
  private hasRestoredContext = false;

  constructor() {
    // 监听用户登录状态，自动加载工作区数据
    effect(() => {
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        this.loadWorkspaceData(token['user']['id']).catch(error => {
          console.error('Failed to load user workspace:', error);
          this.errorStateService.addError({
            category: 'System',
            severity: 'error',
            message: error instanceof Error ? error.message : 'Failed to load user workspace',
            details: error,
            context: 'workspace'
          });
        });
      } else {
        // 用户未登录，重置状态
        this.reset();
        this.hasRestoredContext = false;
      }
    });

    // 监听上下文切换，同步更新菜单
    effect(() => {
      const contextType = this.contextType();
      const contextId = this.contextId();

      // 如果正在切换中，跳过菜单更新（避免重复更新）
      if (this.switching()) {
        return;
      }

      // 如果菜单数据未初始化，跳过菜单更新
      if (!this.menuService.initialized()) {
        return;
      }

      // 根据上下文类型更新菜单
      switch (contextType) {
        case 'app':
          this.menuService.switchToApp();
          break;
        case 'user':
          // 传递当前用户账户 ID，用于替换菜单链接中的 :userId 占位符
          const userId = this.currentUserAccountId();
          this.menuService.switchToUser(userId || undefined);
          break;
        case 'organization':
          if (contextId) {
            this.menuService.switchToOrganization(contextId);
          }
          break;
        case 'team':
          if (contextId) {
            this.menuService.switchToTeam(contextId);
          }
          break;
      }
    });

    // 监听数据加载完成和菜单初始化，自动恢复上下文
    effect(() => {
      const menuInitialized = this.menuService.initialized();
      const dataLoading = this.loadingOrganizations() || this.loadingTeams();
      const token = this.tokenService.get();
      const hasToken = !!token?.['user']?.['id'];

      // 如果已经恢复过上下文，不再重复恢复
      if (this.hasRestoredContext) {
        return;
      }

      // 条件：菜单已初始化 && 数据加载完成 && 用户已登录
      if (menuInitialized && !dataLoading && hasToken) {
        // 延迟恢复，确保所有状态都已准备好
        setTimeout(() => {
          if (!this.hasRestoredContext) {
            this.hasRestoredContext = true;
            this.restoreContext();
          }
        }, 100);
      }
    });
  }

  /**
   * 初始化菜单数据
   * 在 StartupService 中调用，保存不同账户类型的菜单数据
   * 上下文恢复由 effect 自动处理（等待菜单数据初始化和工作区数据加载完成）
   */
  initializeMenuData(data: { appMenu?: unknown[]; userMenu?: unknown[]; organizationMenu?: unknown[]; teamMenu?: unknown[] }): void {
    this.menuService.initializeMenuData(data);
    // 注意：上下文恢复由 constructor 中的 effect 自动处理
    // 该 effect 会等待菜单数据初始化和工作区数据加载完成后再恢复上下文
  }

  /**
   * 加载用户工作区数据（组织列表和团队列表）
   *
   * @param authUserId 用户的 auth_user_id
   */
  async loadWorkspaceData(authUserId: string): Promise<void> {
    try {
      await this.dataService.loadWorkspaceData(authUserId);
    } catch (error) {
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to load workspace data',
        details: error,
        context: 'workspace'
      });
      throw error;
    }
  }

  /**
   * 处理上下文切换错误
   *
   * @param error 错误对象
   * @param context 上下文类型（用于错误消息）
   */
  private handleSwitchError(error: unknown, context: string): void {
    this.errorStateService.addError({
      category: 'BusinessLogic',
      severity: 'error',
      message: error instanceof Error ? error.message : `Failed to switch to ${context} context`,
      details: error,
      context: 'workspace'
    });
  }

  /**
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    try {
      this.contextService.switchToApp();
    } catch (error) {
      this.handleSwitchError(error, 'app');
    }
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 用户账户 ID（可选，如果不提供则使用当前用户账户）
   */
  switchToUser(userId?: string): void {
    try {
      // 如果不提供 userId，使用当前用户账户 ID
      const targetUserId = userId || this.currentUserAccountId();
      if (!targetUserId) {
        console.warn('Cannot switch to user: no user account ID available');
        return;
      }
      this.contextService.switchToUser(targetUserId);
    } catch (error) {
      this.handleSwitchError(error, 'user');
    }
  }

  /**
   * 切换到组织菜单
   *
   * @param organizationId 组织账户 ID
   */
  switchToOrganization(organizationId: string): void {
    try {
      this.contextService.switchToOrganization(organizationId);
    } catch (error) {
      this.handleSwitchError(error, 'organization');
    }
  }

  /**
   * 切换到团队菜单
   *
   * @param teamId 团队 ID
   */
  switchToTeam(teamId: string): void {
    try {
      this.contextService.switchToTeam(teamId);
    } catch (error) {
      this.handleSwitchError(error, 'team');
    }
  }

  /**
   * 恢复持久化的上下文状态
   */
  restoreContext(): void {
    this.contextService.restoreContext();
  }

  /**
   * 刷新工作区数据（重新加载组织列表和团队列表）
   */
  async refresh(): Promise<void> {
    const token = this.tokenService.get();
    if (token?.['user']?.['id']) {
      await this.loadWorkspaceData(token['user']['id']);
    }
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.contextService.reset();
  }
}
