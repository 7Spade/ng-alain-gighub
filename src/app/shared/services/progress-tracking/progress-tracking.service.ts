import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressTrackingRepository, type ProgressTracking, type ProgressTrackingInsert } from '@core';
import { firstValueFrom } from 'rxjs';

import { AuthStateService } from '../auth';

/**
 * Progress Metrics
 * 進度指標數據結構
 */
export interface ProgressMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  scheduleVarianceDays: number;
  budgetSpent: number;
  budgetVariance: number;
  qualityScore?: number;
  safetyIncidents: number;
}

/**
 * Progress Tracking Filters
 * 進度追蹤查詢過濾條件
 */
export interface ProgressTrackingFilters {
  branchId?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Progress Tracking Service
 *
 * 企業級進度追蹤服務，提供儀表板和分析所需的進度數據管理
 *
 * 核心功能：
 * 1. 記錄和追蹤專案進度（任務完成度、時程、預算、品質、安全）
 * 2. 支援藍圖級別和分支級別的進度追蹤
 * 3. 提供日期範圍查詢和趨勢分析
 * 4. 自動計算進度指標和完成百分比
 * 5. Signal-based 響應式狀態管理
 *
 * 設計原則：
 * - Signal-based：使用 Angular Signals 管理狀態
 * - 類型安全：完整的 TypeScript 類型定義
 * - 非侵入式：錯誤不影響主流程
 * - 效能優化：使用 computed 減少重複計算
 * - 企業標準：完整的錯誤處理和日誌記錄
 *
 * 使用範例：
 * ```typescript
 * const progressService = inject(ProgressTrackingService);
 *
 * // 記錄進度數據
 * await progressService.trackProgress('blueprint-123', {
 *   totalTasks: 100,
 *   completedTasks: 45,
 *   inProgressTasks: 30,
 *   pendingTasks: 25,
 *   overdueTasks: 5,
 *   completionPercentage: 45.00,
 *   scheduleVarianceDays: -3,
 *   budgetSpent: 250000.00,
 *   budgetVariance: -15000.00,
 *   safetyIncidents: 0
 * });
 *
 * // 查詢最新進度
 * const latest = await progressService.getLatestProgress('blueprint-123');
 *
 * // 查詢進度趨勢
 * const trend = await progressService.getProgressTrend(
 *   'blueprint-123',
 *   startDate,
 *   endDate
 * );
 * ```
 *
 * @see docs/22-完整SQL表結構定義.md - progress_tracking 表結構定義
 */
@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingService {
  private readonly progressTrackingRepository = inject(ProgressTrackingRepository);
  private readonly authState = inject(AuthStateService);

  // Signal 狀態管理
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);
  private readonly trackingsState = signal<ProgressTracking[]>([]);

  // 暴露 ReadonlySignal
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly trackings = this.trackingsState.asReadonly();

  // Computed: 最新的進度追蹤
  readonly latestTracking = computed(() => {
    const all = this.trackings();
    return all.length > 0 ? all[0] : null;
  });

  // Computed: 完成率
  readonly completionRate = computed(() => {
    const latest = this.latestTracking();
    return latest?.completion_percentage ?? 0;
  });

  // Computed: 是否有逾期任務
  readonly hasOverdueTasks = computed(() => {
    const latest = this.latestTracking();
    return (latest?.overdue_tasks ?? 0) > 0;
  });

  // Computed: 進度趨勢（最近7天）
  readonly recentTrend = computed(() => {
    const all = this.trackings();
    return all.slice(0, 7);
  });

  /**
   * 記錄進度追蹤數據（核心方法）
   *
   * 記錄特定日期的專案進度快照，包含所有關鍵指標
   *
   * @param blueprintId 藍圖 ID
   * @param metrics 進度指標數據
   * @param branchId 分支 ID（可選，不提供則為主分支進度）
   * @param trackingDate 追蹤日期（可選，預設為今天）
   * @returns Promise<ProgressTracking>
   *
   * @example
   * ```typescript
   * await progressService.trackProgress('blueprint-123', {
   *   totalTasks: 100,
   *   completedTasks: 45,
   *   inProgressTasks: 30,
   *   pendingTasks: 25,
   *   overdueTasks: 5,
   *   completionPercentage: 45.00,
   *   scheduleVarianceDays: -3,
   *   budgetSpent: 250000.00,
   *   budgetVariance: -15000.00,
   *   safetyIncidents: 0
   * });
   * ```
   */
  async trackProgress(
    blueprintId: string,
    metrics: ProgressMetrics,
    branchId?: string,
    trackingDate?: Date
  ): Promise<ProgressTracking> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const date = trackingDate ?? new Date();
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      const progressData: ProgressTrackingInsert = {
        blueprint_id: blueprintId,
        branch_id: branchId,
        tracking_date: dateStr,
        total_tasks: metrics.totalTasks,
        completed_tasks: metrics.completedTasks,
        in_progress_tasks: metrics.inProgressTasks,
        pending_tasks: metrics.pendingTasks,
        overdue_tasks: metrics.overdueTasks,
        completion_percentage: metrics.completionPercentage,
        schedule_variance_days: metrics.scheduleVarianceDays,
        budget_spent: metrics.budgetSpent,
        budget_variance: metrics.budgetVariance,
        quality_score: metrics.qualityScore,
        safety_incidents: metrics.safetyIncidents
      };

      const progress = await firstValueFrom(this.progressTrackingRepository.create(progressData));

      // 更新本地狀態（將新記錄插入到最前面）
      const current = this.trackingsState();
      this.trackingsState.set([progress, ...current]);

      return progress;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to track progress';
      this.errorState.set(errorMsg);
      console.error('[ProgressTrackingService] Failed to track progress:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新進度追蹤數據
   *
   * 更新已存在的進度記錄（通常用於當天數據的更新）
   *
   * @param trackingId 進度追蹤 ID
   * @param metrics 更新的進度指標
   * @returns Promise<ProgressTracking>
   */
  async updateProgress(trackingId: string, metrics: Partial<ProgressMetrics>): Promise<ProgressTracking> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updateData: any = {};

      if (metrics.totalTasks !== undefined) updateData.total_tasks = metrics.totalTasks;
      if (metrics.completedTasks !== undefined) updateData.completed_tasks = metrics.completedTasks;
      if (metrics.inProgressTasks !== undefined) updateData.in_progress_tasks = metrics.inProgressTasks;
      if (metrics.pendingTasks !== undefined) updateData.pending_tasks = metrics.pendingTasks;
      if (metrics.overdueTasks !== undefined) updateData.overdue_tasks = metrics.overdueTasks;
      if (metrics.completionPercentage !== undefined) updateData.completion_percentage = metrics.completionPercentage;
      if (metrics.scheduleVarianceDays !== undefined) updateData.schedule_variance_days = metrics.scheduleVarianceDays;
      if (metrics.budgetSpent !== undefined) updateData.budget_spent = metrics.budgetSpent;
      if (metrics.budgetVariance !== undefined) updateData.budget_variance = metrics.budgetVariance;
      if (metrics.qualityScore !== undefined) updateData.quality_score = metrics.qualityScore;
      if (metrics.safetyIncidents !== undefined) updateData.safety_incidents = metrics.safetyIncidents;

      const updated = await firstValueFrom(this.progressTrackingRepository.update(trackingId, updateData));

      // 更新本地狀態
      const current = this.trackingsState();
      const index = current.findIndex(t => t.id === trackingId);
      if (index !== -1) {
        const newTrackings = [...current];
        newTrackings[index] = updated;
        this.trackingsState.set(newTrackings);
      }

      return updated;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update progress';
      this.errorState.set(errorMsg);
      console.error('[ProgressTrackingService] Failed to update progress:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 查詢進度追蹤數據
   *
   * 根據藍圖 ID 和可選過濾條件查詢進度追蹤記錄
   *
   * @param blueprintId 藍圖 ID
   * @param filters 過濾條件（可選）
   * @returns Promise<ProgressTracking[]>
   *
   * @example
   * ```typescript
   * // 查詢所有進度記錄
   * const all = await progressService.getProgressTracking('blueprint-123');
   *
   * // 查詢特定分支的進度記錄
   * const branch = await progressService.getProgressTracking('blueprint-123', {
   *   branchId: 'branch-456'
   * });
   *
   * // 查詢特定日期範圍的進度記錄
   * const range = await progressService.getProgressTracking('blueprint-123', {
   *   startDate: new Date('2024-01-01'),
   *   endDate: new Date('2024-01-31')
   * });
   * ```
   */
  async getProgressTracking(blueprintId: string, filters?: ProgressTrackingFilters): Promise<ProgressTracking[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      let trackings: ProgressTracking[];

      if (filters?.startDate && filters?.endDate) {
        // 使用日期範圍查詢
        trackings = await firstValueFrom(
          this.progressTrackingRepository.findByDateRange(
            blueprintId,
            filters.startDate,
            filters.endDate,
            filters.branchId
          )
        );
      } else if (filters?.branchId) {
        // 查詢特定分支
        trackings = await firstValueFrom(this.progressTrackingRepository.findByBranchId(filters.branchId));
      } else {
        // 查詢藍圖所有進度
        trackings = await firstValueFrom(this.progressTrackingRepository.findByBlueprintId(blueprintId));
      }

      this.trackingsState.set(trackings);
      return trackings;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch progress tracking';
      this.errorState.set(errorMsg);
      console.error('[ProgressTrackingService] Failed to fetch progress tracking:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 獲取最新進度
   *
   * 查詢藍圖的最新進度記錄
   *
   * @param blueprintId 藍圖 ID
   * @param branchId 分支 ID（可選）
   * @returns Promise<ProgressTracking | null>
   *
   * @example
   * ```typescript
   * const latest = await progressService.getLatestProgress('blueprint-123');
   * if (latest) {
   *   console.log('Completion rate:', latest.completion_percentage);
   * }
   * ```
   */
  async getLatestProgress(blueprintId: string, branchId?: string): Promise<ProgressTracking | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const latest = await firstValueFrom(
        this.progressTrackingRepository.findLatestByBlueprintId(blueprintId, branchId)
      );

      if (latest) {
        // 更新本地狀態（保持最新記錄在最前面）
        const current = this.trackingsState();
        const filtered = current.filter(t => t.id !== latest.id);
        this.trackingsState.set([latest, ...filtered]);
      }

      return latest;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch latest progress';
      this.errorState.set(errorMsg);
      console.error('[ProgressTrackingService] Failed to fetch latest progress:', error);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 獲取進度趨勢
   *
   * 查詢指定日期範圍內的進度變化趨勢
   *
   * @param blueprintId 藍圖 ID
   * @param startDate 開始日期
   * @param endDate 結束日期
   * @param branchId 分支 ID（可選）
   * @returns Promise<ProgressTracking[]>
   *
   * @example
   * ```typescript
   * const trend = await progressService.getProgressTrend(
   *   'blueprint-123',
   *   new Date('2024-01-01'),
   *   new Date('2024-01-31')
   * );
   *
   * // 分析趨勢
   * trend.forEach(t => {
   *   console.log(`${t.tracking_date}: ${t.completion_percentage}%`);
   * });
   * ```
   */
  async getProgressTrend(
    blueprintId: string,
    startDate: Date,
    endDate: Date,
    branchId?: string
  ): Promise<ProgressTracking[]> {
    return this.getProgressTracking(blueprintId, {
      startDate,
      endDate,
      branchId
    });
  }

  /**
   * 計算進度指標
   *
   * 根據任務數據自動計算進度指標
   *
   * @param tasks 任務列表（包含狀態和日期信息）
   * @returns ProgressMetrics
   *
   * @example
   * ```typescript
   * const metrics = progressService.calculateMetrics(tasks);
   * await progressService.trackProgress('blueprint-123', metrics);
   * ```
   */
  calculateMetrics(
    tasks: Array<{
      status: string;
      dueDate?: string;
      budgetSpent?: number;
      budgetPlanned?: number;
    }>
  ): ProgressMetrics {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed' || t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'todo').length;

    // 計算逾期任務
    const now = new Date();
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed' || t.status === 'done') return false;
      return new Date(t.dueDate) < now;
    }).length;

    // 計算完成百分比
    const completionPercentage = total > 0 ? Number(((completed / total) * 100).toFixed(2)) : 0;

    // 計算預算
    const budgetSpent = tasks.reduce((sum, t) => sum + (t.budgetSpent ?? 0), 0);
    const budgetPlanned = tasks.reduce((sum, t) => sum + (t.budgetPlanned ?? 0), 0);
    const budgetVariance = budgetPlanned - budgetSpent;

    return {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionPercentage,
      scheduleVarianceDays: 0, // 需要更複雜的計算邏輯
      budgetSpent,
      budgetVariance,
      safetyIncidents: 0 // 需要從其他來源獲取
    };
  }

  /**
   * 清除狀態
   *
   * 清除所有 Signal 狀態，用於組件銷毀或重置
   */
  clear(): void {
    this.loadingState.set(false);
    this.errorState.set(null);
    this.trackingsState.set([]);
  }
}
