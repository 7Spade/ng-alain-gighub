import type { ChangeImpact, ChangePriority, ChangeRequest, ChangeStatus, ChangeType, ChangeReview } from '@models';
import type { TaskChangeDbRecord } from '@tasks/shared/repository/task-change.repository';

export function analyzeChangeImpact(changeRequest: Omit<ChangeRequest, 'id'>): ChangeImpact {
  const impact = createEmptyChangeImpact();

  switch (changeRequest.type) {
    case 'schedule':
      if (changeRequest.impact?.schedule) {
        impact.schedule = changeRequest.impact.schedule;
      }
      break;
    case 'cost':
      if (changeRequest.impact?.cost) {
        impact.cost = changeRequest.impact.cost;
      }
      break;
    case 'scope':
      if (changeRequest.impact?.scope) {
        impact.scope = changeRequest.impact.scope;
      }
      break;
    case 'quality':
      if (changeRequest.impact?.quality) {
        impact.quality = changeRequest.impact.quality;
      }
      break;
  }

  return impact;
}

export function createEmptyChangeImpact(): ChangeImpact {
  return {
    scope: {
      description: '',
      added: [],
      removed: [],
      modified: []
    },
    schedule: {
      affectedTasks: [],
      criticalPathAffected: false,
      totalDelayDays: 0
    },
    cost: {
      additionalCost: 0,
      savings: 0,
      netCost: 0,
      breakdown: {
        labor: 0,
        material: 0,
        equipment: 0,
        subcontract: 0,
        overhead: 0,
        contingency: 0,
        profit: 0,
        other: 0
      }
    },
    quality: '',
    resource: ''
  };
}

export function convertChangeFromDb(db: TaskChangeDbRecord): ChangeRequest {
  const type = (db.type as ChangeType | null) ?? 'scope';
  const status = (db.status as ChangeStatus | null) ?? 'draft';
  const priority = (db.priority as ChangePriority | null) ?? 'normal';
  const impact = (db.impact as ChangeImpact | null) ?? createEmptyChangeImpact();

  return {
    id: db.id,
    changeNumber: (db.change_number as string | null) ?? '',
    type,
    title: (db.title as string | null) ?? '',
    description: (db.description as string | null) ?? '',
    reason: (db['reason'] as string | null) ?? '',
    justification: (db['justification'] as string | null) ?? '',
    impact,
    status,
    priority,
    initiatedDate:
      db.submitted_date || (db['initiated_date'] as string | null)
        ? new Date((db.submitted_date ?? db['initiated_date']) as string)
        : new Date(),
    initiator: (db['initiator_id'] as string | null) || (db.submitted_by as string | null) || '',
    initiatorOrganization: (db['initiator_organization'] as string | null) ?? '',
    reviews: ((db['reviews'] as ChangeReview[]) ?? []) as ChangeReview[],
    approver: (db.approved_by as string | null) ?? undefined,
    approvedDate: db.approved_date ? new Date(db.approved_date) : undefined,
    rejectionReason: (db.rejected_reason as string | null) || (db['rejection_reason'] as string | null) || undefined,
    implementedDate:
      db.implementation_date || (db['implemented_date'] as string | null)
        ? new Date((db.implementation_date ?? db['implemented_date']) as string)
        : undefined,
    implementedBy: (db.implemented_by as string | null) ?? undefined,
    relatedDocuments: ((db.related_changes as string[]) ?? (db['related_documents'] as string[]) ?? []) as string[]
  };
}

export function deserializeStoredChange(data: Record<string, unknown>): ChangeRequest {
  const type = (data['type'] as ChangeType | null) ?? 'scope';
  const status = (data['status'] as ChangeStatus | null) ?? 'draft';
  const priority = (data['priority'] as ChangePriority | null) ?? 'normal';
  const impact = (data['impact'] as ChangeImpact | null) ?? createEmptyChangeImpact();

  return {
    id: String(data['id'] ?? ''),
    changeNumber: String(data['changeNumber'] ?? ''),
    type,
    title: String(data['title'] ?? ''),
    description: String(data['description'] ?? ''),
    reason: String(data['reason'] ?? ''),
    justification: String(data['justification'] ?? ''),
    impact,
    status,
    priority,
    initiatedDate: data['initiatedDate'] ? new Date(data['initiatedDate'] as string) : new Date(),
    initiator: String(data['initiator'] ?? ''),
    initiatorOrganization: String(data['initiatorOrganization'] ?? ''),
    reviews: ((data['reviews'] as ChangeReview[]) ?? []) as ChangeReview[],
    approver: (data['approver'] as string | undefined) ?? undefined,
    approvedDate: data['approvedDate'] ? new Date(data['approvedDate'] as string) : undefined,
    rejectionReason: data['rejectionReason'] as string | undefined,
    implementedDate: data['implementedDate'] ? new Date(data['implementedDate'] as string) : undefined,
    implementedBy: data['implementedBy'] as string | undefined,
    relatedDocuments: ((data['relatedDocuments'] as string[]) ?? []) as string[]
  };
}
