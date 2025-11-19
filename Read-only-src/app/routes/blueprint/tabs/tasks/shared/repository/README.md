# Shared Task Repository

此目錄集中任務共享層的資料存取邏輯（facade/repository）。撰寫程式碼時請遵循：

- 封裝對核心服務或 Supabase API 的調用，統一進出資料格式、快取策略與錯誤分類；UI 組件與 feature 服務應僅依賴這裡公開的方法。
- 使用明確的 DTO / ViewModel 型別，禁止 `any`；確保與 Supabase schema 對齊並提供必要的映射或驗證。
- 透過 `inject()` 取得依賴，並將副作用控制在此層（快取刷新、Retry 策略、error state integration 等）。
- 若邏輯僅服務單一 feature，請留在該 feature 的 `repository/` 目錄；僅在多個功能會共用時才搬至 shared。
- 更新或新增 repository 時，需同步補充單元測試與文件，並確認既有呼叫點未破壞既定合約。

## 現有 Repository

- `task-identity.repository.ts`：任務主檔 CRUD 與欄位映射。
- `task-event.repository.ts`：事件流（活動、品質檢驗等）讀寫與轉換。
- `task-facet.repository.ts`：通用 facet 儲存（summary/metadata）操作。
- `task-quality.repository.ts`：品質摘要、檢驗紀錄與 legacy quality_data 遷移。
- `task-risk.repository.ts`：風險項目 CRUD 與 `risk_data` 快照維護。
- `task-time.repository.ts`：任務時間欄位讀寫、依賴關係查詢、CPM 標記批次更新。
- `task-cost.repository.ts`：成本摘要/支出事件、legacy cost_data 清理。
- `task-communication.repository.ts`：溝通執行緒與訊息事件、legacy communication_data 清理。
- `task-document.repository.ts`：文件連結事件、Blueprint document CRUD、legacy document_data 遷移。

後續如擴充共享 repository，請在此處同步記錄檔名、職責與注意事項，以便搜尋與維護。
