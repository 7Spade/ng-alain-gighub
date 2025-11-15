# 資料庫遷移腳本

這個目錄包含所有資料庫遷移腳本。

## 命名規範

遷移檔案命名格式：`YYYYMMDDHHMMSS_description.sql`

例如：`20250115000001_create_accounts_table.sql`

## 遷移腳本組織

根據 51 張資料表架構，遷移腳本應按模組組織：

### 1. 帳戶與身份系統（4 張表）
- `accounts` - 帳戶表
- `teams` - 團隊表
- `team_members` - 團隊成員表
- `organization_schedules` - 組織排班表

### 2. 組織協作系統（3 張表）
- `organization_collaborations` - 組織協作關係表
- `collaboration_invitations` - 協作邀請表
- `collaboration_members` - 協作成員表

### 3. 權限系統（5 張表）
- `roles` - 角色表
- `user_roles` - 用戶角色表
- `permissions` - 權限表
- `role_permissions` - 角色權限表
- `branch_permissions` - 分支權限表

### 4. 藍圖/專案系統（5 張表）
- `blueprints` - 藍圖主分支表
- `blueprint_configs` - 藍圖配置表
- `blueprint_branches` - 藍圖分支表
- `branch_forks` - 分支 Fork 記錄表
- `pull_requests` - Pull Request 表

### 5. 任務執行系統（9 張表）
- `tasks` - 任務表（樹狀結構）
- `task_assignments` - 任務指派表
- `task_lists` - 待辦列表表
- `task_staging` - 任務暫存區表（48h 可撤回）
- `daily_reports` - 施工日誌表
- `report_photos` - 日誌照片表
- `weather_cache` - 天氣快取表
- `task_dependencies` - 任務依賴表
- `task_templates` - 任務模板表

### 6. 品質驗收系統（4 張表）
- `quality_checks` - 品質檢查表
- `qc_photos` - 品檢照片表
- `inspections` - 驗收表
- `inspection_photos` - 驗收照片表

### 7. 問題追蹤系統（4 張表）
- `issues` - 問題表
- `issue_assignments` - 問題指派表
- `issue_photos` - 問題照片表
- `issue_sync_logs` - 問題同步記錄表

### 8. 協作溝通系統（6 張表）
- `comments` - 留言表
- `notifications` - 通知表
- `notification_rules` - 通知規則表
- `notification_subscriptions` - 通知訂閱表
- `personal_todos` - 個人待辦表
- `todo_status_tracking` - 待辦狀態追蹤表

### 9. 資料分析系統（6 張表）
- `documents` - 文件表
- `document_versions` - 文件版本表
- `document_thumbnails` - 文件縮圖表
- `progress_tracking` - 進度追蹤表
- `activity_logs` - 活動記錄表
- `analytics_cache` - 分析快取表

### 10. 機器人系統（3 張表）
- `bots` - 機器人表
- `bot_tasks` - 機器人任務表
- `bot_execution_logs` - 機器人執行記錄表

### 11. 系統管理（2 張表）
- `settings` - 系統設定表
- `feature_flags` - 功能開關表

## RLS 策略

每個遷移腳本應包含對應的 Row Level Security (RLS) 策略。

參考文檔：`docs/21-安全與-RLS-權限矩陣.md`

## 使用 Supabase MCP 工具

所有遷移操作必須透過 Supabase MCP 工具執行：

```typescript
// 執行遷移
await supabase.applyMigration(migrationName, sqlScript);

// 驗證結構
await supabase.executeSQL('SELECT * FROM information_schema.tables');
```

## 參考文檔

- [完整 SQL 表結構定義](../../docs/30-0-完整SQL表結構定義.md)
- [資料表清單總覽](../../docs/30-資料表清單總覽.md)
- [安全與 RLS 權限矩陣](../../docs/21-安全與-RLS-權限矩陣.md)
