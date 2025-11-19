import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import {
  CommentService,
  NotificationService,
  type Comment,
  type CommentInsert,
  type CommentUpdate,
  type Notification,
  type NotificationInsert
} from '@shared';
import { ErrorStateService } from '@shared/services/common/error-state.service';

import { RealtimeFacade } from './realtime.facade';

/**
 * Communication Facade
 *
 * Enterprise-grade facade for Communication management (Comments and Notifications).
 * Orchestrates CommentService and NotificationService to provide a unified
 * interface for all communication operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Real-time updates via RealtimeFacade
 * - Comment and notification management
 *
 * Key Features:
 * - Comment CRUD operations
 * - Nested comment replies
 * - @mention functionality
 * - Notification management
 * - Real-time comment and notification updates
 * - Computed state for filtered views and statistics
 *
 * @example
 * ```typescript
 * const facade = inject(CommunicationFacade);
 *
 * // Load comments by resource
 * await facade.loadCommentsByResource('task', 'task-id');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Comments:', facade.comments());
 *   console.log('Unread notifications:', facade.unreadNotifications());
 * });
 *
 * // Create comment
 * await facade.createComment({
 *   commentable_type: 'Task',
 *   commentable_id: 'task-id',
 *   content: 'Great work!',
 *   author_id: userId
 * });
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class CommunicationFacade implements OnDestroy {
  // Inject dependencies
  private readonly commentService = inject(CommentService);
  private readonly notificationService = inject(NotificationService);
  private readonly realtimeFacade = inject(RealtimeFacade);
  private readonly errorStateService = inject(ErrorStateService);

  // Signal state - Facade-specific state
  private readonly currentResourceState = signal<{ type: string; id: string } | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentResource = this.currentResourceState.asReadonly();
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly comments = this.commentService.comments;
  readonly commentsLoading = this.commentService.loading;
  readonly commentsError = this.commentService.error;

  readonly notifications = this.notificationService.notifications;
  readonly notificationsLoading = this.notificationService.loading;
  readonly notificationsError = this.notificationService.error;

  // Computed: Comment filters
  readonly topLevelComments = this.commentService.topLevelComments;
  readonly commentCount = this.commentService.commentCount;
  readonly recentComments = this.commentService.recentComments;

  // Computed: Notification filters
  readonly unreadNotifications = this.notificationService.unreadNotifications;
  readonly unreadCount = this.notificationService.unreadCount;
  readonly recentNotifications = this.notificationService.recentNotifications;
  readonly notificationsByType = this.notificationService.notificationsByType;

  // Computed: Communication statistics
  readonly communicationStats = computed(() => {
    const allComments = this.comments();
    const allNotifications = this.notifications();
    const unread = this.unreadNotifications();

    return {
      comments: {
        total: allComments.length,
        topLevel: this.topLevelComments().length,
        recent: this.recentComments().length
      },
      notifications: {
        total: allNotifications.length,
        unread: unread.length,
        read: allNotifications.length - unread.length,
        byType: {
          task: allNotifications.filter(
            n => (n as any).notification_type === 'task_assignment' || (n as any).notification_type === 'task_update'
          ).length,
          issue: allNotifications.filter(n => (n as any).notification_type === 'issue_mention').length,
          comment: allNotifications.filter(n => (n as any).notification_type === 'comment_reply').length,
          pr: allNotifications.filter(n => (n as any).notification_type === 'pr_review').length,
          system: allNotifications.filter(n => (n as any).notification_type === 'system').length
        }
      }
    };
  });

  private commentSubscriptionId: string | null = null;
  private notificationSubscriptionId: string | null = null;

  /**
   * Initialize facade
   */
  constructor() {
    // Monitor for errors
    effect(() => {
      const commentError = this.commentsError();
      const notificationError = this.notificationsError();

      if (commentError) {
        this.errorStateService.addError({
          message: commentError,
          category: 'BusinessLogic',
          severity: 'error'
        });
      }

      if (notificationError) {
        this.errorStateService.addError({
          message: notificationError,
          category: 'BusinessLogic',
          severity: 'error'
        });
      }
    });

    // Setup real-time subscriptions
    this.setupRealtimeSubscriptions();
  }

  ngOnDestroy(): void {
    // Cleanup real-time subscriptions
    if (this.commentSubscriptionId) {
      this.realtimeFacade.unsubscribe(this.commentSubscriptionId);
    }
    if (this.notificationSubscriptionId) {
      this.realtimeFacade.unsubscribe(this.notificationSubscriptionId);
    }
  }

  /**
   * Setup real-time subscriptions for comments and notifications
   */
  private setupRealtimeSubscriptions(): void {
    // Subscribe to comment changes
    this.commentSubscriptionId = this.realtimeFacade.subscribeToTable(
      {
        table: 'comments',
        events: ['INSERT', 'UPDATE', 'DELETE']
      },
      payload => {
        // Refresh comments when changes occur
        const resource = this.currentResource();
        if (resource) {
          this.loadCommentsByResource(resource.type, resource.id).catch(err =>
            console.warn('[CommunicationFacade] Failed to refresh comments:', err)
          );
        }
      }
    );

    // Subscribe to notification changes
    this.notificationSubscriptionId = this.realtimeFacade.subscribeToTable(
      {
        table: 'notifications',
        events: ['INSERT', 'UPDATE']
      },
      payload => {
        // Refresh notifications when changes occur
        // Note: This would typically filter by current user
        // We need userId to load unread notifications, so we skip auto-refresh here
        // Components should manually refresh when needed
      }
    );
  }

  // ============================================================================
  // Comment Operations
  // ============================================================================

  /**
   * Load comments by resource
   *
   * @param resourceType Resource type (Task, Issue, Document, etc.)
   * @param resourceId Resource ID
   */
  async loadCommentsByResource(resourceType: string, resourceId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_comments_by_resource');
    this.currentResourceState.set({ type: resourceType, id: resourceId });

    try {
      await this.commentService.loadByResource(resourceType, resourceId);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to load comments:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load comments by task ID
   *
   * @param taskId Task ID
   */
  async loadCommentsByTask(taskId: string): Promise<void> {
    return this.loadCommentsByResource('Task', taskId);
  }

  /**
   * Create comment
   *
   * @param data Comment data
   * @returns Created comment
   */
  async createComment(data: CommentInsert): Promise<Comment> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_comment');

    try {
      const comment = await this.commentService.create(data);
      return comment;
    } catch (error) {
      console.error('[CommunicationFacade] Failed to create comment:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update comment
   *
   * @param id Comment ID
   * @param data Update data
   * @returns Updated comment
   */
  async updateComment(id: string, data: CommentUpdate): Promise<Comment> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_comment');

    try {
      const comment = await this.commentService.update(id, data);
      return comment;
    } catch (error) {
      console.error('[CommunicationFacade] Failed to update comment:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete comment
   *
   * @param id Comment ID
   */
  async deleteComment(id: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_comment');

    try {
      await this.commentService.delete(id);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to delete comment:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Notification Operations
  // ============================================================================

  /**
   * Load notifications by user ID
   *
   * @param userId User ID
   */
  async loadNotificationsByUser(userId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_notifications_by_user');

    try {
      await this.notificationService.loadByUser(userId);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to load notifications:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load unread notifications
   *
   * @param userId User ID
   */
  async loadUnreadNotifications(userId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_unread_notifications');

    try {
      await this.notificationService.loadUnread(userId);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to load unread notifications:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create notification
   *
   * @param data Notification data
   * @returns Created notification
   */
  async createNotification(data: NotificationInsert): Promise<Notification> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_notification');

    try {
      const notification = await this.notificationService.create(data);
      return notification;
    } catch (error) {
      console.error('[CommunicationFacade] Failed to create notification:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Mark notification as read
   *
   * @param id Notification ID
   */
  async markNotificationAsRead(id: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('mark_notification_as_read');

    try {
      await this.notificationService.markAsRead(id);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to mark notification as read:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('mark_all_notifications_as_read');

    try {
      await this.notificationService.markAllAsRead();
    } catch (error) {
      console.error('[CommunicationFacade] Failed to mark all notifications as read:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete notification
   *
   * @param id Notification ID
   */
  async deleteNotification(id: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_notification');

    try {
      await this.notificationService.delete(id);
    } catch (error) {
      console.error('[CommunicationFacade] Failed to delete notification:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear error state
   */
  clearError(): void {
    // Services handle their own error clearing
  }

  /**
   * Reset facade state
   */
  reset(): void {
    this.currentResourceState.set(null);
    this.operationInProgressState.set(false);
    this.lastOperationState.set(null);
  }
}
