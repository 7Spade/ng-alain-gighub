# Core 層開發指南

> ⚠️ 本層不再維護 `CoreModule`。所有功能以 Standalone 與 `@Injectable({ providedIn: 'root' })` 形式提供。

## 🎯 職責範圍

`core/` 提供應用的基礎設施：

- 啟動流程（`startup/`）
- 拦截器與網路層（`net/`）
- 語系管理（`i18n/`）
- 資料服務（`supabase/`, `user/`, `organization/`, `team/`, `weather/`, `blueprint/` 等）
- 路由守衛與跨功能服務

## 🛠️ 服務實作原則

- 使用 `@Injectable({ providedIn: 'root' })` 搭配 `inject()`，避免建立多餘模組。
- 以 Angular Signals 管理狀態（`signal`、`computed`、`effect`）。
- 所有資料庫與 API 呼叫必須透過 Supabase MCP 工具並封裝在 Service/Repository 內。
- 提供明確介面與錯誤處理（整合 `ErrorStateService`）。
- 僅暴露應用層需要的最小職責，不包含 UI 邏輯。

## 🚫 禁止事項

- ❌ 建立或維護 `CoreModule`、`providers` 陣列等 NgModule 結構。
- ❌ 在 `core/` 內放入頁面或 UI 相關程式碼。
- ❌ 允許 UI 層繞過 Facade/Repository 直接注入核心服務。
- ❌ 未透過 MCP 或缺乏權限檢查的資料存取。

## ✅ 建議流程

1. 在 `core/xxx` 建立服務並封裝資料來源或運算邏輯。
2. 於 `shared/` 建立 Facade/Repository 供 UI 使用（避免 routes 直接依賴核心服務）。
3. 將跨功能常數或工具提煉為純函數（可放 `shared/utils`）。
4. 記錄服務的資料契約與變更於相關設計文件（例如 `AGENTS.md`、`docs/blueprint_schema.md`）。

---

*最後更新: 2025-11-10*
