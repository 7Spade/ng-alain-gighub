import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type OrganizationScheduleRow = Database['public']['Tables']['organization_schedules']['Row'];
type OrganizationScheduleInsert = Database['public']['Tables']['organization_schedules']['Insert'];
type OrganizationScheduleUpdate = Database['public']['Tables']['organization_schedules']['Update'];

/**
 * OrganizationSchedule 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type OrganizationSchedule = OrganizationScheduleRow;
export type { OrganizationScheduleInsert, OrganizationScheduleUpdate };

/**
 * OrganizationSchedule Repository
 * 
 * 提供组织排班相关的数据访问方法
 * 
 * @example
 * ```typescript
 * const scheduleRepo = inject(OrganizationScheduleRepository);
 * scheduleRepo.findByOrganizationId('org-id').subscribe(schedules => {
 *   console.log('Organization schedules:', schedules);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationScheduleRepository extends BaseRepository<OrganizationSchedule, OrganizationScheduleInsert, OrganizationScheduleUpdate> {
  protected tableName = 'organization_schedules';

  /**
   * 根据组织 ID 查询排班列表
   * 
   * @param organizationId 组织 ID
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId, // 会自动转换为 organization_id
      },
    });
  }

  /**
   * 根据蓝图 ID 查询排班列表
   * 
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId, // 会自动转换为 blueprint_id
      },
    });
  }

  /**
   * 根据分支 ID 查询排班列表
   * 
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId, // 会自动转换为 branch_id
      },
    });
  }

  /**
   * 根据账户 ID 查询排班列表
   * 
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId, // 会自动转换为 account_id
      },
    });
  }

  /**
   * 根据团队 ID 查询排班列表
   * 
   * @param teamId 团队 ID
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByTeamId(teamId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        teamId, // 会自动转换为 team_id
      },
    });
  }

  /**
   * 根据日期范围查询排班列表
   * 
   * @param startDate 开始日期
   * @param endDate 结束日期
   * @param options 查询选项
   * @returns Observable<OrganizationSchedule[]>
   */
  findByDateRange(startDate: string, endDate: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
    // 注意：这里需要根据实际的 BaseRepository 实现来调整
    // 如果 BaseRepository 支持范围查询，可以使用 filters
    // 否则可能需要使用自定义查询
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        // 日期范围查询可能需要特殊处理
        // 这里假设 BaseRepository 支持 gte/lte 操作符
      },
    });
  }
}

