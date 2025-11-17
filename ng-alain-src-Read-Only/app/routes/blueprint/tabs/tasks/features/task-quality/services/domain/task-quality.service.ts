/**
 * Task Quality Service
 *
 * 任務品質維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：H. 品質維度
 *
 * 職責：
 * - 管理品質標準與規範（ISO、CNS、建築法規等）
 * - 處理檢驗計畫與檢驗記錄
 * - 管理不合格記錄（NCR）與矯正措施（CAR）
 * - 計算品質指標（缺陷率、返工率、一次通過率等）
 *
 * @see @ETMS_DESIGN_SPEC.md H. 品質維度
 */

import { Injectable, inject } from '@angular/core';
import { UserService } from '@core/account/user/user.service';
import type {
  QualityInspection,
  QualityInspectionPlan,
  QualityInspectionFinding,
  QualityTarget,
  TaskQuality,
  TaskQualitySummary
} from '@models';
import {
  InsertTaskQualityInspectionInput,
  TaskQualityInspectionRecord,
  TaskQualityRepository,
  TaskQualitySummaryRecord,
  UpsertTaskQualitySummaryInput
} from '@tasks/shared/repository/task-quality.repository';

export interface QualityInspectionCreateInput {
  type: string;
  date?: Date;
  inspectorId?: string | null;
  inspector?: string | null;
  result: string;
  status?: string;
  score?: number | null;
  findings?: QualityInspectionFinding[];
  attachments?: string[];
  notes?: string | null;
  reportNumber?: string | null;
  report?: string | null;
  metadata?: Record<string, unknown> | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskQualityService {
  private readonly repository = inject(TaskQualityRepository);
  private readonly userService = inject(UserService);

  private readonly defaultSummaryPayload: UpsertTaskQualitySummaryInput['summary'] = {
    standards: [],
    codes: [],
    targets: [],
    inspectionPlan: [],
    nonConformances: [],
    correctiveActions: [],
    metadata: { specifications: [] }
  };

  async updateQualityTargets(taskId: string, targets: QualityTarget[]): Promise<void> {
    const userId = await this.getCurrentUserId();
    const summary = await this.ensureSummary(taskId, userId);

    await this.repository.upsertSummary({
      taskId,
      userId,
      timestamp: new Date(),
      summary: {
        standards: summary.standards,
        codes: summary.codes,
        targets: targets.map(target => ({ ...target })),
        inspectionPlan: summary.inspectionPlan,
        nonConformances: summary.nonConformances,
        correctiveActions: summary.correctiveActions,
        metadata: summary.metadata
      }
    });

    await this.repository.clearLegacyQualityData(taskId);
  }

  async recordInspection(taskId: string, inspection: QualityInspectionCreateInput): Promise<QualityInspection> {
    const userId = await this.getCurrentUserId();
    const summary = await this.ensureSummary(taskId, userId);

    const insertPayload: InsertTaskQualityInspectionInput = {
      taskId,
      qualityId: summary.id,
      userId,
      inspection: {
        inspectionType: inspection.type,
        inspectionDate: inspection.date ?? new Date(),
        inspectorId: inspection.inspectorId ?? inspection.inspector ?? null,
        result: inspection.result,
        status: inspection.status ?? 'completed',
        score: inspection.score ?? null,
        findings: inspection.findings?.map(finding => ({
          id: finding.id ?? crypto.randomUUID(),
          description: finding.description,
          severity: finding.severity ?? null,
          status: finding.status ?? null
        })),
        attachments: inspection.attachments?.map(url => ({ url })) ?? [],
        notes: inspection.notes ?? inspection.report ?? null,
        metadata: this.mergeInspectionMetadata(inspection)
      }
    };

    const record = await this.repository.insertInspection(insertPayload);
    await this.repository.clearLegacyQualityData(taskId);
    return this.fromInspectionRecord(record);
  }

  async getTaskQuality(taskId: string): Promise<TaskQuality | null> {
    let summary = await this.repository.getSummary(taskId);
    if (!summary) {
      summary = await this.migrateLegacyQualityData(taskId);
    }

    if (!summary) {
      return null;
    }

    const inspections = await this.repository.listInspections(taskId);

    return {
      summary: this.fromSummaryRecord(summary),
      inspections: inspections.map(record => this.fromInspectionRecord(record))
    };
  }

  async removeQuality(taskId: string): Promise<void> {
    await this.repository.deleteInspectionsByTaskIds([taskId]);
    await this.repository.deleteByTaskIds([taskId]);
    await this.repository.clearLegacyQualityData(taskId);
  }

  private async ensureSummary(taskId: string, userId: string | null): Promise<TaskQualitySummaryRecord> {
    let summary = await this.repository.getSummary(taskId);
    if (!summary) {
      summary = await this.repository.upsertSummary({
        taskId,
        userId,
        timestamp: new Date(),
        summary: this.defaultSummaryPayload
      });
    }
    return summary;
  }

  private fromSummaryRecord(record: TaskQualitySummaryRecord): TaskQualitySummary {
    const metadata = record.metadata ?? {};
    const specifications = Array.isArray(metadata['specifications']) ? (metadata['specifications'] as string[]) : [];

    return {
      taskId: record.taskId,
      standards: record.standards,
      specifications,
      codes: record.codes,
      targets: record.qualityTargets.map(target => ({ ...target })),
      inspectionPlan: record.inspectionPlan.map(plan => this.fromInspectionPlanRecord(plan)),
      nonConformances: record.nonConformances.map(ncr => ({
        ...ncr,
        raisedAt: ncr.raisedAt instanceof Date ? ncr.raisedAt : new Date(ncr.raisedAt),
        resolvedAt: ncr.resolvedAt ? (ncr.resolvedAt instanceof Date ? ncr.resolvedAt : new Date(ncr.resolvedAt)) : null
      })),
      correctiveActions: record.correctiveActions.map(car => ({
        ...car,
        dueDate: car.dueDate ? (car.dueDate instanceof Date ? car.dueDate : new Date(car.dueDate)) : null,
        completedDate: car.completedDate ? (car.completedDate instanceof Date ? car.completedDate : new Date(car.completedDate)) : null
      })),
      metadata: record.metadata,
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy ?? undefined
    };
  }

  private fromInspectionRecord(record: TaskQualityInspectionRecord): QualityInspection {
    const metadata = record.metadata ?? {};

    return {
      id: record.id,
      taskId: record.taskId,
      type: record.inspectionType,
      date: record.inspectionDate,
      inspectorId: record.inspectorId ?? undefined,
      result: record.result,
      status: record.status,
      score: record.score ?? undefined,
      findings: (record.findings ?? []).map(finding => ({
        id: typeof finding?.['id'] === 'string' ? (finding['id'] as string) : crypto.randomUUID(),
        description: (finding?.['description'] as string) ?? '',
        severity: (finding?.['severity'] as string | null) ?? null,
        status: (finding?.['status'] as string | null) ?? null
      })),
      attachments: (record.attachments ?? [])
        .map(attachment => (typeof attachment?.['url'] === 'string' ? (attachment['url'] as string) : null))
        .filter((url): url is string => !!url),
      notes: record.notes ?? null,
      reportNumber: typeof metadata['reportNumber'] === 'string' ? (metadata['reportNumber'] as string) : null,
      metadata
    };
  }

  private fromInspectionPlanRecord(plan: QualityInspectionPlan): QualityInspectionPlan {
    return {
      id: plan.id ?? crypto.randomUUID(),
      type: plan.type,
      stage: plan.stage,
      frequency: plan.frequency,
      criteria: plan.criteria ?? [],
      tolerance: plan.tolerance ?? '',
      sampleSize: plan.sampleSize ?? 0,
      inspectorId: plan.inspectorId ?? null
    };
  }

  private async migrateLegacyQualityData(taskId: string): Promise<TaskQualitySummaryRecord | null> {
    const legacyData = await this.repository.getLegacyQualityData(taskId);

    if (!legacyData) {
      return null;
    }

    const legacyQuality = this.asRecord(legacyData);
    const management = this.asRecord(legacyQuality['management']);
    const quality = this.asRecord(legacyQuality['quality'] ?? management['quality']);

    let targetsSource = this.asArray<Record<string, unknown>>(quality['qualityTargets']);
    if (!targetsSource.length) {
      targetsSource = this.asArray<Record<string, unknown>>(management['targets']);
    }
    const targets: QualityTarget[] = targetsSource.map(target => ({
      id: (target['id'] as string | undefined) ?? crypto.randomUUID(),
      metric: (target['metric'] as string | undefined) ?? '',
      target: Number((target['target'] as number | string | undefined) ?? 0),
      actual: Number((target['actual'] as number | string | undefined) ?? 0),
      unit: (target['unit'] as string | undefined) ?? '',
      status: (target['status'] as QualityTarget['status'] | undefined) ?? 'achieved'
    }));

    const inspectionPlanSource = this.asArray<Record<string, unknown>>(quality['inspectionPlan']);
    const managementPlan = management['inspectionPlan'];
    if (!inspectionPlanSource.length && managementPlan) {
      inspectionPlanSource.push(this.asRecord(managementPlan));
    }
    const inspectionPlan: QualityInspectionPlan[] = inspectionPlanSource.map(plan => ({
      id: (plan['id'] as string | undefined) ?? crypto.randomUUID(),
      type: (plan['type'] as QualityInspectionPlan['type'] | undefined) ?? 'self',
      stage: (plan['stage'] as QualityInspectionPlan['stage'] | undefined) ?? 'pre',
      frequency: (plan['frequency'] as string | undefined) ?? '',
      criteria: Array.isArray(plan['criteria'])
        ? (plan['criteria'] as string[])
        : Array.isArray(plan['standards'])
          ? (plan['standards'] as string[])
          : [],
      tolerance: (plan['tolerance'] as string | undefined) ?? '',
      sampleSize: Number((plan['sampleSize'] as number | string | undefined) ?? 0),
      inspectorId: (plan['inspector'] as string | undefined) ?? (plan['responsible'] as string | undefined) ?? null
    }));

    const metadata = {
      ...this.asRecord(legacyQuality['metadata']),
      specifications: this.pickStringArray(quality['specifications']) ?? this.pickStringArray(management['specifications']) ?? []
    };

    const summaryInput: UpsertTaskQualitySummaryInput = {
      taskId,
      userId: await this.getCurrentUserId(),
      timestamp: new Date(),
      summary: {
        standards: this.asArray<string>(quality['standards']),
        codes: this.asArray<string>(quality['codes']),
        targets,
        inspectionPlan,
        nonConformances: this.asArray(legacyQuality['ncrs']),
        correctiveActions: this.asArray(legacyQuality['cars']),
        metadata
      }
    };

    const summary = await this.repository.upsertSummary(summaryInput);

    const qualityInspections = this.asArray<Record<string, unknown>>(quality['inspections']);
    const managementInspections = this.asArray<Record<string, unknown>>(management['inspections']);
    const legacyInspections = [...qualityInspections, ...managementInspections];
    for (const inspection of legacyInspections) {
      const inspectionDateValue = inspection['date'] ?? inspection['inspectionDate'];
      await this.repository.insertInspection({
        taskId,
        qualityId: summary.id,
        userId: summary.updatedBy ?? null,
        inspection: {
          inspectionType: typeof inspection['type'] === 'string' ? (inspection['type'] as string) : 'self',
          inspectionDate:
            inspection['date'] instanceof Date
              ? (inspection['date'] as Date)
              : inspectionDateValue &&
                  (typeof inspectionDateValue === 'string' ||
                    inspectionDateValue instanceof Date ||
                    typeof inspectionDateValue === 'number')
                ? new Date(inspectionDateValue as string | number | Date)
                : new Date(),
          inspectorId: typeof inspection['inspector'] === 'string' ? (inspection['inspector'] as string) : null,
          result: typeof inspection['result'] === 'string' ? (inspection['result'] as string) : 'pass',
          status: typeof inspection['status'] === 'string' ? (inspection['status'] as string) : 'completed',
          score:
            typeof inspection['score'] === 'number'
              ? (inspection['score'] as number)
              : typeof inspection['score'] === 'string'
                ? Number(inspection['score'])
                : null,
          findings: Array.isArray(inspection['findings'])
            ? (inspection['findings'] as Array<Record<string, unknown>>)
            : typeof inspection['report'] === 'string'
              ? [{ id: crypto.randomUUID(), description: inspection['report'] as string }]
              : [],
          attachments: Array.isArray(inspection['attachments']) ? (inspection['attachments'] as string[]).map(url => ({ url })) : [],
          notes:
            typeof inspection['notes'] === 'string'
              ? (inspection['notes'] as string)
              : typeof inspection['report'] === 'string'
                ? (inspection['report'] as string)
                : null,
          metadata: {
            ...this.asRecord(inspection['metadata']),
            reportNumber:
              typeof inspection['reportNumber'] === 'string'
                ? (inspection['reportNumber'] as string)
                : typeof inspection['reportNo'] === 'string'
                  ? (inspection['reportNo'] as string)
                  : null
          }
        }
      });
    }

    await this.repository.clearLegacyQualityData(taskId);
    return summary;
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

  private mergeInspectionMetadata(inspection: QualityInspectionCreateInput): Record<string, unknown> | null {
    const metadata: Record<string, unknown> = {
      ...(inspection.metadata ?? {})
    };

    if (inspection.reportNumber) {
      metadata['reportNumber'] = inspection.reportNumber;
    }

    if (inspection.report) {
      metadata['report'] = inspection.report;
    }

    if (inspection.inspector) {
      metadata['inspector'] = inspection.inspector;
    }

    return Object.keys(metadata).length > 0 ? metadata : null;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
  }

  private asArray<T = Record<string, unknown>>(value: unknown): T[] {
    return Array.isArray(value) ? (value as T[]) : [];
  }

  private pickStringArray(value: unknown): string[] | null {
    return Array.isArray(value) ? (value as string[]) : null;
  }
}
