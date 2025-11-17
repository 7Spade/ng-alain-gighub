import { TestBed } from '@angular/core/testing';
import { TaskRepository, TaskAssignmentRepository, TaskListRepository } from '@core';
import { Task, TaskStatus } from '@shared';
import { of, throwError } from 'rxjs';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: jasmine.SpyObj<TaskRepository>;
  let taskAssignmentRepository: jasmine.SpyObj<TaskAssignmentRepository>;
  let taskListRepository: jasmine.SpyObj<TaskListRepository>;

  const mockTask: Task = {
    id: 'task-1',
    blueprint_id: 'blueprint-1',
    name: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: 'medium' as any,
    contractor_fields: {
      work_hours: 5,
      progress_percentage: 50,
      schedule: {
        start_date: '2025-01-01',
        end_date: '2025-01-31'
      }
    },
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  } as Task;

  beforeEach(() => {
    const taskRepoSpy = jasmine.createSpyObj('TaskRepository', [
      'findAll',
      'findById',
      'findByBlueprintId',
      'findChildren',
      'create',
      'update',
      'delete'
    ]);

    const taskAssignmentRepoSpy = jasmine.createSpyObj('TaskAssignmentRepository', ['findByTaskId']);

    const taskListRepoSpy = jasmine.createSpyObj('TaskListRepository', ['findAll']);

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useValue: taskRepoSpy },
        { provide: TaskAssignmentRepository, useValue: taskAssignmentRepoSpy },
        { provide: TaskListRepository, useValue: taskListRepoSpy }
      ]
    });

    service = TestBed.inject(TaskService);
    taskRepository = TestBed.inject(TaskRepository) as jasmine.SpyObj<TaskRepository>;
    taskAssignmentRepository = TestBed.inject(TaskAssignmentRepository) as jasmine.SpyObj<TaskAssignmentRepository>;
    taskListRepository = TestBed.inject(TaskListRepository) as jasmine.SpyObj<TaskListRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty tasks', () => {
      expect(service.tasks().length).toBe(0);
    });

    it('should have null selected task', () => {
      expect(service.selectedTask()).toBeNull();
    });

    it('should have empty task tree', () => {
      expect(service.taskTree().length).toBe(0);
    });

    it('should have false loading state', () => {
      expect(service.loading()).toBe(false);
    });

    it('should have null error state', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('updateTaskContractorFields', () => {
    it('should update contractor_fields successfully with simple field', async () => {
      taskRepository.findById.and.returnValue(of(mockTask));
      taskRepository.update.and.returnValue(of({ ...mockTask, contractor_fields: { ...mockTask.contractor_fields, work_hours: 8 } } as Task));

      await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);

      expect(taskRepository.findById).toHaveBeenCalledWith('task-1');
      expect(taskRepository.update).toHaveBeenCalledWith('task-1', jasmine.objectContaining({
        contractor_fields: jasmine.objectContaining({
          work_hours: 8,
          progress_percentage: 50
        })
      }));
    });

    it('should update nested contractor_fields successfully', async () => {
      taskRepository.findById.and.returnValue(of(mockTask));
      taskRepository.update.and.returnValue(of(mockTask));

      await service.updateTaskContractorFields('task-1', 'contractor_fields.schedule.start_date', '2025-02-01');

      expect(taskRepository.update).toHaveBeenCalledWith('task-1', jasmine.objectContaining({
        contractor_fields: jasmine.objectContaining({
          schedule: jasmine.objectContaining({
            start_date: '2025-02-01'
          })
        })
      }));
    });

    it('should throw error if field path does not start with contractor_fields', async () => {
      try {
        await service.updateTaskContractorFields('task-1', 'name', 'New Name');
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toBe('僅允許更新 contractor_fields 欄位');
      }

      expect(taskRepository.findById).not.toHaveBeenCalled();
      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if field path is exactly contractor_fields', async () => {
      try {
        await service.updateTaskContractorFields('task-1', 'contractor_fields', { work_hours: 10 });
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toBe('僅允許更新 contractor_fields 欄位');
      }
    });

    it('should throw error if task does not exist', async () => {
      taskRepository.findById.and.returnValue(of(null as any));

      try {
        await service.updateTaskContractorFields('non-existent-task', 'contractor_fields.work_hours', 8);
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toBe('任務不存在');
      }

      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository findById error', async () => {
      taskRepository.findById.and.returnValue(throwError(() => new Error('Database error')));

      try {
        await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('Database error');
      }

      expect(service.error()).toContain('更新承攬欄位失敗');
    });

    it('should handle repository update error', async () => {
      taskRepository.findById.and.returnValue(of(mockTask));
      taskRepository.update.and.returnValue(throwError(() => new Error('Update failed')));

      try {
        await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);
        fail('Expected error to be thrown');
      } catch (error: any) {
        expect(error.message).toContain('Update failed');
      }

      expect(service.error()).toContain('更新承攬欄位失敗');
    });

    it('should merge with existing contractor_fields without overwriting', async () => {
      const taskWithFields = {
        ...mockTask,
        contractor_fields: {
          work_hours: 5,
          progress_percentage: 50,
          notes: 'Existing notes'
        }
      };

      taskRepository.findById.and.returnValue(of(taskWithFields as Task));
      taskRepository.update.and.returnValue(of(taskWithFields as Task));

      await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);

      expect(taskRepository.update).toHaveBeenCalledWith('task-1', jasmine.objectContaining({
        contractor_fields: jasmine.objectContaining({
          work_hours: 8,
          progress_percentage: 50,
          notes: 'Existing notes'
        })
      }));
    });

    it('should create nested path if it does not exist', async () => {
      const taskWithoutSchedule = {
        ...mockTask,
        contractor_fields: {
          work_hours: 5
        }
      };

      taskRepository.findById.and.returnValue(of(taskWithoutSchedule as Task));
      taskRepository.update.and.returnValue(of(taskWithoutSchedule as Task));

      await service.updateTaskContractorFields('task-1', 'contractor_fields.schedule.start_date', '2025-01-01');

      expect(taskRepository.update).toHaveBeenCalledWith('task-1', jasmine.objectContaining({
        contractor_fields: jasmine.objectContaining({
          work_hours: 5,
          schedule: jasmine.objectContaining({
            start_date: '2025-01-01'
          })
        })
      }));
    });

    it('should set loading state during operation', async () => {
      taskRepository.findById.and.returnValue(of(mockTask));
      taskRepository.update.and.returnValue(of(mockTask));

      const promise = service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);

      // Loading should be true during operation
      expect(service.loading()).toBe(true);

      await promise;

      // Loading should be false after operation
      expect(service.loading()).toBe(false);
    });

    it('should clear error state before operation', async () => {
      // Set an initial error
      taskRepository.findById.and.returnValue(throwError(() => new Error('Initial error')));
      try {
        await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 8);
      } catch {}

      expect(service.error()).toBeTruthy();

      // Now perform successful operation
      taskRepository.findById.and.returnValue(of(mockTask));
      taskRepository.update.and.returnValue(of(mockTask));

      await service.updateTaskContractorFields('task-1', 'contractor_fields.work_hours', 10);

      expect(service.error()).toBeNull();
    });
  });

  describe('Computed signals', () => {
    it('should filter pending tasks correctly', async () => {
      const tasks: Task[] = [
        { ...mockTask, id: 'task-1', status: TaskStatus.PENDING },
        { ...mockTask, id: 'task-2', status: TaskStatus.IN_PROGRESS },
        { ...mockTask, id: 'task-3', status: TaskStatus.PENDING }
      ];

      taskRepository.findByBlueprintId.and.returnValue(of(tasks));
      await service.loadTasksByBlueprint('blueprint-1');

      expect(service.pendingTasks().length).toBe(2);
      expect(service.pendingTasks().every(t => t.status === TaskStatus.PENDING)).toBe(true);
    });

    it('should filter in-progress tasks correctly', async () => {
      const tasks: Task[] = [
        { ...mockTask, id: 'task-1', status: TaskStatus.PENDING },
        { ...mockTask, id: 'task-2', status: TaskStatus.IN_PROGRESS },
        { ...mockTask, id: 'task-3', status: TaskStatus.IN_PROGRESS }
      ];

      taskRepository.findByBlueprintId.and.returnValue(of(tasks));
      await service.loadTasksByBlueprint('blueprint-1');

      expect(service.inProgressTasks().length).toBe(2);
      expect(service.inProgressTasks().every(t => t.status === TaskStatus.IN_PROGRESS)).toBe(true);
    });
  });
});
