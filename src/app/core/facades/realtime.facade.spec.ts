import { TestBed } from '@angular/core/testing';
import { RealtimeFacade, SubscriptionConfig } from './realtime.facade';
import { SupabaseService } from '@core';
import { ErrorStateService } from '@shared/services/common';
import type { RealtimeChannel } from '@supabase/supabase-js';

describe('RealtimeFacade', () => {
  let facade: RealtimeFacade;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;
  let mockErrorService: jasmine.SpyObj<ErrorStateService>;
  let mockChannel: jasmine.SpyObj<RealtimeChannel>;

  beforeEach(() => {
    // Create mock channel
    mockChannel = jasmine.createSpyObj<RealtimeChannel>('RealtimeChannel', ['on', 'subscribe', 'send', 'track', 'presenceState'], {
      state: 'joined'
    });

    mockChannel.on.and.returnValue(mockChannel as any);
    mockChannel.subscribe.and.returnValue(mockChannel as any);

    // Create mock Supabase service
    mockSupabaseService = jasmine.createSpyObj<SupabaseService>('SupabaseService', [], {
      client: {
        channel: jasmine.createSpy('channel').and.returnValue(mockChannel),
        removeChannel: jasmine.createSpy('removeChannel')
      } as any
    });

    // Create mock Error service
    mockErrorService = jasmine.createSpyObj<ErrorStateService>('ErrorStateService', ['addError']);

    TestBed.configureTestingModule({
      providers: [
        RealtimeFacade,
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: ErrorStateService, useValue: mockErrorService }
      ]
    });

    facade = TestBed.inject(RealtimeFacade);
  });

  afterEach(() => {
    facade.unsubscribeAll();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(facade).toBeTruthy();
    });

    it('should initialize with no subscriptions', () => {
      expect(facade.subscriptions().size).toBe(0);
      expect(facade.activeSubscriptions()).toBe(0);
    });

    it('should start with disconnected state', () => {
      expect(facade.connectionState()).toBe('disconnected');
    });

    it('should not have active connections initially', () => {
      expect(facade.hasActiveConnection()).toBeFalse();
    });
  });

  describe('Table Subscriptions', () => {
    it('should subscribe to table changes', () => {
      const config: SubscriptionConfig = {
        table: 'tasks',
        filter: 'blueprint_id=eq.123'
      };
      const callback = jasmine.createSpy('callback');

      const subscriptionId = facade.subscribeToTable(config, callback);

      expect(subscriptionId).toBeTruthy();
      expect(facade.subscriptions().size).toBe(1);
      expect(mockSupabaseService.client.channel).toHaveBeenCalled();
      expect(mockChannel.on).toHaveBeenCalledWith('postgres_changes', jasmine.any(Object), jasmine.any(Function));
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    it('should throw error if table name is missing', () => {
      const config: SubscriptionConfig = {};
      const callback = jasmine.createSpy('callback');

      expect(() => facade.subscribeToTable(config, callback)).toThrowError('Table name is required');
    });

    it('should use custom subscription ID if provided', () => {
      const config: SubscriptionConfig = {
        id: 'custom-sub-id',
        table: 'tasks'
      };
      const callback = jasmine.createSpy('callback');

      const subscriptionId = facade.subscribeToTable(config, callback);

      expect(subscriptionId).toBe('custom-sub-id');
    });

    it('should update active subscriptions count', () => {
      const config: SubscriptionConfig = {
        table: 'tasks'
      };
      const callback = jasmine.createSpy('callback');

      expect(facade.activeSubscriptions()).toBe(0);

      facade.subscribeToTable(config, callback);

      expect(facade.activeSubscriptions()).toBe(1);
    });

    it('should handle multiple table subscriptions', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);
      facade.subscribeToTable({ table: 'issues' }, callback);

      expect(facade.activeSubscriptions()).toBe(2);
    });
  });

  describe('Broadcast Subscriptions', () => {
    it('should subscribe to broadcast', () => {
      const config: SubscriptionConfig = {
        channelName: 'task-updates'
      };
      const callback = jasmine.createSpy('callback');

      const subscriptionId = facade.subscribeToBroadcast(config, 'status-change', callback);

      expect(subscriptionId).toBeTruthy();
      expect(facade.subscriptions().size).toBe(1);
      expect(mockSupabaseService.client.channel).toHaveBeenCalledWith('task-updates');
      expect(mockChannel.on).toHaveBeenCalledWith('broadcast', jasmine.any(Object), jasmine.any(Function));
    });

    it('should throw error if channel name is missing', () => {
      const config: SubscriptionConfig = {};
      const callback = jasmine.createSpy('callback');

      expect(() => facade.subscribeToBroadcast(config, 'event', callback)).toThrowError('Channel name is required');
    });

    it('should send broadcast message', async () => {
      mockChannel.send.and.returnValue(Promise.resolve() as any);

      await facade.broadcast('task-updates', 'status-change', { taskId: '123' });

      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'status-change',
        payload: { taskId: '123' }
      });
    });
  });

  describe('Presence Subscriptions', () => {
    it('should subscribe to presence', () => {
      const config: SubscriptionConfig = {
        channelName: 'task-board'
      };
      const callback = jasmine.createSpy('callback');

      const subscriptionId = facade.subscribeToPresence(config, callback);

      expect(subscriptionId).toBeTruthy();
      expect(facade.subscriptions().size).toBe(1);
      expect(mockSupabaseService.client.channel).toHaveBeenCalledWith('task-board');
      expect(mockChannel.on).toHaveBeenCalledWith('presence', jasmine.any(Object), jasmine.any(Function));
    });

    it('should throw error if channel name is missing', () => {
      const config: SubscriptionConfig = {};
      const callback = jasmine.createSpy('callback');

      expect(() => facade.subscribeToPresence(config, callback)).toThrowError('Channel name is required');
    });

    it('should track presence', async () => {
      mockChannel.track.and.returnValue(Promise.resolve() as any);

      await facade.trackPresence('task-board', { userId: '123', status: 'online' });

      expect(mockChannel.track).toHaveBeenCalledWith({ userId: '123', status: 'online' });
    });
  });

  describe('Subscription Management', () => {
    it('should unsubscribe from specific subscription', () => {
      const callback = jasmine.createSpy('callback');
      const subscriptionId = facade.subscribeToTable({ table: 'tasks' }, callback);

      expect(facade.subscriptions().size).toBe(1);

      facade.unsubscribe(subscriptionId);

      expect(facade.subscriptions().size).toBe(0);
      expect(mockSupabaseService.client.removeChannel).toHaveBeenCalledWith(mockChannel);
    });

    it('should handle unsubscribe of non-existent subscription', () => {
      expect(() => facade.unsubscribe('non-existent')).not.toThrow();
    });

    it('should unsubscribe from all subscriptions', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);
      facade.subscribeToTable({ table: 'issues' }, callback);

      expect(facade.subscriptions().size).toBe(2);

      facade.unsubscribeAll();

      expect(facade.subscriptions().size).toBe(0);
    });

    it('should get subscription info', () => {
      const callback = jasmine.createSpy('callback');
      const subscriptionId = facade.subscribeToTable({ table: 'tasks' }, callback);

      const info = facade.getSubscription(subscriptionId);

      expect(info).toBeDefined();
      expect(info?.id).toBe(subscriptionId);
      expect(info?.type).toBe('table');
    });

    it('should return undefined for non-existent subscription', () => {
      const info = facade.getSubscription('non-existent');
      expect(info).toBeUndefined();
    });

    it('should get channel state', () => {
      const callback = jasmine.createSpy('callback');
      const subscriptionId = facade.subscribeToTable({ table: 'tasks' }, callback);

      const state = facade.getChannelState(subscriptionId);

      expect(state).toBe('joined');
    });
  });

  describe('Connection State Management', () => {
    it('should update connection state to connecting when subscription starts', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);

      // State should be connecting until status callback is triggered
      expect(facade.connectionState()).toBe('connecting');
    });

    it('should track connected subscriptions', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);

      // Get the status callback and simulate SUBSCRIBED status
      const statusCallback = mockChannel.subscribe.calls.mostRecent().args[0];
      statusCallback('SUBSCRIBED');

      expect(facade.connectedSubscriptions()).toBe(1);
      expect(facade.hasActiveConnection()).toBeTrue();
    });

    it('should handle subscription error status', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);

      const statusCallback = mockChannel.subscribe.calls.mostRecent().args[0];
      statusCallback('CHANNEL_ERROR');

      // Should log error
      expect(mockErrorService.addError).toHaveBeenCalledWith(
        jasmine.objectContaining({
          category: 'Network',
          severity: 'warning'
        })
      );
    });

    it('should update lastConnectionUpdate when status changes', done => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);

      const statusCallback = mockChannel.subscribe.calls.mostRecent().args[0];

      setTimeout(() => {
        statusCallback('SUBSCRIBED');
        expect(facade.lastConnectionUpdate()).not.toBeNull();
        done();
      }, 10);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup all subscriptions on destroy', () => {
      const callback = jasmine.createSpy('callback');

      facade.subscribeToTable({ table: 'tasks' }, callback);
      facade.subscribeToTable({ table: 'issues' }, callback);

      expect(facade.subscriptions().size).toBe(2);

      facade.ngOnDestroy();

      expect(facade.subscriptions().size).toBe(0);
    });
  });

  describe('Computed Signals', () => {
    it('should compute activeSubscriptions correctly', () => {
      const callback = jasmine.createSpy('callback');

      expect(facade.activeSubscriptions()).toBe(0);

      facade.subscribeToTable({ table: 'tasks' }, callback);
      expect(facade.activeSubscriptions()).toBe(1);

      facade.subscribeToTable({ table: 'issues' }, callback);
      expect(facade.activeSubscriptions()).toBe(2);
    });

    it('should compute subscriptionIds correctly', () => {
      const callback = jasmine.createSpy('callback');

      const id1 = facade.subscribeToTable({ table: 'tasks' }, callback);
      const id2 = facade.subscribeToTable({ table: 'issues' }, callback);

      const ids = facade.subscriptionIds();

      expect(ids).toContain(id1);
      expect(ids).toContain(id2);
      expect(ids.length).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle callback errors gracefully', () => {
      const errorCallback = jasmine.createSpy('callback').and.throwError('Test error');

      facade.subscribeToTable({ table: 'tasks' }, errorCallback);

      // Get the postgres_changes callback
      const onCall = mockChannel.on.calls.mostRecent();
      const postgresCallback = onCall.args[2];

      // Trigger callback with mock payload
      expect(() => postgresCallback({ eventType: 'INSERT', new: { id: '1' } })).not.toThrow();

      // Should log error
      expect(mockErrorService.addError).toHaveBeenCalledWith(
        jasmine.objectContaining({
          category: 'System',
          severity: 'error',
          message: 'Error in table subscription callback'
        })
      );
    });

    it('should handle broadcast errors', async () => {
      mockChannel.send.and.returnValue(Promise.reject(new Error('Network error')));

      try {
        await facade.broadcast('channel', 'event', {});
        fail('Should have thrown error');
      } catch (error) {
        expect(mockErrorService.addError).toHaveBeenCalledWith(
          jasmine.objectContaining({
            category: 'Network',
            severity: 'error',
            message: 'Failed to send broadcast message'
          })
        );
      }
    });
  });
});
