# Routes 模組開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`routes` 包含所有功能頁面：
- `dashboard/` - 儀表板
- `passport/` - 認證
- `pro/` - 專業功能
- `delon/` - 示範頁面
- `exception/` - 錯誤頁面
- `account/` - 帳戶管理
- `blueprint/` - 藍圖功能
- `org/` - 組織管理

採用 **Feature-based 架構**

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 功能模組

- `dashboard/` - 儀表板
- `passport/` - 認證頁面
- `pro/` - 專業功能
- `delon/` - 示範頁面
- `exception/` - 錯誤頁面
- `account/` - 帳戶中心、設定、組織管理
- `blueprint/` - 藍圖列表、詳情、建立、進度等
- `org/` - 組織管理（成員、團隊、設定）

## 📝 組件設計

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 優先使用 SHARED_IMPORTS
  providers: [FeatureService] // 僅在必要時提供服務
})
export class FeatureComponent {
  private readonly #service = inject(FeatureService);
  readonly loading = signal(false);
  readonly data = signal<Data[]>([]);
  
  // 使用現代控制流程
  // @if @for @switch
}
```

## 🔐 路由守衛

```typescript
{
  path: 'feature',
  canActivate: [AuthGuard],
  loadComponent: () => import('./feature.component').then(m => m.FeatureComponent)
}
```

## 🔗 依賴關係

### 允許的依賴
- ✅ Routes 組件可以依賴 `shared/` 組件與 Facade/Repository
- ✅ Routes 組件可以透過共享 Facade/Repository 間接使用 `core/` 服務
- ✅ Routes 組件可以使用 `SHARED_IMPORTS`
- ✅ Routes 組件可以使用 Angular 和 ng-zorro-antd

### 禁止的依賴
- ❌ Routes 不應直接依賴 Infrastructure/Supabase
- ❌ Routes 不應直接使用資料庫查詢
- ❌ Routes 不應直接注入 `core/` 服務，除非已經在 ADR 說明並提供 Facade/Repository 介面

## 🛡️ 強制規範

- **SHARED_IMPORTS**: UI 層優先使用 `SHARED_IMPORTS`，避免零碎引入
- **Standalone Components**: 優先使用 Standalone Components
- **Signal-based State**: 使用 Signal 管理組件狀態
- **現代控制流程**: 使用 `@if`、`@for`、`@switch`
- **ChangeDetectionStrategy.OnPush**: 頁面預設使用 OnPush
- **ReuseTab 標題**: 不得顯示原始 URL，必須提供 `route.data.title`

## ✅ 工作準則

### Do
- 使用 Standalone Components
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 透過 `shared/` Facade 或 Repository 取得資料
- 使用 `SHARED_IMPORTS` 統一導入
- 使用現代控制流程（`@if`、`@for`、`@switch`）
- 頁面預設使用 `ChangeDetectionStrategy.OnPush`
- 提供 `route.data.title` 或使用 `TitleService.setTitle()`

### Don't
- 不直接依賴 Infrastructure/Supabase
- 不引入零碎模組，優先使用 `SHARED_IMPORTS`
- 不在變更檢查期間直接改動 signal/狀態
- 不顯示原始 URL 在 ReuseTab 標題
- 不繞過 Facade/Repository 直接呼叫核心服務
- 不進行「權宜式/懶惰式」修改

## 💡 代碼示例

### 路由組件設計示例

```typescript
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { FeatureFacade } from '@shared/state/feature.facade';

@Component({
  standalone: true,
  selector: 'app-feature',
  imports: [SHARED_IMPORTS], // ✅ 優先使用
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ 預設使用
  template: `
    <nz-page-header [nzTitle]="title()">
      <nz-page-header-extra>
        <button nz-button nzType="primary" (click)="handleCreate()">
          新增
        </button>
      </nz-page-header-extra>
    </nz-page-header>
    
    <nz-card>
      @if (loading()) {
        <nz-spin></nz-spin>
      } @else {
        @for (item of items(); track item.id) {
          <div>{{ item.name }}</div>
        } @empty {
          <nz-empty></nz-empty>
        }
      }
    </nz-card>
  `
})
export class FeatureComponent {
  private readonly #router = inject(Router);
  private readonly #route = inject(ActivatedRoute);
  private readonly #facade = inject(FeatureFacade); // ✅ 透過 Facade 取得資料
  
  readonly title = signal('功能標題');
  readonly loading = this.#facade.loading; // ✅ 使用 Facade 的 ReadonlySignal
  readonly items = this.#facade.items;
  
  handleCreate() {
    this.#router.navigate(['create'], { relativeTo: this.#route });
  }
}
```

### ReuseTab 標題設置

```typescript
// ✅ 正確：在路由配置中設置標題
{
  path: 'feature',
  component: FeatureComponent,
  data: { title: '功能管理' } // ✅ 設置人類可讀標題
}

// ✅ 或在組件中動態設置
export class FeatureComponent {
  private readonly #titleService = inject(TitleService);
  
  ngOnInit() {
    this.#titleService.setTitle('功能管理'); // ✅ 動態設置標題
  }
}
```

## 📚 相關文檔

### 核心文檔
- [App 目錄 AGENTS.md](../AGENTS.md) - 應用層規範
- [專案根目錄 AGENTS.md](../../../AGENTS.md) - 完整開發規範

### 專案文檔
- [文檔索引](../../../docs/README.md) - 完整文檔導航
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發作業指引](../../../docs/00-開發作業指引.md) - 開發規範
- [常見錯誤預防指南](../../../docs/50-常見錯誤預防指南.md) - 錯誤預防

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


