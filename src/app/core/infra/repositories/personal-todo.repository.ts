import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { toCamelCaseData } from '../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type PersonalTodoRow = Database['public']['Tables']['personal_todos']['Row'];
type PersonalTodoInsert = Database['public']['Tables']['personal_todos']['Insert'];
type PersonalTodoUpdate = Database['public']['Tables']['personal_todos']['Update'];

/**
 * PersonalTodo 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type PersonalTodo = PersonalTodoRow;
export type { PersonalTodoInsert, PersonalTodoUpdate };

/**
 * PersonalTodo Repository
 *
 * 提供个人待办相关的数据访问方法
 *
 * @example
 * ```typescript
 * const todoRepo = inject(PersonalTodoRepository);
 * todoRepo.findByAccountId('account-id').subscribe(todos => {
 *   console.log('Todos:', todos);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PersonalTodoRepository extends BaseRepository<PersonalTodo, PersonalTodoInsert, PersonalTodoUpdate> {
  protected tableName = 'personal_todos';

  /**
   * 根据账户 ID 查询个人待办
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<PersonalTodo[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<PersonalTodo[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据状态查询个人待办
   *
   * @param status 待办状态
   * @param options 查询选项
   * @returns Observable<PersonalTodo[]>
   */
  findByStatus(status: string, options?: QueryOptions): Observable<PersonalTodo[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 根据待办类型查询个人待办
   *
   * @param todoType 待办类型
   * @param options 查询选项
   * @returns Observable<PersonalTodo[]>
   */
  findByTodoType(todoType: string, options?: QueryOptions): Observable<PersonalTodo[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        todoType // 会自动转换为 todo_type
      }
    });
  }

  /**
   * 根据关联对象查询个人待办
   *
   * @param relatedType 关联类型
   * @param relatedId 关联 ID
   * @param options 查询选项
   * @returns Observable<PersonalTodo[]>
   */
  findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<PersonalTodo[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        relatedType, // 会自动转换为 related_type
        relatedId // 会自动转换为 related_id
      }
    });
  }

  /**
   * 根据优先级查询个人待办
   *
   * @param priority 优先级
   * @param options 查询选项
   * @returns Observable<PersonalTodo[]>
   */
  findByPriority(priority: string, options?: QueryOptions): Observable<PersonalTodo[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        priority
      }
    });
  }

  /**
   * 查询过期待办
   *
   * @param accountId 账户 ID
   * @returns Observable<PersonalTodo[]>
   */
  findOverdue(accountId: string): Observable<PersonalTodo[]> {
    // 过期待办：due_date < NOW() 且 status 不为 'completed'
    // 需要使用 Supabase client 直接查询
    const now = new Date().toISOString();
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .eq('account_id', accountId)
      .lt('due_date', now)
      .or('status.is.null,status.neq.completed');

    query = query.order('due_date', { ascending: true });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询过期待办失败');
        }
        return (response.data || []).map(item => toCamelCaseData<PersonalTodo>(item));
      })
    );
  }

  /**
   * 查询待执行的待办
   *
   * @param accountId 账户 ID
   * @returns Observable<PersonalTodo[]>
   */
  findPending(accountId: string): Observable<PersonalTodo[]> {
    // 待执行的待办：status = 'pending' 或 null
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .eq('account_id', accountId)
      .or('status.is.null,status.eq.pending');

    query = query.order('created_at', { ascending: false });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询待执行待办失败');
        }
        return (response.data || []).map(item => toCamelCaseData<PersonalTodo>(item));
      })
    );
  }
}
