import { Injectable, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';
import type {
  Team,
  TeamMember,
  TeamMemberWithUser,
  TeamWithMembers,
  CreateTeamInput,
  UpdateTeamInput,
  TeamMemberRole,
  TeamHierarchy
} from '@shared';

import { SupabaseService } from '../../supabase/supabase.service';

/**
 * Team Service
 *
 * 提供團隊相關的 CRUD 操作
 */
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  /**
   * 獲取組織的所有團隊
   */
  async getOrganizationTeams(organizationId: string): Promise<{ data: Team[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('teams')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取團隊列表失敗',
          details: error.message || '無法載入團隊列表',
          source: 'TeamService.getOrganizationTeams',
          retryable: true,
          metadata: { organizationId }
        });
        return { data: [], error };
      }

      return { data: (data || []) as Team[], error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取團隊列表失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'TeamService.getOrganizationTeams',
        retryable: false,
        metadata: { organizationId }
      });
      return { data: [], error: error as Error };
    }
  }

  /**
   * 根據 ID 獲取團隊資料
   */
  async getTeamById(id: string): Promise<{ data: Team | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('teams').select('*').eq('id', id).single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '獲取團隊資料失敗',
          details: error.message || '無法載入團隊資料',
          source: 'TeamService.getTeamById',
          retryable: true,
          metadata: { id }
        });
        return { data: null, error };
      }

      return { data: data as Team, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '獲取團隊資料失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'TeamService.getTeamById',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 根據 slug 獲取團隊資料
   */
  async getTeamBySlug(organizationId: string, slug: string): Promise<{ data: Team | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('teams')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('slug', slug)
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as Team, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 獲取團隊的完整資料（包含成員列表）
   */
  async getTeamWithMembers(id: string): Promise<{ data: TeamWithMembers | null; error: Error | null }> {
    try {
      const { data: team, error: teamError } = await this.supabase.client.from('teams').select('*').eq('id', id).single();

      if (teamError || !team) {
        return { data: null, error: teamError };
      }

      // 分兩步查詢：先獲取成員，再獲取用戶資料
      const { data: members, error: membersError } = await this.supabase.client
        .from('team_members')
        .select('*')
        .eq('team_id', id)
        .eq('status', 'active');

      if (membersError) {
        return { data: null, error: membersError };
      }

      // 獲取所有成員的用戶資料
      const userIds = (members || []).map(m => (m as any).user_id);

      if (userIds.length === 0) {
        // 沒有成員，直接返回空列表
        return {
          data: {
            ...(team as Team),
            members: []
          },
          error: null
        };
      }

      const { data: users, error: usersError } = await this.supabase.client.from('users').select('*').in('id', userIds);

      if (usersError) {
        return { data: null, error: usersError };
      }

      // 組合成完整的成員資料
      const userMap = new Map((users || []).map((u: any) => [u.id, u]));
      const membersWithUsers: TeamMemberWithUser[] = (members || [])
        .map((m: any) => ({
          ...m,
          user: userMap.get(m.user_id)
        }))
        .filter((item: any) => item.user); // 過濾掉沒有用戶資料的成員

      return {
        data: {
          ...(team as Team),
          members: membersWithUsers
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 創建團隊
   */
  async createTeam(input: CreateTeamInput): Promise<{ data: Team | null; error: Error | null }> {
    try {
      const {
        data: { user }
      } = await this.supabase.client.auth.getUser();

      if (!user) {
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '創建團隊失敗',
          details: '用戶未認證，無法創建團隊',
          source: 'TeamService.createTeam',
          retryable: false
        });
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data: team, error: teamError } = await this.supabase.client
        .from('teams')
        .insert({
          organization_id: input.organization_id,
          name: input.name,
          slug: input.slug,
          description: input.description,
          avatar_url: input.avatar_url,
          privacy: input.privacy ?? 'closed',
          parent_team_id: input.parent_team_id
        })
        .select()
        .single();

      if (teamError) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '創建團隊失敗',
          details: teamError.message || '無法創建團隊',
          source: 'TeamService.createTeam',
          retryable: true,
          metadata: { input }
        });
        return { data: null, error: teamError };
      }

      return { data: team as Team, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建團隊失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'TeamService.createTeam',
        retryable: false,
        metadata: { input }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新團隊資料
   */
  async updateTeam(id: string, input: UpdateTeamInput): Promise<{ data: Team | null; error: Error | null }> {
    try {
      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.avatar_url !== undefined) updateData.avatar_url = input.avatar_url;
      if (input.privacy !== undefined) updateData.privacy = input.privacy;
      if (input.parent_team_id !== undefined) updateData.parent_team_id = input.parent_team_id;

      const { data, error } = await this.supabase.client.from('teams').update(updateData).eq('id', id).select().single();

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '更新團隊失敗',
          details: error.message || '無法更新團隊',
          source: 'TeamService.updateTeam',
          retryable: true,
          metadata: { id, input }
        });
        return { data: null, error };
      }

      return { data: data as Team, error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '更新團隊失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'TeamService.updateTeam',
        retryable: false,
        metadata: { id }
      });
      return { data: null, error: error as Error };
    }
  }

  /**
   * 刪除團隊
   */
  async deleteTeam(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('teams').delete().eq('id', id);

      if (error) {
        this.errorService.addError({
          type: 'http',
          severity: 'error',
          message: '刪除團隊失敗',
          details: error.message || '無法刪除團隊',
          source: 'TeamService.deleteTeam',
          retryable: false,
          metadata: { id }
        });
        return { error };
      }

      return { error: null };
    } catch (error) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '刪除團隊失敗',
        details: error instanceof Error ? error.message : '發生未預期的錯誤',
        source: 'TeamService.deleteTeam',
        retryable: false,
        metadata: { id }
      });
      return { error: error as Error };
    }
  }

  /**
   * 獲取團隊的成員列表
   */
  async getTeamMembers(teamId: string): Promise<{ data: TeamMemberWithUser[]; error: Error | null }> {
    try {
      // 分兩步查詢：先獲取成員，再獲取用戶資料
      const { data: members, error: membersError } = await this.supabase.client
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (membersError) {
        return { data: [], error: membersError };
      }

      // 獲取所有成員的用戶資料
      const userIds = (members || []).map(m => (m as any).user_id);

      if (userIds.length === 0) {
        // 沒有成員，直接返回空列表
        return { data: [], error: null };
      }

      const { data: users, error: usersError } = await this.supabase.client.from('users').select('*').in('id', userIds);

      if (usersError) {
        return { data: [], error: usersError };
      }

      // 組合成完整的成員資料
      const userMap = new Map((users || []).map((u: any) => [u.id, u]));
      const membersWithUsers: TeamMemberWithUser[] = (members || [])
        .map((m: any) => ({
          ...m,
          user: userMap.get(m.user_id)
        }))
        .filter((item: any) => item.user); // 過濾掉沒有用戶資料的成員

      return { data: membersWithUsers, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 添加成員到團隊
   */
  async addMemberToTeam(
    teamId: string,
    userId: string,
    role: TeamMemberRole = 'member'
  ): Promise<{ data: TeamMember | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
          status: 'active',
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as TeamMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 更新團隊成員角色
   */
  async updateTeamMemberRole(memberId: string, role: TeamMemberRole): Promise<{ data: TeamMember | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client.from('team_members').update({ role }).eq('id', memberId).select().single();

      if (error) {
        return { data: null, error };
      }

      return { data: data as TeamMember, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 移除成員
   */
  async removeMemberFromTeam(memberId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.client.from('team_members').delete().eq('id', memberId);

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * 獲取用戶所屬的所有團隊
   */
  async getUserTeams(organizationId: string, userId: string): Promise<{ data: Team[]; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('team_members')
        .select(
          `
          team_id,
          teams (*)
        `
        )
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        return { data: [], error };
      }

      const teams = (data || []).map((item: any) => item.teams).filter((team: Team) => team.organization_id === organizationId) as Team[];
      return { data: teams, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * 獲取團隊層級結構
   */
  async getTeamHierarchy(organizationId: string): Promise<{ data: TeamHierarchy[]; error: Error | null }> {
    try {
      const { data: teams, error } = await this.getOrganizationTeams(organizationId);

      if (error) {
        return { data: [], error };
      }

      // 建立團隊映射表
      const teamMap = new Map<string, TeamHierarchy>();
      const roots: TeamHierarchy[] = [];

      // 第一遍：建立所有團隊節點
      teams.forEach(team => {
        teamMap.set(team.id, {
          team,
          children: []
        });
      });

      // 第二遍：建立父子關係
      teams.forEach(team => {
        const hierarchy = teamMap.get(team.id)!;
        if (team.parent_team_id) {
          const parent = teamMap.get(team.parent_team_id);
          if (parent) {
            parent.children.push(hierarchy);
          } else {
            roots.push(hierarchy);
          }
        } else {
          roots.push(hierarchy);
        }
      });

      return { data: roots, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
}
