import { Injectable, inject, signal } from '@angular/core';
import { Account, AccountService, Team, TeamService } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Workspace Data Service
 *
 * 工作区数据加载服务
 * 负责加载和缓存用户可访问的组织和团队列表
 *
 * 职责：
 * - 加载用户创建的组织列表
 * - 加载用户加入的组织列表
 * - 加载用户可访问的团队列表（作为成员 + 组织下的团队）
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
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceDataService {
  private readonly accountService = inject(AccountService);
  private readonly teamService = inject(TeamService);

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
  readonly currentUserAccount = this.currentUserAccountState.asReadonly();
  readonly currentUserAccountId = this.currentUserAccountIdState.asReadonly();
  readonly createdOrganizations = this.createdOrganizationsState.asReadonly();
  readonly joinedOrganizations = this.joinedOrganizationsState.asReadonly();
  readonly loadingOrganizations = this.loadingOrganizationsState.asReadonly();
  readonly userTeams = this.userTeamsState.asReadonly();
  readonly loadingTeams = this.loadingTeamsState.asReadonly();
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
        console.log('[WorkspaceDataService] Loaded teams:', teams);
        console.log(
          '[WorkspaceDataService] Teams organization IDs:',
          teams.map(t => (t as any).organization_id || (t as any).organizationId)
        );
        console.log(
          '[WorkspaceDataService] All organizations:',
          [...createdOrgs, ...joinedOrgs].map(o => ({ id: o.id, name: o.name }))
        );
      } else {
        console.log('[WorkspaceDataService] No teams found for user:', userAccount.id);
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
   * 重置所有状态
   */
  reset(): void {
    this.currentUserAccountState.set(null);
    this.currentUserAccountIdState.set(null);
    this.createdOrganizationsState.set([]);
    this.joinedOrganizationsState.set([]);
    this.userTeamsState.set([]);
    this.errorState.set(null);
    this.loadingOrganizationsState.set(false);
    this.loadingTeamsState.set(false);
  }
}
