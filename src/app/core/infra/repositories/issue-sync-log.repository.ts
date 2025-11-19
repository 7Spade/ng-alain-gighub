import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type IssueSyncLogRow = Database['public']['Tables']['issue_sync_logs']['Row'];
type IssueSyncLogInsert = Database['public']['Tables']['issue_sync_logs']['Insert'];
type IssueSyncLogUpdate = Database['public']['Tables']['issue_sync_logs']['Update'];

/**
 * IssueSyncLog 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type IssueSyncLog = IssueSyncLogRow;
export type { IssueSyncLogInsert, IssueSyncLogUpdate };

/**
 * IssueSyncLog Repository
 *
 * 提供问题同步记录相关的数据访问方法
 *
 * @example
 * ```typescript
 * const issueSyncLogRepo = inject(IssueSyncLogRepository);
 * issueSyncLogRepo.findByIssueId('issue-id').subscribe(logs => {
 *   console.log('Sync logs:', logs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IssueSyncLogRepository extends BaseRepository<IssueSyncLog, IssueSyncLogInsert, IssueSyncLogUpdate> {
  protected tableName = 'issue_sync_logs';

  /**
   * 根据问题 ID 查询问题同步记录
   *
   * @param issueId 问题 ID
   * @param options 查询选项
   * @returns Observable<IssueSyncLog[]>
   */
  findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueSyncLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        issueId // 会自动转换为 issue_id
      },
      orderBy: 'syncedAt', // 按同步时间排序
      orderDirection: 'desc'
    });
  }

  /**
   * 根据源分支 ID 查询问题同步记录
   *
   * @param sourceBranchId 源分支 ID
   * @param options 查询选项
   * @returns Observable<IssueSyncLog[]>
   */
  findBySourceBranchId(sourceBranchId: string, options?: QueryOptions): Observable<IssueSyncLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        sourceBranchId // 会自动转换为 source_branch_id
      },
      orderBy: 'syncedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据目标蓝图 ID 查询问题同步记录
   *
   * @param targetBlueprintId 目标蓝图 ID
   * @param options 查询选项
   * @returns Observable<IssueSyncLog[]>
   */
  findByTargetBlueprintId(targetBlueprintId: string, options?: QueryOptions): Observable<IssueSyncLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        targetBlueprintId // 会自动转换为 target_blueprint_id
      },
      orderBy: 'syncedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据同步类型查询问题同步记录
   *
   * @param syncType 同步类型
   * @param options 查询选项
   * @returns Observable<IssueSyncLog[]>
   */
  findBySyncType(syncType: string, options?: QueryOptions): Observable<IssueSyncLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        syncType // 会自动转换为 sync_type
      },
      orderBy: 'syncedAt',
      orderDirection: 'desc'
    });
  }
}
