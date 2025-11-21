import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { ProgressTrackingService, AnalyticsCacheService, BlueprintActivityService } from '@shared';
import type {
  ProgressTracking,
  ProgressTrackingInsert,
  ProgressTrackingUpdate,
  AnalyticsCache,
  ActivityLog,
  ActivityLogDetail,
  ActivityLogFilters
} from '@shared';
import { AnalyticsService } from '@shared/services/analytics/analytics.service';

import { ErrorStateService } from '../services/error-state.service';

/**
 * Chart Data
 */
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

/**
 * Report Data
 */
export interface ReportData {
  title: string;
  generatedAt: string;
  data: Record<string, unknown>;
  charts?: ChartData[];
}

/**
 * Analytics Facade
 *
 * Enterprise-grade facade for Analytics management.
 * Orchestrates ProgressTrackingService, AnalyticsCacheService, BlueprintActivityService,
 * and AnalyticsService to provide a unified interface for all analytics operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Automatic audit logging via BlueprintActivityService
 * - Progress tracking, activity logs, analytics cache, and reporting
 *
 * Key Features:
 * - Progress tracking management
 * - Activity log management
 * - Analytics cache management
 * - Report generation and export
 * - Data visualization (chart data)
 * - Statistics and analytics
 * - Computed state for filtered views
 *
 * @example
 * ```typescript
 * const facade = inject(AnalyticsFacade);
 *
 * // Load progress tracking
 * await facade.loadProgressTracking('blueprint-id');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Progress:', facade.progressTracking());
 *   console.log('Stats:', facade.progressStats());
 * });
 *
 * // Generate report
 * const report = await facade.generateReport('blueprint-id', 'weekly');
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsFacade implements OnDestroy {
  // Inject dependencies
  private readonly progressTrackingService = inject(ProgressTrackingService);
  private readonly analyticsCacheService = inject(AnalyticsCacheService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly errorStateService = inject(ErrorStateService);

  // Signal state - Facade-specific state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly progressTracking = this.progressTrackingService.progressRecords;
  readonly activityLogs = this.activityService.logs;
  readonly analyticsCache = this.analyticsCacheService.caches;
  readonly loading = computed(
    () =>
      this.progressTrackingService.loading() ||
      this.analyticsCacheService.loading() ||
      this.activityService.loading() ||
      this.analyticsService.loading()
  );
  readonly error = computed(
    () =>
      this.progressTrackingService.error() ||
      this.analyticsCacheService.error() ||
      this.activityService.error() ||
      this.analyticsService.error()
  );

  // Computed signals
  readonly progressStats = computed(() => {
    const records = this.progressTracking();
    if (records.length === 0) {
      return {
        total: 0,
        averageProgress: 0,
        trend: 'stable' as const
      };
    }

    const latest = records[0] as any;
    const averageProgress =
      records.length > 0
        ? records.reduce((sum, r) => {
            const rAny = r as any;
            return sum + (rAny.total_tasks > 0 ? (rAny.completed_tasks / rAny.total_tasks) * 100 : 0);
          }, 0) / records.length
        : 0;

    return {
      total: records.length,
      averageProgress,
      trend: this.progressTrackingService.progressTrend()
    };
  });

  readonly activityStats = computed(() => this.activityService.activityStats());

  readonly cacheStats = computed(() => {
    const caches = this.analyticsCache();
    const hits = this.analyticsCacheService.cacheHits();
    const misses = this.analyticsCacheService.cacheMisses();
    const hitRate = this.analyticsCacheService.cacheHitRate();

    return {
      total: caches.length,
      hits,
      misses,
      hitRate
    };
  });

  readonly analyticsStats = computed(() => {
    return {
      progress: this.progressStats(),
      activity: this.activityStats(),
      cache: this.cacheStats()
    };
  });

  readonly reportStats = computed(() => {
    // This would be computed from generated reports
    // For now, return empty stats
    return {
      totalReports: 0,
      lastGenerated: null as string | null
    };
  });

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ============================================================================
  // Progress Tracking Management
  // ============================================================================

  /**
   * Get progress tracking
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<ProgressTracking[]>
   */
  async getProgressTracking(blueprintId: string): Promise<ProgressTracking[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_progress_tracking');

    try {
      await this.progressTrackingService.loadProgressByBlueprint(blueprintId);
      return this.progressTracking();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取进度追踪失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.getProgressTracking'
      });
      console.error('[AnalyticsFacade] Failed to get progress tracking:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update progress tracking
   *
   * @param recordId Record ID
   * @param updates Update data
   * @returns Promise<ProgressTracking>
   */
  async updateProgressTracking(recordId: string, updates: ProgressTrackingUpdate): Promise<ProgressTracking> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_progress_tracking');

    try {
      return await this.progressTrackingService.updateProgressRecord(recordId, updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新进度追踪失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.updateProgressTracking'
      });
      console.error('[AnalyticsFacade] Failed to update progress tracking:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load progress tracking
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async loadProgressTracking(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_progress_tracking');

    try {
      await this.progressTrackingService.loadProgressByBlueprint(blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载进度追踪失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.loadProgressTracking'
      });
      console.error('[AnalyticsFacade] Failed to load progress tracking:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Activity Log Management
  // ============================================================================

  /**
   * Get activity logs
   *
   * @param blueprintId Blueprint ID
   * @param filters Filters
   * @returns Promise<ActivityLog[]>
   */
  async getActivityLogs(blueprintId: string, filters?: ActivityLogFilters): Promise<ActivityLog[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_activity_logs');

    try {
      const logs = await this.activityService.getActivityLogs(blueprintId, filters);
      // getActivityLogs 返回的是数据库类型，需要转换为 ActivityLog 类型
      // 但 BlueprintActivityService 已经返回 ActivityLog[]，直接返回
      return logs as unknown as ActivityLog[];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取活动记录失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.getActivityLogs'
      });
      console.error('[AnalyticsFacade] Failed to get activity logs:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create activity log
   *
   * @param blueprintId Blueprint ID
   * @param resourceType Resource type
   * @param resourceId Resource ID
   * @param action Action
   * @param changes Changes
   * @returns Promise<void>
   */
  async createActivityLog(
    blueprintId: string,
    resourceType: string,
    resourceId: string,
    action: string,
    changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>
  ): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_activity_log');

    try {
      await this.activityService.logActivity(blueprintId, resourceType as any, resourceId, action, changes || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建活动记录失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.createActivityLog'
      });
      console.error('[AnalyticsFacade] Failed to create activity log:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load activity logs
   *
   * @param blueprintId Blueprint ID
   * @param filters Filters
   * @returns Promise<void>
   */
  async loadActivityLogs(blueprintId: string, filters?: ActivityLogFilters): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_activity_logs');

    try {
      await this.getActivityLogs(blueprintId, filters);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载活动记录失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.loadActivityLogs'
      });
      console.error('[AnalyticsFacade] Failed to load activity logs:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Analytics Cache Management
  // ============================================================================

  /**
   * Get analytics cache
   *
   * @param cacheKey Cache key
   * @param blueprintId Blueprint ID
   * @returns Promise<AnalyticsCache | null>
   */
  async getAnalyticsCache(cacheKey: string, blueprintId: string): Promise<AnalyticsCache | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_analytics_cache');

    try {
      return await this.analyticsCacheService.getCache(cacheKey, blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取分析缓存失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.getAnalyticsCache'
      });
      console.error('[AnalyticsFacade] Failed to get analytics cache:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Invalidate cache
   *
   * @param cacheKey Cache key
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async invalidateCache(cacheKey: string, blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('invalidate_cache');

    try {
      await this.analyticsCacheService.deleteCache(cacheKey, blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '清除分析缓存失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.invalidateCache'
      });
      console.error('[AnalyticsFacade] Failed to invalidate cache:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load analytics cache
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<void>
   */
  async loadAnalyticsCache(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_analytics_cache');

    try {
      await this.analyticsCacheService.loadCachesByBlueprint(blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载分析缓存失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.loadAnalyticsCache'
      });
      console.error('[AnalyticsFacade] Failed to load analytics cache:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Report Generation
  // ============================================================================

  /**
   * Generate report
   *
   * @param blueprintId Blueprint ID
   * @param reportType Report type (daily, weekly, monthly)
   * @returns Promise<ReportData>
   */
  async generateReport(blueprintId: string, reportType: 'daily' | 'weekly' | 'monthly'): Promise<ReportData> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('generate_report');

    try {
      // Load required data
      await Promise.all([this.loadProgressTracking(blueprintId), this.loadActivityLogs(blueprintId), this.loadAnalyticsCache(blueprintId)]);

      // Generate report data
      const progress = this.progressStats();
      const activity = this.activityStats();
      const cache = this.cacheStats();

      const report: ReportData = {
        title: `${reportType} Report - ${blueprintId}`,
        generatedAt: new Date().toISOString(),
        data: {
          progress,
          activity,
          cache
        },
        charts: await this.getChartData(blueprintId, reportType)
      };

      return report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成报表失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.generateReport'
      });
      console.error('[AnalyticsFacade] Failed to generate report:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Export report
   *
   * @param report Report data
   * @param format Export format (json, csv, pdf)
   * @returns Promise<string> - Export file URL or data
   */
  async exportReport(report: ReportData, format: 'json' | 'csv' | 'pdf' = 'json'): Promise<string> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('export_report');

    try {
      if (format === 'json') {
        return JSON.stringify(report, null, 2);
      } else if (format === 'csv') {
        // Convert report data to CSV format
        // This is a simplified implementation
        const csv = Object.entries(report.data)
          .map(([key, value]) => `${key},${JSON.stringify(value)}`)
          .join('\n');
        return csv;
      } else {
        // PDF export would require a PDF library
        throw new Error('PDF export not yet implemented');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导出报表失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.exportReport'
      });
      console.error('[AnalyticsFacade] Failed to export report:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Data Visualization
  // ============================================================================

  /**
   * Get chart data
   *
   * @param blueprintId Blueprint ID
   * @param reportType Report type
   * @returns Promise<ChartData[]>
   */
  async getChartData(blueprintId: string, reportType: 'daily' | 'weekly' | 'monthly'): Promise<ChartData[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_chart_data');

    try {
      await this.loadProgressTracking(blueprintId);

      const records = this.progressTracking();
      const recordsAny = records as any[];

      // Generate progress chart data
      const progressChart: ChartData = {
        labels: recordsAny.map(r => r.tracking_date || ''),
        datasets: [
          {
            label: 'Progress %',
            data: recordsAny.map(r => (r.total_tasks > 0 ? (r.completed_tasks / r.total_tasks) * 100 : 0)),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
          }
        ]
      };

      return [progressChart];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取图表数据失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.getChartData'
      });
      console.error('[AnalyticsFacade] Failed to get chart data:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get statistics
   *
   * @param blueprintId Blueprint ID
   * @returns Promise<Record<string, unknown>>
   */
  async getStatistics(blueprintId: string): Promise<Record<string, unknown>> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('get_statistics');

    try {
      await Promise.all([this.loadProgressTracking(blueprintId), this.loadActivityLogs(blueprintId), this.loadAnalyticsCache(blueprintId)]);

      return {
        progress: this.progressStats(),
        activity: this.activityStats(),
        cache: this.cacheStats(),
        analytics: this.analyticsStats()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取统计数据失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'AnalyticsFacade.getStatistics'
      });
      console.error('[AnalyticsFacade] Failed to get statistics:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
