import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

/**
 * TaskTemplate 实体类型（camelCase）
 */
type TaskTemplateRow = Database['public']['Tables']['task_templates']['Row'];
type TaskTemplateInsert = Database['public']['Tables']['task_templates']['Insert'];
type TaskTemplateUpdate = Database['public']['Tables']['task_templates']['Update'];

export type TaskTemplate = TaskTemplateRow;
export type { TaskTemplateInsert, TaskTemplateUpdate };

/**
 * TaskTemplate Repository
 *
 * 提供任务模板相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class TaskTemplateRepository extends BaseRepository<TaskTemplate, TaskTemplateInsert, TaskTemplateUpdate> {
  protected tableName = 'task_templates';

  /**
   * 根据组织 ID 查询任务模板
   *
   * @param organizationId 组织 ID
   * @param options 查询选项
   * @returns Observable<TaskTemplate[]>
   */
  findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<TaskTemplate[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        organizationId // 会自动转换为 organization_id
      }
    });
  }

  /**
   * 查询公共模板（is_public = true）
   *
   * @param options 查询选项
   * @returns Observable<TaskTemplate[]>
   */
  findPublic(options?: QueryOptions): Observable<TaskTemplate[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isPublic: true // 会自动转换为 is_public
      }
    });
  }
}
