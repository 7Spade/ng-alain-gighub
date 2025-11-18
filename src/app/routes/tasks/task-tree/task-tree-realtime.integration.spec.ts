import { TestBed } from '@angular/core/testing';
import { TaskTreeFacade } from './task-tree.facade';
import { SupabaseService } from '@core';
import { ConflictResolutionService } from './conflict-resolution.service';

describe('TaskTree Realtime Integration', () => {
  let facade: TaskTreeFacade;
  let supabaseMock: jasmine.SpyObj<SupabaseService>;
  let conflictResolutionMock: jasmine.SpyObj<ConflictResolutionService>;
  let mockChannel: any;

  beforeEach(() => {
    // Create mock channel
    mockChannel = {
      on: jasmine.createSpy('on').and.returnValue({
        subscribe: jasmine.createSpy('subscribe').and.returnValue(Promise.resolve())
      }),
      unsubscribe: jasmine.createSpy('unsubscribe'),
      send: jasmine.createSpy('send')
    };

    // Create Supabase mock
    supabaseMock = jasmine.createSpyObj('SupabaseService', [], {
      client: {
        channel: jasmine.createSpy('channel').and.returnValue(mockChannel),
        removeChannel: jasmine.createSpy('removeChannel')
      }
    });

    // Create conflict resolution mock
    conflictResolutionMock = jasmine.createSpyObj('ConflictResolutionService', [
      'detectConflict',
      'resolveConflict'
    ]);

    TestBed.configureTestingModule({
      providers: [
        TaskTreeFacade,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: ConflictResolutionService, useValue: conflictResolutionMock }
      ]
    });

    facade = TestBed.inject(TaskTreeFacade);
  });

  describe('Subscription Lifecycle', () => {
    it('should subscribe to Realtime on loadTasks', async () => {
      await facade.loadTasks('blueprint-123');

      expect(supabaseMock.client.channel).toHaveBeenCalledWith(
        jasmine.stringContaining('tasks:blueprint_id=eq.blueprint-123')
      );
      expect(mockChannel.on).toHaveBeenCalled();
    });

    it('should unsubscribe on component destroy', async () => {
      await facade.loadTasks('blueprint-123');

      facade.ngOnDestroy();

      expect(mockChannel.unsubscribe).toHaveBeenCalled();
    });

    it('should update connection status on subscription', async () => {
      await facade.loadTasks('blueprint-123');

      // Verify initial status
      expect(facade.connectionStatus()).toBeTruthy();
    });
  });

  describe('INSERT Event Handling', () => {
    it('should add new task to state on INSERT event', async () => {
      await facade.loadTasks('blueprint-123');

      const newTask = {
        id: 'new-task-1',
        title: 'New Task',
        blueprint_id: 'blueprint-123',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      // Simulate INSERT event
      const insertCallback = mockChannel.on.calls.first().args[2];
      insertCallback({
        eventType: 'INSERT',
        new: newTask,
        old: null
      });

      // Verify task was added
      const tasks = facade.tasks();
      expect(tasks.some(t => t.id === 'new-task-1')).toBe(true);
    });

    it('should prevent duplicate tasks on multiple INSERT events', async () => {
      await facade.loadTasks('blueprint-123');

      const newTask = {
        id: 'new-task-1',
        title: 'New Task',
        blueprint_id: 'blueprint-123',
        version: 1,
        updated_at: '2025-01-01T10:00:00Z'
      };

      const insertCallback = mockChannel.on.calls.first().args[2];
      
      // Simulate INSERT twice
      insertCallback({ eventType: 'INSERT', new: newTask, old: null });
      insertCallback({ eventType: 'INSERT', new: newTask, old: null });

      const tasks = facade.tasks();
      const count = tasks.filter(t => t.id === 'new-task-1').length;
      expect(count).toBe(1);
    });
  });

  describe('UPDATE Event Handling', () => {
    it('should update existing task on UPDATE event', async () => {
      // Set initial tasks
      facade.tasks.set([
        {
          id: 'task-1',
          title: 'Old Title',
          blueprint_id: 'blueprint-123',
          version: 1,
          updated_at: '2025-01-01T09:00:00Z'
        }
      ]);

      await facade.loadTasks('blueprint-123');

      const updatedTask = {
        id: 'task-1',
        title: 'Updated Title',
        blueprint_id: 'blueprint-123',
        version: 2,
        updated_at: '2025-01-01T10:00:00Z'
      };

      // Simulate UPDATE event
      const updateCallback = mockChannel.on.calls.first().args[2];
      updateCallback({
        eventType: 'UPDATE',
        new: updatedTask,
        old: { id: 'task-1' }
      });

      const tasks = facade.tasks();
      const task = tasks.find(t => t.id === 'task-1');
      expect(task?.title).toBe('Updated Title');
    });

    it('should handle conflict resolution on UPDATE with version conflict', async () => {
      // Mock conflict detection
      conflictResolutionMock.detectConflict.and.returnValue({
        hasConflict: true,
        conflictingFields: ['title'],
        localVersion: 2,
        remoteVersion: 2
      });

      conflictResolutionMock.resolveConflict.and.returnValue({
        resolved: {
          id: 'task-1',
          title: 'Resolved Title',
          version: 3
        },
        strategy: 'last-write-wins',
        requiresManualIntervention: false
      });

      facade.tasks.set([
        {
          id: 'task-1',
          title: 'Local Title',
          blueprint_id: 'blueprint-123',
          version: 2,
          updated_at: '2025-01-01T10:00:00Z'
        }
      ]);

      await facade.loadTasks('blueprint-123');

      const remoteTask = {
        id: 'task-1',
        title: 'Remote Title',
        blueprint_id: 'blueprint-123',
        version: 2,
        updated_at: '2025-01-01T10:01:00Z'
      };

      const updateCallback = mockChannel.on.calls.first().args[2];
      updateCallback({
        eventType: 'UPDATE',
        new: remoteTask,
        old: { id: 'task-1' }
      });

      expect(conflictResolutionMock.detectConflict).toHaveBeenCalled();
      expect(conflictResolutionMock.resolveConflict).toHaveBeenCalled();
    });
  });

  describe('DELETE Event Handling', () => {
    it('should remove task from state on DELETE event', async () => {
      facade.tasks.set([
        {
          id: 'task-1',
          title: 'Task to Delete',
          blueprint_id: 'blueprint-123',
          version: 1,
          updated_at: '2025-01-01T10:00:00Z'
        }
      ]);

      await facade.loadTasks('blueprint-123');

      // Simulate DELETE event
      const deleteCallback = mockChannel.on.calls.first().args[2];
      deleteCallback({
        eventType: 'DELETE',
        old: { id: 'task-1' },
        new: null
      });

      const tasks = facade.tasks();
      expect(tasks.some(t => t.id === 'task-1')).toBe(false);
    });

    it('should handle DELETE for non-existent task gracefully', async () => {
      await facade.loadTasks('blueprint-123');

      const deleteCallback = mockChannel.on.calls.first().args[2];
      
      // Should not throw error
      expect(() => {
        deleteCallback({
          eventType: 'DELETE',
          old: { id: 'non-existent-task' },
          new: null
        });
      }).not.toThrow();
    });
  });

  describe('Concurrent Updates', () => {
    it('should handle multiple rapid UPDATE events', async () => {
      facade.tasks.set([
        {
          id: 'task-1',
          title: 'Original Title',
          blueprint_id: 'blueprint-123',
          version: 1,
          updated_at: '2025-01-01T09:00:00Z'
        }
      ]);

      await facade.loadTasks('blueprint-123');

      const updateCallback = mockChannel.on.calls.first().args[2];

      // Simulate rapid updates
      const updates = [
        { id: 'task-1', title: 'Update 1', version: 2, updated_at: '2025-01-01T10:00:00Z' },
        { id: 'task-1', title: 'Update 2', version: 3, updated_at: '2025-01-01T10:01:00Z' },
        { id: 'task-1', title: 'Update 3', version: 4, updated_at: '2025-01-01T10:02:00Z' }
      ];

      updates.forEach(update => {
        updateCallback({
          eventType: 'UPDATE',
          new: { ...update, blueprint_id: 'blueprint-123' },
          old: { id: 'task-1' }
        });
      });

      const tasks = facade.tasks();
      const task = tasks.find(t => t.id === 'task-1');
      
      // Should have the latest update
      expect(task?.version).toBe(4);
      expect(task?.title).toBe('Update 3');
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should clean up subscriptions on destroy', async () => {
      await facade.loadTasks('blueprint-123');

      const channelsBefore = facade['realtimeChannel'];
      expect(channelsBefore).toBeTruthy();

      facade.ngOnDestroy();

      expect(mockChannel.unsubscribe).toHaveBeenCalled();
      expect(supabaseMock.client.removeChannel).toHaveBeenCalled();
    });

    it('should not process events after unsubscribe', async () => {
      await facade.loadTasks('blueprint-123');

      const updateCallback = mockChannel.on.calls.first().args[2];
      
      facade.ngOnDestroy();

      // Attempt to process event after destroy
      const tasksBefore = facade.tasks().length;
      
      updateCallback({
        eventType: 'INSERT',
        new: {
          id: 'new-task-after-destroy',
          title: 'Should Not Be Added',
          blueprint_id: 'blueprint-123'
        },
        old: null
      });

      // Should not add task after destroy
      const tasksAfter = facade.tasks().length;
      expect(tasksAfter).toBe(tasksBefore);
    });
  });
});
