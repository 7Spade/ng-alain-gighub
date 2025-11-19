import { Injectable, inject, signal } from '@angular/core';
import { Team, TeamInsert, TeamRepository, TeamUpdate } from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * Team Service
 *
 * 提供团队相关的业务逻辑和状态管理
 * RLS 策略已处理所有权限检查
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamRepository = inject(TeamRepository);

  // 使用 Signals 管理状态
  private teamsState = signal<Team[]>([]);
  private selectedTeamState = signal<Team | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly teams = this.teamsState.asReadonly();
  readonly selectedTeam = this.selectedTeamState.asReadonly();
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
  async createTeam(data: { organizationId: string; name: string; createdBy: string; description?: string | null }): Promise<Team> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const teamData = {
        organization_id: data.organizationId,
        name: data.name,
        created_by: data.createdBy,
        description: data.description ?? undefined
      } as TeamInsert;
      const team = (await firstValueFrom(this.teamRepository.create(teamData))) as Team;
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
      this.teamsState.update(teams => teams.filter(t => t.id !== id));
      if (this.selectedTeam()?.id === id) {
        this.selectedTeamState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除团队失败');
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
    this.errorState.set(null);
  }
}
