import { Injectable, inject, signal } from '@angular/core';
import { BlueprintService } from '@core/blueprint';
import type { BlueprintMilestone, BlueprintProgress } from '@shared/models';

import {
  TaskDataCaptureService,
  RecordBlueprintProgressInput,
  CaptureMilestoneInput,
  UpdateMilestoneCaptureInput
} from '../domain/task-data-capture.service';

@Injectable({ providedIn: 'root' })
export class TaskProgressBoardFacade {
  private readonly blueprintService = inject(BlueprintService);
  private readonly captureService = inject(TaskDataCaptureService);

  private readonly progressSignal = signal<BlueprintProgress[]>([]);
  private readonly milestonesSignal = signal<BlueprintMilestone[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly savingProgressSignal = signal(false);
  private readonly savingMilestoneSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly progressRecords = this.progressSignal.asReadonly();
  readonly milestones = this.milestonesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly savingProgress = this.savingProgressSignal.asReadonly();
  readonly savingMilestone = this.savingMilestoneSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const [progressResult, milestoneResult] = await Promise.all([
        this.blueprintService.getBlueprintProgress(blueprintId),
        this.blueprintService.getBlueprintMilestones(blueprintId)
      ]);

      if (progressResult.error) {
        this.errorSignal.set(progressResult.error.message || '無法取得進度紀錄');
        this.progressSignal.set([]);
      } else {
        const ordered = (progressResult.data ?? []).sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());
        this.progressSignal.set(ordered);
      }

      if (milestoneResult.error) {
        this.errorSignal.set(milestoneResult.error.message || '無法取得里程碑資料');
        this.milestonesSignal.set([]);
      } else {
        const ordered = (milestoneResult.data ?? []).sort((a, b) => {
          if (a.order_index !== b.order_index) {
            return a.order_index - b.order_index;
          }
          const aDate = a.target_date ? new Date(a.target_date).getTime() : Number.MAX_SAFE_INTEGER;
          const bDate = b.target_date ? new Date(b.target_date).getTime() : Number.MAX_SAFE_INTEGER;
          return aDate - bDate;
        });
        this.milestonesSignal.set(ordered);
      }
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.progressSignal.set([]);
      this.milestonesSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async recordProgress(input: RecordBlueprintProgressInput): Promise<boolean> {
    this.savingProgressSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { error } = await this.captureService.recordBlueprintProgress(input);
      if (error) {
        this.errorSignal.set(error.message || '新增進度紀錄失敗');
        return false;
      }
      await this.load(input.blueprintId);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingProgressSignal.set(false);
    }
  }

  async createMilestone(input: CaptureMilestoneInput): Promise<boolean> {
    this.savingMilestoneSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { error } = await this.captureService.captureMilestone(input);
      if (error) {
        this.errorSignal.set(error.message || '新增里程碑失敗');
        return false;
      }
      await this.load(input.blueprint_id);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingMilestoneSignal.set(false);
    }
  }

  async updateMilestone(input: UpdateMilestoneCaptureInput): Promise<boolean> {
    this.savingMilestoneSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { error } = await this.captureService.updateMilestone(input);
      if (error) {
        this.errorSignal.set(error.message || '更新里程碑失敗');
        return false;
      }
      await this.load(input.blueprintId);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingMilestoneSignal.set(false);
    }
  }

  async deleteMilestone(blueprintId: string, milestoneId: string): Promise<boolean> {
    this.savingMilestoneSignal.set(true);
    this.errorSignal.set(null);
    try {
      const { error } = await this.captureService.deleteMilestone(blueprintId, milestoneId);
      if (error) {
        this.errorSignal.set(error.message || '刪除里程碑失敗');
        return false;
      }
      await this.load(blueprintId);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.savingMilestoneSignal.set(false);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
