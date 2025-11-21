import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BotExecutionLogRow = Database['public']['Tables']['bot_execution_logs']['Row'];
type BotExecutionLogInsert = Database['public']['Tables']['bot_execution_logs']['Insert'];
type BotExecutionLogUpdate = Database['public']['Tables']['bot_execution_logs']['Update'];

/**
 * BotExecutionLog 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type BotExecutionLog = BotExecutionLogRow;
export type { BotExecutionLogInsert, BotExecutionLogUpdate };

/**
 * BotExecutionLog Repository
 *
 * 提供机器人执行日志相关的数据访问方法
 *
 * @example
 * ```typescript
 * const logRepo = inject(BotExecutionLogRepository);
 * logRepo.findByBotId('bot-id').subscribe(logs => {
 *   console.log('Execution logs:', logs);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BotExecutionLogRepository extends BaseRepository<BotExecutionLog, BotExecutionLogInsert, BotExecutionLogUpdate> {
  protected tableName = 'bot_execution_logs';

  /**
   * 根据机器人 ID 查询执行日志
   *
   * @param botId 机器人 ID
   * @param options 查询选项
   * @returns Observable<BotExecutionLog[]>
   */
  findByBotId(botId: string, options?: QueryOptions): Observable<BotExecutionLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        botId // 会自动转换为 bot_id
      },
      orderBy: 'executedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据机器人任务 ID 查询执行日志
   *
   * @param botTaskId 机器人任务 ID
   * @param options 查询选项
   * @returns Observable<BotExecutionLog[]>
   */
  findByBotTaskId(botTaskId: string, options?: QueryOptions): Observable<BotExecutionLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        botTaskId // 会自动转换为 bot_task_id
      },
      orderBy: 'executedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据执行状态查询执行日志
   *
   * @param executionStatus 执行状态
   * @param options 查询选项
   * @returns Observable<BotExecutionLog[]>
   */
  findByExecutionStatus(executionStatus: string, options?: QueryOptions): Observable<BotExecutionLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        executionStatus // 会自动转换为 execution_status
      },
      orderBy: 'executedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 查询最近的执行日志
   *
   * @param botId 机器人 ID（可选）
   * @param limit 限制数量（默认 50）
   * @returns Observable<BotExecutionLog[]>
   */
  findRecentLogs(botId?: string, limit = 50): Observable<BotExecutionLog[]> {
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .order('executed_at', { ascending: false })
      .limit(limit);

    if (botId) {
      query = query.eq('bot_id', botId);
    }

    return this.findAll({
      filters: botId ? { botId } : undefined,
      orderBy: 'executed_at',
      orderDirection: 'desc'
    }).pipe(map((logs: BotExecutionLog[]) => logs.slice(0, limit)));
  }

  /**
   * 查询失败的执行日志
   *
   * @param botId 机器人 ID（可选）
   * @param options 查询选项
   * @returns Observable<BotExecutionLog[]>
   */
  findFailedLogs(botId?: string, options?: QueryOptions): Observable<BotExecutionLog[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        executionStatus: 'failed',
        ...(botId ? { botId } : {})
      },
      orderBy: 'executedAt',
      orderDirection: 'desc'
    });
  }
}
