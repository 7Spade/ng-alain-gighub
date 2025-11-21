import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';
import { TaskListType } from '../../types/task';

/**
 * TaskList 实体类型（camelCase）
 */
type TaskListRow = Database['public']['Tables']['task_lists']['Row'];
type TaskListInsert = Database['public']['Tables']['task_lists']['Insert'];
type TaskListUpdate = Database['public']['Tables']['task_lists']['Update'];

export type TaskList = TaskListRow;
export type { TaskListInsert, TaskListUpdate };

/**
 * TaskList Repository
 *
 * 提供任务列表相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class TaskListRepository extends BaseRepository<TaskList, TaskListInsert, TaskListUpdate> {
  protected tableName = 'task_lists';

  /**
   * 根据账户 ID 查询任务列表
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<TaskList[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<TaskList[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据任务 ID 查询任务列表
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<TaskList[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<TaskList[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      }
    });
  }

  /**
   * 根据列表类型查询任务列表
   *
   * @param listType 列表类型
   * @param options 查询选项
   * @returns Observable<TaskList[]>
   */
  findByListType(listType: TaskListType, options?: QueryOptions): Observable<TaskList[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        listType // 会自动转换为 list_type
      }
    });
  }

  /**
   * 查询已指派的任务列表
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<TaskList[]>
   */
  findAssigned(accountId: string, options?: QueryOptions): Observable<TaskList[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId,
        listType: TaskListType.ASSIGNED
      }
    });
  }
}
