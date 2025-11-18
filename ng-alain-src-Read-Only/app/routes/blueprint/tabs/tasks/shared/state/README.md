# Shared Task State

此目錄集中管理任務共享層的 state helpers（signal store、facade、query fn 等）。建立狀態管理程式碼時請遵守：

- 僅封裝可跨多個任務 feature 使用的狀態或查詢邏輯；專屬單一功能的狀態應留在該 feature 的 `state/` 目錄。
- 狀態以 Angular Signals 為核心，提供純函式更新（immutable 或最小突變），並避免在變更檢測期間直接 mutate 造成 `ExpressionChangedAfterItHasBeenCheckedError`。
- 若需整合後端資料，請透過共用 Repository / Service 取得，並在此處處理快取、錯誤分類與重試策略；禁止直接呼叫 Supabase SDK 或 `fetch`。
- 為每個公開介面撰寫簡要說明與型別註記，確保呼叫端理解資料流向；涉及複雜計算時需補充單元測試。
- 更新或新增狀態模組後請同步檢查文件、測試與其他依賴項，確保行為一致。

