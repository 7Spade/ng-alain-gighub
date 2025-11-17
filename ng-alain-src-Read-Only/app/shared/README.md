# Shared 層開發指南

> ⚠️ 已淘汰 `ShareModule`。所有共享元件與工具均以 Standalone Component、Shared Imports 方式提供。

## 🎯 職責範圍

`shared/` 承載可重用的 UI 與工具：

- `shared-imports.ts`、`shared-delon.module.ts`、`shared-zorro.module.ts`：統一模組匯入聚合（優先使用 `SHARED_IMPORTS`）。
- `components/`、`cell-widget/`、`st-widget/`：可重用的 Standalone 元件。
- `json-schema/`：表單與資料結構定義。
- `models/`：前端資料模型（對齊 Supabase schema）。
- `utils/`：純函數與共用工具。

## 🧩 元件與工具設計原則

- Standalone Component + `imports: [SHARED_IMPORTS]` 為預設結構。
- 使用 `inject()` 取得依賴，並以 Signals 管理狀態。
- 匯出公共 API 時使用 barrel（例如 `index.ts`）保持清晰的依賴界面。
- 工具函數維持純函數性，避免副作用；複雜邏輯留在專屬服務中。
- 若需對外提供 Facade/Repository，確保包裝核心服務並維持型別安全。

## 🚫 禁止事項

- ❌ 新增或維護 `ShareModule`/`providers` NgModule 結構。
- ❌ 在 `shared/` 內直接操作 Supabase 或任何資料庫 API。
- ❌ 依賴 `routes/` 或注入頁面專屬服務。
- ❌ 引入零碎 Angular/ng-zorro-antd 模組（請優先使用 `SHARED_IMPORTS`）。

## ✅ 建議流程

1. 先檢查是否已有共享元件或工具可復用，避免重複造輪。
2. 若需新增元件，建立 Standalone Component 並匯入 `SHARED_IMPORTS`。
3. 將 UI 邏輯與資料邏輯分離，資料取得交由 Facade/Repository。
4. 為複雜元件撰寫 README 或內嵌 JSDoc，並同步更新 `AGENTS.md` 規範。

---

*最後更新: 2025-11-10*
