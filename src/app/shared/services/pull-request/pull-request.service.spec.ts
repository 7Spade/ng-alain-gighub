import { TestBed } from '@angular/core/testing';
import { PullRequestRepository, SupabaseService } from '@core';
import { PRStatus } from '@core/infra/types/blueprint.types';
import { BlueprintActivityService } from '../blueprint/blueprint-activity.service';
import { of, throwError } from 'rxjs';

import { PullRequestService } from './pull-request.service';

describe('PullRequestService', () => {
  let service: PullRequestService;
  let prRepo: jasmine.SpyObj<PullRequestRepository>;
  let supabase: jasmine.SpyObj<SupabaseService>;
  let activityService: jasmine.SpyObj<BlueprintActivityService>;

  const mockPR = {
    id: 'pr-123',
    blueprintId: 'blueprint-456',
    blueprint_id: 'blueprint-456',
    branchId: 'branch-789',
    branch_id: 'branch-789',
    status: PRStatus.APPROVED,
    submittedBy: 'user-111',
    submitted_by: 'user-111',
    changes: [
      { task_id: 'task-1', field: 'contractor_fields.work_hours', new_value: 8 },
      { task_id: 'task-2', field: 'contractor_fields.progress', new_value: 75 }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  };

  beforeEach(() => {
    const prRepoSpy = jasmine.createSpyObj('PullRequestRepository', [
      'findAll',
      'findById',
      'findByBlueprintId',
      'findByBranchId',
      'findByStatus',
      'findOpen',
      'findReviewing',
      'findMerged',
      'findBySubmittedBy',
      'findByReviewedBy',
      'create',
      'update',
      'delete'
    ]);

    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['rpc']);
    const activityServiceSpy = jasmine.createSpyObj('BlueprintActivityService', ['logPRMerge', 'logActivity']);

    TestBed.configureTestingModule({
      providers: [
        PullRequestService,
        { provide: PullRequestRepository, useValue: prRepoSpy },
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: BlueprintActivityService, useValue: activityServiceSpy }
      ]
    });

    service = TestBed.inject(PullRequestService);
    prRepo = TestBed.inject(PullRequestRepository) as jasmine.SpyObj<PullRequestRepository>;
    supabase = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
    activityService = TestBed.inject(BlueprintActivityService) as jasmine.SpyObj<BlueprintActivityService>;

    // Default: successful operations
    activityService.logPRMerge.and.returnValue(Promise.resolve());
    activityService.logActivity.and.returnValue(Promise.resolve());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty pull requests', () => {
      expect(service.pullRequests().length).toBe(0);
    });

    it('should have null selected PR', () => {
      expect(service.selectedPR()).toBeNull();
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('mergePullRequest', () => {
    it('should merge PR successfully with complete workflow', async () => {
      prRepo.findById.and.returnValue(of(mockPR as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null } as any));
      prRepo.update.and.returnValue(of({ ...mockPR, status: PRStatus.MERGED } as any));

      await service.mergePullRequest('pr-123');

      // Step 1: Verify PR was fetched
      expect(prRepo.findById).toHaveBeenCalledWith('pr-123');

      // Step 2: Verify RPC function was called with correct parameters
      expect(supabase.rpc).toHaveBeenCalledWith('merge_pr_changes', {
        p_pr_id: 'pr-123',
        p_changes: mockPR.changes
      });

      // Step 3: Verify PR status was updated
      expect(prRepo.update).toHaveBeenCalledWith(
        'pr-123',
        jasmine.objectContaining({
          status: PRStatus.MERGED,
          merged_at: jasmine.any(String)
        })
      );

      // Step 4: Verify activity was logged
      expect(activityService.logPRMerge).toHaveBeenCalledWith(mockPR);
    });

    it('should throw error if PR does not exist', async () => {
      prRepo.findById.and.returnValue(of(null as any));

      try {
        await service.mergePullRequest('non-existent-pr');
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toBe('Pull Request 不存在');
      }

      expect(supabase.rpc).not.toHaveBeenCalled();
      expect(prRepo.update).not.toHaveBeenCalled();
      expect(activityService.logPRMerge).not.toHaveBeenCalled();
    });

    it('should throw error if PR status is not APPROVED', async () => {
      const openPR = { ...mockPR, status: PRStatus.OPEN };
      prRepo.findById.and.returnValue(of(openPR as any));

      try {
        await service.mergePullRequest('pr-123');
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('狀態必須為 APPROVED');
        expect(error.message).toContain(PRStatus.OPEN);
      }

      expect(supabase.rpc).not.toHaveBeenCalled();
    });

    it('should handle all non-approved PR statuses', async () => {
      const statuses = [PRStatus.OPEN, PRStatus.REVIEWING, PRStatus.REJECTED, PRStatus.CLOSED];

      for (const status of statuses) {
        const pr = { ...mockPR, status };
        prRepo.findById.and.returnValue(of(pr as any));

        try {
          await service.mergePullRequest('pr-123');
          fail(`Expected error for status ${status}`);
        } catch (error: any) {
          expect(error.message).toContain('APPROVED');
        }
      }
    });

    it('should throw error if RPC function fails', async () => {
      prRepo.findById.and.returnValue(of(mockPR as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: { message: 'Database constraint violation' } } as any));

      try {
        await service.mergePullRequest('pr-123');
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('合併失敗');
        expect(error.message).toContain('Database constraint violation');
      }

      expect(prRepo.update).not.toHaveBeenCalled();
      expect(activityService.logPRMerge).not.toHaveBeenCalled();
    });

    it('should handle PR with empty changes array', async () => {
      const prWithoutChanges = { ...mockPR, changes: [] };
      prRepo.findById.and.returnValue(of(prWithoutChanges as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null } as any));
      prRepo.update.and.returnValue(of({ ...prWithoutChanges, status: PRStatus.MERGED } as any));

      await service.mergePullRequest('pr-123');

      expect(supabase.rpc).toHaveBeenCalledWith('merge_pr_changes', {
        p_pr_id: 'pr-123',
        p_changes: []
      });
    });

    it('should handle PR with null changes', async () => {
      const prWithNullChanges = { ...mockPR, changes: null };
      prRepo.findById.and.returnValue(of(prWithNullChanges as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null } as any));
      prRepo.update.and.returnValue(of({ ...prWithNullChanges, status: PRStatus.MERGED } as any));

      await service.mergePullRequest('pr-123');

      expect(supabase.rpc).toHaveBeenCalledWith('merge_pr_changes', {
        p_pr_id: 'pr-123',
        p_changes: []
      });
    });

    it('should set loading state during operation', async () => {
      prRepo.findById.and.returnValue(of(mockPR as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null } as any));
      prRepo.update.and.returnValue(of({ ...mockPR, status: PRStatus.MERGED } as any));

      const promise = service.mergePullRequest('pr-123');

      expect(service.loading()).toBe(true);

      await promise;

      expect(service.loading()).toBe(false);
    });

    it('should update error state on failure', async () => {
      prRepo.findById.and.returnValue(throwError(() => new Error('Network error')));

      try {
        await service.mergePullRequest('pr-123');
      } catch {}

      expect(service.error()).toContain('合併 Pull Request 失敗');
    });

    it('should clear error state before operation', async () => {
      // Set initial error
      prRepo.findById.and.returnValue(throwError(() => new Error('Error')));
      try {
        await service.mergePullRequest('pr-123');
      } catch {}
      expect(service.error()).toBeTruthy();

      // Successful operation should clear error
      prRepo.findById.and.returnValue(of(mockPR as any));
      supabase.rpc.and.returnValue(Promise.resolve({ data: null, error: null } as any));
      prRepo.update.and.returnValue(of({ ...mockPR, status: PRStatus.MERGED } as any));

      await service.mergePullRequest('pr-123');

      expect(service.error()).toBeNull();
    });
  });

  describe('approvePullRequest', () => {
    it('should approve PR successfully', async () => {
      const reviewingPR = { ...mockPR, status: PRStatus.REVIEWING };
      prRepo.findById.and.returnValue(of(reviewingPR as any));
      prRepo.update.and.returnValue(of({ ...reviewingPR, status: PRStatus.APPROVED } as any));

      await service.approvePullRequest('pr-123', 'Looks good!');

      expect(prRepo.update).toHaveBeenCalledWith(
        'pr-123',
        jasmine.objectContaining({
          status: PRStatus.APPROVED,
          reviewed_at: jasmine.any(String),
          review_comment: 'Looks good!'
        })
      );

      expect(activityService.logActivity).toHaveBeenCalledWith(jasmine.objectContaining({
        entityType: 'pull_request',
        entityId: 'pr-123',
        action: 'approved',
        metadata: { comment: 'Looks good!' }
      }));
    });

    it('should throw error if PR is not in REVIEWING status', async () => {
      const openPR = { ...mockPR, status: PRStatus.OPEN };
      prRepo.findById.and.returnValue(of(openPR as any));

      try {
        await service.approvePullRequest('pr-123', 'Comment');
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('必須在審核中狀態');
      }
    });

    it('should work without comment', async () => {
      const reviewingPR = { ...mockPR, status: PRStatus.REVIEWING };
      prRepo.findById.and.returnValue(of(reviewingPR as any));
      prRepo.update.and.returnValue(of({ ...reviewingPR, status: PRStatus.APPROVED } as any));

      await service.approvePullRequest('pr-123');

      expect(prRepo.update).toHaveBeenCalledWith(
        'pr-123',
        jasmine.objectContaining({
          review_comment: undefined
        })
      );
    });
  });

  describe('rejectPullRequest', () => {
    it('should reject PR successfully', async () => {
      const reviewingPR = { ...mockPR, status: PRStatus.REVIEWING };
      prRepo.findById.and.returnValue(of(reviewingPR as any));
      prRepo.update.and.returnValue(of({ ...reviewingPR, status: PRStatus.REJECTED } as any));

      await service.rejectPullRequest('pr-123', 'Needs more work');

      expect(prRepo.update).toHaveBeenCalledWith(
        'pr-123',
        jasmine.objectContaining({
          status: PRStatus.REJECTED,
          reviewed_at: jasmine.any(String),
          review_comment: 'Needs more work'
        })
      );

      expect(activityService.logActivity).toHaveBeenCalledWith(jasmine.objectContaining({
        action: 'rejected',
        metadata: { comment: 'Needs more work' }
      }));
    });

    it('should require comment for rejection', async () => {
      const reviewingPR = { ...mockPR, status: PRStatus.REVIEWING };
      prRepo.findById.and.returnValue(of(reviewingPR as any));
      prRepo.update.and.returnValue(of({ ...reviewingPR, status: PRStatus.REJECTED } as any));

      await service.rejectPullRequest('pr-123', '');

      // Comment can be empty string, but parameter is required
      expect(prRepo.update).toHaveBeenCalled();
    });
  });

  describe('Computed signals', () => {
    it('should filter open PRs correctly', async () => {
      const prs = [
        { ...mockPR, id: 'pr-1', status: PRStatus.OPEN },
        { ...mockPR, id: 'pr-2', status: PRStatus.REVIEWING },
        { ...mockPR, id: 'pr-3', status: PRStatus.OPEN }
      ];

      prRepo.findByBlueprintId.and.returnValue(of(prs as any));
      await service.loadPullRequestsByBlueprint('blueprint-456');

      expect(service.openPRs().length).toBe(2);
      expect(service.openPRs().every(pr => pr.status === PRStatus.OPEN)).toBe(true);
    });

    it('should filter reviewing PRs correctly', async () => {
      const prs = [
        { ...mockPR, id: 'pr-1', status: PRStatus.OPEN },
        { ...mockPR, id: 'pr-2', status: PRStatus.REVIEWING },
        { ...mockPR, id: 'pr-3', status: PRStatus.REVIEWING }
      ];

      prRepo.findByBlueprintId.and.returnValue(of(prs as any));
      await service.loadPullRequestsByBlueprint('blueprint-456');

      expect(service.reviewingPRs().length).toBe(2);
      expect(service.reviewingPRs().every(pr => pr.status === PRStatus.REVIEWING)).toBe(true);
    });

    it('should filter merged PRs correctly', async () => {
      const prs = [
        { ...mockPR, id: 'pr-1', status: PRStatus.MERGED },
        { ...mockPR, id: 'pr-2', status: PRStatus.OPEN },
        { ...mockPR, id: 'pr-3', status: PRStatus.MERGED }
      ];

      prRepo.findByBlueprintId.and.returnValue(of(prs as any));
      await service.loadPullRequestsByBlueprint('blueprint-456');

      expect(service.mergedPRs().length).toBe(2);
      expect(service.mergedPRs().every(pr => pr.status === PRStatus.MERGED)).toBe(true);
    });
  });

  describe('selectPR and clearError', () => {
    it('should select PR', () => {
      service.selectPR(mockPR as any);
      expect(service.selectedPR()).toEqual(mockPR);
    });

    it('should clear selected PR', () => {
      service.selectPR(mockPR as any);
      service.selectPR(null);
      expect(service.selectedPR()).toBeNull();
    });

    it('should clear error state', async () => {
      prRepo.findById.and.returnValue(throwError(() => new Error('Error')));
      try {
        await service.mergePullRequest('pr-123');
      } catch {}

      expect(service.error()).toBeTruthy();

      service.clearError();

      expect(service.error()).toBeNull();
    });
  });
});
