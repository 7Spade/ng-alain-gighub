# 🎯 藍圖/專案系統 - 任務追蹤

> 📋 **目的**：追蹤藍圖/專案系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M4  
**資料表數量**：5 張

---

## 📊 模組資訊

### 資料表清單

1. **blueprints** - 藍圖主表（主分支，擁有者組織控制任務結構）
2. **blueprint_configs** - 藍圖設定表
3. **blueprint_branches** - 組織分支表（協作組織的 Fork 分支）
4. **branch_forks** - 分支 Fork 記錄表
5. **pull_requests** - PR 提交記錄表（提交執行數據，擁有者審核後合併）

### 模組狀態

- **目前狀態**：🚧 進行中（核心功能完成，部分頁面待實現）
- **完成度**：約 70%（Repository 100%，Service 80%，Routes 70%）
- **近期里程碑**：里程碑 6（部分完成）
- **主要阻塞**：3 個頁面是骨架，PR 合併邏輯不完整，測試 0%

---

## 📋 任務清單

### 數據層與服務層

#### Repository 層（Core/Infra）

BlueprintRepository（CRUD + 查詢方法）[✅已完成]
BlueprintBranchRepository（分支查詢 + Fork 方法）[✅已完成]
BranchForkRepository（Fork 記錄查詢）[✅已完成]
PullRequestRepository（PR 查詢方法）[✅已完成]
BlueprintConfigRepository（配置查詢 + Upsert）[✅已完成]

#### Service 層（Shared）

BlueprintService（Signals 狀態管理 + CRUD）[✅已完成]
BranchService（分支管理 + Fork 機制）[✅已完成]
PullRequestService（PR 管理 + 審核流程）[🚧進行中]
  - PR CRUD 操作[✅已完成]
  - PR 狀態管理（startReview, approve, reject）[✅已完成]
  - PR 合併邏輯（mergePullRequest）[🚧進行中]
    - 狀態更新[✅已完成]
    - 實際合併邏輯（更新 tasks.contractor_fields）[⏳待開始]
    - Edge Function 調用[⏳待開始]
BlueprintActivityService（審計追蹤）[✅已完成]
  - 活動記錄功能[✅已完成]
  - 變更歷史追溯[✅已完成]
  - 批次記錄[✅已完成]
  - 活動查詢與過濾[✅已完成]

#### Git-like 分支模型

Fork 機制（BranchService.forkBranch）[✅已完成]
分支創建（BlueprintBranchRepository.createFork）[✅已完成]
Fork 記錄（BranchForkRepository）[✅已完成]
PR 機制（PullRequestService）[🚧進行中]
分支狀態管理[✅已完成]
PR 合併邏輯完整實現[🚧進行中]
  - PR 狀態更新[✅已完成]
  - 實際合併邏輯（更新任務承攬欄位）[⏳待開始]
  - 任務對應關係追蹤[⏳待開始]
  - Edge Function 調用（branch-merge）[⏳待開始]

#### 權限與安全

RLS 權限驗證（5 張表，20 個策略）[✅已完成]
分支權限控制（BranchPermissionService）[✅已完成]
協作關係管理（CollaborationService 整合）[✅已完成]

#### 其他服務

BlueprintFacade（Facade 層封裝）[✅已完成]
BranchContextService（分支上下文管理）[✅已完成]
BranchDataIsolationService（分支數據隔離）[✅已完成]

### 頁面組件開發

#### 藍圖管理

藍圖列表頁面（BlueprintListComponent）[✅已完成]
藍圖創建頁面（BlueprintFormComponent）[✅已完成]
藍圖詳情頁面（BlueprintDetailComponent）[✅已完成]
藍圖詳情殼頁面（BlueprintDetailShellComponent）[✅已完成]
藍圖主分支頁面（BlueprintMainBranchComponent）[✅已完成]
藍圖設置頁面（BlueprintSettingsComponent）[⏳待開始]
  - 目前狀態：骨架頁面，僅顯示「功能開發中」提示
  - 待實現：配置管理 UI、工作日曆設定、通知規則設定
藍圖設置殼頁面（BlueprintSettingsShellComponent）[⏳待開始]

#### 分支管理

分支總覽頁面（BlueprintBranchesOverviewComponent）[✅已完成]
分支管理頁面（BranchManagementComponent）[🚧進行中]
  - 分支列表顯示[✅已完成]
  - Fork 分支對話框[✅已完成]
  - 分支操作按鈕[✅已完成]
  - 部分功能待完善
分支詳情頁面（BranchDetailComponent）[✅已完成]
  - 分支信息顯示[✅已完成]
  - 狀態標籤[✅已完成]

#### Fork 功能

Fork 登陸頁面（BlueprintForkLandingComponent）[⏳待開始]
  - 目前狀態：骨架頁面，僅有 UI 框架
  - 待實現：Step Form 流程、模組選擇、實際 Fork 邏輯
Fork 任務頁面（BlueprintForkComponent）[✅已完成]
  - Fork 表單[✅已完成]
  - 組織選擇[✅已完成]
  - 協作關係創建[✅已完成]
  - 分支權限設置[✅已完成]

#### Pull Request 管理

Pull Request 中心頁面（PullRequestCenterComponent）[✅已完成]
Pull Request 列表頁面（PullRequestListComponent）[🚧進行中]
  - PR 列表顯示[✅已完成]
  - 狀態標籤[✅已完成]
  - 創建 PR 按鈕[✅已完成]
  - 部分操作按鈕待完善（TODO 註釋）
Pull Request 詳情頁面（PullRequestDetailComponent）[🚧進行中]
  - PR 信息顯示[✅已完成]
  - 變更摘要顯示[✅已完成]
  - 部分功能待完善（TODO 註釋）
Pull Request 表單頁面（PullRequestFormComponent）[✅已完成]
Pull Request 合併頁面（PullRequestMergeComponent）[✅已完成]
Pull Request 審查頁面（PullRequestReviewComponent）[✅已完成]
  - 審核表單[✅已完成]
  - 批准/拒絕邏輯[✅已完成]
藍圖審查工作區頁面（BlueprintReviewWorkspaceComponent）[⏳待開始]
  - 目前狀態：骨架頁面，僅有 UI 框架
  - 待實現：Diff 顯示、評論功能、待辦事項管理、實際審核邏輯

### 測試

#### 單元測試

Repository 層單元測試[⏳待開始]
Service 層單元測試[⏳待開始]
  - BlueprintService 測試[⏳待開始]
  - BranchService 測試[⏳待開始]
  - PullRequestService 測試[⏳待開始]
  - BlueprintActivityService 測試[⏳待開始]
Component 層單元測試[⏳待開始]
  - 部分組件有 spec 文件框架（branch-detail, pull-request-detail）[🚧進行中]

#### 集成測試

藍圖 CRUD 流程測試[⏳待開始]
分支 Fork 流程測試[⏳待開始]
PR 審核流程測試[⏳待開始]

#### E2E 測試

藍圖管理 E2E 測試[⏳待開始]
PR 審核流程 E2E 測試[⏳待開始]

### 文檔

API 文檔更新（藍圖系統 API 文檔）[⏳待開始]
用戶指南更新（藍圖管理用戶指南）[⏳待開始]
架構文檔同步（與實際實現對照）[🚧進行中]

---

## 📊 實現完整度統計

### 按層級統計

| 層級 | 完成度 | 狀態 |
|------|--------|------|
| **Repository 層** | 100% | ✅ 完整 |
| **Service 層** | 80% | 🚧 基本完整 |
| **Routes 層** | 70% | 🚧 基本完整 |
| **測試** | 0% | ⏳ 待開始 |
| **文檔** | 30% | 🚧 部分完成 |

### 按功能模組統計

| 功能模組 | 完成度 | 狀態 |
|---------|--------|------|
| **藍圖 CRUD** | 100% | ✅ 完整 |
| **分支管理** | 85% | ✅ 基本完整 |
| **Fork 機制** | 80% | ✅ 基本完整 |
| **PR 機制** | 60% | 🚧 部分實現 |
| **活動記錄** | 100% | ✅ 完整 |
| **權限控制** | 90% | ✅ 基本完整 |

---

## 🚧 進行中的任務詳情

### PR 合併邏輯（PullRequestService.mergePullRequest）

**當前狀態**：🚧 進行中

**已實現**：
- ✅ PR 狀態驗證（必須是 APPROVED）
- ✅ 獲取 PR 和分支信息
- ✅ 獲取源分支任務列表
- ✅ PR 狀態更新為 MERGED
- ✅ 變更摘要記錄

**待實現**：
- ⏳ 任務對應關係追蹤（主分支任務與分支任務的對應）
- ⏳ 實際更新 tasks.contractor_fields 欄位
- ⏳ 調用 Edge Function `branch-merge` 執行合併
- ⏳ 錯誤處理和回滾機制
- ⏳ 合併後的活動記錄

**相關代碼位置**：
- `src/app/shared/services/blueprint/pull-request.service.ts:280-367`
- TODO 註釋：`// TODO: Implement proper task correspondence between branches`

### 分支管理頁面（BranchManagementComponent）

**當前狀態**：🚧 進行中

**已實現**：
- ✅ 分支列表顯示
- ✅ Fork 分支對話框
- ✅ 分支操作按鈕（查看、Fork、關閉）

**待完善**：
- ⏳ 分支同步功能 UI
- ⏳ 分支權限管理 UI
- ⏳ 分支統計信息顯示

### Pull Request 列表/詳情頁面

**當前狀態**：🚧 進行中

**已實現**：
- ✅ PR 列表顯示
- ✅ PR 詳情顯示
- ✅ 狀態標籤和過濾

**待完善**：
- ⏳ 部分操作按鈕（TODO 註釋）
- ⏳ PR 差異顯示
- ⏳ PR 評論功能

---

## ⏳ 待開始的任務詳情

### 骨架頁面實現

#### BlueprintForkLandingComponent
- **位置**：`src/app/routes/blueprints/fork/blueprint-fork-landing.component.ts`
- **當前狀態**：骨架頁面，僅有 UI 框架
- **待實現**：
  - Step Form 完整流程
  - 模組選擇功能（Transfer 組件）
  - 實際 Fork 邏輯整合
  - 表單驗證和提交

#### BlueprintReviewWorkspaceComponent
- **位置**：`src/app/routes/blueprints/review/blueprint-review-workspace.component.ts`
- **當前狀態**：骨架頁面，僅有 UI 框架
- **待實現**：
  - Diff 顯示功能
  - 評論功能（@提及、回覆）
  - 待辦事項管理
  - 實際審核邏輯整合

#### BlueprintSettingsComponent
- **位置**：`src/app/routes/blueprints/settings/blueprint-settings.component.ts`
- **當前狀態**：骨架頁面，僅顯示「功能開發中」提示
- **待實現**：
  - 配置管理 UI
  - 工作日曆設定
  - 通知規則設定
  - 自訂欄位管理

### PR 合併邏輯完善

#### 任務對應關係追蹤
- **需求**：建立主分支任務與分支任務的對應關係
- **實現方式**：可能需要通過 `branch_forks` 表或任務 ID 映射
- **相關表**：`tasks`, `branch_forks`

#### 更新 tasks.contractor_fields
- **需求**：PR 合併時將分支任務的承攬欄位更新到主分支任務
- **實現方式**：調用 TaskService 或直接更新 Repository
- **相關方法**：`TaskService.updateTaskContractorFields()`（待實現）

#### Edge Function 調用
- **需求**：調用 `branch-merge` Edge Function 執行合併
- **實現方式**：通過 Supabase Edge Function 客戶端調用
- **相關服務**：需要創建 Edge Function 調用服務

### 測試覆蓋

#### 單元測試
- **Repository 層**：5 個 Repository，每個需要完整測試
- **Service 層**：4 個 Service，每個需要完整測試
- **Component 層**：15+ 個組件，優先測試核心組件

#### 集成測試
- **藍圖 CRUD 流程**：創建 → 讀取 → 更新 → 刪除
- **分支 Fork 流程**：創建協作 → Fork 分支 → 設置權限
- **PR 審核流程**：創建 PR → 審核 → 批准 → 合併

---

## 🧊 阻塞問題

### 技術阻塞

1. **PR 合併邏輯不完整**
   - **問題**：缺少任務對應關係追蹤機制
   - **影響**：無法正確更新主分支任務的承攬欄位
   - **解決方案**：設計並實現任務對應關係追蹤機制

2. **Edge Function 未實現**
   - **問題**：`branch-merge` Edge Function 尚未實現
   - **影響**：無法執行實際的合併操作
   - **解決方案**：實現 Edge Function 或使用現有服務替代

### 功能阻塞

1. **骨架頁面未實現**
   - **問題**：3 個頁面僅有 UI 框架，缺少實際功能
   - **影響**：用戶無法使用這些功能
   - **解決方案**：逐步實現各頁面的核心功能

2. **測試覆蓋率為 0**
   - **問題**：沒有單元測試和集成測試
   - **影響**：無法保證代碼質量和穩定性
   - **解決方案**：優先為核心功能編寫測試

---

## 📝 備註

### 下一步行動（優先級排序）

#### 🔴 高優先級
1. **完善 PR 合併邏輯**
   - 實現任務對應關係追蹤
   - 實現 tasks.contractor_fields 更新
   - 整合 Edge Function 調用

2. **實現骨架頁面核心功能**
   - BlueprintSettingsComponent：配置管理
   - BlueprintForkLandingComponent：Fork 流程
   - BlueprintReviewWorkspaceComponent：審核工作區

#### 🟡 中優先級
3. **補齊測試**
   - Repository 層單元測試
   - Service 層單元測試
   - 核心組件單元測試

4. **完善文檔**
   - API 文檔更新
   - 用戶指南編寫

#### 🟢 低優先級
5. **優化與增強**
   - 性能優化
   - UI/UX 改進
   - 錯誤處理增強

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md)
- [藍圖實現狀況分析報告](./藍圖實現狀況分析報告.md) ⭐ 詳細實現分析
- [系統架構思維導圖](./01-系統架構思維導圖.mermaid.md) ⭐ 架構參考

