import { inject, Injectable, OnDestroy } from '@angular/core';
import { ErrorStateService } from '@core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { RealtimeFacade } from '../../../core/facades/realtime.facade';

/**
 * Refresh Reason
 * Indicates why a refresh was triggered
 */
export type RefreshReason = 'task_change' | 'document_change' | 'quality_check_change' | 'issue_change' | 'manual';

/**
 * Refresh Event
 * Contains information about a refresh trigger
 */
export interface RefreshEvent {
  /** Blueprint ID that needs refresh */
  blueprintId: string;
  /** Reason for the refresh */
  reason: RefreshReason;
  /** Additional context data */
  context?: Record<string, unknown>;
  /** Timestamp of the event */
  timestamp: Date;
}

/**
 * Blueprint Aggregation Refresh Service
 *
 * Automatic data refresh service for blueprint aggregations.
 * Listens for changes in related resources (tasks, documents, quality checks, issues)
 * and triggers blueprint data refresh to maintain consistency across the application.
 *
 * Design Principles:
 * - Event-driven architecture
 * - Debounced refresh (avoid excessive updates)
 * - Multiple subscription management via RealtimeFacade
 * - Resource type filtering
 * - Error handling via ErrorStateService
 * - Automatic cleanup on destroy
 *
 * Key Features:
 * - Supabase Realtime integration via RealtimeFacade
 * - Debounced refresh events (1 second default)
 * - Multiple blueprint subscriptions
 * - Resource-specific filtering
 * - Observable stream for consumers
 * - Manual refresh trigger
 * - Subscription lifecycle management
 *
 * @example
 * ```typescript
 * const refreshService = inject(BlueprintAggregationRefreshService);
 *
 * // Setup subscriptions for a blueprint
 * refreshService.setupRealtimeSubscriptions('blueprint-123');
 *
 * // Listen for refresh events
 * refreshService.listen().subscribe(event => {
 *   console.log('Refresh needed:', event);
 *   // Reload blueprint data
 *   facade.loadBlueprintById(event.blueprintId);
 * });
 *
 * // Manual trigger
 * refreshService.triggerRefresh('blueprint-123', 'manual');
 *
 * // Cleanup
 * refreshService.cleanup('blueprint-123');
 * ```
 *
 * @see docs/COMPONENT-MAPPING-REPORT.md
 * @see docs/11-元件模組視圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintAggregationRefreshService implements OnDestroy {
  // Inject dependencies
  private readonly realtimeFacade = inject(RealtimeFacade);
  private readonly errorService = inject(ErrorStateService);

  // Refresh event stream
  private readonly refreshTrigger$ = new Subject<RefreshEvent>();

  // Subscription tracking
  private readonly subscriptions = new Map<string, string[]>(); // blueprintId -> subscriptionIds[]

  // Debounce time in milliseconds
  private readonly debounceTimeMs = 1000;

  constructor() {
    console.log('[BlueprintAggregationRefreshService] Initialized');
  }

  /**
   * Listen for refresh events
   *
   * Returns an Observable that emits when blueprint data needs to be refreshed.
   * Events are debounced to avoid excessive updates.
   *
   * @returns Observable of refresh events
   */
  listen(): Observable<RefreshEvent> {
    return this.refreshTrigger$.asObservable().pipe(
      debounceTime(this.debounceTimeMs),
      distinctUntilChanged((prev, curr) => prev.blueprintId === curr.blueprintId && prev.reason === curr.reason)
    );
  }

  /**
   * Setup Realtime subscriptions for a blueprint
   *
   * Subscribes to changes in:
   * - tasks table
   * - documents table
   * - quality_checks table
   * - issues table
   *
   * @param blueprintId Blueprint ID to monitor
   * @param options Optional configuration
   */
  setupRealtimeSubscriptions(
    blueprintId: string,
    options?: {
      /** Monitor task changes (default: true) */
      tasks?: boolean;
      /** Monitor document changes (default: true) */
      documents?: boolean;
      /** Monitor quality check changes (default: true) */
      qualityChecks?: boolean;
      /** Monitor issue changes (default: true) */
      issues?: boolean;
    }
  ): void {
    // Default all to true
    const config = {
      tasks: true,
      documents: true,
      qualityChecks: true,
      issues: true,
      ...options
    };

    console.log(`[BlueprintAggregationRefreshService] Setting up subscriptions for blueprint: ${blueprintId}`, config);

    // Cleanup any existing subscriptions for this blueprint
    this.cleanup(blueprintId);

    const subscriptionIds: string[] = [];

    try {
      // Subscribe to task changes
      if (config.tasks) {
        const taskSubId = this.realtimeFacade.subscribeToTable(
          {
            table: 'tasks',
            filter: `blueprint_id=eq.${blueprintId}`,
            events: ['INSERT', 'UPDATE', 'DELETE']
          },
          payload => {
            this.handleTaskChange(blueprintId, payload);
          }
        );
        subscriptionIds.push(taskSubId);
      }

      // Subscribe to document changes
      if (config.documents) {
        const docSubId = this.realtimeFacade.subscribeToTable(
          {
            table: 'documents',
            filter: `blueprint_id=eq.${blueprintId}`,
            events: ['INSERT', 'UPDATE', 'DELETE']
          },
          payload => {
            this.handleDocumentChange(blueprintId, payload);
          }
        );
        subscriptionIds.push(docSubId);
      }

      // Subscribe to quality check changes
      if (config.qualityChecks) {
        const qcSubId = this.realtimeFacade.subscribeToTable(
          {
            table: 'quality_checks',
            filter: `blueprint_id=eq.${blueprintId}`,
            events: ['INSERT', 'UPDATE', 'DELETE']
          },
          payload => {
            this.handleQualityCheckChange(blueprintId, payload);
          }
        );
        subscriptionIds.push(qcSubId);
      }

      // Subscribe to issue changes
      if (config.issues) {
        const issueSubId = this.realtimeFacade.subscribeToTable(
          {
            table: 'issues',
            filter: `blueprint_id=eq.${blueprintId}`,
            events: ['INSERT', 'UPDATE', 'DELETE']
          },
          payload => {
            this.handleIssueChange(blueprintId, payload);
          }
        );
        subscriptionIds.push(issueSubId);
      }

      // Store subscription IDs
      this.subscriptions.set(blueprintId, subscriptionIds);

      console.log(`[BlueprintAggregationRefreshService] Created ${subscriptionIds.length} subscriptions for blueprint: ${blueprintId}`);
    } catch (error) {
      console.error('[BlueprintAggregationRefreshService] Failed to setup subscriptions:', error);
      this.errorService.addError({
        category: 'System',
        severity: 'error',
        message: 'Failed to setup blueprint refresh subscriptions',
        details: error,
        context: 'BlueprintAggregationRefreshService.setupRealtimeSubscriptions'
      });

      // Cleanup partial subscriptions
      subscriptionIds.forEach(subId => this.realtimeFacade.unsubscribe(subId));
    }
  }

  /**
   * Manually trigger a refresh event
   *
   * @param blueprintId Blueprint ID
   * @param reason Reason for refresh
   * @param context Additional context data
   */
  triggerRefresh(blueprintId: string, reason: RefreshReason, context?: Record<string, unknown>): void {
    console.log(`[BlueprintAggregationRefreshService] Manual refresh triggered for blueprint: ${blueprintId}, reason: ${reason}`);

    this.refreshTrigger$.next({
      blueprintId,
      reason,
      context,
      timestamp: new Date()
    });
  }

  /**
   * Cleanup subscriptions for a blueprint
   *
   * @param blueprintId Blueprint ID
   */
  cleanup(blueprintId: string): void {
    const subscriptionIds = this.subscriptions.get(blueprintId);

    if (!subscriptionIds) {
      return;
    }

    console.log(`[BlueprintAggregationRefreshService] Cleaning up ${subscriptionIds.length} subscriptions for blueprint: ${blueprintId}`);

    subscriptionIds.forEach(subId => {
      try {
        this.realtimeFacade.unsubscribe(subId);
      } catch (error) {
        console.error(`[BlueprintAggregationRefreshService] Error unsubscribing: ${subId}`, error);
      }
    });

    this.subscriptions.delete(blueprintId);
  }

  /**
   * Cleanup all subscriptions
   */
  cleanupAll(): void {
    console.log(`[BlueprintAggregationRefreshService] Cleaning up all subscriptions`);

    const blueprintIds = Array.from(this.subscriptions.keys());
    blueprintIds.forEach(blueprintId => this.cleanup(blueprintId));
  }

  /**
   * Get active blueprint subscriptions
   *
   * @returns Array of blueprint IDs with active subscriptions
   */
  getActiveBlueprints(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Check if blueprint has active subscriptions
   *
   * @param blueprintId Blueprint ID
   * @returns True if subscriptions are active
   */
  isActive(blueprintId: string): boolean {
    return this.subscriptions.has(blueprintId);
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    console.log('[BlueprintAggregationRefreshService] Destroying - cleaning up all subscriptions');
    this.cleanupAll();
    this.refreshTrigger$.complete();
  }

  // ============================================================================
  // Private Event Handlers
  // ============================================================================

  /**
   * Handle task change event
   *
   * @param blueprintId Blueprint ID
   * @param payload Realtime payload
   * @private
   */
  private handleTaskChange(blueprintId: string, payload: any): void {
    console.log(`[BlueprintAggregationRefreshService] Task change detected for blueprint: ${blueprintId}`, payload.eventType);

    this.refreshTrigger$.next({
      blueprintId,
      reason: 'task_change',
      context: {
        eventType: payload.eventType,
        taskId: payload.new?.id || payload.old?.id
      },
      timestamp: new Date()
    });
  }

  /**
   * Handle document change event
   *
   * @param blueprintId Blueprint ID
   * @param payload Realtime payload
   * @private
   */
  private handleDocumentChange(blueprintId: string, payload: any): void {
    console.log(`[BlueprintAggregationRefreshService] Document change detected for blueprint: ${blueprintId}`, payload.eventType);

    this.refreshTrigger$.next({
      blueprintId,
      reason: 'document_change',
      context: {
        eventType: payload.eventType,
        documentId: payload.new?.id || payload.old?.id
      },
      timestamp: new Date()
    });
  }

  /**
   * Handle quality check change event
   *
   * @param blueprintId Blueprint ID
   * @param payload Realtime payload
   * @private
   */
  private handleQualityCheckChange(blueprintId: string, payload: any): void {
    console.log(`[BlueprintAggregationRefreshService] Quality check change detected for blueprint: ${blueprintId}`, payload.eventType);

    this.refreshTrigger$.next({
      blueprintId,
      reason: 'quality_check_change',
      context: {
        eventType: payload.eventType,
        qualityCheckId: payload.new?.id || payload.old?.id
      },
      timestamp: new Date()
    });
  }

  /**
   * Handle issue change event
   *
   * @param blueprintId Blueprint ID
   * @param payload Realtime payload
   * @private
   */
  private handleIssueChange(blueprintId: string, payload: any): void {
    console.log(`[BlueprintAggregationRefreshService] Issue change detected for blueprint: ${blueprintId}`, payload.eventType);

    this.refreshTrigger$.next({
      blueprintId,
      reason: 'issue_change',
      context: {
        eventType: payload.eventType,
        issueId: payload.new?.id || payload.old?.id
      },
      timestamp: new Date()
    });
  }
}
