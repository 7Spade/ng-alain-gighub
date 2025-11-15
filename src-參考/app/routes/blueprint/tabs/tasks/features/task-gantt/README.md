# Task Gantt Feature

## 職責
- 呈現任務甘特圖、時程調整與資源配置時間軸。
- 與藍圖進度追蹤、時間管理頁籤整合。

## Blueprint 協作接口
- `components/task-gantt.component.ts`：甘特視圖主元件，可由 `blueprint/tabs/progress` 或 `task-overview` 懶載入。
- 規劃於 `services/` 建立 time/resource 轉換服務，提供甘特與其他時間視圖共用。
- `state/` 預留甘特視圖 signal store（任務選取、縮放狀態等）。

## 目錄結構
- `components/`：甘特主視圖及子元件。
- `services/`：封裝時間刻度計算、互動同步邏輯（待補）。
- `models/`：甘特任務、里程碑、資源區段等型別。
- `state/`：視圖狀態容器。
- `assets/`：時間軸樣式、圖示資源。
