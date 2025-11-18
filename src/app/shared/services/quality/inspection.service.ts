import { Injectable, inject, signal, computed } from '@angular/core';
import { InspectionRepository, InspectionPhotoRepository } from '@core';
import { Inspection, InspectionInsert, InspectionUpdate, InspectionPhoto, InspectionPhotoInsert } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Inspection Detail
 *
 * 聚合驗收相關子資料（照片）
 */
export interface InspectionDetail extends Inspection {
  photos: InspectionPhoto[];
}

/**
 * Inspection Service
 *
 * 提供驗收流程相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援四種驗收類型：
 * - initial: 初步驗收
 * - final: 最終驗收
 * - warranty: 保固驗收
 * - handover: 移交驗收
 *
 * @example
 * ```typescript
 * const inspectionService = inject(InspectionService);
 *
 * // 載入任務的驗收列表
 * await inspectionService.loadByTask('task-id');
 *
 * // 訂閱驗收狀態
 * effect(() => {
 *   console.log('Inspections:', inspectionService.inspections());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private inspectionRepository = inject(InspectionRepository);
  private inspectionPhotoRepository = inject(InspectionPhotoRepository);

  // 使用 Signals 管理狀態
  private inspectionsState = signal<Inspection[]>([]);
  private selectedInspectionState = signal<InspectionDetail | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly inspections = this.inspectionsState.asReadonly();
  readonly selectedInspection = this.selectedInspectionState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals - 按驗收狀態分類
  readonly pendingInspections = computed(() => this.inspections().filter(i => i.status === 'pending'));

  readonly passedInspections = computed(() => this.inspections().filter(i => i.status === 'passed'));

  readonly failedInspections = computed(() => this.inspections().filter(i => i.status === 'failed'));

  readonly completedInspections = computed(() => this.inspections().filter(i => i.status === 'passed' || i.status === 'failed'));

  /**
   * 載入指定任務的所有驗收
   */
  async loadByTask(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.inspectionRepository.findByTaskId(taskId));
      this.inspectionsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入任務驗收失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定類型的驗收
   */
  async loadByType(taskId: string, inspectionType: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(
        this.inspectionRepository.findByTaskId(taskId, {
          filters: { inspectionType }
        })
      );
      this.inspectionsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入驗收類型失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入單一驗收詳情（包含照片）
   */
  async loadInspectionById(inspectionId: string): Promise<InspectionDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const inspection = await firstValueFrom(this.inspectionRepository.findById(inspectionId));
      if (!inspection) {
        this.selectedInspectionState.set(null);
        return null;
      }

      // 載入關聯照片
      const photos = await firstValueFrom(this.inspectionPhotoRepository.findByInspectionId(inspectionId));

      const inspectionDetail: InspectionDetail = {
        ...inspection,
        photos
      };

      this.selectedInspectionState.set(inspectionDetail);
      return inspectionDetail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入驗收詳情失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新的驗收
   */
  async create(data: InspectionInsert): Promise<Inspection> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const inspection = await firstValueFrom(this.inspectionRepository.create(data));

      // 更新本地狀態
      this.inspectionsState.update(current => [...current, inspection]);

      return inspection;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建驗收失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新驗收
   */
  async update(id: string, data: InspectionUpdate): Promise<Inspection> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.inspectionRepository.update(id, data));

      // 更新本地狀態
      this.inspectionsState.update(current => current.map(i => (i.id === id ? updated : i)));

      // 如果當前選中的驗收就是這個，更新它
      if (this.selectedInspectionState()?.id === id) {
        this.selectedInspectionState.update(current => (current ? { ...current, ...updated } : null));
      }

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新驗收失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除驗收
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.inspectionRepository.delete(id));

      // 更新本地狀態
      this.inspectionsState.update(current => current.filter(i => i.id !== id));

      // 如果刪除的是當前選中的，清空選中狀態
      if (this.selectedInspectionState()?.id === id) {
        this.selectedInspectionState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除驗收失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 為驗收上傳照片
   */
  async uploadPhotos(inspectionId: string, photos: InspectionPhotoInsert[]): Promise<InspectionPhoto[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const uploaded = await Promise.all(photos.map(photo => firstValueFrom(this.inspectionPhotoRepository.create(photo))));

      // 如果當前選中的驗收就是這個，更新其照片
      if (this.selectedInspectionState()?.id === inspectionId) {
        this.selectedInspectionState.update(current =>
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
   * 完成驗收（更新狀態為 passed 或 failed）
   */
  async complete(id: string, passed: boolean, remarks?: string): Promise<Inspection> {
    const updateData: InspectionUpdate = {
      status: passed ? 'passed' : 'failed',
      inspected_at: new Date().toISOString(),
      remarks: remarks || undefined
    } as any;

    return this.update(id, updateData);
  }

  /**
   * 責任轉移（完成驗收並記錄責任轉移）
   */
  async transferResponsibility(id: string, remarks?: string): Promise<Inspection> {
    const updateData: InspectionUpdate = {
      status: 'passed',
      inspected_at: new Date().toISOString(),
      remarks: remarks || '責任已轉移'
    } as any;

    return this.update(id, updateData);
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.inspectionsState.set([]);
    this.selectedInspectionState.set(null);
    this.errorState.set(null);
  }
}
