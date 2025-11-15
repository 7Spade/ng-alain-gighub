# Task Overview Feature

## 職責
- 提供任務總覽儀表板，整合 KPI、圖表、任務樹與快捷操作。
- 作為藍圖「概覽」與任務首頁的核心容器。

## Blueprint 協作接口
- `tasks-overview.component.ts`：主視圖可由 `blueprint/tabs/tasks` 與 `blueprint/tabs/overview` 懶載入。
- `services/views/task-view.service.ts`：輸出任務概覽所需的投影資料與 selector，提供任務樹、KPI、圖表等子元件共享。
- `services/task-hierarchy-table/*`（待補 README）：維護任務樹結構與互動，協助藍圖其他模組重用。
- 規劃於 `state/` 建立概覽 level signal store，集中管理篩選與狀態（目前由 component 管理，後續抽離）。

## 目錄結構
- `tasks-overview.component.*`：總覽頁主視圖、樣式與模板。
- `services/`：提供 view/projector 邏輯，後續可補 repository 層。
- 其他子目錄（components/assets/state 等）將依需求擴充。

