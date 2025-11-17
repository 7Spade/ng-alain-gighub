import { TestBed } from '@angular/core/testing';
import { ActivityLogRepository } from '@core';
import { AuthStateService } from '../auth/auth.state';
import { of, throwError } from 'rxjs';

import { BlueprintActivityService } from './blueprint-activity.service';

describe('BlueprintActivityService', () => {
  let service: BlueprintActivityService;
  let activityRepo: jasmine.SpyObj<ActivityLogRepository>;
  let authState: jasmine.SpyObj<AuthStateService>;

  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockPR = {
    id: 'pr-123',
    blueprintId: 'blueprint-123',
    blueprint_id: 'blueprint-123',
    branchId: 'branch-456',
    branch_id: 'branch-456',
    submittedBy: 'user-789',
    submitted_by: 'user-789',
    changes: [
      { task_id: 'task-1', field: 'contractor_fields.work_hours', new_value: 8 },
      { task_id: 'task-2', field: 'contractor_fields.progress', new_value: 75 }
    ]
  };

  beforeEach(() => {
    const activityRepoSpy = jasmine.createSpyObj('ActivityLogRepository', ['create']);
    const authStateSpy = jasmine.createSpyObj('AuthStateService', ['user']);

    TestBed.configureTestingModule({
      providers: [
        BlueprintActivityService,
        { provide: ActivityLogRepository, useValue: activityRepoSpy },
        { provide: AuthStateService, useValue: authStateSpy }
      ]
    });

    service = TestBed.inject(BlueprintActivityService);
    activityRepo = TestBed.inject(ActivityLogRepository) as jasmine.SpyObj<ActivityLogRepository>;
    authState = TestBed.inject(AuthStateService) as jasmine.SpyObj<AuthStateService>;

    // Default: user is logged in
    authState.user.and.returnValue(mockUser as any);
    activityRepo.create.and.returnValue(of({} as any));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logActivity', () => {
    it('should log activity with correct parameters', async () => {
      await service.logActivity({
        blueprintId: 'blueprint-123',
        entityType: 'task',
        entityId: 'task-456',
        action: 'updated',
        metadata: { field: 'name', value: 'New Name' }
      });

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'task',
        entity_id: 'task-456',
        action: 'updated',
        actor_id: 'user-123',
        metadata: { field: 'name', value: 'New Name' }
      }));
    });

    it('should capture current user as actor_id', async () => {
      await service.logActivity({
        blueprintId: 'blueprint-123',
        entityType: 'blueprint',
        entityId: 'blueprint-123',
        action: 'created'
      });

      expect(authState.user).toHaveBeenCalled();
      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        actor_id: 'user-123'
      }));
    });

    it('should include created_at timestamp', async () => {
      const beforeTime = new Date().toISOString();

      await service.logActivity({
        blueprintId: 'blueprint-123',
        entityType: 'task',
        entityId: 'task-456',
        action: 'created'
      });

      const afterTime = new Date().toISOString();
      const callArgs: any = activityRepo.create.calls.mostRecent().args[0];

      expect(callArgs.created_at).toBeDefined();
      expect(callArgs.created_at >= beforeTime).toBe(true);
      expect(callArgs.created_at <= afterTime).toBe(true);
    });

    it('should work without metadata', async () => {
      await service.logActivity({
        blueprintId: 'blueprint-123',
        entityType: 'task',
        entityId: 'task-456',
        action: 'deleted'
      });

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'task',
        entity_id: 'task-456',
        action: 'deleted',
        metadata: undefined
      }));
    });
  });

  describe('logPRMerge', () => {
    it('should log PR merge with changes count', async () => {
      await service.logPRMerge(mockPR);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'pull_request',
        entity_id: 'pr-123',
        action: 'merged',
        metadata: jasmine.objectContaining({
          changes_count: 2,
          branch_id: 'branch-456',
          submitted_by: 'user-789'
        })
      }));
    });

    it('should handle PR with no changes', async () => {
      const prWithoutChanges = { ...mockPR, changes: [] };

      await service.logPRMerge(prWithoutChanges);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        metadata: jasmine.objectContaining({
          changes_count: 0
        })
      }));
    });

    it('should handle PR with null changes', async () => {
      const prWithNullChanges = { ...mockPR, changes: null };

      await service.logPRMerge(prWithNullChanges);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        metadata: jasmine.objectContaining({
          changes_count: 0
        })
      }));
    });

    it('should work with snake_case or camelCase PR properties', async () => {
      const prSnakeCase = {
        id: 'pr-123',
        blueprint_id: 'blueprint-123',
        branch_id: 'branch-456',
        submitted_by: 'user-789',
        changes: []
      };

      await service.logPRMerge(prSnakeCase);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123'
      }));
    });
  });

  describe('logTaskUpdate', () => {
    it('should log task update with field and value', async () => {
      await service.logTaskUpdate('task-123', 'status', 'completed', 'blueprint-456');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-456',
        entity_type: 'task',
        entity_id: 'task-123',
        action: 'updated',
        metadata: {
          field: 'status',
          new_value: 'completed'
        }
      }));
    });
  });

  describe('logBranchCreate', () => {
    it('should log branch creation with organization_id', async () => {
      await service.logBranchCreate('branch-789', 'blueprint-123', 'org-456');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'blueprint_branch',
        entity_id: 'branch-789',
        action: 'created',
        metadata: {
          organization_id: 'org-456'
        }
      }));
    });
  });

  describe('logBranchFork', () => {
    it('should log branch fork with source and target branch ids', async () => {
      await service.logBranchFork('fork-111', 'blueprint-123', 'source-branch-222', 'target-branch-333');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'branch_fork',
        entity_id: 'fork-111',
        action: 'forked',
        metadata: {
          source_branch_id: 'source-branch-222',
          target_branch_id: 'target-branch-333'
        }
      }));
    });
  });

  describe('logBlueprintCreate', () => {
    it('should log blueprint creation with name', async () => {
      await service.logBlueprintCreate('blueprint-123', 'New Construction Project');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'blueprint',
        entity_id: 'blueprint-123',
        action: 'created',
        metadata: {
          name: 'New Construction Project'
        }
      }));
    });
  });

  describe('logBlueprintUpdate', () => {
    it('should log blueprint update with changes', async () => {
      const changes = {
        name: 'Updated Name',
        description: 'Updated Description',
        status: 'active'
      };

      await service.logBlueprintUpdate('blueprint-123', changes);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'blueprint',
        entity_id: 'blueprint-123',
        action: 'updated',
        metadata: { changes }
      }));
    });
  });

  describe('logBlueprintDelete', () => {
    it('should log blueprint deletion', async () => {
      await service.logBlueprintDelete('blueprint-123');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'blueprint',
        entity_id: 'blueprint-123',
        action: 'deleted',
        metadata: {}
      }));
    });
  });

  describe('logTaskCreate', () => {
    it('should log task creation with name', async () => {
      await service.logTaskCreate('task-456', 'blueprint-123', 'Foundation Work');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'task',
        entity_id: 'task-456',
        action: 'created',
        metadata: {
          name: 'Foundation Work'
        }
      }));
    });
  });

  describe('logTaskDelete', () => {
    it('should log task deletion', async () => {
      await service.logTaskDelete('task-456', 'blueprint-123');

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'task',
        entity_id: 'task-456',
        action: 'deleted',
        metadata: {}
      }));
    });
  });

  describe('logContractorFieldUpdate', () => {
    it('should log contractor field update for Git-like model', async () => {
      await service.logContractorFieldUpdate('task-456', 'blueprint-123', 'contractor_fields.work_hours', 8);

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        blueprint_id: 'blueprint-123',
        entity_type: 'task',
        entity_id: 'task-456',
        action: 'contractor_field_updated',
        metadata: {
          field: 'contractor_fields.work_hours',
          new_value: 8
        }
      }));
    });
  });

  describe('Error handling', () => {
    it('should propagate repository errors', async () => {
      activityRepo.create.and.returnValue(throwError(() => new Error('Database error')));

      try {
        await service.logActivity({
          blueprintId: 'blueprint-123',
          entityType: 'task',
          entityId: 'task-456',
          action: 'updated'
        });
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('Database error');
      }
    });

    it('should handle null user gracefully', async () => {
      authState.user.and.returnValue(null as any);

      await service.logActivity({
        blueprintId: 'blueprint-123',
        entityType: 'task',
        entityId: 'task-456',
        action: 'updated'
      });

      expect(activityRepo.create).toHaveBeenCalledWith(jasmine.objectContaining({
        actor_id: undefined
      }));
    });
  });
});
