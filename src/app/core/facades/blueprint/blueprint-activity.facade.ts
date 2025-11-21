import { inject, Injectable, signal } from '@angular/core';
import { type ActivityLog } from '@core';
import { BlueprintActivityService, type ActivityLogFilters } from '@shared';

/**
 * Blueprint Activity Facade
 *
 * 负责蓝图活动日志管理功能
 * 包括活动日志的加载、查询等操作
 *
 * @module core/facades/blueprint
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintActivityFacade {
  private readonly activityService = inject(BlueprintActivityService);

  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Expose service signals
  readonly activityLogs = this.activityService.logs;
  readonly recentActivityLogs = this.activityService.recentLogs;
  readonly activityStats = this.activityService.activityStats;
  readonly loading = this.activityService.loading;
  readonly error = this.activityService.error;

  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  /**
   * Load activity logs for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @param filters Activity log filters (optional)
   * @returns Promise<ActivityLog[]>
   */
  async loadActivities(blueprintId: string, filters?: ActivityLogFilters): Promise<ActivityLog[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_activities');

    try {
      return await this.activityService.getActivityLogs(blueprintId, filters);
    } catch (error) {
      console.error('[BlueprintActivityFacade] Failed to load activities:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
