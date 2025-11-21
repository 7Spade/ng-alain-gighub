# 需要重新設計的頁面清單

> 📋 **目的**：快速查詢所有需要適應 Workspace Context Manager 的頁面

**最後更新**：2025-01-21  
**總頁面數**：86 個  
**已完成**：8 個（9.3%）  
**完整文檔**：[workspace-context-migration-plan.md](./workspace-context-migration-plan.md)

---

## 📊 統計總覽

| 優先級 | 數量 | 模組數 | 預計時程 | 狀態 |
|--------|------|--------|---------|------|
| P0 - 立即實施 | 35 | 4 | 2 週 | 🟡 進行中 |
| P1 - 短期實施 | 28 | 4 | 2 週 | 🔴 待處理 |
| P2 - 長期實施 | 22 | 5 | 2 週 | 🔴 待處理 |
| **總計** | **86** | **13** | **6 週** | - |

---

## 🎯 P0 - 立即實施（35 個頁面）

### 任務管理模組（12 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 1 | `/tasks/list` | task-list.component | User/Org/Team | ✅ 已整合 |
| 2 | `/tasks/calendar` | task-calendar.component | User/Org/Team | ✅ 已整合 |
| 3 | `/tasks/board` | task-board.component | User/Org/Team | ✅ 已整合 |
| 4 | `/tasks/tree` | task-tree.component | User/Org/Team | ✅ 已整合 |
| 5 | `/tasks/todo` | task-todo.component | User/Org/Team | ✅ 已整合 |
| 6 | `/tasks/assignments` | task-assignments.component | User/Org/Team | ✅ 已整合 |
| 7 | `/tasks/detail` | task-detail.component | User/Org/Team | ✅ 已整合 |
| 8 | `/tasks/form` | task-form.component | Org/Team | 🔴 待處理 |
| 9 | `/tasks/daily-reports` | daily-reports.component | Org/Team | 🔴 待處理 |
| 10 | `/tasks/photos` | task-photos.component | Org/Team | 🔴 待處理 |
| 11 | `/tasks/weather` | task-weather.component | Org/Team | 🔴 待處理 |
| 12 | `/tasks/progress` | progress-tracking.component | Org/Team | 🔴 待處理 |

### 藍圖管理模組（11 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 13 | `/blueprints` | blueprint-list.component | User/Org | 🔴 待處理 |
| 14 | `/blueprints/create` | blueprint-form.component | Org | 🔴 待處理 |
| 15 | `/blueprints/detail` | blueprint-detail.component | User/Org | 🔴 待處理 |
| 16 | `/blueprints/settings` | blueprint-settings.component | Org | 🔴 待處理 |
| 17 | `/blueprints/main-branch` | blueprint-main-branch.component | Org | 🔴 待處理 |
| 18 | `/blueprints/branches` | branch-management.component | Org | 🔴 待處理 |
| 19 | `/blueprints/branch-detail` | branch-detail.component | Org | 🔴 待處理 |
| 20 | `/blueprints/fork` | blueprint-fork.component | Org | 🔴 待處理 |
| 21 | `/blueprints/pull-requests` | pull-request-list.component | Org | 🔴 待處理 |
| 22 | `/blueprints/pull-requests/detail` | pull-request-detail.component | Org | 🔴 待處理 |
| 23 | `/blueprints/review` | pr-review.component | Org | 🔴 待處理 |

### 問題追蹤模組（8 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 24 | `/issues` | issue-list.component | Org/Team | 🔴 待處理 |
| 25 | `/issues/create` | issue-form.component | Org/Team | 🔴 待處理 |
| 26 | `/issues/detail` | issue-detail.component | Org/Team | 🔴 待處理 |
| 27 | `/issues/assignments` | issue-assignments.component | Org/Team | 🔴 待處理 |
| 28 | `/issues/handle` | issue-handle.component | Org/Team | 🔴 待處理 |
| 29 | `/issues/photos` | issue-photos.component | Org/Team | 🔴 待處理 |
| 30 | `/issues/close` | issue-close.component | Org/Team | 🔴 待處理 |
| 31 | `/issues/sync-logs` | issue-sync-logs.component | Org | 🔴 待處理 |

### 文檔管理模組（4 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 32 | `/documents` | document-list.component | User/Org/Team | 🔴 待處理 |
| 33 | `/documents/upload` | document-upload.component | User/Org/Team | 🔴 待處理 |
| 34 | `/documents/preview` | document-preview.component | User/Org/Team | 🔴 待處理 |
| 35 | `/documents/versions` | document-version.component | Org | 🔴 待處理 |

---

## 🟡 P1 - 短期實施（28 個頁面）

### 品質管理模組（7 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 36 | `/quality/checks` | quality-checks.component | Org | 🔴 待處理 |
| 37 | `/quality/checks/detail` | quality-check-detail.component | Org | 🔴 待處理 |
| 38 | `/quality/submit` | quality-submit.component | Org | 🔴 待處理 |
| 39 | `/quality/inspections` | quality-inspections.component | Org | 🔴 待處理 |
| 40 | `/quality/inspections/detail` | inspection-detail.component | Org | 🔴 待處理 |
| 41 | `/quality/photos` | quality-photos.component | Org | 🔴 待處理 |
| 42 | `/quality/results` | quality-results.component | Org | 🔴 待處理 |

### 溝通協作模組（9 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 43 | `/communication/discussions` | discussion-list.component | Org/Team | 🔴 待處理 |
| 44 | `/communication/comments` | comment-list.component | Org/Team | 🔴 待處理 |
| 45 | `/communication/comments/create` | comment-create.component | Org/Team | 🔴 待處理 |
| 46 | `/communication/notifications` | notification-center.component | User/Org | 🔴 待處理 |
| 47 | `/communication/notifications/detail` | notification-detail.component | User/Org | 🔴 待處理 |
| 48 | `/communication/notifications/rules` | notification-rules.component | Org | 🔴 待處理 |
| 49 | `/communication/realtime` | realtime-notify.component | Org | 🔴 待處理 |
| 50 | `/communication/todos` | todo-center.component | User/Org/Team | 🔴 待處理 |
| 51 | `/communication/team-notify` | team-notify.component | Org/Team | 🔴 待處理 |

### 數據分析模組（11 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 52 | `/analytics/statistics` | statistics.component | Org | 🔴 待處理 |
| 53 | `/analytics/progress` | progress-tracking.component | Org | 🔴 待處理 |
| 54 | `/analytics/progress-update` | progress-update.component | Org | 🔴 待處理 |
| 55 | `/analytics/main-reports` | main-report.component | Org | 🔴 待處理 |
| 56 | `/analytics/branch-reports` | branch-report.component | Org | 🔴 待處理 |
| 57 | `/analytics/cross-branch` | cross-branch.component | Org | 🔴 待處理 |
| 58 | `/analytics/activity-logs` | activity-log.component | Org | 🔴 待處理 |
| 59 | `/analytics/activity-logs/detail` | activity-log-detail.component | Org | 🔴 待處理 |
| 60 | `/analytics/reports` | data-report.component | Org | 🔴 待處理 |
| 61 | `/analytics/export` | report-export.component | Org | 🔴 待處理 |
| 62 | `/analytics/charts` | chart-center.component | Org | 🔴 待處理 |

### 帳戶管理模組（1 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 63 | `/accounts/org` | org.component | Org | ✅ 已整合 |

---

## 🟢 P2 - 長期實施（22 個頁面）

### 協作管理模組（4 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 64 | `/collaboration/list` | collaboration-list.component | Org | 🔴 待處理 |
| 65 | `/collaboration/create` | collaboration-form.component | Org | 🔴 待處理 |
| 66 | `/collaboration/detail` | collaboration-detail.component | Org | 🔴 待處理 |
| 67 | `/collaboration/invitations` | invitation-list.component | Org | 🔴 待處理 |

### 組織管理模組（8 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 68 | `/accounts/org/:id/members` | org-members.component | Org | 🔴 待處理 |
| 69 | `/accounts/org/:id/teams` | teams.component | Org | 🔴 待處理 |
| 70 | `/accounts/org/teams/:id/members` | team-members.component | Team | 🔴 待處理 |
| 71 | `/accounts/form` | account-form.component | User/Org | 🔴 待處理 |
| 72 | `/accounts/detail` | account-detail.component | User/Org | 🔴 待處理 |
| 73 | `/accounts/create/organization` | create-organization.component | User | 🔴 待處理 |
| 74 | `/accounts/create/bot` | create-bot.component | Org | 🔴 待處理 |
| 75 | `/accounts/org/schedules` | schedule-list.component | Org | 🔴 待處理 |

### 文檔管理進階功能（4 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 76 | `/documents/browser` | document-browser.component | Org | 🔴 待處理 |
| 77 | `/documents/metadata` | document-metadata.component | Org | 🔴 待處理 |
| 78 | `/documents/permissions` | document-permission.component | Org | 🔴 待處理 |
| 79 | `/documents/drawings` | drawing-viewer.component | Org | 🔴 待處理 |

### 系統設置模組（3 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 80 | `/system/settings/personal` | personal-settings.component | User | 🔴 待處理 |
| 81 | `/system/settings/project` | project-settings.component | Org | 🔴 待處理 |
| 82 | `/system/settings/global` | global-settings.component | Org | 🔴 待處理 |
| 83 | `/system/permissions` | permission-assignment.component | Org | 🔴 待處理 |

### 機器人管理模組（3 個）

| # | 路徑 | 元件 | 上下文 | 狀態 |
|---|------|------|--------|------|
| 84 | `/bots/list` | bot-list.component | Org | 🔴 待處理 |
| 85 | `/bots/config` | bot-config.component | Org | 🔴 待處理 |
| 86 | `/bots/executions` | bot-execution.component | Org | 🔴 待處理 |

---

## 📋 按模組分類統計

| 模組 | P0 | P1 | P2 | 總計 | 已完成 | 完成率 |
|------|----|----|-------|------|--------|--------|
| 任務管理 | 12 | 0 | 0 | 12 | 7 | 58% |
| 藍圖管理 | 11 | 0 | 0 | 11 | 0 | 0% |
| 問題追蹤 | 8 | 0 | 0 | 8 | 0 | 0% |
| 文檔管理 | 4 | 0 | 4 | 8 | 0 | 0% |
| 品質管理 | 0 | 7 | 0 | 7 | 0 | 0% |
| 溝通協作 | 0 | 9 | 0 | 9 | 0 | 0% |
| 數據分析 | 0 | 11 | 0 | 11 | 0 | 0% |
| 帳戶管理 | 0 | 1 | 8 | 9 | 1 | 11% |
| 協作管理 | 0 | 0 | 4 | 4 | 0 | 0% |
| 系統設置 | 0 | 0 | 3 | 3 | 0 | 0% |
| 機器人管理 | 0 | 0 | 3 | 3 | 0 | 0% |
| **總計** | **35** | **28** | **22** | **86** | **8** | **9.3%** |

---

## 🎯 按上下文分類

### 支援所有上下文（User + Org + Team）（13 個）

- task-list, task-calendar, task-board ✅, task-tree, task-todo ✅, task-assignments ✅, task-detail
- document-list, document-upload, document-preview
- todo-center

### 支援雙上下文（22 個）

**User + Org**（4 個）：
- blueprint-list, blueprint-detail
- notification-center, notification-detail

**Org + Team**（18 個）：
- task-form, daily-reports, task-photos, task-weather, progress-tracking
- issue-list, issue-form, issue-detail, issue-assignments, issue-handle, issue-photos, issue-close
- discussion-list, comment-list, comment-create, team-notify

### 僅組織上下文（Org Only）（49 個）

- 藍圖管理：blueprint-form, blueprint-settings, main-branch, branch-management, branch-detail, fork, pull-request-list, pull-request-detail, pr-review
- 品質管理：quality-checks, quality-check-detail, quality-submit, quality-inspections, inspection-detail, quality-photos, quality-results
- 數據分析：statistics, progress-tracking, progress-update, main-report, branch-report, cross-branch, activity-log, activity-log-detail, data-report, report-export, chart-center
- 協作管理：collaboration-list, collaboration-form, collaboration-detail, invitation-list
- 組織管理：org-members, teams, create-bot, schedule-list
- 文檔進階：document-browser, document-metadata, document-permission, drawing-viewer, document-version
- 系統設置：project-settings, global-settings, permission-assignment
- 機器人：bot-list, bot-config, bot-execution
- 溝通：notification-rules, realtime-notify
- 問題：issue-sync-logs
- 帳戶：org ✅

### 僅個人上下文（User Only）（2 個）

- personal-settings
- create-organization

### 僅團隊上下文（Team Only）（1 個）

- team-members

---

## 🔄 實施流程

### 階段一：P0（Week 1-2）

**目標**：核心功能可用

1. **Week 1 Day 1-2**：任務管理（6 個）
   - task-list, task-calendar, task-tree, task-detail, task-form, daily-reports
   
2. **Week 1 Day 3-4**：藍圖管理（6 個）
   - blueprint-list, blueprint-form, blueprint-detail, blueprint-settings, main-branch, branches
   
3. **Week 1 Day 5**：Code Review

4. **Week 2 Day 1-2**：問題追蹤（8 個）
   - 所有 issues 頁面
   
5. **Week 2 Day 3**：文檔管理（4 個）
   - document-list, document-upload, document-preview, document-version
   
6. **Week 2 Day 4-5**：測試與修復

### 階段二：P1（Week 3-4）

**目標**：重要功能整合

1. **Week 3**：品質管理 + 溝通協作
2. **Week 4**：數據分析 + 測試

### 階段三：P2（Week 5-6）

**目標**：次要功能整合

1. **Week 5**：協作管理 + 組織管理 + 文檔進階 + 系統設置
2. **Week 6**：機器人管理 + 完整測試 + 文檔更新

---

## 📝 核心設計原則

### 1. 移除 URL 參數

❌ **舊寫法**：
```typescript
this.route.queryParams.subscribe(params => {
  const orgId = params['org'];
  const teamId = params['team'];
});
```

✅ **新寫法**：
```typescript
private readonly contextFacade = inject(WorkspaceContextFacade);

effect(() => {
  const contextType = this.contextFacade.contextType();
  const contextId = this.contextFacade.contextId();
});
```

### 2. 根據上下文過濾資料

```typescript
effect(() => {
  const contextType = this.contextType();
  const contextId = this.contextId();
  
  switch (contextType) {
    case 'user':
      this.loadUserData(contextId!);
      break;
    case 'organization':
      this.loadOrganizationData(contextId!);
      break;
    case 'team':
      this.loadTeamData(contextId!);
      break;
  }
});
```

### 3. 顯示上下文指示器

```typescript
readonly pageTitle = computed(() => {
  const contextLabel = this.contextFacade.contextLabel();
  return `${contextLabel} - 頁面標題`;
});
```

### 4. 權限驗證

```typescript
readonly canCreate = computed(() => {
  const contextType = this.contextFacade.contextType();
  return contextType === 'organization' || contextType === 'team';
});
```

---

## 📚 相關文檔

- [完整遷移計畫](./workspace-context-migration-plan.md) - 詳細的設計需求與技術規範
- [Workspace Context 使用指南](./workspace-context-usage-guide.md) - 使用與規劃指南
- [Workspace System 快速參考](./workspace-system-quick-reference.md) - 開發者快速參考
- [個人上下文菜單說明](./user-context-menu-documentation.md) - User Context 詳細說明
- [組織上下文菜單說明](./organization-context-menu-documentation.md) - Organization Context 詳細說明
- [團隊上下文菜單說明](./team-context-menu-documentation.md) - Team Context 詳細說明

---

**文件維護**：
- **創建日期**：2025-01-20
- **最後更新**：2025-01-20
- **維護者**：開發團隊

**進度追蹤**：
- ✅ 已完成：6 個（7.0%）
- 🔴 待處理：80 個（93.0%）
- 📊 總計：86 個頁面
