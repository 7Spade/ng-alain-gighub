import { Injectable, inject, signal } from '@angular/core';
import type { Task, TaskQuantityPayload, TaskIdentityComplete } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';

type CreateTaskPayload = Partial<TaskIdentityComplete & Task> & { quantity?: TaskQuantityPayload };
type UpdateTaskPayload = Partial<Task> & { quantity?: TaskQuantityPayload };

@Injectable({
  providedIn: 'root'
})
export class TaskCommandFacade {
  private readonly repository = inject(TaskRepository);

  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  async createTask(blueprintId: string, payload: CreateTaskPayload): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      await this.repository.createTask(blueprintId, payload);
      return true;
    } catch (error) {
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      await this.repository.updateTask(taskId, payload);
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
