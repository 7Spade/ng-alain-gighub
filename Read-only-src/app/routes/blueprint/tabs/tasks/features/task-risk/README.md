# Task Risk Feature

## 職責
- 辨識、評估並追蹤任務風險與緩解措施。
- 支援藍圖風險總覽、品質與進度頁面顯示風險狀態。

## Blueprint 協作接口
- `services/domain/task-risk.service.ts`：提供風險清單、等級與狀態更新，供 `blueprint/tabs/quality`、`task-overview` 等模組取用。
- 規劃建立 `services/repository` 與 `state/`，集中處理風險資料拉取與快取（尚未實作）。
- 與 `task-report` 協作輸出風險摘要至每日報表。

## 目錄結構
- `components/`：風險列表、警示卡片等 UI（待補）。
- `services/`：目前具 domain 服務，可擴充 repository。
- `models/`：風險項目、等級、緩解計畫型別。
- `state/`：風險狀態容器。
- `assets/`：風險等級圖示、設定檔。
