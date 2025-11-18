import { Injectable, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import type {
  OrganizationCollaboration,
  OrganizationCollaborationInsert,
  OrganizationCollaborationUpdate,
  CollaborationInvitation,
  CollaborationInvitationInsert
} from '@shared/models/collaboration.models';
import type { Notification, NotificationInsert, NotificationUpdate } from '@shared/models/communication.models';
import { CollaborationService } from '@shared/services/collaboration/collaboration.service';
import { NotificationService } from '@shared/services/collaboration/notification.service';
import { ErrorStateService } from '@shared/services/common/error-state.service';

import { RealtimeFacade } from './realtime.facade';

/**
 * CollaborationFacade - Enterprise collaboration and notification management facade
 *
 * Provides complete collaboration management with notifications and real-time updates.
 * Follows Angular 20 Signal patterns with automatic cleanup.
 *
 * Features:
 * - Organization collaboration CRUD operations
 * - Collaboration invitation system
 * - Member management
 * - Notification system (create, mark read, delete)
 * - Notification preferences
 * - Real-time notification updates via RealtimeFacade
 * - Computed signals for filtered views and statistics
 * - ErrorStateService integration for centralized error handling
 *
 * @example
 * ```typescript
 * const facade = inject(CollaborationFacade);
 *
 * // Create collaboration
 * const collab = await facade.createCollaboration({
 *   blueprint_id: 'bp-123',
 *   owner_org_id: 'org-1',
 *   collaborator_org_id: 'org-2',
 *   collaboration_type: 'contractor'
 * });
 *
 * // Send invitation
 * await facade.sendInvitation(collab.id, 'org-2');
 *
 * // Create notification
 * await facade.createNotification({
 *   recipient_id: userId,
 *   type: 'task_assigned',
 *   title: 'New task assigned',
 *   message: 'You have been assigned to Task #123'
 * });
 *
 * // Monitor state
 * effect(() => {
 *   console.log('Unread notifications:', facade.unreadNotifications());
 *   console.log('Pending invitations:', facade.pendingInvitations());
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CollaborationFacade implements OnDestroy {
  private readonly collaborationService = inject(CollaborationService);
  private readonly notificationService = inject(NotificationService);
  private readonly realtimeFacade = inject(RealtimeFacade);
  private readonly errorStateService = inject(ErrorStateService);

  // State signals
  readonly collaborations = signal<OrganizationCollaboration[]>([]);
  readonly invitations = signal<CollaborationInvitation[]>([]);
  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedCollaboration = signal<OrganizationCollaboration | null>(null);
  readonly lastOperation = signal<string>('');

  // Computed signals
  readonly activeCollaborations = computed(() => this.collaborations().filter(c => c.status === 'active'));

  readonly pendingInvitations = computed(() => this.invitations().filter(inv => inv.status === 'pending'));

  readonly unreadNotifications = computed(() => this.notifications().filter(notif => !notif.read_at));

  readonly notificationsByType = computed(() => {
    const notifs = this.notifications();
    return notifs.reduce(
      (acc, notif) => {
        const type = notif.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(notif);
        return acc;
      },
      {} as Record<string, Notification[]>
    );
  });

  readonly collaborationStats = computed(() => {
    const collabs = this.collaborations();
    const active = this.activeCollaborations();
    const pending = this.pendingInvitations();
    const unread = this.unreadNotifications();

    return {
      totalCollaborations: collabs.length,
      activeCollaborations: active.length,
      pendingInvitations: pending.length,
      unreadNotifications: unread.length,
      byStatus: {
        active: collabs.filter(c => c.status === 'active').length,
        pending: collabs.filter(c => c.status === 'pending').length,
        suspended: collabs.filter(c => c.status === 'suspended').length,
        ended: collabs.filter(c => c.status === 'ended').length
      },
      byType: {
        contractor: collabs.filter(c => c.collaboration_type === 'contractor').length,
        subcontractor: collabs.filter(c => c.collaboration_type === 'subcontractor').length,
        consultant: collabs.filter(c => c.collaboration_type === 'consultant').length,
        partner: collabs.filter(c => c.collaboration_type === 'partner').length
      }
    };
  });

  private notificationSubscriptionId: string | null = null;

  constructor() {
    // Monitor for errors
    effect(() => {
      const lastOp = this.lastOperation();
      if (lastOp) {
        console.log('[CollaborationFacade] Last operation:', lastOp);
      }
    });

    // Setup real-time notifications
    this.setupRealtimeNotifications();
  }

  ngOnDestroy(): void {
    // Cleanup real-time subscriptions
    if (this.notificationSubscriptionId) {
      this.realtimeFacade.unsubscribe(this.notificationSubscriptionId);
    }
  }

  /**
   * Setup real-time notification updates
   */
  private setupRealtimeNotifications(): void {
    this.notificationSubscriptionId = this.realtimeFacade.subscribeToTable(
      {
        table: 'notifications',
        schema: 'public',
        events: ['INSERT', 'UPDATE']
      },
      payload => {
        console.log('[CollaborationFacade] Notification update:', payload);

        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as Notification;
          this.notifications.set([newNotif, ...this.notifications()]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedNotif = payload.new as Notification;
          const notifs = this.notifications().map(n => (n.id === updatedNotif.id ? updatedNotif : n));
          this.notifications.set(notifs);
        }
      }
    );
  }

  /**
   * Load all collaborations
   */
  async loadCollaborations(): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadCollaborations');

    try {
      const collabs = await this.collaborationService.getAllCollaborations();
      this.collaborations.set(collabs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load collaborations',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadCollaborations', error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load collaborations by blueprint
   */
  async loadCollaborationsByBlueprint(blueprintId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadCollaborationsByBlueprint');

    try {
      const collabs = await this.collaborationService.getCollaborationsByBlueprint(blueprintId);
      this.collaborations.set(collabs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load blueprint collaborations',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadCollaborationsByBlueprint', blueprintId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load collaboration by ID
   */
  async loadCollaborationById(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadCollaborationById');

    try {
      const collab = await this.collaborationService.getCollaborationById(id);
      this.selectedCollaboration.set(collab);

      // Add to collaborations list if not already present
      const current = this.collaborations();
      if (!current.find(c => c.id === id)) {
        this.collaborations.set([...current, collab]);
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load collaboration',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadCollaborationById', id, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create new collaboration
   */
  async createCollaboration(data: CollaborationInsert): Promise<OrganizationCollaboration> {
    this.loading.set(true);
    this.lastOperation.set('createCollaboration');

    try {
      const collab = await this.collaborationService.createCollaboration(data);

      // Update state
      this.collaborations.set([...this.collaborations(), collab]);
      this.selectedCollaboration.set(collab);

      return collab;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create collaboration',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'createCollaboration', data, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Update collaboration
   */
  async updateCollaboration(id: string, data: CollaborationUpdate): Promise<OrganizationCollaboration> {
    this.loading.set(true);
    this.lastOperation.set('updateCollaboration');

    try {
      const collab = await this.collaborationService.updateCollaboration(id, data);

      // Update state
      const collabs = this.collaborations().map(c => (c.id === id ? collab : c));
      this.collaborations.set(collabs);

      if (this.selectedCollaboration()?.id === id) {
        this.selectedCollaboration.set(collab);
      }

      return collab;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to update collaboration',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'updateCollaboration', id, data, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Delete collaboration
   */
  async deleteCollaboration(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('deleteCollaboration');

    try {
      await this.collaborationService.deleteCollaboration(id);

      // Update state
      this.collaborations.set(this.collaborations().filter(c => c.id !== id));

      if (this.selectedCollaboration()?.id === id) {
        this.selectedCollaboration.set(null);
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to delete collaboration',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'deleteCollaboration', id, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Send collaboration invitation
   */
  async sendInvitation(collaborationId: string, invitedOrgId: string): Promise<CollaborationInvitation> {
    this.loading.set(true);
    this.lastOperation.set('sendInvitation');

    try {
      const invitation = await this.collaborationService.sendInvitation(collaborationId, invitedOrgId);

      // Update state
      this.invitations.set([...this.invitations(), invitation]);

      return invitation;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to send invitation',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'sendInvitation', collaborationId, invitedOrgId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Accept invitation
   */
  async acceptInvitation(invitationId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('acceptInvitation');

    try {
      await this.collaborationService.acceptInvitation(invitationId);

      // Update state
      const invitations = this.invitations().map(inv => (inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv));
      this.invitations.set(invitations);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to accept invitation',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'acceptInvitation', invitationId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Reject invitation
   */
  async rejectInvitation(invitationId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('rejectInvitation');

    try {
      await this.collaborationService.rejectInvitation(invitationId);

      // Update state
      const invitations = this.invitations().map(inv => (inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv));
      this.invitations.set(invitations);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to reject invitation',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'rejectInvitation', invitationId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load notifications for user
   */
  async loadNotifications(userId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadNotifications');

    try {
      const notifs = await this.notificationService.getNotificationsByUser(userId);
      this.notifications.set(notifs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load notifications',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadNotifications', userId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create notification
   */
  async createNotification(data: NotificationInsert): Promise<Notification> {
    this.loading.set(true);
    this.lastOperation.set('createNotification');

    try {
      const notif = await this.notificationService.createNotification(data);

      // Update state (real-time will also add it, but this ensures immediate update)
      this.notifications.set([notif, ...this.notifications()]);

      return notif;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create notification',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'createNotification', data, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('markAsRead');

    try {
      await this.notificationService.markAsRead(notificationId);

      // Update state
      const notifs = this.notifications().map(n => (n.id === notificationId ? { ...n, read_at: new Date() } : n));
      this.notifications.set(notifs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to mark notification as read',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'markAsRead', notificationId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('markAllAsRead');

    try {
      await this.notificationService.markAllAsRead(userId);

      // Update state
      const notifs = this.notifications().map(n => ({
        ...n,
        read_at: n.read_at || new Date()
      }));
      this.notifications.set(notifs);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to mark all notifications as read',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'markAllAsRead', userId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('deleteNotification');

    try {
      await this.notificationService.deleteNotification(notificationId);

      // Update state
      this.notifications.set(this.notifications().filter(n => n.id !== notificationId));
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to delete notification',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'deleteNotification', notificationId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Clear all notifications for user
   */
  async clearAllNotifications(userId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('clearAllNotifications');

    try {
      await this.notificationService.clearAllNotifications(userId);

      // Update state
      this.notifications.set([]);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to clear all notifications',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'clearAllNotifications', userId, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Select collaboration for detail view
   */
  selectCollaboration(collaboration: OrganizationCollaboration | null): void {
    this.selectedCollaboration.set(collaboration);
    this.lastOperation.set('selectCollaboration');
  }

  /**
   * Clear selected collaboration
   */
  clearSelection(): void {
    this.selectedCollaboration.set(null);
    this.lastOperation.set('clearSelection');
  }
}
