import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BranchForkRow = Database['public']['Tables']['branch_forks']['Row'];
type BranchForkInsert = Database['public']['Tables']['branch_forks']['Insert'];
type BranchForkUpdate = Database['public']['Tables']['branch_forks']['Update'];

/**
 * BranchFork 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BranchFork = BranchForkRow;
export type { BranchForkInsert, BranchForkUpdate };

/**
 * BranchFork Repository
 *
 * 提供分支 Fork 记录相关的数据访问方法
 *
 * @example
 * ```typescript
 * const forkRepo = inject(BranchForkRepository);
 * forkRepo.findByBlueprintId('blueprint-id').subscribe(forks => {
 *   console.log('Forks:', forks);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BranchForkRepository extends BaseRepository<BranchFork, BranchForkInsert, BranchForkUpdate> {
  protected tableName = 'branch_forks';

  /**
   * 根据蓝图 ID 查询 Fork 记录列表
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<BranchFork[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<BranchFork[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据分支 ID 查询 Fork 记录列表
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<BranchFork[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<BranchFork[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 根据源任务 ID 查询 Fork 记录列表
   *
   * @param forkedFromTaskId 源任务 ID
   * @param options 查询选项
   * @returns Observable<BranchFork[]>
   */
  findByForkedFromTaskId(forkedFromTaskId: string, options?: QueryOptions): Observable<BranchFork[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        forkedFromTaskId // 会自动转换为 forked_from_task_id
      }
    });
  }

  /**
   * 根据 Fork 者 ID 查询 Fork 记录列表
   *
   * @param forkedBy Fork 者 ID
   * @param options 查询选项
   * @returns Observable<BranchFork[]>
   */
  findByForkedBy(forkedBy: string, options?: QueryOptions): Observable<BranchFork[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        forkedBy // 会自动转换为 forked_by
      }
    });
  }
}
