import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { TeamMemberRole } from '../types/account';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type TeamMemberRow = Database['public']['Tables']['team_members']['Row'];
type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];

/**
 * TeamMember 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type TeamMember = TeamMemberRow;
export type { TeamMemberInsert, TeamMemberUpdate };

/**
 * TeamMember Repository
 *
 * 提供团队成员相关的数据访问方法
 *
 * @example
 * ```typescript
 * const teamMemberRepo = inject(TeamMemberRepository);
 * teamMemberRepo.findByTeamId('team-id').subscribe(members => {
 *   console.log('Team members:', members);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TeamMemberRepository extends BaseRepository<TeamMember, TeamMemberInsert, TeamMemberUpdate> {
  protected tableName = 'team_members';

  /**
   * 根据团队 ID 查询团队成员列表
   *
   * @param teamId 团队 ID
   * @param options 查询选项
   * @returns Observable<TeamMember[]>
   */
  findByTeamId(teamId: string, options?: QueryOptions): Observable<TeamMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        teamId // 会自动转换为 team_id
      }
    });
  }

  /**
   * 根据账户 ID 查询团队成员关系
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<TeamMember[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<TeamMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据角色查询团队成员
   *
   * @param role 成员角色
   * @param options 查询选项
   * @returns Observable<TeamMember[]>
   */
  findByRole(role: TeamMemberRole, options?: QueryOptions): Observable<TeamMember[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        role
      }
    });
  }

  /**
   * 查询团队中的负责人（leader）
   *
   * @param teamId 团队 ID
   * @returns Observable<TeamMember[]>
   */
  findLeadersByTeamId(teamId: string): Observable<TeamMember[]> {
    return this.findAll({
      filters: {
        teamId, // 会自动转换为 team_id
        role: TeamMemberRole.LEADER
      }
    });
  }
}
