import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatusSwitcherComponent } from './task-status-switcher.component';
import { SHARED_IMPORTS } from '@shared';

/**
 * Task Status Switcher Component Tests
 * 
 * Phase 6, Task 6.1: Status Switcher Tests
 * 
 * Tests the TaskStatusSwitcherComponent functionality:
 * - Displays current status correctly
 * - Shows only allowed transitions
 * - Emits status change events
 * - Handles edge cases
 * - Validates state machine rules
 */
describe('TaskStatusSwitcherComponent', () => {
  let component: TaskStatusSwitcherComponent;
  let fixture: ComponentFixture<TaskStatusSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusSwitcherComponent, SHARED_IMPORTS]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatusSwitcherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Current Status Display', () => {
    it('should display current status config', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      const config = component.currentStatusConfig();
      expect(config.value).toBe('pending');
      expect(config.label).toBe('待處理');
      expect(config.color).toBe('default');
    });

    it('should fallback to pending if status not found', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'invalid-status');
      fixture.detectChanges();

      const config = component.currentStatusConfig();
      expect(config.value).toBe('pending');
    });

    it('should update when currentStatus input changes', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      expect(component.currentStatusConfig().value).toBe('pending');

      fixture.componentRef.setInput('currentStatus', 'in_progress');
      fixture.detectChanges();

      expect(component.currentStatusConfig().value).toBe('in_progress');
    });
  });

  describe('Allowed Transitions', () => {
    it('should show only allowed transitions from pending', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      const values = allowed.map(s => s.value);
      
      expect(values).toContain('in_progress');
      expect(values).toContain('cancelled');
      expect(values.length).toBe(2);
    });

    it('should show only allowed transitions from in_progress', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'in_progress');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      const values = allowed.map(s => s.value);
      
      expect(values).toContain('staging');
      expect(values).toContain('pending');
      expect(values).toContain('cancelled');
      expect(values.length).toBe(3);
    });

    it('should show no transitions from completed', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'completed');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      expect(allowed.length).toBe(0);
    });

    it('should show no transitions from cancelled', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'cancelled');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      expect(allowed.length).toBe(0);
    });
  });

  describe('Status Change Events', () => {
    it('should emit statusChanged event when status changes', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      let emittedEvent: any = null;
      component.statusChanged.subscribe(event => {
        emittedEvent = event;
      });

      component.onStatusChange('in_progress');

      expect(emittedEvent).toBeTruthy();
      expect(emittedEvent.taskId).toBe('test-task-1');
      expect(emittedEvent.newStatus).toBe('in_progress');
    });

    it('should not emit if new status equals current status', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      let emitted = false;
      component.statusChanged.subscribe(() => {
        emitted = true;
      });

      component.onStatusChange('pending');

      expect(emitted).toBe(false);
    });
  });

  describe('Tag Color Helpers', () => {
    it('should return correct color for success status', () => {
      const color = component.getTagColor('success');
      expect(color).toContain('#');
    });

    it('should return correct color for error status', () => {
      const color = component.getTagColor('error');
      expect(color).toContain('#');
    });

    it('should return default color for unknown status', () => {
      const color = component.getTagColor('unknown' as any);
      expect(color).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty taskId', () => {
      fixture.componentRef.setInput('taskId', '');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      expect(() => component.onStatusChange('in_progress')).not.toThrow();
    });

    it('should handle rapid status changes', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'pending');
      fixture.detectChanges();

      const events: any[] = [];
      component.statusChanged.subscribe(event => {
        events.push(event);
      });

      component.onStatusChange('in_progress');
      component.onStatusChange('staging');
      component.onStatusChange('qc');

      expect(events.length).toBe(3);
      expect(events[0].newStatus).toBe('in_progress');
      expect(events[1].newStatus).toBe('staging');
      expect(events[2].newStatus).toBe('qc');
    });

    it('should handle null status gracefully', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', null as any);
      fixture.detectChanges();

      const config = component.currentStatusConfig();
      expect(config).toBeTruthy(); // Should fallback to pending
      expect(config.value).toBe('pending');
    });
  });

  describe('State Machine Validation', () => {
    it('should prevent invalid transition from staging to completed', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'staging');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      const values = allowed.map(s => s.value);
      
      expect(values).not.toContain('completed');
    });

    it('should allow progression through complete workflow', () => {
      const workflow = ['pending', 'in_progress', 'staging', 'qc', 'acceptance', 'completed'];
      
      for (let i = 0; i < workflow.length - 1; i++) {
        fixture.componentRef.setInput('currentStatus', workflow[i]);
        fixture.detectChanges();
        
        const allowed = component.allowedStatuses();
        const values = allowed.map(s => s.value);
        
        expect(values).toContain(workflow[i + 1]);
      }
    });

    it('should allow cancellation from in_progress', () => {
      fixture.componentRef.setInput('taskId', 'test-task-1');
      fixture.componentRef.setInput('currentStatus', 'in_progress');
      fixture.detectChanges();

      const allowed = component.allowedStatuses();
      const values = allowed.map(s => s.value);
      
      expect(values).toContain('cancelled');
    });

    it('should allow issue status from qc or acceptance', () => {
      // From QC
      fixture.componentRef.setInput('currentStatus', 'qc');
      fixture.detectChanges();
      let allowed = component.allowedStatuses();
      let values = allowed.map(s => s.value);
      expect(values).toContain('issue');

      // From Acceptance
      fixture.componentRef.setInput('currentStatus', 'acceptance');
      fixture.detectChanges();
      allowed = component.allowedStatuses();
      values = allowed.map(s => s.value);
      expect(values).toContain('issue');
    });
  });
});
