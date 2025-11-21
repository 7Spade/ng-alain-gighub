# Facades 與 Repositories 基礎方法完整性增強計畫

> **建立日期**: 2025-01-15  
> **目標**: 使 Facades 層和 Repositories 層各部位基礎方法完整，讓開發更平順，符合企業化標準  
> **參考標準**: BlueprintCrudFacade（完整實現）

---

## 📋 總覽

### 專案目標
基於 `docs/facades-analysis-report.md` 的分析結果，系統性地增強各 Facade 的基礎方法，確保：
1. **完整性**：所有 Facade 具備完整的 CRUD 操作
2. **一致性**：遵循統一的方法命名和結構模式
3. **可維護性**：避免單一檔案過度肥大，採用模組化拆分
4. **企業標準**：符合 SOLID 原則和最佳實踐

### 參考架構模式

參考 `src/app/core/facades/blueprint` 的拆分模式：

```
blueprint/
├── blueprint.facade.ts           # 主協調器（Main Coordinator）
├── blueprint-crud.facade.ts      # CRUD 操作
├── blueprint-branch.facade.ts    # 分支管理
├── blueprint-pr.facade.ts        # Pull Request
├── blueprint-config.facade.ts    # 配置管理
├── blueprint-activity.facade.ts  # 活動日誌
└── index.ts                      # 統一匯出
```

### 核心設計原則

1. **Facade 拆分原則**：
   - 單一檔案不超過 500-800 行
   - 按功能域清晰拆分（CRUD、關聯管理、特殊操作）
   - 主 Facade 作為協調器，不包含具體實現
   - 子 Facade 負責特定功能域

2. **基礎方法標準**（參考 BlueprintCrudFacade）：
   ```typescript
   // CRUD 操作
   - loadAll() / loadXXXs()
   - loadById(id)
   - loadByCondition() (如 loadByStatus, loadByOwnerId)
   - search(query, options?)
   - create(data)
   - update(id, data)
   - delete(id)
   
   // 狀態管理 Signals
   - loading
   - error
   - items / xxxList
   - selectedItem / selectedXXX
   - operationInProgress
   - lastOperation
   
   // 選擇方法
   - select(item)
   - setCurrent(id)
   ```

3. **Signal 狀態管理**：
   - 所有狀態使用 Angular 20 Signals
   - 透過 `asReadonly()` 暴露給外部
   - 私有狀態使用 `State` 後綴命名
   - 計算屬性使用 `computed()`

4. **錯誤處理與日誌**：
   - 使用 ErrorStateService 統一錯誤處理
   - 使用 BlueprintActivityService 記錄活動
   - 操作失敗時保持狀態一致性

---

## 📊 需要增強的 Facades（優先級排序）

### 🔴 高優先級（核心業務模組）

#### 1. Task Facade ⭐⭐⭐⭐⭐
**現狀**: 單一檔案 task.facade.ts（約 800+ 行）  
**問題**: 
- 缺少 `loadTasks()` - 加載所有任務（無藍圖限制）
- 缺少 `searchTasks(query, options?)` - 搜索任務
- 缺少 `loadTasksByStatus(status)` - 按狀態加載
- 缺少 `loadTasksByAssignee(assigneeId)` - 按分配人加載
- 缺少 `selectTask(task)` - 選擇任務方法

**拆分計畫**:
```
task/
├── task.facade.ts              # 主協調器
├── task-crud.facade.ts         # CRUD 操作（待補充方法）
├── task-assignment.facade.ts   # 任務分配管理
├── task-list.facade.ts         # 任務列表管理
├── task-template.facade.ts     # 任務模板管理
├── task-dependency.facade.ts   # 依賴關係管理
└── index.ts
```

**待補充方法**:
```typescript
// task-crud.facade.ts
async loadTasks(): Promise<void>
async searchTasks(query: string, options?: QueryOptions): Promise<Task[]>
async loadTasksByStatus(status: TaskStatus): Promise<Task[]>
async loadTasksByAssignee(assigneeId: string, assigneeType: 'user' | 'team' | 'org'): Promise<Task[]>
selectTask(task: Task | null): void
```

---

#### 2. Issue Facade ⭐⭐⭐⭐⭐
**現狀**: 單一檔案 issue.facade.ts（約 600+ 行）  
**問題**:
- 缺少 `searchIssues(query, options?)` - 搜索問題
- 缺少 `loadIssuesByStatus(status)` - 按狀態加載
- 缺少 `loadIssuesByPriority(priority)` - 按優先級加載
- 缺少 `loadIssuesBySeverity(severity)` - 按嚴重程度加載
- 缺少 `loadIssuesByAssignee(assigneeId)` - 按分配人加載
- 缺少 `selectIssue(issue)` - 選擇問題方法

**拆分計畫**:
```
issue/
├── issue.facade.ts             # 主協調器
├── issue-crud.facade.ts        # CRUD 操作（待補充方法）
├── issue-assignment.facade.ts  # 問題分配管理
├── issue-tag.facade.ts         # 標籤管理
├── issue-sync.facade.ts        # 跨分支同步
└── index.ts
```

**待補充方法**:
```typescript
// issue-crud.facade.ts
async searchIssues(query: string, options?: QueryOptions): Promise<Issue[]>
async loadIssuesByStatus(status: IssueStatus): Promise<Issue[]>
async loadIssuesByPriority(priority: IssuePriority): Promise<Issue[]>
async loadIssuesBySeverity(severity: IssueSeverity): Promise<Issue[]>
async loadIssuesByAssignee(assigneeId: string): Promise<Issue[]>
selectIssue(issue: Issue | null): void
```

---

#### 3. Quality Facade ⭐⭐⭐⭐⭐
**現狀**: 單一檔案 quality.facade.ts（約 700+ 行）  
**問題**: 缺少大量基礎方法
- **Quality Check 缺少**:
  - `loadQualityChecks()` - 加載所有質檢
  - `loadQualityChecksByBlueprint(blueprintId)` - 按藍圖加載
  - `loadQualityChecksByStatus(status)` - 按狀態加載
  - `searchQualityChecks(query, options?)` - 搜索質檢
  - `deleteQualityCheck(id)` - 刪除質檢
  - `selectQualityCheck(qc)` - 選擇質檢
  
- **Inspection 缺少**:
  - `loadInspections()` - 加載所有檢查
  - `loadInspectionsByBlueprint(blueprintId)` - 按藍圖加載
  - `loadInspectionsByType(type)` - 按類型加載
  - `searchInspections(query, options?)` - 搜索檢查
  - `deleteInspection(id)` - 刪除檢查
  - `selectInspection(inspection)` - 選擇檢查

**拆分計畫**:
```
quality/
├── quality.facade.ts            # 主協調器
├── quality-check.facade.ts      # 品檢操作（待補充方法）
├── quality-inspection.facade.ts # 檢驗操作（待補充方法）
├── quality-photo.facade.ts      # 照片管理
└── index.ts
```

**待補充方法**:
```typescript
// quality-check.facade.ts
async loadQualityChecks(): Promise<void>
async loadQualityChecksByBlueprint(blueprintId: string): Promise<void>
async loadQualityChecksByStatus(status: string): Promise<void>
async searchQualityChecks(query: string, options?: QueryOptions): Promise<QualityCheckDetail[]>
async deleteQualityCheck(id: string): Promise<void>
selectQualityCheck(qc: QualityCheckDetail | null): void

// quality-inspection.facade.ts
async loadInspections(): Promise<void>
async loadInspectionsByBlueprint(blueprintId: string): Promise<void>
async loadInspectionsByType(type: string): Promise<void>
async searchInspections(query: string, options?: QueryOptions): Promise<InspectionDetail[]>
async deleteInspection(id: string): Promise<void>
selectInspection(inspection: InspectionDetail | null): void
```

---

#### 4. Document Facade ⭐⭐⭐⭐
**現狀**: 單一檔案 document.facade.ts  
**問題**:
- 缺少 `loadDocumentsByType(type)` - 按類型加載
- 缺少 `loadDocumentsByStatus(status)` - 按狀態加載
- 缺少 `selectDocument(doc)` - 選擇文檔方法

**拆分計畫**:
```
document/
├── document.facade.ts          # 主協調器
├── document-crud.facade.ts     # CRUD 操作（待補充方法）
├── document-version.facade.ts  # 版本管理
└── index.ts
```

**待補充方法**:
```typescript
// document-crud.facade.ts
async loadDocumentsByType(type: string): Promise<void>
async loadDocumentsByStatus(status: string): Promise<void>
selectDocument(doc: Document | null): void
```

---

### 🟡 中優先級（輔助業務模組）

#### 5. Account Facade ⭐⭐⭐
**問題**:
- 缺少 `searchAccounts(query, options?)` - 搜索帳戶
- 缺少 `selectAccount(account)` - 選擇帳戶方法

**拆分計畫**:
```
account/
├── account.facade.ts           # 主協調器
├── account-crud.facade.ts      # CRUD 操作（待補充方法）
├── account-organization.facade.ts # 組織管理
├── account-bot.facade.ts       # Bot 帳戶管理
└── index.ts
```

---

#### 6. Collaboration Facade ⭐⭐⭐
**問題**: 缺少基礎查詢和選擇方法

**拆分計畫**:
```
collaboration/
├── collaboration.facade.ts       # 主協調器
├── collaboration-crud.facade.ts  # CRUD 操作（待補充方法）
├── collaboration-invite.facade.ts # 邀請管理
└── index.ts
```

**待補充方法**:
```typescript
async loadCollaborations(): Promise<void>
async loadCollaborationsByBlueprint(blueprintId: string): Promise<void>
async loadCollaborationsByStatus(status: string): Promise<void>
async searchCollaborations(query: string, options?: QueryOptions): Promise<OrganizationCollaboration[]>
selectCollaboration(collab: OrganizationCollaboration | null): void
```

---

#### 7. Communication Facade ⭐⭐⭐
**問題**: 缺少搜索和選擇方法

**拆分計畫**:
```
communication/
├── communication.facade.ts      # 主協調器
├── communication-comment.facade.ts # 評論管理（待補充方法）
├── communication-notification.facade.ts # 通知管理
└── index.ts
```

**待補充方法**:
```typescript
async loadComments(): Promise<void>
async searchComments(query: string, options?: QueryOptions): Promise<Comment[]>
selectComment(comment: Comment | null): void
```

---

#### 8. Bot Facade ⭐⭐⭐
**問題**: 缺少搜索、按類型/狀態加載等方法

**拆分計畫**:
```
bot/
├── bot.facade.ts               # 主協調器
├── bot-crud.facade.ts          # CRUD 操作（待補充方法）
├── bot-task.facade.ts          # Bot 任務管理
├── bot-execution.facade.ts     # Bot 執行控制
└── index.ts
```

**待補充方法**:
```typescript
async loadBotById(id: string): Promise<Bot | null>
async searchBots(query: string, options?: QueryOptions): Promise<Bot[]>
async loadBotsByType(type: string): Promise<void>
async loadBotsByStatus(status: string): Promise<void>
selectBot(bot: Bot | null): void
```

---

### 🟢 低優先級（特殊用途，可選）

#### 9. Analytics Facade
**說明**: Analytics 是特殊用途 Facade，主要用於報表和分析，可能不需要完整 CRUD

**可選補充**:
```typescript
async searchActivityLogs(query: string, filters?: ActivityLogFilters): Promise<ActivityLog[]>
async searchProgressTracking(query: string): Promise<ProgressTracking[]>
```

---

#### 10. System Facade
**說明**: System 是特殊用途 Facade，主要用於系統設置，可能不需要完整 CRUD

**可選補充**:
```typescript
async searchSettings(query: string): Promise<Setting[]>
async searchFeatureFlags(query: string): Promise<FeatureFlag[]>
```

---

## 🔧 實施計畫

### Phase 1: 分析與規劃 ✅
- [x] 閱讀並理解 facades-analysis-report.md
- [x] 檢查 blueprint facade 作為參考標準
- [x] 確認現有 task、issue、quality facades 的結構
- [x] 在 docs/workspace 建立此工作文件

### Phase 2: Task Facade 拆分與增強（第一週）
1. **建立子 Facade 檔案**:
   - `task/task-crud.facade.ts` - 核心 CRUD 操作
   - `task/task-assignment.facade.ts` - 任務分配管理
   - `task/task-list.facade.ts` - 任務列表管理
   - `task/task-template.facade.ts` - 任務模板管理
   - `task/task-dependency.facade.ts` - 依賴關係管理

2. **遷移現有程式碼**:
   - 從 task.facade.ts 拆分程式碼到對應子 Facade
   - 保持 API 相容性

3. **補充缺失方法**:
   - 在 task-crud.facade.ts 補充基礎方法
   - 添加完整的 Signal 狀態管理
   - 添加錯誤處理和日誌記錄

4. **重構主 Facade**:
   - task.facade.ts 改為協調器模式
   - 注入所有子 Facade
   - 提供統一的對外介面

5. **更新匯出**:
   - 更新 task/index.ts 匯出所有 Facade

### Phase 3: Issue Facade 拆分與增強（第二週）
1. 建立子 Facade 檔案（issue-crud, issue-assignment, issue-tag, issue-sync）
2. 遷移現有程式碼
3. 補充缺失方法
4. 重構主 Facade
5. 更新匯出

### Phase 4: Quality Facade 拆分與增強（第三週）
1. 建立子 Facade 檔案（quality-check, quality-inspection, quality-photo）
2. 遷移現有程式碼
3. 補充缺失方法
4. 重構主 Facade
5. 更新匯出

### Phase 5: Document Facade 增強（第四週）
1. 建立子 Facade 檔案（document-crud, document-version）
2. 遷移現有程式碼
3. 補充缺失方法
4. 重構主 Facade
5. 更新匯出

### Phase 6: 其他 Facades 增強（第五-六週）
1. Account Facade
2. Collaboration Facade
3. Communication Facade
4. Bot Facade

### Phase 7: 測試與驗證（持續進行）
- 執行 `yarn lint` 檢查
- 執行 `yarn build` 測試
- 單元測試補充
- 程式碼審查
- 安全掃描

---

## 📐 實施規範

### 檔案命名規範
- 主 Facade: `{module}.facade.ts`
- 子 Facade: `{module}-{subdomain}.facade.ts`
- 匯出檔案: `index.ts`

### 程式碼結構規範
```typescript
import { Injectable, inject, signal, computed } from '@angular/core';

/**
 * {Module}{Subdomain}Facade
 * 
 * {簡短描述}
 * 
 * @example
 * ```typescript
 * const facade = inject({Module}{Subdomain}Facade);
 * await facade.loadXXX();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class {Module}{Subdomain}Facade {
  // 1. Dependencies
  private readonly service = inject(XXXService);
  
  // 2. Private signals (with State suffix)
  private readonly itemsState = signal<XXX[]>([]);
  private readonly loadingState = signal<boolean>(false);
  
  // 3. Public readonly signals
  readonly items = this.itemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  
  // 4. Computed signals
  readonly filteredItems = computed(() => /* ... */);
  
  // 5. Public methods (CRUD operations)
  async loadXXX(): Promise<void> { /* ... */ }
  async createXXX(data: XXXInsert): Promise<XXX> { /* ... */ }
  async updateXXX(id: string, data: XXXUpdate): Promise<XXX> { /* ... */ }
  async deleteXXX(id: string): Promise<void> { /* ... */ }
  
  // 6. Selection methods
  selectXXX(item: XXX | null): void { /* ... */ }
  
  // 7. Private helper methods
  private calculateChanges(): void { /* ... */ }
}
```

### 主 Facade 協調器模式
```typescript
@Injectable({ providedIn: 'root' })
export class {Module}Facade implements OnDestroy {
  // Inject sub-facades
  readonly crud = inject({Module}CrudFacade);
  readonly assignment = inject({Module}AssignmentFacade);
  
  // Expose sub-facade signals
  readonly items = this.crud.items;
  readonly loading = this.crud.loading;
  
  // Delegate to sub-facades
  async loadXXX(): Promise<void> {
    return this.crud.loadXXX();
  }
}
```

---

## 🎯 成功指標

1. **完整性**: 所有 Facade 具備完整的基礎方法
2. **一致性**: 所有 Facade 遵循統一的結構和命名
3. **可維護性**: 單一檔案不超過 500-800 行
4. **測試覆蓋**: 關鍵方法具備單元測試
5. **無破壞性變更**: 保持 API 相容性，不影響現有程式碼

---

## 📚 參考資料

- **分析報告**: `docs/facades-analysis-report.md`
- **參考實現**: `src/app/core/facades/blueprint/`
- **架構文檔**: `docs/27-完整架構流程圖.mermaid.md`
- **開發規範**: `.copilot-instructions.md`

---

**最後更新**: 2025-01-15  
**負責人**: 開發團隊  
**審查週期**: 每週
