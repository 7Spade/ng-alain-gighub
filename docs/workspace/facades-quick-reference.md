# Facades 增強快速參考指南

> **用途**: 提供快速查閱的參考資料  
> **目標**: 讓開發者能快速找到所需資訊

---

## 📖 快速導航

| 文檔 | 用途 | 適用場景 |
|------|------|---------|
| [facades-repositories-enhancement-plan.md](./facades-repositories-enhancement-plan.md) | 完整計畫 | 了解整體規劃 |
| [facades-implementation-guide.md](./facades-implementation-guide.md) | 實施指南 | 執行具體實施 |
| [facades-enhancement-checklist.md](./facades-enhancement-checklist.md) | 檢查清單 | 追蹤進度 |
| 本文檔 | 快速參考 | 快速查閱 |

---

## 🎯 核心概念速查

### Facade 拆分模式

```
{module}/
├── {module}.facade.ts              # 主協調器 (Main Coordinator)
├── {module}-crud.facade.ts         # CRUD 操作
├── {module}-{feature1}.facade.ts   # 功能域 1
├── {module}-{feature2}.facade.ts   # 功能域 2
└── index.ts                        # 統一匯出
```

### 基礎方法標準

```typescript
// CRUD 操作
loadXXXs()                          // 加載所有
loadXXXById(id)                     // 按 ID 加載
loadXXXsByCondition(condition)      // 按條件加載
searchXXXs(query, options?)         // 搜索
createXXX(data)                     // 創建
updateXXX(id, data)                 // 更新
deleteXXX(id)                       // 刪除

// 選擇方法
selectXXX(item)                     // 選擇項目
```

### Signal 狀態管理

```typescript
// Private state (with State suffix)
private readonly itemsState = signal<XXX[]>([]);
private readonly selectedItemState = signal<XXX | null>(null);
private readonly loadingState = signal<boolean>(false);
private readonly errorState = signal<Error | null>(null);

// Public readonly signals
readonly items = this.itemsState.asReadonly();
readonly selectedItem = this.selectedItemState.asReadonly();
readonly loading = this.loadingState.asReadonly();
readonly error = this.errorState.asReadonly();
```

---

## 📝 程式碼模板

### 子 Facade 基礎模板

```typescript
import { inject, Injectable, signal } from '@angular/core';
import { type XXX, type XXXInsert, type XXXUpdate } from '@core';
import { XXXService } from '@shared';
import { BlueprintActivityService } from '@shared';

/**
 * XXX CRUD Facade
 * 
 * 負責 XXX 的基本 CRUD 操作
 * 
 * @module core/facades/{module}
 */
@Injectable({ providedIn: 'root' })
export class XXXCrudFacade {
  private readonly xxxService = inject(XXXService);
  private readonly activityService = inject(BlueprintActivityService);
  
  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);
  
  // Expose service signals
  readonly items = this.xxxService.items;
  readonly selectedItem = this.xxxService.selectedItem;
  readonly loading = this.xxxService.loading;
  readonly error = this.xxxService.error;
  
  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();
  
  /**
   * Load all items
   */
  async loadXXXs(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_xxxs');
    
    try {
      await this.xxxService.loadXXXs();
    } catch (error) {
      console.error('[XXXCrudFacade] Failed to load items:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  /**
   * Create new item
   */
  async createXXX(data: XXXInsert): Promise<XXX> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_xxx');
    
    try {
      const item = await this.xxxService.createXXX(data);
      
      // Log activity
      try {
        await this.activityService.logActivity(
          item.blueprint_id,
          'xxx',
          item.id,
          'created',
          [{ field: 'status', oldValue: null, newValue: item.status }],
          { xxxName: item.name }
        );
      } catch (error) {
        console.error('[XXXCrudFacade] Failed to log creation:', error);
      }
      
      return item;
    } catch (error) {
      console.error('[XXXCrudFacade] Failed to create item:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }
  
  /**
   * Select item
   */
  selectXXX(item: XXX | null): void {
    this.xxxService.selectXXX(item);
  }
}
```

### 主 Facade 協調器模板

```typescript
import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { type XXX } from '@core';
import { XXXCrudFacade } from './xxx-crud.facade';
import { XXXFeatureFacade } from './xxx-feature.facade';

/**
 * XXX Facade (Main Coordinator)
 * 
 * 主協調器，提供統一介面
 */
@Injectable({ providedIn: 'root' })
export class XXXFacade implements OnDestroy {
  // Inject sub-facades
  readonly crud = inject(XXXCrudFacade);
  readonly feature = inject(XXXFeatureFacade);
  
  // Facade-specific state
  private readonly currentXXXIdState = signal<string | null>(null);
  readonly currentXXXId = this.currentXXXIdState.asReadonly();
  
  // Expose sub-facade signals
  readonly items = this.crud.items;
  readonly selectedItem = this.crud.selectedItem;
  readonly loading = this.crud.loading;
  
  // Computed
  readonly currentXXX = computed(() => {
    const id = this.currentXXXId();
    if (!id) return null;
    return this.items().find(i => i.id === id) || null;
  });
  
  // Delegate to sub-facades
  async loadXXXs(): Promise<void> {
    return this.crud.loadXXXs();
  }
  
  async createXXX(data: any): Promise<XXX> {
    const item = await this.crud.createXXX(data);
    this.currentXXXIdState.set(item.id);
    return item;
  }
  
  selectXXX(item: XXX | null): void {
    this.crud.selectXXX(item);
    if (item) {
      this.currentXXXIdState.set(item.id);
    }
  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
```

---

## 🔍 常用命令速查

### 建立檔案
```bash
# Task Facade
touch src/app/core/facades/task/task-crud.facade.ts
touch src/app/core/facades/task/task-assignment.facade.ts

# Issue Facade
touch src/app/core/facades/issue/issue-crud.facade.ts
touch src/app/core/facades/issue/issue-assignment.facade.ts
```

### 檢查與測試
```bash
# Lint 檢查
yarn lint

# Build 測試
yarn build

# 單元測試
yarn test

# 統計行數
wc -l src/app/core/facades/task/task.facade.ts
```

---

## 📋 缺失方法速查表

### Task Facade
```typescript
// task-crud.facade.ts
async loadTasks(): Promise<void>
async searchTasks(query: string, options?: QueryOptions): Promise<Task[]>
async loadTasksByStatus(status: TaskStatus): Promise<Task[]>
async loadTasksByAssignee(assigneeId: string, assigneeType: 'user' | 'team' | 'org'): Promise<Task[]>
selectTask(task: Task | null): void
```

### Issue Facade
```typescript
// issue-crud.facade.ts
async searchIssues(query: string, options?: QueryOptions): Promise<Issue[]>
async loadIssuesByStatus(status: IssueStatus): Promise<Issue[]>
async loadIssuesByPriority(priority: IssuePriority): Promise<Issue[]>
async loadIssuesBySeverity(severity: IssueSeverity): Promise<Issue[]>
async loadIssuesByAssignee(assigneeId: string): Promise<Issue[]>
selectIssue(issue: Issue | null): void
```

### Quality Facade

#### QualityCheckFacade
```typescript
// quality-check.facade.ts
async loadQualityChecks(): Promise<void>
async loadQualityChecksByBlueprint(blueprintId: string): Promise<void>
async loadQualityChecksByStatus(status: string): Promise<void>
async searchQualityChecks(query: string, options?: QueryOptions): Promise<QualityCheckDetail[]>
async deleteQualityCheck(id: string): Promise<void>
selectQualityCheck(qc: QualityCheckDetail | null): void
```

#### QualityInspectionFacade
```typescript
// quality-inspection.facade.ts
async loadInspections(): Promise<void>
async loadInspectionsByBlueprint(blueprintId: string): Promise<void>
async loadInspectionsByType(type: string): Promise<void>
async searchInspections(query: string, options?: QueryOptions): Promise<InspectionDetail[]>
async deleteInspection(id: string): Promise<void>
selectInspection(inspection: InspectionDetail | null): void
```

### Document Facade
```typescript
// document-crud.facade.ts
async loadDocumentsByType(type: string): Promise<void>
async loadDocumentsByStatus(status: string): Promise<void>
selectDocument(doc: Document | null): void
```

---

## ⚠️ 注意事項

### ✅ 應該做的
1. **使用 Signal**: 所有狀態使用 Angular 20 Signals
2. **錯誤處理**: Try-catch 包裝所有異步操作
3. **活動日誌**: Create/Update/Delete 操作記錄活動
4. **向上拋出**: 錯誤不吃掉，向上拋出讓組件處理
5. **Finally 清理**: 在 finally 清理操作狀態

### ❌ 不應該做的
1. **直接依賴**: 子 Facade 之間不直接注入依賴
2. **吃掉錯誤**: 不在 catch 中吃掉錯誤
3. **具體實現**: 主 Facade 不包含具體實現邏輯
4. **忘記日誌**: CRUD 操作不忘記記錄活動

---

## 🎯 優先級排序

| 優先級 | Facade | 原因 | 預計時間 |
|--------|--------|------|---------|
| 🔴 最高 | Task Facade | 核心業務，使用頻繁 | 3-5 天 |
| 🔴 最高 | Issue Facade | 核心業務，使用頻繁 | 3-5 天 |
| 🔴 最高 | Quality Facade | 核心業務，缺失最多 | 4-6 天 |
| 🟡 高 | Document Facade | 常用功能 | 2-3 天 |
| 🟡 中 | Account Facade | 輔助功能 | 1-2 天 |
| 🟡 中 | Collaboration Facade | 輔助功能 | 1-2 天 |
| 🟡 中 | Communication Facade | 輔助功能 | 1-2 天 |
| 🟡 中 | Bot Facade | 輔助功能 | 1-2 天 |
| 🟢 低 | Analytics Facade | 特殊用途，可選 | 1 天 |
| 🟢 低 | System Facade | 特殊用途，可選 | 1 天 |

---

## 🔗 相關資源

### 參考實現
- **Blueprint Facade**: `src/app/core/facades/blueprint/`
  - `blueprint.facade.ts` - 主協調器範例
  - `blueprint-crud.facade.ts` - CRUD 範例 ⭐⭐⭐⭐⭐
  - `blueprint-branch.facade.ts` - 功能域範例
  - `blueprint-pr.facade.ts` - 功能域範例

### 架構文檔
- **架構流程圖**: `docs/27-完整架構流程圖.mermaid.md`
- **SQL 表結構**: `docs/22-完整SQL表結構定義.md`
- **開發規範**: `.copilot-instructions.md`

### 分析報告
- **Facades 分析**: `docs/facades-analysis-report.md`

---

## 💡 實用技巧

### 1. 快速統計檔案行數
```bash
# 統計單一檔案
wc -l src/app/core/facades/task/task.facade.ts

# 統計目錄下所有 .ts 檔案
find src/app/core/facades/task -name "*.ts" -exec wc -l {} + | sort -n
```

### 2. 快速找到特定方法
```bash
# 在 Task Facade 中找到所有 async 方法
grep -n "async " src/app/core/facades/task/task.facade.ts

# 找到所有 Signal 定義
grep -n "signal<" src/app/core/facades/task/task.facade.ts
```

### 3. 檢查 import 是否正確
```bash
# 檢查是否有未使用的 import
yarn lint src/app/core/facades/task/task-crud.facade.ts
```

### 4. 對比拆分前後的差異
```bash
# 查看 Git 差異
git diff src/app/core/facades/task/task.facade.ts
```

---

## 📞 尋求幫助

遇到問題時，按以下順序尋求解決：

1. **檢查參考實現**: `src/app/core/facades/blueprint/`
2. **查閱實施指南**: `facades-implementation-guide.md`
3. **檢查 Lint 錯誤**: `yarn lint`
4. **查看 TypeScript 錯誤**: IDE 提示
5. **諮詢團隊**: 技術討論區

---

**最後更新**: 2025-01-15  
**維護者**: 開發團隊
