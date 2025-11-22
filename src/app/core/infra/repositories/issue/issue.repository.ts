import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type IssueRow = Database['public']['Tables']['issues']['Row'];
type IssueInsert = Database['public']['Tables']['issues']['Insert'];
type IssueUpdate = Database['public']['Tables']['issues']['Update'];

/**
 * Issue 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Issue = IssueRow;
export type { IssueInsert, IssueUpdate };

/**
 * Issue Repository
 *
 * 提供问题相关的数据访问方法
 *
 * @example
 * ```typescript
 * const issueRepo = inject(IssueRepository);
 * issueRepo.findByBlueprintId('blueprint-id').subscribe(issues => {
 *   console.log('Issues:', issues);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IssueRepository extends BaseRepository<Issue, IssueInsert, IssueUpdate> {
  protected tableName = 'issues';

  /**
   * 根据蓝图 ID 查询问题
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据分支 ID 查询问题
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 根据任务 ID 查询问题
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      }
    });
  }

  /**
   * 根据状态查询问题
   *
   * @param status 问题状态
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByStatus(status: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 根据严重程度查询问题
   *
   * @param severity 严重程度
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findBySeverity(severity: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        severity
      }
    });
  }

  /**
   * 根据问题类型查询问题
   *
   * @param issueType 问题类型
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByIssueType(issueType: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        issueType // 会自动转换为 issue_type
      }
    });
  }

  /**
   * 根据报告人查询问题
   *
   * @param reportedBy 报告人 ID
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findByReportedBy(reportedBy: string, options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        reportedBy // 会自动转换为 reported_by
      }
    });
  }

  /**
   * 查询未解决的问题
   *
   * @param blueprintId 蓝图 ID（可选）
   * @returns Observable<Issue[]>
   */
  findOpenIssues(blueprintId?: string): Observable<Issue[]> {
    const filters: Record<string, any> = {};
    // 未解决的问题：status 不为 'closed' 或 'resolved'
    // 由于 BaseRepository 的 filters 只支持等值查询，这里需要特殊处理
    // 使用 Supabase client 直接查询
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or('status.is.null,status.neq.closed,status.neq.resolved');

    if (blueprintId) {
      query = query.eq('blueprint_id', blueprintId);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询未解决问题失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Issue>(item));
      })
    );
  }

  /**
   * 查询已同步到主分支的问题
   *
   * @param options 查询选项
   * @returns Observable<Issue[]>
   */
  findSyncedToMain(options?: QueryOptions): Observable<Issue[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        syncedToMain: true // 会自动转换为 synced_to_main
      }
    });
  }

  /**
   * 搜索问题（按标题和描述）
   *
   * 使用全文搜索功能在问题的标题和描述中查找匹配的关键字
   *
   * @param query 搜索关键字
   * @param options 搜索选项
   * @param options.status 按状态筛选
   * @param options.priority 按优先级筛选
   * @param options.severity 按严重程度筛选
   * @param options.blueprintId 按蓝图筛选
   * @param options.assigneeId 按指派人筛选
   * @param options.page 页码（默认 1）
   * @param options.pageSize 每页数量（默认 50）
   * @returns Observable<Issue[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"bug"的问题
   * issueRepo.search('bug').subscribe(issues => {
   *   console.log('Found issues:', issues);
   * });
   *
   * // 搜索高优先级的问题
   * issueRepo.search('bug', { priority: IssuePriority.HIGH }).subscribe(issues => {
   *   console.log('High priority issues:', issues);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      status?: string;
      priority?: string;
      severity?: string;
      blueprintId?: string;
      assigneeId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<Issue[]> {
    // 构建基础查询
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`) as any;

    // 应用筛选条件
    if (options?.status) {
      supabaseQuery = supabaseQuery.eq('status', options.status);
    }

    if (options?.priority) {
      supabaseQuery = supabaseQuery.eq('priority', options.priority);
    }

    if (options?.severity) {
      supabaseQuery = supabaseQuery.eq('severity', options.severity);
    }

    if (options?.blueprintId) {
      supabaseQuery = supabaseQuery.eq('blueprint_id', options.blueprintId);
    }

    if (options?.assigneeId) {
      supabaseQuery = supabaseQuery.eq('assignee_id', options.assigneeId);
    }

    // 应用分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按更新时间倒序排序
    supabaseQuery = supabaseQuery.order('updated_at', { ascending: false });

    return from(Promise.resolve(supabaseQuery) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '搜索问题失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Issue>(item));
      })
    );
  }
}
