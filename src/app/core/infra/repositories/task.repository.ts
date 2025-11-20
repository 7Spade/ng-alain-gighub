import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../errors/supabase-error.transformer';
import { Database } from '../types/common';
import { TaskPriority, TaskStatus, TaskType } from '../types/task';
import { toCamelCaseData } from '../utils/transformers';
import { BaseRepository, QueryOptions } from './base.repository';

/**
 * Task 实体类型（camelCase）
 * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
 */
type TaskRow = Database['public']['Tables']['tasks']['Row'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

/**
 * Task 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Task = TaskRow;
export type { TaskInsert, TaskUpdate };

/**
 * Task Repository
 *
 * 提供任务相关的数据访问方法，包括树状结构查询
 *
 * @example
 * ```typescript
 * const taskRepo = inject(TaskRepository);
 * taskRepo.findByBlueprintId('blueprint-id').subscribe(tasks => {
 *   console.log('Blueprint tasks:', tasks);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskRepository extends BaseRepository<Task, TaskInsert, TaskUpdate> {
  protected tableName = 'tasks';

  /**
   * 根据蓝图 ID 查询任务
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      }
    });
  }

  /**
   * 根据分支 ID 查询任务
   *
   * @param branchId 分支 ID
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByBranchId(branchId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        branchId // 会自动转换为 branch_id
      }
    });
  }

  /**
   * 根据父任务 ID 查询子任务
   *
   * @param parentTaskId 父任务 ID
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findChildren(parentTaskId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        parentTaskId // 会自动转换为 parent_task_id
      },
      orderBy: 'sequence_order',
      orderDirection: 'asc'
    });
  }

  /**
   * 查询根任务（没有父任务的任务）
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findRootTasks(blueprintId: string, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId,
        parentTaskId: null // 根任务没有父任务
      },
      orderBy: 'sequence_order',
      orderDirection: 'asc'
    });
  }

  /**
   * 根据状态查询任务
   *
   * @param status 任务状态
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByStatus(status: TaskStatus, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 根据类型查询任务
   *
   * @param taskType 任务类型
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByType(taskType: TaskType, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskType // 会自动转换为 task_type
      }
    });
  }

  /**
   * 根据优先级查询任务
   *
   * @param priority 任务优先级
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByPriority(priority: TaskPriority, options?: QueryOptions): Observable<Task[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        priority
      }
    });
  }

  /**
   * 查询待处理的任务（状态为 pending）
   *
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findPending(options?: QueryOptions): Observable<Task[]> {
    return this.findByStatus(TaskStatus.PENDING, options);
  }

  /**
   * 查询进行中的任务（状态为 in_progress）
   *
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findInProgress(options?: QueryOptions): Observable<Task[]> {
    return this.findByStatus(TaskStatus.IN_PROGRESS, options);
  }

  /**
   * 查询已完成的任务（状态为 completed）
   *
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findCompleted(options?: QueryOptions): Observable<Task[]> {
    return this.findByStatus(TaskStatus.COMPLETED, options);
  }

  /**
   * 使用 ltree 查询子树
   *
   * 注意：此方法需要使用 PostgreSQL ltree 操作符
   * 如果 BaseRepository 不支持，可能需要使用 RPC 函数或原生 SQL
   *
   * @param treePath ltree 路径
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findSubtree(treePath: string, options?: QueryOptions): Observable<Task[]> {
    // TODO: 实现 ltree 查询
    // 需要使用 PostgreSQL 的 <@ 操作符或 RPC 函数
    // 示例：WHERE tree_path <@ 'path.to.parent'
    // 当前先使用简单的 parent_task_id 查询作为临时方案
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters
        // treePath 查询需要特殊处理
      }
    });
  }

  /**
   * 查询任务的完整路径（从根到当前任务）
   *
   * @param taskId 任务 ID
   * @returns Observable<Task[]>
   */
  findTaskPath(taskId: string): Observable<Task[]> {
    // TODO: 实现路径查询
    // 需要使用递归查询或 ltree 操作符
    // 当前先返回单个任务作为临时方案
    return this.findById(taskId).pipe(map(task => (task ? [task] : [])));
  }

  /**
   * 根据任务 ID 列表批量查询任务
   *
   * @param taskIds 任务 ID 列表
   * @param options 查询选项
   * @returns Observable<Task[]>
   */
  findByIds(taskIds: string[], options?: QueryOptions): Observable<Task[]> {
    if (taskIds.length === 0) {
      return from(Promise.resolve([]));
    }

    // 使用 Supabase 的 in 操作符批量查询
    let query = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .in('id', taskIds) as any;

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.findByIds`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<Task>(item)) : [toCamelCaseData<Task>(data)];
      })
    );
  }
}
