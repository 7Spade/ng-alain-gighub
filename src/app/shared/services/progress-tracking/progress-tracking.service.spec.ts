import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ProgressTrackingRepository, type ProgressTracking } from '@core';
import { AuthStateService } from '../auth';

import { ProgressTrackingService, type ProgressMetrics } from './progress-tracking.service';

describe('ProgressTrackingService', () => {
  let service: ProgressTrackingService;
  let mockProgressTrackingRepository: jasmine.SpyObj<ProgressTrackingRepository>;
  let mockAuthState: jasmine.SpyObj<AuthStateService>;

  const mockProgressTracking: ProgressTracking = {
    id: 'progress-123',
    blueprint_id: 'blueprint-123',
    branch_id: null,
    tracking_date: '2024-01-15',
    total_tasks: 100,
    completed_tasks: 45,
    in_progress_tasks: 30,
    pending_tasks: 25,
    overdue_tasks: 5,
    completion_percentage: 45.0,
    schedule_variance_days: -3,
    budget_spent: 250000.0,
    budget_variance: -15000.0,
    quality_score: 85.5,
    safety_incidents: 0,
    calculated_at: '2024-01-15T10:00:00Z'
  };

  const mockMetrics: ProgressMetrics = {
    totalTasks: 100,
    completedTasks: 45,
    inProgressTasks: 30,
    pendingTasks: 25,
    overdueTasks: 5,
    completionPercentage: 45.0,
    scheduleVarianceDays: -3,
    budgetSpent: 250000.0,
    budgetVariance: -15000.0,
    qualityScore: 85.5,
    safetyIncidents: 0
  };

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('ProgressTrackingRepository', [
      'create',
      'update',
      'findByBlueprintId',
      'findByBranchId',
      'findByDateRange',
      'findLatestByBlueprintId'
    ]);

    const authStateSpy = jasmine.createSpyObj('AuthStateService', [], {
      user: jasmine.createSpy('user').and.returnValue({ id: 'user-123', email: 'test@example.com' })
    });

    TestBed.configureTestingModule({
      providers: [
        ProgressTrackingService,
        { provide: ProgressTrackingRepository, useValue: repositorySpy },
        { provide: AuthStateService, useValue: authStateSpy }
      ]
    });

    service = TestBed.inject(ProgressTrackingService);
    mockProgressTrackingRepository = TestBed.inject(
      ProgressTrackingRepository
    ) as jasmine.SpyObj<ProgressTrackingRepository>;
    mockAuthState = TestBed.inject(AuthStateService) as jasmine.SpyObj<AuthStateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackProgress', () => {
    it('should track progress successfully', async () => {
      mockProgressTrackingRepository.create.and.returnValue(of(mockProgressTracking));

      const result = await service.trackProgress('blueprint-123', mockMetrics);

      expect(result).toEqual(mockProgressTracking);
      expect(mockProgressTrackingRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          blueprint_id: 'blueprint-123',
          total_tasks: 100,
          completed_tasks: 45
        })
      );
    });

    it('should track progress with branch ID', async () => {
      mockProgressTrackingRepository.create.and.returnValue(of(mockProgressTracking));

      await service.trackProgress('blueprint-123', mockMetrics, 'branch-456');

      expect(mockProgressTrackingRepository.create).toHaveBeenCalledWith(
        jasmine.objectContaining({
          blueprint_id: 'blueprint-123',
          branch_id: 'branch-456'
        })
      );
    });

    it('should handle errors when tracking progress', async () => {
      const error = new Error('Database error');
      mockProgressTrackingRepository.create.and.returnValue(throwError(() => error));

      await expectAsync(service.trackProgress('blueprint-123', mockMetrics)).toBeRejectedWithError('Database error');
      expect(service.error()).toBe('Database error');
    });
  });

  describe('updateProgress', () => {
    it('should update progress successfully', async () => {
      const updated = { ...mockProgressTracking, completed_tasks: 50 };
      mockProgressTrackingRepository.update.and.returnValue(of(updated));

      const result = await service.updateProgress('progress-123', { completedTasks: 50 });

      expect(result.completed_tasks).toBe(50);
      expect(mockProgressTrackingRepository.update).toHaveBeenCalledWith('progress-123', {
        completed_tasks: 50
      });
    });
  });

  describe('getProgressTracking', () => {
    it('should get progress tracking by blueprint ID', async () => {
      mockProgressTrackingRepository.findByBlueprintId.and.returnValue(of([mockProgressTracking]));

      const result = await service.getProgressTracking('blueprint-123');

      expect(result).toEqual([mockProgressTracking]);
      expect(service.trackings()).toEqual([mockProgressTracking]);
    });

    it('should get progress tracking by branch ID', async () => {
      mockProgressTrackingRepository.findByBranchId.and.returnValue(of([mockProgressTracking]));

      await service.getProgressTracking('blueprint-123', { branchId: 'branch-456' });

      expect(mockProgressTrackingRepository.findByBranchId).toHaveBeenCalledWith('branch-456');
    });

    it('should get progress tracking by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockProgressTrackingRepository.findByDateRange.and.returnValue(of([mockProgressTracking]));

      await service.getProgressTracking('blueprint-123', { startDate, endDate });

      expect(mockProgressTrackingRepository.findByDateRange).toHaveBeenCalledWith(
        'blueprint-123',
        startDate,
        endDate,
        undefined
      );
    });
  });

  describe('getLatestProgress', () => {
    it('should get latest progress', async () => {
      mockProgressTrackingRepository.findLatestByBlueprintId.and.returnValue(of(mockProgressTracking));

      const result = await service.getLatestProgress('blueprint-123');

      expect(result).toEqual(mockProgressTracking);
    });

    it('should return null when no progress found', async () => {
      mockProgressTrackingRepository.findLatestByBlueprintId.and.returnValue(of(null));

      const result = await service.getLatestProgress('blueprint-123');

      expect(result).toBeNull();
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate metrics correctly', () => {
      const tasks = [
        { status: 'completed', dueDate: '2024-01-10', budgetSpent: 1000, budgetPlanned: 1200 },
        { status: 'completed', dueDate: '2024-01-12', budgetSpent: 1500, budgetPlanned: 1500 },
        { status: 'in_progress', dueDate: '2024-01-20', budgetSpent: 500, budgetPlanned: 1000 },
        { status: 'pending', dueDate: '2024-01-25', budgetSpent: 0, budgetPlanned: 800 },
        { status: 'pending', dueDate: '2024-01-05', budgetSpent: 0, budgetPlanned: 500 } // overdue
      ];

      const metrics = service.calculateMetrics(tasks);

      expect(metrics.totalTasks).toBe(5);
      expect(metrics.completedTasks).toBe(2);
      expect(metrics.inProgressTasks).toBe(1);
      expect(metrics.pendingTasks).toBe(2);
      expect(metrics.completionPercentage).toBe(40.0);
      expect(metrics.budgetSpent).toBe(3000);
    });

    it('should handle empty task list', () => {
      const metrics = service.calculateMetrics([]);

      expect(metrics.totalTasks).toBe(0);
      expect(metrics.completedTasks).toBe(0);
      expect(metrics.completionPercentage).toBe(0);
    });
  });

  describe('computed signals', () => {
    it('should compute latest tracking', async () => {
      mockProgressTrackingRepository.findByBlueprintId.and.returnValue(of([mockProgressTracking]));
      await service.getProgressTracking('blueprint-123');

      expect(service.latestTracking()).toEqual(mockProgressTracking);
    });

    it('should compute completion rate', async () => {
      mockProgressTrackingRepository.findByBlueprintId.and.returnValue(of([mockProgressTracking]));
      await service.getProgressTracking('blueprint-123');

      expect(service.completionRate()).toBe(45.0);
    });

    it('should compute has overdue tasks', async () => {
      mockProgressTrackingRepository.findByBlueprintId.and.returnValue(of([mockProgressTracking]));
      await service.getProgressTracking('blueprint-123');

      expect(service.hasOverdueTasks()).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all state', async () => {
      mockProgressTrackingRepository.findByBlueprintId.and.returnValue(of([mockProgressTracking]));
      await service.getProgressTracking('blueprint-123');

      service.clear();

      expect(service.loading()).toBe(false);
      expect(service.error()).toBeNull();
      expect(service.trackings()).toEqual([]);
    });
  });
});
