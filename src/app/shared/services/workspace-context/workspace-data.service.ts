import { Injectable, inject, signal } from '@angular/core';
import { Account, AccountService, Team, TeamService, BlueprintService, Blueprint } from '@shared';

/**
 * Workspace Data Service
 *
 * 工作区数据加载服务
 * 负责加载和缓存用户可访问的组织、团队和蓝图列表
 *
 * 职责：
 * - 加载用户创建的组织列表
 * - 加载用户加入的组织列表
 * - 加载用户可访问的团队列表（作为成员 + 组织下的团队）
 * - 加载当前视角下的蓝图列表
 * - 管理数据加载状态
 *
 * @example
 * ```typescript
 * const dataService = inject(WorkspaceDataService);
 *
 * // 加载工作区数据
 * await dataService.loadWorkspaceData(authUserId);
 *
 * // 获取数据
 * const orgs = dataService.allOrganizations();
 * const teams = dataService.userTeams();
 * const blueprints = dataService.contextBlueprints();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceDataService {
  private readonly accountService = inject(AccountService);
  private readonly teamService = inject(TeamService);
  private readonly blueprintService = inject(BlueprintService);

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

  // 蓝图列表状态（当前视角下的蓝图）
  private contextBlueprintsState = signal<Blueprint[]>([]);
  private loadingBlueprintsState = signal<boolean>(false);

  // 错误状态
  private errorState = signal<string | null>(null);

  // 暴露只读信号
  readonly currentUserAccount = this.currentUserAccountState.asReadonly();
  readonly currentUserAccountId = this.currentUserAccountIdState.asReadonly();
  readonly createdOrganizations = this.createdOrganizationsState.asReadonly();
  readonly joinedOrganizations = this.joinedOrganizationsState.asReadonly();
  readonly loadingOrganizations = this.loadingOrganizationsState.asReadonly();
  readonly userTeams = this.userTeamsState.asReadonly();
  readonly loadingTeams = this.loadingTeamsState.asReadonly();
  readonly contextBlueprints = this.contextBlueprintsState.asReadonly();
  readonly loadingBlueprints = this.loadingBlueprintsState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 加载用户工作区数据（组织列表和团队列表）
   *
   * @param authUserId 用户的 auth_user_id
   */
  async loadWorkspaceData(authUserId: string): Promise<void> {
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

      // 2. 并行加载创建的组织、加入的组织（分别处理错误）
      let createdOrgs: Account[] = [];
      let joinedOrgs: Account[] = [];
      let hasError = false;
      let errorMessages: string[] = [];

      try {
        createdOrgs = await this.accountService.getUserCreatedOrganizations(authUserId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '載入我的組織失敗';
        console.error('[WorkspaceDataService] 載入我的組織失敗:', error);
        errorMessages.push(`載入我的組織失敗：${errorMessage}`);
        hasError = true;
      }

      try {
        joinedOrgs = await this.accountService.getUserJoinedOrganizations(userAccount.id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '載入我加入的組織失敗';
        console.error('[WorkspaceDataService] 載入我加入的組織失敗:', error);
        errorMessages.push(`載入我加入的組織失敗：${errorMessage}`);
        hasError = true;
      }

      // 如果两个都失败，设置错误状态
      if (createdOrgs.length === 0 && joinedOrgs.length === 0 && hasError) {
        this.errorState.set(errorMessages.join('；'));
      } else if (hasError && errorMessages.length > 0) {
        // 部分失败，记录警告但不阻止继续
        console.warn('[WorkspaceDataService] 部分數據載入失敗:', errorMessages);
      }

      // 3. 加载团队列表（用户作为成员的团队）
      let memberTeams: Team[] = [];
      try {
        memberTeams = await this.accountService.getUserTeams(userAccount.id);
      } catch (error) {
        console.error('[WorkspaceDataService] 載入團隊列表失敗:', error);
        // 团队加载失败不影响主流程
      }

      // 4. 加载用户创建的组织下的所有团队（即使不是成员）
      const allOrgIds = [...createdOrgs, ...joinedOrgs].map(org => org.id);
      const orgTeamsPromises = allOrgIds.map(orgId =>
        this.teamService.loadTeamsByOrganizationId(orgId).catch(() => {
          console.warn(`[WorkspaceDataService] 載入組織 ${orgId} 的團隊失敗`);
          return [] as Team[];
        })
      );
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
        console.log('[WorkspaceDataService] Loaded teams:', teams);
        console.log(
          '[WorkspaceDataService] Teams organization IDs:',
          teams.map(t => (t as any).organizationId)
        );
        console.log(
          '[WorkspaceDataService] All organizations:',
          [...createdOrgs, ...joinedOrgs].map(o => ({ id: o.id, name: o.name }))
        );
      } else {
        console.log('[WorkspaceDataService] No teams found for user:', userAccount.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入用戶工作區數據失敗';
      this.errorState.set(errorMessage);
      console.error('載入用戶工作區數據失敗:', error);
      throw error;
    } finally {
      this.loadingOrganizationsState.set(false);
      this.loadingTeamsState.set(false);
    }
  }

  /**
   * 根据视角加载蓝图列表
   *
   * @param contextType 视角类型
   * @param contextId 视角ID（可选，app视角不需要）
   */
  async loadBlueprintsByContext(contextType: 'app' | 'user' | 'organization' | 'team', contextId: string | null): Promise<void> {
    // app 视角不加载蓝图
    if (contextType === 'app' || !contextId) {
      this.contextBlueprintsState.set([]);
      return;
    }

    this.loadingBlueprintsState.set(true);
    this.errorState.set(null);

    try {
      let blueprints: Blueprint[] = [];

      switch (contextType) {
        case 'user':
          // 加载用户创建的蓝图
          blueprints = await this.blueprintService.loadBlueprintsByOwnerId(contextId);
          break;

        case 'organization':
          // 加载组织创建的蓝图
          blueprints = await this.blueprintService.loadBlueprintsByOwnerId(contextId);
          break;

        case 'team': {
          // 团队视角：需要找到团队所属的组织，然后加载组织的蓝图
          // 注意：团队本身不创建蓝图，蓝图属于组织
          const team = this.userTeamsState().find(t => t.id === contextId);
          if (team) {
            const orgId = (team as any).organizationId;
            if (orgId) {
              blueprints = await this.blueprintService.loadBlueprintsByOwnerId(orgId);
            }
          }
          break;
        }
      }

      this.contextBlueprintsState.set(blueprints);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载蓝图列表失败';
      console.error('[WorkspaceDataService] 加载蓝图列表失败:', error);
      // 不抛出错误，只记录日志和设置错误状态
      this.errorState.set(errorMessage);
      this.contextBlueprintsState.set([]);
    } finally {
      this.loadingBlueprintsState.set(false);
    }
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.currentUserAccountState.set(null);
    this.currentUserAccountIdState.set(null);
    this.createdOrganizationsState.set([]);
    this.joinedOrganizationsState.set([]);
    this.userTeamsState.set([]);
    this.contextBlueprintsState.set([]);
    this.errorState.set(null);
    this.loadingOrganizationsState.set(false);
    this.loadingTeamsState.set(false);
    this.loadingBlueprintsState.set(false);
  }
}
