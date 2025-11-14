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
├── guards/            # 路由守衛（規劃中）
└── interceptors/      # HTTP 攔截器（規劃中）
```

#### 職責界線
- **supabase/**：Supabase 客戶端管理、認證適配
- **net/**：HTTP 請求攔截、錯誤處理、Token 刷新
- **permissions/**：權限檢查、角色管理、權限同步
- **startup/**：應用啟動初始化、Session 恢復、權限同步

### Shared 模組（共享層）

#### 模組結構（規劃中）
```
shared/
├── models/            # 數據模型（按 11 個業務模組分類）
│   ├── account/       # 🔐 帳戶與身份系統（4 張表）
│   ├── collaboration/ # 🤝 組織協作系統（3 張表）
│   ├── permission/    # 🔒 權限系統（5 張表）
│   ├── blueprint/     # 🎯 藍圖/專案系統（5 張表）
│   ├── task/          # 📋 任務執行系統（9 張表）
│   ├── quality/       # ✅ 品質驗收系統（4 張表）
│   ├── issue/         # ⚠️ 問題追蹤系統（4 張表）
│   ├── communication/ # 💬 協作溝通系統（6 張表）
│   ├── data/          # 📊 資料分析系統（6 張表）
│   ├── bot/           # 🤖 機器人系統（3 張表）
│   └── system/        # ⚙️ 系統管理（2 張表）
├── services/          # 共享服務（Repository 模式）
├── components/        # 共享組件
├── utils/             # 工具函數
├── pipes/             # 管道
├── directives/        # 指令
├── interfaces/        # 接口定義
└── constants/         # 常量定義
```

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

## 技術架構

### 前端技術棧
- **框架**：Angular 20.3.x
- **UI 庫**：NG-ZORRO 20.3.x
- **企業框架**：NG-ALAIN 20.0.x
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

**最後更新**：2025-01-15  
**維護者**：開發團隊
