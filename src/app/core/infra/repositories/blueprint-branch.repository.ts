import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { BranchType, BranchStatus } from '../types/blueprint.types';
import { Database } from '../types/database.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BlueprintBranchRow = Database['public']['Tables']['blueprint_branches']['Row'];
type BlueprintBranchInsert = Database['public']['Tables']['blueprint_branches']['Insert'];
type BlueprintBranchUpdate = Database['public']['Tables']['blueprint_branches']['Update'];

/**
 * BlueprintBranch 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BlueprintBranch = BlueprintBranchRow;
export type { BlueprintBranchInsert, BlueprintBranchUpdate };

/**
 * BlueprintBranch Repository
 *
 * 提供蓝图分支相关的数据访问方法
 *
 * @example
 * ```typescript
 * const branchRepo = inject(BlueprintBranchRepository);
 * branchRepo.findByBlueprintId('blueprint-id').subscribe(branches => {
 *   console.log('Branches:', branches);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintBranchRepository extends BaseRepository<BlueprintBranch, BlueprintBranchInsert, BlueprintBranchUpdate> {
  protected tableName = 'blueprint_branches';

  /**
   * 根据蓝图 ID 查询分支列表
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<BlueprintBranch[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BlueprintBranch[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据组织 ID 查询分支列表
   *
   * @param organizationId 组织 ID
   * @param options 查询选项
   * @returns Observable<BlueprintBranch[]>
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<BlueprintBranch[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId // 会自动转换为 organization_id
      }
    });
  }

  /**
   * 根据分支类型查询分支列表
   *
   * @param branchType 分支类型
   * @param options 查询选项
   * @returns Observable<BlueprintBranch[]>
   */
  findByBranchType(branchType: BranchType, options?: QueryOptions): Observable<BlueprintBranch[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchType // 会自动转换为 branch_type
      }
    });
  }

  /**
   * 根据分支状态查询分支列表
   *
   * @param status 分支状态
   * @param options 查询选项
   * @returns Observable<BlueprintBranch[]>
   */
  findByStatus(status: BranchStatus, options?: QueryOptions): Observable<BlueprintBranch[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 查询活跃的分支
   *
   * @param options 查询选项
   * @returns Observable<BlueprintBranch[]>
   */
  findActive(options?: QueryOptions): Observable<BlueprintBranch[]> {
    return this.findByStatus(BranchStatus.ACTIVE, options);
  }

  /**
   * 根据蓝图 ID 和组织 ID 查询分支（唯一分支）
   *
   * @param blueprintId 蓝图 ID
   * @param organizationId 组织 ID
   * @returns Observable<BlueprintBranch | null>
   */
  findByBlueprintAndOrganization(blueprintId: string, organizationId: string): Observable<BlueprintBranch | null> {
    return this.findAll({
      filters: {
        blueprintId, // 会自动转换为 blueprint_id
        organizationId // 会自动转换为 organization_id
      }
    }).pipe(map(branches => (branches.length > 0 ? branches[0] : null)));
  }
}
