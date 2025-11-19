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
          const account = this.accountService.userAccounts().find(a => a.id === id);
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
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    // 防止重复切换
    if (this.switchingState()) {
      return;
    }

    // 如果已经是应用菜单，直接返回
    if (this.contextTypeState() === 'app' && this.contextIdState() === null) {
      return;
    }

    this.switchingState.set(true);

    try {
      // 先更新状态，再更新账户
      this.contextTypeState.set('app');
      this.contextIdState.set(null);

      // 同步更新账户和持久化
      this.accountService.selectAccount(null);
      this.persistenceService.saveContext('app', null);
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置切换状态
      setTimeout(() => {
        this.switchingState.set(false);
      }, 0);
    }
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 用户账户 ID（可选，如果不提供则使用当前用户账户）
   */
  switchToUser(userId?: string): void {
    // 防止重复切换
    if (this.switchingState()) {
      return;
    }

    const targetUserId = userId || this.currentUserAccountId();
    if (!targetUserId) {
      console.warn('Cannot switch to user: no user account ID available');
      return;
    }

    // 如果已经是该用户，直接返回
    if (this.contextTypeState() === 'user' && this.contextIdState() === targetUserId) {
      return;
    }

    this.switchingState.set(true);

    try {
      // 先查找账户
      const account = this.accountService.userAccounts().find(a => a.id === targetUserId);
      if (!account) {
        console.warn(`Cannot switch to user: account ${targetUserId} not found`);
        this.switchingState.set(false);
        return;
      }

      // 先更新状态，再更新账户和持久化
      this.contextTypeState.set('user');
      this.contextIdState.set(targetUserId);

      // 同步更新账户和持久化
      this.accountService.selectAccount(account);
      this.persistenceService.saveContext('user', targetUserId);
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置切换状态
      setTimeout(() => {
        this.switchingState.set(false);
      }, 0);
    }
  }

  /**
   * 切换到组织菜单
   *
   * @param organizationId 组织账户 ID
   */
  switchToOrganization(organizationId: string): void {
    // 防止重复切换
    if (this.switchingState()) {
      return;
    }

    // 如果已经是该组织，直接返回
    if (this.contextTypeState() === 'organization' && this.contextIdState() === organizationId) {
      return;
    }

    // 验证组织是否存在
    const organization = this.allOrganizations().find(org => org.id === organizationId);
    if (!organization) {
      console.warn(`Cannot switch to organization: organization ${organizationId} not found`);
      return;
    }

    this.switchingState.set(true);

    try {
      // 先更新状态，再更新账户和持久化
      this.contextTypeState.set('organization');
      this.contextIdState.set(organizationId);

      // 同步更新账户和持久化
      this.accountService.selectAccount(organization);
      this.persistenceService.saveContext('organization', organizationId);
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置切换状态
      setTimeout(() => {
        this.switchingState.set(false);
      }, 0);
    }
  }

  /**
   * 切换到团队菜单
   *
   * @param teamId 团队 ID
   */
  switchToTeam(teamId: string): void {
    // 防止重复切换
    if (this.switchingState()) {
      return;
    }

    // 如果已经是该团队，直接返回
    if (this.contextTypeState() === 'team' && this.contextIdState() === teamId) {
      return;
    }

    // 验证团队是否存在
    const team = this.userTeams().find(t => t.id === teamId);
    if (!team) {
      console.warn(`Cannot switch to team: team ${teamId} not found`);
      return;
    }

    this.switchingState.set(true);

    try {
      // 先更新状态，再更新持久化
      this.contextTypeState.set('team');
      this.contextIdState.set(teamId);

      // 同步更新持久化
      this.persistenceService.saveContext('team', teamId);
      // 注意：Team 不是 Account，所以不需要调用 selectAccount
    } finally {
      // 使用 setTimeout 确保状态更新完成后再重置切换状态
      setTimeout(() => {
        this.switchingState.set(false);
      }, 0);
    }
  }

  /**
   * 恢复持久化的上下文状态
   *
   * @returns 是否成功恢复
   */
  restoreContext(): boolean {
    const saved = this.persistenceService.restoreContext();
    if (saved) {
      // 延迟恢复，等待数据加载完成
      setTimeout(() => {
        switch (saved.type) {
          case 'app':
            this.switchToApp();
            break;
          case 'user':
            if (saved.id) {
              this.switchToUser(saved.id);
            }
            break;
          case 'organization':
            if (saved.id) {
              this.switchToOrganization(saved.id);
            }
            break;
          case 'team':
            if (saved.id) {
              this.switchToTeam(saved.id);
            }
            break;
        }
      }, 100);
      return true;
    }
    return false;
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
