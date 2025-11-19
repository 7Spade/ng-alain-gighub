import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  TaskService,
  BlueprintService,
  TaskStagingService,
  AuthStateService,
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
  Blueprint,
  TaskStaging,
  Account
} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockBlueprintService: jasmine.SpyObj<BlueprintService>;
  let mockTaskStagingService: jasmine.SpyObj<TaskStagingService>;
  let mockAuthState: jasmine.SpyObj<AuthStateService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessage: jasmine.SpyObj<NzMessageService>;

  // Mock data
  const mockBlueprint: Blueprint = {
    id: 'blueprint-1',
    name: 'Test Blueprint',
    description: 'Test Description',
    owner_id: 'owner-1',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  } as Blueprint;

  const mockTask: Task = {
    id: 'task-1',
    blueprint_id: 'blueprint-1',
    title: 'Test Task',
    task_type: 'task' as TaskType,
    status: 'pending' as TaskStatus,
    priority: 'medium' as TaskPriority,
    progress_percentage: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  } as Task;

  const mockStagingTask: Task = {
    ...mockTask,
    id: 'task-2',
    status: 'staging' as TaskStatus
  };

  const mockTaskStaging: TaskStaging = {
    id: 'staging-1',
    task_id: 'task-2',
    submitted_by: 'user-1',
    staging_data: {},
    can_withdraw: true,
    expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    submitted_at: new Date().toISOString()
  } as TaskStaging;

  const mockAccount: Account = {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser'
  } as Account;

  beforeEach(async () => {
    // Create spies with signal support
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'loadTasksByBlueprint',
      'deleteTask',
      'updateTaskStatus',
      'getAllowedNextStatuses',
      'getRecommendedNextStatus'
    ]);
    taskServiceSpy.tasks = signal([mockTask]);
    taskServiceSpy.loading = signal(false);
    taskServiceSpy.stagingTasks = signal([]);

    const blueprintServiceSpy = jasmine.createSpyObj('BlueprintService', ['loadBlueprints']);
    blueprintServiceSpy.blueprints = signal([mockBlueprint]);

    const taskStagingServiceSpy = jasmine.createSpyObj('TaskStagingService', [
      'loadStagingByTaskId',
      'canWithdraw',
      'withdrawStaging',
      'confirmStaging'
    ]);
    taskStagingServiceSpy.stagingItems = signal([]);

    const authStateSpy = jasmine.createSpyObj('AuthStateService', []);
    authStateSpy.user = signal(mockAccount);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: BlueprintService, useValue: blueprintServiceSpy },
        { provide: TaskStagingService, useValue: taskStagingServiceSpy },
        { provide: AuthStateService, useValue: authStateSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NzMessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    mockTaskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    mockBlueprintService = TestBed.inject(BlueprintService) as jasmine.SpyObj<BlueprintService>;
    mockTaskStagingService = TestBed.inject(TaskStagingService) as jasmine.SpyObj<TaskStagingService>;
    mockAuthState = TestBed.inject(AuthStateService) as jasmine.SpyObj<AuthStateService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessage = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnPush Change Detection', () => {
    it('should use OnPush strategy', () => {
      const metadata = (component.constructor as any).ɵcmp;
      expect(metadata.changeDetection).toBe(1); // OnPush = 1
    });
  });

  describe('Initialization', () => {
    it('should load blueprints on init', async () => {
      mockBlueprintService.loadBlueprints.and.returnValue(Promise.resolve());

      await component.ngOnInit();

      expect(mockBlueprintService.loadBlueprints).toHaveBeenCalled();
    });

    it('should show error message if blueprint loading fails', async () => {
      mockBlueprintService.loadBlueprints.and.returnValue(Promise.reject(new Error('Load failed')));

      await component.ngOnInit();

      expect(mockMessage.error).toHaveBeenCalledWith('加载蓝图列表失败');
    });
  });

  describe('Blueprint Selection', () => {
    it('should load tasks when blueprint is selected', async () => {
      mockTaskService.loadTasksByBlueprint.and.returnValue(Promise.resolve());
      mockTaskService.stagingTasks = signal([]);

      component.selectedBlueprintId.set('blueprint-1');
      await component.onBlueprintChange();

      expect(mockTaskService.loadTasksByBlueprint).toHaveBeenCalledWith('blueprint-1');
    });

    it('should load staging info and allowed statuses after blueprint change', async () => {
      mockTaskService.loadTasksByBlueprint.and.returnValue(Promise.resolve());
      mockTaskService.stagingTasks = signal([]);
      mockTaskService.tasks = signal([mockTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.resolve([TaskStatus.ASSIGNED]));

      component.selectedBlueprintId.set('blueprint-1');
      await component.onBlueprintChange();

      expect(mockTaskService.getAllowedNextStatuses).toHaveBeenCalledWith('task-1');
    });

    it('should show error message if task loading fails', async () => {
      mockTaskService.loadTasksByBlueprint.and.returnValue(Promise.reject(new Error('Load failed')));

      component.selectedBlueprintId.set('blueprint-1');
      await component.onBlueprintChange();

      expect(mockMessage.error).toHaveBeenCalledWith('加载任务列表失败');
    });
  });

  describe('Staging Information', () => {
    it('should load staging info for staging tasks', async () => {
      mockTaskService.stagingTasks = signal([mockStagingTask]);
      mockTaskStagingService.loadStagingByTaskId.and.returnValue(Promise.resolve());
      mockTaskStagingService.stagingItems = signal([mockTaskStaging]);
      mockTaskStagingService.canWithdraw.and.returnValue(Promise.resolve(true));

      await component.loadStagingInfo();

      expect(mockTaskStagingService.loadStagingByTaskId).toHaveBeenCalledWith('task-2');
      expect(mockTaskStagingService.canWithdraw).toHaveBeenCalledWith('staging-1');

      const info = component.stagingInfo();
      expect(info['task-2']).toBeDefined();
      expect(info['task-2'].canWithdraw).toBe(true);
      expect(info['task-2'].stagingId).toBe('staging-1');
    });

    it('should calculate remaining hours correctly', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
      const staging = { ...mockTaskStaging, expires_at: futureDate.toISOString() };

      mockTaskService.stagingTasks = signal([mockStagingTask]);
      mockTaskStagingService.loadStagingByTaskId.and.returnValue(Promise.resolve());
      mockTaskStagingService.stagingItems = signal([staging]);
      mockTaskStagingService.canWithdraw.and.returnValue(Promise.resolve(true));

      await component.loadStagingInfo();

      const info = component.stagingInfo();
      expect(info['task-2'].remainingHours).toBeGreaterThanOrEqual(23);
      expect(info['task-2'].remainingHours).toBeLessThanOrEqual(24);
    });
  });

  describe('Allowed Statuses', () => {
    it('should load allowed next statuses for all tasks', async () => {
      mockTaskService.tasks = signal([mockTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.resolve([TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS]));

      await component.loadAllowedStatuses();

      expect(mockTaskService.getAllowedNextStatuses).toHaveBeenCalledWith('task-1');

      const allowed = component.allowedStatuses();
      expect(allowed['task-1']).toEqual([TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS]);
    });

    it('should handle errors gracefully when loading allowed statuses', async () => {
      mockTaskService.tasks = signal([mockTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.reject(new Error('Failed')));

      await component.loadAllowedStatuses();

      const allowed = component.allowedStatuses();
      expect(allowed['task-1']).toEqual([]);
    });
  });

  describe('Status Transitions', () => {
    it('should change task status successfully', async () => {
      const updatedTask = { ...mockTask, status: 'assigned' as TaskStatus };
      mockTaskService.updateTaskStatus.and.returnValue(Promise.resolve(updatedTask));
      mockTaskService.stagingTasks = signal([]);
      mockTaskService.tasks = signal([updatedTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.resolve([]));

      await component.changeTaskStatus('task-1', TaskStatus.ASSIGNED);

      expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith('task-1', TaskStatus.ASSIGNED);
      expect(mockMessage.success).toHaveBeenCalledWith('状态更新成功');
    });

    it('should show error message if status change fails', async () => {
      mockTaskService.updateTaskStatus.and.returnValue(Promise.reject(new Error('Invalid transition')));

      await component.changeTaskStatus('task-1', TaskStatus.COMPLETED);

      expect(mockMessage.error).toHaveBeenCalledWith('Invalid transition');
    });

    it('should reload staging info after status change', async () => {
      mockTaskService.updateTaskStatus.and.returnValue(Promise.resolve(mockTask));
      mockTaskService.stagingTasks = signal([]);
      mockTaskService.tasks = signal([mockTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.resolve([]));

      spyOn(component, 'loadStagingInfo').and.returnValue(Promise.resolve());
      spyOn(component, 'loadAllowedStatuses').and.returnValue(Promise.resolve());

      await component.changeTaskStatus('task-1', TaskStatus.ASSIGNED);

      expect(component.loadStagingInfo).toHaveBeenCalled();
      expect(component.loadAllowedStatuses).toHaveBeenCalled();
    });
  });

  describe('Staging Withdrawal', () => {
    beforeEach(() => {
      component.stagingInfo.set({
        'task-2': {
          remainingHours: 24,
          canWithdraw: true,
          stagingId: 'staging-1'
        }
      });
    });

    it('should withdraw staging successfully', async () => {
      mockTaskStagingService.withdrawStaging.and.returnValue(Promise.resolve(mockTaskStaging));
      mockTaskService.loadTasksByBlueprint.and.returnValue(Promise.resolve());
      mockTaskService.stagingTasks = signal([]);
      mockTaskService.tasks = signal([mockTask]);
      mockTaskService.getAllowedNextStatuses.and.returnValue(Promise.resolve([]));

      component.selectedBlueprintId.set('blueprint-1');

      await component.withdrawStaging('task-2');

      expect(mockTaskStagingService.withdrawStaging).toHaveBeenCalledWith('staging-1', 'user-1');
      expect(mockMessage.success).toHaveBeenCalledWith('撤回成功');
    });

    it('should show error if staging info not found', async () => {
      await component.withdrawStaging('task-999');

      expect(mockMessage.error).toHaveBeenCalledWith('找不到暂存信息');
      expect(mockTaskStagingService.withdrawStaging).not.toHaveBeenCalled();
    });

    it('should show error if user is not logged in', async () => {
      mockAuthState.user = signal(null);

      await component.withdrawStaging('task-2');

      expect(mockMessage.error).toHaveBeenCalledWith('未登录用户无法执行此操作');
      expect(mockTaskStagingService.withdrawStaging).not.toHaveBeenCalled();
    });

    it('should show error message if withdrawal fails', async () => {
      mockTaskStagingService.withdrawStaging.and.returnValue(Promise.reject(new Error('Withdrawal failed')));

      await component.withdrawStaging('task-2');

      expect(mockMessage.error).toHaveBeenCalledWith('Withdrawal failed');
    });
  });

  describe('Filters', () => {
    beforeEach(() => {
      const tasks: Task[] = [
        { ...mockTask, id: '1', status: 'pending' as TaskStatus, priority: 'low' as TaskPriority, task_type: 'task' as TaskType },
        { ...mockTask, id: '2', status: 'in_progress' as TaskStatus, priority: 'high' as TaskPriority, task_type: 'milestone' as TaskType },
        { ...mockTask, id: '3', status: 'staging' as TaskStatus, priority: 'urgent' as TaskPriority, task_type: 'phase' as TaskType },
        { ...mockTask, id: '4', status: 'completed' as TaskStatus, priority: 'medium' as TaskPriority, task_type: 'subtask' as TaskType }
      ];
      mockTaskService.tasks = signal(tasks);
    });

    it('should filter tasks by status', () => {
      component.filterStatus.set(TaskStatus.PENDING);

      const filtered = component.filteredTasks();

      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('pending');
    });

    it('should filter tasks by priority', () => {
      component.filterPriority.set(TaskPriority.HIGH);

      const filtered = component.filteredTasks();

      expect(filtered.length).toBe(1);
      expect(filtered[0].priority).toBe('high');
    });

    it('should filter tasks by type', () => {
      component.filterType.set(TaskType.MILESTONE);

      const filtered = component.filteredTasks();

      expect(filtered.length).toBe(1);
      expect(filtered[0].task_type).toBe('milestone');
    });

    it('should apply multiple filters simultaneously', () => {
      component.filterStatus.set(TaskStatus.STAGING);
      component.filterPriority.set(TaskPriority.URGENT);
      component.filterType.set(TaskType.PHASE);

      const filtered = component.filteredTasks();

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('3');
    });

    it('should return all tasks when no filters are set', () => {
      const filtered = component.filteredTasks();

      expect(filtered.length).toBe(4);
    });
  });

  describe('Status Labels', () => {
    it('should return correct Chinese labels for all statuses', () => {
      expect(component.getStatusLabel(TaskStatus.PENDING)).toBe('待处理');
      expect(component.getStatusLabel(TaskStatus.ASSIGNED)).toBe('已指派');
      expect(component.getStatusLabel(TaskStatus.IN_PROGRESS)).toBe('进行中');
      expect(component.getStatusLabel(TaskStatus.STAGING)).toBe('暂存中');
      expect(component.getStatusLabel(TaskStatus.IN_QA)).toBe('品管中');
      expect(component.getStatusLabel(TaskStatus.IN_INSPECTION)).toBe('验收中');
      expect(component.getStatusLabel(TaskStatus.COMPLETED)).toBe('已完成');
      expect(component.getStatusLabel(TaskStatus.CANCELLED)).toBe('已取消');
    });
  });

  describe('Navigation', () => {
    it('should navigate to task detail on viewDetail', () => {
      component.viewDetail('task-1');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks', 'task-1']);
    });

    it('should navigate to task edit on edit', () => {
      component.edit('task-1');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks', 'task-1', 'edit']);
    });

    it('should navigate to task create on createTask', () => {
      component.createTask();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/create']);
    });
  });

  describe('Task Deletion', () => {
    it('should delete task successfully', async () => {
      mockTaskService.deleteTask.and.returnValue(Promise.resolve());

      await component.delete('task-1');

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith('task-1');
      expect(mockMessage.success).toHaveBeenCalledWith('删除成功');
    });

    it('should show error message if deletion fails', async () => {
      mockTaskService.deleteTask.and.returnValue(Promise.reject(new Error('Delete failed')));

      await component.delete('task-1');

      expect(mockMessage.error).toHaveBeenCalledWith('删除失败');
    });
  });
});
