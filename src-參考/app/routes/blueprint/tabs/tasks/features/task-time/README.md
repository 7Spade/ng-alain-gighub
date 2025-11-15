# Task Time Feature

## 職責
- 管理任務時程、工時填報、SLA 與關鍵路徑資訊。
- 支援藍圖進度追蹤、甘特圖與每日報表等時間維度視圖。

## Blueprint 協作接口
- `services/domain/task-time.service.ts`：整合任務時程資料與 SLA 驗證。
- `services/computation/*`：提供時間裂解、工時計算等共用運算邏輯，供 `task-gantt`、`task-report` 共用。
- `services/views`（若建立）：輸出整合視圖，供藍圖時間小工具與報表使用。
- `state/` 將緩存時程視圖狀態（待補）。

## 目錄結構
- `components/`：時間軸、工時卡 UI（待補）。
- `services/`：包含 domain、computation、views（待建）。
- `models/`：工時、SLA、關鍵路徑型別。
- `state/`：時間相關 signal/store。
- `assets/`：時間軸樣板、圖示。
