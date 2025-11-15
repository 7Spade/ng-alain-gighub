# Task Checkpoint Feature

## 職責
- 管理任務檢查點、里程碑與核准節點的前端視圖與互動。
- 對應藍圖進度追蹤頁的節點管理與核准記錄。

## Blueprint 協作接口
- `services/domain/task-checkpoint.service.ts`：提供檢查點查詢、狀態更新介面，供 `blueprint/tabs/progress` 與任務詳情頁獲取最新節點資訊。
- 規劃於 `state/` 建立 signal store，同步提供進度儀表板與 checkpoint 列表使用。

## 目錄結構
- `components/`：節點列表、核准面板等 UI（待補）。
- `services/`：劃分 domain/service 層，未來補 repository 連結 Supabase。
- `models/`：定義 checkpoint、milestone、auditor 等資料模型。
- `state/`：存放 checkpoint signal/store，提供跨組件共享（待補）。
- `assets/`：里程碑圖示、靜態配置。
