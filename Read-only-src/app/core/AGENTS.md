# Core 模組開發指南

> 🤖 **AI Agent 提醒**: 每次開發都要清除冗餘並更新 memory.json（含去重）

## 📋 職責範圍

`core` 負責核心基礎設施：
- `startup/` - 應用初始化
- `net/` - HTTP 攔截器、錯誤處理
- `i18n/` - 多語言
- `supabase/` - 資料庫服務
- `user/` - 用戶服務
- `organization/` - 組織服務
- `team/` - 團隊服務
- `weather/` - 天氣服務
- `blueprint/` - 藍圖服務
- Guards - 路由守衛

⚠️ **禁止**: 在 core 添加業務邏輯

> 📖 **通用規範**參見 [根目錄 AGENTS.md](../../AGENTS.md)

## 🎯 子目錄職責

- `startup/` - 應用啟動
- `net/` - HTTP 攔截器、錯誤處理、Token 刷新
- `i18n/` - 多語言
- `supabase/` - ⚠️ 所有資料庫操作使用 Supabase MCP 工具
- `user/` - 用戶相關服務
- `organization/` - 組織相關服務
- `team/` - 團隊相關服務
- `weather/` - 天氣服務
- `blueprint/` - 藍圖服務

## 📝 服務設計

```typescript
@Injectable({ providedIn: 'root' })
export class CoreService {
  private readonly #state = signal<T>(initialValue);
  private readonly #http = inject(HttpClient);
  
  readonly state = this.#state.asReadonly();
  
  async loadData(): Promise<void> {
    // 使用 Signal 更新狀態
    this.#state.update(current => newValue);
  }
}
```

## 🔗 依賴關係

### 允許的依賴
- ✅ Core 服務可以依賴 `core/supabase`
- ✅ Core 服務可以依賴 `core/net`
- ✅ Core 服務可以依賴 Angular 核心模組

### 禁止的依賴
- ❌ Core 不應依賴 `routes/`（功能頁面）
- ❌ Core 不應依賴 `shared/`（共享組件）

## 🛡️ 強制規範

- **Supabase MCP**: 所有資料庫操作必須使用 Supabase MCP 工具
- **Signal-based State**: 使用 Signal 管理服務狀態
- **單一職責**: 每個服務應有明確職責
- **錯誤處理**: 完整的錯誤處理和驗證

## ✅ 工作準則

### Do
- 使用 `@Injectable({ providedIn: 'root' })`
- 使用 `inject()` 替代 constructor injection
- 使用 Signal-based 狀態管理
- 使用 Supabase MCP 進行所有資料庫操作
- 提供完整的錯誤處理

### Don't
- 不添加業務邏輯到 core
- 不直接操作資料庫或使用非 MCP 方式
- 不依賴 routes 或 shared
- 不違反單一職責原則

## 💡 代碼示例

### Service 設計示例

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase/supabase.service';

@Injectable({ providedIn: 'root' })
export class CoreService {
  private readonly #supabase = inject(SupabaseService); // ✅ 使用 inject()
  
  // ✅ 使用 Signal 管理狀態
  private readonly #state = signal<State>(initialState);
  readonly state = this.#state.asReadonly(); // ✅ 暴露 ReadonlySignal
  
  // ✅ 使用 computed() 創建派生狀態
  readonly isLoading = computed(() => this.#state().loading);
  
  async loadData(): Promise<void> {
    this.#state.update(s => ({ ...s, loading: true }));
    try {
      // ⚠️ 使用 Supabase MCP 工具進行資料庫操作
      const data = await this.#supabase.query('SELECT * FROM table');
      this.#state.update(s => ({ ...s, data, loading: false }));
    } catch (error) {
      this.#state.update(s => ({ ...s, error, loading: false }));
    }
  }
}
```

### Supabase MCP 使用示例

```typescript
// ✅ 正確：使用 Supabase MCP 工具
// 在開發時，使用 @SUPABASE 或 @DB7 短碼
// 例如：@SUPABASE 查詢所有用戶

// 在代碼中，通過 SupabaseService 封裝
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly #supabase = inject(SupabaseService);
  
  async getUsers() {
    // 使用 SupabaseService 封裝的查詢方法
    return await this.#supabase.from('users').select('*');
  }
}
```

## 📚 相關文檔

### 核心文檔
- [Core README](./README.md) - 核心層說明
- [App 目錄 AGENTS.md](../AGENTS.md) - 應用層規範
- [專案根目錄 AGENTS.md](../../../AGENTS.md) - 完整開發規範

### 專案文檔
- [文檔索引](../../../docs/README.md) - 完整文檔導航
- [開發作業指引](../../../docs/00-開發作業指引.md) - 開發規範
- [API 接口詳細文檔](../../../docs/33-API-接口詳細文檔.md) - API 文檔
- [資料模型對照表](../../../docs/34-資料模型對照表.md) - 資料模型

---

**最後更新**：2025-11-13  
**維護者**：開發團隊


