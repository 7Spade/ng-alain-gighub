import { Injectable, inject, signal } from '@angular/core';
import type { ProgressState, QuantityProgressSnapshot, TaskProgress } from '@models';
import { TaskProgressService } from '@tasks/features/task-progress/services/domain/task-progress.service';

interface UpdateProgressInput {
  quantity: QuantityProgressSnapshot;
  percentage?: number;
  status?: ProgressState['progress']['status'];
  recordedBy?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskProgressFacade {
  private readonly service = inject(TaskProgressService);

  private readonly progressSignal = signal<TaskProgress | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly progress = this.progressSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(taskId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const progress = await this.service.getTaskProgress(taskId);
      this.progressSignal.set(progress);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.progressSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async update(taskId: string, input: UpdateProgressInput): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const updated = await this.service.updateProgress(taskId, {
        quantity: input.quantity,
        percentage: input.percentage,
        status: input.status,
        recordedBy: input.recordedBy,
        notes: input.notes
      });
      this.progressSignal.set({ progress: updated });
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
      await this.service.removeProgress(taskId);
      this.progressSignal.set(null);
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
