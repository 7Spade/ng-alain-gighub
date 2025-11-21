# 五層架構結構分類說明

> 📋 **目的**：記錄專案五層架構的實際組織結構，提供完整的層級映射和最佳實踐指南

**文件版本**：v1.0  
**最後更新**：2025-01-21  
**狀態**：Active  
**負責人**：架構團隊

---

## 📑 目錄

- [1. 概述](#1-概述)
- [2. 層級結構總覽](#2-層級結構總覽)
- [3. 業務域完整映射](#3-業務域完整映射)
- [4. 各層組織原則](#4-各層組織原則)
- [5. 命名規範](#5-命名規範)
- [6. 最佳實踐](#6-最佳實踐)
- [7. 常見問題](#7-常見問題)

---

## 1. 概述

### 1.1 五層架構模型

本專案採用嚴格的五層架構設計，從底層到上層依次為：

```text
┌─────────────────────────────────────────────────────────┐
│                    Components Layer                      │
│                 (Presentation/Routes)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                    Facades Layer                         │
│     統一對外接口、協調多個 Service (低原子化)              │
│     位置：src/app/core/facades/                          │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│     業務邏輯、狀態管理 (中度原子化)                        │
│     位置：src/app/shared/services/                       │
└──────────────────────┬──────────────────────────────────┘
                       │ inject
                       ↓
┌─────────────────────────────────────────────────────────┐
│                 Repositories Layer                       │
│     資料存取、CRUD (高原子化)                            │
│     位置：src/app/core/infra/repositories/              │
└──────────────────────┬──────────────────────────────────┘
                       │ use
                       ↓
┌─────────────────────────────────────────────────────────┐
│                   Types + Models                         │
│     Types: 型別定義 (高原子化)                           │
│     位置：src/app/core/infra/types/                     │
│     Models: 資料模型 (中度原子化)                        │
│     位置：src/app/shared/models/                        │
└─────────────────────────────────────────────────────────┘
```

### 1.2 原子化程度說明

| 層級 | 原子化程度 | 檔案組織 | 職責範圍 |
|------|-----------|---------|---------|
| **Types** | 高 | 按業務域目錄組織 | 型別定義、枚舉、介面 |
| **Repositories** | 高 | 單一檔案單一職責 | 資料表的 CRUD 操作 |
| **Models** | 中 | 按業務域單一檔案 | 業務實體、型別再導出 |
| **Services** | 中 | 按業務域目錄組織 | 業務邏輯、狀態管理 |
| **Facades** | 低 | 單一檔案聚合 | 統一接口、協調多個 Service |

---

## 2. 層級結構總覽

### 2.1 Types 層（高原子化）

**位置**：`src/app/core/infra/types/`

**組織方式**：按業務域創建子目錄，每個目錄包含該域的類型定義

```text
types/
├── account/
│   ├── account.types.ts         # 帳戶相關型別
│   └── index.ts                 # 導出檔案
├── analytics/
│   ├── analytics.types.ts
│   └── index.ts
├── blueprint/
│   ├── blueprint.types.ts       # 藍圖狀態、分支類型等枚舉
│   └── index.ts
├── bot/
├── collab/
├── common/                      # 共用型別（Database, QueryOptions 等）
├── explore/
├── issue/
├── org/
├── permission/
├── quality/
├── system/
├── task/
└── index.ts                     # 總導出檔案
```

**統計**：13 個業務域目錄

### 2.2 Repositories 層（高原子化）

**位置**：`src/app/core/infra/repositories/`

**組織方式**：扁平化結構，每個資料表一個 Repository 檔案

```text
repositories/
├── base.repository.ts                         # 基礎 Repository
├── account.repository.ts                      # 帳戶
├── activity-log.repository.ts                 # 活動記錄
├── analytics-cache.repository.ts              # 分析快取
├── blueprint.repository.ts                    # 藍圖主檔案
├── blueprint-branch.repository.ts             # 藍圖分支
├── blueprint-config.repository.ts             # 藍圖配置
├── bot.repository.ts                          # 機器人
├── bot-task.repository.ts                     # 機器人任務
├── bot-execution-log.repository.ts            # 執行記錄
├── collaboration-invitation.repository.ts     # 協作邀請
├── collaboration-member.repository.ts         # 協作成員
├── comment.repository.ts                      # 評論
├── document.repository.ts                     # 文檔
├── document-version.repository.ts             # 文檔版本
├── document-thumbnail.repository.ts           # 文檔縮圖
├── issue.repository.ts                        # 問題
├── issue-assignment.repository.ts             # 問題指派
├── issue-photo.repository.ts                  # 問題照片
├── pull-request.repository.ts                 # Pull Request
├── quality-check.repository.ts                # 品質檢查
├── task.repository.ts                         # 任務
├── task-list.repository.ts                    # 任務清單
├── task-staging.repository.ts                 # 任務暫存區
├── task-assignment.repository.ts              # 任務指派
└── index.ts                                   # 總導出檔案
```

**統計**：56 個 Repository 檔案（含 base.repository.ts 和 index.ts）

### 2.3 Models 層（中度原子化）

**位置**：`src/app/shared/models/`

**組織方式**：按業務域單一檔案，包含該域所有實體模型

```text
models/
├── account.models.ts              # 帳戶、團隊、組織
├── blueprint.models.ts            # 藍圖、分支、PR、配置
├── bot.models.ts                  # 機器人、任務、執行記錄
├── collaboration.models.ts        # 協作邀請、成員
├── communication.models.ts        # 通知、評論
├── data.models.ts                 # 資料分析、快取
├── explore.models.ts              # 探索相關
├── issue.models.ts                # 問題追蹤
├── permission.models.ts           # 權限、角色
├── quality.models.ts              # 品質檢查
├── system.models.ts               # 系統設定、功能標誌
├── task.models.ts                 # 任務、清單、暫存區
└── index.ts                       # 總導出檔案
```

**統計**：13 個 Models 檔案（含 index.ts）

**特點**：
- 從 Types 層重新導出枚舉（保持向後兼容）
- 從 Database 型別提取實體型別
- 定義 Insert/Update 型別

### 2.4 Services 層（中度原子化）

**位置**：`src/app/shared/services/`

**組織方式**：按業務域創建子目錄，每個目錄包含多個相關 Service

```text
services/
├── account/
│   ├── account.service.ts
│   ├── team.service.ts
│   ├── organization.service.ts
│   ├── organization-schedule.service.ts
│   └── index.ts
├── analytics/
│   ├── analytics.service.ts
│   └── index.ts
├── auth/
│   ├── auth.service.ts
│   ├── session.service.ts
│   └── index.ts
├── blueprint/
│   ├── blueprint.service.ts                # 藍圖 CRUD
│   ├── blueprint-activity.service.ts       # 活動記錄
│   ├── branch.service.ts                   # 分支管理
│   ├── pull-request.service.ts             # PR 流程
│   ├── branch-data-isolation.service.ts    # 數據隔離
│   └── index.ts
├── bot/
│   ├── bot.service.ts
│   └── index.ts
├── collab/
│   ├── notification.service.ts
│   ├── comment.service.ts
│   └── index.ts
├── common/
│   ├── error-state.service.ts              # 錯誤狀態管理
│   ├── loading-state.service.ts            # 載入狀態管理
│   └── index.ts
├── document/
│   ├── document.service.ts
│   └── index.ts
├── explore/
├── issue/
│   ├── issue.service.ts
│   └── index.ts
├── org/
│   ├── organization-collaboration.service.ts
│   └── index.ts
├── permission/
│   ├── branch-permission.service.ts
│   └── index.ts
├── quality/
│   ├── quality.service.ts
│   └── index.ts
├── system/
│   ├── setting.service.ts
│   └── index.ts
├── task/
│   ├── task.service.ts
│   ├── task-state-machine.ts              # 任務狀態機
│   ├── task-staging.service.ts            # 暫存區
│   └── index.ts
├── todo/
│   ├── personal-todo.service.ts
│   └── index.ts
├── workspace-context/
│   ├── workspace-context.service.ts
│   └── index.ts
└── index.ts
```

**統計**：17 個業務域目錄，64 個 Service 檔案

### 2.5 Facades 層（低原子化）

**位置**：`src/app/core/facades/`

**組織方式**：扁平化結構，每個業務域一個 Facade 檔案

```text
facades/
├── account.facade.ts                # 帳戶管理門面
├── analytics.facade.ts              # 資料分析門面
├── auth.facade.ts                   # 認證門面
├── blueprint.facade.ts              # 藍圖管理門面（協調多個 Service）
├── bot.facade.ts                    # 機器人門面
├── collaboration.facade.ts          # 協作門面
├── communication.facade.ts          # 通訊門面
├── document.facade.ts               # 文檔管理門面
├── issue.facade.ts                  # 問題追蹤門面
├── quality.facade.ts                # 品質管理門面
├── realtime.facade.ts               # 即時通訊門面
├── storage.facade.ts                # 儲存門面
├── system.facade.ts                 # 系統管理門面
├── task.facade.ts                   # 任務管理門面
├── workspace-context.facade.ts      # 工作區上下文門面
└── index.ts
```

**統計**：16 個 Facade 檔案（含 index.ts 和測試檔案共 18 個）

**特點**：
- 協調多個 Services
- 暴露統一的 Signal 接口
- 整合錯誤處理和活動記錄

---

## 3. 業務域完整映射

### 3.1 完整業務域列表

| 業務域 | Types | Repositories | Models | Services | Facades | 說明 |
|-------|-------|-------------|--------|----------|---------|------|
| **account** | ✅ | ✅ (1) | ✅ | ✅ (8) | ✅ | 帳戶、團隊、組織管理 |
| **analytics** | ✅ | ✅ (1) | ❌ | ✅ (2) | ✅ | 資料分析（簡單數據傳遞） |
| **auth** | ❌ | ✅ (1) | ❌ | ✅ (4) | ✅ | 認證授權（使用 Supabase Auth） |
| **blueprint** | ✅ | ✅ (3) | ✅ | ✅ (7) | ✅ | 藍圖/專案管理（核心業務） |
| **bot** | ✅ | ✅ (3) | ✅ | ✅ (2) | ✅ | 機器人系統 |
| **collab** | ✅ | ✅ (4) | ✅* | ✅ (3) | ✅* | 協作系統（使用 collaboration） |
| **common** | ✅ | ❌ | ❌ | ✅ (6) | ❌ | 共用工具（不需要 Facade） |
| **document** | ❌ | ✅ (3) | ❌ | ✅ (2) | ✅ | 文檔管理 |
| **explore** | ✅ | ❌ | ✅ | ✅ (2) | ❌ | 探索功能（前端為主） |
| **issue** | ✅ | ✅ (4) | ✅ | ✅ (2) | ✅ | 問題追蹤系統 |
| **org** | ✅ | ✅ (4) | ❌ | ✅ (5) | ❌ | 組織協作（簡單數據傳遞） |
| **permission** | ✅ | ✅ (3) | ✅ | ✅ (2) | ❌ | 權限系統（嵌入式使用） |
| **quality** | ✅ | ✅ (1) | ✅ | ✅ (3) | ✅ | 品質檢查系統 |
| **system** | ✅ | ❌ | ✅ | ✅ (3) | ✅ | 系統設定 |
| **task** | ✅ | ✅ (7) | ✅ | ✅ (9) | ✅ | 任務管理系統（核心業務） |
| **todo** | ❌ | ✅ (1) | ❌ | ✅ (2) | ❌ | 個人待辦（簡單功能） |
| **workspace** | ❌ | ❌ | ❌ | ✅ (4) | ✅ | 工作區上下文 |

**註解**：
- ✅ 表示該層存在
- ❌ 表示該層不存在（通常有合理原因）
- ✅* 表示使用完整名稱（如 collaboration 而非 collab）
- 括號內數字表示檔案數量

### 3.2 不存在某層的合理原因

#### 沒有 Types 層的域
- **auth**：使用 Supabase Auth 提供的型別
- **document**：簡單 CRUD，型別來自 Database
- **workspace**：前端狀態管理為主

#### 沒有 Repositories 層的域
- **common**：工具性質，不直接操作資料庫
- **explore**：前端聚合展示，從其他 Repository 取數據
- **system**：部分使用 setting.repository.ts
- **workspace**：前端狀態管理

#### 沒有 Models 層的域
- **analytics**：簡單數據傳遞，不需要複雜模型
- **auth**：使用 Supabase 提供的用戶模型
- **common**：工具性質
- **document**：簡單實體，直接使用 Repository 型別
- **org**：簡單數據傳遞
- **todo**：簡單實體

#### 沒有 Facades 層的域
- **common**：工具類，不需要門面
- **explore**：前端聚合，不需要複雜協調
- **org**：簡單業務邏輯，Service 已足夠
- **permission**：嵌入在其他 Facade 中使用
- **todo**：簡單功能，不需要門面

---

## 4. 各層組織原則

### 4.1 Types 層組織原則

**高原子化策略**：

✅ **推薦做法**：
```typescript
// ✅ 好：按業務域組織，枚舉和介面清晰分離
// src/app/core/infra/types/blueprint/blueprint.types.ts
export enum BlueprintStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export enum BranchType {
  CONTRACTOR = 'contractor',
  SUBCONTRACTOR = 'subcontractor'
}
```

❌ **不推薦做法**：
```typescript
// ❌ 壞：混合多個業務域的型別
// src/app/core/infra/types/mixed.types.ts
export enum BlueprintStatus { ... }
export enum TaskStatus { ... }  // 應該在 task.types.ts
export enum IssueStatus { ... }  // 應該在 issue.types.ts
```

**命名規範**：
- 檔案名：`{domain}.types.ts`
- 枚舉名：`PascalCase`（如 `BlueprintStatus`）
- 介面名：`PascalCase`（如 `QueryOptions`）

### 4.2 Repositories 層組織原則

**高原子化策略**：

✅ **推薦做法**：
```typescript
// ✅ 好：單一職責，只處理 blueprints 資料表
// src/app/core/infra/repositories/blueprint.repository.ts
@Injectable({ providedIn: 'root' })
export class BlueprintRepository extends BaseRepository<
  Blueprint,
  BlueprintInsert,
  BlueprintUpdate
> {
  protected tableName = 'blueprints';
  
  findByOwnerId(ownerId: string): Observable<Blueprint[]> { ... }
  findByStatus(status: BlueprintStatus): Observable<Blueprint[]> { ... }
}
```

❌ **不推薦做法**：
```typescript
// ❌ 壞：一個 Repository 處理多個資料表
@Injectable({ providedIn: 'root' })
export class BlueprintRepository {
  // 不要在同一個 Repository 中處理多個資料表
  getBlueprints() { ... }
  getBranches() { ... }  // 應該在 BlueprintBranchRepository
  getPRs() { ... }       // 應該在 PullRequestRepository
}
```

**命名規範**：
- 檔案名：`{table-name}.repository.ts`（使用 kebab-case）
- 類別名：`{TableName}Repository`（使用 PascalCase）
- 繼承 `BaseRepository<T, TInsert, TUpdate>`

### 4.3 Models 層組織原則

**中度原子化策略**：

✅ **推薦做法**：
```typescript
// ✅ 好：按業務域組織，包含該域所有實體
// src/app/shared/models/blueprint.models.ts

// 重新導出枚舉（保持向後兼容）
export { BlueprintStatus, BranchType, BranchStatus, PRStatus } from '@core';

// 定義實體型別
export type Blueprint = Database['public']['Tables']['blueprints']['Row'];
export type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
export type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];

export type BlueprintBranch = Database['public']['Tables']['blueprint_branches']['Row'];
export type PullRequest = Database['public']['Tables']['pull_requests']['Row'];
```

❌ **不推薦做法**：
```typescript
// ❌ 壞：過度拆分，每個實體一個檔案
// blueprint.models.ts, blueprint-branch.models.ts, pull-request.models.ts
// 相關實體應該組織在同一個檔案中
```

**命名規範**：
- 檔案名：`{domain}.models.ts`
- 型別名：`PascalCase`（如 `Blueprint`）
- 從 Types 層重新導出枚舉

### 4.4 Services 層組織原則

**中度原子化策略**：

✅ **推薦做法**：
```typescript
// ✅ 好：業務邏輯內聚，單一業務職責
// src/app/shared/services/blueprint/blueprint.service.ts
@Injectable({ providedIn: 'root' })
export class BlueprintService {
  private blueprintRepository = inject(BlueprintRepository);
  private blueprintConfigRepository = inject(BlueprintConfigRepository);
  
  private blueprintsState = signal<Blueprint[]>([]);
  readonly blueprints = this.blueprintsState.asReadonly();
  
  async loadBlueprints(): Promise<void> { ... }
  async createBlueprint(data: BlueprintInsert): Promise<Blueprint> { ... }
  async updateBlueprint(id: string, data: BlueprintUpdate): Promise<void> { ... }
}

// src/app/shared/services/blueprint/branch.service.ts
@Injectable({ providedIn: 'root' })
export class BranchService {
  private blueprintBranchRepository = inject(BlueprintBranchRepository);
  
  async createBranch(data: BlueprintBranchInsert): Promise<BlueprintBranch> { ... }
  async forkBranch(branchId: string, orgId: string): Promise<BlueprintBranch> { ... }
}
```

❌ **不推薦做法**：
```typescript
// ❌ 壞：God Object，一個 Service 處理所有業務
@Injectable({ providedIn: 'root' })
export class BlueprintService {
  // 不要把所有功能都塞在一個 Service
  loadBlueprints() { ... }
  loadBranches() { ... }      // 應該在 BranchService
  createPR() { ... }          // 應該在 PullRequestService
  logActivity() { ... }       // 應該在 BlueprintActivityService
  checkPermission() { ... }   // 應該在 BranchPermissionService
}
```

**命名規範**：
- 目錄名：`{domain}/`
- 檔案名：`{feature}.service.ts`
- 類別名：`{Feature}Service`
- index.ts：導出該域所有 Services

### 4.5 Facades 層組織原則

**低原子化策略（聚合層）**：

✅ **推薦做法**：
```typescript
// ✅ 好：協調多個 Services，提供統一接口
// src/app/core/facades/blueprint.facade.ts
@Injectable({ providedIn: 'root' })
export class BlueprintFacade implements OnDestroy {
  // 注入多個 Services
  private blueprintService = inject(BlueprintService);
  private branchService = inject(BranchService);
  private pullRequestService = inject(PullRequestService);
  private blueprintActivityService = inject(BlueprintActivityService);
  
  // 聚合狀態
  private selectedBlueprintState = signal<Blueprint | null>(null);
  readonly selectedBlueprint = this.selectedBlueprintState.asReadonly();
  
  // 計算狀態
  readonly canCreateBranch = computed(() => {
    const blueprint = this.selectedBlueprint();
    return blueprint?.status === BlueprintStatus.ACTIVE;
  });
  
  // 協調多個 Services 的操作
  async createBlueprintWithBranch(
    blueprintData: BlueprintInsert,
    branchData: BlueprintBranchInsert
  ): Promise<void> {
    const blueprint = await this.blueprintService.createBlueprint(blueprintData);
    const branch = await this.branchService.createBranch({
      ...branchData,
      blueprintId: blueprint.id
    });
    await this.blueprintActivityService.logActivity({
      blueprintId: blueprint.id,
      actionType: 'blueprint_created',
      details: { branchId: branch.id }
    });
  }
}
```

❌ **不推薦做法**：
```typescript
// ❌ 壞：Facade 只是簡單轉發，沒有協調多個 Services
@Injectable({ providedIn: 'root' })
export class BlueprintFacade {
  private blueprintService = inject(BlueprintService);
  
  // 只是簡單轉發，不需要 Facade
  loadBlueprints() {
    return this.blueprintService.loadBlueprints();
  }
  
  createBlueprint(data: BlueprintInsert) {
    return this.blueprintService.createBlueprint(data);
  }
}
```

**命名規範**：
- 檔案名：`{domain}.facade.ts`
- 類別名：`{Domain}Facade`
- 必須協調至少 2 個以上的 Services

---

## 5. 命名規範

### 5.1 檔案命名

| 層級 | 檔案命名格式 | 範例 |
|------|------------|------|
| Types | `{domain}.types.ts` | `blueprint.types.ts` |
| Repositories | `{table-name}.repository.ts` | `blueprint-branch.repository.ts` |
| Models | `{domain}.models.ts` | `blueprint.models.ts` |
| Services | `{feature}.service.ts` | `blueprint-activity.service.ts` |
| Facades | `{domain}.facade.ts` | `blueprint.facade.ts` |

### 5.2 類別命名

| 層級 | 類別命名格式 | 範例 |
|------|------------|------|
| Repositories | `{TableName}Repository` | `BlueprintBranchRepository` |
| Services | `{Feature}Service` | `BlueprintActivityService` |
| Facades | `{Domain}Facade` | `BlueprintFacade` |

### 5.3 導出檔案

每個目錄必須包含 `index.ts` 導出檔案：

```typescript
// ✅ 好：清晰的導出結構
// src/app/shared/services/blueprint/index.ts
export * from './blueprint.service';
export * from './blueprint-activity.service';
export * from './branch.service';
export * from './pull-request.service';
export * from './branch-data-isolation.service';
```

---

## 6. 最佳實踐

### 6.1 依賴方向規則

**嚴格遵守層級依賴方向**：

```text
Components
    ↓
Facades (只能依賴 Services、Repositories、Types、Models)
    ↓
Services (只能依賴 Repositories、Types、Models)
    ↓
Repositories (只能依賴 Types)
    ↓
Types + Models (不依賴其他層)
```

✅ **允許的依賴**：
- Facades → Services、Repositories、Types、Models
- Services → Repositories、Types、Models
- Repositories → Types
- Models → Types（重新導出枚舉）

❌ **禁止的依賴**：
- Services ❌→ Facades
- Repositories ❌→ Services
- Types ❌→ Models
- 任何層 ❌→ Components

### 6.2 職責分離

**Types 層**：
- ✅ 只定義型別、介面、枚舉
- ❌ 不包含業務邏輯
- ❌ 不依賴其他層

**Repositories 層**：
- ✅ 只處理資料存取（CRUD）
- ✅ 繼承 BaseRepository
- ❌ 不包含業務邏輯
- ❌ 不調用其他 Repositories

**Models 層**：
- ✅ 定義業務實體型別
- ✅ 從 Types 層重新導出枚舉
- ❌ 不包含業務邏輯

**Services 層**：
- ✅ 實作業務邏輯
- ✅ 使用 Signals 管理狀態
- ✅ 調用 Repositories 存取數據
- ❌ 不直接調用 Supabase Client

**Facades 層**：
- ✅ 協調多個 Services
- ✅ 提供統一的對外接口
- ✅ 整合錯誤處理和活動記錄
- ❌ 不直接調用 Repositories

### 6.3 引用路徑規範

使用 TypeScript Path Aliases：

```typescript
// ✅ 好：使用 Path Aliases
import { Blueprint, BlueprintStatus } from '@core';
import { BlueprintService } from '@shared';

// ❌ 壞：使用相對路徑
import { Blueprint } from '../../../core/infra/types/blueprint';
import { BlueprintService } from '../../services/blueprint';
```

**Path Aliases 配置**（tsconfig.json）：
```json
{
  "compilerOptions": {
    "paths": {
      "@core": ["src/app/core"],
      "@core/*": ["src/app/core/*"],
      "@shared": ["src/app/shared"],
      "@shared/*": ["src/app/shared/*"],
      "@routes": ["src/app/routes"],
      "@routes/*": ["src/app/routes/*"]
    }
  }
}
```

### 6.4 測試檔案組織

測試檔案與原始檔案放在同一目錄：

```text
services/blueprint/
├── blueprint.service.ts
├── blueprint.service.spec.ts         # 單元測試
├── blueprint-activity.service.ts
└── blueprint-activity.service.spec.ts
```

---

## 7. 常見問題

### Q1: 為什麼有些域沒有 Models 層？

**A**: Models 層主要用於複雜業務實體。對於簡單數據傳遞的域（如 analytics、org），直接使用 Repository 的型別已足夠，不需要額外的 Models 層。

### Q2: 為什麼有些域沒有 Facades 層？

**A**: Facades 層用於協調多個 Services。對於簡單業務邏輯（如 common、todo、permission），Service 層已經足夠，不需要額外的 Facades 層。Facades 通常用於核心業務域（如 blueprint、task、issue）。

### Q3: collab 域為什麼使用 collaboration 命名？

**A**: 為了保持程式碼的可讀性和語義化：
- Types 層：`collab/`（簡短）
- Models 層：`collaboration.models.ts`（完整）
- Services 層：`collab/`（簡短）
- Facades 層：`collaboration.facade.ts`（完整）

檔案命名使用完整單詞以提高可讀性，目錄命名可以簡化以提高效率。

### Q4: 如何決定是否需要創建新的 Service？

**A**: 遵循以下原則：
1. **單一職責**：一個 Service 只處理一個業務概念
2. **檔案大小**：超過 300 行考慮拆分
3. **依賴關係**：如果某功能可以獨立使用，應該拆分
4. **複用性**：如果某功能會在多處使用，應該獨立

參考 blueprint 域的組織：
- `blueprint.service.ts` - 藍圖 CRUD
- `blueprint-activity.service.ts` - 活動記錄
- `branch.service.ts` - 分支管理
- `pull-request.service.ts` - PR 流程
- `branch-data-isolation.service.ts` - 數據隔離

### Q5: Repository 是否可以調用其他 Repository？

**A**: **不建議**。Repositories 應該保持高度獨立，只負責單一資料表的 CRUD。如果需要協調多個資料表的操作，應該在 Service 層實作。

```typescript
// ❌ 不推薦：在 Repository 中調用其他 Repository
export class BlueprintRepository {
  private branchRepository = inject(BlueprintBranchRepository);
  
  async getBlueprintWithBranches(id: string) {
    const blueprint = await this.findById(id);
    const branches = await this.branchRepository.findByBlueprintId(id);
    return { ...blueprint, branches };
  }
}

// ✅ 推薦：在 Service 層協調多個 Repositories
export class BlueprintService {
  private blueprintRepository = inject(BlueprintRepository);
  private branchRepository = inject(BlueprintBranchRepository);
  
  async loadBlueprintWithBranches(id: string) {
    const blueprint = await firstValueFrom(
      this.blueprintRepository.findById(id)
    );
    const branches = await firstValueFrom(
      this.branchRepository.findByBlueprintId(id)
    );
    return { ...blueprint, branches };
  }
}
```

### Q6: 何時使用 Facade 而非直接使用 Service？

**A**: 在以下情況下使用 Facade：
1. **多個 Services 協調**：需要協調 2 個以上的 Services
2. **複雜業務流程**：涉及多步驟操作、錯誤處理、活動記錄
3. **統一接口**：為相關功能提供統一的對外接口
4. **狀態聚合**：需要聚合多個 Services 的狀態

組件應該優先使用 Facade，只有在簡單場景下才直接使用 Service。

---

## 8. 附錄

### 8.1 完整檔案清單

詳見各層級的結構總覽章節。

### 8.2 相關文檔

- [架構層級原子化設計規範](./architecture-layers-atomization-design.md)
- [開發最佳實踐指南](../guides/development-best-practices.md)
- [專案結構流程圖](./02-project-structure-flowchart.mermaid.md)
- [五層開發順序](../archive/開發順序.md)

### 8.3 變更歷史

| 版本 | 日期 | 變更內容 | 負責人 |
|------|------|---------|--------|
| v1.0 | 2025-01-21 | 初始版本，記錄現有結構分類 | 架構團隊 |

---

**最後更新**：2025-01-21  
**維護者**：架構團隊  
**狀態**：Active
