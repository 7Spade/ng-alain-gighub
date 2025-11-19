import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';
import { toCamelCaseData } from '../utils/transformers';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type NotificationRow = Database['public']['Tables']['notifications']['Row'];
type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

/**
 * Notification 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Notification = NotificationRow;
export type { NotificationInsert, NotificationUpdate };

/**
 * Notification Repository
 *
 * 提供通知相关的数据访问方法
 *
 * @example
 * ```typescript
 * const notificationRepo = inject(NotificationRepository);
 * notificationRepo.findByRecipientId('account-id').subscribe(notifications => {
 *   console.log('Notifications:', notifications);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationRepository extends BaseRepository<Notification, NotificationInsert, NotificationUpdate> {
  protected tableName = 'notifications';

  /**
   * 根据接收人 ID 查询通知
   *
   * @param recipientId 接收人 ID
   * @param options 查询选项
   * @returns Observable<Notification[]>
   */
  findByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        recipientId // 会自动转换为 recipient_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 查询未读通知
   *
   * @param recipientId 接收人 ID
   * @param options 查询选项
   * @returns Observable<Notification[]>
   */
  findUnreadByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]> {
    // 未读通知：is_read = false 或 null
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .eq('recipient_id', recipientId)
      .or('is_read.is.null,is_read.eq.false');

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询未读通知失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Notification>(item));
      })
    );
  }

  /**
   * 根据发送人 ID 查询通知
   *
   * @param senderId 发送人 ID
   * @param options 查询选项
   * @returns Observable<Notification[]>
   */
  findBySenderId(senderId: string, options?: QueryOptions): Observable<Notification[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        senderId // 会自动转换为 sender_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据通知类型查询通知
   *
   * @param notificationType 通知类型
   * @param options 查询选项
   * @returns Observable<Notification[]>
   */
  findByNotificationType(notificationType: string, options?: QueryOptions): Observable<Notification[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        notificationType // 会自动转换为 notification_type
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据关联对象查询通知
   *
   * @param relatedType 关联类型
   * @param relatedId 关联 ID
   * @param options 查询选项
   * @returns Observable<Notification[]>
   */
  findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<Notification[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        relatedType, // 会自动转换为 related_type
        relatedId // 会自动转换为 related_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 标记为已读
   *
   * @param notificationId 通知 ID
   * @returns Observable<void>
   */
  markAsRead(notificationId: string): Observable<void> {
    return this.update(notificationId, {
      isRead: true,
      readAt: new Date().toISOString()
    } as NotificationUpdate).pipe(map(() => undefined));
  }

  /**
   * 标记所有为已读
   *
   * @param recipientId 接收人 ID
   * @returns Observable<void>
   */
  markAllAsRead(recipientId: string): Observable<void> {
    // 使用 Supabase client 批量更新
    return from(
      this.supabase
        .from(this.tableName as any)
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('recipient_id', recipientId)
        .or('is_read.is.null,is_read.eq.false')
    ).pipe(
      map((response: { error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '标记所有通知为已读失败');
        }
      })
    );
  }
}
