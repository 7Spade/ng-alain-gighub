import { Injectable, effect, inject, signal } from '@angular/core';
import type { Task } from '@models';
import { TaskRepository } from '@tasks/features/task-detail/services/repository/task.repository';

interface LoadOptions {
  refresh?: boolean;
  silent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDetailFacade {
  private readonly repository = inject(TaskRepository);

  private readonly taskIdSignal = signal<string | null>(null);
  private readonly taskSignal = signal<Task | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly task = this.taskSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    effect(() => {
      const changed = this.repository.changed();
      const currentId = this.taskIdSignal();
      if (currentId && changed > 0) {
        queueMicrotask(() => {
          void this.loadTask(currentId, { refresh: true, silent: true });
        });
      }
    });
  }

  async loadTask(id: string, options: LoadOptions = {}): Promise<void> {
    const currentId = this.taskIdSignal();
    if (!options.refresh && currentId === id && this.taskSignal()) {
      return;
    }

    this.taskIdSignal.set(id);
    if (!options.silent) {
      this.loadingSignal.set(true);
    }
    this.errorSignal.set(null);

    try {
      const task = await this.repository.getTask(id);
      if (!task) {
        this.taskSignal.set(null);
        this.errorSignal.set('NOT_FOUND');
        return;
      }
      this.taskSignal.set(task);
    } catch (error) {
      this.taskSignal.set(null);
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
    } finally {
      if (!options.silent) {
        this.loadingSignal.set(false);
      }
    }
  }

  async refresh(): Promise<void> {
    const id = this.taskIdSignal();
    if (id) {
      await this.loadTask(id, { refresh: true });
    }
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  currentTaskId(): string | null {
    return this.taskIdSignal();
  }
}
