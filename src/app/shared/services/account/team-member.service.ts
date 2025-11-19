import { Injectable, inject, signal } from '@angular/core';
import { TeamMember, TeamMemberInsert, TeamMemberRepository, TeamMemberRole, TeamMemberUpdate } from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * TeamMember Service
 *
 * 提供团队成员相关的业务逻辑和状态管理
 * RLS 策略已处理所有权限检查
 */
@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private teamMemberRepository = inject(TeamMemberRepository);

  // 使用 Signals 管理状态
  private membersState = signal<TeamMember[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly members = this.membersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 根据团队 ID 加载团队成员列表
   */
  async loadMembersByTeamId(teamId: string): Promise<TeamMember[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const members = (await firstValueFrom(this.teamMemberRepository.findByTeamId(teamId))) as TeamMember[];
      this.membersState.set(members);
      return members;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载团队成员列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 添加团队成员
   */
  async addMember(data: { teamId: string; accountId: string; role?: TeamMemberRole }): Promise<TeamMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const memberData: TeamMemberInsert = {
        team_id: data.teamId,
        account_id: data.accountId,
        role: data.role || TeamMemberRole.MEMBER
      };

      const member = (await firstValueFrom(this.teamMemberRepository.create(memberData))) as TeamMember;

      // 更新本地状态
      this.membersState.update(members => [...members, member]);
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '添加团队成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新团队成员角色
   */
  async updateMemberRole(memberId: string, role: TeamMemberRole): Promise<TeamMember> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: TeamMemberUpdate = {
        role
      };

      const member = (await firstValueFrom(this.teamMemberRepository.update(memberId, updateData))) as TeamMember;

      // 更新本地状态
      this.membersState.update(members => members.map(m => (m.id === memberId ? member : m)));
      return member;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新团队成员角色失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 移除团队成员
   */
  async removeMember(memberId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.teamMemberRepository.delete(memberId));

      // 更新本地状态
      this.membersState.update(members => members.filter(m => m.id !== memberId));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '移除团队成员失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空状态
   */
  clearState(): void {
    this.membersState.set([]);
    this.errorState.set(null);
  }
}
