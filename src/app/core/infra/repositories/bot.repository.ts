import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type BotRow = Database['public']['Tables']['bots']['Row'];
type BotInsert = Database['public']['Tables']['bots']['Insert'];
type BotUpdate = Database['public']['Tables']['bots']['Update'];

/**
 * Bot 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Bot = BotRow;
export type { BotInsert, BotUpdate };

/**
 * Bot Repository
 *
 * 提供机器人相关的数据访问方法
 *
 * @example
 * ```typescript
 * const botRepo = inject(BotRepository);
 * botRepo.findByAccountId('account-id').subscribe(bots => {
 *   console.log('Bots:', bots);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BotRepository extends BaseRepository<Bot, BotInsert, BotUpdate> {
  protected tableName = 'bots';

  /**
   * 根据账户 ID 查询机器人
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<Bot[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<Bot[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据机器人类型查询机器人
   *
   * @param botType 机器人类型
   * @param options 查询选项
   * @returns Observable<Bot[]>
   */
  findByBotType(botType: string, options?: QueryOptions): Observable<Bot[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        botType // 会自动转换为 bot_type
      }
    });
  }

  /**
   * 查询启用的机器人
   *
   * @param options 查询选项
   * @returns Observable<Bot[]>
   */
  findEnabledBots(options?: QueryOptions): Observable<Bot[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isEnabled: true // 会自动转换为 is_enabled
      }
    });
  }

  /**
   * 根据创建人 ID 查询机器人
   *
   * @param createdBy 创建人 ID
   * @param options 查询选项
   * @returns Observable<Bot[]>
   */
  findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Bot[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        createdBy // 会自动转换为 created_by
      }
    });
  }
}
