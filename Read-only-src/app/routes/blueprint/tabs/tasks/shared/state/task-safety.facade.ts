import { Injectable, inject, signal } from '@angular/core';
import type { TaskSafety, TaskSafetySummary } from '@models';
import { TaskSafetyService, SafetyIncidentCreateInput } from '@tasks/features/task-safety/services/domain/task-safety.service';

@Injectable({
  providedIn: 'root'
})
export class TaskSafetyFacade {
  private readonly service = inject(TaskSafetyService);

  private readonly safetySignal = signal<TaskSafety | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly safety = this.safetySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(taskId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const safety = await this.service.getTaskSafety(taskId);
      this.safetySignal.set(safety);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.safetySignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateSummary(taskId: string, summary: Partial<TaskSafetySummary>): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      await this.service.updateSafetyRequirements(taskId, summary);
      await this.load(taskId);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async recordIncident(taskId: string, incident: SafetyIncidentCreateInput): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const created = await this.service.recordSafetyIncident(taskId, incident);
      const current = this.safetySignal();
      if (current) {
        const existingIncidents = current.incidents ?? [];
        this.safetySignal.set({
          ...current,
          incidents: [...existingIncidents, created]
        });
      } else {
        await this.load(taskId);
      }
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async remove(taskId: string): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      await this.service.removeSafety(taskId);
      this.safetySignal.set(null);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }
}
