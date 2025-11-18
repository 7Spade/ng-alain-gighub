import { Injectable, inject, signal, computed } from '@angular/core';
import { NotificationRepository, NotificationRuleRepository, NotificationSubscriptionRepository } from '@core';
import {
  Notification,
  NotificationInsert,
  NotificationRule,
  NotificationRuleInsert,
  NotificationSubscription,
  NotificationSubscriptionInsert
} from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Notification Detail
 *
 * 聚合通知相關資訊
 */
export interface NotificationDetail extends Notification {
  relatedEntity?: {
    type: string;
    id: string;
    title?: string;
  };
}

/**
 * Notification Service
 *
 * 提供通知中心相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援功能：
 * - 多種通知類型（任務、問題、留言、PR、系統）
 * - 通知規則管理
 * - 通知訂閱管理
 * - Realtime 推送（配合 Supabase Realtime）
 *
 * @example
 * ```typescript
 * const notificationService = inject(NotificationService);
 *
 * // 載入未讀通知
 * await notificationService.loadUnread();
 *
 * // 訂閱通知狀態
 * effect(() => {
 *   console.log('Unread count:', notificationService.unreadCount());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationRepository = inject(NotificationRepository);
  private notificationRuleRepository = inject(NotificationRuleRepository);
  private notificationSubscriptionRepository = inject(NotificationSubscriptionRepository);

  // 使用 Signals 管理狀態
  private notificationsState = signal<Notification[]>([]);
  private rulesState = signal<NotificationRule[]>([]);
  private subscriptionsState = signal<NotificationSubscription[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly notifications = this.notificationsState.asReadonly();
  readonly rules = this.rulesState.asReadonly();
  readonly subscriptions = this.subscriptionsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly unreadNotifications = computed(() => this.notifications().filter(n => !n.isRead));

  readonly unreadCount = computed(() => this.unreadNotifications().length);

  readonly recentNotifications = computed(() =>
    [...this.notifications()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20)
  );

  readonly notificationsByType = computed(() => {
    const notifications = this.notifications();
    return {
      task: notifications.filter(n => n.notificationType === 'task'),
      issue: notifications.filter(n => n.notificationType === 'issue'),
      comment: notifications.filter(n => n.notificationType === 'comment'),
      pullRequest: notifications.filter(n => n.notificationType === 'pull_request'),
      system: notifications.filter(n => n.notificationType === 'system')
    };
  });

  /**
   * 載入指定使用者的所有通知
   */
  async loadByUser(userId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.notificationRepository.findByUserId(userId));
      this.notificationsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入未讀通知
   */
  async loadUnread(userId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.notificationRepository.findUnread(userId));
      this.notificationsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入未讀通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定類型的通知
   */
  async loadByType(userId: string, notificationType: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.notificationRepository.findByType(userId, notificationType));
      this.notificationsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入通知類型失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新通知
   */
  async create(data: NotificationInsert): Promise<Notification> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const notification = await firstValueFrom(this.notificationRepository.create(data));

      // 更新本地狀態
      this.notificationsState.update(current => [notification, ...current]);

      return notification;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 標記通知為已讀
   */
  async markAsRead(id: string): Promise<Notification> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(
        this.notificationRepository.update(id, {
          isRead: true,
          readAt: new Date().toISOString()
        })
      );

      // 更新本地狀態
      this.notificationsState.update(current => current.map(n => (n.id === id ? updated : n)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '標記通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批量標記通知為已讀
   */
  async markAllAsRead(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const unread = this.unreadNotifications();
      await Promise.all(
        unread.map(n => firstValueFrom(this.notificationRepository.update(n.id, { isRead: true, readAt: new Date().toISOString() })))
      );

      // 更新本地狀態
      this.notificationsState.update(current =>
        current.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString()
        }))
      );
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批量標記通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除通知
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.notificationRepository.delete(id));

      // 更新本地狀態
      this.notificationsState.update(current => current.filter(n => n.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入通知規則
   */
  async loadRules(userId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.notificationRuleRepository.findByUserId(userId));
      this.rulesState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入通知規則失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建通知規則
   */
  async createRule(data: NotificationRuleInsert): Promise<NotificationRule> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const rule = await firstValueFrom(this.notificationRuleRepository.create(data));

      // 更新本地狀態
      this.rulesState.update(current => [...current, rule]);

      return rule;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建通知規則失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入通知訂閱
   */
  async loadSubscriptions(userId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.notificationSubscriptionRepository.findByUserId(userId));
      this.subscriptionsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入通知訂閱失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 訂閱資源通知
   */
  async subscribe(data: NotificationSubscriptionInsert): Promise<NotificationSubscription> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const subscription = await firstValueFrom(this.notificationSubscriptionRepository.create(data));

      // 更新本地狀態
      this.subscriptionsState.update(current => [...current, subscription]);

      return subscription;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '訂閱通知失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 取消訂閱資源通知
   */
  async unsubscribe(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.notificationSubscriptionRepository.delete(id));

      // 更新本地狀態
      this.subscriptionsState.update(current => current.filter(s => s.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '取消訂閱失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.notificationsState.set([]);
    this.rulesState.set([]);
    this.subscriptionsState.set([]);
    this.errorState.set(null);
  }
}
