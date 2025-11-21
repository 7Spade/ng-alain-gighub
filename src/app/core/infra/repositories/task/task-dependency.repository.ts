import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Database } from '../../types/common';
import { TaskDependencyType } from '../../types/task';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * TaskDependency 实体类型（camelCase）
 */
type TaskDependencyRow = Database['public']['Tables']['task_dependencies']['Row'];
type TaskDependencyInsert = Database['public']['Tables']['task_dependencies']['Insert'];
type TaskDependencyUpdate = Database['public']['Tables']['task_dependencies']['Update'];

export type TaskDependency = TaskDependencyRow;
export type { TaskDependencyInsert, TaskDependencyUpdate };

/**
 * TaskDependency Repository
 *
 * 提供任务依赖关系相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class TaskDependencyRepository extends BaseRepository<TaskDependency, TaskDependencyInsert, TaskDependencyUpdate> {
  protected tableName = 'task_dependencies';

  /**
   * 根据任务 ID 查询依赖关系
   *
   * @param taskId 任务 ID
   * @param options 查询选项
   * @returns Observable<TaskDependency[]>
   */
  findByTaskId(taskId: string, options?: QueryOptions): Observable<TaskDependency[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskId // 会自动转换为 task_id
      }
    });
  }

  /**
   * 根据依赖任务 ID 查询依赖关系
   *
   * @param dependsOnTaskId 依赖的任务 ID
   * @param options 查询选项
   * @returns Observable<TaskDependency[]>
   */
  findByDependsOnTaskId(dependsOnTaskId: string, options?: QueryOptions): Observable<TaskDependency[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        dependsOnTaskId // 会自动转换为 depends_on_task_id
      }
    });
  }

  /**
   * 根据依赖类型查询依赖关系
   *
   * @param dependencyType 依赖类型
   * @param options 查询选项
   * @returns Observable<TaskDependency[]>
   */
  findByDependencyType(dependencyType: TaskDependencyType, options?: QueryOptions): Observable<TaskDependency[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        dependencyType // 会自动转换为 dependency_type
      }
    });
  }
}
