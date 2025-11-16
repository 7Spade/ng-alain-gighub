import { Injectable, inject, signal } from '@angular/core';
import { QualityCheckRepository, QualityCheck as QualityCheckDb } from '@core';
import { QualityCheck, QualityCheckDetail } from '@shared';
import type { QualityCheckInsert, QualityCheckUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Quality Check Service
 *
 * 提供品質檢查相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const qcService = inject(QualityCheckService);
 *
 * // 載入品質檢查詳情
 * await qcService.getById('check-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class QualityCheckService {
  private qualityCheckRepository = inject(QualityCheckRepository);

  // 使用 Signals 管理狀態
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 將資料庫類型轉換為應用模型類型
   */
  private mapToQualityCheck(dbCheck: QualityCheckDb): QualityCheck {
    return {
      id: dbCheck.id,
      taskId: dbCheck.task_id,
      stagingId: dbCheck.staging_id,
      inspectorId: dbCheck.inspector_id,
      checkType: dbCheck.check_type as any,
      status: dbCheck.status as any,
      checkItems: dbCheck.check_items as any,
      findings: dbCheck.findings,
      recommendations: dbCheck.recommendations,
      checkedAt: dbCheck.checked_at ?? new Date().toISOString(),
      completedAt: dbCheck.completed_at
    };
  }

  /**
   * 根據 ID 取得品質檢查詳情
   */
  async getById(id: string): Promise<QualityCheckDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const dbCheck = await firstValueFrom(this.qualityCheckRepository.findById(id));

      if (!dbCheck) {
        return null;
      }

      // 將資料庫類型轉換為應用模型類型
      const qualityCheck = this.mapToQualityCheck(dbCheck);

      // 將資料轉換為 QualityCheckDetail 格式
      const qualityCheckDetail: QualityCheckDetail = {
        ...qualityCheck,
        // TODO: 載入關聯的 task 和 inspector 資料
        task: undefined,
        inspector: undefined,
        photos: undefined
      };

      return qualityCheckDetail;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '載入品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 新增品質檢查
   */
  async create(data: QualityCheckInsert): Promise<QualityCheck> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const dbInsertData = {
        task_id: data.taskId,
        staging_id: data.stagingId,
        inspector_id: data.inspectorId,
        check_type: data.checkType,
        status: data.status,
        check_items: data.checkItems as any,
        findings: data.findings,
        recommendations: data.recommendations,
        checked_at: data.checkedAt,
        completed_at: data.completedAt
      };

      const dbCheck = await firstValueFrom(this.qualityCheckRepository.create(dbInsertData));
      return this.mapToQualityCheck(dbCheck);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '新增品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新品質檢查
   */
  async update(id: string, data: QualityCheckUpdate): Promise<QualityCheck> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const dbUpdateData: Record<string, unknown> = {};
      if (data.status !== undefined) dbUpdateData['status'] = data.status;
      if (data.checkItems !== undefined) dbUpdateData['check_items'] = data.checkItems;
      if (data.findings !== undefined) dbUpdateData['findings'] = data.findings;
      if (data.recommendations !== undefined) dbUpdateData['recommendations'] = data.recommendations;
      if (data.completedAt !== undefined) dbUpdateData['completed_at'] = data.completedAt;

      const dbCheck = await firstValueFrom(this.qualityCheckRepository.update(id, dbUpdateData));
      return this.mapToQualityCheck(dbCheck);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除品質檢查
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.qualityCheckRepository.delete(id));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '刪除品質檢查失敗';
      this.errorState.set(errorMessage);
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
