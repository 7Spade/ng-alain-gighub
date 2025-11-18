/**
 * Task Data Capture Service
 *
 * 統一處理任務層的資料採集流程（進度、日誌、里程碑、品質等），並在寫入後通知
 * Blueprint 聚合層重新計算。
 */

import { Injectable, inject } from '@angular/core';
import { BlueprintService, BlueprintQualityCheckService } from '@core/blueprint';
import type { TaskStatus } from '@models';
import type { BlueprintMilestone, BlueprintProgress } from '@shared/models';
import type { BlueprintAggregationFilters } from '@shared/models/blueprint-aggregation.model';
import type {
  CreateDailyReportInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
  UpdateDailyReportInput,
  CreateQualityCheckInput,
  UpdateQualityCheckInput
} from '@shared/models/blueprint.model';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';

export interface CaptureDailyReportInput extends Omit<CreateDailyReportInput, 'blueprint_id'> {
  blueprintId: string;
}

export interface UpdateDailyReportCaptureInput extends UpdateDailyReportInput {
  reportId: string;
  blueprintId: string;
}

export interface RecordBlueprintProgressInput {
  blueprintId: string;
  stage: string;
  progressPercentage: number;
  notes?: string;
  recordedBy: string;
}

export interface CaptureTaskProgressInput {
  blueprintId: string;
  taskId: string;
  quantity: {
    unit: string;
    planned: number;
    installed: number;
    used: number;
  };
  percentage?: number;
  status?: TaskStatus;
  recordedBy?: string;
  notes?: string;
}

// CaptureMilestoneInput 使用与 CreateMilestoneInput 相同的结构
export type CaptureMilestoneInput = CreateMilestoneInput;

export interface UpdateMilestoneCaptureInput extends UpdateMilestoneInput {
  milestoneId: string;
  blueprintId: string;
}

export interface CaptureQualityCheckInput extends Omit<CreateQualityCheckInput, 'blueprint_id'> {
  blueprintId: string;
}

export interface UpdateQualityCheckCaptureInput extends UpdateQualityCheckInput {
  qualityCheckId: string;
  blueprintId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskDataCaptureService {
  private readonly blueprintService = inject(BlueprintService);
  private readonly taskProgressService = inject(TaskProgressService);
  private readonly qualityService = inject(BlueprintQualityCheckService);

  async captureDailyReport(input: CaptureDailyReportInput): Promise<boolean> {
    try {
      const { blueprintId, ...payload } = input;
      const { error } = await this.blueprintService.createDailyReport({
        blueprint_id: blueprintId,
        ...payload
      });

      if (error) {
        return false;
      }

      await this.notifyAggregationChanged(blueprintId);
      return true;
    } catch (error) {
      console.error('captureDailyReport failed', error);
      return false;
    }
  }

  async updateDailyReport(input: UpdateDailyReportCaptureInput): Promise<boolean> {
    try {
      const { reportId, blueprintId, ...payload } = input;
      const { error } = await this.blueprintService.updateDailyReport(reportId, payload);
      if (error) {
        return false;
      }

      await this.notifyAggregationChanged(blueprintId);
      return true;
    } catch (error) {
      console.error('updateDailyReport failed', error);
      return false;
    }
  }

  async recordBlueprintProgress(input: RecordBlueprintProgressInput): Promise<{ data: BlueprintProgress | null; error: Error | null }> {
    try {
      const { error, data } = await this.blueprintService.createProgress({
        blueprint_id: input.blueprintId,
        stage: input.stage,
        progress_percentage: input.progressPercentage,
        notes: input.notes,
        recorded_by: input.recordedBy
      });

      if (!error) {
        await this.notifyAggregationChanged(input.blueprintId);
      }

      return { data, error };
    } catch (error) {
      console.error('recordBlueprintProgress failed', error);
      return { data: null, error: error as Error };
    }
  }

  async captureProgress(input: CaptureTaskProgressInput): Promise<boolean> {
    try {
      await this.taskProgressService.updateProgress(input.taskId, {
        quantity: {
          unit: input.quantity.unit,
          planned: input.quantity.planned,
          installed: input.quantity.installed,
          used: input.quantity.used
        },
        percentage: input.percentage,
        status: input.status,
        recordedBy: input.recordedBy,
        notes: input.notes
      });

      await this.notifyAggregationChanged(input.blueprintId);
      return true;
    } catch (error) {
      console.error('captureProgress failed', error);
      return false;
    }
  }

  async captureMilestone(input: CaptureMilestoneInput): Promise<{ data: BlueprintMilestone | null; error: Error | null }> {
    try {
      const { error, data } = await this.blueprintService.createMilestone(input);
      if (!error) {
        await this.notifyAggregationChanged(input.blueprint_id);
      }
      return { data: data ?? null, error };
    } catch (error) {
      console.error('captureMilestone failed', error);
      return { data: null, error: error as Error };
    }
  }

  async updateMilestone(input: UpdateMilestoneCaptureInput): Promise<{ error: Error | null }> {
    try {
      const { milestoneId, blueprintId, ...payload } = input;
      const { error } = await this.blueprintService.updateMilestone(milestoneId, payload);
      if (!error) {
        await this.notifyAggregationChanged(blueprintId);
      }
      return { error };
    } catch (error) {
      console.error('updateMilestone failed', error);
      return { error: error as Error };
    }
  }

  async deleteMilestone(blueprintId: string, milestoneId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.blueprintService.deleteMilestone(milestoneId);
      if (!error) {
        await this.notifyAggregationChanged(blueprintId);
      }
      return { error };
    } catch (error) {
      console.error('deleteMilestone failed', error);
      return { error: error as Error };
    }
  }

  async captureQualityCheck(input: CaptureQualityCheckInput): Promise<boolean> {
    try {
      const { blueprintId, attachments, ...payload } = input;
      const { error } = await this.qualityService.createQualityCheck({
        blueprint_id: blueprintId,
        attachments: attachments ?? [],
        ...payload
      });

      if (error) {
        return false;
      }

      await this.notifyAggregationChanged(blueprintId);
      return true;
    } catch (error) {
      console.error('captureQualityCheck failed', error);
      return false;
    }
  }

  async updateQualityCheck(input: UpdateQualityCheckCaptureInput): Promise<boolean> {
    try {
      const { qualityCheckId, blueprintId, ...payload } = input;
      const { error } = await this.qualityService.updateQualityCheck(qualityCheckId, payload);

      if (error) {
        return false;
      }

      await this.notifyAggregationChanged(blueprintId);
      return true;
    } catch (error) {
      console.error('updateQualityCheck failed', error);
      return false;
    }
  }

  async deleteQualityCheck(blueprintId: string, qualityCheckId: string): Promise<boolean> {
    try {
      const { error } = await this.qualityService.deleteQualityCheck(qualityCheckId);
      if (error) {
        return false;
      }

      await this.notifyAggregationChanged(blueprintId);
      return true;
    } catch (error) {
      console.error('deleteQualityCheck failed', error);
      return false;
    }
  }

  async notifyAggregationChanged(blueprintId: string, filters?: BlueprintAggregationFilters): Promise<void> {
    try {
      await this.blueprintService.recalculateBlueprintAggregation(blueprintId, filters);
    } catch (error) {
      console.warn('notifyAggregationChanged failed', error);
    }
  }
}
