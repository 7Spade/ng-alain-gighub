# Shared 模組開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`shared` 提供可重用組件與工具：
- `cell-widget/`, `st-widget/` - 業務組件
- `utils/` - 工具函數
- `json-schema/` - JSON Schema
- `models/` - 資料模型
- `shared-*` - 共享配置（shared-imports.ts、shared-delon.module.ts、shared-zorro.module.ts）

⚠️ **禁止**: shared 不應包含 `providers`（除非必要）

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 子目錄職責

- `cell-widget/` - 單元格小部件
- `st-widget/` - ST 表格小部件
- `utils/` - 工具函數（純函數優先）
- `json-schema/` - JSON Schema 定義
- `models/` - 資料模型（介面、類型定義）
- `shared-imports.ts` - ⚠️ **優先使用**：統一導入配置
- `shared-delon.module.ts` - @delon 共享模組
- `shared-zorro.module.ts` - ng-zorro-antd 共享模組

## 📝 組件設計

```typescript
@Component({
  standalone: true,
  selector: 'app-widget',
  imports: [CommonModule, NzButtonModule]
})
export class WidgetComponent {
  readonly title = input.required<string>();
  readonly onClick = output<void>();
  private readonly #state = signal(false);
  
  readonly isActive = computed(() => this.#state());
}
```

## 📝 工具函數設計

```typescript
// utils/location.ts - 純函數優先
export function formatLocation(lat: number, lng: number): string {
  // 純函數，無副作用
  return `${lat}, ${lng}`;
}
```

## 🔗 依賴關係

### 允許的依賴
- ✅ Shared 組件可以依賴 `core/` 服務（透過 DI）
- ✅ Shared 組件可以使用 `shared-imports.ts`
- ✅ Shared 組件可以使用 Angular 和 ng-zorro-antd

### 禁止的依賴
- ❌ Shared 不應依賴 `routes/`（功能頁面）
- ❌ Shared 不應直接依賴 Infrastructure/Supabase

## 🛡️ 強制規範

- **SHARED_IMPORTS**: UI 層優先使用 `SHARED_IMPORTS`，避免零碎引入
- **Standalone Components**: 優先使用 Standalone Components
- **Signal-based State**: 使用 Signal 管理組件狀態
- **純函數優先**: `utils/` 中的工具函數應為純函數
- **單一職責**: 每個組件、工具函數應有明確職責

## ✅ 工作準則

### Do
- 使用 Standalone Components
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 使用 `SHARED_IMPORTS` 統一導入
- 工具函數設計為純函數

### Don't
- 不包含 `providers`（除非必要）
- 不依賴 routes
- 不引入零碎模組，優先使用 `SHARED_IMPORTS`
- 不直接依賴 Infrastructure/Supabase
- 不進行「權宜式/懶惰式」修改

## 💡 代碼示例

### 共享組件設計示例

```typescript
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { SHARED_IMPORTS } from './shared-imports'; // ✅ 使用 SHARED_IMPORTS

@Component({
  standalone: true,
  selector: 'app-widget',
  imports: [SHARED_IMPORTS], // ✅ 優先使用
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nz-card>
      <h3>{{ title() }}</h3>
      @if (isLoading()) {
        <nz-spin></nz-spin>
      } @else {
        <ng-content></ng-content>
      }
      <button nz-button (click)="onClick.emit()">操作</button>
    </nz-card>
  `
})
export class WidgetComponent {
  // ✅ 使用 input() 和 output()
  readonly title = input.required<string>();
  readonly onClick = output<void>();
  
  readonly isLoading = signal(false);
}
```

### SHARED_IMPORTS 使用示例

```typescript
// ✅ 正確：優先使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS] // 包含所有常用模組
})

// ❌ 錯誤：零碎引入
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
// ... 更多零碎導入
```

## 📚 相關文檔

### 核心文檔
- [Shared README](./README.md) - 共享層說明
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [App 目錄 AGENTS.md](../AGENTS.md) - 應用層規範
- [專案根目錄 AGENTS.md](../../../AGENTS.md) - 完整開發規範

### 專案文檔
- [文檔索引](../../../docs/README.md) - 完整文檔導航
- [開發作業指引](../../../docs/00-開發作業指引.md) - 開發規範
- [常見錯誤預防指南](../../../docs/50-常見錯誤預防指南.md) - 錯誤預防

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


