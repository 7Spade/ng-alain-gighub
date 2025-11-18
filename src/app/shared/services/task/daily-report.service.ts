import { Injectable, inject, signal, computed } from '@angular/core';
import { DailyReportRepository, ReportPhotoRepository, WeatherCacheRepository } from '@core';
import { DailyReport, DailyReportInsert, DailyReportUpdate, ReportPhoto, ReportPhotoInsert, WeatherCache } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Daily Report Detail
 *
 * 聚合每日報表相關子資料（照片、天氣）
 */
export interface DailyReportDetail extends DailyReport {
  photos: ReportPhoto[];
  weather?: WeatherCache;
}

/**
 * Daily Report Service
 *
 * 提供每日報表相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const reportService = inject(DailyReportService);
 *
 * // 載入指定日期的報表
 * await reportService.loadByDate(taskId, '2025-01-15');
 *
 * // 訂閱報表狀態
 * effect(() => {
 *   console.log('Reports:', reportService.reports());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DailyReportService {
  private dailyReportRepository = inject(DailyReportRepository);
  private reportPhotoRepository = inject(ReportPhotoRepository);
  private weatherCacheRepository = inject(WeatherCacheRepository);

  // 使用 Signals 管理狀態
  private reportsState = signal<DailyReport[]>([]);
  private selectedReportState = signal<DailyReportDetail | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly reports = this.reportsState.asReadonly();
  readonly selectedReport = this.selectedReportState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly totalWorkHours = computed(() => this.reports().reduce((sum, r) => sum + (r.workHours || 0), 0));

  readonly totalWorkerCount = computed(() => {
    const reports = this.reports();
    if (reports.length === 0) return 0;
    return Math.max(...reports.map(r => r.workerCount || 0));
  });

  /**
   * 載入指定任務的所有報表
   */
  async loadByTask(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dailyReportRepository.findByTaskId(taskId));
      this.reportsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入任務報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定日期的報表
   */
  async loadByDate(taskId: string, reportDate: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dailyReportRepository.findByDate(taskId, reportDate));
      this.reportsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入日期報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定日期範圍的報表
   */
  async loadByDateRange(taskId: string, startDate: string, endDate: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.dailyReportRepository.findByDateRange(taskId, startDate, endDate));
      this.reportsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入日期範圍報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入單一報表詳情（包含照片和天氣）
   */
  async loadReportById(reportId: string): Promise<DailyReportDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const report = await firstValueFrom(this.dailyReportRepository.findById(reportId));
      if (!report) {
        this.selectedReportState.set(null);
        return null;
      }

      // 載入關聯資料
      const [photos, weather] = await Promise.all([
        firstValueFrom(this.reportPhotoRepository.findByReportId(reportId)),
        report.weatherCacheId ? firstValueFrom(this.weatherCacheRepository.findById(report.weatherCacheId)) : Promise.resolve(null)
      ]);

      const reportDetail: DailyReportDetail = {
        ...report,
        photos,
        weather: weather || undefined
      };

      this.selectedReportState.set(reportDetail);
      return reportDetail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入報表詳情失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新的每日報表
   */
  async create(data: DailyReportInsert): Promise<DailyReport> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const report = await firstValueFrom(this.dailyReportRepository.create(data));

      // 更新本地狀態
      this.reportsState.update(current => [...current, report]);

      return report;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建每日報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新每日報表
   */
  async update(id: string, data: DailyReportUpdate): Promise<DailyReport> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.dailyReportRepository.update(id, data));

      // 更新本地狀態
      this.reportsState.update(current => current.map(r => (r.id === id ? updated : r)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新每日報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除每日報表
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.dailyReportRepository.delete(id));

      // 更新本地狀態
      this.reportsState.update(current => current.filter(r => r.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除每日報表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 為報表上傳照片
   */
  async uploadPhotos(reportId: string, photos: ReportPhotoInsert[]): Promise<ReportPhoto[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const uploaded = await Promise.all(photos.map(photo => firstValueFrom(this.reportPhotoRepository.create(photo))));

      // 如果當前選中的報表就是這個，更新其照片
      if (this.selectedReportState()?.id === reportId) {
        this.selectedReportState.update(current =>
          current
            ? {
                ...current,
                photos: [...current.photos, ...uploaded]
              }
            : null
        );
      }

      return uploaded;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '上傳照片失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.reportsState.set([]);
    this.selectedReportState.set(null);
    this.errorState.set(null);
  }
}
