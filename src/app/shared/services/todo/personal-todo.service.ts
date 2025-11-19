import { Injectable, computed, inject, signal } from '@angular/core';
import { PersonalTodo, PersonalTodoRepository, TodoStatusTracking, TodoStatusTrackingRepository, RealtimeFacade } from '@core';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { firstValueFrom } from 'rxjs';

/**
 * 待辦狀態枚舉
 */
export enum TodoStatus {
  /** 待執行 🟦 */
  PENDING = 'pending',
  /** 暫存中 🟨 */
  STAGING = 'staging',
  /** 品管中 🟧 */
  IN_QA = 'in_qa',
  /** 驗收中 🟥 */
  IN_INSPECTION = 'in_inspection',
  /** 問題追蹤 ⚠️ */
  ISSUE_TRACKING = 'issue_tracking',
  /** 已完成 ✅ */
  COMPLETED = 'completed'
}

/**
 * 待辦類型枚舉
 */
export enum TodoType {
  /** 任務 */
  TASK = 'task',
  /** 品檢 */
  QUALITY_CHECK = 'quality_check',
  /** 驗收 */
  INSPECTION = 'inspection',
  /** 問題 */
  ISSUE = 'issue',
  /** 通知 */
  NOTIFICATION = 'notification'
}

/**
 * 待辦優先級枚舉
 */
export enum TodoPriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  MEDIUM = 'medium',
  /** 高 */
  HIGH = 'high',
  /** 緊急 */
  URGENT = 'urgent'
}

/**
 * 待辦統計介面
 */
export interface TodoStatistics {
  /** 總數 */
  total: number;
  /** 待執行數量 🟦 */
  pending: number;
  /** 暫存中數量 🟨 */
  staging: number;
  /** 品管中數量 🟧 */
  inQa: number;
  /** 驗收中數量 🟥 */
  inInspection: number;
  /** 問題追蹤數量 ⚠️ */
  issueTracking: number;
  /** 已完成數量 ✅ */
  completed: number;
  /** 逾期數量 */
  overdue: number;
}

/**
 * Personal Todo Service
 *
 * 管理個人待辦中心，提供五種狀態分類與 Realtime 即時更新：
 * - 🟦 待執行（pending）
 * - 🟨 暫存中（staging）
 * - 🟧 品管中（in_qa）
 * - 🟥 驗收中（in_inspection）
 * - ⚠️ 問題追蹤（issue_tracking）
 *
 * 依賴：
 * - PersonalTodoRepository (core/infra) - 資料存取
 * - TodoStatusTrackingRepository (core/infra) - 狀態追蹤資料存取
 * - RealtimeFacade (core) - Realtime 訂閱管理
 *
 * @example
 * ```typescript
 * const todoService = inject(PersonalTodoService);
 *
 * // 訂閱 Realtime 更新
 * await todoService.subscribeToUpdates(accountId);
 *
 * // 取得分類待辦
 * const pendingTodos = todoService.pendingTodos();
 * const stagingTodos = todoService.stagingTodos();
 * const qaTodos = todoService.qaTodos();
 *
 * // 統計數據
 * const stats = todoService.statistics();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PersonalTodoService {
  private personalTodoRepository = inject(PersonalTodoRepository);
  private todoStatusTrackingRepository = inject(TodoStatusTrackingRepository);
  private realtimeFacade = inject(RealtimeFacade);

  // Realtime 訂閱 ID
  private realtimeSubscriptionId: string | null = null;

  // Signals for state management
  private todosState = signal<PersonalTodo[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);
  private currentAccountIdState = signal<string | null>(null);

  // Readonly signals
  readonly todos = this.todosState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly currentAccountId = this.currentAccountIdState.asReadonly();

  // 🟦 待執行待辦（pending）
  readonly pendingTodos = computed(() => this.todosState().filter(todo => !todo.status || todo.status === TodoStatus.PENDING));

  // 🟨 暫存中待辦（staging）
  readonly stagingTodos = computed(() => this.todosState().filter(todo => todo.status === TodoStatus.STAGING));

  // 🟧 品管中待辦（in_qa）
  readonly qaTodos = computed(() => this.todosState().filter(todo => todo.status === TodoStatus.IN_QA));

  // 🟥 驗收中待辦（in_inspection）
  readonly inspectionTodos = computed(() => this.todosState().filter(todo => todo.status === TodoStatus.IN_INSPECTION));

  // ⚠️ 問題追蹤待辦（issue_tracking）
  readonly issueTrackingTodos = computed(() => this.todosState().filter(todo => todo.status === TodoStatus.ISSUE_TRACKING));

  // ✅ 已完成待辦（completed）
  readonly completedTodos = computed(() => this.todosState().filter(todo => todo.status === TodoStatus.COMPLETED));

  // 逾期待辦
  readonly overdueTodos = computed(() => {
    const now = new Date();
    return this.todosState().filter(todo => {
      if (!todo.due_date || todo.status === TodoStatus.COMPLETED) {
        return false;
      }
      const dueDate = new Date(todo.due_date);
      return dueDate < now;
    });
  });

  // 高優先級待辦
  readonly urgentTodos = computed(() =>
    this.todosState().filter(todo => todo.priority === TodoPriority.URGENT || todo.priority === TodoPriority.HIGH)
  );

  // 統計數據
  readonly statistics = computed<TodoStatistics>(() => ({
    total: this.todosState().length,
    pending: this.pendingTodos().length,
    staging: this.stagingTodos().length,
    inQa: this.qaTodos().length,
    inInspection: this.inspectionTodos().length,
    issueTracking: this.issueTrackingTodos().length,
    completed: this.completedTodos().length,
    overdue: this.overdueTodos().length
  }));

  /**
   * 載入帳號的所有待辦
   *
   * @param accountId 帳號 ID
   */
  async loadTodos(accountId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const todos = await firstValueFrom(this.personalTodoRepository.findByAccountId(accountId));
      this.todosState.set(todos);
      this.currentAccountIdState.set(accountId);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入待辦失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 訂閱 Realtime 更新
   *
   * @param accountId 帳號 ID
   */
  async subscribeToUpdates(accountId: string): Promise<void> {
    // 記錄當前帳號 ID
    this.currentAccountIdState.set(accountId);

    // 取消舊訂閱
    await this.unsubscribeFromUpdates();

    // 載入初始數據
    await this.loadTodos(accountId);

    // 建立 Realtime 訂閱（透過 RealtimeFacade）
    this.realtimeSubscriptionId = this.realtimeFacade.subscribeToTable<PersonalTodo>(
      {
        table: 'personal_todos',
        filter: `account_id=eq.${accountId}`,
        events: ['*'] // 監聽所有事件（INSERT, UPDATE, DELETE）
      },
      payload => {
        this.handleRealtimeEvent(payload);
      }
    );
  }

  /**
   * 取消訂閱 Realtime 更新
   */
  async unsubscribeFromUpdates(): Promise<void> {
    if (this.realtimeSubscriptionId) {
      this.realtimeFacade.unsubscribe(this.realtimeSubscriptionId);
      this.realtimeSubscriptionId = null;
    }
  }

  /**
   * 處理 Realtime 事件
   */
  private handleRealtimeEvent(payload: any): void {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        // 新增待辦
        this.todosState.update(todos => [...todos, newRecord as PersonalTodo]);
        break;

      case 'UPDATE':
        // 更新待辦
        this.todosState.update(todos => todos.map(todo => (todo.id === newRecord.id ? (newRecord as PersonalTodo) : todo)));
        break;

      case 'DELETE':
        // 刪除待辦
        this.todosState.update(todos => todos.filter(todo => todo.id !== oldRecord.id));
        break;
    }
  }

  /**
   * 新增待辦
   *
   * @param accountId 帳號 ID
   * @param data 待辦數據
   * @returns 建立的待辦
   */
  async createTodo(
    accountId: string,
    data: {
      title: string;
      description?: string;
      todoType: TodoType;
      relatedType?: string;
      relatedId?: string;
      priority?: TodoPriority;
      dueDate?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<PersonalTodo> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const todo = await firstValueFrom(
        this.personalTodoRepository.create({
          account_id: accountId,
          title: data.title,
          description: data.description || null,
          todo_type: data.todoType,
          related_type: data.relatedType || null,
          related_id: data.relatedId || null,
          status: TodoStatus.PENDING,
          priority: data.priority || TodoPriority.MEDIUM,
          due_date: data.dueDate || null
        })
      );

      // Realtime 會自動更新，但為了立即反應，手動更新
      if (!this.realtimeSubscriptionId) {
        this.todosState.update(todos => [...todos, todo]);
      }

      return todo;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '新增待辦失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新待辦狀態
   *
   * @param todoId 待辦 ID
   * @param newStatus 新狀態
   * @param changedBy 變更人 ID
   * @param reason 變更原因
   * @returns 更新後的待辦
   */
  async updateTodoStatus(todoId: string, newStatus: TodoStatus, changedBy: string, reason?: string): Promise<PersonalTodo> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 取得當前待辦
      const currentTodo = await firstValueFrom(this.personalTodoRepository.findById(todoId));
      if (!currentTodo) {
        throw new Error('待辦不存在');
      }

      const oldStatus = currentTodo.status || TodoStatus.PENDING;

      // 更新待辦狀態
      const todo = await firstValueFrom(
        this.personalTodoRepository.update(todoId, {
          status: newStatus
        })
      );

      // 記錄狀態變更歷史
      await firstValueFrom(
        this.todoStatusTrackingRepository.create({
          todo_id: todoId,
          from_status: oldStatus,
          to_status: newStatus,
          changed_by: changedBy,
          changed_at: new Date().toISOString(),
          change_note: reason || null
        })
      );

      // Realtime 會自動更新，但為了立即反應，手動更新
      if (!this.realtimeSubscriptionId) {
        this.todosState.update(todos => todos.map(t => (t.id === todoId ? todo : t)));
      }

      return todo;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新待辦狀態失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 完成待辦
   *
   * @param todoId 待辦 ID
   * @param accountId 帳號 ID
   * @returns 更新後的待辦
   */
  async completeTodo(todoId: string, accountId: string): Promise<PersonalTodo> {
    return this.updateTodoStatus(todoId, TodoStatus.COMPLETED, accountId, '手動完成');
  }

  /**
   * 刪除待辦
   *
   * @param todoId 待辦 ID
   */
  async deleteTodo(todoId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.personalTodoRepository.delete(todoId));

      // Realtime 會自動更新，但為了立即反應，手動更新
      if (!this.realtimeSubscriptionId) {
        this.todosState.update(todos => todos.filter(t => t.id !== todoId));
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除待辦失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 取得待辦的狀態歷史
   *
   * @param todoId 待辦 ID
   * @returns 狀態歷史列表
   */
  async getTodoStatusHistory(todoId: string): Promise<TodoStatusTracking[]> {
    try {
      return await firstValueFrom(this.todoStatusTrackingRepository.findByTodoId(todoId));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入狀態歷史失敗');
      throw error;
    }
  }

  /**
   * 根據待辦類型篩選
   *
   * @param todoType 待辦類型
   * @returns 篩選後的待辦列表
   */
  filterByType(todoType: TodoType): PersonalTodo[] {
    return this.todosState().filter(todo => todo.todo_type === todoType);
  }

  /**
   * 根據優先級篩選
   *
   * @param priority 優先級
   * @returns 篩選後的待辦列表
   */
  filterByPriority(priority: TodoPriority): PersonalTodo[] {
    return this.todosState().filter(todo => todo.priority === priority);
  }

  /**
   * 根據狀態篩選
   *
   * @param status 狀態
   * @returns 篩選後的待辦列表
   */
  filterByStatus(status: TodoStatus): PersonalTodo[] {
    return this.todosState().filter(todo => todo.status === status);
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }

  /**
   * 清除所有資料
   */
  clear(): void {
    this.todosState.set([]);
    this.currentAccountIdState.set(null);
    this.errorState.set(null);
  }
}
