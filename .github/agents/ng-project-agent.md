# ng-alain Project Agent

## 1. Project Snapshot
- **願景**：企業任務協作與審查系統，透過 Git-like Branch 模型與 48h staging 機制確保可追溯。
- **架構**：Angular 20（Standalone + Signals + OnPush）＋ ng-alain；資料層由 Supabase（Auth / Postgres / Storage / Edge Functions）提供。
- **技術棧**：Node 20.19.5、Yarn 4.9.2、ESLint + Prettier + Stylelint、Karma/Jasmine（單元）、Playwright（建議）。
- **最小依賴**：`routes → shared → core`，共用 UI 統一由 `SHARED_IMPORTS` 載入。

## 2. Branch & Workflow
1. **Main / Blueprint**：唯一真相來源；所有成果透過 PR 合併。
2. **Organization Branches**：各組織僅能填寫授權欄位，無法變更結構。
3. **Staging Area**：破壞性操作先入 staging，可在 48h 內 rollback。
4. **流程**：`@C7` 取得官方資訊 → `docs-index.md` 對應內部文件 → `@S7` 拆解 → `@SPT` 計畫 → 每個步驟皆驗證 lint/type-check/test/build。

## 3. Data & API
- 51 張表分成 11 模組（帳戶、協作、權限、藍圖、任務、品質、問題、溝通、分析、Bot、系統）。細節請見 `docs/22-完整SQL表結構定義.md` 與 `docs/23-資料表清單總覽.md`。
- API 主要透過 Supabase REST：`/auth/v1/*`（登入/Session）、`/rest/v1/blueprints|tasks|issues...`。每個呼叫都需遵守 `docs/26-API-接口詳細文檔.md` 與 `docs/50-RLS策略開發指南.md`。
- RLS 與 @delon/acl 雙層控管；Token 僅能透過 `@delon/auth TokenService` 管理。

## 4. Implementation Guardrails
- Standalone Components + `SHARED_IMPORTS`，Signals 用於 state / Input / Output / Queries，模板採 `@if/@for/@switch/@defer`。
- 預設 `ChangeDetectionStrategy.OnPush`，避免在模板直接呼叫昂貴計算；列表需 `track item.id`。
- 所有服務需曝露 typed API，錯誤經由 `NzMessageService` 或統一錯誤處理呈現。
- 文件、README、ADR 與程式碼同步；在 PR 描述中記錄受影響文件與測試。

## 5. Minimal Checklist
1. 引用 `docs-index.md` 找到來源，而非複製外部內容。
2. 每次變更皆附：影響範圍、風險、測試指令（lint/type-check/test/build）、回退方案。
3. 資料模型、API、RLS 若有調整，需同步 `docs/30-0-完整SQL表結構定義.md` 與對應章節。
4. 僅於 `@core`、`@shared` 匯出公共型別，禁止深層 alias。
5. 完成後更新 TODO 狀態並記錄驗證結果。

## 6. References
- `docs-index.md`
- `docs/00-開發作業指引.md`
- `docs/27-完整架構流程圖.mermaid.md`
- `docs/28-架構審查報告.md`
- `docs/30-0-完整SQL表結構定義.md`
- `docs/33-API-接口詳細文檔.md`
- `docs/43-Agent開發指南與限制說明.md`
