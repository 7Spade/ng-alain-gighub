import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import type { BlueprintDocument, BlueprintDocumentVersion } from '@shared/models/blueprint.model';
import type { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import type { NzUploadFile } from 'ng-zorro-antd/upload';

import { TaskDocumentsFacade } from './task-documents.facade';
import { BlueprintDocumentsRepository } from '../../../documents/shared/data-access/blueprint-documents.repository';

class MockBlueprintDocumentsRepository {
  listDocuments = jasmine.createSpy('listDocuments').and.callFake(async () => ({ data: mockDocuments, error: null as Error | null }));
  listDocumentVersions = jasmine
    .createSpy('listDocumentVersions')
    .and.callFake(async () => ({ data: mockVersions, error: null as Error | null }));
  createDirectory = jasmine.createSpy('createDirectory').and.callFake(async () => ({ data: mockDirectory, error: null as Error | null }));
  deleteDocument = jasmine.createSpy('deleteDocument').and.callFake(async () => ({ error: null as Error | null }));
  getCurrentUserId = jasmine.createSpy('getCurrentUserId').and.callFake(async () => 'user-1');
  uploadNewDocument = jasmine.createSpy('uploadNewDocument').and.callFake(async () => ({
    document: {
      id: 'doc-new',
      blueprint_id: 'bp-1',
      name: 'new-file.pdf',
      path: '/new-file.pdf',
      type: 'file',
      mime_type: 'application/pdf',
      size: 100,
      storage_path: 'documents/doc-new.pdf',
      current_version: 1,
      parent_id: 'dir-root',
      created_by: 'user-1',
      created_at: '2025-11-12T01:10:00Z',
      updated_at: '2025-11-12T01:10:00Z'
    } as BlueprintDocument,
    version: {
      id: 'ver-new',
      document_id: 'doc-new',
      version: 1,
      changed_by: 'user-1',
      created_at: '2025-11-12T01:10:00Z'
    } as BlueprintDocumentVersion,
    publicUrl: null
  }));
  uploadNewVersion = jasmine.createSpy('uploadNewVersion').and.callFake(async () => ({
    version: {
      id: 'ver-existing',
      document_id: 'doc-1',
      version: 2,
      changed_by: 'user-1',
      created_at: '2025-11-12T01:15:00Z'
    } as BlueprintDocumentVersion,
    publicUrl: null
  }));
  recalculateDocumentsAggregation = jasmine
    .createSpy('recalculateDocumentsAggregation')
    .and.callFake(async () => ({ data: null, error: null }));
  updateDocumentMetadata = jasmine
    .createSpy('updateDocumentMetadata')
    .and.callFake(async () => ({ data: mockDocuments[1], error: null as Error | null }));
  toNzUploadFileList = (files: NzUploadFile[]) => files;
}

const mockDocuments: BlueprintDocument[] = [
  {
    id: 'dir-root',
    blueprint_id: 'bp-1',
    name: 'Root',
    path: '/',
    type: 'directory',
    current_version: 0,
    created_by: 'user-1',
    created_at: '2025-11-12T00:00:00Z',
    updated_at: '2025-11-12T00:00:00Z'
  },
  {
    id: 'doc-1',
    blueprint_id: 'bp-1',
    name: 'Structural Plan',
    path: '/Structural Plan.pdf',
    type: 'file',
    mime_type: 'application/pdf',
    size: 2048,
    storage_path: 'documents/doc-1.pdf',
    current_version: 1,
    parent_id: 'dir-root',
    created_by: 'user-1',
    created_at: '2025-11-12T00:05:00Z',
    updated_at: '2025-11-12T00:05:00Z',
    discipline: 'Structural',
    phase: '施工',
    package: 'PKG-1'
  },
  {
    id: 'doc-2',
    blueprint_id: 'bp-1',
    name: 'MEP Schedule',
    path: '/MEP Schedule.xlsx',
    type: 'file',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 4096,
    storage_path: 'documents/doc-2.xlsx',
    current_version: 2,
    parent_id: 'dir-root',
    created_by: 'user-2',
    created_at: '2025-11-12T00:10:00Z',
    updated_at: '2025-11-12T00:20:00Z',
    discipline: 'MEP',
    phase: '設計',
    package: 'PKG-2'
  }
];

const mockVersions: BlueprintDocumentVersion[] = [];

const mockDirectory: BlueprintDocument = {
  id: 'dir-2',
  blueprint_id: 'bp-1',
  name: '設計圖',
  path: '/設計圖',
  type: 'directory',
  current_version: 0,
  created_by: 'user-1',
  created_at: '2025-11-12T01:00:00Z',
  updated_at: '2025-11-12T01:00:00Z'
};

describe('TaskDocumentsFacade', () => {
  let facade: TaskDocumentsFacade;
  let repository: MockBlueprintDocumentsRepository;

  beforeEach(() => {
    repository = new MockBlueprintDocumentsRepository();

    TestBed.configureTestingModule({
      providers: [TaskDocumentsFacade, { provide: BlueprintDocumentsRepository, useValue: repository }]
    });

    facade = TestBed.inject(TaskDocumentsFacade);
  });

  it('should load documents when blueprint id is set', fakeAsync(() => {
    facade.setBlueprintId('bp-1');
    flushMicrotasks();
    flushMicrotasks();
    facade.refresh();
    flushMicrotasks();
    flushMicrotasks();

    expect(repository.listDocuments).toHaveBeenCalledWith('bp-1');
    expect(facade.documents().length).toBe(3);
  }));

  it('should filter documents by classification signals', fakeAsync(() => {
    facade.setBlueprintId('bp-1');
    flushMicrotasks();
    flushMicrotasks();
    // 等待数据加载完成
    void facade.refresh();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();

    expect(facade.documents().length).toBeGreaterThan(0);
    expect(facade.disciplineOptions()).toContain('Structural');
    expect(facade.phaseOptions()).toContain('施工');
    expect(facade.packageOptions()).toContain('PKG-1');

    facade.setDisciplineFilter('Structural');
    const treeAfterDiscipline = facade.documentTree();
    const rootNode = treeAfterDiscipline.find(node => node.key === 'dir-root');
    expect(rootNode?.children?.length ?? 0).toBe(1);
    expect(facade.disciplineSummary().length).toBe(1);

    facade.setPhaseFilter('施工');
    facade.setPackageFilter('PKG-1');
    const treeAfterAllFilters = facade.documentTree();
    const rootFiltered = treeAfterAllFilters.find(node => node.key === 'dir-root');
    expect(rootFiltered?.children?.length ?? 0).toBe(1);

    facade.clearFilters();
    const treeAfterClear = facade.documentTree();
    const restoredRoot = treeAfterClear.find(node => node.key === 'dir-root');
    expect(restoredRoot?.children?.length ?? 0).toBe(2);
  }));

  it('should create directory and notify aggregation', fakeAsync(() => {
    facade.setBlueprintId('bp-1');
    flushMicrotasks();
    flushMicrotasks();
    facade.refresh();
    flushMicrotasks();
    flushMicrotasks();

    facade.openCreateFolderModal();
    facade.folderForm.patchValue({ name: '設計圖' });

    void facade.submitCreateFolder();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();

    expect(repository.createDirectory).toHaveBeenCalled();
    expect(repository.recalculateDocumentsAggregation).toHaveBeenCalledWith('bp-1', ['documents', 'activities']);
    expect(facade.successMessage()).toBe('目錄已創建');
    expect(facade.showCreateFolderModal()).toBeFalse();
  }));

  it('should update document classification when saving metadata', fakeAsync(() => {
    facade.setBlueprintId('bp-1');
    flushMicrotasks();
    flushMicrotasks();
    // 等待数据加载完成
    void facade.refresh();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();

    facade.handleTreeSelect({
      eventName: 'click',
      node: {
        key: 'doc-1',
        isLeaf: true,
        origin: { document: mockDocuments[1] }
      }
    } as unknown as NzFormatEmitEvent);
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();

    // 确保 metadataForm 已启用且不是 pristine
    if (facade.metadataForm.disabled) {
      facade.metadataForm.enable({ emitEvent: false });
    }
    // 使用 setValue 而不是 patchValue，确保值不同
    facade.metadataForm.setValue(
      {
        discipline: 'QA',
        phase: '驗收',
        package: 'PKG-9'
      },
      { emitEvent: false }
    );
    // 确保 form 不是 pristine
    facade.metadataForm.markAsDirty();
    flushMicrotasks();

    // 验证 form 状态
    expect(facade.metadataForm.disabled).toBeFalse();
    expect(facade.metadataForm.pristine).toBeFalse();

    void facade.saveDocumentMetadata();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();
    flushMicrotasks();

    expect(repository.updateDocumentMetadata).toHaveBeenCalledWith(
      'doc-1',
      jasmine.objectContaining({
        discipline: 'QA',
        phase: '驗收',
        package: 'PKG-9'
      })
    );
    expect(repository.recalculateDocumentsAggregation).toHaveBeenCalledWith('bp-1', ['documents', 'activities']);
    expect(facade.metadataForm.pristine).toBeTrue();
  }));
});
