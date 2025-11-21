# Facades 實施指南

> **建立日期**: 2025-01-15  
> **適用對象**: 開發者實施 Facade 拆分與增強  
> **相關文檔**: facades-repositories-enhancement-plan.md

---

## 📖 目錄

1. [拆分原則](#拆分原則)
2. [實施步驟](#實施步驟)
3. [程式碼範例](#程式碼範例)
4. [常見問題](#常見問題)
5. [檢查清單](#檢查清單)

---

## 🎯 拆分原則

### 何時需要拆分？

當 Facade 檔案符合以下條件之一時，應考慮拆分：

1. **檔案行數**: 超過 500-800 行
2. **職責過多**: 包含多個不相關的功能域
3. **難以維護**: 難以快速找到特定功能
4. **測試複雜**: 單元測試過於龐大

### 拆分維度

按功能域清晰拆分：

1. **CRUD 操作**: 基本的增刪改查（`*-crud.facade.ts`）
2. **關聯管理**: 處理實體間的關聯（`*-assignment.facade.ts`, `*-tag.facade.ts`）
3. **特殊操作**: 領域特定功能（`*-sync.facade.ts`, `*-version.facade.ts`）
4. **附屬功能**: 照片、檔案等管理（`*-photo.facade.ts`）

### 保持不拆分的情況

以下 Facade 應保持單一檔案：

1. **Auth Facade**: 認證專用，邏輯緊密
2. **Storage Facade**: 檔案存儲專用
3. **Realtime Facade**: 實時通信專用
4. **小型 Facade**: 少於 300 行且職責單一

---

## 🔧 實施步驟

### Step 1: 分析現有程式碼

1. **統計檔案行數**:
   ```bash
   wc -l src/app/core/facades/task/task.facade.ts
   ```

2. **識別功能域**:
   - 閱讀檔案，標記不同功能域
   - 統計各功能域的方法數量
   - 確認功能域之間的依賴關係

3. **確定拆分策略**:
   - 決定子 Facade 數量和職責
   - 規劃主 Facade 的協調職責

### Step 2: 建立子 Facade 檔案

1. **建立檔案**:
   ```bash
   # 以 Task Facade 為例
   touch src/app/core/facades/task/task-crud.facade.ts
   touch src/app/core/facades/task/task-assignment.facade.ts
   touch src/app/core/facades/task/task-list.facade.ts
   ```

2. **複製檔案頭部**:
   - 複製 import 語句
   - 複製 JSDoc 註解
   - 調整為子 Facade 的職責描述

### Step 3: 遷移程式碼

#### 3.1 遷移 Service 注入
```typescript
// 從主 Facade
private readonly taskService = inject(TaskService);
private readonly taskAssignmentService = inject(TaskAssignmentService);

// 拆分到子 Facade
// task-crud.facade.ts
private readonly taskService = inject(TaskService);

// task-assignment.facade.ts
private readonly taskAssignmentService = inject(TaskAssignmentService);
```

#### 3.2 遷移 Signal 狀態
```typescript
// 從主 Facade
private readonly tasksState = signal<Task[]>([]);
private readonly assignmentsState = signal<TaskAssignment[]>([]);

// 拆分到子 Facade
// task-crud.facade.ts
private readonly tasksState = signal<Task[]>([]);

// task-assignment.facade.ts
private readonly assignmentsState = signal<TaskAssignment[]>([]);
```

#### 3.3 遷移方法
```typescript
// 從主 Facade
async loadTasksByBlueprint(blueprintId: string): Promise<void> { }
async assignTask(taskId: string, assigneeId: string): Promise<void> { }

// 拆分到子 Facade
// task-crud.facade.ts
async loadTasksByBlueprint(blueprintId: string): Promise<void> { }

// task-assignment.facade.ts
async assignTask(taskId: string, assigneeId: string): Promise<void> { }
```

### Step 4: 補充缺失方法

參考 `BlueprintCrudFacade` 補充缺失的基礎方法：

```typescript
// task-crud.facade.ts

/**
 * Load all tasks (without blueprint filter)
 * 
 * @returns Promise<void>
 */
async loadTasks(): Promise<void> {
  this.operationInProgressState.set(true);
  this.lastOperationState.set('load_tasks');
  
  try {
    const tasks = await this.taskService.loadTasks();
    this.tasksState.set(tasks);
  } catch (error) {
    console.error('[TaskCrudFacade] Failed to load tasks:', error);
    throw error;
  } finally {
    this.operationInProgressState.set(false);
  }
}

/**
 * Search tasks (supports fuzzy search)
 * 
 * @param query Search query
 * @param options Search options
 * @returns Promise<Task[]>
 */
async searchTasks(
  query: string,
  options?: { page?: number; pageSize?: number }
): Promise<Task[]> {
  this.operationInProgressState.set(true);
  this.lastOperationState.set('search_tasks');
  
  try {
    return await this.taskService.searchTasks(query, options);
  } catch (error) {
    console.error('[TaskCrudFacade] Failed to search tasks:', error);
    throw error;
  } finally {
    this.operationInProgressState.set(false);
  }
}

/**
 * Load tasks by status
 * 
 * @param status Task status
 * @returns Promise<Task[]>
 */
async loadTasksByStatus(status: TaskStatus): Promise<Task[]> {
  this.operationInProgressState.set(true);
  this.lastOperationState.set('load_tasks_by_status');
  
  try {
    return await this.taskService.loadTasksByStatus(status);
  } catch (error) {
    console.error('[TaskCrudFacade] Failed to load tasks by status:', error);
    throw error;
  } finally {
    this.operationInProgressState.set(false);
  }
}

/**
 * Select task for detail view
 * 
 * @param task Task or null to deselect
 */
selectTask(task: Task | null): void {
  this.selectedTaskState.set(task);
}
```

### Step 5: 重構主 Facade 為協調器

```typescript
/**
 * Task Facade (Main Coordinator)
 * 
 * Orchestrates multiple sub-facades to provide unified interface
 * for all task operations.
 */
@Injectable({ providedIn: 'root' })
export class TaskFacade implements OnDestroy {
  // Inject sub-facades
  readonly crud = inject(TaskCrudFacade);
  readonly assignment = inject(TaskAssignmentFacade);
  readonly list = inject(TaskListFacade);
  readonly template = inject(TaskTemplateFacade);
  readonly dependency = inject(TaskDependencyFacade);
  
  private readonly activityService = inject(BlueprintActivityService);
  
  // Facade-specific state (context management)
  private readonly currentTaskIdState = signal<string | null>(null);
  readonly currentTaskId = this.currentTaskIdState.asReadonly();
  
  // Expose sub-facade signals
  readonly tasks = this.crud.tasks;
  readonly selectedTask = this.crud.selectedTask;
  readonly loading = this.crud.loading;
  readonly error = this.crud.error;
  
  readonly assignments = this.assignment.assignments;
  readonly lists = this.list.taskLists;
  readonly templates = this.template.templates;
  
  // Computed: Current task
  readonly currentTask = computed(() => {
    const taskId = this.currentTaskId();
    if (!taskId) return null;
    return this.tasks().find(t => t.id === taskId) || null;
  });
  
  // ========================================================================
  // Delegate to sub-facades
  // ========================================================================
  
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    return this.crud.loadTasksByBlueprint(blueprintId);
  }
  
  async loadTasks(): Promise<void> {
    return this.crud.loadTasks();
  }
  
  async searchTasks(query: string, options?: any): Promise<Task[]> {
    return this.crud.searchTasks(query, options);
  }
  
  async createTask(data: TaskInsert): Promise<Task> {
    const task = await this.crud.createTask(data);
    this.currentTaskIdState.set(task.id);
    return task;
  }
  
  async assignTask(taskId: string, assigneeId: string, type: string): Promise<void> {
    return this.assignment.assignTask(taskId, assigneeId, type);
  }
  
  // ========================================================================
  // Context management
  // ========================================================================
  
  setCurrentTask(taskId: string | null): void {
    this.currentTaskIdState.set(taskId);
  }
  
  selectTask(task: Task | null): void {
    this.crud.selectTask(task);
    if (task) {
      this.currentTaskIdState.set(task.id);
    }
  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
```

### Step 6: 更新匯出檔案

```typescript
// task/index.ts

/**
 * 任務系統 Facade 導出
 * 
 * 提供任務系統相關的 Facade：
 * - TaskFacade: 主協調器
 * - TaskCrudFacade: 任務 CRUD 操作
 * - TaskAssignmentFacade: 任務分配管理
 * - TaskListFacade: 任務列表管理
 * - TaskTemplateFacade: 任務模板管理
 * - TaskDependencyFacade: 依賴關係管理
 * 
 * @module core/facades/task
 */

// 主 Facade（協調器）
export * from './task.facade';

// 子 Facade（按功能域拆分）
export * from './task-crud.facade';
export * from './task-assignment.facade';
export * from './task-list.facade';
export * from './task-template.facade';
export * from './task-dependency.facade';
```

### Step 7: 測試與驗證

1. **Lint 檢查**:
   ```bash
   yarn lint
   ```

2. **Build 測試**:
   ```bash
   yarn build
   ```

3. **單元測試**:
   ```bash
   yarn test
   ```

4. **手動測試**:
   - 測試現有功能是否正常
   - 測試新增方法是否工作
   - 檢查錯誤處理是否正確

---

## 📝 程式碼範例

### 完整的 CRUD Facade 範例

```typescript
import { inject, Injectable, signal } from '@angular/core';
import { type Task, type TaskInsert, type TaskUpdate } from '@core';
import { TaskService, type TaskStatus } from '@shared';
import { BlueprintActivityService } from '@shared';

/**
 * Task CRUD Facade
 * 
 * 負責任務的基本 CRUD 操作
 * 包括搜索、按條件查詢等功能
 * 
 * @module core/facades/task
 */
@Injectable({
  providedIn: 'root'
})
export class TaskCrudFacade {
  private readonly taskService = inject(TaskService);
  private readonly activityService = inject(BlueprintActivityService);
  
  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);
  
  // Expose service signals
  readonly tasks = this.taskService.tasks;
  readonly selectedTask = this.taskService.selectedTask;
  readonly loading = this.taskService.loading;
  readonly error = this.taskService.error;
  
  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();
  
  // ========================================================================
  // Load Operations
  // ========================================================================
  
  async loadTasks(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks');
    
    try {
      await this.taskService.loadTasks();
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to load tasks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async loadTasksByBlueprint(blueprintId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_blueprint');
    
    try {
      await this.taskService.loadTasksByBlueprint(blueprintId);
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to load tasks by blueprint:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async loadTaskById(taskId: string): Promise<Task | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_task_by_id');
    
    try {
      return await this.taskService.loadTaskById(taskId);
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to load task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async loadTasksByStatus(status: TaskStatus): Promise<Task[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_status');
    
    try {
      return await this.taskService.loadTasksByStatus(status);
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to load tasks by status:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async searchTasks(
    query: string,
    options?: { page?: number; pageSize?: number }
  ): Promise<Task[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('search_tasks');
    
    try {
      return await this.taskService.searchTasks(query, options);
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to search tasks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  // ========================================================================
  // Create, Update, Delete Operations
  // ========================================================================
  
  async createTask(data: TaskInsert): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_task');
    
    try {
      const task = await this.taskService.createTask(data);
      
      // Log activity
      try {
        await this.activityService.logActivity(
          task.blueprint_id,
          'task',
          task.id,
          'created',
          [{ field: 'status', oldValue: null, newValue: task.status }],
          { taskTitle: task.title }
        );
      } catch (error) {
        console.error('[TaskCrudFacade] Failed to log task creation:', error);
      }
      
      return task;
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to create task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async updateTask(taskId: string, data: TaskUpdate): Promise<Task> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_task');
    
    const oldTask = this.tasks().find(t => t.id === taskId);
    
    try {
      const updatedTask = await this.taskService.updateTask(taskId, data);
      
      // Log activity
      if (oldTask) {
        const changes = this.calculateChanges(oldTask, data);
        if (changes.length > 0) {
          try {
            await this.activityService.logActivity(
              updatedTask.blueprint_id,
              'task',
              taskId,
              'updated',
              changes,
              { taskTitle: updatedTask.title }
            );
          } catch (error) {
            console.error('[TaskCrudFacade] Failed to log task update:', error);
          }
        }
      }
      
      return updatedTask;
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to update task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  async deleteTask(taskId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_task');
    
    const task = this.tasks().find(t => t.id === taskId);
    
    try {
      await this.taskService.deleteTask(taskId);
      
      // Log activity
      if (task) {
        try {
          await this.activityService.logActivity(
            task.blueprint_id,
            'task',
            taskId,
            'deleted',
            [],
            { taskTitle: task.title }
          );
        } catch (error) {
          console.error('[TaskCrudFacade] Failed to log task deletion:', error);
        }
      }
    } catch (error) {
      console.error('[TaskCrudFacade] Failed to delete task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  // ========================================================================
  // Selection
  // ========================================================================
  
  selectTask(task: Task | null): void {
    this.taskService.selectTask(task);
  }
  
  // ========================================================================
  // Private Helpers
  // ========================================================================
  
  private calculateChanges(
    oldTask: Task,
    updateData: TaskUpdate
  ): Array<{ field: string; oldValue: unknown; newValue: unknown }> {
    const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];
    
    for (const [key, newValue] of Object.entries(updateData)) {
      const oldValue = oldTask[key as keyof Task];
      if (oldValue !== newValue) {
        changes.push({ field: key, oldValue, newValue });
      }
    }
    
    return changes;
  }
}
```

---

## ❓ 常見問題

### Q1: 拆分後會不會影響現有程式碼？

**A**: 不會。透過主 Facade 委派（delegate）模式，保持對外 API 完全相同，現有使用 `TaskFacade` 的程式碼無需修改。

### Q2: 子 Facade 之間如何通信？

**A**: 
1. **優先**: 透過主 Facade 協調
2. **次選**: 透過 Service 層共享狀態
3. **避免**: 子 Facade 之間直接注入依賴

### Q3: 什麼時候使用 Service，什麼時候使用 Facade？

**A**:
- **Service**: Repository 模式，直接與 API/Supabase 互動
- **Facade**: 門面模式，協調多個 Service，提供統一介面

### Q4: 如何處理錯誤？

**A**: 
```typescript
try {
  await this.service.operation();
} catch (error) {
  console.error('[FacadeName] Operation failed:', error);
  // 不吃掉錯誤，向上拋出讓組件處理
  throw error;
} finally {
  this.operationInProgressState.set(false);
}
```

### Q5: 是否需要為每個方法記錄活動？

**A**: 
- **必須記錄**: Create, Update, Delete 操作
- **不需要記錄**: Read 操作（Load, Search, Select）

---

## ✅ 檢查清單

### 拆分前檢查
- [ ] 檔案行數是否超過 500-800 行？
- [ ] 是否包含多個功能域？
- [ ] 是否難以快速定位功能？
- [ ] 單元測試是否過於龐大？

### 拆分中檢查
- [ ] 子 Facade 職責是否清晰？
- [ ] 是否避免子 Facade 之間的直接依賴？
- [ ] 主 Facade 是否只做協調，不包含具體實現？
- [ ] 是否補充了所有缺失的基礎方法？

### 拆分後檢查
- [ ] 是否更新了 index.ts 匯出？
- [ ] 是否通過 Lint 檢查？
- [ ] 是否通過 Build 測試？
- [ ] 是否保持 API 相容性？
- [ ] 是否添加了完整的 JSDoc 註解？
- [ ] 是否遵循命名規範？
- [ ] 是否使用 Signal 管理狀態？
- [ ] 是否正確處理錯誤？
- [ ] 是否記錄必要的活動日誌？

---

## 📚 相關資源

- **Blueprint Facade 參考**: `src/app/core/facades/blueprint/`
- **Service 層規範**: `src/app/shared/services/`
- **開發規範**: `.copilot-instructions.md`
- **架構文檔**: `docs/27-完整架構流程圖.mermaid.md`

---

**最後更新**: 2025-01-15  
**維護者**: 開發團隊
