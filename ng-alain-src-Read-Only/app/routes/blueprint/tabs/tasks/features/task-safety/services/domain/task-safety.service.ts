/**
 * Task Safety Service
 *
 * 任務安全維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：J. 安全維度
 *
 * 職責：
 * - 管理危害辨識（HIRA - Hazard Identification & Risk Assessment）
 * - 處理許可證系統（PTW - Permit to Work）
 * - 管理 PPE 要求與安全訓練
 * - 記錄事故/事件與安全 KPI 統計
 *
 * @see @ETMS_DESIGN_SPEC.md J. 安全維度
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import type { SafetyIncident, TaskSafety, TaskSafetySummary } from '@models';
import {
  SafetyIncidentDraft,
  createDefaultSafetySummaryPayload,
  extractLegacySafetySnapshot,
  hazardToRecord,
  incidentFromRecord,
  permitToRecord,
  ppeToRecord,
  summaryFromRecord,
  trainingToRecord
} from '@tasks/shared/domain/safety.domain';
import {
  InsertTaskSafetyIncidentInput,
  TaskSafetyRepository,
  TaskSafetySummaryRecord
} from '@tasks/shared/repository/task-safety.repository';

export type SafetyIncidentCreateInput = SafetyIncidentDraft;

@Injectable({
  providedIn: 'root'
})
export class TaskSafetyService {
  private readonly userService = inject(UserService);
  private readonly repository = inject(TaskSafetyRepository);

  /**
   * 更新安全要求
   *
   * @param taskId 任務 ID
   * @param safetyManagement 安全管理數據
   */
  async updateSafetyRequirements(taskId: string, safetySummary: Partial<TaskSafetySummary>): Promise<void> {
    const userId = await this.getCurrentUserId();

    const summary = await this.ensureSummary(taskId, userId);
    const hazardRegister = safetySummary.hazards ? safetySummary.hazards.map(hazardToRecord) : summary.hazardRegister;
    const permits = safetySummary.permits ? safetySummary.permits.map(permitToRecord) : summary.permits;
    const ppeRequirements =
      safetySummary.ppeRequirements !== undefined ? safetySummary.ppeRequirements.map(ppeToRecord) : summary.ppeRequirements;
    const trainingRequirements =
      safetySummary.trainingRequirements !== undefined
        ? safetySummary.trainingRequirements.map(trainingToRecord)
        : summary.trainingRequirements;
    const management = safetySummary.management !== undefined ? safetySummary.management : summary.management;

    await this.repository.upsertSummary({
      taskId,
      userId,
      timestamp: new Date(),
      summary: {
        hazardRegister,
        permits,
        ppeRequirements,
        trainingRequirements,
        management
      }
    });

    await this.clearLegacySafetyData(taskId);
  }

  /**
   * 記錄安全事件
   *
   * @param taskId 任務 ID
   * @param incident 安全事件
   * @returns 更新後的安全事件
   */
  async recordSafetyIncident(taskId: string, incident: SafetyIncidentCreateInput): Promise<SafetyIncident> {
    const userId = await this.getCurrentUserId();

    const summary = await this.ensureSummary(taskId, userId);

    const insertInput: InsertTaskSafetyIncidentInput = {
      taskId,
      safetyId: summary.id,
      userId,
      incident: {
        incidentType: incident.type,
        severity: incident.severity !== undefined && incident.severity !== null ? incident.severity.toString() : null,
        status: incident.status ?? 'reported',
        occurredAt: incident.occurredAt ?? new Date(),
        reportedAt: incident.reportedAt ?? null,
        resolvedAt: incident.resolvedAt ?? null,
        reportedBy: incident.reportedBy ?? null,
        description: incident.description,
        correctiveActions: (incident.correctiveActions ?? []).map(action => ({ description: action })),
        attachments: (incident.attachments ?? []).map(url => ({ url })),
        metadata: incident.relatedHazardId ? { relatedHazardId: incident.relatedHazardId } : null
      }
    };

    const record = await this.repository.insertIncident(insertInput);
    await this.repository.clearLegacySafetyData(taskId);

    return incidentFromRecord(record);
  }

  /**
   * 獲取任務的完整安全資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的安全資訊
   */
  async getTaskSafety(taskId: string): Promise<TaskSafety | null> {
    let summaryRecord = await this.repository.getSummary(taskId);
    if (!summaryRecord) {
      summaryRecord = await this.migrateLegacySafetyData(taskId);
    }

    if (!summaryRecord) {
      return null;
    }

    const incidents = await this.repository.listIncidents(taskId);

    return {
      summary: summaryFromRecord(summaryRecord),
      incidents: incidents.map(incidentFromRecord)
    };
  }

  /**
   * 獲取任務的安全事件列表
   *
   * @param taskId 任務 ID
   * @returns 安全事件列表
   */
  async getSafetyIncidents(taskId: string): Promise<SafetyIncident[]> {
    let summaryRecord = await this.repository.getSummary(taskId);
    if (!summaryRecord) {
      summaryRecord = await this.migrateLegacySafetyData(taskId);
    }

    if (!summaryRecord) {
      return [];
    }

    const records = await this.repository.listIncidents(taskId);
    return records.map(incidentFromRecord);
  }

  async removeSafety(taskId: string): Promise<void> {
    await this.repository.deleteIncidentsByTaskIds([taskId]);
    await this.repository.deleteByTaskIds([taskId]);
    await this.clearLegacySafetyData(taskId);
  }

  private async getCurrentUserId(): Promise<string | null> {
    const { data, error } = await this.userService.getCurrentUser();

    if (data?.id) {
      return data.id;
    }

    if (error) {
      throw error;
    }

    return null;
  }

  private async ensureSummary(taskId: string, userId: string | null): Promise<TaskSafetySummaryRecord> {
    const existing = await this.repository.getSummary(taskId);
    if (existing) {
      return existing;
    }

    return this.repository.upsertSummary({
      taskId,
      userId,
      timestamp: new Date(),
      summary: createDefaultSafetySummaryPayload()
    });
  }

  private async clearLegacySafetyData(taskId: string): Promise<void> {
    await this.repository.clearLegacySafetyData(taskId);
  }

  private async migrateLegacySafetyData(taskId: string): Promise<TaskSafetySummaryRecord | null> {
    const legacySafety = (await this.repository.getLegacySafetyData(taskId)) as Record<string, unknown> | null;
    const snapshot = extractLegacySafetySnapshot(
      legacySafety && 'management' in legacySafety ? (legacySafety['management'] as Record<string, unknown>) : legacySafety
    );

    if (!snapshot) {
      return null;
    }

    const userId = await this.getCurrentUserId();
    const timestamp = new Date();

    const summary = await this.repository.upsertSummary({
      taskId,
      userId,
      timestamp,
      summary: {
        hazardRegister: snapshot.hazards.map(hazardToRecord),
        permits: snapshot.permits.map(permitToRecord),
        ppeRequirements: snapshot.ppeRequirements.map(ppeToRecord),
        trainingRequirements: snapshot.trainingRequirements.map(trainingToRecord),
        management: snapshot.management
      }
    });

    for (const incident of snapshot.incidents) {
      await this.repository.insertIncident({
        taskId,
        safetyId: summary.id,
        userId,
        incident: {
          incidentType: incident.type,
          severity: incident.severity !== undefined && incident.severity !== null ? incident.severity.toString() : null,
          status: incident.status ?? 'reported',
          occurredAt: incident.occurredAt ?? new Date(),
          reportedAt: incident.reportedAt ?? null,
          resolvedAt: incident.resolvedAt ?? null,
          reportedBy: incident.reportedBy ?? null,
          description: incident.description,
          correctiveActions: (incident.correctiveActions ?? []).map(action => ({ description: action })),
          attachments: (incident.attachments ?? []).map(url => ({ url })),
          metadata: incident.relatedHazardId ? { relatedHazardId: incident.relatedHazardId } : null
        }
      });
    }

    await this.clearLegacySafetyData(taskId);
    return summary;
  }
}
