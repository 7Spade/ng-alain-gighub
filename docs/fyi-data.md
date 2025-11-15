# 數據脈絡 (FYI - Data)

> 參考：[@fyi.md](./fyi.md)

記錄數據模型設計、數據訪問模式、數據轉換邏輯、數據一致性保證等相關決策和實施細節。

**相關文檔**：
- [資料表清單總覽](./30-資料表清單總覽.md) - 51 張資料表清單
- [完整 SQL 表結構定義](./30-0-完整SQL表結構定義.md) - 完整資料表結構
- [資料模型對照表](./34-資料模型對照表.md) - 資料庫與 TypeScript 模型對照
- [實體關係圖](./12-實體關係圖.mermaid.md) - 資料庫 ER 圖

---

## 數據架構總覽

### 51 張資料表分類

系統共包含 **51 張資料表**，分為 11 個模組：

| 分類 | 數量 | 說明 |
|------|------|------|
| 🔐 帳戶與身份系統 | 4 張 | 統一身份抽象、團隊、排班 |
| 🤝 組織協作系統 | 3 張 | 跨組織協作、邀請管理 |
| 🔒 權限系統 | 5 張 | 角色權限、分支權限控制 |
| 🎯 藍圖/專案系統 | 5 張 | Git-like 分支模型 |
| 📋 任務執行系統 | 9 張 | 樹狀任務、暫存區、日誌 |
| ✅ 品質驗收系統 | 4 張 | 品管、驗收、責任切割 |
| ⚠️ 問題追蹤系統 | 4 張 | 問題管理、跨分支同步 |
| 💬 協作溝通系統 | 6 張 | 留言、通知、待辦中心 |
| 📊 資料分析系統 | 6 張 | 文件管理、進度追蹤、分析快取 |
| 🤖 機器人系統 | 3 張 | Bot 定義、任務、執行日誌 |
| ⚙️ 系統管理 | 2 張 | 系統設定、功能開關 |
| **總計** | **51 張** | |

### 核心設計原則

1. **統一身份抽象**：`accounts` 表支援 User/Bot/Organization 三種類型
2. **Bot 類型區分**：使用 `auth_organization_id` 區分個人 Bot（NULL）和組織 Bot（組織ID）
3. **Git-like 分支模型**：藍圖、分支、PR 機制
4. **暫存區機制**：48 小時可撤回
5. **軟刪除**：重要資料使用軟刪除，保留歷史記錄
6. **版本控制**：文件管理支援版本控制
7. **組織專有功能**：團隊和排班必須關聯到組織

---

## 數據模型設計

### accounts 表字段語義

#### 核心字段

- `id`：賬戶唯一標識符（UUID）
- `type`：賬戶類型（'User', 'Bot', 'Organization'）
- `name`：賬戶名稱
- `email`：郵箱（可選）
- `status`：賬戶狀態（'active', 'inactive', 'suspended'）

#### 身份關聯字段

- `auth_user_id`：
  - User 類型：關聯到 `auth.users.id`
  - Bot/Organization 類型：必須為 NULL

- `auth_organization_id`：
  - Organization 類型：記錄創建者（用戶ID）
  - Bot 類型：記錄所屬組織（NULL = 個人 Bot，有值 = 組織 Bot）
  - User 類型：NULL

- `auth_bot_id`：
  - Bot 類型：記錄創建者（用戶ID）
  - User/Organization 類型：NULL

#### 字段語義總結

| 字段 | User | Organization | Bot（個人） | Bot（組織） |
|------|------|--------------|-------------|-------------|
| `auth_user_id` | ✅ 用戶ID | ❌ NULL | ❌ NULL | ❌ NULL |
| `auth_organization_id` | ❌ NULL | ✅ 創建者ID | ❌ NULL | ✅ 組織ID |
| `auth_bot_id` | ❌ NULL | ❌ NULL | ✅ 創建者ID | ✅ 創建者ID |

### 命名規範

#### 資料庫命名規範

- **表名**：小寫 + 底線（snake_case），複數形式
  - 範例：`accounts`, `blueprints`, `task_assignments`
- **欄位名**：小寫 + 底線（snake_case）
  - 範例：`user_id`, `created_at`, `is_private`
- **主鍵**：統一使用 `id`（UUID 類型）
- **外鍵**：`{table}_id` 格式
  - 範例：`blueprint_id`, `account_id`
- **時間戳記**：`created_at`, `updated_at`

#### TypeScript 命名規範

- **介面名**：PascalCase，單數形式
  - 範例：`Account`, `Blueprint`, `TaskAssignment`
- **屬性名**：camelCase
  - 範例：`userId`, `createdAt`, `isPrivate`
- **類型別名**：PascalCase，通常以 `Type` 或具體名稱結尾
  - 範例：`BlueprintStatus`, `TeamMemberRole`

### 類型對照

#### PostgreSQL ↔ TypeScript 類型對照表

| PostgreSQL 類型 | TypeScript 類型 | 說明 | 範例 |
|----------------|----------------|------|------|
| `uuid` | `string` | UUID 字串 | `"550e8400-e29b-41d4-a716-446655440000"` |
| `text` | `string` | 文字字串 | `"Hello World"` |
| `varchar(n)` | `string` | 有限長度字串 | `"example"` |
| `integer` | `number` | 整數 | `42` |
| `bigint` | `number` | 大整數 | `1234567890` |
| `numeric(p,s)` | `number` | 精確數值 | `123.45` |
| `boolean` | `boolean` | 布林值 | `true`, `false` |
| `date` | `string` | ISO 8601 日期字串 | `"2025-01-15"` |
| `timestamp` | `string` | ISO 8601 時間戳記 | `"2025-01-15T08:30:00Z"` |
| `timestamp with time zone` | `string` | ISO 8601 時間戳記（含時區） | `"2025-01-15T08:30:00+08:00"` |
| `jsonb` | `Record<string, unknown> \| null` | JSON 物件 | `{ "key": "value" }` |
| `jsonb` | `T[] \| null` | JSON 陣列 | `["item1", "item2"]` |
| `enum` | `'value1' \| 'value2'` | 字串字面值聯合類型 | `'active' \| 'inactive'` |
| `array` | `T[]` | 陣列類型 | `string[]`, `number[]` |

---

## 數據訪問模式

### Repository 模式

系統採用 Repository 模式進行數據訪問，位於 `core/infra/repositories/`。

#### BaseRepository

**設計決策**：提供基礎 Repository 類，封裝通用 CRUD 操作

**優勢**：
- 統一數據訪問接口
- 自動處理數據轉換（snake_case ↔ camelCase）
- 統一錯誤處理
- 類型安全

**實現方式**：
```typescript
abstract class BaseRepository<T> {
  protected abstract tableName: string;
  
  async findById(id: string): Promise<T | null>
  async findAll(): Promise<T[]>
  async create(data: Partial<T>): Promise<T>
  async update(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
}
```

#### 擴展方式

**三步完成**：
1. 定義類型（從 `database.types.ts` 提取）
2. 繼承 `BaseRepository`
3. 設置 `tableName`

**範例**：
```typescript
export class AccountRepository extends BaseRepository<Account> {
  protected tableName = 'accounts';
  
  // 可以添加特定查詢方法
  async findByEmail(email: string): Promise<Account | null> {
    // ...
  }
}
```

### 數據轉換

#### snake_case ↔ camelCase 轉換

**設計決策**：資料庫使用 snake_case，應用層使用 camelCase

**原因**：
- 資料庫遵循 PostgreSQL 慣例（snake_case）
- TypeScript/JavaScript 遵循 camelCase 慣例
- 自動轉換減少手動映射工作

**實現位置**：`core/infra/utils/transformers.ts`

**轉換函數**：
- `toCamelCaseData<T>(data: any): T` - 資料庫 → 應用層
- `toSnakeCaseData<T>(data: Partial<T>): any` - 應用層 → 資料庫

---

## 數據一致性保證

### 外鍵約束

所有外鍵關係都使用資料庫外鍵約束：

```sql
-- 範例：accounts 表的外鍵
auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
```

**設計決策**：使用 `ON DELETE CASCADE` 確保數據一致性

**權衡**：
- 優勢：自動清理關聯資料，避免孤立資料
- 風險：刪除操作可能影響多個表，需要謹慎操作

### 唯一約束

關鍵欄位使用唯一約束：

```sql
-- 範例：accounts 表的唯一約束
UNIQUE(auth_user_id)
UNIQUE(email)
```

### 檢查約束

使用檢查約束確保數據有效性：

```sql
-- 範例：accounts 表的檢查約束
type VARCHAR(20) NOT NULL CHECK (type IN ('User', 'Bot', 'Organization'))
status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'))
```

---

## 特殊數據處理

### 軟刪除

**設計決策**：重要資料使用軟刪除，保留歷史記錄

**實施方式**：
- 添加 `deleted_at` 欄位（TIMESTAMPTZ）
- 刪除操作更新 `deleted_at`，不實際刪除資料
- 查詢時過濾 `deleted_at IS NULL` 的資料

**適用表**：
- `accounts` - 帳戶資料
- `blueprints` - 藍圖資料
- `tasks` - 任務資料
- `documents` - 文件資料

### 版本控制

**設計決策**：文件管理支援版本控制

**實施方式**：
- `documents` 表存儲文件元數據
- `document_versions` 表存儲文件版本
- 每個版本包含 `version_number`, `file_path`, `created_at`

### 暫存區機制

**設計決策**：任務提交後進入暫存區，48 小時內可撤回

**實施方式**：
- `task_staging` 表存儲暫存資料
- `expires_at` 欄位記錄過期時間
- 48 小時後自動過期，無法撤回

---

## 數據查詢優化

### 索引策略

**設計決策**：為常用查詢欄位建立索引

**索引類型**：
- **主鍵索引**：自動建立（PRIMARY KEY）
- **外鍵索引**：為所有外鍵建立索引
- **查詢索引**：為常用查詢欄位建立索引（如 `type`, `status`, `email`）

**範例**：
```sql
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_auth_user_id ON accounts(auth_user_id);
```

### 查詢優化

**設計決策**：使用適當的查詢方式減少資料庫負載

**策略**：
- 使用 `SELECT` 指定需要的欄位，避免 `SELECT *`
- 使用 `LIMIT` 限制查詢結果數量
- 使用 `JOIN` 代替多次查詢
- 使用 `EXISTS` 代替 `COUNT(*) > 0`

---

## 數據遷移與版本控制

### 遷移策略

**設計決策**：使用 Supabase Migrations 管理資料庫變更

**實施方式**：
- 使用 Supabase MCP 工具執行遷移
- 每個遷移包含版本號和描述
- 遷移文件記錄在 `supabase/migrations/`

### 版本控制

**設計決策**：資料庫結構變更需要同步更新文檔

**更新文檔**：
- `docs/30-0-完整SQL表結構定義.md` - 完整 SQL 結構
- `docs/34-資料模型對照表.md` - TypeScript 模型對照
- `src/app/core/infra/types/database.types.ts` - TypeScript 類型定義

---

## 數據驗證

### 應用層驗證

**設計決策**：在應用層進行數據驗證，提供更好的用戶體驗

**實施方式**：
- 使用 Angular Validators 進行表單驗證
- 使用 TypeScript 類型系統確保類型安全
- 使用 JSON Schema 驗證複雜數據結構

### 資料庫層驗證

**設計決策**：在資料庫層也進行驗證，作為最後防線

**實施方式**：
- 使用 CHECK 約束驗證數據範圍
- 使用 NOT NULL 約束確保必填欄位
- 使用外鍵約束確保關聯完整性

---

## 設計決策記錄

### 2025-01-15: Repository 模式實施

**決策**：採用 Repository 模式進行數據訪問

**原因**：
- 統一數據訪問接口
- 封裝數據轉換邏輯
- 統一錯誤處理
- 易於測試和維護

**權衡**：
- 優勢：代碼組織清晰，易於擴展
- 成本：需要額外的抽象層，但帶來更好的可維護性

### 2025-01-15: 數據轉換自動化

**決策**：自動處理 snake_case ↔ camelCase 轉換

**原因**：
- 減少手動映射工作
- 確保轉換一致性
- 降低出錯風險

**權衡**：
- 優勢：開發效率提升，代碼更簡潔
- 成本：需要維護轉換邏輯，但可以復用

---

## 參考資源

- [資料表清單總覽](./30-資料表清單總覽.md)
- [完整 SQL 表結構定義](./30-0-完整SQL表結構定義.md)
- [資料模型對照表](./34-資料模型對照表.md)
- [實體關係圖](./12-實體關係圖.mermaid.md)
- [Supabase 文檔](https://supabase.com/docs)

---

**最後更新**：2025-01-15  
**維護者**：開發團隊

