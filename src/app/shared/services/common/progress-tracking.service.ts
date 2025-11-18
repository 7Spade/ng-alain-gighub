import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgressTrackingRepository, type ProgressTracking, type ProgressTrackingInsert, type ProgressTrackingUpdate } from '@core';
import { firstValueFrom } from 'rxjs';

/**
 * Progress Tracking Detail
 *
 * 聚合进度追踪相关信息
 */
export interface ProgressTrackingDetail extends ProgressTracking {
  blueprintName?: string;
  branchName?: string;
}

/**
 * Progress Tracking Filters
 *
 * 进度追踪查询过滤器
 */
export interface ProgressTrackingFilters {
  blueprintId?: string;
  branchId?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Progress Tracking Service
 *
 * 提供进度追踪相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * 功能：
 * - 进度记录的 CRUD 操作
 * - 按日期范围查询进度
 * - 按蓝图/分支查询进度
 * - 计算进度趋势
 * - 生成进度报表
 *
 * @example
 * ```typescript
 * const progressService = inject(ProgressTrackingService);
 *
 * // 载入进度追踪数据
 * await progressService.loadProgressByBlueprint('blueprint-id');
 *
 * // 订阅进度状态
 * effect(() => {
 *   console.log('Progress:', progressService.progressRecords());
 * });
 *
 * // 记录新进度
 * await progressService.createProgressRecord({
 *   blueprintId: 'blueprint-id',
 *   branchId: 'branch-id',
 *   trackingDate: '2024-01-15',
 *   completedTasks: 10,
 *   totalTasks: 50,
 *   notes: '本周完成了10个任务'
 * });
 * ```
 *
 * @see ProgressTrackingRepository
 * @see docs/22-完整SQL表結構定義.md
 */
@Injectable({
  providedIn: 'root'
})
export class ProgressTrackingService {
  private progressTrackingRepository = inject(ProgressTrackingRepository);

  // 使用 Signals 管理状态
  private progressRecordsState = signal<ProgressTracking[]>([]);
  private selectedRecordState = signal<ProgressTrackingDetail | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly progressRecords = this.progressRecordsState.asReadonly();
  readonly selectedRecord = this.selectedRecordState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly totalProgress = computed(() => {
    const records = this.progressRecords() as any[];
    if (records.length === 0) return 0;
    const latest = records[0];
    return latest.total_tasks > 0 ? (latest.completed_tasks / latest.total_tasks) * 100 : 0;
  });

  readonly progressTrend = computed(() => {
    const records = [...(this.progressRecords() as any[])];
    if (records.length < 2) return 'stable';

    const latest = records[0];
    const previous = records[1];

    const latestProgress = latest.completed_tasks / latest.total_tasks;
    const previousProgress = previous.completed_tasks / previous.total_tasks;

    if (latestProgress > previousProgress) return 'increasing';
    if (latestProgress < previousProgress) return 'decreasing';
    return 'stable';
  });

  /**
   * 载入指定蓝图的进度追踪数据
   */
  async loadProgressByBlueprint(blueprintId: string, branchId?: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const records = await firstValueFrom(
        branchId ? this.progressTrackingRepository.findByBranchId(branchId) : this.progressTrackingRepository.findByBlueprintId(blueprintId)
      );
      this.progressRecordsState.set(records);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '载入进度追踪失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 载入指定日期范围的进度追踪数据
   */
  async loadProgressByDateRange(blueprintId: string, startDate: Date, endDate: Date, branchId?: string): Promise<ProgressTracking[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const records = await firstValueFrom(this.progressTrackingRepository.findByDateRange(blueprintId, startDate, endDate, branchId));
      this.progressRecordsState.set(records);
      return records;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '载入进度追踪失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建进度追踪记录
   */
  async createProgressRecord(data: ProgressTrackingInsert): Promise<ProgressTracking> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const record = await firstValueFrom(this.progressTrackingRepository.create(data as any));

      // 更新本地状态
      this.progressRecordsState.update(records => [record, ...records]);

      return record;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建进度追踪失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新进度追踪记录
   */
  async updateProgressRecord(id: string, data: ProgressTrackingUpdate): Promise<ProgressTracking> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const record = await firstValueFrom(this.progressTrackingRepository.update(id, data as any));

      // 更新本地状态
      this.progressRecordsState.update(records => records.map(r => (r.id === id ? record : r)));

      return record;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新进度追踪失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除进度追踪记录
   */
  async deleteProgressRecord(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.progressTrackingRepository.delete(id));

      // 更新本地状态
      this.progressRecordsState.update(records => records.filter(r => r.id !== id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除进度追踪失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 获取最新的进度追踪记录
   */
  async getLatestProgress(blueprintId: string, branchId?: string): Promise<ProgressTracking | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const record = await firstValueFrom(this.progressTrackingRepository.findLatestByBlueprintId(blueprintId, branchId));
      return record;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取最新进度失败';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清除错误状态
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
