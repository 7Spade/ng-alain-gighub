import { Injectable, inject, signal } from '@angular/core';
import { BlueprintService } from '@core/blueprint';
import type { BlueprintDailyReport } from '@shared/models/blueprint.model';

import { TaskDataCaptureService, CaptureDailyReportInput, UpdateDailyReportCaptureInput } from '../domain/task-data-capture.service';

@Injectable({ providedIn: 'root' })
export class TaskReportFacade {
  private readonly blueprintService = inject(BlueprintService);
  private readonly captureService = inject(TaskDataCaptureService);

  private readonly reportsSignal = signal<BlueprintDailyReport[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly reports = this.reportsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { data, error } = await this.blueprintService.getBlueprintDailyReports(blueprintId);
      if (error) {
        this.errorSignal.set(error.message || '無法載入施工日誌');
        this.reportsSignal.set([]);
        return;
      }
      this.reportsSignal.set(data ?? []);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.reportsSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async create(input: CaptureDailyReportInput): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const success = await this.captureService.captureDailyReport(input);
      if (success) {
        await this.load(input.blueprintId);
      }
      return success;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async update(input: UpdateDailyReportCaptureInput): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const success = await this.captureService.updateDailyReport(input);
      if (success) {
        await this.load(input.blueprintId);
      }
      return success;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async delete(reportId: string, blueprintId: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { error } = await this.blueprintService.deleteDailyReport(reportId);
      if (error) {
        this.errorSignal.set(error.message || '刪除施工日誌失敗');
        return false;
      }
      await this.captureService.notifyAggregationChanged(blueprintId);
      await this.load(blueprintId);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
