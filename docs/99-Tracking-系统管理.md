# ⚙️ 系統管理 - 任務追蹤

> 📋 **目的**：追蹤系統管理模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M10  
**資料表數量**：2 張

---

## 📊 模組資訊

### 資料表清單

1. **settings** - 系統設定表（全局系統設定）
   - 支援多種設定類型：system（系統）、organization（組織）、blueprint（藍圖）、user（用戶）
   - 設定範圍管理（scope_id）
   - 公開/私有設定（is_public）
   - 設定值使用 JSONB 格式存儲

2. **feature_flags** - 功能開關表（灰度發布、A/B 測試）
   - 功能開關控制（is_enabled）
   - 灰度發布（rollout_percentage：0-100%）
   - 目標帳戶/組織（target_accounts、target_organizations）
   - 時間範圍控制（start_date、end_date）

### 模組狀態

- **目前狀態**：⏳ 待開始（基礎架構完成，功能待開發）
- **完成度**：約 30%（基礎架構完成，功能待完善）
- **近期里程碑**：里程碑 12（2025-07-15）
- **主要阻塞**：功能需求待明確、測試框架待建立

### 里程碑對照表 ⭐

| 里程碑 | 目標日期 | 關鍵任務 | 完成狀態 | 備註 |
|--------|---------|---------|---------|------|
| **里程碑 12** | 2025-07-15 | 系統管理完成 | 🚧 30% | 基礎架構完成，功能待完善 |
| - | - | 數據層與服務層完成 | ⏳ 0% | Repository、Service 層待實施 |
| - | - | Facade 層完成 | ⏳ 0% | SystemFacade 待實施 |
| - | - | 頁面組件開發完成 | ⏳ 0% | 頁面組件待開發 |
| - | - | RLS 權限驗證（2 張表） | ⏳ 0% | 待開始 |
| - | - | 單元測試（目標 80%） | ⏳ 0% | 待開始 |
| - | - | 集成測試 | ⏳ 0% | 待開始 |
| - | - | E2E 測試 | ⏳ 0% | 待開始 |

### 測試覆蓋率目標 ⭐

| 層級 | 目標覆蓋率 | 當前覆蓋率 | 狀態 | 備註 |
|------|-----------|-----------|------|------|
| **Service 層** | ≥80% | 0% | ⏳ 待開始 | SettingService、FeatureFlagService 待測試 |
| **Repository 層** | ≥80% | 0% | ⏳ 待開始 | 2 個 Repository 待測試 |
| **Component 層** | ≥70% | 0% | ⏳ 待開始 | 頁面組件待測試 |
| **Facade 層** | ≥80% | 0% | ⏳ 待開始 | SystemFacade 待實施 |
| **整體目標** | ≥75% | 0% | ⏳ 待開始 | 需建立測試框架 |

### 技術債務清單 ⭐

| 項目 | 優先級 | 影響範圍 | 預計工作量 | 狀態 |
|------|--------|---------|-----------|------|
| 數據層與服務層實施 | 🔴 高 | 核心功能 | 3-5 天 | ⏳ 待開始 |
| Facade 層實施 | 🔴 高 | 統一接口、錯誤處理 | 2-3 天 | ⏳ 待開始 |
| RLS 權限驗證（2 張表） | 🔴 高 | 安全性 | 2-3 天 | ⏳ 待開始 |
| 頁面組件開發 | 🟡 中 | 用戶體驗 | 5-7 天 | ⏳ 待開始 |
| 單元測試覆蓋率不足 | 🔴 高 | 代碼質量 | 3-5 天 | ⏳ 待開始 |
| 集成測試缺失 | 🟡 中 | 功能驗證 | 2-3 天 | ⏳ 待開始 |
| E2E 測試缺失 | 🟡 中 | 端到端驗證 | 2-3 天 | ⏳ 待開始 |
| 功能開關灰度發布機制 | 🟢 低 | 功能發布 | 3-4 天 | ⏳ 待開始 |

### 已知問題清單 ⭐

| 問題 | 嚴重程度 | 影響範圍 | 狀態 | 解決方案 |
|------|---------|---------|------|---------|
| 數據層與服務層未實施 | 🔴 高 | 核心功能 | ⏳ 待解決 | 實施 Repository 和 Service 層 |
| Facade 層缺失 | 🔴 高 | 架構一致性 | ⏳ 待解決 | 實施 SystemFacade |
| RLS 權限驗證未實施 | 🔴 高 | 安全性 | ⏳ 待解決 | 實施 2 張表的 RLS 策略 |
| 頁面組件未開發 | 🟡 中 | 用戶體驗 | ⏳ 待解決 | 開發系統設定和功能開關管理頁面 |
| 測試覆蓋率為 0 | 🔴 高 | 代碼質量 | ⏳ 待解決 | 建立測試框架並補齊測試 |

---

## 📋 任務清單

### 核心功能

系統設定管理（全局/組織/藍圖/用戶級別）[⏳待開始]
功能開關管理（灰度發布、A/B 測試）[⏳待開始]
設定類型管理（system/organization/blueprint/user）[⏳待開始]
功能開關灰度發布機制[⏳待開始]
目標帳戶/組織管理[⏳待開始]
時間範圍控制（功能開關）[⏳待開始]

### 數據層與服務層

#### 數據模型層

數據模型層（shared/models/system.models.ts）[⏳待開始]
Setting 類型定義[⏳待開始]
FeatureFlag 類型定義[⏳待開始]
SettingType 枚舉（system/organization/blueprint/user）[⏳待開始]

#### Repository 層

SettingRepository 基礎 CRUD[⏳待開始]
SettingRepository 按設定鍵查詢（findByKey）[⏳待開始]
SettingRepository 按設定類型查詢（findByType）[⏳待開始]
SettingRepository 按範圍 ID 查詢（findByScopeId）[⏳待開始]
SettingRepository 查詢公開設定（findPublicSettings）[⏳待開始]
FeatureFlagRepository 基礎 CRUD[⏳待開始]
FeatureFlagRepository 按功能鍵查詢（findByFlagKey）[⏳待開始]
FeatureFlagRepository 查詢啟用的功能開關（findEnabledFlags）[⏳待開始]
FeatureFlagRepository 查詢過期功能開關（findExpiredFlags）[⏳待開始]
所有 Repository 類型定義（TypeScript）[⏳待開始]
所有 Repository 自動數據轉換（snake_case ↔ camelCase）[⏳待開始]

#### 服務層

SettingService 設定管理[⏳待開始]
SettingService 使用 Signals 管理狀態[⏳待開始]
SettingService 設定 CRUD 操作[⏳待開始]
SettingService 按類型/範圍查詢[⏳待開始]
SettingService 公開設定查詢[⏳待開始]
SettingService Computed Signals（systemSettings、organizationSettings、blueprintSettings、userSettings）[⏳待開始]
FeatureFlagService 功能開關管理[⏳待開始]
FeatureFlagService 使用 Signals 管理狀態[⏳待開始]
FeatureFlagService 功能開關 CRUD 操作[⏳待開始]
FeatureFlagService 檢查功能是否啟用（isFeatureEnabled）[⏳待開始]
FeatureFlagService 灰度發布邏輯（rolloutPercentage）[⏳待開始]
FeatureFlagService 目標帳戶/組織檢查[⏳待開始]
FeatureFlagService 時間範圍檢查[⏳待開始]
FeatureFlagService Computed Signals（enabledFlags、expiredFlags、activeFlags）[⏳待開始]
所有服務錯誤處理（try-catch、錯誤狀態管理）[⏳待開始]
所有服務 Loading 狀態管理[⏳待開始]

#### Facade 層

SystemFacade 創建[⏳待開始]
SystemFacade 設定管理方法[⏳待開始]
SystemFacade 功能開關管理方法[⏳待開始]
SystemFacade 實時更新整合（RealtimeFacade）[⏳待開始]
SystemFacade Computed Signals（統計數據、過濾視圖）[⏳待開始]
SystemFacade 錯誤處理整合（ErrorStateService）[⏳待開始]
SystemFacade 導出到 core/index.ts[⏳待開始]

### 權限與安全

RLS 權限驗證[⏳待開始]
RLS 權限驗證（settings 表）[⏳待開始]
RLS 權限驗證（feature_flags 表）[⏳待開始]
RLS 策略文檔更新[⏳待開始]

### 頁面組件開發

#### 路由配置

系統管理路由配置（routes/system/routes.ts）[⏳待開始]
系統設定列表路由（/system/settings）[⏳待開始]
系統設定編輯路由（/system/settings/:id/edit）[⏳待開始]
功能開關列表路由（/system/feature-flags）[⏳待開始]
功能開關創建路由（/system/feature-flags/create）[⏳待開始]
功能開關編輯路由（/system/feature-flags/:id/edit）[⏳待開始]

#### 組件實現

系統設定列表頁面（SettingListComponent）[⏳待開始]
SettingListComponent 使用 SHARED_IMPORTS[⏳待開始]
SettingListComponent 使用 Signals 訂閱狀態[⏳待開始]
SettingListComponent 表格列配置（鍵、值、類型、範圍、公開）[⏳待開始]
SettingListComponent 設定類型標籤顯示[⏳待開始]
SettingListComponent 操作按鈕（查看、編輯、刪除）[⏳待開始]
SettingListComponent 分頁功能[⏳待開始]
系統設定表單頁面（SettingFormComponent）[⏳待開始]
SettingFormComponent 創建設定表單[⏳待開始]
SettingFormComponent 編輯設定表單[⏳待開始]
SettingFormComponent 表單驗證[⏳待開始]
SettingFormComponent 設定類型選擇[⏳待開始]
SettingFormComponent JSONB 值編輯器[⏳待開始]
功能開關列表頁面（FeatureFlagListComponent）[⏳待開始]
FeatureFlagListComponent 功能開關列表顯示[⏳待開始]
FeatureFlagListComponent 啟用狀態過濾[⏳待開始]
FeatureFlagListComponent 操作按鈕（啟用/停用、編輯、刪除）[⏳待開始]
功能開關表單頁面（FeatureFlagFormComponent）[⏳待開始]
FeatureFlagFormComponent 創建功能開關表單[⏳待開始]
FeatureFlagFormComponent 編輯功能開關表單[⏳待開始]
FeatureFlagFormComponent 表單驗證[⏳待開始]
FeatureFlagFormComponent 灰度發布配置[⏳待開始]
FeatureFlagFormComponent 目標帳戶/組織選擇[⏳待開始]
FeatureFlagFormComponent 時間範圍選擇[⏳待開始]
所有組件使用 OnPush 變更檢測策略[⏳待開始]
所有組件使用 Signal Inputs/Outputs[⏳待開始]

### 測試

#### 單元測試

SettingService 單元測試[⏳待開始]
FeatureFlagService 單元測試[⏳待開始]
SettingRepository 單元測試[⏳待開始]
FeatureFlagRepository 單元測試[⏳待開始]
SystemFacade 單元測試[⏳待開始]
SettingListComponent 單元測試[⏳待開始]
SettingFormComponent 單元測試[⏳待開始]
FeatureFlagListComponent 單元測試[⏳待開始]
FeatureFlagFormComponent 單元測試[⏳待開始]

#### 集成測試

系統設定 CRUD 流程集成測試[⏳待開始]
功能開關 CRUD 流程集成測試[⏳待開始]
功能開關灰度發布流程集成測試[⏳待開始]
RLS 權限驗證集成測試[⏳待開始]

#### E2E 測試

系統設定管理 E2E 測試[⏳待開始]
功能開關管理 E2E 測試[⏳待開始]
功能開關灰度發布 E2E 測試[⏳待開始]

### 文檔

API 文檔更新（系統管理 API 文檔）[⏳待開始]
用戶指南更新（系統管理用戶指南）[⏳待開始]
系統管理架構文檔[⏳待開始]
功能開關使用最佳實踐[⏳待開始]
RLS 策略開發指南（已存在，需與系統管理整合）[⏳待開始]

### 性能優化

系統設定查詢 SQL 優化[⏳待開始]
功能開關查詢 SQL 優化[⏳待開始]
功能開關檢查緩存機制[⏳待開始]
批量操作優化[⏳待開始]

---

## 📜 開發歷程記錄

### 待開始階段

- ⏳ **基礎架構建立**：建立數據模型層、Repository 層、Service 層
- ⏳ **Facade 層實施**：實施 SystemFacade
- ⏳ **頁面組件開發**：開發系統設定和功能開關管理頁面
- ⏳ **RLS 權限驗證**：實施 2 張表的 RLS 策略
- ⏳ **測試覆蓋率補齊**：補齊 Service 層、Repository 層、Facade 層、組件層測試
- ⏳ **文檔補齊**：API 文檔、用戶指南、架構文檔、最佳實踐文檔

---

## 📦 應該要交付的

### 已完成交付

目前無已完成交付項目。

### 待交付

1. **核心功能**：
   - ⏳ 系統設定管理（全局/組織/藍圖/用戶級別）
   - ⏳ 功能開關管理（灰度發布、A/B 測試）
   - ⏳ 設定類型管理（system/organization/blueprint/user）
   - ⏳ 功能開關灰度發布機制
   - ⏳ 目標帳戶/組織管理
   - ⏳ 時間範圍控制（功能開關）

2. **數據層與服務層**：
   - ⏳ 完整的 Repository 層（2 個 Repository）
   - ⏳ 完整的 Service 層（2 個 Service）
   - ⏳ 完整的 Facade 層（SystemFacade）
   - ⏳ 完整的數據模型層

3. **頁面組件**：
   - ⏳ 系統設定列表、表單頁面
   - ⏳ 功能開關列表、表單頁面

4. **權限與安全**：
   - ⏳ RLS 權限驗證（2 張表）
   - ⏳ RLS 策略文檔更新

5. **測試**：
   - ⏳ Service 層單元測試（2 個 Service）
   - ⏳ Repository 層單元測試（2 個 Repository）
   - ⏳ Facade 層單元測試（SystemFacade）
   - ⏳ 組件層單元測試（4 個組件）
   - ⏳ 集成測試
   - ⏳ E2E 測試

6. **文檔**：
   - ⏳ API 文檔更新
   - ⏳ 用戶指南更新
   - ⏳ 系統管理架構文檔
   - ⏳ 功能開關使用最佳實踐

### 交付標準

- **功能完整性**：所有核心功能必須可用
- **代碼質量**：通過類型檢查、代碼檢查、構建檢查
- **測試覆蓋率**：Service 層 ≥80%，Repository 層 ≥80%，Facade 層 ≥80%，Component 層 ≥70%
- **文檔完整性**：API 文檔、用戶指南、架構文檔必須完整

---

## 📝 備註

### SettingService 核心功能（規劃）

- **狀態管理**：
  - 使用 Signals 管理設定列表、選中設定、加載狀態、錯誤狀態
  - 暴露 ReadonlySignal 給組件：`settings()`, `selectedSetting()`, `loading()`, `error()`
- **Computed Signals**：
  - `systemSettings()`: 系統級設定
  - `organizationSettings()`: 組織級設定
  - `blueprintSettings()`: 藍圖級設定
  - `userSettings()`: 用戶級設定
- **核心方法**：
  - `loadSettings()`: 加載所有設定
  - `loadSettingByKey(key)`: 根據鍵加載設定
  - `loadSettingsByType(type)`: 根據類型加載設定
  - `loadSettingsByScope(scopeId)`: 根據範圍加載設定
  - `createSetting(data)`: 創建設定
  - `updateSetting(id, data)`: 更新設定
  - `deleteSetting(id)`: 刪除設定

### FeatureFlagService 核心功能（規劃）

- **狀態管理**：
  - 使用 Signals 管理功能開關列表、選中功能開關、加載狀態、錯誤狀態
  - 暴露 ReadonlySignal 給組件：`featureFlags()`, `selectedFeatureFlag()`, `loading()`, `error()`
- **Computed Signals**：
  - `enabledFlags()`: 啟用的功能開關
  - `expiredFlags()`: 過期的功能開關
  - `activeFlags()`: 活躍的功能開關（在時間範圍內）
- **核心方法**：
  - `loadFeatureFlags()`: 加載所有功能開關
  - `loadFeatureFlagByKey(flagKey)`: 根據鍵加載功能開關
  - `isFeatureEnabled(flagKey, accountId?, organizationId?)`: 檢查功能是否啟用（考慮灰度發布、目標帳戶/組織、時間範圍）
  - `createFeatureFlag(data)`: 創建功能開關
  - `updateFeatureFlag(id, data)`: 更新功能開關
  - `deleteFeatureFlag(id)`: 刪除功能開關
  - `loadExpiredFlags()`: 加載過期功能開關

### SystemFacade 核心功能（規劃）

- **統一接口**：提供系統設定、功能開關的統一管理接口
- **實時更新**：整合 RealtimeFacade，實現設定的實時更新
- **錯誤處理**：整合 ErrorStateService，集中錯誤處理
- **統計數據**：提供 Computed Signals 統計設定、功能開關的數量
- **狀態管理**：使用 Signals 管理所有狀態，暴露 ReadonlySignal 給組件

### Repository 層實現（規劃）

- **SettingRepository**：
  - 繼承 BaseRepository，自動處理數據轉換
  - 提供按鍵、類型、範圍查詢的方法
  - 支援 QueryOptions（分頁、排序、過濾）
- **FeatureFlagRepository**：
  - 繼承 BaseRepository，自動處理數據轉換
  - 提供按鍵、啟用狀態查詢的方法
  - 提供查詢過期功能開關的方法

### 組件實現（規劃）

- **SettingListComponent**：
  - 使用 `@delon/abc/st` 表格組件
  - 使用 Signals 訂閱 SettingService 狀態
  - 支援設定類型的標籤顯示
  - 提供查看、編輯、刪除操作
- **SettingFormComponent**：
  - 使用 Typed Forms 確保類型安全
  - 支援創建和編輯兩種模式
  - 表單驗證和錯誤提示
  - JSONB 值編輯器（代碼編輯器或表單編輯器）
- **FeatureFlagListComponent**：
  - 顯示功能開關列表
  - 支援按啟用狀態過濾
  - 提供啟用/停用、編輯、刪除操作
- **FeatureFlagFormComponent**：
  - 使用 Typed Forms 確保類型安全
  - 支援創建和編輯兩種模式
  - 表單驗證和錯誤提示
  - 灰度發布配置（百分比滑塊）
  - 目標帳戶/組織選擇（多選）
  - 時間範圍選擇（日期選擇器）

### 下一步行動

1. **優先級高**：
   - 實施數據層與服務層（Repository、Service）
   - 實施 Facade 層（SystemFacade）
   - 實施 RLS 權限驗證（2 張表）

2. **優先級中**：
   - 開發頁面組件（系統設定和功能開關管理頁面）
   - 補充單元測試（至少覆蓋核心功能）
   - 更新 API 文檔

3. **優先級低**：
   - 實現功能開關灰度發布機制
   - 優化查詢性能
   - 撰寫用戶指南

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md) - 51 張資料表分類
- [專案路線圖](./00-專案路線圖.md) - 開發路線圖和里程碑
- [架構審查報告](./28-架構審查報告.md) - 架構設計說明
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md) - Git-like 分支模型架構
- [安全與 RLS 權限矩陣](./09-安全與-RLS-權限矩陣.md) - RLS 策略詳細說明
- [RLS 策略開發指南](./50-RLS策略開發指南.md) - RLS 開發流程和最佳實踐
- [PRD 文檔](./PRD.md) - 產品需求文檔（系統管理章節）

### 相關代碼位置

- **核心服務**：`src/app/shared/services/system/`（待創建）
  - `setting.service.ts` - 系統設定服務（待創建）
  - `feature-flag.service.ts` - 功能開關服務（待創建）
- **Facade 層**：`src/app/core/facades/system.facade.ts`（待創建）
- **Repository 層**：`src/app/core/infra/repositories/`（待創建）
  - `setting.repository.ts`（待創建）
  - `feature-flag.repository.ts`（待創建）
- **數據模型**：`src/app/shared/models/system.models.ts`（待創建）
- **頁面組件**：`src/app/routes/system/`（待創建）
  - `settings/setting-list.component.ts` - 系統設定列表（待創建）
  - `settings/setting-form.component.ts` - 系統設定表單（待創建）
  - `feature-flags/feature-flag-list.component.ts` - 功能開關列表（待創建）
  - `feature-flags/feature-flag-form.component.ts` - 功能開關表單（待創建）
- **路由配置**：`src/app/routes/system/routes.ts`（待創建）

---

## 📊 統計資訊

**總任務數**：約 50 個任務  
**已完成**：約 0 個任務（0%）  
**進行中**：約 0 個任務（0%）  
**待開始**：約 50 個任務（100%）

**完成度分析**：
- 核心功能：⏳ 0%（0/6 任務）
- 數據層：⏳ 0%（0/12 任務）
- 服務層：⏳ 0%（0/15 任務）
- Facade 層：⏳ 0%（0/7 任務）
- RLS 策略：⏳ 0%（0/4 任務）
- 頁面組件：⏳ 0%（0/24 任務）
- 測試：⏳ 0%（0/13 任務）
- 文檔：⏳ 0%（0/5 任務）
- 性能優化：⏳ 0%（0/4 任務）




