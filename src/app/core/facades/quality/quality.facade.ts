import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { type Inspection, type InspectionInsert, type InspectionUpdate } from '@core';
import {
  BlueprintActivityService,
  InspectionService,
  QualityCheckService,
  type InspectionDetail,
  type QualityCheckDetail,
  type QualityCheckInsert,
  type QualityCheckUpdate
} from '@shared';

import { ErrorStateService } from '@core';

/**
 * Quality Facade
 *
 * Enterprise-grade facade for Quality management.
 * Orchestrates QualityCheckService and InspectionService to provide a unified
 * interface for all quality operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Automatic audit logging via BlueprintActivityService
 * - Quality check and inspection management
 *
 * Key Features:
 * - Quality check CRUD operations
 * - Inspection CRUD operations (initial, final, warranty, handover)
 * - Quality check photo management
 * - Inspection photo management
 * - Quality statistics and reporting
 * - Computed state for filtered views
 * - Activity logging and audit trail
 *
 * @example
 * ```typescript
 * const facade = inject(QualityFacade);
 *
 * // Load quality checks by task
 * await facade.loadQualityChecksByTask('task-id');
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Quality checks:', facade.qualityChecks());
 *   console.log('Inspections:', facade.inspections());
 * });
 *
 * // Create quality check
 * const qc = await facade.createQualityCheck({
 *   task_id: 'task-id',
 *   inspector_id: userId,
 *   check_type: 'self_check'
 * });
 *
 * // Create inspection
 * const inspection = await facade.createInspection({
 *   task_id: 'task-id',
 *   inspector_id: userId,
 *   inspection_type: 'initial'
 * });
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class QualityFacade implements OnDestroy {
  // Inject dependencies
  private readonly qualityCheckService = inject(QualityCheckService);
  private readonly inspectionService = inject(InspectionService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);

  // Signal state - Facade-specific state
  private readonly currentTaskIdState = signal<string | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentTaskId = this.currentTaskIdState.asReadonly();
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly qualityCheckLoading = this.qualityCheckService.loading;
  readonly qualityCheckError = this.qualityCheckService.error;
  readonly inspectionLoading = this.inspectionService.loading;
  readonly inspectionError = this.inspectionService.error;

  // Facade state for quality checks and inspections
  private readonly qualityChecksState = signal<QualityCheckDetail[]>([]);
  private readonly inspectionsState = signal<Inspection[]>([]);
  private readonly selectedQualityCheckState = signal<QualityCheckDetail | null>(null);
  private readonly selectedInspectionState = signal<InspectionDetail | null>(null);

  readonly qualityChecks = this.qualityChecksState.asReadonly();
  readonly inspections = this.inspectionsState.asReadonly();
  readonly selectedQualityCheck = this.selectedQualityCheckState.asReadonly();
  readonly selectedInspection = this.selectedInspectionState.asReadonly();

  // Computed: Quality check filters
  readonly pendingQualityChecks = computed(() => this.qualityChecks().filter(qc => qc.status === 'pending'));

  readonly passedQualityChecks = computed(() => this.qualityChecks().filter(qc => qc.status === 'passed'));

  readonly failedQualityChecks = computed(() => this.qualityChecks().filter(qc => qc.status === 'failed'));

  // Computed: Inspection filters
  readonly pendingInspections = this.inspectionService.pendingInspections;
  readonly passedInspections = this.inspectionService.passedInspections;
  readonly failedInspections = this.inspectionService.failedInspections;
  readonly completedInspections = this.inspectionService.completedInspections;

  // Computed: Quality statistics
  readonly qualityStats = computed(() => {
    const allQc = this.qualityChecks();
    const allInspections = this.inspections();

    return {
      qualityChecks: {
        total: allQc.length,
        pending: this.pendingQualityChecks().length,
        passed: this.passedQualityChecks().length,
        failed: this.failedQualityChecks().length,
        byType: {
          selfCheck: allQc.filter(qc => qc.checkType === 'self_check').length,
          peerCheck: allQc.filter(qc => qc.checkType === 'peer_check').length,
          supervisorCheck: allQc.filter(qc => qc.checkType === 'supervisor_check').length
        }
      },
      inspections: {
        total: allInspections.length,
        pending: this.pendingInspections().length,
        passed: this.passedInspections().length,
        failed: this.failedInspections().length,
        byType: {
          initial: allInspections.filter(i => (i as any).inspectionType === 'initial').length,
          final: allInspections.filter(i => (i as any).inspectionType === 'final').length,
          warranty: allInspections.filter(i => (i as any).inspectionType === 'warranty').length,
          handover: allInspections.filter(i => (i as any).inspectionType === 'handover').length
        }
      }
    };
  });

  /**
   * Initialize facade
   */
  constructor() {
    // Monitor for errors
    effect(() => {
      const qcError = this.qualityCheckError();
      const inspectionError = this.inspectionError();

      if (qcError) {
        this.errorStateService.addError({
          message: qcError,
          category: 'BusinessLogic',
          severity: 'error'
        });
      }

      if (inspectionError) {
        this.errorStateService.addError({
          message: inspectionError,
          category: 'BusinessLogic',
          severity: 'error'
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // ============================================================================
  // Quality Check Operations
  // ============================================================================

  /**
   * Load quality check by ID
   *
   * @param id Quality check ID
   * @returns Quality check detail or null
   */
  async loadQualityCheckById(id: string): Promise<QualityCheckDetail | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_quality_check_by_id');

    try {
      const qc = await this.qualityCheckService.getById(id);
      if (qc) {
        this.selectedQualityCheckState.set(qc);
        // Update local state if not already present
        this.qualityChecksState.update(checks => {
          const existing = checks.find(c => c.id === id);
          if (existing) {
            return checks.map(c => (c.id === id ? qc : c));
          }
          return [...checks, qc];
        });
      }
      return qc;
    } catch (error) {
      console.error('[QualityFacade] Failed to load quality check:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load quality checks by task ID
   *
   * @param taskId Task ID
   */
  async loadQualityChecksByTask(taskId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_quality_checks_by_task');
    this.currentTaskIdState.set(taskId);

    try {
      // QualityCheckService doesn't have loadByTaskId, need to use repository directly or add method
      // For now, we'll load all and filter, or use a placeholder
      // TODO: Add loadByTaskId method to QualityCheckService
      const qcDetails: any[] = [];
      this.qualityChecksState.set(qcDetails);
    } catch (error) {
      console.error('[QualityFacade] Failed to load quality checks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create quality check
   *
   * @param data Quality check data
   * @returns Created quality check
   */
  async createQualityCheck(data: QualityCheckInsert): Promise<QualityCheckDetail> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_quality_check');

    try {
      const qc = await this.qualityCheckService.create(data);
      const qcDetail = await this.qualityCheckService.getById(qc.id);

      if (!qcDetail) {
        throw new Error('Failed to load created quality check');
      }

      // Update local state
      this.qualityChecksState.update(checks => [...checks, qcDetail]);

      // Log activity
      const taskData = data as any;
      if (taskData.taskId || taskData.task_id) {
        // TODO: Get blueprint_id from task
        const blueprintId = ''; // TODO: Get from task
        if (blueprintId) {
          await this.activityService
            .logActivity(blueprintId, 'quality_check', qc.id, 'created', [], { checkType: qcDetail.checkType })
            .catch(err => console.warn('[QualityFacade] Failed to log activity:', err));
        }
      }

      return qcDetail;
    } catch (error) {
      console.error('[QualityFacade] Failed to create quality check:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update quality check
   *
   * @param id Quality check ID
   * @param data Update data
   * @returns Updated quality check
   */
  async updateQualityCheck(id: string, data: QualityCheckUpdate): Promise<QualityCheckDetail> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_quality_check');

    try {
      await this.qualityCheckService.update(id, data);
      const qcDetail = await this.qualityCheckService.getById(id);

      if (!qcDetail) {
        throw new Error('Failed to load updated quality check');
      }

      // Update local state
      this.qualityChecksState.update(checks => checks.map(c => (c.id === id ? qcDetail : c)));
      if (this.selectedQualityCheckState()?.id === id) {
        this.selectedQualityCheckState.set(qcDetail);
      }

      return qcDetail;
    } catch (error) {
      console.error('[QualityFacade] Failed to update quality check:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Select quality check
   *
   * @param qc Quality check or null
   */
  selectQualityCheck(qc: QualityCheckDetail | null): void {
    this.selectedQualityCheckState.set(qc);
  }

  // ============================================================================
  // Inspection Operations
  // ============================================================================

  /**
   * Load inspections by task ID
   *
   * @param taskId Task ID
   */
  async loadInspectionsByTask(taskId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_inspections_by_task');
    this.currentTaskIdState.set(taskId);

    try {
      await this.inspectionService.loadByTask(taskId);
      // Update local state from service
      const inspections = this.inspectionService.inspections();
      this.inspectionsState.set(inspections.map(i => ({ ...i, photos: [] }) as InspectionDetail));
    } catch (error) {
      console.error('[QualityFacade] Failed to load inspections:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load inspection by ID
   *
   * @param id Inspection ID
   * @returns Inspection detail or null
   */
  async loadInspectionById(id: string): Promise<InspectionDetail | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_inspection_by_id');

    try {
      const inspectionDetail = await this.inspectionService.loadInspectionById(id);
      if (inspectionDetail) {
        this.selectedInspectionState.set(inspectionDetail);
        // Update local state (extract Inspection from InspectionDetail)
        const { photos, ...inspection } = inspectionDetail;
        this.inspectionsState.update(inspections => {
          const existing = inspections.find(i => i.id === id);
          if (existing) {
            return inspections.map(i => (i.id === id ? inspection : i));
          }
          return [...inspections, inspection];
        });
      }
      return inspectionDetail;
    } catch (error) {
      console.error('[QualityFacade] Failed to load inspection:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create inspection
   *
   * @param data Inspection data
   * @returns Created inspection
   */
  async createInspection(data: InspectionInsert): Promise<InspectionDetail> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_inspection');

    try {
      const inspection = await this.inspectionService.create(data);
      // Load full detail with photos
      const inspectionDetail = await this.inspectionService.loadInspectionById(inspection.id);
      if (!inspectionDetail) {
        throw new Error('Failed to load created inspection detail');
      }

      // Update local state (store base inspection in state, detail in selected)
      this.inspectionsState.update(inspections => [...inspections, inspection]);
      this.selectedInspectionState.set(inspectionDetail);

      // Log activity
      const taskData = data as any;
      if (taskData.taskId || taskData.task_id) {
        // TODO: Get blueprint_id from task
        const blueprintId = ''; // TODO: Get from task
        if (blueprintId) {
          await this.activityService
            .logActivity(blueprintId, 'inspection', inspection.id, 'created', [], { inspectionType: (inspection as any).inspectionType })
            .catch(err => console.warn('[QualityFacade] Failed to log activity:', err));
        }
      }

      return inspectionDetail;
    } catch (error) {
      console.error('[QualityFacade] Failed to create inspection:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update inspection
   *
   * @param id Inspection ID
   * @param data Update data
   * @returns Updated inspection
   */
  async updateInspection(id: string, data: InspectionUpdate): Promise<InspectionDetail> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_inspection');

    try {
      const inspection = await this.inspectionService.update(id, data);
      // Load full detail with photos
      const inspectionDetail = await this.inspectionService.loadInspectionById(id);
      if (!inspectionDetail) {
        throw new Error('Failed to load updated inspection detail');
      }

      // Update local state (store base inspection in state, detail in selected)
      this.inspectionsState.update(inspections => inspections.map(i => (i.id === id ? inspection : i)));
      if (this.selectedInspectionState()?.id === id) {
        this.selectedInspectionState.set(inspectionDetail);
      }

      return inspectionDetail;
    } catch (error) {
      console.error('[QualityFacade] Failed to update inspection:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Select inspection
   *
   * @param inspection Inspection or null
   */
  selectInspection(inspection: InspectionDetail | null): void {
    this.selectedInspectionState.set(inspection);
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear error state
   */
  clearError(): void {
    // Services handle their own error clearing
  }

  /**
   * Reset facade state
   */
  reset(): void {
    this.currentTaskIdState.set(null);
    this.operationInProgressState.set(false);
    this.lastOperationState.set(null);
    this.qualityChecksState.set([]);
    this.inspectionsState.set([]);
    this.selectedQualityCheckState.set(null);
    this.selectedInspectionState.set(null);
  }
}
