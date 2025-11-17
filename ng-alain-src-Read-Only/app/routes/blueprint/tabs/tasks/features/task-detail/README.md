# Task Detail Feature

## 職責
- 提供任務詳情主頁與多標籤視圖的容器。
- 聚合任務跨模組資料（進度、資源、文件、議題等），作為藍圖任務頁核心入口。

## Blueprint 協作接口
- `services/repository/task.repository.ts`：封裝任務資料拉取、快取與錯誤分類；供藍圖任務詳情、活動記錄等子模組共用。
- `components/task-detail-tabs/*`：將各 feature 主題整合為可懶載入分頁，支援 `blueprint/tabs/tasks` 與其他頁面嵌入。
- 後續於 `state/` 內提供任務核心 signal store，作為子標籤狀態來源。

## 目錄結構
- `components/`：包含 `task-detail.component` 與子分頁容器。
- `services/`：目前以 repository 為主，可再拆分 domain/service。
- `models/`：任務詳情 DTO、組合型 view model（待補）。
- `state/`：任務核心狀態 signal/store（規劃中）。
- `assets/`：詳情頁靜態資源。
