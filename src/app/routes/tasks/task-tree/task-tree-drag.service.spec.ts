import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { TaskTreeNode } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TaskTreeDragService } from './task-tree-drag.service';
import { TaskTreeFacade } from './task-tree.facade';

describe('TaskTreeDragService', () => {
  let service: TaskTreeDragService;
  let facadeSpy: jasmine.SpyObj<TaskTreeFacade>;
  let messageSpy: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    const facade = jasmine.createSpyObj('TaskTreeFacade', ['updateTaskHierarchyOptimistic']);
    const message = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [TaskTreeDragService, { provide: TaskTreeFacade, useValue: facade }, { provide: NzMessageService, useValue: message }]
    });

    service = TestBed.inject(TaskTreeDragService);
    facadeSpy = TestBed.inject(TaskTreeFacade) as jasmine.SpyObj<TaskTreeFacade>;
    messageSpy = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleDrop', () => {
    let mockTaskNodes: TaskTreeNode[];
    let mockEvent: CdkDragDrop<TaskTreeNode[]>;

    beforeEach(() => {
      mockTaskNodes = [
        {
          id: 'task-1',
          title: 'Task 1',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-2',
          title: 'Task 2',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 1,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      mockEvent = {
        previousIndex: 0,
        currentIndex: 1,
        item: {
          data: mockTaskNodes[0]
        } as any,
        container: {
          data: mockTaskNodes
        } as any,
        previousContainer: {} as any
      } as CdkDragDrop<TaskTreeNode[]>;
    });

    it('should handle drop in same position (no-op)', async () => {
      mockEvent.previousIndex = 0;
      mockEvent.currentIndex = 0;
      mockEvent.previousContainer = mockEvent.container;

      await service.handleDrop(mockEvent, mockTaskNodes);

      expect(facadeSpy.updateTaskHierarchyOptimistic).not.toHaveBeenCalled();
    });

    it('should update task hierarchy when dropped in new position', async () => {
      facadeSpy.updateTaskHierarchyOptimistic.and.returnValue(Promise.resolve());

      await service.handleDrop(mockEvent, mockTaskNodes);

      expect(facadeSpy.updateTaskHierarchyOptimistic).toHaveBeenCalledWith('task-1', null, jasmine.any(Number));
      expect(messageSpy.success).toHaveBeenCalledWith('任務位置已更新');
    });

    it('should show error message when circular dependency detected', async () => {
      // Create parent-child relationship
      const parentTask: TaskTreeNode = mockTaskNodes[0];
      const childTask: TaskTreeNode = {
        ...mockTaskNodes[1],
        parent_task_id: 'task-1' // child of task-1
      };

      // Try to make parent a child of child (circular)
      mockEvent.item.data = parentTask;
      const containerTasks = [parentTask, childTask];

      // Mock the calculation to return child as new parent
      await service.handleDrop(mockEvent, containerTasks);

      // Should not update if circular dependency
      // Note: The actual detection logic is in the service
      expect(messageSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should show error message on update failure', async () => {
      facadeSpy.updateTaskHierarchyOptimistic.and.returnValue(Promise.reject(new Error('Update failed')));

      await service.handleDrop(mockEvent, mockTaskNodes);

      expect(messageSpy.error).toHaveBeenCalledWith('更新失敗，請重試');
    });
  });

  describe('canDropOn', () => {
    it('should return false for self-drop', () => {
      const tasks: TaskTreeNode[] = [
        {
          id: 'task-1',
          title: 'Task 1',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      const result = service.canDropOn('task-1', 'task-1', tasks);

      expect(result).toBe(false);
    });

    it('should return false when dropping parent on its descendant', () => {
      const tasks: TaskTreeNode[] = [
        {
          id: 'task-1',
          title: 'Parent',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-2',
          title: 'Child',
          blueprint_id: 'bp-1',
          parent_task_id: 'task-1',
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-3',
          title: 'Grandchild',
          blueprint_id: 'bp-1',
          parent_task_id: 'task-2',
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      // Try to make task-1 (parent) a child of task-3 (grandchild)
      const result = service.canDropOn('task-1', 'task-3', tasks);

      expect(result).toBe(false);
    });

    it('should return true for valid drop (no circular dependency)', () => {
      const tasks: TaskTreeNode[] = [
        {
          id: 'task-1',
          title: 'Task 1',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-2',
          title: 'Task 2',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 1,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      // Both are root tasks, no circular dependency possible
      const result = service.canDropOn('task-1', 'task-2', tasks);

      expect(result).toBe(true);
    });

    it('should detect multi-level circular dependencies', () => {
      const tasks: TaskTreeNode[] = [
        {
          id: 'task-1',
          title: 'Level 1',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-2',
          title: 'Level 2',
          blueprint_id: 'bp-1',
          parent_task_id: 'task-1',
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-3',
          title: 'Level 3',
          blueprint_id: 'bp-1',
          parent_task_id: 'task-2',
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode,
        {
          id: 'task-4',
          title: 'Level 4',
          blueprint_id: 'bp-1',
          parent_task_id: 'task-3',
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      // Try to make task-1 (great-grandparent) a child of task-4 (great-grandchild)
      const result = service.canDropOn('task-1', 'task-4', tasks);

      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty task list', async () => {
      const mockEvent = {
        previousIndex: 0,
        currentIndex: 0,
        item: {
          data: {
            id: 'task-1',
            title: 'Task 1',
            blueprint_id: 'bp-1'
          } as TaskTreeNode
        } as any,
        container: { data: [] } as any,
        previousContainer: {} as any
      } as CdkDragDrop<TaskTreeNode[]>;

      await service.handleDrop(mockEvent, []);

      // Should not crash or throw error
      expect(facadeSpy.updateTaskHierarchyOptimistic).not.toHaveBeenCalled();
    });

    it('should handle task with no parent_task_id (root task)', () => {
      const tasks: TaskTreeNode[] = [
        {
          id: 'task-1',
          title: 'Root Task',
          blueprint_id: 'bp-1',
          parent_task_id: null,
          sequence_order: 0,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as TaskTreeNode
      ];

      const result = service.canDropOn('task-2', 'task-1', tasks);

      expect(result).toBe(true);
    });
  });
});
