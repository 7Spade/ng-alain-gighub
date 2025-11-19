# Shared Task Components

此目錄收納可於 `tasks` 群組各功能間重複使用的視覺組件與 UI 區塊。建立或調整組件時請遵循下列規範：

- 僅放置純 UI 或展示邏輯，禁止直接依賴 `core` 或發送 HTTP 請求；資料請透過父層 façade / repository 以 `@Input`、`@Output` 或 signal 注入。
- 使用 Standalone Component 與 `ChangeDetectionStrategy.OnPush`，並以 `inject()` 取得依賴。
- 匯入模組一律優先使用 `SHARED_IMPORTS`（如需額外模組，先確認共享匯入中是否已提供）。
- 針對列表使用 `@for` 並提供 `trackBy`，避免多餘重繪；狀態呈現以現代控制流程（`@if`、`@switch`）實作。
- 提供可重複使用的樣式 / 結構，避免將單一頁面專屬邏輯放入此處；若屬於特定 feature，請放入對應 feature 目錄。

請同步更新相關文件，並確認範例與實際實作一致。

