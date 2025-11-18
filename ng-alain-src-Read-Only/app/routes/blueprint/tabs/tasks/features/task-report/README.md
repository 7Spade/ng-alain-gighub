# Task Report Feature

## 職責
- 產出任務的每日／週期報表、工作日誌與匯總投影。
- 與藍圖每日報表、儀表板匯出功能協作。

## Blueprint 協作接口
- `services/`（規劃中）：聚合 `task-progress`、`task-cost`、`task-risk` 等資料，輸出報表 DTO。
- `state/` 將緩存報表篩選條件與生成結果，供 `blueprint/tabs/reports`、`task-activity` 共用。
- 會與 `shared/forms/task` 配合提供報表查詢表單，並沿用 `shared/models` 避免重複造輪。

## 目錄結構（初稿）
- `components/`：報表預覽、匯出按鈕等 UI。
- `services/`：report assembler、exporter（待實作）。
- `models/`：報表輸入、輸出 DTO。
- `state/`：報表結果快取與背景任務狀態。
- `assets/`：報表模板、匯出設定。

