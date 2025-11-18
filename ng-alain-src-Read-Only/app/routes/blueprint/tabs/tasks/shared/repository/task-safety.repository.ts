import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import { TaskEventRepository, TaskEventRecord } from '@tasks/shared/repository/task-event.repository';
import { TaskFacetRepository, TaskFacetRecord } from '@tasks/shared/repository/task-facet.repository';

const SAFETY_FACET_TYPE = 'safety';
const SAFETY_INCIDENT_EVENT = 'safety-incident';

export interface HazardRecord {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: number;
  likelihood: number;
  riskLevel: number;
  riskCategory: string;
  controls: Array<Record<string, unknown>>;
  residualRisk: number;
  status: string;
}

export interface PermitRecord {
  id: string;
  permitNumber: string;
  type: string;
  issuedDate: string;
  validUntil: string;
  issuedBy: string;
  approvedBy: string;
  status: string;
}

export interface TaskSafetySummaryRecord {
  id: string;
  taskId: string;
  hazardRegister: HazardRecord[];
  permits: PermitRecord[];
  ppeRequirements: Array<Record<string, unknown>>;
  trainingRequirements: Array<Record<string, unknown>>;
  management: Record<string, unknown> | null;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface UpsertTaskSafetySummaryInput {
  taskId: string;
  userId: string | null;
  timestamp: Date;
  summary: {
    hazardRegister: HazardRecord[];
    permits: PermitRecord[];
    ppeRequirements?: Array<Record<string, unknown>>;
    trainingRequirements?: Array<Record<string, unknown>>;
    management?: Record<string, unknown> | null;
  };
}

export interface TaskSafetyIncidentRecord {
  id: string;
  taskId: string;
  safetyId: string;
  incidentType: string;
  severity: string | null;
  status: string;
  occurredAt: Date;
  reportedAt: Date | null;
  resolvedAt: Date | null;
  reportedBy: string | null;
  description: string | null;
  correctiveActions: Array<Record<string, unknown>>;
  attachments: Array<Record<string, unknown>>;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  createdBy: string | null;
}

export interface InsertTaskSafetyIncidentInput {
  taskId: string;
  safetyId: string;
  userId: string | null;
  incident: {
    incidentType: string;
    severity?: string | null;
    status: string;
    occurredAt: Date;
    reportedAt?: Date | null;
    resolvedAt?: Date | null;
    reportedBy?: string | null;
    description?: string | null;
    correctiveActions?: Array<Record<string, unknown>>;
    attachments?: Array<Record<string, unknown>>;
    metadata?: Record<string, unknown> | null;
  };
}

interface SafetyFacetPayload {
  hazardRegister: HazardRecord[];
  permits: PermitRecord[];
  ppeRequirements: Array<Record<string, unknown>>;
  trainingRequirements: Array<Record<string, unknown>>;
  management: Record<string, unknown> | null;
}

interface SafetyIncidentEventPayload {
  safetyId: string;
  incidentType: string;
  severity: string | null;
  status: string;
  occurredAt: string;
  reportedAt: string | null;
  resolvedAt: string | null;
  reportedBy: string | null;
  description: string | null;
  correctiveActions: Array<Record<string, unknown>>;
  attachments: Array<Record<string, unknown>>;
  metadata: Record<string, unknown> | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskSafetyRepository {
  private readonly supabase = inject(SupabaseService);
  private readonly facetRepository = inject(TaskFacetRepository);
  private readonly eventRepository = inject(TaskEventRepository);

  async getSummary(taskId: string): Promise<TaskSafetySummaryRecord | null> {
    const facet = await this.facetRepository.getFacet<SafetyFacetPayload>(taskId, SAFETY_FACET_TYPE);

    if (!facet) {
      return null;
    }

    return this.mapSummaryFacet(facet);
  }

  async upsertSummary(input: UpsertTaskSafetySummaryInput): Promise<TaskSafetySummaryRecord> {
    const payload: SafetyFacetPayload = {
      hazardRegister: input.summary.hazardRegister ?? [],
      permits: input.summary.permits ?? [],
      ppeRequirements: input.summary.ppeRequirements ?? [],
      trainingRequirements: input.summary.trainingRequirements ?? [],
      management: input.summary.management ?? null
    };

    const facet = await this.facetRepository.upsertFacet<SafetyFacetPayload>({
      taskId: input.taskId,
      facetType: SAFETY_FACET_TYPE,
      payload,
      metadata: undefined,
      userId: input.userId,
      timestamp: input.timestamp
    });

    return this.mapSummaryFacet(facet);
  }

  async deleteByTaskIds(taskIds: string[]): Promise<void> {
    await this.facetRepository.deleteFacetsByTaskIds(taskIds, SAFETY_FACET_TYPE);
    await this.eventRepository.deleteEventsByTaskIds(taskIds, SAFETY_FACET_TYPE, SAFETY_INCIDENT_EVENT);
  }

  async listIncidents(taskId: string): Promise<TaskSafetyIncidentRecord[]> {
    const events = await this.eventRepository.listEvents<SafetyIncidentEventPayload>(taskId, {
      facetType: SAFETY_FACET_TYPE,
      eventType: SAFETY_INCIDENT_EVENT
    });

    return events.map(event => this.mapIncidentEvent(event));
  }

  async insertIncident(input: InsertTaskSafetyIncidentInput): Promise<TaskSafetyIncidentRecord> {
    const payload: SafetyIncidentEventPayload = {
      safetyId: input.safetyId,
      incidentType: input.incident.incidentType,
      severity: input.incident.severity ?? null,
      status: input.incident.status,
      occurredAt: input.incident.occurredAt.toISOString(),
      reportedAt: input.incident.reportedAt ? input.incident.reportedAt.toISOString() : null,
      resolvedAt: input.incident.resolvedAt ? input.incident.resolvedAt.toISOString() : null,
      reportedBy: input.incident.reportedBy ?? null,
      description: input.incident.description ?? null,
      correctiveActions: input.incident.correctiveActions ?? [],
      attachments: input.incident.attachments ?? [],
      metadata: input.incident.metadata ?? null
    };

    const event = await this.eventRepository.insertEvent<SafetyIncidentEventPayload>({
      taskId: input.taskId,
      facetType: SAFETY_FACET_TYPE,
      eventType: SAFETY_INCIDENT_EVENT,
      payload,
      occurredAt: input.incident.occurredAt,
      userId: input.userId,
      metadata: input.incident.metadata ?? undefined
    });

    return this.mapIncidentEvent(event);
  }

  async deleteIncidentsByTaskIds(taskIds: string[]): Promise<void> {
    await this.eventRepository.deleteEventsByTaskIds(taskIds, SAFETY_FACET_TYPE, SAFETY_INCIDENT_EVENT);
  }

  async getLegacySafetyData(taskId: string): Promise<Record<string, unknown> | null> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('safety_data').eq('id', taskId).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch legacy safety data: ${error.message}`);
    }

    return (data?.safety_data as Record<string, unknown> | undefined) ?? null;
  }

  async clearLegacySafetyData(taskId: string): Promise<void> {
    const { error } = await this.supabase.client.from('blueprint_tasks').update({ safety_data: null }).eq('id', taskId);

    if (error) {
      throw new Error(`Failed to clear legacy safety data: ${error.message}`);
    }
  }

  private mapSummaryFacet(facet: TaskFacetRecord<SafetyFacetPayload>): TaskSafetySummaryRecord {
    return {
      id: facet.id,
      taskId: facet.taskId,
      hazardRegister: facet.payload?.hazardRegister ?? [],
      permits: facet.payload?.permits ?? [],
      ppeRequirements: facet.payload?.ppeRequirements ?? [],
      trainingRequirements: facet.payload?.trainingRequirements ?? [],
      management: facet.payload?.management ?? null,
      updatedAt: facet.updatedAt,
      updatedBy: facet.updatedBy
    };
  }

  private mapIncidentEvent(event: TaskEventRecord<SafetyIncidentEventPayload>): TaskSafetyIncidentRecord {
    return {
      id: event.id,
      taskId: event.taskId,
      safetyId: event.payload?.safetyId ?? event.taskId,
      incidentType: event.payload?.incidentType ?? 'incident',
      severity: event.payload?.severity ?? null,
      status: event.payload?.status ?? 'reported',
      occurredAt: event.payload?.occurredAt ? new Date(event.payload.occurredAt) : event.occurredAt,
      reportedAt: event.payload?.reportedAt ? new Date(event.payload.reportedAt) : null,
      resolvedAt: event.payload?.resolvedAt ? new Date(event.payload.resolvedAt) : null,
      reportedBy: event.payload?.reportedBy ?? null,
      description: event.payload?.description ?? null,
      correctiveActions: event.payload?.correctiveActions ?? [],
      attachments: event.payload?.attachments ?? [],
      metadata: event.metadata ?? null,
      createdAt: event.createdAt,
      createdBy: event.createdBy
    };
  }
}
