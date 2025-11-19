# Shared Task Queries

此目錄存放可供多個任務功能重用的查詢 / selector / 投影函式。實作時請遵循：

- 以 Angular Signals 或純函式實作，提供資料切片、聚合統計或快取存取邏輯；避免直接與 DOM 或 UI 相耦合。
- 僅操作 repository / state 暴露出的資料，禁止在此直接呼叫 HTTP / Supabase；如需額外資料，請透過共享 repository 取得。
- 為每個查詢提供明確的輸入、輸出型別與副作用註解，禁止使用 `any`；必要時搭配 `readonly` signal 以防止外部修改。
- 測試複雜查詢時請撰寫單元測試，確保計算正確與邊界案例（空集合、權限受限等）行為一致。
- 若查詢僅在單一 feature 使用，請放回該 feature 的 `queries/` 或 `state/` 目錄，避免 shared 出現過度專用邏輯。

