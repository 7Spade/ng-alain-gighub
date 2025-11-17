# Task Issues Feature

## 職責
- 作為任務議題整合層，串接藍圖 `issues/` 子系統與任務詳情。
- 提供議題清單、狀態、優先度等資料投影，讓任務視角掌握議題動態。

## Blueprint 協作接口
- `services/domain/task-issues.service.ts` 直接復用 `BlueprintIssueService` 與 `BlueprintService`，輸出 `IssueViewModel` 與成員列表，避免重複造輪。
- `shared/state/task-issues.facade.ts` 快取議題/成員資料並暴露載入狀態，供 `tasks` 模組與 `blueprint/tabs/issues` 共同使用。
- 與 `task-detail`、`task-progress` 等模組協同顯示議題相關 KPI。

## 目錄結構
- `components/`：議題摘要卡、串接 issues 列表的 wrapper（待建置）。
- `services/`：
  - `domain/task-issues.service.ts`：議題資料聚合服務。
- `models/`：延用 `issues` 模組型別，必要時擴充任務維度欄位。
- `state/`：
  - `task-issues.facade.ts`：議題快取 signal/store。
- `assets/`：議題圖示、靜態設定（待建置）。

