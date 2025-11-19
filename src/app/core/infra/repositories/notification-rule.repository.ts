import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type NotificationRuleRow = Database['public']['Tables']['notification_rules']['Row'];
type NotificationRuleInsert = Database['public']['Tables']['notification_rules']['Insert'];
type NotificationRuleUpdate = Database['public']['Tables']['notification_rules']['Update'];

/**
 * NotificationRule 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type NotificationRule = NotificationRuleRow;
export type { NotificationRuleInsert, NotificationRuleUpdate };

/**
 * NotificationRule Repository
 *
 * 提供通知规则相关的数据访问方法
 *
 * @example
 * ```typescript
 * const notificationRuleRepo = inject(NotificationRuleRepository);
 * notificationRuleRepo.findByAccountId('account-id').subscribe(rules => {
 *   console.log('Notification rules:', rules);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationRuleRepository extends BaseRepository<NotificationRule, NotificationRuleInsert, NotificationRuleUpdate> {
  protected tableName = 'notification_rules';

  /**
   * 根据账户 ID 查询通知规则
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<NotificationRule[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationRule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据通知类型查询通知规则
   *
   * @param notificationType 通知类型
   * @param options 查询选项
   * @returns Observable<NotificationRule[]>
   */
  findByNotificationType(notificationType: string, options?: QueryOptions): Observable<NotificationRule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        notificationType // 会自动转换为 notification_type
      }
    });
  }

  /**
   * 查询启用的规则
   *
   * @param accountId 账户 ID
   * @returns Observable<NotificationRule[]>
   */
  findEnabledRules(accountId: string): Observable<NotificationRule[]> {
    return this.findAll({
      filters: {
        accountId,
        isEnabled: true // 会自动转换为 is_enabled
      }
    });
  }

  /**
   * 根据渠道查询通知规则
   *
   * @param channel 渠道
   * @param options 查询选项
   * @returns Observable<NotificationRule[]>
   */
  findByChannel(channel: string, options?: QueryOptions): Observable<NotificationRule[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        channel
      }
    });
  }
}
