# Repositories 層增強檢查清單

> **建立日期**: 2025-11-21  
> **文檔類型**: 企業級工作檢查清單  
> **優先級**: P0 (高優先級 - 數據訪問層)  
> **預估工時**: 5-7 天

---

## 📋 目的 (Purpose)

本文檔提供 Repositories 層（`core/infra/repositories/`）的詳細增強檢查清單，確保所有 Repository 具備完整的基礎方法，特別是搜索功能。

## 👥 目標讀者 (Audience)

- 前端開發者  
- 架構師  
- AI Agents

---

## 🎯 總覽

### 背景

所有 Repository 都繼承自 `BaseRepository`，自動獲得基礎 CRUD 方法。但許多Repository 缺少：
- 搜索方法（`search()`）
- 按特定條件查詢方法（如 `findActive()`）

### 目標

- ✅ 為 10 個主表 Repository 補充搜索方法
- ✅ 補充常用的按條件查詢方法
- ✅ 統一錯誤處理和日誌記錄

### 工作量統計

| 優先級 | Repository數量 | 預估工時 |
|--------|--------------|---------|
| P0 高優先級 | 5 個 | 3-4 天 |
| P1 中優先級 | 5 個 | 2-3 天 |
| **總計** | **10 個** | **5-7 天** |

---

## 📝 待補充方法清單

### 🔴 P0: 高優先級 Repository

#### 1. Task Repository ⭐⭐⭐⭐⭐

**文件**: `core/infra/repositories/task/task.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索任務（按標題、描述）

**工作項**:
```typescript
/**
 * 搜索任務（支持模糊查詢）
 * 
 * @param query 搜索關鍵詞 - 用於搜索任務標題和描述
 * @param options 查詢選項 - 包含排序、分頁等配置
 * @returns Observable<Task[]> - 返回匹配的任務列表
 * @throws Error - 當查詢失敗時拋出錯誤
 */
search(query: string, options?: QueryOptions): Observable<Task[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`title.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 應用排序
  if (options?.orderBy) {
    const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    searchQuery = searchQuery.order(snakeOrderBy, {
      ascending: options.orderDirection !== 'desc'
    });
  } else {
    searchQuery = searchQuery.order('created_at', { ascending: false });
  }

  // 應用分頁
  if (options?.page && options?.pageSize) {
    const fromIndex = (options.page - 1) * options.pageSize;
    const toIndex = fromIndex + options.pageSize - 1;
    searchQuery = searchQuery.range(fromIndex, toIndex);
  }

  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Task>(item)) : [];
    })
  );
}
```

**檢查清單**:
- [x] 方法實現完成 - ✅ 2025-01-21
- [x] 支持標題和描述模糊查詢 - ✅ 使用 ilike 和 or 操作符
- [x] 支持排序和分頁 - ✅ 完整實現
- [ ] 添加單元測試
- [x] 添加 JSDoc 註釋 - ✅ 完整 JSDoc
- [x] 編譯無錯誤 - ✅ 構建成功
- [x] Lint 檢查通過 - ✅ 僅有與現有代碼一致的 any 警告

**預估工時**: 0.5 天  
**實際工時**: 0.5 天  
**完成日期**: 2025-01-21

---

#### 2. Issue Repository ⭐⭐⭐⭐⭐

**文件**: `core/infra/repositories/issue/issue.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索問題（按標題、描述）

**實施步驟**: 同 Task Repository，替換為 Issue 類型

**檢查清單**:
- [x] 方法實現完成 - ✅ 2025-01-21
- [x] 支持標題和描述模糊查詢 - ✅ 使用 ilike 和 or 操作符
- [x] 支持排序和分頁 - ✅ 完整實現
- [ ] 添加單元測試
- [x] 添加 JSDoc 註釋 - ✅ 完整 JSDoc

**預估工時**: 0.5 天  
**實際工時**: 0.5 天  
**完成日期**: 2025-01-21

---

#### 3. Document Repository ⭐⭐⭐⭐

**文件**: `core/infra/repositories/document/document.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索文檔（按標題、文件名、描述）
- [ ] `findByBlueprintId(blueprintId, options?)` - 按藍圖加載

**工作項**:
```typescript
/**
 * 根據藍圖 ID 查詢文檔
 */
findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Document[]> {
  return this.findAll({
    ...options,
    filters: {
      ...options?.filters,
      blueprintId // 會自動轉換為 blueprint_id
    }
  });
}

/**
 * 搜索文檔（支持模糊查詢）
 */
search(query: string, options?: QueryOptions): Observable<Document[]> {
  if (!query || query.trim().length === 0) {
    return of([]);
  }

  const trimmedQuery = query.trim();
  let searchQuery = this.supabase
    .from(this.tableName as any)
    .select(options?.select || '*')
    .or(`title.ilike.%${trimmedQuery}%,file_name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);

  // 只搜索未刪除的文檔
  searchQuery = searchQuery.is('soft_deleted_at', null);

  // 應用排序和分頁（同Task Repository）...
  
  return from(searchQuery as unknown as Promise<PostgrestResponse<any>>).pipe(
    map((response: PostgrestResponse<any>) => {
      const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
      return Array.isArray(data) ? data.map(item => toCamelCaseData<Document>(item)) : [];
    })
  );
}
```

**檢查清單**:
- [x] `findByBlueprintId` 實現完成 - ✅ 2025-01-21
- [x] `search` 方法實現完成 - ✅ 2025-01-21
- [x] 支持標題、文件名、描述查詢 - ✅ 使用 ilike 和 or 操作符
- [x] 過濾軟刪除文檔 - ✅ 使用 is('soft_deleted_at', null)
- [ ] 添加單元測試

**預估工時**: 1 天  
**實際工時**: 0.5 天  
**完成日期**: 2025-01-21

---

#### 4. QualityCheck Repository ⭐⭐⭐⭐

**文件**: `core/infra/repositories/quality/quality-check.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索質檢記錄（按備註、檢查結果）
- [ ] `findByBlueprintId(blueprintId, options?)` - 按藍圖加載（需要通過 task 關聯）

**注意**: `findByBlueprintId` 需要 JOIN 查詢，建議在 Service 層實現或使用數據庫 RPC 函數。

**檢查清單**:
- [x] `search` 方法實現完成 - ✅ 2025-01-21
- [x] 考慮 `findByBlueprintId` 實現方案 - ✅ 決定在 Service 層實現（需要 JOIN）
- [ ] 添加單元測試

**預估工時**: 0.5 天  
**實際工時**: 0.25 天  
**完成日期**: 2025-01-21

---

#### 5. Inspection Repository ⭐⭐⭐⭐

**文件**: `core/infra/repositories/quality/inspection.repository.ts`

**缺少方法**:
- [x] `search(query, options?)` - 搜索檢查記錄 - ✅ 已實現
- [ ] `findByBlueprintId(blueprintId, options?)` - 按藍圖加載（Service 層實現）
- [x] `findByInspectionType(type, options?)` - 按檢查類型加載 - ✅ 已實現

**實施步驟**: 同 QualityCheck Repository

**檢查清單**:
- [x] `search` 方法實現完成 - ✅ 2025-01-21
- [x] `findByInspectionType` 方法實現完成 - ✅ 2025-01-21
- [x] 考慮 `findByBlueprintId` 實現方案 - ✅ 決定在 Service 層實現（需要 JOIN）
- [ ] 添加單元測試

**預估工時**: 0.5 天  
**實際工時**: 0.25 天  
**完成日期**: 2025-01-21

---

### 🟡 P1: 中優先級 Repository

#### 6. Comment Repository ⭐⭐⭐

**文件**: `core/infra/repositories/communication/comment.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索評論（按內容）

**預估工時**: 0.5 天

---

#### 7. Bot Repository ⭐⭐⭐

**文件**: `core/infra/repositories/bot/bot.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索機器人（按名稱、描述）
- [ ] `findByStatus(status, options?)` - 按狀態查詢

**預估工時**: 0.5 天

---

#### 8. OrganizationCollaboration Repository ⭐⭐⭐

**文件**: `core/infra/repositories/collaboration/organization-collaboration.repository.ts`

**缺少方法**:
- [ ] `findActive(options?)` - 查詢活躍的協作

**工作項**:
```typescript
/**
 * 查詢活躍的協作關係（狀態為 active）
 */
findActive(options?: QueryOptions): Observable<OrganizationCollaboration[]> {
  return this.findByStatus(CollaborationStatus.ACTIVE, options);
}
```

**預估工時**: 0.25 天

---

#### 9. BlueprintBranch Repository ⭐⭐

**文件**: `core/infra/repositories/blueprint/blueprint-branch.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索分支（可選）

**預估工時**: 0.5 天

---

#### 10. PullRequest Repository ⭐⭐

**文件**: `core/infra/repositories/blueprint/blueprint-pull-request.repository.ts`

**缺少方法**:
- [ ] `search(query, options?)` - 搜索 PR（可選）

**預估工時**: 0.5 天

---

## 📋 實施步驟

### Phase 1: 高優先級 Repository（3-4 天）

#### Day 1: Task & Issue Repository
- [x] Task Repository - 實現 `search()` 方法 - ✅ 2025-01-21
- [x] Issue Repository - 實現 `search()` 方法 - ✅ 2025-01-21
- [ ] 添加單元測試
- [ ] 代碼審查

#### Day 2-3: Document, QualityCheck, Inspection Repository
- [x] Document Repository - 實現 `search()` 和 `findByBlueprintId()` - ✅ 2025-01-21
- [x] QualityCheck Repository - 實現 `search()` - ✅ 2025-01-21
- [x] Inspection Repository - 實現 `search()` 和 `findByInspectionType()` - ✅ 2025-01-21
- [ ] 添加單元測試
- [ ] 代碼審查

### Phase 2: 中優先級 Repository（2-3 天）

#### Day 4-5: 其他 Repository
- [ ] Comment Repository - 實現 `search()`
- [ ] Bot Repository - 實現 `search()` 和 `findByStatus()`
- [ ] OrganizationCollaboration Repository - 實現 `findActive()`
- [ ] BlueprintBranch Repository - 實現 `search()`（可選）
- [ ] PullRequest Repository - 實現 `search()`（可選）
- [ ] 添加單元測試
- [ ] 代碼審查

### Phase 3: 驗證與測試（0.5 天）

- [ ] 運行 `yarn build` - 確認編譯無錯誤
- [ ] 運行 `yarn lint` - 確認無 ESLint 錯誤
- [ ] 運行 `yarn test` - 確認所有測試通過
- [ ] 代碼覆蓋率檢查（目標 > 80%）
- [ ] 性能測試（搜索響應時間 < 500ms）

---

## ✅ 驗證檢查清單

### 代碼實現檢查
- [ ] 所有搜索方法支持模糊查詢
- [ ] 所有搜索方法支持排序
- [ ] 所有搜索方法支持分頁
- [ ] 空查詢返回空陣列（不是錯誤）
- [ ] 錯誤處理統一使用 `handleSupabaseResponse`
- [ ] 數據轉換使用 `toCamelCaseData`

### 單元測試檢查
- [ ] 測試正常搜索場景
- [ ] 測試空查詢場景
- [ ] 測試排序功能
- [ ] 測試分頁功能
- [ ] 測試錯誤處理
- [ ] 測試覆蓋率 > 80%

### 性能檢查
- [ ] 搜索查詢使用索引
- [ ] 避免 N+1 查詢問題
- [ ] 分頁查詢正確使用 range
- [ ] 響應時間 < 500ms

---

## 📊 進度追蹤

### P0 高優先級進度
- [x] Task Repository (1/1) - ✅ search() 方法已實現 (2025-01-21)
- [x] Issue Repository (1/1) - ✅ search() 方法已實現 (2025-01-21)
- [x] Document Repository (2/2) - ✅ search() 和 findByBlueprintId() 已實現 (2025-01-21)
- [x] QualityCheck Repository (1/1) - ✅ search() 方法已實現 (2025-01-21)
- [x] Inspection Repository (2/2) - ✅ search() 和 findByInspectionType() 已實現 (2025-01-21)

**總進度**: 7/7 (100%) ✅ **P0 完成**

### P1 中優先級進度
- [ ] Comment Repository (0/1)
- [ ] Bot Repository (0/2)
- [ ] OrganizationCollaboration Repository (0/1)
- [ ] BlueprintBranch Repository (0/1)
- [ ] PullRequest Repository (0/1)

**總進度**: 0/6 (0%)

### 總體進度
**完成度**: 7/13 (53.8%) - 🎉 **P0 完成！**

---

## 📚 參考文檔

### 分析報告
- [Repositories 層基礎方法完整性分析報告](../archive/repositories-analysis-report.md)

### 工作計劃
- [五層架構增強總計劃](./five-layer-architecture-enhancement-plan.md)

### 參考實現
- Blueprint Repository: `src/app/core/infra/repositories/blueprint/blueprint.repository.ts`
- BaseRepository: `src/app/core/infra/repositories/base/base.repository.ts`

### 數據庫結構
- [完整 SQL 表結構定義](../reference/22-完整SQL表結構定義.md)

---

**最後更新**: 2025-01-21  
**負責人**: GitHub Copilot Agent  
**狀態**: 🎉 P0 完成 (7/13, 53.8%) - P1 待開始
