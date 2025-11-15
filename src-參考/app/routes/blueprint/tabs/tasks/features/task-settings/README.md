# Task Settings Feature

## 職責
- 管理任務層級的設定（通知、偏好、權限、整合選項）。
- 與藍圖設定頁協作，讓任務可自訂行為與指標。

## Blueprint 協作接口
- 規劃在 `services/` 建立 facade，聚合 `task-role`、`task-notification`（未建）、`task-identity` 等設定來源。
- `state/` 將存放設定草稿 signal，供設定頁、任務詳情同步。
- 與 `shared/forms`、`shared/models` 協作，復用表單與型別。

## 目錄結構（規劃中）
- `components/`：設定表單、偏好面板。
- `services/`：facade、repository。
- `models/`：設定 DTO、偏好結構。
- `state/`：設定 signal/store。
- `assets/`：設定選項、預設值。

