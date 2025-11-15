import { Injectable, inject, signal, computed } from '@angular/core';
import {
  TeamRepository,
  Team,
  TeamInsert,
  TeamUpdate,
  TeamMemberRepository,
  TeamMember,
  TeamMemberInsert,
  TeamMemberUpdate,
  TeamMemberRole
} from '@core';
import { Observable, firstValueFrom } from 'rxjs';

/**
 * Team Service
 *
 * 提供团队相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const teamService = inject(TeamService);
 *
 * // 订阅团队列表
 * effect(() => {
 *   console.log('Teams:', teamService.teams());
 * });
 *
 * // 加载组织下的团队列表
 * await teamService.loadTeamsByOrganizationId('org-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamRepository = inject(TeamRepository);
  private teamMemberRepository = inject(TeamMemberRepository);

  // 使用 Signals 管理状态
  private teamsState = signal<Team[]>([]);
  private selectedTeamState = signal<Team | null>(null);
  private teamMembersState = signal<TeamMember[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly teams = this.teamsState.asReadonly();
  readonly selectedTeam = this.selectedTeamState.asReadonly();
  readonly teamMembers = this.teamMembersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 加载所有团队
   */
  async loadTeams(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const teams = (await firstValueFrom(this.teamRepository.findAll())) as Team[];
      this.teamsState.set(teams);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据组织 ID 加载团队列表
   */
  async loadTeamsByOrganizationId(organizationId: string): Promise<Team[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const teams = (await firstValueFrom(this.teamRepository.findByOrganizationId(organizationId))) as Team[];
      this.teamsState.set(teams);
      return teams;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载团队
   */
  async loadTeamById(id: string): Promise<Team | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const team = (await firstValueFrom(this.teamRepository.findById(id))) as Team | null;
      if (team) {
        this.selectedTeamState.set(team);
        // 同时加载团队成员
        await this.loadTeamMembers(id);
      }
      return team;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载团队失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建团队
   */
  async createTeam(data: TeamInsert): Promise<Team> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const team = (await firstValueFrom(this.teamRepository.create(data))) as Team;
      // 更新本地状态
      this.teamsState.update(teams => [...teams, team]);
      return team;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建团队失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新团队
   */
  async updateTeam(id: string, data: TeamUpdate): Promise<Team> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const team = (await firstValueFrom(this.teamRepository.update(id, data))) as Team;
      // 更新本地状态
      this.teamsState.update(teams => teams.map(t => (t.id === id ? team : t)));
      // 如果更新的是当前选中的团队，也更新选中状态
      if (this.selectedTeam()?.id === id) {
        this.selectedTeamState.set(team);
      }
      return team;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新团队失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除团队
   */
  async deleteTeam(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.teamRepository.delete(id));
      // 更新本地状态
      this.teamsState.update(teams => teams.filter(t => t.id !== id));
      // 如果删除的是当前选中的团队，清空选中状态
      if (this.selectedTeam()?.id === id) {
        this.selectedTeamState.set(null);
        this.teamMembersState.set([]);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除团队失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择团队
   */
  selectTeam(team: Team | null): void {
    this.selectedTeamState.set(team);
    if (team) {
      this.loadTeamMembers(team.id);
    } else {
      this.teamMembersState.set([]);
    }
  }

  /**
   * 加载团队成员列表
   */
  async loadTeamMembers(teamId: string): Promise<TeamMember[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const members = (await firstValueFrom(this.teamMemberRepository.findByTeamId(teamId))) as TeamMember[];
      this.teamMembersState.set(members);
      return members;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载团队成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 添加团队成员
   */
  async addTeamMember(teamId: string, accountId: string, role: TeamMemberRole = TeamMemberRole.MEMBER): Promise<TeamMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // BaseRepository 会自动将 camelCase 转换为 snake_case
      const memberData = {
        teamId, // 会自动转换为 team_id
        accountId, // 会自动转换为 account_id
        role
      } as any as TeamMemberInsert;
      const member = (await firstValueFrom(this.teamMemberRepository.create(memberData))) as TeamMember;
      // 更新本地状态
      this.teamMembersState.update(members => [...members, member]);
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '添加团队成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 移除团队成员
   */
  async removeTeamMember(memberId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.teamMemberRepository.delete(memberId));
      // 更新本地状态
      this.teamMembersState.update(members => members.filter(m => m.id !== memberId));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '移除团队成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新团队成员角色
   */
  async updateTeamMemberRole(memberId: string, role: TeamMemberRole): Promise<TeamMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: TeamMemberUpdate = { role };
      const member = (await firstValueFrom(this.teamMemberRepository.update(memberId, updateData))) as TeamMember;
      // 更新本地状态
      this.teamMembersState.update(members => members.map(m => (m.id === memberId ? member : m)));
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新团队成员角色失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.teamsState.set([]);
    this.selectedTeamState.set(null);
    this.teamMembersState.set([]);
    this.errorState.set(null);
  }
}
