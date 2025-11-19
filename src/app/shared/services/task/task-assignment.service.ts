import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskAssignmentRepository } from '@core';
import { TaskAssignment, TaskAssignmentInsert, TaskAssignmentUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task Assignment Service
 *
 * 提供任務指派相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const assignmentService = inject(TaskAssignmentService);
 *
 * // 載入任務的指派列表
 * await assignmentService.loadByTaskId('task-id');
 *
 * // 訂閱指派狀態
 * effect(() => {
 *   console.log('Assignments:', assignmentService.assignments());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskAssignmentService {
  private taskAssignmentRepository = inject(TaskAssignmentRepository);

  // 使用 Signals 管理狀態
  private assignmentsState = signal<TaskAssignment[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly assignments = this.assignmentsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly assignmentCount = computed(() => this.assignments().length);

  /**
   * 載入指定任務的所有指派
   */
  async loadByTaskId(taskId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.taskAssignmentRepository.findByTaskId(taskId));
      this.assignmentsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入任務指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定指派對象的所有指派
   */
  async loadByAssigneeId(assigneeId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.taskAssignmentRepository.findByAssigneeId(assigneeId));
      this.assignmentsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入指派對象指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新的任務指派
   */
  async create(data: TaskAssignmentInsert): Promise<TaskAssignment> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const assignment = await firstValueFrom(this.taskAssignmentRepository.create(data));

      // 更新本地狀態
      this.assignmentsState.update(current => [...current, assignment]);

      return assignment;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建任務指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任務指派
   */
  async update(id: string, data: TaskAssignmentUpdate): Promise<TaskAssignment> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.taskAssignmentRepository.update(id, data));

      // 更新本地狀態
      this.assignmentsState.update(current => current.map(a => (a.id === id ? updated : a)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新任務指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除任務指派
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.taskAssignmentRepository.delete(id));

      // 更新本地狀態
      this.assignmentsState.update(current => current.filter(a => a.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除任務指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 批量創建任務指派
   */
  async createBatch(assignments: TaskAssignmentInsert[]): Promise<TaskAssignment[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const created = await Promise.all(assignments.map(data => firstValueFrom(this.taskAssignmentRepository.create(data))));

      // 更新本地狀態
      this.assignmentsState.update(current => [...current, ...created]);

      return created;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批量創建任務指派失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.assignmentsState.set([]);
    this.errorState.set(null);
  }
}
