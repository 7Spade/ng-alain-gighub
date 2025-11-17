# Shared Task Mappers

此目錄放置資料轉換與映射函式（DTO ↔ ViewModel、資料庫 ↔ Signal 狀態等）。請遵循以下規範：

- 保持純函式與可測性，不在 mapper 中執行副作用或非同步請求；如需附帶快取請交由 repository 處理。
- 對每個 mapper 指定完整型別簽章，確保欄位名稱、日期格式、金額精度等皆符合最新資料模型；遇到 schema 變更需同步更新。
- 優先重用既有 mapper，避免重複轉換邏輯；必要時可將共用步驟拆成私有 helper 以提升重用性。
- 若轉換包含校驗，請明確回報錯誤或回傳 `Result`/`Either` 類型，避免默默忽略不合法資料。
- 針對複雜映射撰寫單元測試覆蓋關鍵路徑，確保跨 feature 行為一致。*** End Patch{"status":"error","message":"Invalid JSON: Expecting property name enclosed in double quotes: line 2 column 1 (char 1)"}>*** End Patch

