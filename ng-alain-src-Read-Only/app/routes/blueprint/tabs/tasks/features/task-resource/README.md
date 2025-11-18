# Task Resource Feature

## 職責
- 管理任務所需的人力、設備、物料等資源配置與利用率。
- 與藍圖資源視圖、進度與成本頁籤協作，提供資源現況。

## Blueprint 協作接口
- `components/task-resource.component.ts`：資源狀態主視圖，供任務詳情與藍圖資源頁載入。
- `services/domain`：統一資源查詢、分配與調度邏輯（見 `task-resource.service.ts`）。
- `services/views`：提供資源視圖投影，支援總覽/報表重用。
- 規劃於 `state/` 建立資源 signal store，支援跨頁籤同步（待補）。

## 目錄結構
- `components/`：資源卡片、分配表等 UI。
- `services/`：區分 domain 與 views 層，可再補 repository。
- `models/`：資源配置、工時、負載等型別。
- `state/`：資源狀態容器。
- `assets/`：資源圖示、設定檔。
