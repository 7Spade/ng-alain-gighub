import { TestBed } from '@angular/core/testing';
import type {
  BlueprintActivityAggregation,
  BlueprintDocumentAggregation,
  BlueprintQualitySummary
} from '@shared/models/blueprint-aggregation.model';
import type { BlueprintDocument, BlueprintQualityCheckWithUsers } from '@shared/models/blueprint.model';

import { BlueprintAggregationService } from './blueprint-aggregation.service';
import { buildBlueprintDocument } from '../../../../testing/fixtures/blueprint-document.fixture';
import { ErrorStateService } from '../../net/error';
import { SupabaseService } from '../../supabase/supabase.service';
import { BlueprintQualityCheckService } from '../quality/blueprint-quality-check.service';

interface TBlueprintRecord {
  id: string;
  name: string;
}

interface SupabaseMaybeSingleResponse<T> {
  data: T | null;
  error: Error | null;
}

interface ActivityRow {
  id: string;
  blueprint_id: string;
  type: string;
  action: string;
  description: string | null;
  user_id: string;
  related_id: string | null;
  created_at: string;
  user: {
    display_name: string | null;
    email: string | null;
    avatar_url: string | null;
  } | null;
}

describe('BlueprintAggregationService (quality)', () => {
  let service: BlueprintAggregationService;
  let qualityService: jasmine.SpyObj<BlueprintQualityCheckService>;
  let activityRows: ActivityRow[];
  let documentRows: BlueprintDocument[];
  let idCounter = 0;

  const nextId = () => `qc-${++idCounter}`;

  const buildQualityCheck = (overrides: Partial<BlueprintQualityCheckWithUsers>): BlueprintQualityCheckWithUsers => ({
    id: overrides.id ?? nextId(),
    blueprint_id: overrides.blueprint_id ?? 'bp-1',
    title: overrides.title ?? 'QC',
    description: overrides.description ?? 'desc',
    category: overrides.category ?? 'safety',
    status: overrides.status ?? 'pending',
    score: overrides.score ?? null,
    inspector_id: overrides.inspector_id ?? 'inspector-1',
    checked_by: overrides.checked_by ?? null,
    check_date: overrides.check_date ?? '2025-11-01T10:00:00.000Z',
    next_check_date: overrides.next_check_date ?? null,
    attachments: overrides.attachments ?? [],
    notes: overrides.notes ?? null,
    created_at: overrides.created_at ?? '2025-11-01T10:00:00.000Z',
    updated_at: overrides.updated_at ?? '2025-11-01T10:00:00.000Z',
    inspector: overrides.inspector ?? null,
    checked_user: overrides.checked_user ?? null
  });

  beforeEach(() => {
    idCounter = 0;
    activityRows = [];
    documentRows = [];

    const buildSupabaseChain = <T>(payload: SupabaseMaybeSingleResponse<T>) => ({
      select: jasmine.createSpy('select').and.callFake(() => ({
        eq: jasmine.createSpy('eq').and.callFake(() => ({
          maybeSingle: jasmine.createSpy('maybeSingle').and.resolveTo(payload)
        }))
      }))
    });

    const buildActivitiesChain = () => ({
      select: jasmine.createSpy('select').and.callFake(() => ({
        eq: jasmine.createSpy('eq').and.callFake(() => ({
          order: jasmine.createSpy('order').and.callFake(() => ({
            limit: jasmine.createSpy('limit').and.callFake(() => Promise.resolve({ data: activityRows, error: null }))
          }))
        }))
      }))
    });

    const buildDocumentsChain = () => ({
      select: jasmine.createSpy('select').and.callFake(() => ({
        eq: jasmine.createSpy('eq').and.callFake(() => Promise.resolve({ data: documentRows, error: null }))
      }))
    });

    const fromSpy = jasmine.createSpy('from').and.callFake((table: string) => {
      if (table === 'blueprint_activities') {
        return buildActivitiesChain();
      }
      if (table === 'blueprint_documents') {
        return buildDocumentsChain();
      }
      return buildSupabaseChain<TBlueprintRecord>({ data: { id: 'bp-1', name: 'Mock Blueprint' }, error: null });
    });

    const supabaseMock = {
      client: {
        from: fromSpy
      }
    };

    TestBed.configureTestingModule({
      providers: [
        BlueprintAggregationService,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: ErrorStateService, useValue: jasmine.createSpyObj('ErrorStateService', ['addError']) },
        {
          provide: BlueprintQualityCheckService,
          useValue: jasmine.createSpyObj<BlueprintQualityCheckService>('BlueprintQualityCheckService', ['getQualityChecks'])
        }
      ]
    });

    service = TestBed.inject(BlueprintAggregationService);
    qualityService = TestBed.inject(BlueprintQualityCheckService) as jasmine.SpyObj<BlueprintQualityCheckService>;
  });

  it('should compute quality summary metrics', () => {
    const summary = (
      service as unknown as { computeQualitySummary(checks: BlueprintQualityCheckWithUsers[]): BlueprintQualitySummary }
    ).computeQualitySummary([
      buildQualityCheck({ status: 'passed' }),
      buildQualityCheck({ status: 'failed' }),
      buildQualityCheck({ status: 'needs-improvement' }),
      buildQualityCheck({ status: 'in-progress' }),
      buildQualityCheck({ status: 'passed' })
    ]);

    expect(summary.standardsCovered).toBe(2);
    expect(summary.inspectionsCompleted).toBe(4);
    expect(summary.inspectionsPlanned).toBe(5);
    expect(summary.openNcr).toBe(2);
    expect(summary.firstPassYield).toBeCloseTo(50, 5);
    expect(summary.closeRate).toBeCloseTo(40, 5);
  });

  it('should build quality alerts based on summary thresholds', () => {
    const summary: BlueprintQualitySummary = {
      standardsCovered: 4,
      standardsTotal: 6,
      inspectionsCompleted: 4,
      inspectionsPlanned: 6,
      firstPassYield: 80,
      openNcr: 6,
      closeRate: 66.6
    };

    const alerts = (service as unknown as { buildQualityAlerts(summary: BlueprintQualitySummary): unknown[] }).buildQualityAlerts(summary);

    expect(alerts.length).toBe(2);
    const [fpyAlert, ncrAlert] = alerts as Array<{ id: string; severity: string }>;
    expect(fpyAlert.id).toBe('quality-fpy');
    expect(ncrAlert.id).toBe('quality-ncr');
    expect(ncrAlert.severity).toBe('critical');
  });

  it('should build sorted quality trend points with FPY and NCR', () => {
    const trend = (
      service as unknown as {
        buildQualityTrend(
          checks: BlueprintQualityCheckWithUsers[]
        ): Array<{ label: string; inspections: number; firstPassYield: number; ncr: number }>;
      }
    ).buildQualityTrend([
      buildQualityCheck({ status: 'passed', check_date: '2025-10-05T10:00:00.000Z' }),
      buildQualityCheck({ status: 'failed', check_date: '2025-10-15T10:00:00.000Z' }),
      buildQualityCheck({ status: 'passed', check_date: '2025-11-02T10:00:00.000Z' })
    ]);

    expect(trend).toEqual([
      { label: '2025-10', inspections: 2, firstPassYield: 50, ncr: 1 },
      { label: '2025-11', inspections: 1, firstPassYield: 100, ncr: 0 }
    ]);
  });

  it('should return quality aggregation result when quality dimension requested', async () => {
    const checks = [
      buildQualityCheck({ status: 'passed', check_date: '2025-11-01T10:00:00.000Z' }),
      buildQualityCheck({ status: 'needs-improvement', check_date: '2025-11-03T10:00:00.000Z' })
    ];
    qualityService.getQualityChecks.and.resolveTo({ data: checks, error: null });

    const result = await service.getAggregationResult('bp-1', { includeDimensions: ['quality'] });

    expect(qualityService.getQualityChecks).toHaveBeenCalledWith('bp-1');
    expect(result.quality).toBeDefined();
    expect(result.quality?.summary.inspectionsPlanned).toBe(2);
    expect(result.quality?.trend.length).toBe(1);
  });

  it('should aggregate blueprint activities with distributions', async () => {
    activityRows = [
      {
        id: 'act-1',
        blueprint_id: 'bp-1',
        type: 'task',
        action: '建立任務',
        description: '建立任務 A',
        user_id: 'user-1',
        related_id: 'task-1',
        created_at: '2025-11-10T09:00:00.000Z',
        user: { display_name: 'Alice', email: 'alice@example.com', avatar_url: 'avatar-1.png' }
      },
      {
        id: 'act-2',
        blueprint_id: 'bp-1',
        type: 'task',
        action: '更新任務',
        description: '更新任務 B',
        user_id: 'user-1',
        related_id: 'task-2',
        created_at: '2025-11-10T10:00:00.000Z',
        user: { display_name: 'Alice', email: 'alice@example.com', avatar_url: 'avatar-1.png' }
      },
      {
        id: 'act-3',
        blueprint_id: 'bp-1',
        type: 'milestone',
        action: '完成里程碑',
        description: '完成 M1',
        user_id: 'user-2',
        related_id: 'milestone-1',
        created_at: '2025-11-09T12:00:00.000Z',
        user: { display_name: null, email: 'bob@example.com', avatar_url: null }
      }
    ];

    const result = await service.getAggregationResult('bp-1', { includeDimensions: ['activities'] });

    const activities = result.activities as BlueprintActivityAggregation;
    expect(activities).toBeDefined();
    expect(activities.recent.length).toBe(3);
    expect(activities.totals.total).toBe(3);
    expect(activities.totals.uniqueUsers).toBe(2);
    expect(activities.byType.find(entry => entry.key === 'task')?.value).toBe(2);
    expect(activities.byUser[0]).toEqual(jasmine.objectContaining({ userId: 'user-1', count: 2 }));
    expect(activities.timeline.length).toBe(2);
  });

  it('should aggregate blueprint documents with totals and distributions', async () => {
    documentRows = [
      buildBlueprintDocument({
        id: 'doc-1',
        blueprint_id: 'bp-1',
        name: 'root-folder',
        path: '/root-folder',
        type: 'directory',
        size: null,
        current_version: 0,
        parent_id: null,
        storage_path: null,
        mime_type: null,
        created_at: '2025-11-08T10:00:00.000Z',
        updated_at: '2025-11-10T12:00:00.000Z'
      }),
      buildBlueprintDocument({
        id: 'doc-2',
        blueprint_id: 'bp-1',
        name: 'design.pdf',
        path: '/root-folder/design.pdf',
        type: 'file',
        size: 1024,
        current_version: 2,
        parent_id: 'doc-1',
        storage_path: 'storage/design.pdf',
        mime_type: 'application/pdf',
        created_at: '2025-11-09T08:00:00.000Z',
        updated_at: '2025-11-11T10:00:00.000Z',
        discipline: 'Structural',
        phase: '施工',
        package: 'PKG-1'
      }),
      buildBlueprintDocument({
        id: 'doc-3',
        blueprint_id: 'bp-1',
        name: 'notes.txt',
        path: '/notes.txt',
        type: 'file',
        size: 512,
        current_version: 1,
        parent_id: null,
        storage_path: 'storage/notes.txt',
        mime_type: 'text/plain',
        created_at: '2025-11-07T09:00:00.000Z',
        updated_at: '2025-11-07T09:00:00.000Z',
        discipline: 'MEP',
        phase: '設計',
        package: 'PKG-2'
      })
    ];

    const result = await service.getAggregationResult('bp-1', { includeDimensions: ['documents'] });

    const documents = result.documents as BlueprintDocumentAggregation;
    expect(documents).toBeDefined();
    expect(documents.totals.total).toBe(3);
    expect(documents.totals.files).toBe(2);
    expect(documents.totals.directories).toBe(1);
    expect(documents.totals.storageSize).toBe(1536);
    expect(documents.byType.find(entry => entry.key === 'file')?.value).toBe(2);
    expect(documents.byDirectory.find(entry => entry.directoryId === 'doc-1')?.count).toBe(1);
    expect(documents.recent[0].id).toBe('doc-2');
    expect(documents.classification.discipline.find(entry => entry.key === 'Structural')?.value).toBe(1);
    expect(documents.classification.phase.find(entry => entry.key === '施工')?.value).toBe(1);
    expect(documents.classification.package.find(entry => entry.key === 'PKG-1')?.value).toBe(1);
  });
});
