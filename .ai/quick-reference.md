# 快速參考指南

> **目的**：為 AI 提供項目的快速參考信息，幫助快速理解項目核心概念和常用操作。

## 🎯 項目核心概念

### Git-like 分支模型

- **藍圖（Blueprint）**：主項目，類似 Git 的主分支
- **組織分支（Organization Branch）**：協作組織的工作分支
- **PR（Pull Request）**：分支合併請求，需要審核
- **暫存區（Staging Area）**：48 小時可撤回的暫存區域

### 任務管理

- **任務（Task）**：樹狀結構的任務
- **待辦中心**：五種狀態的任務聚合
  - 🟦 待執行 (task_lists)
  - 🟨 暫存中 (task_staging)
  - 🟧 品管中 (quality_checks)
  - 🟥 驗收中 (inspections)
  - ⚠️ 問題追蹤 (issues)

## 📊 數據庫概覽

系統共包含 **51 張資料表**，分為 11 個模組：

1. **帳戶與身份系統** (4 張)：accounts, teams, team_members, organization_schedules
2. **組織協作系統** (3 張)：organization_collaborations, collaboration_invitations, collaboration_members
3. **權限系統** (5 張)：roles, user_roles, permissions, role_permissions, branch_permissions
4. **藍圖/專案系統** (5 張)：blueprints, blueprint_configs, blueprint_branches, branch_forks, pull_requests
5. **任務執行系統** (9 張)：tasks, task_assignments, task_lists, task_staging, daily_reports, report_photos, weather_cache, task_dependencies, task_templates
6. **品質驗收系統** (4 張)：quality_checks, qc_photos, inspections, inspection_photos
7. **問題追蹤系統** (4 張)：issues, issue_assignments, issue_photos, issue_sync_logs
8. **協作溝通系統** (6 張)：comments, notifications, notification_rules, notification_subscriptions, personal_todos, todo_status_tracking
9. **資料分析系統** (6 張)：documents, document_versions, document_thumbnails, progress_tracking, activity_logs, analytics_cache
10. **機器人系統** (3 張)：bots, bot_tasks, bot_execution_logs
11. **系統管理** (2 張)：settings, feature_flags

## 🔌 API 概覽

### 認證 API

- `POST /auth/v1/signup` - 用戶註冊
- `POST /auth/v1/login` - Email 登入
- `POST /auth/v1/token?grant_type=refresh_token` - Token 刷新
- `GET /auth/v1/user` - 獲取用戶資訊
- `POST /auth/v1/logout` - 登出

### 藍圖/專案 API

- `GET /rest/v1/blueprints` - 查詢專案列表
- `GET /rest/v1/blueprints?id=eq.{id}` - 查詢專案詳情
- `POST /rest/v1/blueprints` - 建立專案
- `PATCH /rest/v1/blueprints?id=eq.{id}` - 更新專案
- `DELETE /rest/v1/blueprints?id=eq.{id}` - 刪除專案

### 任務管理 API

- `GET /rest/v1/tasks?blueprint_id=eq.{id}` - 查詢任務列表
- `GET /rest/v1/tasks?id=eq.{id}&select=*,task_assignments!inner` - 任務詳情含指派
- `POST /rest/v1/tasks` - 建立任務
- `PATCH /rest/v1/tasks?id=eq.{id}` - 更新任務
- `POST /rest/v1/task_assignments` - 指派任務

## 🛠️ 技術棧快速參考

### 前端

- **Angular 20.3.x** - 前端框架
- **ng-zorro-antd 20.3.x** - UI 組件庫
- **ng-alain 20.0.x** - 企業級 UI 解決方案
- **TypeScript** - 嚴格模式

### 後端

- **Supabase** - BaaS 平台
  - PostgreSQL 數據庫
  - Authentication
  - Storage
  - Realtime
  - Edge Functions

### 開發工具

- **Yarn 4.9.2** - 包管理器
- **ESLint** - 代碼檢查
- **Prettier** - 代碼格式化
- **Stylelint** - 樣式檢查
- **Karma + Jasmine** - 測試框架

## 📁 項目結構

```
src/app/
├── core/          # 核心基礎設施層
├── shared/        # 共享層（可重用組件、服務、工具）
├── routes/        # 路由層（功能頁面）
└── layout/        # 佈局層
```

## 🔗 關鍵文檔

- [完整架構流程圖](../../docs/27-完整架構流程圖.mermaid.md) ⭐⭐⭐⭐⭐
- [架構審查報告](../../docs/28-架構審查報告.md) ⭐⭐⭐⭐⭐
- [資料表結構定義](../../docs/30-0-完整SQL表結構定義.md) ⭐⭐⭐⭐⭐
- [API 接口詳細文檔](../../docs/33-API-接口詳細文檔.md)
- [開發規範](../../AGENTS.md)

---

**最後更新**：2025-01-15

