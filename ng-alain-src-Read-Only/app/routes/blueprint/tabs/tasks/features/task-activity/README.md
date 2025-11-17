# Task Activity Feature

## 職責
- 彙整任務層級的活動紀錄（狀態變更、審批結果、討論動態）。
- 與藍圖活動記錄頁籤、通知系統協作，提供統一事件來源。

## Blueprint 協作接口
- 預計建立 `services/domain` 活動 facade，聚合 `task-change`、`task-issues`、`task-communication` 等事件。
- `services/state` 將緩存活動時間線，供 `blueprint/tabs/activity` 與任務詳情共用。
- 將與 `discussions/activity` 模組協作共享事件模型，避免重複造輪。

## 目錄結構（初稿）
- `components/`：活動時間線、篩選器等 UI。
- `services/`：待建立 domain/repository/view 層。
- `models/`：活動事件、類型、來源型別。
- `state/`：活動紀錄 signal/store。
- `assets/`：圖示與樣板配置。

