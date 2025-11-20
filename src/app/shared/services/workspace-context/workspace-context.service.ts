import { Injectable, computed, inject, signal } from '@angular/core';
import { Account, AccountService } from '@shared';

import { WorkspaceDataService } from './workspace-data.service';
import { WorkspacePersistenceService } from './workspace-persistence.service';

/**
 * Workspace Context Service
 *
 * 工作区上下文状态管理服务（Shared 层）
 * 负责上下文状态管理和切换逻辑
 *
 * 职责：
 * - 管理上下文状态（contextType, contextId）
 * - 提供上下文切换方法
 * - 状态验证和同步
 * - 与 AccountService 协调工作
 *
 * @example
 * ```typescript
 * const contextService = inject(WorkspaceContextService);
 *
 * // 切换上下文
 * contextService.switchToOrganization('org-id');
 *
 * // 获取状态
 * const type = contextService.contextType();
 * const id = contextService.contextId();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly accountService = inject(AccountService);
  private readonly dataService = inject(WorkspaceDataService);
  private readonly persistenceService = inject(WorkspacePersistenceService);

  // 上下文类型状态
  private contextTypeState = signal<'app' | 'user' | 'organization' | 'team'>('app');
  private contextIdState = signal<string | null>(null);

  // 切换中状态（防止重复切换）
  private switchingState = signal<boolean>(false);

  // 暴露只读信号
  readonly contextType = this.contextTypeState.asReadonly();
  readonly contextId = this.contextIdState.asReadonly();
  readonly switching = this.switchingState.asReadonly();

  // 暴露数据服务的信号（代理）
  readonly currentUserAccount = this.dataService.currentUserAccount;
  readonly currentUserAccountId = this.dataService.currentUserAccountId;
  readonly createdOrganizations = this.dataService.createdOrganizations;
  readonly joinedOrganizations = this.dataService.joinedOrganizations;
  readonly loadingOrganizations = this.dataService.loadingOrganizations;
  readonly userTeams = this.dataService.userTeams;
  readonly loadingTeams = this.dataService.loadingTeams;
  readonly error = this.dataService.error;

  // Computed signals
  /**
   * 合并所有组织（创建+加入，去重）
   */
  readonly allOrganizations = computed(() => {
    const all = [...this.createdOrganizations(), ...this.joinedOrganizations()];
    // 根据 ID 去重
    const uniqueMap = new Map<string, Account>();
    all.forEach(org => {
      if (!uniqueMap.has(org.id)) {
        uniqueMap.set(org.id, org);
      }
    });
    return Array.from(uniqueMap.values());
  });

  /**
   * 按组织分组的团队列表
   */
  readonly teamsByOrganization = computed(() => {
    const teams = this.userTeams();
    const orgs = this.allOrganizations();
    const teamsMap = new Map<string, Array<(typeof teams)[0]>>();

    // 初始化所有组织的团队列表
    orgs.forEach(org => {
      teamsMap.set(org.id, []);
    });

    // 按组织分组团队
    teams.forEach(team => {
      // BaseRepository 会将 snake_case 转换为 camelCase，所以应该是 organizationId
      // 但为了兼容性，同时检查两种格式
      const orgId = (team as any).organizationId || (team as any).organization_id;
      if (orgId && teamsMap.has(orgId)) {
        teamsMap.get(orgId)!.push(team);
      } else if (orgId) {
        // 如果团队的组织 ID 不在当前组织的列表中，也记录一下（用于调试）
        console.warn(
          `[WorkspaceContextService] Team "${(team as any).name || team.id}" has organizationId "${orgId}" but it's not in the user's organizations list`,
          {
            teamId: team.id,
            teamName: (team as any).name,
            organizationId: orgId,
            availableOrgIds: Array.from(teamsMap.keys())
          }
        );
      } else {
        // 如果团队没有 organizationId，记录警告
        console.warn(`[WorkspaceContextService] Team "${(team as any).name || team.id}" has no organizationId field`, team);
      }
    });

    return teamsMap;
  });

  /**
   * 当前上下文标签（用于显示）
   */
  readonly contextLabel = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    switch (type) {
      case 'user':
        if (id) {
          const account = this.findUserAccount(id);
          return account?.name || '个人账户';
        }
        return '个人账户';
      case 'organization':
        if (id) {
          const account = this.allOrganizations().find(a => a.id === id);
          return account?.name || '组织账户';
        }
        return '组织账户';
      case 'team':
        if (id) {
          const team = this.userTeams().find(t => t.id === id);
          return team?.name || '团队';
        }
        return '团队';
      default:
        return '应用菜单';
    }
  });

  /**
   * 当前上下文图标（用于显示）
   */
  readonly contextIcon = computed(() => {
    const type = this.contextType();
    switch (type) {
      case 'user':
        return 'user';
      case 'organization':
        return 'team';
      case 'team':
        return 'usergroup-add';
      default:
        return 'appstore';
    }
  });

  /**
   * 当前上下文头像（用于显示）
   */
  readonly contextAvatar = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    switch (type) {
      case 'user':
        if (id) {
          const account = this.findUserAccount(id);
          if (account) {
            return (account as any).avatarUrl || (account as any).avatar_url || null;
          }
        }
        // 如果没有找到，返回当前用户账户的头像
        const currentAccount = this.currentUserAccount();
        if (currentAccount) {
          return (currentAccount as any).avatarUrl || (currentAccount as any).avatar_url || null;
        }
        return null;
      case 'organization':
        if (id) {
          const account = this.allOrganizations().find(a => a.id === id);
          if (account) {
            return (account as any).avatarUrl || (account as any).avatar_url || null;
          }
        }
        return null;
      case 'team':
        if (id) {
          const team = this.userTeams().find(t => t.id === id);
          if (team) {
            return (team as any).avatarUrl || (team as any).avatar_url || null;
          }
        }
        return null;
      default:
        return null;
    }
  });

  /**
   * 当前上下文邮箱（用于显示）
   */
  readonly contextEmail = computed(() => {
    const type = this.contextType();
    const id = this.contextId();

    switch (type) {
      case 'user':
        if (id) {
          const account = this.findUserAccount(id);
          return account?.email || null;
        }
        // 如果没有找到，返回当前用户账户的邮箱
        return this.currentUserAccount()?.email || null;
      case 'organization':
        if (id) {
          const account = this.allOrganizations().find(a => a.id === id);
          return account?.email || null;
        }
        return null;
      case 'team':
        return null;
      default:
        return null;
    }
  });

  /**
   * 查找用户账户（优先使用 currentUserAccount，否则从 userAccounts 中查找）
   *
   * @param userId 用户账户 ID
   * @returns 用户账户，如果不存在则返回 null
   */
  private findUserAccount(userId: string): Account | null {
    const currentAccount = this.currentUserAccount();
    if (currentAccount && currentAccount.id === userId) {
      return currentAccount;
    }
    return this.accountService.userAccounts().find(a => a.id === userId) || null;
  }

  /**
   * 统一切换上下文的方法
   *
   * @param type 上下文类型
   * @param id 上下文 ID（可选）
   * @param account 账户对象（可选，用于 user 和 organization 类型）
   */
  private switchContext(type: 'app' | 'user' | 'organization' | 'team', id: string | null, account: Account | null): void {
    // 防止重复切换
    if (this.switchingState()) {
      return;
    }

    // 如果已经是目标上下文，直接返回
    if (this.contextTypeState() === type && this.contextIdState() === id) {
      return;
    }

    this.switchingState.set(true);

    try {
      // 更新状态
      this.contextTypeState.set(type);
      this.contextIdState.set(id);

      // 更新账户（仅 user 和 organization 类型需要）
      if (account && (type === 'user' || type === 'organization')) {
        this.accountService.selectAccount(account);
      } else if (type === 'app') {
        this.accountService.selectAccount(null);
      }
      // team 类型不需要更新账户

      // 持久化上下文
      this.persistenceService.saveContext(type, id);
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置切换状态
      setTimeout(() => {
        this.switchingState.set(false);
      }, 0);
    }
  }

  /**
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    this.switchContext('app', null, null);
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 用户账户 ID（必需）
   */
  switchToUser(userId: string): void {
    if (!userId) {
      console.warn('Cannot switch to user: user account ID is required');
      return;
    }

    const account = this.findUserAccount(userId);
    if (!account) {
      console.warn(`Cannot switch to user: account ${userId} not found`);
      return;
    }

    this.switchContext('user', userId, account);
  }

  /**
   * 切换到组织菜单
   *
   * @param organizationId 组织账户 ID
   */
  switchToOrganization(organizationId: string): void {
    const organization = this.allOrganizations().find(org => org.id === organizationId);
    if (!organization) {
      console.warn(`Cannot switch to organization: organization ${organizationId} not found`);
      return;
    }

    this.switchContext('organization', organizationId, organization);
  }

  /**
   * 切换到团队菜单
   *
   * @param teamId 团队 ID
   */
  switchToTeam(teamId: string): void {
    const team = this.userTeams().find(t => t.id === teamId);
    if (!team) {
      console.warn(`Cannot switch to team: team ${teamId} not found`);
      return;
    }

    // Team 不是 Account，所以不需要传递 account 参数
    this.switchContext('team', teamId, null);
  }

  /**
   * 恢复持久化的上下文状态
   * 注意：此方法应该在数据加载完成后调用，否则可能因为数据未加载而切换失败
   *
   * 如果没有保存的上下文，默认切换到用户上下文（如果用户已登录）
   *
   * @returns 是否成功恢复
   */
  restoreContext(): boolean {
    const saved = this.persistenceService.restoreContext();
    if (saved) {
      // 立即恢复，因为调用此方法时数据应该已经加载完成
      switch (saved.type) {
        case 'app':
          this.switchToApp();
          break;
        case 'user':
          if (saved.id) {
            this.tryRestoreUserContext(saved.id);
          }
          break;
        case 'organization':
          if (saved.id) {
            this.tryRestoreOrganizationContext(saved.id);
          }
          break;
        case 'team':
          if (saved.id) {
            this.tryRestoreTeamContext(saved.id);
          }
          break;
      }
      return true;
    }

    // 如果没有保存的上下文，默认切换到用户上下文（如果用户已登录）
    const userId = this.currentUserAccountId();
    if (userId) {
      this.switchToUser(userId);
      return true;
    }

    // 如果用户未登录，保持 app 上下文
    return false;
  }

  /**
   * 尝试恢复用户上下文（带重试逻辑）
   *
   * @param userId 用户账户 ID
   */
  private tryRestoreUserContext(userId: string): void {
    const account = this.findUserAccount(userId);
    if (account) {
      this.switchToUser(userId);
    } else {
      console.warn(`Cannot restore user context: account ${userId} not found, data may not be loaded yet`);
      // 延迟重试一次
      setTimeout(() => {
        const retryAccount = this.findUserAccount(userId);
        if (retryAccount) {
          this.switchToUser(userId);
        } else {
          console.warn(`Failed to restore user context after retry: account ${userId} not found`);
        }
      }, 500);
    }
  }

  /**
   * 尝试恢复组织上下文（带重试逻辑）
   *
   * @param orgId 组织账户 ID
   */
  private tryRestoreOrganizationContext(orgId: string): void {
    const organization = this.allOrganizations().find(org => org.id === orgId);
    if (organization) {
      this.switchToOrganization(orgId);
    } else {
      console.warn(`Cannot restore organization context: organization ${orgId} not found, data may not be loaded yet`);
      // 延迟重试一次
      setTimeout(() => {
        const retryOrg = this.allOrganizations().find(org => org.id === orgId);
        if (retryOrg) {
          this.switchToOrganization(orgId);
        } else {
          console.warn(`Failed to restore organization context after retry: organization ${orgId} not found`);
        }
      }, 500);
    }
  }

  /**
   * 尝试恢复团队上下文（带重试逻辑）
   *
   * @param teamId 团队 ID
   */
  private tryRestoreTeamContext(teamId: string): void {
    const team = this.userTeams().find(t => t.id === teamId);
    if (team) {
      this.switchToTeam(teamId);
    } else {
      console.warn(`Cannot restore team context: team ${teamId} not found, data may not be loaded yet`);
      // 延迟重试一次
      setTimeout(() => {
        const retryTeam = this.userTeams().find(t => t.id === teamId);
        if (retryTeam) {
          this.switchToTeam(teamId);
        } else {
          console.warn(`Failed to restore team context after retry: team ${teamId} not found`);
        }
      }, 500);
    }
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.contextTypeState.set('app');
    this.contextIdState.set(null);
    this.dataService.reset();
    this.persistenceService.clearContext();
  }
}
