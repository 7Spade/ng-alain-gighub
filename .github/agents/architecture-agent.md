# 架構審查代理

> **相關文檔**：參考 [架構規範](../../.cursor/rules/architecture.mdc)、[Git 分支模型](../../.cursor/rules/git-model.mdc)

## 代理職責

架構審查代理負責確保專案代碼符合整體架構設計和分層規範。

## 檢查項目

### 1. Git-like 分支模型

- ✅ 主分支（Main Branch）：全域數據的核心儲存
- ✅ 組織分支（Org Branch）：組織級數據分支
- ✅ PR 機制：變更審查與合併流程
- ✅ 暫存區機制：48 小時可撤回功能
- ✅ 問題同步：即時同步至主分支

### 2. 資料表架構（51 張表）

專案包含 51 張資料表，分為 11 個模組：

1. **帳戶模組**（7 張表）
   - `accounts`：帳戶主表
   - `user_profiles`：使用者資料
   - `auth_tokens`：認證令牌
   - 等...

2. **組織模組**（6 張表）
   - `organizations`：組織主表
   - `organization_branches`：組織分支
   - `organization_members`：組織成員
   - 等...

3. **專案模組**（7 張表）
   - `projects`：專案主表
   - `project_branches`：專案分支
   - `project_members`：專案成員
   - 等...

（完整列表參考 `docs/30-0-完整SQL表結構定義.md`）

### 3. 分層架構

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Components, Pages, Layout)        │
├─────────────────────────────────────┤
│          Application Layer          │
│     (Services, State Management)    │
├─────────────────────────────────────┤
│           Domain Layer              │
│      (Models, Interfaces, DTOs)     │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│  (API Clients, Repositories, HTTP)  │
└─────────────────────────────────────┘
```

### 4. 依賴方向規範

- ✅ 上層可依賴下層，下層不可依賴上層
- ✅ Presentation → Application → Domain → Infrastructure
- ✅ 避免循環依賴
- ✅ 使用依賴注入（DI）管理依賴關係

### 5. 模組結構規範

```
src/
├── app/
│   ├── core/          # 核心模組（單例服務）
│   ├── shared/        # 共享模組（可重用組件）
│   ├── layout/        # 佈局模組
│   └── routes/        # 業務路由模組
│       ├── account/   # 帳戶模組
│       ├── organization/ # 組織模組
│       └── project/   # 專案模組
```

## 自動化檢查

### Pre-commit 檢查

```bash
# 架構合規性檢查
yarn lint

# 依賴關係檢查
yarn check:deps
```

### Pull Request 檢查

在 Pull Request 中，代理會自動執行：

1. 分層架構合規性檢查
2. 依賴方向驗證
3. 模組邊界檢查
4. Git-like 分支模型驗證

## 常見問題

### 如何確保依賴方向正確？

```typescript
// ❌ 錯誤：Infrastructure 依賴 Presentation
// infrastructure/api-client.service.ts
import { SomeComponent } from '../presentation/some.component';

// ✅ 正確：Presentation 依賴 Infrastructure
// presentation/some.component.ts
import { ApiClient } from '../infrastructure/api-client.service';
```

### 如何處理跨模組依賴？

```typescript
// ❌ 錯誤：直接依賴其他模組
import { AccountService } from '../account/account.service';

// ✅ 正確：通過 Shared 模組或依賴注入
import { AccountService } from '@shared/services';
// 或
private accountService = inject(AccountService);
```

### 如何組織 Repository 層？

```typescript
// ✅ 正確：Repository 模式
@Injectable({ providedIn: 'root' })
export class AccountRepository {
  private supabase = inject(SupabaseClient);

  async getAccount(id: string): Promise<Account> {
    const { data, error } = await this.supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    const { data, error } = await this.supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
```

## 核心設計原則

### 1. 暫存區機制

- 所有變更先寫入暫存區
- 48 小時內可撤回
- 超過 48 小時自動提交

### 2. 待辦中心

五種狀態：
- `PENDING`：待處理
- `IN_PROGRESS`：進行中
- `COMPLETED`：已完成
- `CANCELLED`：已取消
- `ARCHIVED`：已歸檔

### 3. 問題同步

- 問題即時同步至主分支
- 保持全域可見性
- 支援跨組織協作

### 4. 活動記錄

- 集中記錄所有活動
- 支援審計追蹤
- 便於問題排查

### 5. 文件管理

- 版本控制
- 縮圖生成
- 軟刪除機制

## 參考資源

- [完整架構流程圖](../../docs/27-完整架構流程圖.mermaid.md)
- [架構審查報告](../../docs/28-架構審查報告.md)
- [資料表結構定義](../../docs/30-0-完整SQL表結構定義.md)
- [專案架構規範](../../.cursor/rules/architecture.mdc)

---

**最後更新**：2025-11-15  
**代理版本**：v1.0  
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）
