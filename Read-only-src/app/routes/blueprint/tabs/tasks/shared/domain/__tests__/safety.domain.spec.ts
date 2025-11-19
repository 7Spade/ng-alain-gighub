import type { HazardRecord, TaskSafetySummaryRecord } from '@tasks/shared/repository/task-safety.repository';

import {
  createDefaultSafetySummaryPayload,
  extractLegacySafetySnapshot,
  hazardFromRecord,
  hazardToRecord,
  incidentFromRecord,
  summaryFromRecord
} from '../safety.domain';

describe('Safety Domain', () => {
  it('creates default safety summary payload', () => {
    const summary = createDefaultSafetySummaryPayload();
    expect(summary.hazardRegister).toEqual([]);
    expect(summary.management).toBeNull();
  });

  it('maps hazard record to domain object and back', () => {
    const record: HazardRecord = {
      id: 'haz-1',
      type: 'fire',
      description: 'Fire hazard',
      location: 'Zone A',
      severity: 3,
      likelihood: 2,
      riskLevel: 6,
      riskCategory: 'medium',
      controls: [],
      residualRisk: 4,
      status: 'identified'
    };

    const hazard = hazardFromRecord(record);
    expect(hazard.description).toBe('Fire hazard');

    const serialized = hazardToRecord(hazard);
    expect(serialized.id).toBe('haz-1');
    expect(serialized.type).toBe('fire');
  });

  it('maps summary record to domain summary', () => {
    const summaryRecord: TaskSafetySummaryRecord = {
      id: 'summary-1',
      taskId: 'task-1',
      hazardRegister: [],
      permits: [],
      ppeRequirements: [],
      trainingRequirements: [],
      management: null,
      updatedAt: new Date(),
      updatedBy: null
    };

    const summary = summaryFromRecord(summaryRecord);
    expect(summary.taskId).toBe('task-1');
    expect(summary.hazards.length).toBe(0);
  });

  it('maps incidents from repository record', () => {
    const incident = incidentFromRecord({
      id: 'incident-1',
      taskId: 'task-1',
      safetyId: 'summary-1',
      incidentType: 'incident',
      severity: '3',
      status: 'reported',
      occurredAt: new Date(),
      reportedAt: null,
      resolvedAt: null,
      reportedBy: 'user',
      description: 'Test',
      correctiveActions: [{ description: 'Fix issue' }],
      attachments: [{ url: 'https://example.com' }],
      metadata: { relatedHazardId: 'haz-1' },
      createdAt: new Date(),
      createdBy: 'user'
    });

    expect(incident.correctiveActions).toEqual(['Fix issue']);
    expect(incident.attachments).toEqual(['https://example.com']);
    expect(incident.relatedHazardId).toBe('haz-1');
  });

  it('extracts legacy safety snapshot', () => {
    const snapshot = extractLegacySafetySnapshot({
      hazards: [{ id: 'haz-legacy', type: 'gas' }],
      permits: [{ id: 'permit-legacy', type: 'hot-work' }],
      incidents: [{ id: 'incident-legacy', type: 'incident', description: 'legacy incident' }]
    });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.hazards[0]?.id).toBe('haz-legacy');
    expect(snapshot?.incidents[0]?.id).toBe('incident-legacy');
  });
});
