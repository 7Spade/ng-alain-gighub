# Route Integration Guide

本文件說明如何在 Angular 路由中註冊新增的 Standalone Components。

## 概述

本次新增了三個企業級基礎實作頁面：
1. **Quality Check Detail** - 品質檢查詳情頁
2. **Activity Log Detail** - 活動記錄詳情頁
3. **Bots Tasks Skeleton** - 機器人任務骨架頁

所有組件均使用 Angular 20.3 的 Standalone Components、Signals 與 OnPush 變更檢測策略。

## 路由配置

### 1. Quality Check Detail (`/quality/checks/:id`)

在 `src/app/routes/quality/routes.ts` 中註冊：

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'checks',
    children: [
      {
        path: '',
        loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./checks/detail/quality-check-detail').then(m => m.QualityCheckDetail)
      }
    ]
  },
  // ... 其他路由
];
```

**使用範例：**
```typescript
// 導航到品質檢查詳情頁
this.router.navigate(['/quality/checks', checkId]);

// 或使用 routerLink
<a [routerLink]="['/quality/checks', check.id]">查看詳情</a>
```

### 2. Activity Log Detail (`/analytics/activity-logs/:id`)

在 `src/app/routes/analytics/routes.ts` 中註冊：

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'activity-logs',
    children: [
      {
        path: '',
        loadComponent: () => import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./activity-logs/detail/activity-log-detail').then(m => m.ActivityLogDetail)
      }
    ]
  },
  // ... 其他路由
];
```

**使用範例：**
```typescript
// 導航到活動記錄詳情頁
this.router.navigate(['/analytics/activity-logs', logId]);

// 或使用 routerLink
<a [routerLink]="['/analytics/activity-logs', log.id]">查看詳情</a>
```

### 3. Bots Tasks Skeleton (`/bots/tasks`)

在 `src/app/routes/bots/routes.ts` 中註冊：

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/bot-tasks').then(m => m.BotTasks)
  },
  // ... 其他路由
];
```

**使用範例：**
```typescript
// 導航到機器人任務頁面
this.router.navigate(['/bots/tasks']);

// 或使用 routerLink
<a routerLink="/bots/tasks">機器人任務</a>
```

## 完整路由結構範例

### Quality Routes (`src/app/routes/quality/routes.ts`)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'checks',
    children: [
      { path: '', loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent) },
      { path: ':id', loadComponent: () => import('./checks/detail/quality-check-detail').then(m => m.QualityCheckDetail) }
    ]
  },
  {
    path: 'inspections',
    loadComponent: () => import('./inspections/inspections.component').then(m => m.InspectionsComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent)
  }
];
```

### Analytics Routes (`src/app/routes/analytics/routes.ts`)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'activity-logs',
    children: [
      { path: '', loadComponent: () => import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent) },
      { path: ':id', loadComponent: () => import('./activity-logs/detail/activity-log-detail').then(m => m.ActivityLogDetail) }
    ]
  },
  {
    path: 'charts',
    loadComponent: () => import('./charts/charts.component').then(m => m.ChartsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];
```

### Bots Routes (`src/app/routes/bots/routes.ts`)

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/bot-tasks').then(m => m.BotTasks)
  },
  {
    path: 'config',
    loadComponent: () => import('./config/config.component').then(m => m.ConfigComponent)
  },
  {
    path: 'executions',
    loadComponent: () => import('./executions/executions.component').then(m => m.ExecutionsComponent)
  }
];
```

## 主路由整合 (`src/app/routes/routes.ts`)

確保主路由檔案中包含這些模組的路由：

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... 其他路由
  {
    path: 'quality',
    loadChildren: () => import('./quality/routes').then(m => m.routes)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/routes').then(m => m.routes)
  },
  {
    path: 'bots',
    loadChildren: () => import('./bots/routes').then(m => m.routes)
  }
  // ... 其他路由
];
```

## 導航守衛 (可選)

如需要權限控制，可加入 Route Guards：

```typescript
import { authGuard } from '@core';

{
  path: 'quality/checks/:id',
  loadComponent: () => import('./quality/checks/detail/quality-check-detail').then(m => m.QualityCheckDetail),
  canActivate: [authGuard]
}
```

## 元數據設定 (可選)

可為路由加入元數據以改善 SEO 和使用者體驗：

```typescript
{
  path: 'quality/checks/:id',
  loadComponent: () => import('./quality/checks/detail/quality-check-detail').then(m => m.QualityCheckDetail),
  data: {
    title: '品質檢查詳情',
    reuse: true
  }
}
```

## 功能特性

### Quality Check Detail
- ✅ 讀取品質檢查資料（從 route params 取得 ID）
- ✅ 編輯模式支援修改 status/findings/recommendations
- ✅ 使用 Typed Reactive Forms
- ✅ 顯示 loading 與 error 狀態
- ✅ Signal-based 狀態管理

### Activity Log Detail
- ✅ 讀取活動記錄資料（從 route params 取得 ID）
- ✅ 顯示完整欄位（actor/action/target/occurredAt/meta）
- ✅ 顯示 loading 與 error 狀態
- ✅ Signal-based 狀態管理

### Bots Tasks Skeleton
- ✅ 骨架頁面顯示（使用 nz-empty）
- ✅ CTA 按鈕（建立範例機器人任務）
- ✅ 未實作後端邏輯

## 測試

所有組件均包含基本單元測試（Karma/Jasmine），確保組件可以正常建立。

```bash
# 執行單元測試
yarn test

# 執行測試並產生覆蓋率報告
yarn test-coverage
```

## 注意事項

1. **環境配置**：確保 `src/environments/environment.ts` 包含正確的 Supabase 配置
2. **權限控制**：根據需求加入適當的 Route Guards
3. **錯誤處理**：組件內建基本錯誤處理，可根據需求擴展
4. **類型安全**：所有組件均使用 TypeScript strict mode，避免使用 `any`
5. **效能優化**：使用 OnPush 變更檢測策略和 Signals 提升效能

## 相關文件

- [Angular 路由指南](https://angular.dev/guide/routing)
- [Standalone Components](https://angular.dev/guide/standalone-components)
- [Signals](https://angular.dev/guide/signals)
- [Typed Forms](https://angular.dev/guide/typed-forms)
- [專案架構說明](./01-專案結構說明.md)
