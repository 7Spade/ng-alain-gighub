import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type TodoStatusTrackingRow = Database['public']['Tables']['todo_status_tracking']['Row'];
type TodoStatusTrackingInsert = Database['public']['Tables']['todo_status_tracking']['Insert'];
type TodoStatusTrackingUpdate = Database['public']['Tables']['todo_status_tracking']['Update'];

/**
 * TodoStatusTracking 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type TodoStatusTracking = TodoStatusTrackingRow;
export type { TodoStatusTrackingInsert, TodoStatusTrackingUpdate };

/**
 * TodoStatusTracking Repository
 *
 * 提供待办状态追踪相关的数据访问方法
 *
 * @example
 * ```typescript
 * const trackingRepo = inject(TodoStatusTrackingRepository);
 * trackingRepo.findByTodoId('todo-id').subscribe(trackings => {
 *   console.log('Status tracking:', trackings);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TodoStatusTrackingRepository extends BaseRepository<TodoStatusTracking, TodoStatusTrackingInsert, TodoStatusTrackingUpdate> {
  protected tableName = 'todo_status_tracking';

  /**
   * 根据待办 ID 查询状态追踪
   *
   * @param todoId 待办 ID
   * @param options 查询选项
   * @returns Observable<TodoStatusTracking[]>
   */
  findByTodoId(todoId: string, options?: QueryOptions): Observable<TodoStatusTracking[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        todoId // 会自动转换为 todo_id
      },
      orderBy: 'changedAt', // 按变更时间排序
      orderDirection: 'desc'
    });
  }

  /**
   * 根据变更人 ID 查询状态追踪
   *
   * @param changedBy 变更人 ID
   * @param options 查询选项
   * @returns Observable<TodoStatusTracking[]>
   */
  findByChangedBy(changedBy: string, options?: QueryOptions): Observable<TodoStatusTracking[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        changedBy // 会自动转换为 changed_by
      },
      orderBy: 'changedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据目标状态查询状态追踪
   *
   * @param toStatus 目标状态
   * @param options 查询选项
   * @returns Observable<TodoStatusTracking[]>
   */
  findByToStatus(toStatus: string, options?: QueryOptions): Observable<TodoStatusTracking[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        toStatus // 会自动转换为 to_status
      },
      orderBy: 'changedAt',
      orderDirection: 'desc'
    });
  }
}
