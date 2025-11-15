import type { ChangeImpact, ChangeRequest } from '@models';
import type { TaskChangeDbRecord } from '@tasks/shared/repository/task-change.repository';

import { analyzeChangeImpact, convertChangeFromDb, createEmptyChangeImpact, deserializeStoredChange } from '../change.domain';

describe('Change Domain', () => {
  it('returns default impact when no overrides provided', () => {
    const request: Omit<ChangeRequest, 'id'> = {
      changeNumber: 'CR-001',
      type: 'scope',
      title: 'Test',
      description: 'Desc',
      impact: undefined,
      status: 'draft',
      priority: 'normal',
      initiatedDate: new Date(),
      initiator: 'u1',
      reviews: []
    } as unknown as Omit<ChangeRequest, 'id'>;

    const impact = analyzeChangeImpact(request);
    expect(impact.scope.added.length).toBe(0);
    expect(impact.cost.netCost).toBe(0);
  });

  it('keeps provided impact sections', () => {
    const request: Omit<ChangeRequest, 'id'> = {
      changeNumber: 'CR-002',
      type: 'cost',
      title: '',
      impact: {
        cost: {
          additionalCost: 1000,
          savings: 100,
          netCost: 900,
          breakdown: {
            labor: 500,
            material: 300,
            equipment: 100,
            subcontract: 0,
            overhead: 0,
            contingency: 0,
            profit: 0,
            other: 0
          }
        }
      }
    } as unknown as Omit<ChangeRequest, 'id'>;

    const impact = analyzeChangeImpact(request) as ChangeImpact;
    expect(impact.cost?.netCost).toBe(900);
  });

  it('creates empty impact snapshot', () => {
    const impact = createEmptyChangeImpact();
    expect(impact.schedule.totalDelayDays).toBe(0);
    expect(impact.scope.added).toEqual([]);
  });

  it('converts database records to domain request', () => {
    const dbRecord = {
      id: 'change-1',
      task_id: 'task-1',
      change_number: 'CR-10',
      type: 'scope',
      title: 'Title',
      description: 'Desc',
      impact: createEmptyChangeImpact() as unknown as Record<string, unknown>,
      status: 'draft',
      priority: 'normal',
      submitted_date: new Date().toISOString(),
      submitted_by: 'user-1',
      approved_by: null,
      approved_date: null,
      rejected_by: null,
      rejected_date: null,
      rejected_reason: null,
      implementation_date: null,
      implemented_by: null,
      verified_date: null,
      verified_by: null,
      alternatives: null,
      related_changes: [],
      attachments: []
    } as TaskChangeDbRecord;

    const request = convertChangeFromDb(dbRecord);
    expect(request.id).toBe('change-1');
    expect(request.type).toBe('scope');
    expect(request.status).toBe('draft');
  });

  it('deserializes stored legacy change payload', () => {
    const stored: Record<string, unknown> = {
      id: 'change-legacy',
      changeNumber: 'OLD-1',
      type: 'cost',
      status: 'approved',
      priority: 'high',
      impact: createEmptyChangeImpact()
    };

    const request = deserializeStoredChange(stored);
    expect(request.id).toBe('change-legacy');
    expect(request.type).toBe('cost');
    expect(request.priority).toBe('high');
  });
});
