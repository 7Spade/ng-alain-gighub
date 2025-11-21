# Services 層增強檢查清單

> **建立日期**: 2025-11-21  
> **優先級**: P0 (高優先級 - 業務邏輯層)  
> **預估工時**: 8-10 天

---

## 📋 目的

補充 Services 層（`shared/services/`）的基礎 CRUD 方法、Signals 狀態管理、搜索功能和重置方法。

## 🎯 總覽

### 主要工作
1. **補充CRUD方法**: 50+ 個基礎方法
2. **添加Signals**: 20+ 個狀態 Signals
3. **搜索方法**: 10 個 Service
4. **選擇方法**: 10 個 Service
5. **重置方法**: 8 個 Service

### 工作量
| 優先級 | Service數量 | 工時 |
|--------|------------|------|
| P0 高優先級 | 4 個 | 5-6 天 |
| P1 中優先級 | 5 個 | 3-4 天 |
| **總計** | **9 個** | **8-10 天** |

---

## 📝 待補充方法清單（按優先級）

### 🔴 P0: Task Service ⭐⭐⭐⭐⭐

**文件**: `shared/services/task/task.service.ts`

**缺少方法**:
- [ ] `loadTasks()` - 加載所有任務
- [ ] `searchTasks(query, options?)` - 搜索任務
- [ ] `loadTasksByStatus(status)` - 按狀態加載
- [ ] `loadTasksByAssignee(assigneeId)` - 按分配人加載
- [ ] `selectTask(task)` - 選擇任務
- [ ] `reset()` - 重置狀態

**代碼模板**:
```typescript
// 1. Signals
private readonly tasksState = signal<Task[]>([]);
readonly tasks = this.tasksState.asReadonly();

// 2. 加載方法
async loadTasks(): Promise<void> {
  this.loadingState.set(true);
  this.errorState.set(null);
  try {
    const tasks = await firstValueFrom(this.repository.findAll());
    this.tasksState.set(tasks);
  } catch (error) {
    this.errorState.set(error instanceof Error ? error.message : '加載失敗');
    throw error;
  } finally {
    this.loadingState.set(false);
  }
}

// 3. 搜索方法
async searchTasks(query: string, options?: QueryOptions): Promise<Task[]> {
  this.loadingState.set(true);
  try {
    return await firstValueFrom(this.repository.search(query, options));
  } catch (error) {
    this.errorState.set(error instanceof Error ? error.message : '搜索失敗');
    throw error;
  } finally {
    this.loadingState.set(false);
  }
}

// 4. 選擇方法
selectTask(task: Task | null): void {
  this.selectedTaskState.set(task);
}

// 5. 重置方法
reset(): void {
  this.tasksState.set([]);
  this.selectedTaskState.set(null);
  this.errorState.set(null);
}
```

**檢查清單**:
- [ ] 所有方法實現完成
- [ ] Signals 添加完成
- [ ] 單元測試添加
- [ ] 文檔註釋完整

**預估工時**: 1.5 天

---

### 🔴 P0: Issue Service ⭐⭐⭐⭐⭐

**文件**: `shared/services/issue/issue.service.ts`

**缺少方法**:
- [ ] `loadIssues()` - 加載所有問題
- [ ] `searchIssues(query, options?)` - 搜索問題
- [ ] `loadIssuesByStatus(status)` - 按狀態加載
- [ ] `loadIssuesByPriority(priority)` - 按優先級加載
- [ ] `loadIssuesBySeverity(severity)` - 按嚴重程度加載
- [ ] `loadIssuesByAssignee(assigneeId)` - 按分配人加載
- [ ] `selectIssue(issue)` - 選擇問題

**預估工時**: 1.5 天

---

### 🔴 P0: Quality Check Service ⭐⭐⭐⭐⭐

**文件**: `shared/services/quality/quality-check.service.ts`

**缺少方法** + **Signals**:
- [ ] Signals: `qualityChecks`, `selectedQualityCheck`
- [ ] `loadQualityChecks()` - 加載所有質檢
- [ ] `loadQualityChecksByTask(taskId)` - 按任務加載
- [ ] `loadQualityChecksByBlueprint(blueprintId)` - 按藍圖加載
- [ ] `loadQualityChecksByStatus(status)` - 按狀態加載
- [ ] `searchQualityChecks(query, options?)` - 搜索質檢
- [ ] `selectQualityCheck(qc)` - 選擇質檢
- [ ] `reset()` - 重置狀態

**預估工時**: 2 天

---

### 🔴 P0: Inspection Service ⭐⭐⭐⭐⭐

**文件**: `shared/services/quality/inspection.service.ts`

**缺少方法**:
- [ ] `loadInspections()` - 加載所有檢查
- [ ] `loadInspectionsByBlueprint(blueprintId)` - 按藍圖加載
- [ ] `searchInspections(query, options?)` - 搜索檢查
- [ ] `selectInspection(inspection)` - 選擇檢查
- [ ] `reset()` - 重置狀態（現有 `clear()`，需重命名）

**預估工時**: 1.5 天

---

### 🟡 P1: Account Service ⭐⭐⭐

**缺少方法**:
- [ ] `searchAccounts(query, options?)` - 搜索帳戶

**預估工時**: 0.5 天

---

### 🟡 P1: Document Service ⭐⭐⭐

**缺少方法**:
- [ ] `loadDocuments()` - 加載所有文檔
- [ ] `loadDocumentsByType(type)` - 按類型加載
- [ ] `selectDocument(doc)` - 選擇文檔
- [ ] `reset()` - 重置狀態

**預估工時**: 1 天

---

### 🟡 P1: Comment Service ⭐⭐⭐

**缺少方法** + **Signals**:
- [ ] Signals: `selectedComment`
- [ ] `loadComments()` - 加載所有評論
- [ ] `searchComments(query, options?)` - 搜索評論
- [ ] `selectComment(comment)` - 選擇評論
- [ ] `reset()` - 重置狀態（現有 `clear()`，需重命名）

**預估工時**: 1 天

---

### 🟡 P1: Bot Service ⭐⭐⭐

**缺少方法**:
- [ ] `searchBots(query, options?)` - 搜索機器人
- [ ] `loadBotsByType(type)` - 按類型加載
- [ ] `loadBotsByStatus(status)` - 按狀態加載
- [ ] `selectBot(bot)` - 選擇機器人
- [ ] `reset()` - 重置狀態

**預估工時**: 1 天

---

### 🟡 P1: Collaboration Service ⭐⭐⭐

**缺少方法**:
- [ ] `loadCollaborationsByStatus(status)` - 按狀態加載
- [ ] `searchCollaborations(query, options?)` - 搜索協作
- [ ] `reset()` - 重置狀態

**預估工時**: 0.5 天

---

## 📋 實施步驟

### Week 1: P0 高優先級 (5-6 天)

**Day 1-2**: Task Service
- [ ] 實現 6 個方法
- [ ] 添加單元測試

**Day 3-4**: Issue Service
- [ ] 實現 7 個方法
- [ ] 添加單元測試

**Day 5-6**: Quality Check & Inspection Services
- [ ] Quality Check Service - 8 個方法 + Signals
- [ ] Inspection Service - 5 個方法
- [ ] 添加單元測試

### Week 2: P1 中優先級 (3-4 天)

**Day 7**: Account & Document Services
- [ ] Account Service - 1 個方法
- [ ] Document Service - 4 個方法
- [ ] 添加單元測試

**Day 8-9**: Comment & Bot Services
- [ ] Comment Service - 4 個方法 + Signals
- [ ] Bot Service - 5 個方法
- [ ] 添加單元測試

**Day 10**: Collaboration Service & 驗證
- [ ] Collaboration Service - 3 個方法
- [ ] 整體驗證測試
- [ ] 代碼審查

---

## ✅ 驗證檢查清單

### Signals 檢查
- [ ] 所有狀態使用私有 Signal（`xxxState`）
- [ ] 所有公開 Signal 使用 `asReadonly()`
- [ ] Computed Signals 正確使用 `computed()`

### 方法檢查
- [ ] 所有 async 方法正確處理 Promise
- [ ] 錯誤處理統一使用 ErrorStateService
- [ ] Loading 狀態正確管理

### 測試檢查
- [ ] 單元測試覆蓋率 > 80%
- [ ] 測試 Signals 狀態變化
- [ ] 測試錯誤處理

---

## 📊 進度追蹤

### P0 進度
- [ ] Task Service (0/6)
- [ ] Issue Service (0/7)
- [ ] Quality Check Service (0/8)
- [ ] Inspection Service (0/5)

**總進度**: 0/26 (0%)

### P1 進度
- [ ] Account Service (0/1)
- [ ] Document Service (0/4)
- [ ] Comment Service (0/4)
- [ ] Bot Service (0/5)
- [ ] Collaboration Service (0/3)

**總進度**: 0/17 (0%)

### 總體進度
**完成度**: 0/43 (0%)

---

## 📚 參考文檔

- [Services 層基礎方法完整性分析報告](../archive/services-analysis-report.md)
- [五層架構增強總計劃](./five-layer-architecture-enhancement-plan.md)
- Blueprint Service: `src/app/shared/services/blueprint/blueprint.service.ts`

---

**最後更新**: 2025-11-21  
**狀態**: 📋 待開始
