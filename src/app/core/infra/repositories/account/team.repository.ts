import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

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
 * RLS 策略已处理所有权限检查，无需额外逻辑
 */
@Injectable({
  providedIn: 'root'
})
export class TeamRepository extends BaseRepository<Team, TeamInsert, TeamUpdate> {
  protected tableName = 'teams';

  /**
   * 根据组织 ID 查询团队列表
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<Team[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId
      }
    });
  }

  /**
   * 根据创建者 ID 查询团队列表
   */
  findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Team[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        createdBy
      }
    });
  }
}
