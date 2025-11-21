import { TestBed } from '@angular/core/testing';
import { ActivityLogRepository, type ActivityLog } from '@core';
import { of, throwError } from 'rxjs';

import { BlueprintActivityService, type ActivityChange } from './blueprint-activity.service';
import { type Account } from '../../models/account.models';
import { type ActivityLogFilters } from '../../models/data/data.models';
import { AuthStateService } from '../auth';

describe('BlueprintActivityService', () => {
  let service: BlueprintActivityService;
  let activityLogRepository: jasmine.SpyObj<ActivityLogRepository>;
  let authState: jasmine.SpyObj<AuthStateService>;

  const mockUser: Account = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    type: 'User'
  } as Account;

  const mockActivityLog: ActivityLog = {
    id: 'log-123',
    blueprint_id: 'blueprint-123',
    resource_type: 'task',
    resource_id: 'task-456',
    action: 'created',
    actor_id: 'user-123',
    action_details: {
      changes: [],
      context: 'Test context'
    },
    created_at: '2024-01-01T00:00:00Z',
    ip_address: null,
    user_agent: null,
    branch_id: null
  };

  beforeEach(() => {
    const activityLogRepoSpy = jasmine.createSpyObj('ActivityLogRepository', ['create', 'findByBlueprintId']);
    const authStateSpy = jasmine.createSpyObj('AuthStateService', ['user'], {
      user: jasmine.createSpy('user').and.returnValue(mockUser)
    });

    TestBed.configureTestingModule({
      providers: [
        BlueprintActivityService,
        { provide: ActivityLogRepository, useValue: activityLogRepoSpy },
        { provide: AuthStateService, useValue: authStateSpy }
      ]
    });

    service = TestBed.inject(BlueprintActivityService);
    activityLogRepository = TestBed.inject(ActivityLogRepository) as jasmine.SpyObj<ActivityLogRepository>;
    authState = TestBed.inject(AuthStateService) as jasmine.SpyObj<AuthStateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logActivity', () => {
    it('should log activity successfully', async () => {
      const changes: ActivityChange[] = [{ field: 'status', oldValue: 'pending', newValue: 'in_progress' }];

      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logActivity('blueprint-123', 'task', 'task-456', 'updated', changes, { context: 'Test update' });

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          blueprint_id: 'blueprint-123',
          resource_type: 'task',
          resource_id: 'task-456',
          action: 'updated',
          actor_id: 'user-123',
          action_details: jasmine.objectContaining({
            changes: jasmine.arrayContaining([
              jasmine.objectContaining({
                field: 'status',
                oldValue: 'pending',
                newValue: 'in_progress'
              })
            ]),
            context: 'Test update'
          })
        })
      );
    });

    it('should sanitize sensitive fields', async () => {
      const changes: ActivityChange[] = [
        { field: 'password', oldValue: 'old-password', newValue: 'new-password' },
        { field: 'normalField', oldValue: 'old', newValue: 'new' }
      ];

      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logActivity('blueprint-123', 'user', 'user-456', 'updated', changes);

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          action_details: jasmine.objectContaining({
            changes: jasmine.arrayContaining([
              { field: 'password', oldValue: '***REDACTED***', newValue: '***REDACTED***' },
              { field: 'normalField', oldValue: 'old', newValue: 'new' }
            ])
          })
        })
      );
    });

    it('should not throw error when user is not authenticated', async () => {
      (authState.user as any).and.returnValue(null);

      await expectAsync(service.logActivity('blueprint-123', 'task', 'task-456', 'updated', [])).toBeResolved();

      expect(activityLogRepository.create).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      activityLogRepository.create.and.returnValue(throwError(() => new Error('Database error')));
      spyOn(console, 'error');

      await expectAsync(service.logActivity('blueprint-123', 'task', 'task-456', 'updated', [])).toBeResolved();

      expect(console.error).toHaveBeenCalled();
      expect(service.error()).toBe('Database error');
    });
  });

  describe('logTaskChange', () => {
    it('should log task creation', async () => {
      const task = {
        id: 'task-456',
        blueprint_id: 'blueprint-123',
        name: 'New Task'
      };

      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logTaskChange(task, 'created');

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          resource_type: 'task',
          resource_id: 'task-456',
          action: 'created',
          action_details: jasmine.objectContaining({
            context: 'Task created: New Task'
          })
        })
      );
    });

    it('should compute changes when old task is provided', async () => {
      const oldTask = {
        id: 'task-456',
        blueprint_id: 'blueprint-123',
        name: 'Old Name',
        status: 'pending'
      };

      const newTask = {
        id: 'task-456',
        blueprint_id: 'blueprint-123',
        name: 'New Name',
        status: 'in_progress'
      };

      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logTaskChange(newTask, 'updated', oldTask);

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          action_details: jasmine.objectContaining({
            changes: jasmine.arrayContaining([jasmine.objectContaining({ field: 'name' }), jasmine.objectContaining({ field: 'status' })])
          })
        })
      );
    });
  });

  describe('logPRMerge', () => {
    it('should log PR merge', async () => {
      const pr = {
        id: 'pr-789',
        targetBranchId: 'blueprint-123',
        title: 'Feature PR',
        changes: [{ field: 'contractor_fields.work_hours', oldValue: 8, newValue: 10 }]
      };

      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logPRMerge(pr, 'user-456');

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          blueprint_id: 'blueprint-123',
          resource_type: 'pull_request',
          resource_id: 'pr-789',
          action: 'merged',
          action_details: jasmine.objectContaining({
            context: 'PR merged: Feature PR',
            mergedBy: 'user-456'
          })
        })
      );
    });
  });

  describe('logContractorFieldsUpdate', () => {
    it('should log contractor fields update', async () => {
      activityLogRepository.create.and.returnValue(of(mockActivityLog));

      await service.logContractorFieldsUpdate('task-456', 'blueprint-123', 'contractor_fields.work_hours', 8, 10);

      expect(activityLogRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          blueprint_id: 'blueprint-123',
          resource_type: 'task',
          resource_id: 'task-456',
          action: 'contractor_fields_updated',
          action_details: jasmine.objectContaining({
            changes: [{ field: 'contractor_fields.work_hours', oldValue: 8, newValue: 10 }],
            context: 'Contractor fields updated via PR merge'
          })
        })
      );
    });
  });

  describe('getActivityLogs', () => {
    it('should fetch and return activity logs', async () => {
      const mockLogs: ActivityLog[] = [mockActivityLog];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      const result = await service.getActivityLogs('blueprint-123');

      expect(result).toEqual(mockLogs);
      expect(service.logs()).toEqual(mockLogs);
      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    it('should filter by resource type', async () => {
      const mockLogs: ActivityLog[] = [
        { ...mockActivityLog, resource_type: 'task' },
        { ...mockActivityLog, id: 'log-456', resource_type: 'issue' }
      ];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      const filters: ActivityLogFilters = { resource_type: 'task' };
      const result = await service.getActivityLogs('blueprint-123', filters);

      expect(result.length).toBe(1);
      expect(result[0].resourceType).toBe('task');
    });

    it('should filter by resource id', async () => {
      const mockLogs: ActivityLog[] = [
        { ...mockActivityLog, resource_id: 'task-456' },
        { ...mockActivityLog, id: 'log-456', resource_id: 'task-789' }
      ];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      const filters: ActivityLogFilters = { resource_id: 'task-456' };
      const result = await service.getActivityLogs('blueprint-123', filters);

      expect(result.length).toBe(1);
      expect(result[0].resourceId).toBe('task-456');
    });

    it('should filter by actor id', async () => {
      const mockLogs: ActivityLog[] = [
        { ...mockActivityLog, actor_id: 'user-123' },
        { ...mockActivityLog, id: 'log-456', actor_id: 'user-456' }
      ];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      const filters: ActivityLogFilters = { actor_id: 'user-123' };
      const result = await service.getActivityLogs('blueprint-123', filters);

      expect(result.length).toBe(1);
      expect(result[0].actorId).toBe('user-123');
    });

    it('should filter by date range', async () => {
      const mockLogs: ActivityLog[] = [
        { ...mockActivityLog, created_at: '2024-01-15T00:00:00Z' },
        { ...mockActivityLog, id: 'log-456', created_at: '2024-02-15T00:00:00Z' }
      ];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      const filters: ActivityLogFilters = {
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z'
      };
      const result = await service.getActivityLogs('blueprint-123', filters);

      expect(result.length).toBe(1);
      expect(result[0].createdAt).toBe('2024-01-15T00:00:00Z');
    });

    it('should handle errors', async () => {
      activityLogRepository.findByBlueprintId.and.returnValue(throwError(() => new Error('Fetch error')));

      await expectAsync(service.getActivityLogs('blueprint-123')).toBeRejectedWithError('Fetch error');

      expect(service.error()).toBe('Fetch error');
      expect(service.loading()).toBe(false);
    });
  });

  describe('getResourceActivityLogs', () => {
    it('should call getActivityLogs with correct filters', async () => {
      spyOn(service, 'getActivityLogs').and.returnValue(Promise.resolve([]));

      await service.getResourceActivityLogs('blueprint-123', 'task', 'task-456');

      expect(service.getActivityLogs).toHaveBeenCalledWith('blueprint-123', {
        resource_type: 'task',
        resource_id: 'task-456'
      });
    });
  });

  describe('computed signals', () => {
    it('should compute recent logs', async () => {
      const mockLogs: ActivityLog[] = Array.from({ length: 15 }, (_, i) => ({
        ...mockActivityLog,
        id: `log-${i}`
      }));
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      await service.getActivityLogs('blueprint-123');

      expect(service.recentLogs().length).toBe(10);
    });
  });

  describe('clear', () => {
    it('should clear all state', async () => {
      const mockLogs: ActivityLog[] = [mockActivityLog];
      activityLogRepository.findByBlueprintId.and.returnValue(of(mockLogs));

      await service.getActivityLogs('blueprint-123');
      expect(service.logs().length).toBeGreaterThan(0);

      service.clear();

      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
      expect(service.logs()).toEqual([]);
    });
  });

  describe('private methods', () => {
    it('should correctly compute changes between objects', () => {
      const oldObj = {
        name: 'Old Name',
        status: 'pending',
        priority: 'low',
        updatedAt: '2024-01-01'
      };

      const newObj = {
        name: 'New Name',
        status: 'in_progress',
        priority: 'low',
        updatedAt: '2024-01-02'
      };

      // Access private method via type assertion for testing
      const changes = (service as any).computeChanges(oldObj, newObj);

      expect(changes.length).toBe(2); // name and status changed, updatedAt is skipped
      expect(changes).toContain(jasmine.objectContaining({ field: 'name' }));
      expect(changes).toContain(jasmine.objectContaining({ field: 'status' }));
      expect(changes).not.toContain(jasmine.objectContaining({ field: 'updatedAt' }));
    });

    it('should sanitize multiple sensitive fields', () => {
      const changes: ActivityChange[] = [
        { field: 'password', oldValue: 'secret', newValue: 'newsecret' },
        { field: 'apiKey', oldValue: 'key123', newValue: 'key456' },
        { field: 'normalField', oldValue: 'old', newValue: 'new' }
      ];

      const sanitized = (service as any).sanitizeChanges(changes);

      expect(sanitized[0].oldValue).toBe('***REDACTED***');
      expect(sanitized[0].newValue).toBe('***REDACTED***');
      expect(sanitized[1].oldValue).toBe('***REDACTED***');
      expect(sanitized[1].newValue).toBe('***REDACTED***');
      expect(sanitized[2].oldValue).toBe('old');
      expect(sanitized[2].newValue).toBe('new');
    });
  });
});
