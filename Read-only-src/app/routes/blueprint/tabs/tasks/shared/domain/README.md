# Shared Task Domain

此目錄承載跨任務功能共享的 Domain Service 或純領域邏輯，與 UI / 資料存取層解耦。開發時請遵循：

- 僅處理計算規則、業務驗證、權限判斷等領域邏輯；不得直接呼叫 HTTP / Supabase，需透過 repository 傳遞資料。
- 以純函式或 `@Injectable({ providedIn: 'root' })` + `inject()` 撰寫，維持可測性與單一責任；避免引入 UI 相關依賴。
- 型別需與資料模型保持一致，發現 schema 差異時應優先修正模型而非以 `as any` 覆蓋。
- 提供適當文件與範例，說明服務用途、輸入輸出與例外情境；複雜流程請附單元測試確保行為穩定。
- 專屬單一路徑的領域邏輯請留在各 feature 的 `domain/` 目錄，僅將可重複使用的部分提升到 shared。

