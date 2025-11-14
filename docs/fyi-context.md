# 上下文脈絡 (FYI - Context)

> 參考：[@fyi.md](./fyi.md)

提供跨領域、跨模組、跨團隊都需要了解的上下文資訊，例如 Domain 解釋、專用名詞、業務邏輯背景。

---

## Domain 用語

### 核心概念

#### 藍圖 (Blueprint)
- **定義**：專案的主體結構，包含所有任務與設定
- **英文**：Blueprint
- **說明**：類似 Git 的 Repository，是整個專案的核心容器
- **權限**：由擁有者（Owner）全權控制

#### 主分支 (Main Branch)
- **定義**：藍圖擁有者控制的主要分支
- **英文**：Main Branch
- **說明**：類似 Git 的 main/master 分支，是權威數據源
- **權限**：只有擁有者可以修改任務結構

#### 組織分支 (Organization Branch)
- **定義**：協作組織的 Fork 分支
- **英文**：Organization Branch
- **說明**：類似 Git 的 feature 分支，協作組織在自己的分支上工作
- **權限**：協作組織可以填寫承攬欄位、創建 PR

#### 承攬欄位 (Contractor Fields)
- **定義**：只有承攬商可以填寫的執行數據欄位
- **英文**：Contractor Fields
- **說明**：協作組織在自己的分支上填寫的執行數據
- **權限**：只有協作組織可以填寫

#### Pull Request (PR)
- **定義**：承攬商提交執行數據的請求
- **英文**：Pull Request
- **說明**：類似 Git 的 PR，協作組織提交數據到主分支
- **權限**：協作組織可以創建，擁有者可以審核和合併

#### 暫存區 (Staging Area)
- **定義**：48 小時可撤回的緩衝區
- **英文**：Staging Area
- **說明**：任務提交後的暫存區域，48 小時內可以撤回
- **用途**：提供錯誤修正的機會

#### 責任切割 (Responsibility Transfer)
- **定義**：驗收通過後的責任轉移點
- **英文**：Responsibility Transfer
- **說明**：驗收通過後，責任從承攬商轉移到擁有者
- **用途**：明確責任歸屬

---

## 權限系統用語

### 角色 (Role)

#### 系統角色
- **blueprint_owner**：藍圖擁有者（全權控制）
- **blueprint_admin**：藍圖管理員
- **project_manager**：專案經理
- **contractor**：承攬商（僅操作承攬欄位）
- **quality_inspector**：品管人員
- **viewer**：查看者（唯讀）

### 權限 (Permission)

#### 權限格式
- **格式**：`{resource}.{action}`
- **範例**：`blueprint.read`, `task.create`, `pr.review`

#### 資源類型 (Resource)
- `blueprint` - 藍圖
- `task` - 任務
- `pull_request` - PR
- `role` - 角色
- `permission` - 權限

#### 操作類型 (Action)
- `create` - 創建
- `read` - 讀取
- `update` - 更新
- `delete` - 刪除
- `assign` - 分配
- `review` - 審核
- `merge` - 合併

### 權限級別 (Permission Level)

#### 分支權限級別
- **owner**：擁有者（所有權限）
- **admin**：管理員（管理權限）
- **write**：寫入（編輯權限）
- **read**：讀取（只讀權限）

---

## 業務邏輯背景

### Git-like 分支模型

#### 工作流程
```
1. 擁有者創建藍圖（主分支）
   ↓
2. 協作組織 Fork 藍圖（創建組織分支）
   ↓
3. 協作組織在分支上填寫承攬欄位
   ↓
4. 協作組織創建 PR（提交執行數據）
   ↓
5. 擁有者審核 PR
   ↓
6. 擁有者合併 PR（更新主分支）
   ↓
7. 驗收通過，責任轉移
```

#### 權限控制規則
- **擁有者**：
  - ✅ 修改任務結構
  - ✅ 審核 PR
  - ✅ 合併 PR
  - ✅ 所有操作

- **協作組織**：
  - ✅ 填寫承攬欄位
  - ✅ 創建 PR
  - ✅ 查看藍圖
  - ❌ 修改任務結構
  - ❌ 審核 PR

- **查看者**：
  - ✅ 查看藍圖
  - ❌ 所有寫入操作

---

## 模組之間的關係

### 權限服務與認證服務

```
SupabaseAuthAdapterService (認證)
  ↓ 提供用戶身份
PermissionService (權限)
  ↓ 檢查權限
ACLService (@delon/acl)
  ↓ 緩存權限
Component / Guard (使用)
```

### 權限服務與數據庫

```
PermissionService
  ↓ 查詢
SupabaseService
  ↓ 訪問
Supabase Database
  ├── roles (角色定義)
  ├── user_roles (用戶角色關聯)
  ├── permissions (權限定義)
  ├── role_permissions (角色權限關聯)
  └── branch_permissions (分支權限)
```

### 啟動流程關係

```
應用啟動
  ↓
StartupService.load()
  ↓
1. restoreSession() (SupabaseAuthAdapterService)
   ↓ 恢復 Session
2. syncRolesFromDatabase() (PermissionService)
   ↓ 同步權限
3. 初始化菜單、設置等
```

---

## 技術上下文

### @delon/acl 整合

#### ACLService 數據結構
```typescript
{
  full: boolean,           // 是否全量權限
  role: string[],          // 角色列表
  abilities: string[]      // 權限列表
}
```

#### 權限檢查方法
- `ACLService.can(permission)` - 檢查權限
- `ACLService.set({ role, abilities })` - 設置權限
- `ACLService.setFull(true)` - 設置全量權限

### Supabase 整合

#### Session 格式
```typescript
{
  access_token: string,
  refresh_token: string,
  expires_in: number,
  user: {
    id: string,
    email: string,
    ...
  }
}
```

#### Token 格式（@delon/auth）
```typescript
{
  token: string,
  refresh_token: string,
  expired: number,
  user: {
    id: string,
    email: string,
    ...
  }
}
```

---

## 業務規則

### 權限檢查規則

#### 藍圖訪問權限
1. 檢查是否為藍圖擁有者
2. 檢查用戶角色（user_roles）
3. 檢查角色權限（role_permissions）
4. 檢查分支權限（branch_permissions）

#### 分支訪問權限
1. 檢查分支權限（branch_permissions）
2. 如果沒有分支權限，檢查是否為藍圖擁有者
3. 根據權限級別判斷操作權限

### 數據同步規則

#### 權限同步時機
- 應用啟動時
- 用戶登入後
- 權限變更後（手動刷新）

#### 緩存更新規則
- ACLService 緩存：實時更新
- 內存緩存：5 分鐘 TTL，自動過期
- 數據庫：權威數據源

---

## 重要約定

### 命名規範
- **文件夾**：kebab-case（如 `permission.service.ts`）
- **類名**：PascalCase（如 `PermissionService`）
- **方法名**：camelCase（如 `canAccessBlueprint`）
- **權限名稱**：`{resource}.{action}`（如 `blueprint.read`）

### 錯誤處理約定
- 權限檢查失敗：拋出異常
- 數據庫查詢錯誤：拋出詳細錯誤信息
- 權限不足：返回明確的錯誤消息

### 緩存約定
- 緩存鍵：權限名稱（如 `blueprint.read`）
- 緩存時間：5 分鐘 TTL
- 緩存更新：自動過期或手動刷新

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
