# Layout 模組開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`layout` 管理版面配置：
- `basic/` - 主要應用版面（導航、選單、內容區）
- `blank/` - 空白版面（登入、註冊、錯誤頁）
- `passport/` - 認證頁面

⚠️ **禁止**: Layout 不包含業務邏輯

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 Layout 類型

- `basic/` - 主要版面（導航、選單、內容區、ReuseTab）
  - `widgets/` - 版面小部件（用戶、通知、搜尋、任務等）
- `blank/` - 空白版面（簡單容器）
- `passport/` - 認證頁面（登入、註冊）

## 📝 組件設計

```typescript
@Component({
  standalone: true,
  selector: 'layout-basic',
  imports: [SHARED_IMPORTS],
  providers: [ReuseTabStrategy] // 僅在必要時提供服務
})
export class LayoutBasicComponent {
  private readonly #menuSrv = inject(_MenuService);
  private readonly #collapsed = signal(false);
  
  readonly showCollapsed = this.#collapsed.asReadonly();
}
```

## 🎨 Widgets 設計

```typescript
// layout/basic/widgets/user.component.ts
@Component({
  standalone: true,
  selector: 'layout-widget-user',
  imports: [SHARED_IMPORTS]
})
export class UserWidgetComponent {
  private readonly #userService = inject(UserService);
  readonly user = this.#userService.currentUser;
}
```

## 🔗 依賴關係

### 允許的依賴
- ✅ Layout 組件可以依賴 `core/` 服務（透過 DI）
- ✅ Layout 組件可以依賴 `shared/` 組件
- ✅ Layout 組件可以使用 `SHARED_IMPORTS`
- ✅ Layout 組件可以使用 Angular 和 ng-zorro-antd

### 禁止的依賴
- ❌ Layout 不應包含業務邏輯
- ❌ Layout 不應直接依賴 Infrastructure/Supabase

## 🛡️ 強制規範

- **SHARED_IMPORTS**: UI 層優先使用 `SHARED_IMPORTS`，避免零碎引入
- **Standalone Components**: 優先使用 Standalone Components
- **Signal-based State**: 使用 Signal 管理組件狀態
- **單一職責**: Layout 僅負責版面配置，不包含業務邏輯

## ✅ 工作準則

### Do
- 使用 Standalone Components
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 使用 `SHARED_IMPORTS` 統一導入
- Layout 僅負責版面配置

### Don't
- 不包含業務邏輯
- 不直接依賴 Infrastructure/Supabase
- 不引入零碎模組，優先使用 `SHARED_IMPORTS`
- 不進行「權宜式/懶惰式」修改

## 💡 代碼示例

### Layout 組件設計示例

```typescript
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { MenuService } from '@delon/theme';

@Component({
  standalone: true,
  selector: 'layout-basic',
  imports: [SHARED_IMPORTS], // ✅ 優先使用
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-layout>
      <nz-sider [nzCollapsed]="collapsed()" (nzCollapsedChange)="collapsed.set($event)">
        <ul nz-menu [nzMode]="'inline'">
          <!-- 菜單項 -->
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <layout-widget-user></layout-widget-user>
        </nz-header>
        <nz-content>
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `
})
export class LayoutBasicComponent {
  private readonly #menuService = inject(MenuService);
  
  readonly collapsed = signal(false);
}
```

## 📚 相關文檔

### 核心文檔
- [Basic Layout README](./basic/README.md) - 基本布局說明
- [App 目錄 AGENTS.md](../AGENTS.md) - 應用層規範
- [專案根目錄 AGENTS.md](../../../AGENTS.md) - 完整開發規範

### 專案文檔
- [文檔索引](../../../docs/README.md) - 完整文檔導航
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發作業指引](../../../docs/00-開發作業指引.md) - 開發規範

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


