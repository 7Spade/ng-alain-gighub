# ⚠️ 問題追蹤系統 - 任務追蹤

> 📋 **目的**：追蹤問題追蹤系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M6（模組 6）  
**資料表數量**：4 張

---

## 📊 模組資訊

### 資料表清單

1. **issues** - 問題主表（施工異常問題追蹤）
2. **issue_assignments** - 問題指派表
3. **issue_photos** - 問題照片表
4. **issue_sync_logs** - 問題同步記錄表（跨分支問題即時同步至主分支）

### 模組狀態

- **目前狀態**：🚧 基礎架構完成，業務邏輯待實作
- **完成度**：約 55%（基礎層完成，業務邏輯和 UI 功能待開發）
- **近期里程碑**：里程碑 8（2025-04-15）
- **主要阻塞**：需任務資料 + 即時同步策略

### 開發進度統計

- **數據層**：✅ 100% 完成（4/4 Repository）
- **數據模型層**：✅ 100% 完成（issue.models.ts, issue.types.ts）
- **服務層**：✅ 80% 完成（IssueService 已實現，IssueSyncService 功能整合在 IssueFacade）
- **Facade 層**：✅ 100% 完成（IssueFacade 包含跨分支同步功能）
- **UI 層**：🚧 30% 完成（骨架頁面已建立，功能待實作）
- **業務邏輯**：⏳ 30% 完成（基礎功能完成，即時同步機制待完善）

---

## 📋 任務清單

### 數據層與服務層

#### Core 層（Infrastructure）

創建 issue.types.ts（Issue 狀態、優先級、嚴重程度）[✅已完成]
IssueStatus 枚舉定義（open, in_progress, resolved, closed, reopened）[✅已完成]
IssuePriority 枚舉定義（low, medium, high, critical）[✅已完成]
IssueSeverity 枚舉定義（minor, moderate, major, critical）[✅已完成]
IssuePhotoType 枚舉定義（discovery, before_fix, after_fix）[✅已完成]
IssueSyncStatus 枚舉定義（pending, in_progress, success, failed）[✅已完成]
IssueRepository 實施（core/infra/repositories/issue.repository.ts）[✅已完成]
IssueRepository 查詢方法（findByBlueprintId, findByBranchId, findByTaskId, findSyncedToMain）[✅已完成]
IssueAssignmentRepository 實施（core/infra/repositories/issue-assignment.repository.ts）[✅已完成]
IssueAssignmentRepository 查詢方法（findByIssueId）[✅已完成]
IssuePhotoRepository 實施（core/infra/repositories/issue-photo.repository.ts）[✅已完成]
IssuePhotoRepository 查詢方法（findByIssueId）[✅已完成]
IssueSyncLogRepository 實施（core/infra/repositories/issue-sync-log.repository.ts）[✅已完成]
IssueSyncLogRepository 查詢方法（findByIssueId）[✅已完成]
更新 core/infra/repositories/index.ts 導出所有 Issue Repository[✅已完成]

#### Shared 層（Models & Services）

數據模型層（shared/models/issue.models.ts）[✅已完成]
Issue 類型定義（Issue, IssueInsert, IssueUpdate）[✅已完成]
IssueAssignment 類型定義（IssueAssignment, IssueAssignmentInsert, IssueAssignmentUpdate）[✅已完成]
IssuePhoto 類型定義（IssuePhoto, IssuePhotoInsert, IssuePhotoUpdate）[✅已完成]
IssueSyncLog 類型定義（IssueSyncLog, IssueSyncLogInsert, IssueSyncLogUpdate）[✅已完成]
IssueDetail 介面定義（聚合指派、照片、同步紀錄）[✅已完成]
更新 shared/models/index.ts 導出 Issue 模型[✅已完成]
IssueService 實施（shared/services/issue/issue.service.ts）[✅已完成]
IssueService Signals 狀態管理[✅已完成]
IssueService CRUD 操作（createIssue, updateIssue, deleteIssue, loadIssuesByBlueprint）[✅已完成]
IssueService 查詢方法（loadIssuesByBranch, loadIssuesByTask, loadIssueById）[✅已完成]
IssueService 指派管理（assignIssue, unassignIssue）[✅已完成]
IssueService 照片管理（addPhoto, removePhoto）[✅已完成]
IssueService 同步功能（syncIssueToMain）[✅已完成]
IssueService Computed signals（openIssues, criticalIssues）[✅已完成]
更新 shared/services/issue/index.ts 導出 IssueService[✅已完成]

#### Core 層（Facade）

IssueFacade 實施（core/facades/issue.facade.ts）[✅已完成]
IssueFacade Signals 狀態管理[✅已完成]
IssueFacade CRUD 操作（createIssue, updateIssue, deleteIssue）[✅已完成]
IssueFacade 指派管理（assignIssue, unassignIssue）[✅已完成]
IssueFacade 標籤管理（addTag, removeTag）[✅已完成]
IssueFacade 跨分支同步（syncToMainBranch）[✅已完成]
IssueFacade 過濾功能（按狀態、優先級、嚴重程度、指派人）[✅已完成]
IssueFacade Computed signals（openIssues, closedIssues, criticalIssues, highPriorityIssues）[✅已完成]
IssueFacade 統計功能（issuesByStatus, issuesBySeverity, issueStats）[✅已完成]
IssueFacade 活動記錄整合（BlueprintActivityService）[✅已完成]
IssueFacade 錯誤處理整合（ErrorStateService）[✅已完成]
更新 core/index.ts 導出 IssueFacade[✅已完成]

#### 業務功能實現

問題追蹤流程實現（開立→指派→處理→解決→關閉）[⏳待開始]
跨分支即時同步機制完善（Realtime 訂閱、即時更新）[🚧進行中]
與任務系統同步（任務關聯、狀態同步）[⏳待開始]
問題照片上傳功能（Storage API 整合）[⏳待開始]
問題通知機制（Edge Function 通知）[⏳待開始]

#### 權限與安全

RLS 權限驗證（issues 表）[⏳待開始]
RLS 權限驗證（issue_assignments 表）[⏳待開始]
RLS 權限驗證（issue_photos 表）[⏳待開始]
RLS 權限驗證（issue_sync_logs 表）[⏳待開始]

### 頁面組件開發

#### 路由骨架（2025-11-14 完成）

問題列表頁面骨架（routes/issues/list/issue-list.component.ts）[✅已完成]
問題創建表單頁面骨架（routes/issues/form/issue-form.component.ts）[✅已完成]
問題詳情頁面骨架（routes/issues/detail/issue-detail.component.ts）[✅已完成]
問題詳情靜態頁面骨架（routes/issues/detail-static/issue-detail-static.component.ts）[✅已完成]
問題處理中心頁面骨架（routes/issues/handle-center/issue-handle-center.component.ts）[✅已完成]
問題處理頁面骨架（routes/issues/handle/issue-handle.component.ts）[✅已完成]
問題指派頁面骨架（routes/issues/assignments/issue-assignments.component.ts）[✅已完成]
問題照片頁面骨架（routes/issues/photos/issue-photos.component.ts）[✅已完成]
問題照片牆頁面骨架（routes/issues/photos-wall/issue-photos-wall.component.ts）[✅已完成]
問題關閉頁面骨架（routes/issues/close/issue-close.component.ts）[✅已完成]
問題關閉摘要頁面骨架（routes/issues/close-summary/issue-close-summary.component.ts）[✅已完成]
同步日誌頁面骨架（routes/issues/sync-logs/sync-logs.ts）[✅已完成]
同步日誌頁面單元測試（sync-logs.spec.ts）[✅已完成]
更新 routes/issues/routes.ts 路由配置[✅已完成]

#### 功能實作（待開發）

問題列表頁面功能實作（整合 IssueFacade）[⏳待開始]
問題創建表單頁面功能實作（問題創建表單）[⏳待開始]
問題詳情頁面功能實作（詳情顯示、狀態管理）[⏳待開始]
問題詳情靜態頁面功能實作（唯讀詳情顯示）[⏳待開始]
問題處理中心頁面功能實作（問題處理工作區）[⏳待開始]
問題處理頁面功能實作（問題處理表單）[⏳待開始]
問題指派頁面功能實作（指派管理）[⏳待開始]
問題照片頁面功能實作（照片上傳、查看）[⏳待開始]
問題照片牆頁面功能實作（照片牆展示）[⏳待開始]
問題關閉頁面功能實作（問題關閉流程）[⏳待開始]
問題關閉摘要頁面功能實作（關閉摘要顯示）[⏳待開始]
同步日誌頁面功能實作（同步記錄查詢與顯示）[🚧進行中]

### 測試

#### 單元測試

IssueService 單元測試[⏳待開始]
IssueFacade 單元測試[⏳待開始]
IssueRepository 單元測試[⏳待開始]
IssueAssignmentRepository 單元測試[⏳待開始]
IssuePhotoRepository 單元測試[⏳待開始]
IssueSyncLogRepository 單元測試[⏳待開始]
問題追蹤組件單元測試（IssueListComponent, IssueFormComponent 等）[⏳待開始]

#### 集成測試

問題創建流程集成測試[⏳待開始]
問題指派流程集成測試[⏳待開始]
問題同步流程集成測試[⏳待開始]
問題照片上傳集成測試[⏳待開始]

#### E2E 測試

問題追蹤流程 E2E 測試[⏳待開始]
跨分支同步 E2E 測試[⏳待開始]
問題處理流程 E2E 測試[⏳待開始]

### 文檔

API 文檔更新（問題追蹤系統 API 文檔）[⏳待開始]
用戶指南更新（問題追蹤用戶指南）[⏳待開始]
問題處理操作指南[⏳待開始]
跨分支同步機制文檔[⏳待開始]

---

## 📅 開發歷程

### 2025-11-14：路由骨架建立

- ✅ **全站路由骨架鋪設**：依據 `app-data.json` 建立 issues 模組的路由與頁面骨架
- ✅ 創建 12 個 Standalone Components（IssueListComponent, IssueFormComponent, IssueDetailComponent 等）
- ✅ 所有頁面採用 `page-header + nz-card + nz-alert + nz-empty` 模板
- ✅ 更新 `src/app/routes/routes.ts`，主框架可導航至所有菜單節點

### 2025-01-15：基礎架構完成

- ✅ **Core 層類型定義**：創建 `issue.types.ts`（Issue 狀態、優先級、嚴重程度、照片類型、同步狀態）
- ✅ **Repository 層實施**：完成 4 個 Repository（IssueRepository, IssueAssignmentRepository, IssuePhotoRepository, IssueSyncLogRepository）
- ✅ **數據模型層實施**：創建 `shared/models/issue.models.ts`（包含所有 4 張表的類型定義）
- ✅ **Service 層實施**：完成 `IssueService`（Signals 狀態管理、CRUD 操作、查詢方法、同步功能）
- ✅ **Facade 層實施**：完成 `IssueFacade`（跨分支同步、過濾、統計、活動記錄整合）
- ✅ **UI 層骨架**：完成路由骨架和基本頁面結構

### 待開發階段

- ⏳ **業務功能實現**：問題追蹤流程、與任務系統同步、問題照片上傳
- ⏳ **即時同步機制完善**：Realtime 訂閱、即時更新
- ⏳ **RLS 權限驗證**：4 張表的 RLS 策略
- ⏳ **問題通知機制**：Edge Function 通知

---

## 📝 備註

### 已完成功能

1. **基礎架構**：
   - ✅ 完整的 Repository 層（4 個 Repository）
   - ✅ 完整的數據模型層（4 張表的類型定義）
   - ✅ 完整的 Service 層（IssueService，基礎功能已實現）
   - ✅ 完整的 Facade 層（IssueFacade，包含跨分支同步功能）
   - ✅ 路由骨架和頁面結構（12 個組件骨架）

2. **技術特點**：
   - ✅ 使用 Signals 管理狀態
   - ✅ 暴露 ReadonlySignal 給組件
   - ✅ 完整的 TypeScript 類型定義
   - ✅ 自動 snake_case ↔ camelCase 轉換
   - ✅ 跨分支同步功能（syncToMainBranch）
   - ✅ Computed signals（openIssues, criticalIssues, highPriorityIssues）
   - ✅ 活動記錄整合（BlueprintActivityService）
   - ✅ 錯誤處理整合（ErrorStateService）

### 下一步行動

1. **優先級 P0（必須完成）**：
   - 實施 RLS 權限驗證（4 張表）
   - 完善即時同步機制（Realtime 訂閱）
   - 實現問題照片上傳功能（Storage API 整合）

2. **優先級 P1（重要功能）**：
   - 實現問題追蹤流程（開立→指派→處理→解決→關閉）
   - 與任務系統同步（任務關聯、狀態同步）
   - 實現問題通知機制（Edge Function 通知）

3. **優先級 P2（業務功能）**：
   - 問題照片牆功能
   - 問題關閉摘要功能
   - 同步日誌查詢功能

### 依賴關係

- **依賴模組**：
  - 🎯 藍圖/專案系統（模組 3）- 提供藍圖和分支數據
  - 📋 任務執行系統（模組 4）- 提供任務關聯數據
  - ✅ 品質驗收系統（模組 5）- 提供驗收不合格問題來源

- **被依賴模組**：
  - 💬 協作溝通系統（模組 7）- 提供問題討論和通知功能
  - 📊 資料分析系統（模組 8）- 提供問題統計數據

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [主任務追蹤清單](./99-Tracking.md)
- [系統架構思維導圖](./01-系統架構思維導圖.mermaid.md)
- [Issue Service 實現](../../src/app/shared/services/issue/issue.service.ts)
- [Issue Facade 實現](../../src/app/core/facades/issue.facade.ts)
- [Issue Repository 實現](../../src/app/core/infra/repositories/issue.repository.ts)

---

## 📊 統計資訊

**總任務數**：約 75 個任務  
**已完成**：約 41 個任務（55%）  
**進行中**：約 2 個任務（3%）  
**待開始**：約 32 個任務（42%）

**完成度分析**：
- 數據層：✅ 100%（14/14 任務）
- 數據模型層：✅ 100%（6/6 任務）
- 服務層：✅ 80%（8/10 任務）
- Facade 層：✅ 100%（12/12 任務）
- UI 層骨架：✅ 100%（13/13 任務）
- UI 層功能：⏳ 0%（0/12 任務）
- 業務邏輯：⏳ 30%（1/5 任務）
- 權限與安全：⏳ 0%（0/4 任務）
- 測試：⏳ 0%（0/12 任務）
- 文檔：⏳ 0%（0/4 任務）

