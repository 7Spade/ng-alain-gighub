import { Injectable, inject, signal, computed } from '@angular/core';
import { TaskListRepository } from '@core';
import { TaskList, TaskListInsert, TaskListUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Task List Service
 *
 * 提供任務列表相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * @example
 * ```typescript
 * const taskListService = inject(TaskListService);
 *
 * // 載入指定類型的任務列表
 * await taskListService.loadByAssigneeType('User', 'user-id');
 *
 * // 訂閱任務列表狀態
 * effect(() => {
 *   console.log('Task Lists:', taskListService.taskLists());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private taskListRepository = inject(TaskListRepository);

  // 使用 Signals 管理狀態
  private taskListsState = signal<TaskList[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly taskLists = this.taskListsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals - 按列表類型分類
  readonly personalLists = computed(() => this.taskLists().filter(list => list.listType === 'personal'));

  readonly teamLists = computed(() => this.taskLists().filter(list => list.listType === 'team'));

  readonly organizationLists = computed(() => this.taskLists().filter(list => list.listType === 'organization'));

  readonly sharedLists = computed(() => this.taskLists().filter(list => list.listType === 'shared'));

  /**
   * 載入指定類型和 ID 的任務列表
   */
  async loadByAssigneeType(assigneeType: string, assigneeId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.taskListRepository.findByAssignee(assigneeType, assigneeId));
      this.taskListsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定指派對象的任務列表
   */
  async loadByAssigneeId(assigneeId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.taskListRepository.findByAssigneeId(assigneeId));
      this.taskListsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入指派對象任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定藍圖的任務列表
   */
  async loadByBlueprintId(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.taskListRepository.findByBlueprintId(blueprintId));
      this.taskListsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入藍圖任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新的任務列表
   */
  async create(data: TaskListInsert): Promise<TaskList> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const taskList = await firstValueFrom(this.taskListRepository.create(data));

      // 更新本地狀態
      this.taskListsState.update(current => [...current, taskList]);

      return taskList;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任務列表
   */
  async update(id: string, data: TaskListUpdate): Promise<TaskList> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.taskListRepository.update(id, data));

      // 更新本地狀態
      this.taskListsState.update(current => current.map(list => (list.id === id ? updated : list)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除任務列表
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.taskListRepository.delete(id));

      // 更新本地狀態
      this.taskListsState.update(current => current.filter(list => list.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新任務列表順序
   */
  async updateOrder(id: string, newOrder: number): Promise<TaskList> {
    return this.update(id, { displayOrder: newOrder });
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.taskListsState.set([]);
    this.errorState.set(null);
  }
}
