# 🔒 權限系統 - 任務追蹤

> 📋 **目的**：追蹤權限系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M3  
**資料表數量**：5 張  
**架構版本**：v2.0（Git-like 分支模型）

---

## 📊 模組資訊

### 資料表清單

1. **roles** - 角色定義表（系統角色、自訂角色）
2. **user_roles** - 用戶角色關聯表（支援藍圖級別、分支級別角色）
3. **permissions** - 權限定義表（資源+操作權限）
4. **role_permissions** - 角色權限關聯表（角色與權限多對多）
5. **branch_permissions** - 分支權限表（Git-like 分支層級權限控制）

### 模組狀態

- **目前狀態**：✅ 已完成（基礎功能）
- **完成度**：約 85%（核心功能完成，測試和文檔待完善）
- **近期里程碑**：持續維護、完善測試覆蓋
- **主要阻塞**：無

### 技術架構

- **權限模型**：RBAC（Role-Based Access Control）
- **整合框架**：@delon/acl + Supabase
- **權限檢查層級**：資料庫層（RLS）+ 應用層（Service/Guard）
- **緩存機制**：內存緩存（5 分鐘 TTL）
- **權限同步**：自動同步到 @delon/acl ACLService

---

## 📋 任務清單

### 核心功能

RBAC 權限控制系統實施[✅已完成]
@delon/acl 和 Supabase 整合[✅已完成]
Git-like 分支權限控制[✅已完成]
基礎 RLS 策略實施（51 張表）[✅已完成]
權限服務模組（core/permissions/）[✅已完成]
PermissionService 權限檢查功能（can/canAny/canAll）[✅已完成]
PermissionService 權限緩存機制（5 分鐘 TTL）[✅已完成]
PermissionService 權限同步到 ACLService[✅已完成]
RoleService 角色管理功能[✅已完成]
RoleService 獲取用戶角色列表[✅已完成]
RoleService 檢查用戶角色[✅已完成]
權限同步機制[✅已完成]
分支權限服務（BranchPermissionService）[✅已完成]
分支權限級別管理（OWNER/ADMIN/WRITE/READ）[✅已完成]
分支權限檢查（canPerformAction）[✅已完成]

### Repository 層

PermissionRepository 基礎 CRUD[✅已完成]
PermissionRepository 按名稱查詢（findByName）[✅已完成]
PermissionRepository 按資源查詢（findByResource）[✅已完成]
PermissionRepository 按資源和操作查詢（findByResourceAndAction）[✅已完成]
PermissionRepository 系統權限查詢（findSystemPermissions）[✅已完成]
RoleRepository 基礎 CRUD[✅已完成]
RolePermissionRepository 基礎 CRUD[✅已完成]
BranchPermissionRepository 基礎 CRUD[✅已完成]
UserRoleRepository 基礎 CRUD[✅已完成]
所有 Repository 類型定義（TypeScript）[✅已完成]

### 路由守衛

創建 guards 目錄結構[✅已完成]
實現 AuthGuard（認證檢查、returnUrl 重定向）[✅已完成]
實現 RoleGuard（RBAC 多角色 OR 邏輯）[✅已完成]
實現 BranchPermissionGuard（分支級別權限控制）[✅已完成]
實現 UnsavedChangesGuard（未保存變更確認）[✅已完成]
創建 guards/index.ts 統一導出[✅已完成]
更新 core/index.ts 導出 guards 模組[✅已完成]
所有 Guards 使用 Angular 20 函數式模式[✅已完成]

### 組件與管道

創建 PermissionGuardComponent（AND/OR 模式條件渲染）[✅已完成]
實現 PermissionGuardComponent 角色檢查功能[✅已完成]
實現 PermissionGuardComponent Signal Inputs[✅已完成]
實現 PermissionGuardComponent OnPush 策略[✅已完成]
完善 PermissionGuardComponent 權限檢查邏輯（待完善 TODO）[🚧進行中]
實現 RolePipe（4 種權限上下文：organization/team/permission/branch）[✅已完成]
RolePipe 支援預設映射（default）[✅已完成]

### 類型定義

創建權限系統類型定義（types.ts）[✅已完成]
定義 Role 介面[✅已完成]
定義 Permission 介面[✅已完成]
定義 UserRole 介面[✅已完成]
定義 PermissionCheckResult 介面[✅已完成]
定義 PermissionCacheItem 介面[✅已完成]
導出所有類型到 permissions/index.ts[✅已完成]

### RLS 策略

啟用所有 51 張表的 RLS[✅已完成]
roles 表 RLS 策略[✅已完成]
user_roles 表 RLS 策略[✅已完成]
permissions 表 RLS 策略[✅已完成]
role_permissions 表 RLS 策略[✅已完成]
branch_permissions 表 RLS 策略[✅已完成]
RLS 策略文檔更新[✅已完成]

### 測試

PermissionService 單元測試[⏳待開始]
RoleService 單元測試[⏳待開始]
BranchPermissionService 單元測試[⏳待開始]
PermissionRepository 單元測試[⏳待開始]
AuthGuard 單元測試[⏳待開始]
RoleGuard 單元測試[⏳待開始]
BranchPermissionGuard 單元測試[⏳待開始]
PermissionGuardComponent 單元測試[⏳待開始]
RolePipe 單元測試[⏳待開始]
權限系統集成測試[⏳待開始]
E2E 測試（認證流程 E2E 測試）[⏳待開始]
RLS 策略測試（使用 Supabase MCP）[⏳待開始]

### 文檔

API 文檔更新[⏳待開始]
權限系統使用指南[⏳待開始]
權限系統架構文檔[⏳待開始]
權限檢查最佳實踐[⏳待開始]
RLS 策略開發指南（已存在，需與權限系統整合）[✅已完成]

### 性能優化

權限緩存性能優化[⏳待開始]
權限查詢 SQL 優化[⏳待開始]
批量權限檢查優化[⏳待開始]
權限檢查日誌記錄（後續實現）[⏳待開始]

---

## 🔧 實現細節

### PermissionService 核心功能

- **權限檢查方法**：
  - `can(permission: string)`: 檢查單個權限
  - `canAny(permissions: string[])`: 檢查多個權限（OR 邏輯）
  - `canAll(permissions: string[])`: 檢查多個權限（AND 邏輯）
  - `canAccessBlueprint(blueprintId: string, permission: string)`: 檢查藍圖權限
- **緩存機制**：內存緩存，5 分鐘 TTL，自動過期
- **權限同步**：檢查到權限後自動同步到 @delon/acl ACLService
- **資料庫查詢**：透過 Supabase Client 查詢 user_roles → roles → role_permissions → permissions

### RoleService 核心功能

- **角色查詢**：
  - `getRoles()`: 獲取所有角色
  - `getUserRoles(accountId?: string)`: 獲取用戶角色列表
  - `hasRole(roleName: string, blueprintId?: string)`: 檢查用戶是否擁有角色
- **角色管理**：支援藍圖級別和分支級別角色

### BranchPermissionService 核心功能

- **權限級別**：OWNER、ADMIN、WRITE、READ
- **權限檢查**：`canPerformAction(branchId: string, action: string)`
- **權限管理**：`grantPermission()`, `revokePermission()`, `updatePermission()`
- **狀態管理**：使用 Signals 管理權限狀態

### Guards 實現

- **AuthGuard**：檢查用戶是否已認證，未認證重定向到登入頁
- **RoleGuard**：檢查用戶是否擁有所需角色（支援多角色 OR 邏輯）
- **BranchPermissionGuard**：檢查用戶對分支的權限
- **UnsavedChangesGuard**：檢查未保存變更，使用 NzModalService 確認對話框

### 組件與管道

- **PermissionGuardComponent**：
  - 支援 Signal Inputs（permission, permissions, roles, mode）
  - 支援 AND/OR 模式
  - 支援角色檢查
  - 使用 OnPush 變更檢測策略
  - ⚠️ 待完善：權限檢查邏輯（目前部分功能為簡化實現）
- **RolePipe**：
  - 支援 4 種權限上下文：organization、team、permission、branch
  - 支援預設映射（default）
  - 自動轉換角色值為人類可讀文本

---

## 📝 已知問題與待完善項目

### 待完善功能

1. **PermissionGuardComponent 權限檢查邏輯**
   - 目前部分權限檢查為簡化實現（返回 true）
   - 需要實現完整的權限檢查邏輯
   - 參考：`src/app/shared/components/permission-guard/permission-guard.component.ts` 第 134-145 行

2. **權限檢查日誌記錄**
   - PermissionService 中標註了「後續實現」
   - 需要記錄權限檢查的日誌，便於審計和除錯

3. **批量權限檢查優化**
   - 目前每次檢查都是單獨查詢
   - 可以優化為批量查詢，減少資料庫請求

### 技術債務

1. **測試覆蓋率不足**
   - 目前沒有單元測試和集成測試
   - 需要補充完整的測試覆蓋

2. **文檔不完整**
   - API 文檔需要更新
   - 使用指南需要撰寫
   - 最佳實踐文檔需要補充

3. **性能優化**
   - 權限緩存可以考慮使用 Redis（目前為內存緩存）
   - 權限查詢 SQL 可以進一步優化

---

## 📝 備註

### 下一步行動

1. **優先級高**：
   - 完善 PermissionGuardComponent 權限檢查邏輯
   - 補充單元測試（至少覆蓋核心功能）
   - 更新 API 文檔

2. **優先級中**：
   - 實現權限檢查日誌記錄
   - 優化批量權限檢查
   - 撰寫使用指南

3. **優先級低**：
   - 性能優化（Redis 緩存）
   - 完善文檔

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md) - 51 張資料表分類
- [專案路線圖](./00-專案路線圖.md) - 開發路線圖和里程碑
- [架構審查報告](./28-架構審查報告.md) - 架構設計說明
- [安全與 RLS 權限矩陣](./09-安全與-RLS-權限矩陣.md) - RLS 策略詳細說明
- [RLS 策略開發指南](./50-RLS策略開發指南.md) - RLS 開發流程和最佳實踐

### 相關代碼位置

- **核心服務**：`src/app/core/permissions/`
- **路由守衛**：`src/app/core/guards/`
- **組件**：`src/app/shared/components/permission-guard/`
- **管道**：`src/app/shared/pipes/role.pipe.ts`
- **分支權限服務**：`src/app/shared/services/permission/branch-permission.service.ts`
- **Repository**：`src/app/core/infra/repositories/`

