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

      // 根据上下文类型更新菜单
      switch (contextType) {
        case 'app':
          this.menuService.switchToApp();
          break;
        case 'user':
          this.menuService.switchToUser();
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

    // 恢复持久化的上下文状态
    this.restoreContext();
  }

  /**
   * 初始化菜单数据
   * 在 StartupService 中调用，保存不同账户类型的菜单数据
   */
  initializeMenuData(data: { appMenu?: unknown[]; userMenu?: unknown[]; organizationMenu?: unknown[]; teamMenu?: unknown[] }): void {
    this.menuService.initializeMenuData(data);
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
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    try {
      this.contextService.switchToApp();
    } catch (error) {
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to switch to app context',
        details: error,
        context: 'workspace'
      });
    }
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 用户账户 ID（可选，如果不提供则使用当前用户账户）
   */
  switchToUser(userId?: string): void {
    try {
      this.contextService.switchToUser(userId);
    } catch (error) {
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to switch to user context',
        details: error,
        context: 'workspace'
      });
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
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to switch to organization context',
        details: error,
        context: 'workspace'
      });
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
      this.errorStateService.addError({
        category: 'BusinessLogic',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to switch to team context',
        details: error,
        context: 'workspace'
      });
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
