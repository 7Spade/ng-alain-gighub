# Shared Task Forms

此目錄存放任務共享層的 Typed Forms、表單建構器、驗證器與表單相關工具。請遵循：

- 以 Angular Typed Forms（或 signal-based forms）實作，維持欄位型別與 Supabase schema 對齊；避免使用 `any` 或隱含型別。
- 封裝建立 / 編輯任務時會共用的欄位組合、預設值與驗證規則；單一 feature 專用的表單仍應留在對應 feature 下。
- 表單互動邏輯（例如 dirty state、暫存值）應留在組件或 facade；此處僅提供建構器、validators、轉換 helper。
- 提供必要的 JSDoc 或 README 註解，說明欄位結構、驗證條件與範例用法，方便其他模組導入。
- 每次調整欄位定義或驗證規則時，請同步更新對應測試與文件，並檢查所有消費端是否符合新合約。*** End Patch{"error":"Invalid JSON: Expecting property name enclosed in double quotes: line 2 column 1 (char 1)"}*** End Patch

