import { TestBed } from '@angular/core/testing';
import { OrganizationCollaborationRepository, CollaborationType, CollaborationStatus } from '@core';
import { OrganizationCollaboration } from '@shared';
import { of, throwError } from 'rxjs';

import { CollaborationService } from './collaboration.service';

describe('CollaborationService', () => {
  let service: CollaborationService;
  let repository: jasmine.SpyObj<OrganizationCollaborationRepository>;

  const mockCollaboration: OrganizationCollaboration = {
    id: 'collab-1',
    blueprint_id: 'blueprint-1',
    owner_org_id: 'org-1',
    collaborator_org_id: 'org-2',
    collaboration_type: CollaborationType.CONTRACTOR,
    status: CollaborationStatus.ACTIVE,
    contract_start_date: '2025-01-01',
    contract_end_date: '2025-12-31',
    notes: 'Test collaboration',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  } as OrganizationCollaboration;

  const mockCollaborations: OrganizationCollaboration[] = [
    mockCollaboration,
    {
      ...mockCollaboration,
      id: 'collab-2',
      status: CollaborationStatus.PENDING,
      collaboration_type: CollaborationType.SUBCONTRACTOR
    }
  ];

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('OrganizationCollaborationRepository', [
      'findAll',
      'findById',
      'findByBlueprintId',
      'findByOwnerOrgId',
      'findByCollaboratorOrgId',
      'findByCollaborationType',
      'findByStatus',
      'create',
      'update',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [CollaborationService, { provide: OrganizationCollaborationRepository, useValue: repositorySpy }]
    });

    service = TestBed.inject(CollaborationService);
    repository = TestBed.inject(OrganizationCollaborationRepository) as jasmine.SpyObj<OrganizationCollaborationRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty collaborations', () => {
      expect(service.collaborations().length).toBe(0);
    });

    it('should have null selected collaboration', () => {
      expect(service.selectedCollaboration()).toBeNull();
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('loadCollaborations', () => {
    it('should load collaborations successfully', async () => {
      repository.findAll.and.returnValue(of(mockCollaborations));

      await service.loadCollaborations();

      expect(service.collaborations().length).toBe(2);
      expect(service.collaborations()[0].id).toBe('collab-1');
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should set loading state during load', async () => {
      repository.findAll.and.returnValue(of(mockCollaborations));

      const loadPromise = service.loadCollaborations();
      expect(service.loading()).toBe(true);

      await loadPromise;
      expect(service.loading()).toBe(false);
    });

    it('should handle error when loading fails', async () => {
      const error = new Error('Load failed');
      repository.findAll.and.returnValue(throwError(() => error));

      try {
        await service.loadCollaborations();
        fail('should have thrown error');
      } catch (_e) {
        expect(service.error()).toBe('Load failed');
        expect(service.loading()).toBe(false);
      }
    });
  });

  describe('loadCollaborationById', () => {
    it('should load collaboration by id successfully', async () => {
      repository.findById.and.returnValue(of(mockCollaboration));

      const result = await service.loadCollaborationById('collab-1');

      expect(result).toEqual(mockCollaboration);
      expect(service.selectedCollaboration()).toEqual(mockCollaboration);
      expect(service.loading()).toBe(false);
    });

    it('should return null when collaboration not found', async () => {
      repository.findById.and.returnValue(of(null));

      const result = await service.loadCollaborationById('non-existent');

      expect(result).toBeNull();
      expect(service.selectedCollaboration()).toBeNull();
    });

    it('should handle error when loading by id fails', async () => {
      const error = new Error('Not found');
      repository.findById.and.returnValue(throwError(() => error));

      try {
        await service.loadCollaborationById('collab-1');
        fail('should have thrown error');
      } catch (_e) {
        expect(service.error()).toBe('Not found');
      }
    });
  });

  describe('loadCollaborationsByBlueprintId', () => {
    it('should load collaborations by blueprint id', async () => {
      repository.findByBlueprintId.and.returnValue(of(mockCollaborations));

      const result = await service.loadCollaborationsByBlueprintId('blueprint-1');

      expect(result.length).toBe(2);
      expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
    });
  });

  describe('loadCollaborationsByOwnerOrgId', () => {
    it('should load collaborations by owner org id', async () => {
      repository.findByOwnerOrgId.and.returnValue(of(mockCollaborations));

      const result = await service.loadCollaborationsByOwnerOrgId('org-1');

      expect(result.length).toBe(2);
      expect(repository.findByOwnerOrgId).toHaveBeenCalledWith('org-1');
    });
  });

  describe('loadCollaborationsByCollaboratorOrgId', () => {
    it('should load collaborations by collaborator org id', async () => {
      repository.findByCollaboratorOrgId.and.returnValue(of(mockCollaborations));

      const result = await service.loadCollaborationsByCollaboratorOrgId('org-2');

      expect(result.length).toBe(2);
      expect(repository.findByCollaboratorOrgId).toHaveBeenCalledWith('org-2');
    });
  });

  describe('loadCollaborationsByType', () => {
    it('should load collaborations by type', async () => {
      repository.findByCollaborationType.and.returnValue(of([mockCollaboration]));

      const result = await service.loadCollaborationsByType(CollaborationType.CONTRACTOR);

      expect(result.length).toBe(1);
      expect(repository.findByCollaborationType).toHaveBeenCalledWith(CollaborationType.CONTRACTOR);
    });
  });

  describe('loadCollaborationsByStatus', () => {
    it('should load collaborations by status', async () => {
      repository.findByStatus.and.returnValue(of([mockCollaboration]));

      const result = await service.loadCollaborationsByStatus(CollaborationStatus.ACTIVE);

      expect(result.length).toBe(1);
      expect(repository.findByStatus).toHaveBeenCalledWith(CollaborationStatus.ACTIVE);
    });
  });

  describe('createCollaboration', () => {
    it('should create collaboration successfully', async () => {
      const newCollaboration = { ...mockCollaboration, id: 'collab-new' };
      repository.create.and.returnValue(of(newCollaboration));

      const result = await service.createCollaboration({
        blueprint_id: 'blueprint-1',
        owner_org_id: 'org-1',
        collaborator_org_id: 'org-2',
        collaboration_type: CollaborationType.CONTRACTOR
      });

      expect(result).toEqual(newCollaboration);
      expect(service.collaborations().length).toBe(1);
      expect(service.collaborations()[0].id).toBe('collab-new');
    });

    it('should handle error when creating fails', async () => {
      const error = new Error('Create failed');
      repository.create.and.returnValue(throwError(() => error));

      try {
        await service.createCollaboration({
          blueprint_id: 'blueprint-1',
          owner_org_id: 'org-1',
          collaborator_org_id: 'org-2',
          collaboration_type: CollaborationType.CONTRACTOR
        });
        fail('should have thrown error');
      } catch (_e) {
        expect(service.error()).toBe('Create failed');
      }
    });
  });

  describe('updateCollaboration', () => {
    beforeEach(() => {
      service['collaborationsState'].set(mockCollaborations);
    });

    it('should update collaboration successfully', async () => {
      const updated = { ...mockCollaboration, notes: 'Updated notes' };
      repository.update.and.returnValue(of(updated));

      const result = await service.updateCollaboration('collab-1', { notes: 'Updated notes' });

      expect(result).toEqual(updated);
      expect(service.collaborations()[0].notes).toBe('Updated notes');
    });

    it('should update selected collaboration if it matches', async () => {
      service.selectCollaboration(mockCollaboration);
      const updated = { ...mockCollaboration, notes: 'Updated notes' };
      repository.update.and.returnValue(of(updated));

      await service.updateCollaboration('collab-1', { notes: 'Updated notes' });

      expect(service.selectedCollaboration()?.notes).toBe('Updated notes');
    });

    it('should handle error when updating fails', async () => {
      const error = new Error('Update failed');
      repository.update.and.returnValue(throwError(() => error));

      try {
        await service.updateCollaboration('collab-1', { notes: 'Updated' });
        fail('should have thrown error');
      } catch (_e) {
        expect(service.error()).toBe('Update failed');
      }
    });
  });

  describe('deleteCollaboration', () => {
    beforeEach(() => {
      service['collaborationsState'].set(mockCollaborations);
    });

    it('should delete collaboration successfully', async () => {
      repository.delete.and.returnValue(of(undefined));

      await service.deleteCollaboration('collab-1');

      expect(service.collaborations().length).toBe(1);
      expect(service.collaborations()[0].id).toBe('collab-2');
    });

    it('should clear selected collaboration if deleted', async () => {
      service.selectCollaboration(mockCollaboration);
      repository.delete.and.returnValue(of(undefined));

      await service.deleteCollaboration('collab-1');

      expect(service.selectedCollaboration()).toBeNull();
    });

    it('should handle error when deleting fails', async () => {
      const error = new Error('Delete failed');
      repository.delete.and.returnValue(throwError(() => error));

      try {
        await service.deleteCollaboration('collab-1');
        fail('should have thrown error');
      } catch (_e) {
        expect(service.error()).toBe('Delete failed');
      }
    });
  });

  describe('selectCollaboration', () => {
    it('should select collaboration', () => {
      service.selectCollaboration(mockCollaboration);

      expect(service.selectedCollaboration()).toEqual(mockCollaboration);
    });

    it('should clear selection when null', () => {
      service.selectCollaboration(mockCollaboration);
      service.selectCollaboration(null);

      expect(service.selectedCollaboration()).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      service['collaborationsState'].set(mockCollaborations);
      service.selectCollaboration(mockCollaboration);
      service['errorState'].set('Some error');

      service.reset();

      expect(service.collaborations().length).toBe(0);
      expect(service.selectedCollaboration()).toBeNull();
      expect(service.error()).toBeNull();
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      service['collaborationsState'].set(mockCollaborations);
    });

    it('should compute activeCollaborations', () => {
      expect(service.activeCollaborations().length).toBe(1);
      expect(service.activeCollaborations()[0].status).toBe(CollaborationStatus.ACTIVE);
    });

    it('should compute pendingCollaborations', () => {
      expect(service.pendingCollaborations().length).toBe(1);
      expect(service.pendingCollaborations()[0].status).toBe(CollaborationStatus.PENDING);
    });

    it('should compute contractorCollaborations', () => {
      expect(service.contractorCollaborations().length).toBe(1);
      expect(service.contractorCollaborations()[0].collaboration_type).toBe(CollaborationType.CONTRACTOR);
    });
  });
});
