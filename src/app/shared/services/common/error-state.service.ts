import { Injectable, signal, computed, effect } from '@angular/core';

/**
 * Error Categories
 * Categorizes errors for better handling and display
 */
export type ErrorCategory = 'Network' | 'Validation' | 'Authorization' | 'BusinessLogic' | 'System';

/**
 * Error Severity Levels
 * Defines how critical the error is
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Application Error Interface
 * Represents a structured error in the application
 */
export interface AppError {
  /** Unique identifier for the error */
  id: string;
  /** Error category for classification */
  category: ErrorCategory;
  /** Severity level of the error */
  severity: ErrorSeverity;
  /** Human-readable error message */
  message: string;
  /** Additional error details or stack trace */
  details?: unknown;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Whether the error has been dismissed */
  dismissed: boolean;
  /** Context where error occurred (e.g., component name, operation) */
  context?: string;
}

/**
 * Error State Configuration
 */
export interface ErrorStateConfig {
  /** Maximum number of errors to keep in history */
  maxHistorySize: number;
  /** Auto-dismiss timeout in milliseconds (0 = never) */
  autoDismissTimeout: number;
}

/**
 * Error State Service
 *
 * Enterprise-grade error state management service using Angular Signals.
 * Provides unified error handling and state management across the application.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Typed error categories and severities
 * - Error history tracking with size limits
 * - Auto-dismissal with configurable timeout
 * - Non-invasive error handling
 * - Computed signals for derived state
 *
 * Key Features:
 * - Add/remove errors with automatic ID generation
 * - Dismiss individual or all errors
 * - Auto-dismiss errors after timeout
 * - Filter errors by severity or category
 * - Track error history with size limits
 * - Computed signals for common queries
 *
 * @example
 * ```typescript
 * const errorService = inject(ErrorStateService);
 *
 * // Add error
 * errorService.addError({
 *   category: 'Network',
 *   severity: 'error',
 *   message: 'Failed to load data',
 *   details: error,
 *   context: 'BlueprintFacade.loadBlueprints'
 * });
 *
 * // Check for errors
 * effect(() => {
 *   if (errorService.hasErrors()) {
 *     console.log('Current errors:', errorService.errors());
 *   }
 * });
 *
 * // Dismiss error
 * errorService.dismissError(errorId);
 * ```
 *
 * @see docs/11-元件模組視圖.mermaid.md
 * @see docs/14-錯誤處理指南.md
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorStateService {
  // Configuration
  private readonly config: ErrorStateConfig = {
    maxHistorySize: 100,
    autoDismissTimeout: 5000 // 5 seconds
  };

  // Signal state
  private readonly errorsState = signal<AppError[]>([]);
  private readonly errorHistoryState = signal<AppError[]>([]);

  // Readonly signals exposed to consumers
  /** Current active errors */
  readonly errors = this.errorsState.asReadonly();

  /** Error history (including dismissed errors) */
  readonly errorHistory = this.errorHistoryState.asReadonly();

  /** Whether there are any active errors */
  readonly hasErrors = computed(() => this.errors().length > 0);

  /** Critical errors (requires immediate attention) */
  readonly criticalErrors = computed(() => this.errors().filter(e => e.severity === 'critical' && !e.dismissed));

  /** Error errors (standard errors) */
  readonly standardErrors = computed(() => this.errors().filter(e => e.severity === 'error' && !e.dismissed));

  /** Warning errors */
  readonly warnings = computed(() => this.errors().filter(e => e.severity === 'warning' && !e.dismissed));

  /** Info errors */
  readonly infos = computed(() => this.errors().filter(e => e.severity === 'info' && !e.dismissed));

  /** Count of active errors */
  readonly errorCount = computed(() => this.errors().filter(e => !e.dismissed).length);

  /** Has critical errors */
  readonly hasCriticalErrors = computed(() => this.criticalErrors().length > 0);

  // Auto-dismiss timers
  private dismissTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    // Log critical errors to console for debugging
    effect(() => {
      const critical = this.criticalErrors();
      if (critical.length > 0) {
        console.error('[ErrorStateService] Critical errors detected:', critical);
      }
    });
  }

  /**
   * Add a new error to the state
   *
   * @param error Error data (without id, timestamp, and dismissed)
   * @returns The created AppError with generated ID
   */
  addError(error: Omit<AppError, 'id' | 'timestamp' | 'dismissed'>): AppError {
    const newError: AppError = {
      ...error,
      id: this.generateErrorId(),
      timestamp: new Date(),
      dismissed: false
    };

    // Add to current errors
    this.errorsState.update(errors => [...errors, newError]);

    // Add to history
    this.addToHistory(newError);

    // Setup auto-dismiss if configured
    if (this.config.autoDismissTimeout > 0 && error.severity !== 'critical') {
      this.setupAutoDismiss(newError.id);
    }

    return newError;
  }

  /**
   * Dismiss a specific error
   *
   * @param errorId Error ID to dismiss
   */
  dismissError(errorId: string): void {
    // Clear auto-dismiss timer if exists
    this.clearAutoDismissTimer(errorId);

    // Mark as dismissed
    this.errorsState.update(errors => errors.map(e => (e.id === errorId ? { ...e, dismissed: true } : e)));

    // Update history
    this.updateHistoryDismissed(errorId);

    // Remove from active errors after a short delay
    setTimeout(() => {
      this.errorsState.update(errors => errors.filter(e => e.id !== errorId));
    }, 300);
  }

  /**
   * Dismiss all active errors
   */
  dismissAll(): void {
    const errorIds = this.errors()
      .filter(e => !e.dismissed)
      .map(e => e.id);

    errorIds.forEach(id => this.dismissError(id));
  }

  /**
   * Remove a specific error without dismissing
   *
   * @param errorId Error ID to remove
   */
  removeError(errorId: string): void {
    this.clearAutoDismissTimer(errorId);
    this.errorsState.update(errors => errors.filter(e => e.id !== errorId));
  }

  /**
   * Clear all errors (including history)
   */
  clearAll(): void {
    // Clear all timers
    this.dismissTimers.forEach(timer => clearTimeout(timer));
    this.dismissTimers.clear();

    // Clear state
    this.errorsState.set([]);
    this.errorHistoryState.set([]);
  }

  /**
   * Clear all active errors but keep history
   */
  clearActiveErrors(): void {
    this.dismissTimers.forEach(timer => clearTimeout(timer));
    this.dismissTimers.clear();
    this.errorsState.set([]);
  }

  /**
   * Get errors by severity
   *
   * @param severity Error severity level
   * @returns Array of errors with the specified severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): AppError[] {
    return this.errors().filter(e => e.severity === severity && !e.dismissed);
  }

  /**
   * Get errors by category
   *
   * @param category Error category
   * @returns Array of errors with the specified category
   */
  getErrorsByCategory(category: ErrorCategory): AppError[] {
    return this.errors().filter(e => e.category === category && !e.dismissed);
  }

  /**
   * Get errors by context
   *
   * @param context Context string
   * @returns Array of errors from the specified context
   */
  getErrorsByContext(context: string): AppError[] {
    return this.errors().filter(e => e.context === context && !e.dismissed);
  }

  /**
   * Update service configuration
   *
   * @param config Partial configuration to update
   */
  updateConfig(config: Partial<ErrorStateConfig>): void {
    Object.assign(this.config, config);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Generate unique error ID
   *
   * @returns Unique error identifier
   * @private
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Setup auto-dismiss timer for an error
   *
   * @param errorId Error ID
   * @private
   */
  private setupAutoDismiss(errorId: string): void {
    const timer = setTimeout(() => {
      this.dismissError(errorId);
    }, this.config.autoDismissTimeout);

    this.dismissTimers.set(errorId, timer);
  }

  /**
   * Clear auto-dismiss timer for an error
   *
   * @param errorId Error ID
   * @private
   */
  private clearAutoDismissTimer(errorId: string): void {
    const timer = this.dismissTimers.get(errorId);
    if (timer) {
      clearTimeout(timer);
      this.dismissTimers.delete(errorId);
    }
  }

  /**
   * Add error to history with size limit
   *
   * @param error Error to add to history
   * @private
   */
  private addToHistory(error: AppError): void {
    this.errorHistoryState.update(history => {
      const newHistory = [...history, error];
      // Keep only the last maxHistorySize errors
      if (newHistory.length > this.config.maxHistorySize) {
        return newHistory.slice(newHistory.length - this.config.maxHistorySize);
      }
      return newHistory;
    });
  }

  /**
   * Update dismissed status in history
   *
   * @param errorId Error ID
   * @private
   */
  private updateHistoryDismissed(errorId: string): void {
    this.errorHistoryState.update(history => history.map(e => (e.id === errorId ? { ...e, dismissed: true } : e)));
  }
}

