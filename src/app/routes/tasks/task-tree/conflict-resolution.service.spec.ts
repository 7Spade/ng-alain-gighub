import { TestBed } from '@angular/core/testing';
import { ConflictResolutionService } from './conflict-resolution.service';
import { ConflictResolutionStrategy, VersionedTask } from './conflict-resolution.types';

describe('ConflictResolutionService', () => {
  let service: ConflictResolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConflictResolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Conflict Detection', () => {
    it('should detect conflict when versions differ', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      
      expect(conflict.hasConflict).toBe(true);
      expect(conflict.conflictingFields).toContain('title');
    });

    it('should not detect conflict when versions match', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Same Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Same Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      
      expect(conflict.hasConflict).toBe(false);
      expect(conflict.conflictingFields.length).toBe(0);
    });

    it('should detect multiple conflicting fields', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        description: 'Local Description',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        description: 'Remote Description',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      
      expect(conflict.hasConflict).toBe(true);
      expect(conflict.conflictingFields).toContain('title');
      expect(conflict.conflictingFields).toContain('description');
    });
  });

  describe('Last-Write-Wins Strategy', () => {
    it('should choose remote when remote timestamp is newer', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'last-write-wins');
      
      expect(resolution.resolved.title).toBe('Remote Title');
      expect(resolution.strategy).toBe('last-write-wins');
    });

    it('should choose local when local timestamp is newer', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'last-write-wins');
      
      expect(resolution.resolved.title).toBe('Local Title');
    });

    it('should handle equal timestamps by choosing remote', () => {
      const timestamp = '2025-01-01T10:00:00Z';
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: timestamp
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 1,
        updated_at: timestamp
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'last-write-wins');
      
      // Should default to remote on tie
      expect(resolution.resolved.title).toBe('Remote Title');
    });
  });

  describe('Merge Strategy', () => {
    it('should merge non-conflicting fields', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        description: 'Same Description',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        description: 'Same Description',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'merge');
      
      // For conflicting title, should use remote (newer)
      expect(resolution.resolved.title).toBe('Remote Title');
      // For non-conflicting description, should keep same
      expect(resolution.resolved.description).toBe('Same Description');
    });

    it('should prefer newer value for conflicting fields', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        status: 'in_progress',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        status: 'completed',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'merge');
      
      // Both fields conflict, should use remote (newer)
      expect(resolution.resolved.title).toBe('Remote Title');
      expect(resolution.resolved.status).toBe('completed');
    });
  });

  describe('Manual Resolution Strategy', () => {
    it('should mark resolution as requiring manual intervention', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'manual');
      
      expect(resolution.strategy).toBe('manual');
      expect(resolution.requiresManualIntervention).toBe(true);
      // Should temporarily use local version
      expect(resolution.resolved.title).toBe('Local Title');
    });

    it('should emit notification for manual resolution', () => {
      spyOn(service.conflictNotifications, 'set');

      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      service.resolveConflict(local, remote, conflict, 'manual');
      
      expect(service.conflictNotifications.set).toHaveBeenCalled();
    });
  });

  describe('Reject Strategy', () => {
    it('should keep local version and reject remote changes', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'reject');
      
      expect(resolution.resolved.title).toBe('Local Title');
      expect(resolution.strategy).toBe('reject');
    });

    it('should preserve all local fields when rejecting remote', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: 'Local Title',
        description: 'Local Description',
        status: 'in_progress',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        description: 'Remote Description',
        status: 'completed',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'reject');
      
      expect(resolution.resolved.title).toBe('Local Title');
      expect(resolution.resolved.description).toBe('Local Description');
      expect(resolution.resolved.status).toBe('in_progress');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing version fields', () => {
      const local: any = {
        id: 'task-1',
        title: 'Local Title',
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: any = {
        id: 'task-1',
        title: 'Remote Title',
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      
      // Should still detect conflict based on timestamps
      expect(conflict.hasConflict).toBe(true);
    });

    it('should handle null and undefined values', () => {
      const local: VersionedTask = {
        id: 'task-1',
        title: null as any,
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const remote: VersionedTask = {
        id: 'task-1',
        title: 'Remote Title',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const conflict = service.detectConflict(local, remote);
      const resolution = service.resolveConflict(local, remote, conflict, 'last-write-wins');
      
      expect(resolution.resolved.title).toBe('Remote Title');
    });
  });
});
