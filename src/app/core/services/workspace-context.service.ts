import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { Account, AccountService, Team, TeamService } from '@shared';

import { MenuContextService } from '../menu-context/menu-context.service';

/**
 * Workspace Context Service
 *
 * 全局工作区上下文管理器，统一管理用户、组织、团队的上下文切换
 * 提供 Workspace Context Manager 级别的功能，支持多组织、多团队切换
 *
 * 核心功能：
 * 1. 统一管理上下文状态（app/user/organization/team）
 * 2. 自动加载和缓存用户可访问的组织/团队列表
 * 3. 提供上下文切换的统一接口
 * 4. 与 MenuContextService 和 AccountService 协调工作
 * 5. 持久化当前上下文到 localStorage
 * 6. 提供 computed signals 供组件使用
 *
 * @example
 * ```typescript
 * const workspaceContext = inject(WorkspaceContextService);
 *
 * // 切换上下文
 * await workspaceContext.switchToOrganization(orgId);
 * await workspaceContext.switchToTeam(teamId);
 *
 * // 订阅上下文状态
 * effect(() => {
 *   console.log('Current context:', workspaceContext.contextType());
 *   console.log('Current ID:', workspaceContext.contextId());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly accountService = inject(AccountService);
  private readonly teamService = inject(TeamService);
  private readonly menuContextService = inject(MenuContextService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  // 上下文类型状态
  private contextTypeState = signal<'app' | 'user' | 'organization' | 'team'>('app');
  private contextIdState = signal<string | null>(null);

  // 用户账户信息
  private currentUserAccountState = signal<Account | null>(null);
  private currentUserAccountIdState = signal<string | null>(null);

  // 组织列表状态
  private createdOrganizationsState = signal<Account[]>([]);
  private joinedOrganizationsState = signal<Account[]>([]);
  private loadingOrganizationsState = signal<boolean>(false);

  // 团队列表状态
  private userTeamsState = signal<Team[]>([]);
  private loadingTeamsState = signal<boolean>(false);

  // 错误状态
  private errorState = signal<string | null>(null);

  // 暴露只读信号
  readonly contextType = this.contextTypeState.asReadonly();
  readonly contextId = this.contextIdState.asReadonly();
  readonly currentUserAccount = this.currentUserAccountState.asReadonly();
  readonly currentUserAccountId = this.currentUserAccountIdState.asReadonly();
  readonly createdOrganizations = this.createdOrganizationsState.asReadonly();
  readonly joinedOrganizations = this.joinedOrganizationsState.asReadonly();
  readonly loadingOrganizations = this.loadingOrganizationsState.asReadonly();
  readonly userTeams = this.userTeamsState.asReadonly();
  readonly loadingTeams = this.loadingTeamsState.asReadonly();
  readonly error = this.errorState.asReadonly();

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
    const teamsMap = new Map<string, Team[]>();

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

  constructor() {
    // 监听用户登录状态，自动加载工作区数据
    effect(() => {
      const token = this.tokenService.get();
      if (token?.['user']?.['id']) {
        this.loadUserWorkspace(token['user']['id']).catch(error => {
          console.error('Failed to load user workspace:', error);
        });
      } else {
        // 用户未登录，重置状态
        this.reset();
      }
    });

    // 持久化上下文状态到 localStorage
    effect(() => {
      const contextType = this.contextType();
      const contextId = this.contextId();
      try {
        localStorage.setItem('workspace.contextType', contextType);
        if (contextId) {
          localStorage.setItem('workspace.contextId', contextId);
        } else {
          localStorage.removeItem('workspace.contextId');
        }
      } catch (error) {
        console.warn('Failed to persist workspace context to localStorage:', error);
      }
    });

    // 恢复持久化的上下文状态
    this.restoreContext();
  }

  /**
   * 加载用户工作区数据（组织列表和团队列表）
   *
   * @param authUserId 用户的 auth_user_id
   */
  async loadUserWorkspace(authUserId: string): Promise<void> {
    this.loadingOrganizationsState.set(true);
    this.loadingTeamsState.set(true);
    this.errorState.set(null);

    try {
      // 1. 获取用户账户信息
      const userAccount = await this.accountService.findByAuthUserId(authUserId);
      if (!userAccount) {
        this.loadingOrganizationsState.set(false);
        this.loadingTeamsState.set(false);
        return;
      }

      // 2. 并行加载创建的组织、加入的组织
      const [createdOrgs, joinedOrgs] = await Promise.all([
        this.accountService.getUserCreatedOrganizations(authUserId),
        this.accountService.getUserJoinedOrganizations(userAccount.id)
      ]);

      // 3. 加载团队列表（用户作为成员的团队）
      const memberTeams = await this.accountService.getUserTeams(userAccount.id);

      // 4. 加载用户创建的组织下的所有团队（即使不是成员）
      const allOrgIds = [...createdOrgs, ...joinedOrgs].map(org => org.id);
      const orgTeamsPromises = allOrgIds.map(orgId => this.teamService.loadTeamsByOrganizationId(orgId).catch(() => [] as Team[]));
      const orgTeamsArrays = await Promise.all(orgTeamsPromises);
      const orgTeams = orgTeamsArrays.flat();

      // 5. 合并团队列表（去重）
      const allTeamsMap = new Map<string, Team>();
      [...memberTeams, ...orgTeams].forEach(team => {
        if (!allTeamsMap.has(team.id)) {
          allTeamsMap.set(team.id, team);
        }
      });
      const teams = Array.from(allTeamsMap.values());

      this.createdOrganizationsState.set(createdOrgs);
      this.joinedOrganizationsState.set(joinedOrgs);
      this.userTeamsState.set(teams);
      this.currentUserAccountState.set(userAccount);
      this.currentUserAccountIdState.set(userAccount.id);

      // 调试信息：检查团队数据
      if (teams.length > 0) {
        console.log('[WorkspaceContextService] Loaded teams:', teams);
        console.log(
          '[WorkspaceContextService] Teams organization IDs:',
          teams.map(t => (t as any).organization_id || (t as any).organizationId)
        );
        console.log(
          '[WorkspaceContextService] All organizations:',
          [...createdOrgs, ...joinedOrgs].map(o => ({ id: o.id, name: o.name }))
        );
      } else {
        console.log('[WorkspaceContextService] No teams found for user:', userAccount.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载用户工作区数据失败';
      this.errorState.set(errorMessage);
      console.error('加载用户工作区数据失败:', error);
      throw error;
    } finally {
      this.loadingOrganizationsState.set(false);
      this.loadingTeamsState.set(false);
    }
  }

  /**
   * 切换到应用菜单（默认菜单）
   */
  switchToApp(): void {
    this.contextTypeState.set('app');
    this.contextIdState.set(null);
    this.menuContextService.switchToApp();
    // 清空选中的账户
    this.accountService.selectAccount(null);
  }

  /**
   * 切换到个人用户菜单
   *
   * @param userId 用户账户 ID（可选，如果不提供则使用当前用户账户）
   */
  switchToUser(userId?: string): void {
    const targetUserId = userId || this.currentUserAccountId();
    if (!targetUserId) {
      console.warn('Cannot switch to user: no user account ID available');
      return;
    }

    this.contextTypeState.set('user');
    this.contextIdState.set(targetUserId);
    this.menuContextService.switchToUser(targetUserId);

    // 同时更新 AccountService 的选中账户
    const account = this.accountService.userAccounts().find(a => a.id === targetUserId);
    if (account) {
      this.accountService.selectAccount(account);
    }
  }

  /**
   * 切换到组织菜单
   *
   * @param organizationId 组织账户 ID
   */
  switchToOrganization(organizationId: string): void {
    // 验证组织是否存在
    const organization = this.allOrganizations().find(org => org.id === organizationId);
    if (!organization) {
      console.warn(`Cannot switch to organization: organization ${organizationId} not found`);
      return;
    }

    this.contextTypeState.set('organization');
    this.contextIdState.set(organizationId);
    this.menuContextService.switchToOrganization(organizationId);

    // 同时更新 AccountService 的选中账户
    this.accountService.selectAccount(organization);
  }

  /**
   * 切换到团队菜单
   *
   * @param teamId 团队 ID
   */
  switchToTeam(teamId: string): void {
    // 验证团队是否存在
    const team = this.userTeams().find(t => t.id === teamId);
    if (!team) {
      console.warn(`Cannot switch to team: team ${teamId} not found`);
      return;
    }

    this.contextTypeState.set('team');
    this.contextIdState.set(teamId);
    this.menuContextService.switchToTeam(teamId);
    // 注意：Team 不是 Account，所以不需要调用 selectAccount
  }

  /**
   * 恢复持久化的上下文状态
   */
  private restoreContext(): void {
    try {
      const savedContextType = localStorage.getItem('workspace.contextType') as 'app' | 'user' | 'organization' | 'team' | null;
      const savedContextId = localStorage.getItem('workspace.contextId');

      if (savedContextType) {
        // 延迟恢复，等待数据加载完成
        setTimeout(() => {
          switch (savedContextType) {
            case 'app':
              this.switchToApp();
              break;
            case 'user':
              if (savedContextId) {
                this.switchToUser(savedContextId);
              }
              break;
            case 'organization':
              if (savedContextId) {
                this.switchToOrganization(savedContextId);
              }
              break;
            case 'team':
              if (savedContextId) {
                this.switchToTeam(savedContextId);
              }
              break;
          }
        }, 100);
      }
    } catch (error) {
      console.warn('Failed to restore workspace context from localStorage:', error);
    }
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.contextTypeState.set('app');
    this.contextIdState.set(null);
    this.currentUserAccountState.set(null);
    this.currentUserAccountIdState.set(null);
    this.createdOrganizationsState.set([]);
    this.joinedOrganizationsState.set([]);
    this.userTeamsState.set([]);
    this.errorState.set(null);
    this.loadingOrganizationsState.set(false);
    this.loadingTeamsState.set(false);
  }

  /**
   * 刷新工作区数据（重新加载组织列表和团队列表）
   */
  async refresh(): Promise<void> {
    const token = this.tokenService.get();
    if (token?.['user']?.['id']) {
      await this.loadUserWorkspace(token['user']['id']);
    }
  }
}
