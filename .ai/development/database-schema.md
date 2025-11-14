# 數據庫架構摘要（Development Mode）

> 來源：`docs/30-資料表清單總覽.md`、`docs/30-0-完整SQL表結構定義.md`、`docs/12-實體關係圖.mermaid.md`

## 模組概覽
1. **帳戶/身份 (4)**：`accounts`, `teams`, `team_members`, `organization_schedules`。
2. **協作 (3)**：`organization_collaborations`, `collaboration_invitations`, `collaboration_members`。
3. **權限 (5)**：`roles`, `permissions`, `role_permissions`, `user_roles`, `branch_permissions`。
4. **藍圖/分支 (5)**：`blueprints`, `blueprint_configs`, `blueprint_branches`, `branch_forks`, `pull_requests`。
5. **任務 (9)**：`tasks`, `task_assignments`, `task_lists`, `task_staging`, `task_dependencies`, `task_templates`, `daily_reports`, `report_photos`, `weather_cache`。
6. **品質/驗收 (4)**：`quality_checks`, `qc_photos`, `inspections`, `inspection_photos`。
7. **問題追蹤 (4)**：`issues`, `issue_assignments`, `issue_photos`, `issue_sync_logs`。
8. **協作溝通 (6)**：`comments`, `notifications`, `notification_rules`, `notification_subscriptions`, `personal_todos`, `todo_status_tracking`。
9. **資料分析 (6)**：`documents`, `document_versions`, `document_thumbnails`, `progress_tracking`, `activity_logs`, `analytics_cache`。
10. **Bot (3)**：`bots`, `bot_tasks`, `bot_execution_logs`。
11. **系統管理 (2)**：`settings`, `feature_flags`。

## 關聯重點
- **Git-like 流程**：`blueprints 1:N blueprint_branches 1:N pull_requests`，PR 存 diff metadata、審核狀態、責任人。
- **任務樹**：`tasks.path` 使用 `ltree`，`task_assignments`／`task_lists`／`task_staging` 以 `task_id` 鏈接；日誌/照片與任務 ID 綁定。
- **品質與責任切割**：`quality_checks` → `inspections` → `inspections.responsibility_shift`，同時將結果寫至 `activity_logs`。
- **文件/證書**：`documents` 為主檔、`document_versions` 管版本與狀態、`document_thumbnails` 提供預覽；與任務/QC/驗收/PR 綁定多對多關係（透過外鍵欄位）。
- **待辦中心資料來源**：`task_lists`, `task_staging`, `quality_checks`, `inspections`, `issues` 統一映射到 UI。

## 權限與 RLS
- 每張表皆啟用 RLS；`branch_permissions` 決定承攬商可見欄位，`accounts.organization_id` 控制資料隔離。
- 所有寫入操作需驗證「主分支 vs 分支」場景，確保承攬商無法變更任務結構。

## 資料一致性
- 重要事件需寫入 `activity_logs`（操作類型、payload JSON、操作者、IP）。
- `issues` 有 `replica`/`origin_branch_id` 欄位，確保跨分支同步。
- `analytics_cache` 採 Materialized View 模式（hourly/daily 等），需在資料更新後觸發刷新。

## 參考
- `docs/12-實體關係圖.mermaid.md`
- `docs/30-資料表清單總覽.md`
- `docs/30-0-完整SQL表結構定義.md`
