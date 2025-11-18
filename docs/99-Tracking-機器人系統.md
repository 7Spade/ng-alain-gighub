# 🤖 機器人系統 - 任務追蹤

> 📋 **目的**：追蹤機器人系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M9（模組 9）  
**資料表數量**：3 張

---

## 📊 模組資訊

### 資料表清單

1. **bots** - 機器人定義表（定期報表、通知、備份）
2. **bot_tasks** - 機器人任務表（執行任務佇列）
3. **bot_execution_logs** - 機器人執行日誌表

### 模組狀態

- **目前狀態**：🚧 基礎架構完成，業務邏輯待實作
- **完成度**：約 40%（基礎層完成，業務邏輯待開發）
- **近期里程碑**：里程碑 11（2025-06-15）
- **主要阻塞**：依賴資料分析/文件系統輸入

### 開發進度統計

- **數據層**：✅ 100% 完成（3/3 Repository）
- **服務層**：✅ 50% 完成（1/2 Service，BotService 已實現）
- **UI 層**：🚧 60% 完成（骨架頁面已建立，功能待實作）
- **業務邏輯**：⏳ 0% 完成（Bot 執行引擎、排程系統待開發）

### 里程碑對照表

| 里程碑 | 目標日期 | 關鍵任務 | 完成狀態 | 備註 |
|--------|---------|---------|---------|------|
| **里程碑 11** | 2025-06-15 | 機器人系統完成 | 🚧 40% | 基礎架構完成，業務邏輯待開發 |
| - | - | 數據層與服務層完成 | ✅ 100% | Repository、部分 Service 層已完成 |
| - | - | 頁面組件開發完成 | 🚧 60% | 骨架頁面已建立，功能待實作 |
| - | - | Bot 執行引擎開發 | ⏳ 0% | 待開始 |
| - | - | 排程系統開發 | ⏳ 0% | 待開始 |
| - | - | 資料分析/文件系統整合 | 🧊 0% | 阻塞：依賴其他模組 |
| - | - | RLS 權限驗證（3 張表） | ⏳ 0% | 待開始 |
| - | - | 單元測試（目標 80%） | ⏳ 0% | 待開始 |
| - | - | 集成測試 | ⏳ 0% | 待開始 |
| - | - | E2E 測試 | ⏳ 0% | 待開始 |

### 測試覆蓋率目標

| 層級 | 目標覆蓋率 | 當前覆蓋率 | 狀態 | 備註 |
|------|-----------|-----------|------|------|
| **Service 層** | ≥80% | 0% | ⏳ 待開始 | BotService 待測試 |
| **Repository 層** | ≥80% | 0% | ⏳ 待開始 | 3 個 Repository 待測試 |
| **Component 層** | ≥70% | 0% | ⏳ 待開始 | 頁面組件待測試 |
| **整體目標** | ≥75% | 0% | ⏳ 待開始 | 需建立測試框架 |

### 技術債務清單

| 項目 | 優先級 | 影響範圍 | 預計工作量 | 狀態 |
|------|--------|---------|-----------|------|
| Bot 執行引擎開發 | 🔴 高 | 核心功能 | 5-7 天 | ⏳ 待開始 |
| 排程系統開發 | 🔴 高 | 核心功能 | 4-5 天 | ⏳ 待開始 |
| 資料分析/文件系統整合 | 🔴 高 | 功能完整性 | 3-4 天 | 🧊 阻塞 |
| 頁面組件功能實現 | 🟡 中 | 用戶體驗 | 3-4 天 | ⏳ 待開始 |
| RLS 權限驗證（3 張表） | 🔴 高 | 安全性 | 1-2 天 | ⏳ 待開始 |
| 單元測試覆蓋率不足 | 🔴 高 | 代碼質量 | 4-5 天 | ⏳ 待開始 |
| 集成測試缺失 | 🟡 中 | 功能驗證 | 2-3 天 | ⏳ 待開始 |
| E2E 測試缺失 | 🟡 中 | 端到端驗證 | 2-3 天 | ⏳ 待開始 |

### 已知問題清單

| 問題 | 嚴重程度 | 影響範圍 | 狀態 | 解決方案 |
|------|---------|---------|------|---------|
| 依賴資料分析/文件系統 | 🔴 高 | 功能完整性 | 🧊 阻塞 | 等待資料分析和文件系統模組完成 |
| Bot 執行引擎未開發 | 🔴 高 | 核心功能 | ⏳ 待解決 | 開發 Bot 執行引擎 |
| 排程系統未開發 | 🔴 高 | 核心功能 | ⏳ 待解決 | 開發排程系統 |
| 頁面組件功能待實作 | 🟡 中 | 用戶體驗 | ⏳ 待解決 | 實現頁面組件功能 |
| RLS 權限驗證未實施 | 🔴 高 | 安全性 | ⏳ 待解決 | 實施 3 張表的 RLS 策略 |
| 測試覆蓋率為 0 | 🔴 高 | 代碼質量 | ⏳ 待解決 | 建立測試框架並補齊測試 |

---

## 📋 任務清單

### 數據層與服務層

#### Core 層（Infrastructure）

創建 bot.types.ts（Bot 執行類型）[✅已完成]
BotRepository 實施（core/infra/repositories/bot.repository.ts）[✅已完成]
BotTaskRepository 實施（core/infra/repositories/bot-task.repository.ts）[✅已完成]
BotExecutionLogRepository 實施（core/infra/repositories/bot-execution-log.repository.ts）[✅已完成]
更新 core/infra/repositories/index.ts 導出所有 Bot Repository[✅已完成]

#### Shared 層（Models & Services）

數據模型層（shared/models/bot.models.ts）[✅已完成]
Bot 類型定義（Bot, BotTask, BotExecutionLog）[✅已完成]
Bot 介面定義（BotDetail, BotInsert, BotUpdate）[✅已完成]
更新 shared/models/index.ts 導出 Bot 模型[✅已完成]
BotService 實施（shared/services/bot/bot.service.ts）[✅已完成]
BotService Signals 狀態管理[✅已完成]
BotService CRUD 操作（create, update, delete, loadBots）[✅已完成]
BotService 查詢方法（loadBotById, loadTasks, loadExecutionLogs）[✅已完成]
BotService Computed signals（activeBots, pendingTasks, runningTasks）[✅已完成]
更新 shared/services/bot/index.ts 導出 BotService[✅已完成]
BotTaskService 實施[⏳待開始]
Bot 任務排程系統[⏳待開始]
Bot 執行引擎[⏳待開始]
Bot 執行日誌記錄[⏳待開始]

#### Facade 层（Core）

BotFacade 實施（core/facades/bot.facade.ts）[⏳待開始]
BotFacade Signals 狀態管理[⏳待開始]
BotFacade Bot 管理（createBot, updateBot, deleteBot, loadBots）[⏳待開始]
BotFacade Bot 任務管理（createBotTask, updateBotTask, executeBotTask）[⏳待開始]
BotFacade Bot 執行控制（startBot, stopBot, restartBot）[⏳待開始]
BotFacade 執行日誌管理（loadExecutionLogs, getExecutionLogById）[⏳待開始]
BotFacade 查詢方法（loadBotById, loadTasksByBot, loadTasksByStatus）[⏳待開始]
BotFacade Computed signals（activeBots, pendingTasks, runningTasks, failedTasks）[⏳待開始]
BotFacade 統計功能（botStats, taskStats, executionStats）[⏳待開始]
BotFacade 活動記錄整合（BlueprintActivityService）[⏳待開始]
BotFacade 錯誤處理整合（ErrorStateService）[⏳待開始]
更新 core/index.ts 導出 BotFacade[⏳待開始]

#### 業務功能實現

定期報表 Bot[⏳待開始]
通知 Bot[⏳待開始]
備份 Bot[⏳待開始]
Bot 任務佇列管理[⏳待開始]
Bot 執行狀態追蹤[⏳待開始]
Bot 失敗重試機制[⏳待開始]
Bot 排程監控與告警[⏳待開始]

#### 權限與安全

RLS 權限驗證（bots 表）[⏳待開始]
RLS 權限驗證（bot_tasks 表）[⏳待開始]
RLS 權限驗證（bot_execution_logs 表）[⏳待開始]

### 頁面組件開發

#### 路由骨架（2025-11-14 完成）

Bot 列表頁面骨架（routes/bots/list/bot-list.component.ts）[✅已完成]
Bot 配置頁面骨架（routes/bots/config/bot-config.component.ts）[✅已完成]
Bot 執行日誌頁面骨架（routes/bots/executions/bot-execution.component.ts）[✅已完成]
Bot 任務頁面骨架（routes/bots/tasks/bots-tasks-skeleton.component.ts）[✅已完成]
Bot 任務頁面單元測試（bots-tasks-skeleton.component.spec.ts）[✅已完成]
更新 routes/bots/routes.ts 路由配置[✅已完成]

#### 賬戶管理模組中的 Bot 功能

Bot 列表頁面（routes/accounts/bots/bot-list.component.ts）[✅已完成]
創建 Bot 頁面（routes/accounts/create/create-bot.component.ts）[✅已完成]

#### 功能實作（待開發）

Bot 列表頁面功能實作（整合 BotService）[⏳待開始]
Bot 配置頁面功能實作（Bot 創建/編輯表單）[⏳待開始]
Bot 詳情頁面（BotDetailComponent）[⏳待開始]
Bot 任務管理頁面（BotTaskManagementComponent）[⏳待開始]
Bot 執行日誌頁面功能實作（日誌查詢與顯示）[⏳待開始]
Bot 執行控制（啟動/停止/重試）[⏳待開始]
Bot 排程配置 UI[⏳待開始]

### 測試

#### 單元測試

BotService 單元測試[⏳待開始]
BotRepository 單元測試[⏳待開始]
BotTaskRepository 單元測試[⏳待開始]
BotExecutionLogRepository 單元測試[⏳待開始]
Bot 組件單元測試（BotListComponent, BotConfigComponent）[⏳待開始]

#### 集成測試

Bot 創建流程集成測試[⏳待開始]
Bot 任務執行流程集成測試[⏳待開始]
Bot 執行日誌記錄集成測試[⏳待開始]

#### E2E 測試

Bot 管理 E2E 測試[⏳待開始]
Bot 任務執行 E2E 測試[⏳待開始]
Bot 排程功能 E2E 測試[⏳待開始]

### 文檔

API 文檔更新（機器人系統 API 文檔）[⏳待開始]
用戶指南更新（機器人系統用戶指南）[⏳待開始]
Bot 配置操作指南[⏳待開始]
Bot 排程監控與告警文檔[⏳待開始]
Bot 回滾方案文檔[⏳待開始]

---

## 📅 開發歷程

### 2025-11-14：路由骨架建立

- ✅ **全站路由骨架鋪設**：依據 `app-data.json` 建立 bots 模組的路由與頁面骨架
- ✅ 創建 4 個 Standalone Components（BotListComponent, BotConfigComponent, BotExecutionComponent, BotsTasksSkeletonComponent）
- ✅ 所有頁面採用 `page-header + nz-card + nz-alert + nz-empty` 模板
- ✅ 更新 `src/app/routes/routes.ts`，主框架可導航至所有菜單節點

### 2025-01-15：基礎架構完成

- ✅ **Core 層類型定義**：創建 `bot.types.ts`（Bot 執行類型）
- ✅ **Repository 層實施**：完成 3 個 Repository（BotRepository, BotTaskRepository, BotExecutionLogRepository）
- ✅ **數據模型層實施**：創建 `shared/models/bot.models.ts`
- ✅ **Service 層實施**：完成 `BotService`（Signals 狀態管理、CRUD 操作、查詢方法）
- ✅ **UI 層骨架**：完成路由骨架和基本頁面結構

### 2025-01-15：代碼審查改進建議

#### ⚠️ 代碼質量改進

1. **內聯樣式改進**：
   - **問題**：組件中大量使用 `style="..."` 內聯樣式
   - **建議**：將內聯樣式提取到組件的 `styles` 數組中

2. **接口定義分散**：
   - **問題**：組件內部定義了接口
   - **建議**：將通用接口提取到 `shared/models/bot.models.ts`

### 待開發階段

- ⏳ **BotTaskService 實施**：任務管理服務
- ⏳ **Bot 執行引擎**：實際執行 Bot 任務的引擎
- ⏳ **Bot 排程系統**：任務排程與監控
- ⏳ **業務功能實現**：定期報表、通知、備份 Bot
- ⏳ **RLS 權限驗證**：3 張表的 RLS 策略

---

## 📝 備註

### 已完成功能

1. **基礎架構**：
   - ✅ 完整的 Repository 層（3 個 Repository）
   - ✅ 數據模型層（Bot, BotTask, BotExecutionLog）
   - ✅ BotService 基礎功能（CRUD、查詢、狀態管理）
   - ✅ 路由骨架和頁面結構

2. **技術特點**：
   - ✅ 使用 Signals 管理狀態
   - ✅ 暴露 ReadonlySignal 給組件
   - ✅ Computed signals（activeBots, pendingTasks, runningTasks）
   - ✅ 完整的 TypeScript 類型定義

### 下一步行動

1. **優先級 P0（必須完成）**：
   - 實施 BotTaskService
   - 設計 Bot 執行引擎架構
   - 實現 RLS 權限驗證

2. **優先級 P1（重要功能）**：
   - 實現 Bot 任務排程系統
   - 實現 Bot 執行日誌記錄
   - 整合資料分析/文件系統

3. **優先級 P2（業務功能）**：
   - 定期報表 Bot
   - 通知 Bot
   - 備份 Bot

### 依賴關係

- **依賴模組**：
  - 📊 資料分析系統（模組 8）- 提供報表數據
  - 📁 文件管理系統（模組 9）- 提供文件操作
  - 💬 協作溝通系統（模組 7）- 提供通知功能

- **被依賴模組**：
  - 🔐 帳戶與身份系統（模組 1）- Bot 作為 Account 類型

### 相關代碼位置

- **核心服務**：`src/app/shared/services/bot/`
  - `bot.service.ts` - 機器人管理服務
- **Repository 層**：`src/app/core/infra/repositories/`
  - `bot.repository.ts` - 機器人 Repository
  - `bot-task.repository.ts` - 機器人任務 Repository
  - `bot-execution-log.repository.ts` - 機器人執行日誌 Repository
- **數據模型**：`src/app/shared/models/bot.models.ts`
- **頁面組件**：`src/app/routes/bots/`
  - `list/bot-list.component.ts` - 機器人列表
  - `detail/bot-detail.component.ts` - 機器人詳情
  - `tasks/bot-task-list.component.ts` - 機器人任務列表

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [主任務追蹤清單](./99-Tracking.md)
- [Bot Service 實現](../../src/app/shared/services/bot/bot.service.ts)
- [Bot Repository 實現](../../src/app/core/infra/repositories/bot.repository.ts)

---

## 📊 統計資訊

**總任務數**：約 45 個任務  
**已完成**：約 18 個任務（40%）  
**進行中**：約 0 個任務（0%）  
**待開始**：約 27 個任務（60%）

**完成度分析**：
- 數據層：✅ 100%（5/5 任務）
- 服務層：✅ 50%（5/10 任務）
- UI 層：🚧 60%（4/7 任務）
- 業務邏輯：⏳ 0%（0/10 任務）
- 測試：⏳ 0%（0/8 任務）
- 文檔：⏳ 0%（0/5 任務）

