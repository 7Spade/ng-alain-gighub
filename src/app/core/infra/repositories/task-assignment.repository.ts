import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { TaskAssigneeType } from '../types/task.types';

/**
 * TaskAssignment 实体类型（camelCase）
 */
type TaskAssignmentRow = Database['public']['Tables']['task_assignments']['Row'];
type TaskAssignmentInsert = Database['public']['Tables']['task_assignments']['Insert'];
type TaskAssignmentUpdate = Database['public']['Tables']['task_assignments']['Update'];

export type TaskAssignment = TaskAssignmentRow;
export type { TaskAssignmentInsert, TaskAssignmentUpdate };

/**
 * TaskAssignment Repository
 *
 * 提供任务指派相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class TaskAssignmentRepository extends BaseRepository<TaskAssignment, TaskAssignmentInsert, TaskAssignmentUpdate> {
  protected tableName = 'task_assignments';

  /**
   * 根据任务 ID 查询指派
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<TaskAssignment[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<TaskAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      }
    });
  }

  /**
   * 根据指派对象 ID 查询指派
   *
   * @param assigneeId 指派对象 ID
   * @param options 查询选项
   * @returns Observable<TaskAssignment[]>
   */
  findByAssigneeId(assigneeId: string, options?: QueryOptions): Observable<TaskAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        assigneeId // 会自动转换为 assignee_id
      }
    });
  }

  /**
   * 根据指派类型查询指派
   *
   * @param assigneeType 指派类型
   * @param options 查询选项
   * @returns Observable<TaskAssignment[]>
   */
  findByAssigneeType(assigneeType: TaskAssigneeType, options?: QueryOptions): Observable<TaskAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        assigneeType // 会自动转换为 assignee_type
      }
    });
  }

  /**
   * 根据指派者 ID 查询指派
   *
   * @param assignedBy 指派者 ID
   * @param options 查询选项
   * @returns Observable<TaskAssignment[]>
   */
  findByAssignedBy(assignedBy: string, options?: QueryOptions): Observable<TaskAssignment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        assignedBy // 会自动转换为 assigned_by
      }
    });
  }
}
