# Shared Task Constants

此目錄集中管理任務領域會跨頁面共用的常數、列舉與設定（例如狀態列表、優先級、路由片段、快取 key）。撰寫時請遵循：

- 使用具語意的命名，提供明確型別（`const enum`、`as const` 陣列、`Record` 等），禁止僅以 `string` 或 `any` 表示。
- 若常數與 Supabase schema 或後端枚舉綁定，需在文件標註來源並於 schema 變更時同步更新。
- 禁止存放可變物件或需在執行期寫入的內容；若為設定值請考慮放入 configuration service 或環境變數。
- 新增常數前先檢查是否已有既有定義，避免重複宣告；必要時將通用常數提升至 `shared/` 其他層或 `core/`。
- 更新常數後需檢視受影響的表單驗證、UI 顯示與測試，確保一致性。*** End Patch{"error":"Invalid JSON: Expecting property name enclosed in double quotes: line 2 column 1 (char 1)"}*** End Patch

