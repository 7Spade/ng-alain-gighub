import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BotTaskRow = Database['public']['Tables']['bot_tasks']['Row'];
type BotTaskInsert = Database['public']['Tables']['bot_tasks']['Insert'];
type BotTaskUpdate = Database['public']['Tables']['bot_tasks']['Update'];

/**
 * BotTask 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BotTask = BotTaskRow;
export type { BotTaskInsert, BotTaskUpdate };

/**
 * BotTask Repository
 *
 * 提供机器人任务相关的数据访问方法
 *
 * @example
 * ```typescript
 * const botTaskRepo = inject(BotTaskRepository);
 * botTaskRepo.findByBotId('bot-id').subscribe(tasks => {
 *   console.log('Bot tasks:', tasks);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BotTaskRepository extends BaseRepository<BotTask, BotTaskInsert, BotTaskUpdate> {
  protected tableName = 'bot_tasks';

  /**
   * 根据机器人 ID 查询机器人任务
   *
   * @param botId 机器人 ID
   * @param options 查询选项
   * @returns Observable<BotTask[]>
   */
  findByBotId(botId: string, options?: QueryOptions): Observable<BotTask[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        botId // 会自动转换为 bot_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据状态查询机器人任务
   *
   * @param status 任务状态
   * @param options 查询选项
   * @returns Observable<BotTask[]>
   */
  findByStatus(status: string, options?: QueryOptions): Observable<BotTask[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        status
      }
    });
  }

  /**
   * 查询待处理任务
   *
   * @param options 查询选项
   * @returns Observable<BotTask[]>
   */
  findPendingTasks(options?: QueryOptions): Observable<BotTask[]> {
    // 待处理任务：status = 'pending' 或 null
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or('status.is.null,status.eq.pending')
      .order('priority', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: true });

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询待处理任务失败');
        }
        return (response.data || []).map(item => toCamelCaseData<BotTask>(item));
      })
    );
  }

  /**
   * 根据任务类型查询机器人任务
   *
   * @param taskType 任务类型
   * @param options 查询选项
   * @returns Observable<BotTask[]>
   */
  findByTaskType(taskType: string, options?: QueryOptions): Observable<BotTask[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        taskType // 会自动转换为 task_type
      }
    });
  }

  /**
   * 查询计划执行的任务
   *
   * @param scheduledAt 计划执行时间
   * @returns Observable<BotTask[]>
   */
  findScheduledTasks(scheduledAt: Date): Observable<BotTask[]> {
    // 计划执行的任务：scheduled_at <= scheduledAt 且 status = 'pending'
    const scheduledAtStr = scheduledAt.toISOString();
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .lte('scheduled_at', scheduledAtStr)
      .or('status.is.null,status.eq.pending')
      .order('scheduled_at', { ascending: true });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询计划执行任务失败');
        }
        return (response.data || []).map(item => toCamelCaseData<BotTask>(item));
      })
    );
  }
}
