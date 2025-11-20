# Workspace Context Manager 頁面重新設計需求明確化文件

> 📋 **目的**：枚舉需要重新設計以適應 Workspace Context Manager 的所有頁面，並提供明確的設計需求與實施指南

**文件版本**：v1.0  
**最後更新**：2025-01-20  
**狀態**：Draft  
**負責人**：開發團隊

---

## 📑 目錄

- [1. 概述](#1-概述)
- [2. 現況分析](#2-現況分析)
- [3. 需要重新設計的頁面清單](#3-需要重新設計的頁面清單)
- [4. 設計需求規範](#4-設計需求規範)
- [5. 實施優先級](#5-實施優先級)
- [6. 技術規範](#6-技術規範)
- [7. 測試策略](#7-測試策略)
- [8. 時程規劃](#8-時程規劃)

---

## 1. 概述

### 1.1 背景

我們已經實現了 Workspace Context Manager，提供三種工作視角：
- **個人視角**（User Context）：`user-data.json` - 15 個頁面，6 大模組
- **組織視角**（Organization Context）：`organization-data.json` - 70+ 個頁面，9 大模組
- **團隊視角**（Team Context）：`team-data.json` - 20 個頁面，5 大模組

### 1.2 問題陳述

目前系統中有 **189 個元件**，但只有 **4 個元件**已整合 WorkspaceContextFacade：
- `accounts/org/org.component.ts`
- `tasks/board/task-board.component.ts`
- `tasks/todo/task-todo.component.ts`
- `tasks/assignments/task-assignments.component.ts`

另外發現 **72 個元件**使用 `ActivatedRoute` 來獲取上下文參數（如 `org`、`team`），這些元件需要改用 Workspace Context Manager。

### 1.3 目標

1. **枚舉所有需要重新設計的頁面**
2. **明確每個頁面的設計需求**
3. **提供統一的技術實施指南**
4. **建立優先級與時程規劃**

---

## 2. 現況分析

### 2.1 已整合頁面（✅ 4 個）

| 頁面 | 模組 | 上下文 | 狀態 |
|------|------|--------|------|
| org.component.ts | Accounts | Organization | ✅ 已整合 |
| task-board.component.ts | Tasks | User/Org/Team | ✅ 已整合 |
| task-todo.component.ts | Tasks | User/Org/Team | ✅ 已整合 |
| task-assignments.component.ts | Tasks | User/Org/Team | ✅ 已整合 |

### 2.2 使用 ActivatedRoute 的頁面（🔶 72 個）

這些頁面目前通過 URL 查詢參數（`?org=xxx` 或 `?team=xxx`）獲取上下文，需要改用 WorkspaceContextFacade。

### 2.3 未明確使用上下文的頁面（⚠️ 113 個）

這些頁面可能：
- 不需要上下文（如 Login、Dashboard 等）
- 隱含依賴上下文但未明確使用
- 需要評估是否需要整合

---

## 3. 需要重新設計的頁面清單

### 3.1 高優先級頁面（P0 - 核心功能，35 個）

#### 3.1.1 任務管理模組（12 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 1 | `/tasks/list` | task-list.component | User/Org/Team | 根據上下文過濾任務列表 |
| 2 | `/tasks/calendar` | task-calendar.component | User/Org/Team | 根據上下文顯示日曆 |
| 3 | `/tasks/board` | task-board.component | User/Org/Team | ✅ 已整合 |
| 4 | `/tasks/tree` | task-tree.component | User/Org/Team | 根據上下文顯示樹狀圖 |
| 5 | `/tasks/todo` | task-todo.component | User/Org/Team | ✅ 已整合 |
| 6 | `/tasks/assignments` | task-assignments.component | User/Org/Team | ✅ 已整合 |
| 7 | `/tasks/detail` | task-detail.component | User/Org/Team | 顯示任務詳情與上下文資訊 |
| 8 | `/tasks/form` | task-form.component | Org/Team | 創建/編輯任務時選擇上下文 |
| 9 | `/tasks/daily-reports` | daily-reports.component | Org/Team | 根據上下文過濾日報 |
| 10 | `/tasks/photos` | task-photos.component | Org/Team | 根據上下文過濾施工照片 |
| 11 | `/tasks/weather` | task-weather.component | Org/Team | 根據上下文記錄天氣 |
| 12 | `/tasks/progress` | progress-tracking.component | Org/Team | 根據上下文顯示進度 |

**設計需求摘要**：
- 所有列表頁面需要根據當前上下文（User/Org/Team）自動過濾資料
- 詳情頁面需要顯示任務所屬的上下文資訊
- 表單頁面需要在創建時選擇或繼承上下文
- 移除 URL 查詢參數（`?org=xxx`、`?team=xxx`），改用 WorkspaceContextFacade

#### 3.1.2 藍圖管理模組（11 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 13 | `/blueprints` | blueprint-list.component | User/Org | 根據上下文顯示藍圖列表 |
| 14 | `/blueprints/create` | blueprint-form.component | Org | 僅組織上下文可創建 |
| 15 | `/blueprints/detail` | blueprint-detail.component | User/Org | 顯示藍圖詳情 |
| 16 | `/blueprints/settings` | blueprint-settings.component | Org | 僅組織上下文可設置 |
| 17 | `/blueprints/main-branch` | blueprint-main-branch.component | Org | 主分支管理 |
| 18 | `/blueprints/branches` | branch-management.component | Org | 分支管理 |
| 19 | `/blueprints/branch-detail` | branch-detail.component | Org | 分支詳情 |
| 20 | `/blueprints/fork` | blueprint-fork.component | Org | Fork 功能 |
| 21 | `/blueprints/pull-requests` | pull-request-list.component | Org | PR 列表 |
| 22 | `/blueprints/pull-requests/detail` | pull-request-detail.component | Org | PR 詳情 |
| 23 | `/blueprints/review` | pr-review.component | Org | PR 審查 |

**設計需求摘要**：
- 個人上下文：僅能查看個人藍圖（簡化版）
- 組織上下文：完整 Git-like 分支管理功能
- 團隊上下文：不顯示藍圖菜單（使用組織藍圖）
- 移除 URL 查詢參數，改用 WorkspaceContextFacade

#### 3.1.3 問題追蹤模組（8 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 24 | `/issues` | issue-list.component | Org/Team | 根據上下文過濾問題 |
| 25 | `/issues/create` | issue-form.component | Org/Team | 創建問題時選擇上下文 |
| 26 | `/issues/detail` | issue-detail.component | Org/Team | 顯示問題詳情 |
| 27 | `/issues/assignments` | issue-assignments.component | Org/Team | 根據上下文過濾指派 |
| 28 | `/issues/handle` | issue-handle.component | Org/Team | 處理問題 |
| 29 | `/issues/photos` | issue-photos.component | Org/Team | 處理照片 |
| 30 | `/issues/close` | issue-close.component | Org/Team | 關閉問題 |
| 31 | `/issues/sync-logs` | issue-sync-logs.component | Org | 同步日誌 |

**設計需求摘要**：
- 組織上下文：完整問題管理功能
- 團隊上下文：查看和指派功能
- 個人上下文：不顯示問題菜單
- 問題自動同步到主分支（即時同步）

#### 3.1.4 文檔管理模組（4 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 32 | `/documents` | document-list.component | User/Org/Team | 根據上下文過濾文檔 |
| 33 | `/documents/upload` | document-upload.component | User/Org/Team | 上傳時選擇上下文 |
| 34 | `/documents/preview` | document-preview.component | User/Org/Team | 預覽文檔 |
| 35 | `/documents/versions` | document-version.component | Org | 版本管理（僅組織） |

**設計需求摘要**：
- 個人上下文：個人文檔管理
- 組織上下文：完整文檔管理（版本、權限）
- 團隊上下文：基本訪問權限

### 3.2 中優先級頁面（P1 - 重要功能，28 個）

#### 3.2.1 品質管理模組（7 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 36 | `/quality/checks` | quality-checks.component | Org | 僅組織上下文 |
| 37 | `/quality/checks/detail` | quality-check-detail.component | Org | 品質檢查詳情 |
| 38 | `/quality/submit` | quality-submit.component | Org | 提交驗收 |
| 39 | `/quality/inspections` | quality-inspections.component | Org | 驗收管理 |
| 40 | `/quality/inspections/detail` | inspection-detail.component | Org | 驗收詳情 |
| 41 | `/quality/photos` | quality-photos.component | Org | 驗收照片 |
| 42 | `/quality/results` | quality-results.component | Org | 驗收結果 |

**設計需求摘要**：
- 僅在組織上下文中可用
- 不出現在個人或團隊上下文中

#### 3.2.2 溝通協作模組（9 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 43 | `/communication/discussions` | discussion-list.component | Org/Team | 根據上下文過濾討論 |
| 44 | `/communication/comments` | comment-list.component | Org/Team | 根據上下文過濾評論 |
| 45 | `/communication/comments/create` | comment-create.component | Org/Team | 創建評論 |
| 46 | `/communication/notifications` | notification-center.component | User/Org | 通知中心 |
| 47 | `/communication/notifications/detail` | notification-detail.component | User/Org | 通知詳情 |
| 48 | `/communication/notifications/rules` | notification-rules.component | Org | 通知規則（僅組織） |
| 49 | `/communication/realtime` | realtime-notify.component | Org | 即時通知（僅組織） |
| 50 | `/communication/todos` | todo-center.component | User/Org/Team | 待辦中心 |
| 51 | `/communication/team-notify` | team-notify.component | Org/Team | 團隊通知 |

**設計需求摘要**：
- 個人上下文：個人通知和待辦
- 組織上下文：完整溝通系統
- 團隊上下文：團隊討論和通知

#### 3.2.3 數據分析模組（11 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 52 | `/analytics/statistics` | statistics.component | Org | 僅組織上下文 |
| 53 | `/analytics/progress` | progress-tracking.component | Org | 進度追蹤 |
| 54 | `/analytics/progress-update` | progress-update.component | Org | 進度更新 |
| 55 | `/analytics/main-reports` | main-report.component | Org | 主分支報告 |
| 56 | `/analytics/branch-reports` | branch-report.component | Org | 分支報告 |
| 57 | `/analytics/cross-branch` | cross-branch.component | Org | 跨分支概覽 |
| 58 | `/analytics/activity-logs` | activity-log.component | Org | 活動日誌 |
| 59 | `/analytics/activity-logs/detail` | activity-log-detail.component | Org | 日誌詳情 |
| 60 | `/analytics/reports` | data-report.component | Org | 數據報告 |
| 61 | `/analytics/export` | report-export.component | Org | 報告導出 |
| 62 | `/analytics/charts` | chart-center.component | Org | 圖表生成 |

**設計需求摘要**：
- 僅在組織上下文中可用
- 提供組織級別的完整數據分析

#### 3.2.4 帳戶管理模組（1 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 63 | `/accounts/org` | org.component | Org | ✅ 已整合 |

### 3.3 低優先級頁面（P2 - 次要功能，22 個）

#### 3.3.1 協作管理模組（4 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 64 | `/collaboration/list` | collaboration-list.component | Org | 協作列表 |
| 65 | `/collaboration/create` | collaboration-form.component | Org | 創建協作 |
| 66 | `/collaboration/detail` | collaboration-detail.component | Org | 協作詳情 |
| 67 | `/collaboration/invitations` | invitation-list.component | Org | 協作邀請 |

#### 3.3.2 組織管理模組（8 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 68 | `/accounts/org/:id/members` | org-members.component | Org | 組織成員管理 |
| 69 | `/accounts/org/:id/teams` | teams.component | Org | 團隊管理 |
| 70 | `/accounts/org/teams/:id/members` | team-members.component | Team | 團隊成員管理 |
| 71 | `/accounts/form` | account-form.component | User/Org | 帳戶表單 |
| 72 | `/accounts/detail` | account-detail.component | User/Org | 帳戶詳情 |
| 73 | `/accounts/create/organization` | create-organization.component | User | 創建組織 |
| 74 | `/accounts/create/bot` | create-bot.component | Org | 創建機器人 |
| 75 | `/accounts/org/schedules` | schedule-list.component | Org | 排程管理 |

#### 3.3.3 文檔管理進階功能（3 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 76 | `/documents/browser` | document-browser.component | Org | 文檔瀏覽器 |
| 77 | `/documents/metadata` | document-metadata.component | Org | 文檔元數據 |
| 78 | `/documents/permissions` | document-permission.component | Org | 權限設置 |
| 79 | `/documents/drawings` | drawing-viewer.component | Org | 圖紙查看器 |

#### 3.3.4 系統設置模組（4 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 80 | `/system/settings/personal` | personal-settings.component | User | 個人設置 |
| 81 | `/system/settings/project` | project-settings.component | Org | 專案設置 |
| 82 | `/system/settings/global` | global-settings.component | Org | 全局設置 |
| 83 | `/system/permissions` | permission-assignment.component | Org | 權限分配 |

#### 3.3.5 機器人管理模組（3 個頁面）

| # | 頁面路徑 | 元件名稱 | 支援上下文 | 設計需求 |
|---|---------|---------|-----------|---------|
| 84 | `/bots/list` | bot-list.component | Org | 機器人列表 |
| 85 | `/bots/config` | bot-config.component | Org | 機器人配置 |
| 86 | `/bots/executions` | bot-execution.component | Org | 執行記錄 |

### 3.4 不需要上下文的頁面（排除，30+ 個）

以下頁面不需要整合 Workspace Context：

- **認證相關**：`/passport/*`（登入、註冊、回調等）
- **錯誤頁面**：`/exception/*`（404、500 等）
- **Dashboard**：`/dashboard/*`（儀表板可能需要匯總所有上下文的數據）
- **Demo 頁面**：`/demo/*`（示範頁面）
- **Explore**：`/explore`（探索頁面）

---

## 4. 設計需求規範

### 4.1 通用設計需求

所有需要整合 Workspace Context 的頁面必須滿足以下需求：

#### 4.1.1 依賴注入

```typescript
import { WorkspaceContextFacade } from '@core';

export class YourComponent {
  private readonly contextFacade = inject(WorkspaceContextFacade);
  
  // 訂閱上下文狀態
  readonly contextType = this.contextFacade.contextType;
  readonly contextId = this.contextFacade.contextId;
}
```

#### 4.1.2 上下文過濾

所有列表頁面必須根據當前上下文過濾資料：

```typescript
// ❌ 舊寫法（從 URL 獲取參數）
this.route.queryParams.subscribe(params => {
  const orgId = params['org'];
  const teamId = params['team'];
  this.loadData(orgId, teamId);
});

// ✅ 新寫法（從 WorkspaceContext 獲取）
effect(() => {
  const contextType = this.contextFacade.contextType();
  const contextId = this.contextFacade.contextId();
  
  // 根據上下文類型和 ID 過濾資料
  this.loadDataByContext(contextType, contextId);
});
```

#### 4.1.3 上下文指示器

在頁面標題或麵包屑中顯示當前上下文：

```typescript
readonly pageTitle = computed(() => {
  const contextLabel = this.contextFacade.contextLabel();
  return `${contextLabel} - 任務列表`;
});
```

#### 4.1.4 上下文驗證

某些功能僅在特定上下文中可用，需要驗證：

```typescript
readonly canCreate = computed(() => {
  const contextType = this.contextFacade.contextType();
  // 僅在組織或團隊上下文中可以創建
  return contextType === 'organization' || contextType === 'team';
});
```

#### 4.1.5 移除 URL 參數

不再使用 URL 查詢參數傳遞上下文：

```typescript
// ❌ 舊寫法
this.router.navigate(['/tasks/list'], { queryParams: { org: orgId } });

// ✅ 新寫法（上下文由 WorkspaceContextFacade 管理）
this.router.navigate(['/tasks/list']);
```

### 4.2 按頁面類型的具體需求

#### 4.2.1 列表頁面

**必須實現**：
1. 根據 `contextType` 和 `contextId` 自動過濾資料
2. 顯示當前上下文標籤
3. 當上下文切換時自動重新載入資料
4. 在表格或卡片中顯示資料所屬的上下文（如果跨上下文顯示）

**範例**（任務列表）：
```typescript
effect(() => {
  const contextType = this.contextFacade.contextType();
  const contextId = this.contextFacade.contextId();
  
  switch (contextType) {
    case 'user':
      // 載入用戶所有任務（跨組織、跨團隊）
      this.loadUserTasks(contextId!);
      break;
    case 'organization':
      // 載入組織任務
      this.loadOrganizationTasks(contextId!);
      break;
    case 'team':
      // 載入團隊任務
      this.loadTeamTasks(contextId!);
      break;
  }
});
```

#### 4.2.2 詳情頁面

**必須實現**：
1. 顯示資料所屬的上下文資訊
2. 根據當前上下文判斷操作權限（編輯、刪除等）
3. 如果資料不屬於當前上下文，顯示提示或限制操作

**範例**（任務詳情）：
```typescript
readonly canEdit = computed(() => {
  const task = this.task();
  if (!task) return false;
  
  const contextType = this.contextFacade.contextType();
  const contextId = this.contextFacade.contextId();
  
  // 檢查任務是否屬於當前上下文
  switch (contextType) {
    case 'organization':
      return task.organizationId === contextId;
    case 'team':
      return task.teamId === contextId;
    default:
      return false;
  }
});
```

#### 4.2.3 表單頁面（創建/編輯）

**必須實現**：
1. 創建時自動繼承當前上下文
2. 顯示上下文選擇器（如果支援跨上下文創建）
3. 驗證當前上下文是否有權限創建/編輯

**範例**（創建任務）：
```typescript
private initializeForm(): void {
  const contextType = this.contextFacade.contextType();
  const contextId = this.contextFacade.contextId();
  
  this.taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    // 自動設置上下文
    organizationId: [contextType === 'organization' ? contextId : null],
    teamId: [contextType === 'team' ? contextId : null],
    // ... 其他欄位
  });
}
```

---

## 5. 實施優先級

### 5.1 P0 - 立即實施（1-2 週）

**目標**：核心功能可用，用戶可以在不同上下文中工作

**範圍**：35 個頁面
- 任務管理模組（12 個）
- 藍圖管理模組（11 個）
- 問題追蹤模組（8 個）
- 文檔管理模組（4 個）

**驗收標準**：
- ✅ 用戶可以切換上下文
- ✅ 列表頁面根據上下文過濾資料
- ✅ 創建功能繼承當前上下文
- ✅ 詳情頁面顯示上下文資訊

### 5.2 P1 - 短期實施（2-4 週）

**目標**：重要功能整合完成

**範圍**：28 個頁面
- 品質管理模組（7 個）
- 溝通協作模組（9 個）
- 數據分析模組（11 個）
- 帳戶管理模組（1 個）

**驗收標準**：
- ✅ 所有列表和詳情頁面整合完成
- ✅ 權限驗證正確
- ✅ 上下文切換平滑

### 5.3 P2 - 長期實施（4-6 週）

**目標**：次要功能整合完成

**範圍**：22 個頁面
- 協作管理模組（4 個）
- 組織管理模組（8 個）
- 文檔管理進階功能（3 個）
- 系統設置模組（4 個）
- 機器人管理模組（3 個）

**驗收標準**：
- ✅ 所有功能整合完成
- ✅ 完整測試覆蓋
- ✅ 文檔完善

---

## 6. 技術規範

### 6.1 Coding Standards

#### 6.1.1 元件結構

```typescript
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-your-component',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="pageTitle()">
      <ng-template #extra>
        @if (canCreate()) {
          <button nz-button nzType="primary" (click)="create()">
            <span nz-icon nzType="plus"></span>
            新建
          </button>
        }
      </ng-template>
    </page-header>
    
    <nz-card>
      <!-- 上下文指示器 -->
      <div class="context-indicator">
        <nz-tag [nzColor]="contextColor()">
          <span nz-icon [nzType]="contextIcon()"></span>
          {{ contextLabel() }}
        </nz-tag>
      </div>
      
      <!-- 內容 -->
      <!-- ... -->
    </nz-card>
  `
})
export class YourComponent {
  private readonly contextFacade = inject(WorkspaceContextFacade);
  
  // 上下文狀態
  readonly contextType = this.contextFacade.contextType;
  readonly contextId = this.contextFacade.contextId;
  readonly contextLabel = this.contextFacade.contextLabel;
  readonly contextIcon = this.contextFacade.contextIcon;
  
  // Computed signals
  readonly pageTitle = computed(() => {
    return `${this.contextLabel()} - 頁面標題`;
  });
  
  readonly contextColor = computed(() => {
    const type = this.contextType();
    switch (type) {
      case 'user': return 'blue';
      case 'organization': return 'green';
      case 'team': return 'orange';
      default: return 'default';
    }
  });
  
  readonly canCreate = computed(() => {
    const type = this.contextType();
    return type === 'organization' || type === 'team';
  });
  
  // 資料載入
  constructor() {
    effect(() => {
      const contextType = this.contextType();
      const contextId = this.contextId();
      
      if (contextType && contextId) {
        this.loadData(contextType, contextId);
      }
    });
  }
  
  private loadData(contextType: string, contextId: string): void {
    // 根據上下文載入資料
  }
}
```

#### 6.1.2 路由配置

移除路由中的 `:org` 和 `:team` 參數：

```typescript
// ❌ 舊寫法
{
  path: 'tasks/list',
  component: TaskListComponent,
  // 不需要在路由中定義上下文參數
}

// ✅ 新寫法
{
  path: 'tasks/list',
  component: TaskListComponent
}
```

#### 6.1.3 Service 層

Service 應該提供根據上下文過濾的方法：

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  // 根據用戶載入任務
  loadUserTasks(userId: string): Observable<Task[]> {
    return this.repository.query({
      filter: `assignee_id=eq.${userId}`,
      order: 'created_at.desc'
    });
  }
  
  // 根據組織載入任務
  loadOrganizationTasks(orgId: string): Observable<Task[]> {
    return this.repository.query({
      filter: `organization_id=eq.${orgId}`,
      order: 'created_at.desc'
    });
  }
  
  // 根據團隊載入任務
  loadTeamTasks(teamId: string): Observable<Task[]> {
    return this.repository.query({
      filter: `team_id=eq.${teamId}`,
      order: 'created_at.desc'
    });
  }
}
```

### 6.2 Error Handling

```typescript
effect(() => {
  const contextType = this.contextType();
  const contextId = this.contextId();
  
  if (!contextId) {
    console.warn('No context ID available');
    return;
  }
  
  this.loadData(contextType, contextId).catch(error => {
    console.error('Failed to load data:', error);
    this.message.error('載入資料失敗');
  });
});
```

### 6.3 Testing

每個元件必須包含單元測試：

```typescript
describe('YourComponent', () => {
  let component: YourComponent;
  let contextFacade: WorkspaceContextFacade;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [YourComponent],
      providers: [
        {
          provide: WorkspaceContextFacade,
          useValue: {
            contextType: signal('organization'),
            contextId: signal('org-123'),
            contextLabel: signal('組織名稱')
          }
        }
      ]
    });
    
    component = TestBed.createComponent(YourComponent).componentInstance;
    contextFacade = TestBed.inject(WorkspaceContextFacade);
  });
  
  it('should load data based on context', () => {
    // 測試上下文切換時是否重新載入資料
    contextFacade.switchToOrganization('org-456');
    
    // 驗證資料已重新載入
    expect(component.data()).toHaveLength(10);
  });
});
```

---

## 7. 測試策略

### 7.1 單元測試

**覆蓋率目標**：80%

**必須測試**：
1. 上下文切換時資料重新載入
2. 不同上下文下的權限驗證
3. 表單提交時上下文資訊正確
4. 上下文指示器正確顯示

### 7.2 整合測試

**測試場景**：
1. 用戶登入後默認切換到個人上下文
2. 切換到組織上下文後菜單更新
3. 切換到團隊上下文後菜單更新
4. 上下文持久化（刷新頁面後恢復）

### 7.3 E2E 測試

**測試流程**：
1. 登入系統
2. 在個人上下文中查看任務列表
3. 切換到組織上下文
4. 創建新任務
5. 驗證任務屬於組織上下文
6. 切換到團隊上下文
7. 驗證任務顯示在團隊任務列表中

---

## 8. 時程規劃

### 8.1 階段一：P0 頁面整合（2 週）

**Week 1**：
- Day 1-2：任務管理模組（6 個頁面）
- Day 3-4：藍圖管理模組（6 個頁面）
- Day 5：Code Review 和調整

**Week 2**：
- Day 1-2：問題追蹤模組（8 個頁面）
- Day 3：文檔管理模組（4 個頁面）
- Day 4：整合測試
- Day 5：修復 Bug 和優化

### 8.2 階段二：P1 頁面整合（2 週）

**Week 3**：
- Day 1-2：品質管理模組（7 個頁面）
- Day 3-4：溝通協作模組（9 個頁面）
- Day 5：Code Review

**Week 4**：
- Day 1-3：數據分析模組（11 個頁面）
- Day 4：整合測試
- Day 5：修復 Bug

### 8.3 階段三：P2 頁面整合（2 週）

**Week 5**：
- Day 1：協作管理模組（4 個頁面）
- Day 2-3：組織管理模組（8 個頁面）
- Day 4：文檔管理進階功能（3 個頁面）
- Day 5：系統設置模組（4 個頁面）

**Week 6**：
- Day 1：機器人管理模組（3 個頁面）
- Day 2-3：完整測試
- Day 4：修復所有 Bug
- Day 5：文檔更新和發布

### 8.4 里程碑

| 里程碑 | 日期 | 目標 |
|--------|------|------|
| M1: P0 完成 | Week 2 結束 | 核心功能可用 |
| M2: P1 完成 | Week 4 結束 | 重要功能整合 |
| M3: P2 完成 | Week 6 結束 | 所有功能整合完成 |
| M4: 上線 | Week 7 | 正式發布 |

---

## 9. 風險與挑戰

### 9.1 技術風險

1. **向下相容性**：現有 URL 查詢參數需要平滑過渡
   - **緩解措施**：提供向下相容的 Redirect Guard

2. **效能影響**：頻繁的上下文切換可能影響效能
   - **緩解措施**：實施資料快取和 Lazy Loading

3. **狀態管理複雜度**：多層級上下文狀態管理
   - **緩解措施**：使用 Signals 和 Computed 簡化狀態管理

### 9.2 業務風險

1. **用戶學習曲線**：上下文切換可能讓用戶困惑
   - **緩解措施**：提供清晰的上下文指示器和用戶教育

2. **資料權限**：上下文切換時資料權限驗證
   - **緩解措施**：完整的權限測試和 RLS 策略

### 9.3 時程風險

1. **範圍膨脹**：可能發現更多需要整合的頁面
   - **緩解措施**：嚴格控制範圍，分階段實施

2. **測試時間**：完整測試可能需要更多時間
   - **緩解措施**：並行開發和測試，自動化測試

---

## 10. 成功指標

### 10.1 技術指標

- ✅ 85+ 個頁面完成整合
- ✅ 80%+ 單元測試覆蓋率
- ✅ 所有 E2E 測試通過
- ✅ 0 個 P0/P1 Bug

### 10.2 用戶體驗指標

- ✅ 上下文切換時間 < 500ms
- ✅ 頁面載入時間 < 2s
- ✅ 用戶滿意度 > 4/5

### 10.3 業務指標

- ✅ 功能完整性 100%
- ✅ 向下相容性 100%
- ✅ 文檔完整性 100%

---

## 11. 附錄

### 11.1 相關文檔

- [Workspace Context 使用與規劃指南](./workspace-context-usage-guide.md)
- [Workspace Context 系統架構審查](./workspace-context-architecture-review.md)
- [Workspace System 快速參考指南](./workspace-system-quick-reference.md)
- [個人上下文菜單功能說明](./user-context-menu-documentation.md)
- [組織上下文菜單功能說明](./organization-context-menu-documentation.md)
- [團隊上下文菜單功能說明](./team-context-menu-documentation.md)

### 11.2 程式碼範例

完整範例請參考：
- `src/app/routes/tasks/board/task-board.component.ts` - ✅ 已整合
- `src/app/routes/tasks/todo/task-todo.component.ts` - ✅ 已整合
- `src/app/routes/tasks/assignments/task-assignments.component.ts` - ✅ 已整合

### 11.3 工具與資源

- **WorkspaceContextFacade API**：`src/app/core/facades/workspace-context.facade.ts`
- **WorkspaceContextService**：`src/app/shared/services/workspace-context/workspace-context.service.ts`
- **三個視角數據文件**：
  - `src/assets/tmp/user-data.json`
  - `src/assets/tmp/organization-data.json`
  - `src/assets/tmp/team-data.json`

---

## 12. 結論

本文件提供了完整的 Workspace Context Manager 頁面重新設計需求，包括：

1. **明確的頁面清單**：86 個需要整合的頁面
2. **詳細的設計需求**：每個頁面的具體需求
3. **技術實施指南**：程式碼範例和最佳實踐
4. **清晰的優先級**：P0/P1/P2 三個階段
5. **實際的時程規劃**：6 週完成所有整合
6. **完整的測試策略**：單元、整合、E2E 測試

透過遵循本文件的指引，開發團隊可以系統化地完成所有頁面的整合工作，確保專案成功交付。

---

**文件維護**：
- **創建日期**：2025-01-20
- **最後更新**：2025-01-20
- **維護者**：開發團隊
- **審查週期**：每週更新進度

**變更歷史**：
- v1.0 (2025-01-20)：初始版本，完成頁面清單和設計需求
