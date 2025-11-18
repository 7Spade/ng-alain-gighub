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
- **近期里程碑**：里程碑 6（部分完成）
- **主要阻塞**：3 個頁面是骨架，部分操作按鈕是 TODO，測試 0%

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/blueprint/）[✅已完成]
Repository 層（5 個 Repository，20+ 查詢方法）[✅已完成]
服務層（BlueprintService, BranchService, PullRequestService）[✅已完成]
Git-like 分支邏輯（Fork、PR 審核、合併）[✅已完成]
RLS 權限驗證（5 張表，20 個策略）[✅已完成]
PR 合併邏輯完整實現[🚧進行中]
實現 TaskService.updateTaskContractorFields() 方法[⏳待開始]
完善 PullRequestService.mergePullRequest() 實際合併邏輯[⏳待開始]
PR 合併時更新 tasks.contractor_fields 欄位[⏳待開始]
BlueprintActivityService 實作（審計追蹤）[⏳待開始]
BlueprintActivityService 活動記錄功能[⏳待開始]
BlueprintActivityService 變更歷史追溯[⏳待開始]

### 頁面組件開發

藍圖列表頁面（BlueprintListComponent）[✅已完成]
藍圖創建頁面（BlueprintFormComponent）[✅已完成]
藍圖詳情頁面（BlueprintDetailComponent）[✅已完成]
藍圖詳情殼頁面（BlueprintDetailShellComponent）[✅已完成]
藍圖主分支頁面（BlueprintMainBranchComponent）[✅已完成]
分支總覽頁面（BlueprintBranchesOverviewComponent）[✅已完成]
分支管理頁面（BranchManagementComponent）[🚧進行中]
分支詳情頁面（BranchDetailComponent）[🚧進行中]
Fork 登陸頁面（BlueprintForkLandingComponent）[⏳待開始]
Fork 任務頁面（BlueprintForkComponent）[⏳待開始]
Pull Request 中心頁面（PullRequestCenterComponent）[✅已完成]
Pull Request 列表頁面（PullRequestListComponent）[🚧進行中]
Pull Request 詳情頁面（PullRequestDetailComponent）[🚧進行中]
Pull Request 表單頁面（PullRequestFormComponent）[✅已完成]
Pull Request 合併頁面（PullRequestMergeComponent）[✅已完成]
Pull Request 審查頁面（PullRequestReviewComponent）[⏳待開始]
藍圖審查工作區頁面（BlueprintReviewWorkspaceComponent）[⏳待開始]
藍圖設置頁面（BlueprintSettingsComponent）[⏳待開始]
藍圖設置殼頁面（BlueprintSettingsShellComponent）[⏳待開始]

### 測試

單元測試[⏳待開始]
集成測試[⏳待開始]
E2E 測試（藍圖管理 E2E 測試、PR 審核流程 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（藍圖系統 API 文檔）[⏳待開始]
用戶指南更新（藍圖管理用戶指南）[⏳待開始]

---

## 📝 備註

### 下一步行動

- 完成骨架頁面（settings/fork/review）
- 實現操作按鈕
- 補齊測試與文檔

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md)

