# Tasks Feature Module

Blueprint 任務頁面採 **feature-first** 結構：功能位於 `features/`，共用資源集中 `shared/`，並以 Angular 20 Standalone + `provideRoutes` 懶載入。本檔案總結 Phase 0～6 重構後的最新狀態與開發指引。

> **狀態更新（2025‑11‑11）**：模型、資料層、domain、facade/state、路由與文件已全面調整；詳細時間線與產出請參考 `docs/tasks-shared-refactor-plan.md`。

## 架構總覽

| 主題 | 現況 | 後續重點 |
| --- | --- | --- |
| 模型 / 型別 | ✅ 全維度模型位於 `shared/models/<dimension>/`，統一透過 `@models` 匯入 | 維持與 Supabase schema 同步 |
| 資料存取 | ✅ Service 透過 `@tasks/shared/repository` 操作 Supabase，統一錯誤處理 | 補充快取、重試與錯誤分類策略 |
| Domain 計算 | ✅ `shared/domain` 提供純函式（change/safety/location…）並附 Jest 測試 | 視需求擴充其他維度 domain |
| Facade / State | ✅ `shared/state` 提供 `TaskDetail`、`TaskCommand`、`TaskProgress`、`TaskSafety`、`TaskLocation`、`TaskChange` 等 facade；Routes 層不再直接依賴 repository | 尚未改寫的 UI 逐步切換至 facade |
| 路由 | ✅ `tasks-routing.module.ts` / `task-detail-routing.module.ts` 補齊 `data.title`，主要 routes 已改用 facade 提供資料 | 擴充新路由時維持 Title / Standalone / 懶載入規範 |
| 文檔 | ✅ README 與 `docs/tasks-shared-refactor-plan.md` 已同步更新 | 規劃額外 ADR、測試報告 |

## 目錄導覽

- `features/`：依任務維度拆分的子模組（detail、progress、change、safety、resource…）
  - 內含 `components/`、`services/`、`state/`、`assets/` 等子資料夾
- `shared/`：任務共用層
  - `models/`：跨功能共用型別
  - `repository/`：封裝 Supabase CRUD 與錯誤處理
  - `domain/`：純函式業務規則（含測試）
  - `state/`：Signal-based facade/store
  - 其他：`components/`、`constants/`、`forms/`、`mappers/`、`queries/`、`views/`…
- `tasks-routing.module.ts` / `task-detail-routing.module.ts`：任務主路由與子頁籤路由

## 主要子功能

- `task-detail/`：任務詳情容器與多標籤頁 UI
- `task-progress/`：進度追蹤、完成率計算與異常提示
- `task-change/`：變更申請、影響分析、審批流程
- `task-safety/`：危害辨識、許可證、事故紀錄
- `task-location/`：物理位置與空間關聯資料
- `task-resource/`：人力 / 物料 / 設備配置
- `task-time/`：工期規劃、關鍵路徑計算
- 其他模組（cost、quality、risk、dependency、report、form…）依維度提供 UI 與資料服務

## 開發準則

- **Shared Imports**：所有 Standalone 元件一律使用 `SHARED_IMPORTS`
- **DI 層次**：Routes → `@tasks/shared/state` → `@tasks/shared/repository` → `@core`
- **Typed Forms**：沿用 `shared/forms` 定義，避免 `any`
- **Signals**：以 `signal`/`computed`/`effect` 實作；狀態集中在 facade
- **文件同步**：新增/調整功能需更新 README / ADR / docs
- **品質檢查**：提交前至少執行 `yarn lint:ts`、`yarn type-check`、`yarn build`

## 路由整合

- `/tasks`：任務總覽（`BlueprintTasksOverviewComponent`）
- `/tasks/detail/:id`：載入 `TASK_DETAIL_ROUTES`（basic/time/dependency/resource/progress/cost/quality/risk/safety/change）
- `/tasks/dependency/:id`、`/tasks/gantt`、`/tasks/form`…：以懶載入方式提供 Standalone 組件
- 其他模組可透過 `provideRoutes(TASKS_ROUTES)` 引入

## 既知待辦

| 項目 | 狀態 | 後續行動 |
| --- | --- | --- |
| Lint baseline | ⏳ `_mock`、`core/account` 等仍有 `no-explicit-any` / deprecated API | 規劃批次修復或合適 suppression |
| e2e / integration 測試 | ⏳ 新增 facade 尚未覆蓋 e2e | 補進度/安全/變更主要流程腳本 |
| Facade 覆蓋率 | ⏳ 部分舊 UI 仍直接注入 service | 逐步改寫為 facade 注入 |

> 新增功能前請先搜尋共用工具、遵循 facade → repository → domain → models 的分層設計，並在提交前更新文檔與測試結果。

