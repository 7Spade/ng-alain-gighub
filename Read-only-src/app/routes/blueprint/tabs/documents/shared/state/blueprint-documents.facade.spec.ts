import { signal } from '@angular/core';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { OrganizationContextService } from '@core';
import type { BlueprintAggregationResult, BlueprintDocumentAggregation } from '@shared/models/blueprint-aggregation.model';
import type { Blueprint } from '@shared/models/blueprint.model';
import { ReplaySubject } from 'rxjs';

import { BlueprintDocumentsFacade } from './blueprint-documents.facade';
import { BlueprintTabRepository } from '../../../shared/data-access/blueprint-tab.repository';

class MockOrganizationContextService {
  readonly currentOrganizationId = signal<string | null>(null);
  readonly currentOrganization = signal<{ id: string } | null>(null);
}

class MockBlueprintTabRepository {
  getBlueprintId = jasmine.createSpy('getBlueprintId').and.callFake(async () => 'bp-1');
  getBlueprintAggregation = jasmine.createSpy('getBlueprintAggregation').and.callFake(
    async (): Promise<{ data: BlueprintAggregationResult | null; error: Error | null }> => ({
      data: mockAggregationResult,
      error: null
    })
  );
  getBlueprintInfo = jasmine.createSpy('getBlueprintInfo').and.callFake(
    async (): Promise<{ data: { blueprint: Blueprint; projectManager: null } | null; error: Error | null }> => ({
      data: {
        blueprint: {
          id: 'bp-1',
          name: 'Test Blueprint',
          slug: 'blueprint-slug',
          project_manager_id: null,
          description: '',
          organization_id: 'org-1',
          created_at: '',
          updated_at: '',
          progress_percentage: 0,
          status: 'active'
        } as Blueprint,
        projectManager: null
      },
      error: null
    })
  );
}

const mockDocumentsAggregation: BlueprintDocumentAggregation = {
  totals: {
    total: 3,
    files: 2,
    directories: 1,
    storageSize: 1024 * 1024,
    lastUpdatedAt: '2025-11-12T00:00:00Z'
  },
  byType: [
    { key: 'file', value: 2 },
    { key: 'directory', value: 1 }
  ],
  byDirectory: [{ directoryId: null, directoryPath: '/', count: 2 }],
  classification: {
    discipline: [
      { key: 'Structural', label: 'Structural', value: 1 },
      { key: 'MEP', label: 'MEP', value: 1 },
      { key: '__EMPTY__', label: '未設定專業', value: 0 }
    ],
    phase: [
      { key: '施工', label: '施工', value: 1 },
      { key: '設計', label: '設計', value: 1 }
    ],
    package: [
      { key: 'PKG-1', label: 'PKG-1', value: 1 },
      { key: 'PKG-2', label: 'PKG-2', value: 1 }
    ]
  },
  recent: [
    {
      id: 'doc-1',
      blueprintId: 'bp-1',
      name: 'Report.pdf',
      type: 'file',
      path: '/Report.pdf',
      size: 256000,
      currentVersion: 1,
      discipline: 'Structural',
      phase: '施工',
      package: 'PKG-1',
      updatedAt: '2025-11-12T00:00:00Z'
    }
  ]
};

const mockAggregationResult: BlueprintAggregationResult = {
  blueprintId: 'bp-1',
  blueprintName: 'Test Blueprint',
  generatedAt: '2025-11-12T00:00:00Z',
  filters: {
    includeDimensions: ['documents']
  },
  documents: mockDocumentsAggregation
};

describe('BlueprintDocumentsFacade', () => {
  let facade: BlueprintDocumentsFacade;
  let repository: MockBlueprintTabRepository;
  let routeStub: { parent: { params: ReplaySubject<{ slug: string }> } };
  let orgContext: MockOrganizationContextService;

  beforeEach(() => {
    repository = new MockBlueprintTabRepository();
    routeStub = { parent: { params: new ReplaySubject<{ slug: string }>(1) } };

    TestBed.configureTestingModule({
      providers: [
        BlueprintDocumentsFacade,
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: OrganizationContextService, useClass: MockOrganizationContextService },
        { provide: BlueprintTabRepository, useValue: repository }
      ]
    });

    facade = TestBed.inject(BlueprintDocumentsFacade);
    orgContext = TestBed.inject(OrganizationContextService) as unknown as MockOrganizationContextService;
    orgContext.currentOrganizationId.set('org-1');
    orgContext.currentOrganization.set({ id: 'org-1' });
    routeStub.parent.params.next({ slug: 'blueprint-slug' });
  });

  it('should expose documents aggregation after loading', fakeAsync(() => {
    (facade as any).load('bp-1');
    flushMicrotasks();

    expect(repository.getBlueprintAggregation).toHaveBeenCalledWith('bp-1', { includeDimensions: ['documents'] });
    const aggregation = facade.aggregation();
    expect(aggregation?.totals.total).toBe(3);
    expect(facade.blueprint()?.name).toBe('Test Blueprint');
    expect(facade.disciplineSummary().length).toBeGreaterThan(0);
    expect(facade.disciplineSummary()[0].key).toBe('Structural');
  }));
});
