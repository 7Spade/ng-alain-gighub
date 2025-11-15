import type {
  ControlType,
  Hazard,
  HazardStatus,
  Permit,
  PermitType,
  SafetyIncident,
  SafetyIncidentStatus,
  SafetyIncidentType,
  SafetyPPERequirement,
  SafetyRiskLevel,
  SafetyTrainingRequirement,
  TaskSafetySummary
} from '@models';
import type {
  HazardRecord,
  PermitRecord,
  TaskSafetyIncidentRecord,
  TaskSafetySummaryRecord,
  UpsertTaskSafetySummaryInput
} from '@tasks/shared/repository/task-safety.repository';

export interface SafetyIncidentDraft {
  type: SafetyIncidentType;
  description: string;
  occurredAt?: Date;
  severity?: number;
  reportedBy?: string | null;
  reportedAt?: Date | null;
  status?: SafetyIncidentStatus;
  correctiveActions?: string[];
  resolvedAt?: Date | null;
  relatedHazardId?: string;
  attachments?: string[];
}

export interface LegacySafetySnapshot {
  hazards: Hazard[];
  permits: Permit[];
  ppeRequirements: SafetyPPERequirement[];
  trainingRequirements: SafetyTrainingRequirement[];
  incidents: Array<SafetyIncidentDraft & { id: string }>;
  management: Record<string, unknown> | null;
}

export function createDefaultSafetySummaryPayload(): UpsertTaskSafetySummaryInput['summary'] {
  return {
    hazardRegister: [],
    permits: [],
    ppeRequirements: [],
    trainingRequirements: [],
    management: null
  };
}

const CONTROL_TYPE_SET = new Set<ControlType>(['elimination', 'substitution', 'engineering', 'administrative', 'ppe']);

function resolveControlType(raw: unknown): ControlType {
  if (typeof raw === 'string') {
    const normalized = raw.trim().toLowerCase() as ControlType;
    if (CONTROL_TYPE_SET.has(normalized)) {
      return normalized;
    }
  }
  return 'administrative';
}

export function hazardFromRecord(record: HazardRecord): Hazard {
  return {
    id: record.id,
    type: record.type || '',
    description: record.description || '',
    location: record.location || '',
    severity: record.severity || 1,
    likelihood: record.likelihood || 1,
    riskLevel: record.riskLevel || record.severity * record.likelihood || 1,
    riskCategory: (record.riskCategory as SafetyRiskLevel) ?? 'low',
    controls: (record.controls || []).map(control => {
      if (typeof control === 'string') {
        return {
          type: resolveControlType(control),
          description: '',
          responsible: '',
          effectiveness: 0
        };
      }
      const controlRecord = control as Record<string, unknown>;
      return {
        type: resolveControlType(controlRecord['type']),
        description: String(controlRecord['description'] ?? ''),
        responsible: String(controlRecord['responsible'] ?? ''),
        effectiveness: Number(controlRecord['effectiveness'] ?? 0)
      };
    }),
    residualRisk: record.residualRisk || record.riskLevel || 1,
    status: (record.status as HazardStatus) ?? 'identified'
  };
}

export function hazardToRecord(hazard: Hazard): HazardRecord {
  return {
    id: hazard.id,
    type: hazard.type,
    description: hazard.description,
    location: hazard.location,
    severity: hazard.severity,
    likelihood: hazard.likelihood,
    riskLevel: hazard.riskLevel,
    riskCategory: hazard.riskCategory,
    controls: (hazard.controls || []).map(control => ({ ...control })),
    residualRisk: hazard.residualRisk,
    status: hazard.status
  };
}

export function permitFromRecord(record: PermitRecord): Permit {
  return {
    id: record.id,
    permitNumber: record.permitNumber,
    type: record.type as PermitType,
    issuedDate: record.issuedDate ? new Date(record.issuedDate) : new Date(),
    validUntil: record.validUntil ? new Date(record.validUntil) : new Date(),
    issuedBy: record.issuedBy || '',
    approvedBy: record.approvedBy || '',
    status: (record.status as Permit['status']) ?? 'pending'
  };
}

export function permitToRecord(permit: Permit): PermitRecord {
  return {
    id: permit.id,
    permitNumber: permit.permitNumber,
    type: permit.type,
    issuedDate: permit.issuedDate.toISOString(),
    validUntil: permit.validUntil.toISOString(),
    issuedBy: permit.issuedBy,
    approvedBy: permit.approvedBy,
    status: permit.status
  };
}

export function ppeFromRecord(record: Record<string, unknown>): SafetyPPERequirement {
  return {
    id: (record['id'] as string) ?? crypto.randomUUID(),
    name: (record['name'] as string) ?? '',
    description: (record['description'] as string | undefined) ?? undefined,
    mandatory: Boolean(record['mandatory'])
  };
}

export function ppeToRecord(requirement: SafetyPPERequirement): Record<string, unknown> {
  return {
    id: requirement.id,
    name: requirement.name,
    description: requirement.description ?? null,
    mandatory: requirement.mandatory
  };
}

export function trainingFromRecord(record: Record<string, unknown>): SafetyTrainingRequirement {
  return {
    id: (record['id'] as string) ?? crypto.randomUUID(),
    courseName: (record['courseName'] as string) ?? '',
    provider: (record['provider'] as string | undefined) ?? undefined,
    validUntil: record['validUntil'] ? new Date(record['validUntil'] as string) : undefined,
    status: (record['status'] as SafetyTrainingRequirement['status']) ?? 'scheduled'
  };
}

export function trainingToRecord(requirement: SafetyTrainingRequirement): Record<string, unknown> {
  return {
    id: requirement.id,
    courseName: requirement.courseName,
    provider: requirement.provider ?? null,
    validUntil: requirement.validUntil ? requirement.validUntil.toISOString() : null,
    status: requirement.status
  };
}

export function incidentFromRecord(record: TaskSafetyIncidentRecord): SafetyIncident {
  const correctiveActions = (record.correctiveActions || []).map(action => {
    if (typeof action === 'string') {
      return action;
    }
    const descriptionValue = (action as Record<string, unknown>)['description'];
    return typeof descriptionValue === 'string' ? descriptionValue : '';
  });

  const attachments = (record.attachments || [])
    .map(item => {
      if (typeof item === 'string') {
        return item;
      }
      const urlValue = (item as Record<string, unknown>)['url'];
      return typeof urlValue === 'string' ? urlValue : null;
    })
    .filter((url): url is string => !!url);

  return {
    id: record.id,
    taskId: record.taskId,
    type: (record.incidentType as SafetyIncidentType) ?? 'incident',
    description: record.description ?? '',
    occurredAt: record.occurredAt,
    severity: record.severity !== null ? Number(record.severity) : undefined,
    reportedBy: record.reportedBy ?? undefined,
    reportedAt: record.reportedAt ?? undefined,
    status: (record.status as SafetyIncidentStatus) ?? 'reported',
    correctiveActions,
    resolvedAt: record.resolvedAt ?? undefined,
    relatedHazardId: (record.metadata?.['relatedHazardId'] as string | undefined) ?? undefined,
    attachments
  };
}

export function summaryFromRecord(record: TaskSafetySummaryRecord): TaskSafetySummary {
  return {
    taskId: record.taskId,
    hazards: record.hazardRegister.map(hazardFromRecord),
    permits: record.permits.map(permitFromRecord),
    ppeRequirements: record.ppeRequirements.map(ppeFromRecord),
    trainingRequirements: record.trainingRequirements.map(trainingFromRecord),
    updatedAt: record.updatedAt,
    updatedBy: record.updatedBy ?? undefined,
    management: record.management ?? null
  };
}

export function legacyHazardToHazard(record: Record<string, unknown>): Hazard {
  return {
    id: String(record['id'] ?? crypto.randomUUID()),
    type: String(record['type'] ?? ''),
    description: String(record['description'] ?? ''),
    location: String(record['location'] ?? ''),
    severity: Number(record['severity'] ?? 1),
    likelihood: Number(record['likelihood'] ?? 1),
    riskLevel: Number(record['riskLevel'] ?? Number(record['severity'] ?? 1) * Number(record['likelihood'] ?? 1)),
    riskCategory: (record['riskCategory'] as SafetyRiskLevel) ?? 'low',
    controls: Array.isArray(record['controls'])
      ? (record['controls'] as unknown[]).map(control => {
          if (typeof control === 'string') {
            return {
              type: resolveControlType(control),
              description: '',
              responsible: '',
              effectiveness: 0
            };
          }
          const controlRecord = control as Record<string, unknown>;
          return {
            type: resolveControlType(controlRecord['type']),
            description: String(controlRecord['description'] ?? ''),
            responsible: String(controlRecord['responsible'] ?? ''),
            effectiveness: Number(controlRecord['effectiveness'] ?? 0)
          };
        })
      : [],
    residualRisk: Number(record['residualRisk'] ?? Number(record['riskLevel'] ?? 1)),
    status: (record['status'] as HazardStatus) ?? 'identified'
  };
}

export function legacyPermitToPermit(record: Record<string, unknown>): Permit {
  const issuedDate = record['issuedDate'] ? new Date(record['issuedDate'] as string) : new Date();
  const validUntil = record['validUntil'] ? new Date(record['validUntil'] as string) : new Date(issuedDate);

  return {
    id: String(record['id'] ?? crypto.randomUUID()),
    permitNumber: String(record['permitNumber'] ?? ''),
    type: (record['type'] as PermitType) ?? 'general',
    issuedDate,
    validUntil,
    issuedBy: String(record['issuedBy'] ?? ''),
    approvedBy: String(record['approvedBy'] ?? ''),
    status: (record['status'] as Permit['status']) ?? 'pending'
  };
}

export function legacyPpeToRequirement(record: Record<string, unknown>): SafetyPPERequirement {
  return {
    id: String(record['id'] ?? crypto.randomUUID()),
    name: String(record['name'] ?? ''),
    description: (record['description'] as string | undefined) ?? undefined,
    mandatory: Boolean(record['mandatory'])
  };
}

export function legacyTrainingToRequirement(record: Record<string, unknown>): SafetyTrainingRequirement {
  return {
    id: String(record['id'] ?? crypto.randomUUID()),
    courseName: String(record['courseName'] ?? ''),
    provider: (record['provider'] as string | undefined) ?? undefined,
    validUntil: record['validUntil'] ? new Date(record['validUntil'] as string) : undefined,
    status: (record['status'] as SafetyTrainingRequirement['status']) ?? 'scheduled'
  };
}

export function legacyIncidentToDraft(record: Record<string, unknown>): SafetyIncidentDraft & { id: string } {
  return {
    id: String(record['id'] ?? crypto.randomUUID()),
    type: (record['type'] as SafetyIncidentType) ?? 'incident',
    description: String(record['description'] ?? ''),
    occurredAt: record['occurredAt'] ? new Date(record['occurredAt'] as string) : undefined,
    severity: record['severity'] !== undefined ? Number(record['severity']) : undefined,
    reportedBy: (record['reportedBy'] as string | undefined) ?? undefined,
    reportedAt: record['reportedAt'] ? new Date(record['reportedAt'] as string) : undefined,
    status: (record['status'] as SafetyIncidentStatus) ?? 'reported',
    correctiveActions: Array.isArray(record['correctiveActions']) ? (record['correctiveActions'] as string[]).map(String) : [],
    resolvedAt: record['resolvedAt'] ? new Date(record['resolvedAt'] as string) : undefined,
    relatedHazardId: (record['relatedHazardId'] as string | undefined) ?? undefined,
    attachments: Array.isArray(record['attachments']) ? (record['attachments'] as string[]).map(String) : []
  };
}

export function extractLegacySafetySnapshot(legacy: Record<string, unknown> | null | undefined): LegacySafetySnapshot | null {
  if (!legacy || typeof legacy !== 'object') {
    return null;
  }

  const hazards = Array.isArray(legacy['hazards']) ? (legacy['hazards'] as Array<Record<string, unknown>>).map(legacyHazardToHazard) : [];

  const permits = Array.isArray(legacy['permits']) ? (legacy['permits'] as Array<Record<string, unknown>>).map(legacyPermitToPermit) : [];

  const ppeRequirements = Array.isArray(legacy['ppeRequirements'])
    ? (legacy['ppeRequirements'] as Array<Record<string, unknown>>).map(legacyPpeToRequirement)
    : [];

  const trainingRequirements = Array.isArray(legacy['trainingRequirements'])
    ? (legacy['trainingRequirements'] as Array<Record<string, unknown>>).map(legacyTrainingToRequirement)
    : [];

  const incidents = Array.isArray(legacy['incidents'])
    ? (legacy['incidents'] as Array<Record<string, unknown>>).map(legacyIncidentToDraft)
    : [];

  const managementSnapshot =
    typeof legacy === 'object'
      ? {
          ...legacy,
          hazards: undefined,
          permits: undefined,
          incidents: undefined,
          ppeRequirements: undefined,
          trainingRequirements: undefined
        }
      : null;

  return {
    hazards,
    permits,
    ppeRequirements,
    trainingRequirements,
    incidents,
    management: managementSnapshot as Record<string, unknown> | null
  };
}
