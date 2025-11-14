import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CollaborationInvitationRepository, InvitationStatus } from '@core';
import { InvitationService } from './invitation.service';
import { CollaborationInvitation } from '@shared';

describe('InvitationService', () => {
  let service: InvitationService;
  let repository: jasmine.SpyObj<CollaborationInvitationRepository>;

  const mockInvitation: CollaborationInvitation = {
    id: 'inv-1',
    blueprint_id: 'blueprint-1',
    from_org_id: 'org-1',
    to_org_id: 'org-2',
    invitation_message: 'Test invitation',
    status: InvitationStatus.PENDING,
    expires_at: '2025-12-31T23:59:59Z',
    responded_at: null,
    created_at: '2025-01-01T00:00:00Z'
  } as CollaborationInvitation;

  const mockInvitations: CollaborationInvitation[] = [
    mockInvitation,
    {
      ...mockInvitation,
      id: 'inv-2',
      status: InvitationStatus.ACCEPTED,
      responded_at: '2025-01-02T00:00:00Z'
    },
    {
      ...mockInvitation,
      id: 'inv-3',
      status: InvitationStatus.EXPIRED,
      expires_at: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('CollaborationInvitationRepository', [
      'findAll',
      'findById',
      'findByBlueprintId',
      'findByFromOrgId',
      'findByToOrgId',
      'findByStatus',
      'findPending',
      'findExpired',
      'create',
      'update',
      'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        InvitationService,
        { provide: CollaborationInvitationRepository, useValue: repositorySpy }
      ]
    });

    service = TestBed.inject(InvitationService);
    repository = TestBed.inject(
      CollaborationInvitationRepository
    ) as jasmine.SpyObj<CollaborationInvitationRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty invitations', () => {
      expect(service.invitations().length).toBe(0);
    });

    it('should have null selected invitation', () => {
      expect(service.selectedInvitation()).toBeNull();
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('loadInvitations', () => {
    it('should load invitations successfully', async () => {
      repository.findAll.and.returnValue(of(mockInvitations));

      await service.loadInvitations();

      expect(service.invitations().length).toBe(3);
      expect(service.invitations()[0].id).toBe('inv-1');
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should handle error when loading fails', async () => {
      const error = new Error('Load failed');
      repository.findAll.and.returnValue(throwError(() => error));

      try {
        await service.loadInvitations();
        fail('should have thrown error');
      } catch (e) {
        expect(service.error()).toBe('Load failed');
        expect(service.loading()).toBe(false);
      }
    });
  });

  describe('loadInvitationById', () => {
    it('should load invitation by id successfully', async () => {
      repository.findById.and.returnValue(of(mockInvitation));

      const result = await service.loadInvitationById('inv-1');

      expect(result).toEqual(mockInvitation);
      expect(service.selectedInvitation()).toEqual(mockInvitation);
    });

    it('should return null when invitation not found', async () => {
      repository.findById.and.returnValue(of(null));

      const result = await service.loadInvitationById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('loadInvitationsByBlueprintId', () => {
    it('should load invitations by blueprint id', async () => {
      repository.findByBlueprintId.and.returnValue(of(mockInvitations));

      const result = await service.loadInvitationsByBlueprintId('blueprint-1');

      expect(result.length).toBe(3);
      expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
    });
  });

  describe('loadInvitationsByFromOrgId', () => {
    it('should load invitations by from org id', async () => {
      repository.findByFromOrgId.and.returnValue(of(mockInvitations));

      const result = await service.loadInvitationsByFromOrgId('org-1');

      expect(result.length).toBe(3);
      expect(repository.findByFromOrgId).toHaveBeenCalledWith('org-1');
    });
  });

  describe('loadInvitationsByToOrgId', () => {
    it('should load invitations by to org id', async () => {
      repository.findByToOrgId.and.returnValue(of(mockInvitations));

      const result = await service.loadInvitationsByToOrgId('org-2');

      expect(result.length).toBe(3);
      expect(repository.findByToOrgId).toHaveBeenCalledWith('org-2');
    });
  });

  describe('loadInvitationsByStatus', () => {
    it('should load invitations by status', async () => {
      repository.findByStatus.and.returnValue(of([mockInvitation]));

      const result = await service.loadInvitationsByStatus(InvitationStatus.PENDING);

      expect(result.length).toBe(1);
      expect(repository.findByStatus).toHaveBeenCalledWith(InvitationStatus.PENDING);
    });
  });

  describe('loadPendingInvitations', () => {
    it('should load pending invitations', async () => {
      repository.findPending.and.returnValue(of([mockInvitation]));

      const result = await service.loadPendingInvitations();

      expect(result.length).toBe(1);
      expect(repository.findPending).toHaveBeenCalled();
    });
  });

  describe('loadExpiredInvitations', () => {
    it('should load expired invitations', async () => {
      repository.findExpired.and.returnValue(of([mockInvitations[2]]));

      const result = await service.loadExpiredInvitations();

      expect(result.length).toBe(1);
      expect(repository.findExpired).toHaveBeenCalled();
    });
  });

  describe('createInvitation', () => {
    it('should create invitation successfully', async () => {
      const newInvitation = { ...mockInvitation, id: 'inv-new' };
      repository.create.and.returnValue(of(newInvitation));

      const result = await service.createInvitation({
        blueprint_id: 'blueprint-1',
        from_org_id: 'org-1',
        to_org_id: 'org-2',
        expires_at: '2025-12-31T23:59:59Z'
      });

      expect(result).toEqual(newInvitation);
      expect(service.invitations().length).toBe(1);
    });
  });

  describe('updateInvitation', () => {
    beforeEach(() => {
      service['invitationsState'].set(mockInvitations);
    });

    it('should update invitation successfully', async () => {
      const updated = { ...mockInvitation, invitation_message: 'Updated message' };
      repository.update.and.returnValue(of(updated));

      const result = await service.updateInvitation('inv-1', {
        invitation_message: 'Updated message'
      });

      expect(result).toEqual(updated);
      expect(service.invitations()[0].invitation_message).toBe('Updated message');
    });
  });

  describe('acceptInvitation', () => {
    beforeEach(() => {
      service['invitationsState'].set([mockInvitation]);
    });

    it('should accept invitation successfully', async () => {
      const accepted = {
        ...mockInvitation,
        status: InvitationStatus.ACCEPTED,
        responded_at: new Date().toISOString()
      };
      repository.update.and.returnValue(of(accepted));

      const result = await service.acceptInvitation('inv-1');

      expect(result.status).toBe(InvitationStatus.ACCEPTED);
      expect(result.responded_at).toBeTruthy();
      expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
    });
  });

  describe('rejectInvitation', () => {
    beforeEach(() => {
      service['invitationsState'].set([mockInvitation]);
    });

    it('should reject invitation successfully', async () => {
      const rejected = {
        ...mockInvitation,
        status: InvitationStatus.REJECTED,
        responded_at: new Date().toISOString()
      };
      repository.update.and.returnValue(of(rejected));

      const result = await service.rejectInvitation('inv-1');

      expect(result.status).toBe(InvitationStatus.REJECTED);
      expect(result.responded_at).toBeTruthy();
      expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
    });
  });

  describe('deleteInvitation', () => {
    beforeEach(() => {
      service['invitationsState'].set(mockInvitations);
    });

    it('should delete invitation successfully', async () => {
      repository.delete.and.returnValue(of(undefined));

      await service.deleteInvitation('inv-1');

      expect(service.invitations().length).toBe(2);
      expect(service.invitations()[0].id).toBe('inv-2');
    });

    it('should clear selected invitation if deleted', async () => {
      service.selectInvitation(mockInvitation);
      repository.delete.and.returnValue(of(undefined));

      await service.deleteInvitation('inv-1');

      expect(service.selectedInvitation()).toBeNull();
    });
  });

  describe('selectInvitation', () => {
    it('should select invitation', () => {
      service.selectInvitation(mockInvitation);

      expect(service.selectedInvitation()).toEqual(mockInvitation);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      service['invitationsState'].set(mockInvitations);
      service.selectInvitation(mockInvitation);
      service['errorState'].set('Some error');

      service.reset();

      expect(service.invitations().length).toBe(0);
      expect(service.selectedInvitation()).toBeNull();
      expect(service.error()).toBeNull();
    });
  });

  describe('Computed signals', () => {
    beforeEach(() => {
      service['invitationsState'].set(mockInvitations);
    });

    it('should compute pendingInvitations', () => {
      expect(service.pendingInvitations().length).toBe(1);
      expect(service.pendingInvitations()[0].status).toBe(InvitationStatus.PENDING);
    });

    it('should compute acceptedInvitations', () => {
      expect(service.acceptedInvitations().length).toBe(1);
      expect(service.acceptedInvitations()[0].status).toBe(InvitationStatus.ACCEPTED);
    });

    it('should compute expiredInvitations', () => {
      expect(service.expiredInvitations().length).toBe(1);
      expect(service.expiredInvitations()[0].id).toBe('inv-3');
    });
  });
});

