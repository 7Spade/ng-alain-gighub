# App 目錄開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`src/app` 是應用程式根目錄（Angular 20 Standalone）。

### 核心檔案
- `app.component.ts` - 根組件
- `app.config.ts` - 應用配置

### 子目錄
- `core/` - [核心服務](./core/AGENTS.md)
- `shared/` - [共享組件](./shared/AGENTS.md)  
- `layout/` - [版面配置](./layout/AGENTS.md)
- `routes/` - [功能頁面](./routes/AGENTS.md)

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 檔案職責

### app.component.ts
- 路由導航
- 應用初始化
- 版本管理

### app.config.ts
- HTTP 攔截器
- 路由配置
- 服務提供者
- 主題與語言
- Reuse Tab

## 📝 快速決策

```
新檔案 → 服務/HTTP/啟動？ → core/
      → 可重用組件？ → shared/
      → 版面配置？ → layout/
      → 功能頁面？ → routes/
```

⚠️ **禁止**: app 根目錄不包含業務邏輯

## 💡 代碼示例

### Standalone Component 基本模板

```typescript
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [SHARED_IMPORTS], // ✅ 優先使用
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ 預設使用
  template: `
    @if (isVisible()) {
      <nz-card>
        <h3>可見內容</h3>
        @for (item of items(); track item.id) {
          <nz-tag>{{ item.name }}</nz-tag>
        }
      </nz-card>
    }
  `
})
export class ExampleComponent {
  private readonly #service = inject(ExampleService); // ✅ 使用 inject()
  
  readonly isVisible = signal(true);
  readonly items = signal<Item[]>([]);
  readonly itemCount = computed(() => this.items().length);
}
```

### 現代控制流程示例

```typescript
// ✅ 正確：使用現代控制流程
template: `
  @if (loading()) {
    <nz-spin></nz-spin>
  } @else if (error()) {
    <nz-alert [nzMessage]="error()" nzType="error"></nz-alert>
  } @else {
    @for (item of items(); track item.id) {
      <div>{{ item.name }}</div>
    } @empty {
      <nz-empty></nz-empty>
    }
  }
  
  @switch (status()) {
    @case ('active') {
      <nz-badge [nzStatus]="'success'">活躍</nz-badge>
    }
    @case ('inactive') {
      <nz-badge [nzStatus]="'default'">非活躍</nz-badge>
    }
    @default {
      <nz-badge [nzStatus]="'processing'">處理中</nz-badge>
    }
  }
`
```

### Signal-based 狀態管理示例

```typescript
export class ExampleComponent {
  // ✅ 使用 signal() 創建狀態
  readonly loading = signal(false);
  readonly data = signal<Data[]>([]);
  
  // ✅ 使用 computed() 創建派生狀態
  readonly hasData = computed(() => this.data().length > 0);
  readonly totalCount = computed(() => this.data().length);
  
  async loadData() {
    this.loading.set(true);
    try {
      const result = await this.#service.fetchData();
      this.data.set(result); // ✅ 使用 set() 更新狀態
    } finally {
      this.loading.set(false);
    }
  }
}
```

## 🔗 依賴關係規則

### 依賴方向（只能向下依賴）

```
routes/ (功能頁面)
    ↓
shared/ (共享組件)
    ↓
core/ (核心服務)
```

### 禁止的依賴

- ❌ **routes → core**: 頁面組件應透過 shared 或服務間接使用 core
- ❌ **shared → core**: 共享組件應避免直接依賴 core（除必要服務外）

## 🛡️ 強制規範

- **Standalone Components**: 優先使用 Standalone Components
- **Signal-based State**: 使用 Signal 管理組件狀態
- **Supabase MCP**: 所有資料庫操作必須使用 Supabase MCP 工具
- **單一職責**: 每個模組、服務、組件應有明確職責
- **SHARED_IMPORTS**: UI 層優先使用 `SHARED_IMPORTS`，避免零碎引入

## ✅ 工作準則

### Do
- 使用 Standalone Components
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 使用現代控制流程（`@if`、`@for`、`@switch`）
- 使用 Supabase MCP 進行所有資料庫操作
- UI 層優先使用 `SHARED_IMPORTS`

### Don't
- 不違反依賴方向規則
- 不直接操作資料庫或使用非 MCP 方式
- 不在 UI 層直接依賴 Infrastructure/Supabase
- 不引入零碎模組，優先使用 `SHARED_IMPORTS`
- 不進行「權宜式/懶惰式」修改，提供結構化解法

## 📚 相關文檔

### 子模組文檔
- [Core 模組](./core/AGENTS.md) - 核心服務層
- [Shared 模組](./shared/AGENTS.md) - 共享組件層
- [Layout 模組](./layout/AGENTS.md) - 布局層
- [Routes 模組](./routes/AGENTS.md) - 路由/頁面層

### 專案文檔
- [專案根目錄 AGENTS.md](../../AGENTS.md) - 完整開發規範
- [文檔索引](../../docs/README.md) - 完整文檔導航
- [SHARED_IMPORTS 使用指南](../../docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發作業指引](../../docs/00-開發作業指引.md) - 開發規範
- [常見錯誤預防指南](../../docs/50-常見錯誤預防指南.md) - 錯誤預防

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


