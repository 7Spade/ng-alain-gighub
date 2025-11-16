# 架構脈絡說明 (FYI - Architecture)

> 參考：[@fyi.md](./fyi.md)

描述系統架構的設計理念、模組拆分方式、責任界線、技術架構、資料流、依賴關係等。

---

## 項目結構設計

### 分層架構

```
routes (業務層)
  ↓ 依賴
shared (共享層)
  ↓ 依賴
core (基礎設施層)
```

**設計原則**：
- 嚴格遵循依賴方向，禁止反向依賴
- 每層職責清晰，易於維護和測試

### Core 模組（核心基礎設施層）

#### 模組結構
```
core/
├── auth/              # 認證服務（規劃中）
├── supabase/          # Supabase 數據庫服務
│   ├── supabase.service.ts
│   └── supabase-auth-adapter.service.ts
├── net/               # HTTP 攔截器
│   ├── default.interceptor.ts
│   ├── refresh-token.ts
│   └── helper.ts
├── i18n/              # 國際化
├── startup/           # 啟動服務
│   └── startup.service.ts
├── permissions/       # 權限服務 ⭐ 新增
│   ├── types.ts
│   ├── permission.service.ts
│   └── role.service.ts
├── infra/             # 基礎設施模組 ⭐ 新增
│   ├── types/         # TypeScript 類型定義（51 張表）
│   ├── repositories/  # Repository 模式實現
│   ├── errors/        # 統一錯誤處理
│   └── utils/         # 工具函數
├── guards/            # 路由守衛（規劃中）
└── interceptors/      # HTTP 攔截器（規劃中）
```

#### 職責界線
- **supabase/**：Supabase 客戶端管理、認證適配
- **infra/**：數據訪問層基礎設施（Repository 模式、類型定義、錯誤處理、數據轉換）⭐ 新增
- **net/**：HTTP 請求攔截、錯誤處理、Token 刷新
- **permissions/**：權限檢查、角色管理、權限同步
- **startup/**：應用啟動初始化、Session 恢復、權限同步

### Shared 模組（共享層）

#### 模組結構
```
shared/
├── models/            # 數據模型（按 11 個業務模組分類）
│   ├── account/       # 🔐 帳戶與身份系統（4 張表）
│   │   ├── index.ts
│   │   └── types.ts   # ✅ 統一使用 types.ts 命名
│   ├── collaboration/ # 🤝 組織協作系統（3 張表）
│   ├── permission/    # 🔒 權限系統（5 張表）
│   ├── blueprint/     # 🎯 藍圖/專案系統（5 張表）
│   ├── task/          # 📋 任務執行系統（9 張表）
│   ├── quality/       # ✅ 品質驗收系統（4 張表）
│   ├── issue/         # ⚠️ 問題追蹤系統（4 張表）
│   ├── communication/ # 💬 協作溝通系統（6 張表）
│   ├── data/          # 📊 資料分析系統（6 張表）
│   ├── bot/           # 🤖 機器人系統（3 張表）
│   ├── system/        # ⚙️ 系統管理（2 張表）
│   └── index.ts       # ✅ 統一導出所有模組類型
├── services/          # 共享服務（Repository 模式）
├── components/        # 共享組件
├── utils/             # 工具函數
├── pipes/             # 管道
├── directives/        # 指令
├── interfaces/        # 接口定義
└── constants/         # 常量定義
```

**文件命名規範**（2025-01-15 更新）：
- ✅ 所有模組統一使用 `types.ts` 命名
- ❌ 不再使用 `.model.ts` 後綴
- ✅ 通過 `shared/models/index.ts` 統一導出

### Routes 模組（業務層）

#### 模組結構（規劃中）
```
routes/
├── accounts/          # 🔐 帳戶管理
├── blueprints/        # 🎯 藍圖管理（Git-like 分支模型）
├── tasks/             # 📋 任務執行
├── quality/           # ✅ 品質驗收
├── issues/            # ⚠️ 問題追蹤
├── collaboration/     # 💬 協作溝通
├── documents/         # 📁 文件管理
├── analytics/         # 📊 數據分析
├── system/            # ⚙️ 系統管理
└── dashboard/         # 📊 儀表板
```

---

## 權限系統架構

### 權限檢查流程

```
權限檢查請求
  ↓
1. 檢查 @delon/acl ACLService 本地緩存
  ↓ (如果沒有)
2. 檢查內存緩存（5 分鐘 TTL）
  ↓ (如果沒有)
3. 查詢 Supabase 數據庫
   - user_roles (用戶角色關聯)
   - role_permissions (角色權限關聯)
   - permissions (權限定義)
  ↓
4. 同步到 ACLService 和內存緩存
  ↓
5. 返回權限檢查結果
```

### 數據庫查詢架構

```
PermissionService.can(permission)
  ↓
Supabase Query:
  user_roles
    ↓ join
  roles
    ↓ join
  role_permissions
    ↓ join
  permissions
  ↓
檢查權限匹配
  ↓
同步到 ACLService
```

### 權限同步架構

```
應用啟動
  ↓
restoreSession() (Supabase)
  ↓
syncRolesFromDatabase() (PermissionService)
  ↓
查詢 user_roles + roles
  ↓
ACLService.set({ role: [...] })
  ↓
loadUserPermissions()
  ↓
查詢 user_roles → role_permissions → permissions
  ↓
ACLService.set({ abilities: [...] })
```

---

## 認證系統架構

### 認證流程

```
用戶登入
  ↓
SupabaseAuthAdapter.signIn()
  ↓
Supabase Auth API
  ↓
獲得 Supabase Session
  ↓
適配器轉換為 @delon/auth 格式
  ↓
TokenService.set() ← 現有代碼繼續工作
  ↓
HTTP 攔截器自動添加 Authorization: Bearer {token}
```

### Session 同步機制

```
Supabase Session
  ↓
convertSessionToTokenFormat()
  ↓
@delon/auth Token 格式
  {
    token: string,
    refresh_token: string,
    expired: number,
    user: { id, email, ... }
  }
  ↓
TokenService.set()
  ↓
ACLService / HTTP Interceptor 使用
```

### 自動狀態同步

```
Supabase Auth State Change
  ↓
onAuthStateChange() 監聽
  ↓
自動同步到 TokenService
  ↓
應用狀態更新
```

---

## 模組依賴關係

### 權限服務依賴

```
PermissionService
  ├── ACLService (@delon/acl)
  ├── SupabaseService
  └── DA_SERVICE_TOKEN (@delon/auth)

RoleService
  ├── PermissionService
  ├── SupabaseService
  └── DA_SERVICE_TOKEN (@delon/auth)
```

### 啟動服務依賴

```
StartupService
  ├── SupabaseAuthAdapterService
  ├── PermissionService
  ├── ACLService
  ├── TokenService
  └── MenuService, SettingsService, etc.
```

---

## 賬戶系統架構

### 賬戶類型與關係

系統支持三種賬戶類型，通過 `accounts` 表統一管理：

1. **User（用戶賬戶）**
   - 與 Supabase Auth 的 `auth.users` 表一對一關聯
   - 通過註冊流程自動創建（觸發器）

2. **Organization（組織賬戶）**
   - 由用戶創建，`auth_organization_id` 記錄創建者
   - 專有功能：團隊管理、排班管理
   - 通過 `create_organization_account` SECURITY DEFINER 函數創建

3. **Bot（機器人賬戶）**
   - 分類：個人 Bot 和組織 Bot
   - 個人 Bot：`auth_organization_id = NULL`，只有創建者可查看
   - 組織 Bot：`auth_organization_id = 組織ID`，創建者和組織成員都可查看
   - 通過 `create_bot_account` SECURITY DEFINER 函數創建

### 組織專有功能

#### 團隊管理（Teams）

- **數據模型**：`teams` 表，必須關聯到組織（`organization_id`）
- **Service 層**：`TeamService`，提供 `loadTeamsByOrganizationId` 方法
- **UI 層**：`TeamListComponent`，包含組織選擇器
- **權限控制**：RLS 策略確保用戶只能查看所屬組織的團隊

#### 排班管理（Organization Schedules）

- **數據模型**：`organization_schedules` 表，必須關聯到組織（`organization_id`）
- **Service 層**：`OrganizationScheduleService`，提供 `loadSchedulesByOrganizationId` 方法
- **UI 層**：`ScheduleListComponent`，包含組織選擇器
- **權限控制**：RLS 策略確保用戶只能查看所屬組織的排班

### Service 層架構

#### AccountService

```typescript
@Injectable({ providedIn: 'root' })
export class AccountService {
  // Signals
  readonly accounts: ReadonlySignal<Account[]>
  readonly userAccounts: ReadonlySignal<Account[]>
  readonly organizationAccounts: ReadonlySignal<Account[]>
  readonly botAccounts: ReadonlySignal<Account[]>
  readonly personalBotAccounts: ReadonlySignal<Account[]>  // 新增
  readonly organizationBotAccounts: ReadonlySignal<Account[]>  // 新增

  // 方法
  async createOrganizationAccount(name, email?, status?): Promise<Account>
  async createBotAccount(name, email?, status?, organizationId?): Promise<Account>  // 新增 organizationId 參數
}
```

#### 狀態管理注意事項

**單例服務的狀態是全局共享的**：
- 所有使用 `providedIn: 'root'` 的服務都是單例
- 多個組件共享同一個服務實例時，狀態會互相影響
- `loading`、`error` 等狀態是全局的，需要謹慎使用

**最佳實踐**：
1. **避免在子組件中修改父組件依賴的狀態**：子組件不應該影響父組件的顯示邏輯
2. **優先加載主要功能**：先加載用戶最需要的內容，輔助功能可以異步加載
3. **非阻塞加載**：使用 `.catch()` 而不是 `await`，避免阻塞頁面渲染
4. **條件加載**：只在需要時才加載數據，避免重複加載

**參考案例**：
- [組織管理頁面無限加載問題修復](./工作總結-組織管理頁面無限加載問題修復-2025-01-15.md)

#### TeamService

```typescript
@Injectable({ providedIn: 'root' })
export class TeamService {
  // Signals
  readonly teams: ReadonlySignal<Team[]>
  
  // 方法
  async loadTeamsByOrganizationId(organizationId: string): Promise<Team[]>
}
```

#### OrganizationScheduleService

```typescript
@Injectable({ providedIn: 'root' })
export class OrganizationScheduleService {
  // Signals
  readonly schedules: ReadonlySignal<OrganizationSchedule[]>
  
  // 方法
  async loadSchedulesByOrganizationId(organizationId: string): Promise<OrganizationSchedule[]>
}
```

---

## 技術架構

### 前端技術棧
- **框架**：Angular 20.3.x
- **UI 庫**：NG-ZORRO 20.3.x
- **企業框架**：NG-ALAIN 20.1.x
- **後端服務**：Supabase
- **狀態管理**：RxJS + Angular Signals
- **包管理器**：Yarn 4.9.2

### 設計模式
- **適配器模式**：SupabaseAuthAdapterService
- **Repository 模式**：規劃中（shared/services/）
- **分層架構**：routes → shared → core
- **領域驅動設計（DDD）**：按業務模組組織

### 數據流

```
用戶操作
  ↓
Component (routes/)
  ↓
Service (shared/ 或 core/)
  ↓
Supabase Client (core/supabase/)
  ↓
Supabase Database
  ↓
Response
  ↓
Service 處理
  ↓
Component 更新 UI
```

---

## 基礎設施模組架構

### 模組結構

```
core/infra/
├── types/              # 類型定義
│   ├── database.types.ts    # Supabase 生成的類型定義（51 張表）
│   └── index.ts
├── repositories/       # Repository 模式實現
│   ├── base.repository.ts   # 基礎 Repository 類
│   ├── blueprint.repository.ts  # Blueprint Repository 示例
│   └── index.ts
├── errors/            # 錯誤處理
│   ├── error.types.ts       # 錯誤類型定義
│   ├── supabase-error.transformer.ts  # Supabase 錯誤轉換工具
│   └── index.ts
├── utils/             # 工具函數
│   ├── transformers.ts      # 數據轉換工具（snake_case ↔ camelCase）
│   └── index.ts
└── index.ts           # 統一導出
```

### 數據訪問架構

```
Service (shared/services/)
  ↓ 使用
Repository (core/infra/repositories/)
  ↓ 封裝
SupabaseService (core/supabase/)
  ↓ 調用
Supabase Client
  ↓ 查詢
PostgreSQL Database
```

### Repository 模式設計

#### BaseRepository
- **抽象類**：提供通用 CRUD 操作
- **泛型支持**：確保類型安全
- **自動轉換**：自動處理 snake_case ↔ camelCase 轉換
- **統一錯誤處理**：自動轉換 Supabase 錯誤為應用錯誤

#### 擴展方式
- **繼承 BaseRepository**：只需設置 `tableName` 即可獲得所有 CRUD 操作
- **添加特定方法**：可以添加特定查詢方法
- **三步完成**：定義類型 → 繼承類 → 設置表名

### 類型安全架構

```
Supabase Database Schema
  ↓ (Supabase MCP 工具生成)
TypeScript Types (database.types.ts)
  ↓ (類型提取)
Repository Generic Types
  ↓ (自動轉換)
Application Types (camelCase)
```

### 錯誤處理架構

```
Supabase Error (PostgrestError)
  ↓ (transformSupabaseError)
AppError (統一錯誤類型)
  ↓ (錯誤分類)
ErrorType (http | network | validation | business | permission | unknown)
  ↓ (錯誤嚴重程度)
ErrorSeverity (critical | error | warning | info)
```

### 數據轉換架構

```
Database Data (snake_case)
  ↓ (toCamelCaseData)
Application Data (camelCase)
  ↓ (業務邏輯處理)
Application Data (camelCase)
  ↓ (toSnakeCaseData)
Database Data (snake_case)
```

### 依賴關係

```
BaseRepository
  ├── SupabaseService (core/supabase/)
  ├── Error Transformer (core/infra/errors/)
  └── Data Transformer (core/infra/utils/)

Service (shared/services/)
  └── Repository (core/infra/repositories/)
      └── BaseRepository (core/infra/repositories/)
```

### 設計原則

1. **先做基礎**：只提供必要的通用功能，不包含業務邏輯
2. **方便擴展**：通過繼承輕鬆添加新 Repository
3. **開發平順**：自動處理數據轉換和錯誤處理
4. **避免錯誤**：類型安全和統一錯誤處理機制

---

## 權限控制架構

### Git-like 分支權限規則

```
藍圖 (Blueprint)
  ├── 擁有者 (Owner)
  │   ├── 修改任務結構 ✅
  │   ├── 審核 PR ✅
  │   └── 所有權限 ✅
  │
  └── 分支 (Branch)
      ├── 協作組織 (Collaborator)
      │   ├── 填寫承攬欄位 ✅
      │   ├── 創建 PR ✅
      │   └── 查看權限 ✅
      │
      └── 查看者 (Viewer)
          └── 只讀權限 ✅
```

### 權限檢查方法

```typescript
// 藍圖級權限
canAccessBlueprint(blueprintId, 'read' | 'write' | 'admin')

// 分支級權限
canAccessBranch(branchId, 'read' | 'write' | 'admin')

// 業務邏輯權限
canModifyTaskStructure(blueprintId)    // 只有擁有者
canFillContractorFields(branchId)      // 協作組織
canReviewPR(blueprintId)                // 只有擁有者
canCreatePR(branchId)                   // 分支所屬組織
```

---

## 模型結構清理（2025-01-15）

### 清理內容

- ✅ 刪除遺留文件：`activity-log.model.ts` 和 `quality-check.model.ts`
- ✅ 統一文件命名：所有模組使用 `types.ts` 命名規範
- ✅ 確認無衝突：與 `core/infra/types` 職責清晰，無類型衝突

**詳細記錄**：
- [模型結構分析報告](./模型结构分析报告.md)
- [模型結構清理總結](./模型结构清理总结-2025-01-15.md)

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
