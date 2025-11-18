# 📋 任務執行系統 - 任務追蹤

> 📋 **目的**：追蹤任務執行系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M5  
**資料表數量**：9 張

---

## 📊 模組資訊

### 資料表清單

1. **tasks** - 任務主表（樹狀結構，無層級限制）
2. **task_assignments** - 任務指派表（支援個人/團隊/組織/承攬）
3. **task_lists** - 任務列表表（按指派對象分類）
4. **task_staging** - 暫存區表（48 小時可撤回機制）
5. **daily_reports** - 施工日誌表（自動同步到主分支）
6. **report_photos** - 報表照片表
7. **weather_cache** - 天氣快取表
8. **task_dependencies** - 任務依賴關係表
9. **task_templates** - 任務模板表

### 模組狀態

- **目前狀態**：⏳ 骨架完成
- **近期里程碑**：里程碑 7（2025-03-31）
- **主要阻塞**：尚未有資料模型、RLS、48h 暫存設計

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/task/）[✅已完成]
Repository 層（9 個 Repository）[✅已完成]
服務層（TaskService, TaskAssignmentService, TaskListService, TaskStagingService, DailyReportService）[✅已完成]
任務樹狀結構實現（無限層級）[⏳待開始]
暫存區機制（48h 可撤回）[⏳待開始]
自動同步主分支（施工日誌）[⏳待開始]
任務指派邏輯（個人/團隊/組織/承攬）[⏳待開始]
RLS 權限驗證[⏳待開始]

### 頁面組件開發

任務列表頁面（TaskListComponent）[✅已完成]
TaskListComponent Phase 4 增強功能[✅已完成]
TaskListComponent Phase 5.1 單元測試[✅已完成]
任務樹視圖頁面（TaskTreeComponent）[🚧進行中]
任務看板頁面（TaskBoardComponent）[⏳待開始]
任務日曆頁面（TaskCalendarComponent）[⏳待開始]
任務詳情頁面（TaskDetailComponent）[⏳待開始]
任務詳情殼頁面（TaskDetailShellComponent）[⏳待開始]
任務表單頁面（TaskFormComponent）[⏳待開始]
任務表單中心頁面（TaskFormHubComponent）[⏳待開始]
任務指派頁面（TaskAssignmentsComponent）[⏳待開始]
待辦列表頁面（TaskTodoComponent）[⏳待開始]
暫存區頁面（TaskStagingComponent）[⏳待開始]
施工日誌列表頁面（DailyReportsComponent）[⏳待開始]
施工日誌表單頁面（DailyReportFormComponent）[⏳待開始]
施工日誌詳情頁面（DailyReportDetailComponent）[⏳待開始]
任務照片頁面（TaskPhotosComponent）[⏳待開始]
照片上傳組件（PhotoUploadComponent）[⏳待開始]
照片查看器組件（PhotoViewerComponent）[⏳待開始]
任務天氣頁面（TaskWeatherComponent）[⏳待開始]
任務進度頁面（TaskProgressComponent）[🚧進行中]

### 任務樹相關組件

任務樹拖拽服務（TaskTreeDragService）[🚧進行中]
安裝與配置 CDK DragDrop[⏳待開始]
建立 DragDrop 服務抽象層[⏳待開始]
擴展 TaskTreeFacade 支援層級更新[⏳待開始]
任務狀態切換器（TaskStatusSwitcherComponent）[🚧進行中]
任務指派人選擇器（TaskAssigneeSelectorComponent）[🚧進行中]
連接狀態組件（ConnectionStatusComponent）[🚧進行中]
衝突解決服務（ConflictResolutionService）[🚧進行中]
任務樹實時集成（TaskTreeRealtimeIntegration）[⏳待開始]
任務樹 Facade（TaskTreeFacade）[🚧進行中]

### 測試

單元測試[⏳待開始]
集成測試[⏳待開始]
E2E 測試（任務執行流程 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（任務系統 API 文檔）[⏳待開始]
用戶指南更新（任務執行用戶指南）[⏳待開始]

---

## 📝 備註

### 下一步行動

- 啟動模型/Repository 設計
- 鎖定任務樹結構
- 設計 48h 暫存機制

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [企業級任務系統開發指令](./44-企業級任務系統開發指令.md)

