# Current Architecture Notes (2025-11)

> 依據 `docs/27-完整架構流程圖.mermaid.md`、`docs/44-專案路線圖.md`、`PRD.md` 摘要，用於更新 mermaid 圖表（12–15、22–26）。

## 帳戶與分支治理
- `accounts`, `teams`, `organization_collaborations`, `branch_forks`, `blueprint_branches`, `pull_requests`, `pull_request_reviews` 組成 Git-like 承攬模型。
- `branch_roles`, `branch_permissions`, `role_permissions` 共同透過 RLS 控制承攬欄位。
- 暫存區（48h 可撤回）與待辦中心五態（待執行/暫存/品管/驗收/問題）為跨模組核心狀態。

## 任務與資料流
- 任務執行：`tasks` → `daily_reports` → `quality_checks` → `progress_tracking`，同步寫入 `activity_logs`、`issues`。
- 日誌與品管均可附檔案（Storage Buckets: `images/*`, `documents/*`, `drawings/*`）。
- `issues`, `issue_assignments`, `issue_comments` 即時同步至主分支。

## CI/CD 與可觀測性
- Pipeline：Lint/Type-check → Unit tests → Build → Supabase migrations → Edge Functions deploy → Playwright/E2E → Release。
- Observability：Supabase Logs、Edge Function metrics、前端 Web Vitals、活動記錄、PRD OKR 儀表板。

## ETL 與資料生命週期
- ETL job 擷取：Supabase (OLTP) → Edge Function Extract → Storage staging → Transform（Supabase Functions + SQL）→ Load 至 `analytics_*` 物化視圖。
- 冷資料移至 Storage/Archive；敏感資料透過 RLS + Supabase masking。

## API 與 Storage
- API gateway 對應 `docs/25`：Auth、Blueprints、Branches/PR、Tasks、Reports、Issues、Files、Notifications。
- Storage bucket：`blueprint-assets`, `task-attachments`, `qa-evidence`, `issue-attachments`, `public-assets`，均有 lifecycle policy（30 天軟刪除）。

> 以上筆記供圖表同步使用，如有架構調整請先更新此文件再重繪相關 mermaid 圖。

