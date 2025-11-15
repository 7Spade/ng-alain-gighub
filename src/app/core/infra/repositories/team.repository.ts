import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type TeamRow = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];
type TeamUpdate = Database['public']['Tables']['teams']['Update'];

/**
 * Team 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Team = TeamRow;
export type { TeamInsert, TeamUpdate };

/**
 * Team Repository
 *
 * 提供团队相关的数据访问方法
 *
 * @example
 * ```typescript
 * const teamRepo = inject(TeamRepository);
 * teamRepo.findByOrganizationId('org-id').subscribe(teams => {
 *   console.log('Organization teams:', teams);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TeamRepository extends BaseRepository<Team, TeamInsert, TeamUpdate> {
  protected tableName = 'teams';

  /**
   * 根据组织 ID 查询团队列表
   *
   * @param organizationId 组织 ID
   * @param options 查询选项
   * @returns Observable<Team[]>
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<Team[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId // 会自动转换为 organization_id
      }
    });
  }

  /**
   * 根据创建者 ID 查询团队列表
   *
   * @param createdBy 创建者 ID
   * @param options 查询选项
   * @returns Observable<Team[]>
   */
  findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Team[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        createdBy // 会自动转换为 created_by
      }
    });
  }
}
