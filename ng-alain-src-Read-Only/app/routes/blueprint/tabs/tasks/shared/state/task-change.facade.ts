import { Injectable, inject, signal } from '@angular/core';
import type { ChangeRequest, TaskChange } from '@models';
import { TaskChangeService } from '@tasks/features/task-change/services/domain/task-change.service';

@Injectable({
  providedIn: 'root'
})
export class TaskChangeFacade {
  private readonly service = inject(TaskChangeService);

  private readonly changeSignal = signal<TaskChange | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly change = this.changeSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async load(taskId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const change = await this.service.getTaskChanges(taskId);
      this.changeSignal.set(change);
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.changeSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async create(taskId: string, request: Omit<ChangeRequest, 'id'>): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const created = await this.service.createChangeRequest(taskId, request);
      const current = this.changeSignal();
      if (current) {
        const existingChanges = current.changes?.changes ?? [];
        this.changeSignal.set({
          ...current,
          changes: {
            changes: [created, ...existingChanges]
          }
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

  async update(taskId: string, changeId: string, updates: Partial<ChangeRequest>): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      await this.service.updateChangeRequest(taskId, changeId, updates);
      await this.load(taskId);
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
