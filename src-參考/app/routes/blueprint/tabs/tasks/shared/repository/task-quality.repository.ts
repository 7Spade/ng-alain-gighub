import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type { QualityCorrectiveAction, QualityInspectionPlan, QualityNonConformance, QualityTarget } from '@models';
import { TaskEventRepository, TaskEventRecord } from '@tasks/shared/repository/task-event.repository';
import { TaskFacetRepository, TaskFacetRecord } from '@tasks/shared/repository/task-facet.repository';

const QUALITY_FACET_TYPE = 'quality';
const QUALITY_INSPECTION_EVENT = 'quality-inspection';

export interface TaskQualitySummaryRecord {
  id: string;
  taskId: string;
  standards: string[];
  codes: string[];
  qualityTargets: QualityTarget[];
  inspectionPlan: QualityInspectionPlan[];
  nonConformances: QualityNonConformance[];
  correctiveActions: QualityCorrectiveAction[];
  metadata: Record<string, unknown> | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface UpsertTaskQualitySummaryInput {
  taskId: string;
  userId: string | null;
  timestamp: Date;
  summary: {
    standards: string[];
    codes: string[];
    targets: QualityTarget[];
    inspectionPlan: QualityInspectionPlan[];
    nonConformances: QualityNonConformance[];
    correctiveActions: QualityCorrectiveAction[];
    metadata?: Record<string, unknown> | null;
  };
}

export interface TaskQualityInspectionRecord {
  id: string;
  taskId: string;
  qualityId: string;
  inspectionType: string;
  inspectionDate: Date;
  inspectorId: string | null;
  result: string;
  status: string;
  score: number | null;
  findings: Array<Record<string, unknown>>;
  attachments: Array<Record<string, unknown>>;
  notes: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  createdBy: string | null;
}

export interface InsertTaskQualityInspectionInput {
  taskId: string;
  qualityId: string;
  userId: string | null;
  inspection: {
    inspectionType: string;
    inspectionDate: Date;
    inspectorId?: string | null;
    result: string;
    status: string;
    score?: number | null;
    findings?: Array<Record<string, unknown>>;
    attachments?: Array<Record<string, unknown>>;
    notes?: string | null;
    metadata?: Record<string, unknown> | null;
  };
}

interface QualityFacetPayload {
  standards: string[];
  codes: string[];
  qualityTargets: QualityTarget[];
  inspectionPlan: QualityInspectionPlan[];
  nonConformances: QualityNonConformance[];
  correctiveActions: QualityCorrectiveAction[];
}

interface QualityInspectionEventPayload {
  inspectionType: string;
  result: string;
  status: string;
  score: number | null;
  findings: Array<Record<string, unknown>>;
  attachments: Array<Record<string, unknown>>;
  notes: string | null;
  inspectorId: string | null;
  inspectionDate: string;
  qualityId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskQualityRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly facetRepository = inject(TaskFacetRepository);
  private readonly eventRepository = inject(TaskEventRepository);

  async getSummary(taskId: string): Promise<TaskQualitySummaryRecord | null> {
    const facet = await this.facetRepository.getFacet<QualityFacetPayload>(taskId, QUALITY_FACET_TYPE);

    if (!facet) {
      return null;
    }

    return this.mapSummaryFacet(facet);
  }

  async upsertSummary(input: UpsertTaskQualitySummaryInput): Promise<TaskQualitySummaryRecord> {
    const payload: QualityFacetPayload = {
      standards: input.summary.standards,
      codes: input.summary.codes,
      qualityTargets: input.summary.targets,
      inspectionPlan: input.summary.inspectionPlan,
      nonConformances: input.summary.nonConformances,
      correctiveActions: input.summary.correctiveActions
    };

    const facet = await this.facetRepository.upsertFacet<QualityFacetPayload>({
      taskId: input.taskId,
      facetType: QUALITY_FACET_TYPE,
      payload,
      metadata: input.summary.metadata ?? undefined,
      userId: input.userId,
      timestamp: input.timestamp
    });

    return this.mapSummaryFacet(facet);
  }

  async deleteByTaskIds(taskIds: string[]): Promise<void> {
    await this.facetRepository.deleteFacetsByTaskIds(taskIds, QUALITY_FACET_TYPE);
  }

  async listInspections(taskId: string): Promise<TaskQualityInspectionRecord[]> {
    const events = await this.eventRepository.listEvents<QualityInspectionEventPayload>(taskId, {
      facetType: QUALITY_FACET_TYPE,
      eventType: QUALITY_INSPECTION_EVENT
    });

    return events.map(event => this.mapInspectionEvent(event));
  }

  async insertInspection(input: InsertTaskQualityInspectionInput): Promise<TaskQualityInspectionRecord> {
    const payload: QualityInspectionEventPayload = {
      inspectionType: input.inspection.inspectionType,
      result: input.inspection.result,
      status: input.inspection.status,
      score: input.inspection.score ?? null,
      findings: input.inspection.findings ?? [],
      attachments: input.inspection.attachments ?? [],
      notes: input.inspection.notes ?? null,
      inspectorId: input.inspection.inspectorId ?? null,
      inspectionDate: input.inspection.inspectionDate.toISOString(),
      qualityId: input.qualityId
    };

    const event = await this.eventRepository.insertEvent<QualityInspectionEventPayload>({
      taskId: input.taskId,
      facetType: QUALITY_FACET_TYPE,
      eventType: QUALITY_INSPECTION_EVENT,
      payload,
      occurredAt: input.inspection.inspectionDate,
      userId: input.userId,
      metadata: input.inspection.metadata ?? undefined
    });

    return this.mapInspectionEvent(event);
  }

  async deleteInspectionsByTaskIds(taskIds: string[]): Promise<void> {
    await this.eventRepository.deleteEventsByTaskIds(taskIds, QUALITY_FACET_TYPE, QUALITY_INSPECTION_EVENT);
  }

  async getLegacyQualityData(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('quality_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch legacy quality data: ${error.message}`);
    }

    return (data?.quality_data as Record<string, unknown> | undefined) ?? null;
  }

  async clearLegacyQualityData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ quality_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy quality data: ${error.message}`);
    }
  }

  private mapSummaryFacet(facet: TaskFacetRecord<QualityFacetPayload>): TaskQualitySummaryRecord {
    return {
      id: facet.id,
      taskId: facet.taskId,
      standards: facet.payload?.standards ?? [],
      codes: facet.payload?.codes ?? [],
      qualityTargets: facet.payload?.qualityTargets ?? [],
      inspectionPlan: facet.payload?.inspectionPlan ?? [],
      nonConformances: facet.payload?.nonConformances ?? [],
      correctiveActions: facet.payload?.correctiveActions ?? [],
      metadata: facet.metadata ?? null,
      updatedAt: facet.updatedAt,
      updatedBy: facet.updatedBy
    };
  }

  private mapInspectionEvent(event: TaskEventRecord<QualityInspectionEventPayload>): TaskQualityInspectionRecord {
    return {
      id: event.id,
      taskId: event.taskId,
      qualityId: event.payload?.qualityId ?? event.taskId,
      inspectionType: event.payload?.inspectionType ?? 'inspection',
      inspectionDate: event.payload?.inspectionDate ? new Date(event.payload.inspectionDate) : event.occurredAt,
      inspectorId: event.payload?.inspectorId ?? null,
      result: event.payload?.result ?? 'pending',
      status: event.payload?.status ?? 'pending',
      score: event.payload?.score ?? null,
      findings: event.payload?.findings ?? [],
      attachments: event.payload?.attachments ?? [],
      notes: event.payload?.notes ?? null,
      metadata: event.metadata ?? null,
      createdAt: event.createdAt,
      createdBy: event.createdBy
    };
  }
}
