import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type IssueAssignmentRow = Database['public']['Tables']['issue_assignments']['Row'];
type IssueAssignmentInsert = Database['public']['Tables']['issue_assignments']['Insert'];
type IssueAssignmentUpdate = Database['public']['Tables']['issue_assignments']['Update'];

/**
 * IssueAssignment 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type IssueAssignment = IssueAssignmentRow;
export type { IssueAssignmentInsert, IssueAssignmentUpdate };

/**
 * IssueAssignment Repository
 *
 * 提供问题指派相关的数据访问方法
 *
 * @example
 * ```typescript
 * const issueAssignmentRepo = inject(IssueAssignmentRepository);
 * issueAssignmentRepo.findByIssueId('issue-id').subscribe(assignments => {
 *   console.log('Issue assignments:', assignments);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IssueAssignmentRepository extends BaseRepository<IssueAssignment, IssueAssignmentInsert, IssueAssignmentUpdate> {
  protected tableName = 'issue_assignments';

  /**
   * 根据问题 ID 查询问题指派
   *
   * @param issueId 问题 ID
   * @param options 查询选项
   * @returns Observable<IssueAssignment[]>
   */
  findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        issueId // 会自动转换为 issue_id
      }
    });
  }

  /**
   * 根据被指派人 ID 查询问题指派
   *
   * @param assigneeId 被指派人 ID
   * @param options 查询选项
   * @returns Observable<IssueAssignment[]>
   */
  findByAssigneeId(assigneeId: string, options?: QueryOptions): Observable<IssueAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        assigneeId // 会自动转换为 assignee_id
      }
    });
  }

  /**
   * 根据指派人 ID 查询问题指派
   *
   * @param assignedBy 指派人 ID
   * @param options 查询选项
   * @returns Observable<IssueAssignment[]>
   */
  findByAssignedBy(assignedBy: string, options?: QueryOptions): Observable<IssueAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        assignedBy // 会自动转换为 assigned_by
      }
    });
  }

  /**
   * 查询问题指派关系
   *
   * @param issueId 问题 ID
   * @param assigneeId 被指派人 ID
   * @returns Observable<IssueAssignment | null>
   */
  findByIssueAndAssignee(issueId: string, assigneeId: string): Observable<IssueAssignment | null> {
    return this.findAll({
      filters: {
        issueId,
        assigneeId
      }
    }).pipe(map(assignments => (assignments.length > 0 ? assignments[0] : null)));
  }
}
