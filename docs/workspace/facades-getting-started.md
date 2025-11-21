# Facades 增強開始指南

> **目的**: 幫助開發者快速了解並開始 Facades 增強工作  
> **預計閱讀時間**: 5 分鐘

---

## 🎯 這是什麼？

這是一個系統性的計畫，用於增強 ng-alain-gighub 專案中的 **Facades 層**，使其：
- ✅ 方法更完整（補充缺失的基礎方法）
- ✅ 結構更清晰（拆分過大的檔案）
- ✅ 更易維護（遵循企業標準）

## 📋 快速開始

### 1. 先看這個（5 分鐘）⭐
閱讀 **facades-quick-reference.md** 了解：
- 核心概念（拆分模式、基礎方法、Signal 狀態）
- 程式碼模板（複製即用）
- 缺失方法清單

### 2. 了解計畫（15 分鐘）
閱讀 **facades-repositories-enhancement-plan.md** 了解：
- 整體目標
- 哪些 Facades 需要增強
- 優先級排序
- 時間估算

### 3. 準備實施（30 分鐘）
閱讀 **facades-implementation-guide.md** 了解：
- 詳細實施步驟（7 步驟）
- 程式碼範例
- 常見問題

### 4. 開始工作
使用 **facades-enhancement-checklist.md** 追蹤進度：
- 勾選完成的項目
- 記錄遇到的問題
- 更新統計資訊

---

## 🎨 工作模式

### 參考實現
所有實施都參考 `src/app/core/facades/blueprint/` 的模式：

```
blueprint/
├── blueprint.facade.ts           # 主協調器 ⭐ 先看這個
├── blueprint-crud.facade.ts      # CRUD 操作 ⭐ 參考這個
├── blueprint-branch.facade.ts    # 功能域 1
├── blueprint-pr.facade.ts        # 功能域 2
├── blueprint-config.facade.ts    # 功能域 3
├── blueprint-activity.facade.ts  # 功能域 4
└── index.ts                      # 統一匯出
```

### 拆分原則
**原則**: 單一檔案不超過 500-800 行

**範例**: Task Facade（現在約 800+ 行）拆分為：
```
task/
├── task.facade.ts              # 主協調器（約 150 行）
├── task-crud.facade.ts         # CRUD 操作（約 400 行）⭐ 補充 5 個方法
├── task-assignment.facade.ts   # 任務分配（約 200 行）
├── task-list.facade.ts         # 任務列表（約 150 行）
├── task-template.facade.ts     # 任務模板（約 100 行）
├── task-dependency.facade.ts   # 依賴管理（約 100 行）
└── index.ts                    # 統一匯出
```

---

## 🔢 優先級

| 優先級 | Facade | 缺失方法 | 時間 |
|--------|--------|---------|------|
| 🔴 P0 | Task | 5 個 | 3-5 天 |
| 🔴 P0 | Issue | 6 個 | 3-5 天 |
| 🔴 P0 | Quality | 12 個 | 4-6 天 |
| 🟡 P1 | Document | 3 個 | 2-3 天 |
| 🟡 P2 | Account | 2 個 | 1-2 天 |
| 🟡 P2 | Others | - | 4-6 天 |

**建議**: 按優先級順序執行，先完成 Task → Issue → Quality

---

## ⚡ 快速範例

### 需要補充的方法（Task Facade）

```typescript
// task-crud.facade.ts 需要補充：

// 1. 加載所有任務（無藍圖限制）
async loadTasks(): Promise<void> { }

// 2. 搜索任務
async searchTasks(query: string, options?: QueryOptions): Promise<Task[]> { }

// 3. 按狀態加載
async loadTasksByStatus(status: TaskStatus): Promise<Task[]> { }

// 4. 按分配人加載
async loadTasksByAssignee(assigneeId: string, type: 'user' | 'team' | 'org'): Promise<Task[]> { }

// 5. 選擇任務
selectTask(task: Task | null): void { }
```

### 程式碼模板

**子 Facade 模板**（複製即用）:
```typescript
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskCrudFacade {
  private readonly taskService = inject(TaskService);
  
  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  
  async loadTasks(): Promise<void> {
    this.operationInProgressState.set(true);
    try {
      await this.taskService.loadTasks();
    } finally {
      this.operationInProgressState.set(false);
    }
  }
}
```

**主 Facade 協調器**:
```typescript
@Injectable({ providedIn: 'root' })
export class TaskFacade {
  readonly crud = inject(TaskCrudFacade);
  
  // Delegate to sub-facade
  async loadTasks(): Promise<void> {
    return this.crud.loadTasks();
  }
}
```

---

## ✅ 檢查清單（最小版）

開始前確認：
- [ ] 已閱讀 facades-quick-reference.md
- [ ] 已查看 blueprint facade 範例
- [ ] 已建立開發分支

實施中確認：
- [ ] 檔案結構符合規範
- [ ] Signal 狀態管理正確
- [ ] 錯誤處理完善
- [ ] 活動日誌記錄（Create/Update/Delete）

完成後確認：
- [ ] Lint 通過
- [ ] Build 成功
- [ ] 功能測試通過
- [ ] 程式碼審查通過

---

## 🆘 遇到問題？

### 問題 1: 不知道從哪裡開始？
**解決**: 先看 `facades-quick-reference.md` → 然後看 `blueprint-crud.facade.ts`

### 問題 2: 不確定如何拆分？
**解決**: 參考 `facades-implementation-guide.md` 的「拆分原則」章節

### 問題 3: 程式碼怎麼寫？
**解決**: 複製 `facades-quick-reference.md` 的程式碼模板，修改即可

### 問題 4: Lint 報錯？
**解決**: 執行 `yarn lint --fix` 自動修復大部分問題

### 問題 5: 不知道進度？
**解決**: 使用 `facades-enhancement-checklist.md` 追蹤

---

## 📞 尋求幫助

1. **查閱文檔**: 
   - facades-quick-reference.md（最快）
   - facades-implementation-guide.md（最詳細）

2. **查看參考實現**:
   - `src/app/core/facades/blueprint/blueprint-crud.facade.ts`

3. **諮詢團隊**: 技術討論區 / Code Review

---

## 🎉 開始吧！

1. 建立開發分支:
   ```bash
   git checkout -b feature/task-facade-enhancement
   ```

2. 開啟檢查清單:
   ```bash
   # 複製檢查清單，開始追蹤進度
   cp docs/workspace/facades-enhancement-checklist.md my-progress.md
   ```

3. 開始實施:
   ```bash
   # 建立第一個子 Facade
   touch src/app/core/facades/task/task-crud.facade.ts
   ```

4. 參考文檔，開始編碼！

---

**祝你順利！有任何問題，隨時查閱文檔或尋求幫助。**

**最後更新**: 2025-01-15  
**維護者**: 開發團隊
