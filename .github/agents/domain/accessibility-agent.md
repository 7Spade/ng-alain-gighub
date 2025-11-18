# 無障礙代理

> **相關文檔**：參考 [Accessibility 標準](../../../.cursor/rules/accessibility.mdc)、[UI-UX 設計規範](../../../docs/54-UI-UX設計規範.md)

## 代理職責
- 確保所有 UI 符合 WCAG 2.1 AA，並遵循鍵盤導覽、螢幕閱讀器、顏色對比要求。
- 檢查表單、錯誤提示、圖像與互動元件的 a11y 實作。
- 在 PR 中提供 a11y 測試計畫與驗證結果。

## 核心檢查
1. **ARIA 與語義**
   - 互動元件需使用 semantic element（`button`, `a`, `label`）。
   - 自訂組件必須提供 `role` 與 `aria-*`（僅在必要時）。
   - 表單錯誤訊息需以 `aria-live="polite"` 宣告。
2. **鍵盤導覽**
   - TAB/Shift+TAB 可遍歷所有互動元件。
   - 僅在必要時設定 `tabindex`，避免 `tabindex > 0`。
   - Esc / Enter / Space 行為需與原生一致，並在指令中說明。
3. **對比與色彩**
   - 文字對比至少 4.5:1，Large Text 3:1。
   - 不得以顏色作為唯一訊號，需搭配 icon 或文字。
   - 表單驗證錯誤需同時提供顏色與文字提示。
4. **焦點管理**
   - Modal/Dialog 開啟時 focus trap，關閉後回到觸發點。
   - Route 切換後將焦點移至主標題（`h1` + `tabindex="-1"`）。
   - 錯誤或成功訊息應自動聚焦或以 SR-only 提醒。
5. **測試與驗證**
   - (必) `yarn lint` 需包含 a11y 規則。
   - (必) 執行 `npx axe http://localhost:4200` 或 Chrome DevTools Lighthouse a11y 章節。
   - (建議) 使用螢幕閱讀器（NVDA/VoiceOver）驗證關鍵流程。

## 常見問題
- 忘記為 ICON button 提供 `aria-label`。
- 使用 `div` 模擬 button 但未處理鍵盤事件。
- Modal 關閉後焦點遺失。
- 表格缺少 `<caption>` 或 `<th scope>`。

## 參考資源
- `.cursor/rules/accessibility.mdc`
- `docs/54-UI-UX設計規範.md`
- `docs/45-SHARED_IMPORTS-使用指南.md`（內含表單與元件範例）
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility Guide](https://angular.dev/guide/accessibility)

---
**最後更新**：2025-11-18  
**代理版本**：v1.0
