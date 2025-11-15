import { Injectable, inject, signal } from '@angular/core';
import { BlueprintQualityCheckService } from '@core/blueprint';
import type { BlueprintQualityCheckWithUsers } from '@shared/models/blueprint.model';

import { CaptureQualityCheckInput, TaskDataCaptureService, UpdateQualityCheckCaptureInput } from '../domain/task-data-capture.service';

@Injectable({ providedIn: 'root' })
export class TaskQualityFacade {
  private readonly qualityService = inject(BlueprintQualityCheckService);
  private readonly captureService = inject(TaskDataCaptureService);

  private readonly checksSignal = signal<BlueprintQualityCheckWithUsers[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly savingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly qualityChecks = this.checksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { data, error } = await this.qualityService.getQualityChecks(blueprintId);
      if (error) {
        this.errorSignal.set(error.message || '無法載入品質檢查');
        this.checksSignal.set([]);
        return;
      }
      this.checksSignal.set(data ?? []);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.checksSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async create(input: CaptureQualityCheckInput): Promise<boolean> {
    this.savingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const success = await this.captureService.captureQualityCheck(input);
      if (success) {
        await this.load(input.blueprintId);
      }
      return success;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingSignal.set(false);
    }
  }

  async update(input: UpdateQualityCheckCaptureInput): Promise<boolean> {
    this.savingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const success = await this.captureService.updateQualityCheck(input);
      if (success) {
        await this.load(input.blueprintId);
      }
      return success;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingSignal.set(false);
    }
  }

  async delete(blueprintId: string, qualityCheckId: string): Promise<boolean> {
    this.savingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const success = await this.captureService.deleteQualityCheck(blueprintId, qualityCheckId);
      if (success) {
        await this.load(blueprintId);
      }
      return success;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingSignal.set(false);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
