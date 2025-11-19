import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { BlueprintAggregationRefreshService, RefreshReason } from './blueprint-aggregation-refresh.service';
import { ErrorStateService } from './error-state.service';
import { RealtimeFacade } from '../../../core/facades/realtime.facade';

describe('BlueprintAggregationRefreshService', () => {
  let service: BlueprintAggregationRefreshService;
  let mockRealtimeFacade: jasmine.SpyObj<RealtimeFacade>;
  let mockErrorService: jasmine.SpyObj<ErrorStateService>;

  beforeEach(() => {
    // Create mocks
    mockRealtimeFacade = jasmine.createSpyObj<RealtimeFacade>('RealtimeFacade', ['subscribeToTable', 'unsubscribe']);
    mockErrorService = jasmine.createSpyObj<ErrorStateService>('ErrorStateService', ['addError']);

    // Setup default return values
    mockRealtimeFacade.subscribeToTable.and.returnValue('sub-id-123');

    TestBed.configureTestingModule({
      providers: [
        BlueprintAggregationRefreshService,
        { provide: RealtimeFacade, useValue: mockRealtimeFacade },
        { provide: ErrorStateService, useValue: mockErrorService }
      ]
    });

    service = TestBed.inject(BlueprintAggregationRefreshService);
  });

  afterEach(() => {
    service.cleanupAll();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with no active blueprints', () => {
      expect(service.getActiveBlueprints()).toEqual([]);
    });

    it('should not be active for any blueprint initially', () => {
      expect(service.isActive('blueprint-123')).toBeFalse();
    });
  });

  describe('Setup Realtime Subscriptions', () => {
    it('should setup subscriptions for all resource types by default', () => {
      service.setupRealtimeSubscriptions('blueprint-123');

      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledTimes(4);
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledWith(
        jasmine.objectContaining({ table: 'tasks', filter: 'blueprint_id=eq.blueprint-123' }),
        jasmine.any(Function)
      );
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledWith(
        jasmine.objectContaining({ table: 'documents', filter: 'blueprint_id=eq.blueprint-123' }),
        jasmine.any(Function)
      );
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledWith(
        jasmine.objectContaining({ table: 'quality_checks', filter: 'blueprint_id=eq.blueprint-123' }),
        jasmine.any(Function)
      );
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledWith(
        jasmine.objectContaining({ table: 'issues', filter: 'blueprint_id=eq.blueprint-123' }),
        jasmine.any(Function)
      );
    });

    it('should setup only specified resource types', () => {
      service.setupRealtimeSubscriptions('blueprint-123', {
        tasks: true,
        documents: false,
        qualityChecks: false,
        issues: false
      });

      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledTimes(1);
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledWith(jasmine.objectContaining({ table: 'tasks' }), jasmine.any(Function));
    });

    it('should track active blueprints', () => {
      service.setupRealtimeSubscriptions('blueprint-123');

      expect(service.getActiveBlueprints()).toContain('blueprint-123');
      expect(service.isActive('blueprint-123')).toBeTrue();
    });

    it('should cleanup existing subscriptions before setting up new ones', () => {
      // Setup initial subscriptions
      service.setupRealtimeSubscriptions('blueprint-123');
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledTimes(4);

      // Setup again - should cleanup first
      mockRealtimeFacade.subscribeToTable.calls.reset();
      mockRealtimeFacade.unsubscribe.calls.reset();

      service.setupRealtimeSubscriptions('blueprint-123');

      expect(mockRealtimeFacade.unsubscribe).toHaveBeenCalledTimes(4);
      expect(mockRealtimeFacade.subscribeToTable).toHaveBeenCalledTimes(4);
    });

    it('should handle subscription errors', () => {
      mockRealtimeFacade.subscribeToTable.and.throwError('Subscription failed');

      service.setupRealtimeSubscriptions('blueprint-123');

      expect(mockErrorService.addError).toHaveBeenCalledWith(
        jasmine.objectContaining({
          category: 'System',
          severity: 'error',
          message: 'Failed to setup blueprint refresh subscriptions'
        })
      );
    });
  });

  describe('Listen to Refresh Events', () => {
    it('should emit refresh events', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.triggerRefresh('blueprint-123', 'manual');

      tick(1100); // Wait for debounce (1000ms) + buffer

      expect(receivedEvent).toBeTruthy();
      expect(receivedEvent.blueprintId).toBe('blueprint-123');
      expect(receivedEvent.reason).toBe('manual');
    }));

    it('should debounce multiple events', fakeAsync(() => {
      const events: any[] = [];

      service.listen().subscribe(event => {
        events.push(event);
      });

      // Trigger multiple events quickly
      service.triggerRefresh('blueprint-123', 'task_change');
      tick(100);
      service.triggerRefresh('blueprint-123', 'task_change');
      tick(100);
      service.triggerRefresh('blueprint-123', 'task_change');

      tick(1100); // Wait for debounce

      // Should only receive one event due to debouncing
      expect(events.length).toBe(1);
    }));

    it('should filter distinct events', fakeAsync(() => {
      const events: any[] = [];

      service.listen().subscribe(event => {
        events.push(event);
      });

      service.triggerRefresh('blueprint-123', 'task_change');
      tick(1100);

      // Same blueprint and reason - should be filtered out
      service.triggerRefresh('blueprint-123', 'task_change');
      tick(1100);

      expect(events.length).toBe(1);
    }));

    it('should emit events for different reasons', fakeAsync(() => {
      const events: any[] = [];

      service.listen().subscribe(event => {
        events.push(event);
      });

      service.triggerRefresh('blueprint-123', 'task_change');
      tick(1100);

      service.triggerRefresh('blueprint-123', 'document_change');
      tick(1100);

      expect(events.length).toBe(2);
      expect(events[0].reason).toBe('task_change');
      expect(events[1].reason).toBe('document_change');
    }));
  });

  describe('Manual Trigger', () => {
    it('should manually trigger refresh', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.triggerRefresh('blueprint-456', 'manual', { source: 'user-action' });

      tick(1100);

      expect(receivedEvent.blueprintId).toBe('blueprint-456');
      expect(receivedEvent.reason).toBe('manual');
      expect(receivedEvent.context).toEqual({ source: 'user-action' });
      expect(receivedEvent.timestamp).toBeInstanceOf(Date);
    }));
  });

  describe('Cleanup', () => {
    it('should cleanup specific blueprint subscriptions', () => {
      service.setupRealtimeSubscriptions('blueprint-123');

      service.cleanup('blueprint-123');

      expect(mockRealtimeFacade.unsubscribe).toHaveBeenCalledTimes(4);
      expect(service.isActive('blueprint-123')).toBeFalse();
    });

    it('should handle cleanup of non-existent blueprint', () => {
      expect(() => service.cleanup('non-existent')).not.toThrow();
    });

    it('should cleanup all subscriptions', () => {
      service.setupRealtimeSubscriptions('blueprint-123');
      service.setupRealtimeSubscriptions('blueprint-456');

      mockRealtimeFacade.unsubscribe.calls.reset();

      service.cleanupAll();

      expect(mockRealtimeFacade.unsubscribe).toHaveBeenCalledTimes(8); // 4 per blueprint
      expect(service.getActiveBlueprints()).toEqual([]);
    });

    it('should cleanup on destroy', () => {
      service.setupRealtimeSubscriptions('blueprint-123');

      service.ngOnDestroy();

      expect(mockRealtimeFacade.unsubscribe).toHaveBeenCalled();
      expect(service.getActiveBlueprints()).toEqual([]);
    });
  });

  describe('Active Blueprint Tracking', () => {
    it('should track multiple active blueprints', () => {
      service.setupRealtimeSubscriptions('blueprint-123');
      service.setupRealtimeSubscriptions('blueprint-456');

      const activeBlueprints = service.getActiveBlueprints();

      expect(activeBlueprints.length).toBe(2);
      expect(activeBlueprints).toContain('blueprint-123');
      expect(activeBlueprints).toContain('blueprint-456');
    });

    it('should check if specific blueprint is active', () => {
      service.setupRealtimeSubscriptions('blueprint-123');

      expect(service.isActive('blueprint-123')).toBeTrue();
      expect(service.isActive('blueprint-456')).toBeFalse();
    });
  });

  describe('Resource Change Handlers', () => {
    it('should emit task change events', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.setupRealtimeSubscriptions('blueprint-123');

      // Get the task callback
      const taskCall = mockRealtimeFacade.subscribeToTable.calls.all().find(call => call.args[0].table === 'tasks');
      const taskCallback = taskCall?.args[1];

      // Trigger task change
      taskCallback?.({
        eventType: 'INSERT',
        new: { id: 'task-1', title: 'New Task' },
        old: null
      });

      tick(1100);

      expect(receivedEvent.blueprintId).toBe('blueprint-123');
      expect(receivedEvent.reason).toBe('task_change');
      expect(receivedEvent.context?.taskId).toBe('task-1');
    }));

    it('should emit document change events', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.setupRealtimeSubscriptions('blueprint-123');

      const docCall = mockRealtimeFacade.subscribeToTable.calls.all().find(call => call.args[0].table === 'documents');
      const docCallback = docCall?.args[1];

      docCallback?.({
        eventType: 'UPDATE',
        new: { id: 'doc-1' },
        old: { id: 'doc-1' }
      });

      tick(1100);

      expect(receivedEvent.reason).toBe('document_change');
    }));

    it('should emit quality check change events', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.setupRealtimeSubscriptions('blueprint-123');

      const qcCall = mockRealtimeFacade.subscribeToTable.calls.all().find(call => call.args[0].table === 'quality_checks');
      const qcCallback = qcCall?.args[1];

      qcCallback?.({
        eventType: 'DELETE',
        new: null,
        old: { id: 'qc-1' }
      });

      tick(1100);

      expect(receivedEvent.reason).toBe('quality_check_change');
    }));

    it('should emit issue change events', fakeAsync(() => {
      let receivedEvent: any = null;

      service
        .listen()
        .pipe(take(1))
        .subscribe(event => {
          receivedEvent = event;
        });

      service.setupRealtimeSubscriptions('blueprint-123');

      const issueCall = mockRealtimeFacade.subscribeToTable.calls.all().find(call => call.args[0].table === 'issues');
      const issueCallback = issueCall?.args[1];

      issueCallback?.({
        eventType: 'INSERT',
        new: { id: 'issue-1' },
        old: null
      });

      tick(1100);

      expect(receivedEvent.reason).toBe('issue_change');
    }));
  });
});

