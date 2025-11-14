# API 規範摘要（Development Mode）

> 來源：`docs/33-API-接口詳細文檔.md`、`docs/25-API-介面映射圖.mermaid.md`

## 認證與基礎
- `POST /auth/v1/signup`, `POST /auth/v1/login`, `POST /auth/v1/token`, `GET /auth/v1/user`, `POST /auth/v1/logout`。
- 所有 REST 呼叫需附 `apikey` + `Authorization: Bearer {access_token}`，並遵守 RLS 規則。

## 主要 REST 資源
| 模組 | 端點重點 | 備註 |
|------|----------|------|
| **藍圖/分支** | `/rest/v1/blueprints`, `/rest/v1/blueprint_branches`, `/rest/v1/pull_requests`, `/rest/v1/branch_forks` | PR 審核流程需 `select=*,pull_requests(…)` 以取得狀態、審核者、變更摘要。 |
| **任務執行** | `/rest/v1/tasks`, `/rest/v1/task_assignments`, `/rest/v1/task_lists`, `/rest/v1/task_staging`, `/rest/v1/daily_reports` | `tasks` 使用 `ltree`，查詢子節點需 `?_lft @> '...'`（參考 docs）。 |
| **品質/驗收** | `/rest/v1/quality_checks`, `/rest/v1/inspections`, `/rest/v1/qc_photos`, `/rest/v1/inspection_photos` | QC/驗收整合責任切割欄位（`handover_at`, `responsibility_shift`）。 |
| **問題追蹤** | `/rest/v1/issues`, `/rest/v1/issue_assignments`, `/rest/v1/issue_sync_logs` | 所有問題自動 `replica=true` 同步至主分支。 |
| **文件/證書** | `/rest/v1/documents`, `/rest/v1/document_versions`, `/rest/v1/document_thumbnails` | `type='certificate'` 用於培訓/合規證書。 |
| **通知/待辦** | `/rest/v1/notifications`, `/rest/v1/notification_rules`, `/rest/v1/personal_todos` | 待辦中心與通知統一拉取，支援 `status=in.(pending,in_progress)` 條件。 |
| **分析/活動** | `/rest/v1/progress_tracking`, `/rest/v1/activity_logs`, `/rest/v1/analytics_cache` | 大部分查詢需 `select=*,organization:organizations(name)` 等 join。

## Storage / Edge Functions
- Supabase Storage bucket：`project-files`（施工日誌）、`qa-photos`、`certificates` 等；透過簽章 URL 存取。
- 建議以 Edge Function（`/functions/v1/pr-diff` 等）封裝複雜邏輯，如 PR 差異計算、縮圖、病毒掃描。

## Realtime / WebSocket
- 使用 `supabase.channel('branch:{id}')` 監聽 `tasks`, `issues`, `pull_requests` 變動；注意 ACL 與節流。

## 錯誤處理
- API 返回 4xx/5xx 需對應 `docs/37-錯誤處理指南.md` 的錯誤碼分類。
- 表單請求採 typed DTO，前端以 Angular Signals + Zod/TypeScript 型別驗證。

## 測試基準
- 為每個主要端點撰寫 Postman / REST Client 範本並在 CI 進行 Smoke Test。
- 重要 Edge Function 需具備自動化單元測試與超時保護（<5s）。
