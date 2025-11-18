import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { ErrorStateService } from '../../shared/services/common/error-state.service';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Subscription Configuration
 */
export interface SubscriptionConfig {
  /** Subscription ID (auto-generated if not provided) */
  id?: string;
  /** Table name to subscribe to */
  table?: string;
  /** Schema name (default: 'public') */
  schema?: string;
  /** Filter string (e.g., 'blueprint_id=eq.123') */
  filter?: string;
  /** Event types to listen for (default: all) */
  events?: Array<'INSERT' | 'UPDATE' | 'DELETE' | '*'>;
  /** Channel name for broadcast/presence */
  channelName?: string;
}

/**
 * Subscription Info
 */
export interface SubscriptionInfo {
  /** Subscription ID */
  id: string;
  /** Subscription type */
  type: 'table' | 'broadcast' | 'presence';
  /** Channel instance */
  channel: RealtimeChannel;
  /** Configuration used */
  config: SubscriptionConfig;
  /** Subscription status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  /** Created timestamp */
  createdAt: Date;
}

/**
 * Realtime Facade
 *
 * Enterprise-grade centralized real-time subscription management facade.
 * Manages all Supabase Realtime subscriptions in one place with automatic cleanup.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Centralized subscription management
 * - Automatic cleanup on destroy
 * - Connection state monitoring
 * - Reconnection handling
 * - Error handling via ErrorStateService
 * - Subscription registry for debugging
 *
 * Key Features:
 * - Database change subscriptions (INSERT, UPDATE, DELETE)
 * - Broadcast messaging
 * - Presence tracking
 * - Automatic cleanup on destroy
 * - Connection state monitoring
 * - Subscription filtering
 * - Multiple simultaneous subscriptions
 * - Subscription registry and inspection
 *
 * @example
 * ```typescript
 * const realtimeFacade = inject(RealtimeFacade);
 *
 * // Subscribe to table changes
 * const subscriptionId = realtimeFacade.subscribeToTable<Task>({
 *   table: 'tasks',
 *   filter: 'blueprint_id=eq.123',
 *   events: ['INSERT', 'UPDATE', 'DELETE']
 * }, (payload) => {
 *   console.log('Task changed:', payload);
 * });
 *
 * // Subscribe to broadcast
 * const broadcastId = realtimeFacade.subscribeToBroadcast({
 *   channelName: 'task-updates'
 * }, 'status-change', (payload) => {
 *   console.log('Broadcast received:', payload);
 * });
 *
 * // Check connection state
 * effect(() => {
 *   console.log('Connection:', realtimeFacade.connectionState());
 *   console.log('Active subscriptions:', realtimeFacade.activeSubscriptions());
 * });
 *
 * // Unsubscribe
 * realtimeFacade.unsubscribe(subscriptionId);
 * ```
 *
 * @see docs/11-元件模組視圖.mermaid.md
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class RealtimeFacade implements OnDestroy {
  // Inject dependencies
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);

  // Signal state
  private readonly subscriptionsState = signal<Map<string, SubscriptionInfo>>(new Map());
  private readonly connectionStateSignal = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');
  private readonly lastConnectionUpdateSignal = signal<Date | null>(null);

  // Readonly signals exposed to consumers
  /** All active subscriptions */
  readonly subscriptions = this.subscriptionsState.asReadonly();

  /** Overall connection state */
  readonly connectionState = this.connectionStateSignal.asReadonly();

  /** Last connection state update time */
  readonly lastConnectionUpdate = this.lastConnectionUpdateSignal.asReadonly();

  /** Number of active subscriptions */
  readonly activeSubscriptions = computed(() => this.subscriptions().size);

  /** Number of connected subscriptions */
  readonly connectedSubscriptions = computed(() => {
    let count = 0;
    this.subscriptions().forEach(sub => {
      if (sub.status === 'connected') count++;
    });
    return count;
  });

  /** Whether any subscription is currently connected */
  readonly hasActiveConnection = computed(() => this.connectedSubscriptions() > 0);

  /** List of subscription IDs */
  readonly subscriptionIds = computed(() => Array.from(this.subscriptions().keys()));

  constructor() {
    // Log initial state
    console.log('[RealtimeFacade] Initialized');
  }

  // ============================================================================
  // Table Subscriptions
  // ============================================================================

  /**
   * Subscribe to database table changes
   *
   * @param config Subscription configuration
   * @param callback Callback function for changes
   * @returns Subscription ID
   *
   * @example
   * ```typescript
   * const subscriptionId = facade.subscribeToTable<Task>({
   *   table: 'tasks',
   *   filter: 'blueprint_id=eq.123',
   *   events: ['UPDATE']
   * }, (payload) => {
   *   console.log('Task updated:', payload.new);
   * });
   * ```
   */
  subscribeToTable<T extends Record<string, any> = any>(config: SubscriptionConfig, callback: (payload: RealtimePostgresChangesPayload<T>) => void): string {
    if (!config.table) {
      throw new Error('Table name is required for table subscription');
    }

    const subscriptionId = config.id || this.generateSubscriptionId('table');
    const schema = config.schema || 'public';
    const events = config.events || ['*'];

    console.log(`[RealtimeFacade] Creating table subscription: ${subscriptionId}`, {
      table: config.table,
      filter: config.filter,
      events
    });

    try {
      // Create channel
      const channelName = `realtime:${subscriptionId}`;
      const channel = this.supabase.client.channel(channelName);

      // Configure postgres changes listener
      events.forEach(event => {
        channel.on(
          'postgres_changes',
          {
            event: event as any,
            schema,
            table: config.table!,
            filter: config.filter
          },
          payload => {
            try {
              callback(payload as RealtimePostgresChangesPayload<T>);
            } catch (error) {
              console.error('[RealtimeFacade] Error in table subscription callback:', error);
              this.errorService.addError({
                category: 'System',
                severity: 'error',
                message: 'Error in table subscription callback',
                details: error,
                context: 'RealtimeFacade.subscribeToTable'
              });
            }
          }
        );
      });

      // Subscribe to channel
      channel.subscribe(status => {
        this.handleSubscriptionStatus(subscriptionId, status);
      });

      // Store subscription info
      const subscriptionInfo: SubscriptionInfo = {
        id: subscriptionId,
        type: 'table',
        channel,
        config,
        status: 'connecting',
        createdAt: new Date()
      };

      this.subscriptionsState.update(subs => {
        const newSubs = new Map(subs);
        newSubs.set(subscriptionId, subscriptionInfo);
        return newSubs;
      });

      this.updateConnectionState();

      return subscriptionId;
    } catch (error) {
      console.error('[RealtimeFacade] Failed to create table subscription:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: 'Failed to create table subscription',
        details: error,
        context: 'RealtimeFacade.subscribeToTable'
      });
      throw error;
    }
  }

  // ============================================================================
  // Broadcast Subscriptions
  // ============================================================================

  /**
   * Subscribe to broadcast messages
   *
   * @param config Subscription configuration (must include channelName)
   * @param event Event name to listen for
   * @param callback Callback function for messages
   * @returns Subscription ID
   *
   * @example
   * ```typescript
   * const subscriptionId = facade.subscribeToBroadcast({
   *   channelName: 'task-updates'
   * }, 'status-change', (payload) => {
   *   console.log('Status changed:', payload);
   * });
   * ```
   */
  subscribeToBroadcast<T = any>(config: SubscriptionConfig, event: string, callback: (payload: T) => void): string {
    if (!config.channelName) {
      throw new Error('Channel name is required for broadcast subscription');
    }

    const subscriptionId = config.id || this.generateSubscriptionId('broadcast');

    console.log(`[RealtimeFacade] Creating broadcast subscription: ${subscriptionId}`, {
      channel: config.channelName,
      event
    });

    try {
      // Create channel
      const channel = this.supabase.client.channel(config.channelName);

      // Configure broadcast listener
      channel.on('broadcast', { event }, payload => {
        try {
          callback(payload as T);
        } catch (error) {
          console.error('[RealtimeFacade] Error in broadcast subscription callback:', error);
          this.errorService.addError({
            category: 'System',
            severity: 'error',
            message: 'Error in broadcast subscription callback',
            details: error,
            context: 'RealtimeFacade.subscribeToBroadcast'
          });
        }
      });

      // Subscribe to channel
      channel.subscribe(status => {
        this.handleSubscriptionStatus(subscriptionId, status);
      });

      // Store subscription info
      const subscriptionInfo: SubscriptionInfo = {
        id: subscriptionId,
        type: 'broadcast',
        channel,
        config: { ...config, channelName: config.channelName },
        status: 'connecting',
        createdAt: new Date()
      };

      this.subscriptionsState.update(subs => {
        const newSubs = new Map(subs);
        newSubs.set(subscriptionId, subscriptionInfo);
        return newSubs;
      });

      this.updateConnectionState();

      return subscriptionId;
    } catch (error) {
      console.error('[RealtimeFacade] Failed to create broadcast subscription:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: 'Failed to create broadcast subscription',
        details: error,
        context: 'RealtimeFacade.subscribeToBroadcast'
      });
      throw error;
    }
  }

  /**
   * Send a broadcast message
   *
   * @param channelName Channel name
   * @param event Event name
   * @param payload Message payload
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await facade.broadcast('task-updates', 'status-change', {
   *   taskId: '123',
   *   newStatus: 'completed'
   * });
   * ```
   */
  async broadcast(channelName: string, event: string, payload: any): Promise<void> {
    try {
      const channel = this.supabase.client.channel(channelName);
      await channel.send({
        type: 'broadcast',
        event,
        payload
      });
    } catch (error) {
      console.error('[RealtimeFacade] Failed to send broadcast:', error);
      this.errorService.addError({
        category: 'Network',
        severity: 'error',
        message: 'Failed to send broadcast message',
        details: error,
        context: 'RealtimeFacade.broadcast'
      });
      throw error;
    }
  }

  // ============================================================================
  // Presence Subscriptions
  // ============================================================================

  /**
   * Subscribe to presence changes (online users)
   *
   * @param config Subscription configuration (must include channelName)
   * @param callback Callback function for presence changes
   * @returns Subscription ID
   *
   * @example
   * ```typescript
   * const subscriptionId = facade.subscribeToPresence({
   *   channelName: 'task-board'
   * }, (state) => {
   *   console.log('Online users:', Object.keys(state));
   * });
   * ```
   */
  subscribeToPresence<T = any>(config: SubscriptionConfig, callback: (state: Record<string, T>) => void): string {
    if (!config.channelName) {
      throw new Error('Channel name is required for presence subscription');
    }

    const subscriptionId = config.id || this.generateSubscriptionId('presence');

    console.log(`[RealtimeFacade] Creating presence subscription: ${subscriptionId}`, {
      channel: config.channelName
    });

    try {
      // Create channel
      const channel = this.supabase.client.channel(config.channelName);

      // Configure presence listener
      channel.on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          callback(state as Record<string, T>);
        } catch (error) {
          console.error('[RealtimeFacade] Error in presence subscription callback:', error);
          this.errorService.addError({
            category: 'System',
            severity: 'error',
            message: 'Error in presence subscription callback',
            details: error,
            context: 'RealtimeFacade.subscribeToPresence'
          });
        }
      });

      // Subscribe to channel
      channel.subscribe(status => {
        this.handleSubscriptionStatus(subscriptionId, status);
      });

      // Store subscription info
      const subscriptionInfo: SubscriptionInfo = {
        id: subscriptionId,
        type: 'presence',
        channel,
        config: { ...config, channelName: config.channelName },
        status: 'connecting',
        createdAt: new Date()
      };

      this.subscriptionsState.update(subs => {
        const newSubs = new Map(subs);
        newSubs.set(subscriptionId, subscriptionInfo);
        return newSubs;
      });

      this.updateConnectionState();

      return subscriptionId;
    } catch (error) {
      console.error('[RealtimeFacade] Failed to create presence subscription:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: 'Failed to create presence subscription',
        details: error,
        context: 'RealtimeFacade.subscribeToPresence'
      });
      throw error;
    }
  }

  /**
   * Track user presence
   *
   * @param channelName Channel name
   * @param presenceData User presence data
   * @returns Promise<void>
   *
   * @example
   * ```typescript
   * await facade.trackPresence('task-board', {
   *   userId: '123',
   *   username: 'John Doe',
   *   status: 'online'
   * });
   * ```
   */
  async trackPresence(channelName: string, presenceData: any): Promise<void> {
    try {
      const channel = this.supabase.client.channel(channelName);
      await channel.track(presenceData);
    } catch (error) {
      console.error('[RealtimeFacade] Failed to track presence:', error);
      this.errorService.addError({
        category: 'Network',
        severity: 'error',
        message: 'Failed to track presence',
        details: error,
        context: 'RealtimeFacade.trackPresence'
      });
      throw error;
    }
  }

  // ============================================================================
  // Subscription Management
  // ============================================================================

  /**
   * Unsubscribe from a specific subscription
   *
   * @param subscriptionId Subscription ID
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions().get(subscriptionId);
    if (!subscription) {
      console.warn(`[RealtimeFacade] Subscription not found: ${subscriptionId}`);
      return;
    }

    console.log(`[RealtimeFacade] Unsubscribing: ${subscriptionId}`);

    try {
      // Remove channel
      this.supabase.client.removeChannel(subscription.channel);

      // Remove from state
      this.subscriptionsState.update(subs => {
        const newSubs = new Map(subs);
        newSubs.delete(subscriptionId);
        return newSubs;
      });

      this.updateConnectionState();
    } catch (error) {
      console.error('[RealtimeFacade] Error unsubscribing:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'warning',
        message: 'Error unsubscribing from channel',
        details: error,
        context: 'RealtimeFacade.unsubscribe'
      });
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    console.log(`[RealtimeFacade] Unsubscribing from all ${this.subscriptions().size} subscriptions`);

    const subscriptionIds = Array.from(this.subscriptions().keys());
    subscriptionIds.forEach(id => this.unsubscribe(id));
  }

  /**
   * Get subscription info by ID
   *
   * @param subscriptionId Subscription ID
   * @returns Subscription info or undefined
   */
  getSubscription(subscriptionId: string): SubscriptionInfo | undefined {
    return this.subscriptions().get(subscriptionId);
  }

  /**
   * Get channel state for a subscription
   *
   * @param subscriptionId Subscription ID
   * @returns Channel state or null
   */
  getChannelState(subscriptionId: string): string | null {
    const subscription = this.subscriptions().get(subscriptionId);
    return subscription?.channel.state || null;
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    console.log('[RealtimeFacade] Cleaning up on destroy');
    this.unsubscribeAll();
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Generate unique subscription ID
   *
   * @param type Subscription type
   * @returns Unique subscription identifier
   * @private
   */
  private generateSubscriptionId(type: string): string {
    return `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Handle subscription status changes
   *
   * @param subscriptionId Subscription ID
   * @param status New status
   * @private
   */
  private handleSubscriptionStatus(subscriptionId: string, status: string): void {
    console.log(`[RealtimeFacade] Subscription status change: ${subscriptionId} -> ${status}`);

    this.subscriptionsState.update(subs => {
      const newSubs = new Map(subs);
      const subscription = newSubs.get(subscriptionId);

      if (subscription) {
        let mappedStatus: SubscriptionInfo['status'];

        if (status === 'SUBSCRIBED') {
          mappedStatus = 'connected';
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          mappedStatus = 'disconnected';

          // Log error for disconnection
          this.errorService.addError({
            category: 'Network',
            severity: 'warning',
            message: `Subscription disconnected: ${subscriptionId}`,
            details: { status },
            context: 'RealtimeFacade'
          });
        } else if (status === 'TIMED_OUT') {
          mappedStatus = 'error';

          this.errorService.addError({
            category: 'Network',
            severity: 'error',
            message: `Subscription timed out: ${subscriptionId}`,
            details: { status },
            context: 'RealtimeFacade'
          });
        } else {
          mappedStatus = 'connecting';
        }

        newSubs.set(subscriptionId, {
          ...subscription,
          status: mappedStatus
        });
      }

      return newSubs;
    });

    this.updateConnectionState();
    this.lastConnectionUpdateSignal.set(new Date());
  }

  /**
   * Update overall connection state based on individual subscriptions
   *
   * @private
   */
  private updateConnectionState(): void {
    const subs = Array.from(this.subscriptions().values());

    if (subs.length === 0) {
      this.connectionStateSignal.set('disconnected');
      return;
    }

    const hasConnected = subs.some(s => s.status === 'connected');
    const hasConnecting = subs.some(s => s.status === 'connecting');
    const allDisconnected = subs.every(s => s.status === 'disconnected' || s.status === 'error');

    if (hasConnected) {
      this.connectionStateSignal.set('connected');
    } else if (hasConnecting) {
      this.connectionStateSignal.set('connecting');
    } else if (allDisconnected) {
      this.connectionStateSignal.set('disconnected');
    }
  }
}
