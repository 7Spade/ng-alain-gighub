import { Injectable, inject, signal } from '@angular/core';
import type { PhysicalLocation, SpatialRelationships, TaskLocation } from '@models';
import { TaskLocationService } from '@tasks/features/task-location/services/domain/task-location.service';

@Injectable({
  providedIn: 'root'
})
export class TaskLocationFacade {
  private readonly service = inject(TaskLocationService);

  private readonly locationSignal = signal<TaskLocation | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly location = this.locationSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(taskId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const location = await this.service.getTaskLocation(taskId);
      this.locationSignal.set(location);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.locationSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updatePhysical(taskId: string, payload: Partial<PhysicalLocation>): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const updated = await this.service.updatePhysicalLocation(taskId, payload);
      const existing = this.locationSignal();
      this.locationSignal.set({
        physical: updated,
        relationships: existing?.relationships
      });
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateRelationships(taskId: string, payload: Partial<SpatialRelationships>): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const updated = await this.service.updateSpatialRelationships(taskId, payload);
      const existing = this.locationSignal();
      this.locationSignal.set({
        physical: existing?.physical,
        relationships: updated
      });
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
