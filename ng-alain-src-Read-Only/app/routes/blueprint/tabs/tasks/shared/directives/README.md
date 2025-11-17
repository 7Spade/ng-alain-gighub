# Shared Task Directives

此目錄保存跨任務頁面可共用的指令（structural / attribute directives）。撰寫指令時請遵循：

- 專注視圖行為或樣式封裝，不處理資料請求、錯誤狀態或商業邏輯；如需狀態請透過父層 signal/observable 傳入。
- 導入依賴時優先使用 `SHARED_IMPORTS` 中已提供的 Angular / ng-zorro / @delon 模組，避免零碎導入。
- 使用明確型別與嚴格模式（禁止 `any`），並對外暴露結構化 `@Input` / `@Output` 或 `Signal`。
- 提供 `README`、JSDoc 或內嵌註解說明用途與限制，必要時補充使用範例。
- 若指令專屬單一路徑請考慮放回 feature 目錄；僅當確定多處會復用時才放入此處。

提交前請檢查 lint/type-check，確保導入路徑與命名一致。*** End Patch{"error":"Invalid JSON: Expecting property name enclosed in double quotes: line 2 column 1 (char 1)"}*** End Patch

