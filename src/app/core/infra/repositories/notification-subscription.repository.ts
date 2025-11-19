import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type NotificationSubscriptionRow = Database['public']['Tables']['notification_subscriptions']['Row'];
type NotificationSubscriptionInsert = Database['public']['Tables']['notification_subscriptions']['Insert'];
type NotificationSubscriptionUpdate = Database['public']['Tables']['notification_subscriptions']['Update'];

/**
 * NotificationSubscription 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type NotificationSubscription = NotificationSubscriptionRow;
export type { NotificationSubscriptionInsert, NotificationSubscriptionUpdate };

/**
 * NotificationSubscription Repository
 *
 * 提供通知订阅相关的数据访问方法
 *
 * @example
 * ```typescript
 * const subscriptionRepo = inject(NotificationSubscriptionRepository);
 * subscriptionRepo.findByAccountId('account-id').subscribe(subscriptions => {
 *   console.log('Subscriptions:', subscriptions);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationSubscriptionRepository extends BaseRepository<
  NotificationSubscription,
  NotificationSubscriptionInsert,
  NotificationSubscriptionUpdate
> {
  protected tableName = 'notification_subscriptions';

  /**
   * 根据账户 ID 查询通知订阅
   *
   * @param accountId 账户 ID
   * @param options 查询选项
   * @returns Observable<NotificationSubscription[]>
   */
  findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationSubscription[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        accountId // 会自动转换为 account_id
      }
    });
  }

  /**
   * 根据订阅类型查询通知订阅
   *
   * @param subscribableType 订阅类型
   * @param options 查询选项
   * @returns Observable<NotificationSubscription[]>
   */
  findBySubscribableType(subscribableType: string, options?: QueryOptions): Observable<NotificationSubscription[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        subscribableType // 会自动转换为 subscribable_type
      }
    });
  }

  /**
   * 根据订阅对象查询通知订阅
   *
   * @param subscribableType 订阅类型
   * @param subscribableId 订阅对象 ID
   * @param options 查询选项
   * @returns Observable<NotificationSubscription[]>
   */
  findBySubscribableId(subscribableType: string, subscribableId: string, options?: QueryOptions): Observable<NotificationSubscription[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        subscribableType,
        subscribableId // 会自动转换为 subscribable_id
      }
    });
  }

  /**
   * 查询订阅关系
   *
   * @param accountId 账户 ID
   * @param subscribableType 订阅类型
   * @param subscribableId 订阅对象 ID
   * @returns Observable<NotificationSubscription | null>
   */
  findByAccountAndSubscribable(
    accountId: string,
    subscribableType: string,
    subscribableId: string
  ): Observable<NotificationSubscription | null> {
    return this.findAll({
      filters: {
        accountId,
        subscribableType,
        subscribableId
      }
    }).pipe(map(subscriptions => (subscriptions.length > 0 ? subscriptions[0] : null)));
  }
}
