# User Story：證書列表與審核

## Story
As a **品管主管或業主審核者**
I want **在專案/分支層看到所有由承攬商提交的證書清單並快速比對狀態**
So that **我能在 PR 審核或驗收流程中確認所有必備證件都已齊全且有效**

## 驗收標準
1. 於分支儀表板、待辦中心、PR 審核介面提供「證書列表」面板，可依任務、證書類型、有效日期、狀態（待審、已核准、退回）過濾。
2. 列表需顯示：證書名稱、關聯任務/QC/驗收、上傳者、上傳時間、版本數、到期日、審核結果與備註。
3. 支援檢視單一證書詳情（含歷次版本與下載鏈結），並可在同頁完成審核：核准、退回（附理由）、標記到期提醒。
4. 與 PR 審核整合：若 PR 涉及的任務缺少必須證書，系統需在審核摘要中加註警示並阻止合併（可由擁有者 override）。
5. 所有審核動作寫入 `activity_logs` 與 `document_versions`（欄位 `review_status`, `reviewed_by` 等），並觸發通知給上傳者與相關任務負責人。
6. 列表需遵守 RLS與權限矩陣：承攬商僅看見自己分支，業主/品管可切換主分支與任何協作分支。

## 技術要求
- 後端 REST 查詢使用 `/rest/v1/document_versions?type=eq.certificate&select=...` 搭配 `documents`、`tasks`、`quality_checks` join（參考 `docs/33-API-接口詳細文檔.md`）。
- 透過 `issues` / `task_lists` 資料同步，於待辦中心顯示缺失證書的快捷操作。
- 需要 Signal `computed` 產生衍生狀態（例如缺件數量），並使用 `@for (...; track certificate.id)` 減少 rerender。
- 列表應支援分頁與 csv 匯出，並標示來源分支、PR 編號與責任切割狀態。
- 若證書即將到期（<=30 天）應自動建立個人待辦（`personal_todos`）並寄出通知。

## 相關文檔
- `docs/PRD.md`（協作溝通 / 品質驗收 / 文件管理章節）
- `docs/30-資料表清單總覽.md`（documents*, progress_tracking, activity_logs）
- `docs/33-API-接口詳細文檔.md`
- `docs/35-開發工作流程.md`（待辦中心整合）
