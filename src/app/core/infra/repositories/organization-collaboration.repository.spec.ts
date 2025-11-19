import { TestBed } from '@angular/core/testing';
import { OrganizationCollaboration } from '@shared';

import { OrganizationCollaborationRepository } from './organization-collaboration.repository';
import { SupabaseService } from '../../supabase/supabase.service';
import { CollaborationStatus, CollaborationType } from '../types/org';

describe('OrganizationCollaborationRepository', () => {
  let repository: OrganizationCollaborationRepository;
  let supabaseService: jasmine.SpyObj<SupabaseService>;
  let mockSupabaseClient: any;

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

  beforeEach(() => {
    // 创建 Mock Supabase Client
    mockSupabaseClient = {
      from: jasmine.createSpy('from').and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            order: jasmine.createSpy('order').and.returnValue({
              range: jasmine.createSpy('range').and.returnValue(Promise.resolve({ data: [mockCollaboration], error: null }))
            })
          })
        })
      })
    };

    const supabaseServiceSpy = jasmine.createSpyObj('SupabaseService', [], {
      client: mockSupabaseClient
    });

    TestBed.configureTestingModule({
      providers: [OrganizationCollaborationRepository, { provide: SupabaseService, useValue: supabaseServiceSpy }]
    });

    repository = TestBed.inject(OrganizationCollaborationRepository);
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('findByBlueprintId', () => {
    it('should find collaborations by blueprint id', done => {
      repository.findByBlueprintId('blueprint-1').subscribe({
        next: collaborations => {
          expect(collaborations.length).toBeGreaterThan(0);
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByOwnerOrgId', () => {
    it('should find collaborations by owner org id', done => {
      repository.findByOwnerOrgId('org-1').subscribe({
        next: collaborations => {
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByCollaboratorOrgId', () => {
    it('should find collaborations by collaborator org id', done => {
      repository.findByCollaboratorOrgId('org-2').subscribe({
        next: collaborations => {
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByCollaborationType', () => {
    it('should find collaborations by type', done => {
      repository.findByCollaborationType(CollaborationType.CONTRACTOR).subscribe({
        next: collaborations => {
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
          done();
        },
        error: done.fail
      });
    });
  });

  describe('findByStatus', () => {
    it('should find collaborations by status', done => {
      repository.findByStatus(CollaborationStatus.ACTIVE).subscribe({
        next: collaborations => {
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('organization_collaborations');
          done();
        },
        error: done.fail
      });
    });
  });
});
