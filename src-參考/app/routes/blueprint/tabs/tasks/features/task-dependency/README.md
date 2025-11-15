# Task Dependency Feature

## 職責
- 建立任務依賴關係圖、循環檢測與衝突提醒。
- 支援藍圖進度、甘特圖與任務詳情頁顯示依賴鏈。

## Blueprint 協作接口
- `services/domain/task-dependency.service.ts`：提供依賴關係查詢、更新與循環檢測結果，供 `blueprint/tabs/progress`、`task-gantt` 與任務詳情使用。
- 規劃於 `state/` 建立依賴圖 signal store，使多視圖共享。
- `components/task-dependency.component.ts`：作為可懶載入的依賴管理 UI，供藍圖路由載入。

## 目錄結構
- `components/`：依賴圖表、編輯面板。
- `services/`：目前提供 domain/service，可擴充 repository 接口。
- `models/`：依賴邊、任務節點等型別。
- `state/`：預留依賴狀態容器。
- `assets/`：靜態圖示與設定。
