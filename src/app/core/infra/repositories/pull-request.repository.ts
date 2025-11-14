import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { PRStatus } from '../types/blueprint.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type PullRequestRow = Database['public']['Tables']['pull_requests']['Row'];
type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];

/**
 * PullRequest 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type PullRequest = PullRequestRow;
export type { PullRequestInsert, PullRequestUpdate };

/**
 * PullRequest Repository
 * 
 * 提供 Pull Request 相关的数据访问方法
 * 
 * @example
 * ```typescript
 * const prRepo = inject(PullRequestRepository);
 * prRepo.findByBlueprintId('blueprint-id').subscribe(prs => {
 *   console.log('Pull Requests:', prs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PullRequestRepository extends BaseRepository<PullRequest, PullRequestInsert, PullRequestUpdate> {
  protected tableName = 'pull_requests';

  /**
   * 根据蓝图 ID 查询 Pull Request 列表
   * 
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<PullRequest[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId, // 会自动转换为 blueprint_id
      },
    });
  }

  /**
   * 根据分支 ID 查询 Pull Request 列表
   * 
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<PullRequest[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId, // 会自动转换为 branch_id
      },
    });
  }

  /**
   * 根据状态查询 Pull Request 列表
   * 
   * @param status PR 状态
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findByStatus(status: PRStatus, options?: QueryOptions): Observable<PullRequest[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status,
      },
    });
  }

  /**
   * 查询打开的 Pull Request 列表
   * 
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findOpen(options?: QueryOptions): Observable<PullRequest[]> {
    return this.findByStatus(PRStatus.OPEN, options);
  }

  /**
   * 查询审核中的 Pull Request 列表
   * 
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findReviewing(options?: QueryOptions): Observable<PullRequest[]> {
    return this.findByStatus(PRStatus.REVIEWING, options);
  }

  /**
   * 查询已合并的 Pull Request 列表
   * 
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findMerged(options?: QueryOptions): Observable<PullRequest[]> {
    return this.findByStatus(PRStatus.MERGED, options);
  }

  /**
   * 根据提交者 ID 查询 Pull Request 列表
   * 
   * @param submittedBy 提交者 ID
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findBySubmittedBy(submittedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        submittedBy, // 会自动转换为 submitted_by
      },
    });
  }

  /**
   * 根据审核者 ID 查询 Pull Request 列表
   * 
   * @param reviewedBy 审核者 ID
   * @param options 查询选项
   * @returns Observable<PullRequest[]>
   */
  findByReviewedBy(reviewedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        reviewedBy, // 会自动转换为 reviewed_by
      },
    });
  }
}

