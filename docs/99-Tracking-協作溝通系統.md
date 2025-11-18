# 💬 協作溝通系統 - 任務追蹤

> 📋 **目的**：追蹤協作溝通系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15（骨架組件改進完成 - 補充遺漏組件）

---

## 📜 開發歷程記錄

### 2025-01-15：骨架組件改進完成 - 補充遺漏組件

- ✅ **團隊通知頁面改進**：添加完整的表格骨架結構（st 表格、篩選器、操作按鈕），實現篩選功能（類型、狀態），使用 computed 實現響應式過濾
- ✅ **即時通知頁面改進**：添加完整的表格骨架結構（st 表格、篩選器），實現篩選功能（通道、狀態），使用 computed 實現響應式過濾
- ✅ **通知中心頁面改進**：添加完整的表格骨架結構（st 表格、篩選器、操作按鈕），實現篩選功能（類型、已讀/未讀），使用 computed 實現響應式過濾
- ✅ **通知詳情頁面改進**：添加完整的詳情頁骨架結構（nz-descriptions、狀態標籤、返回按鈕），實現加載狀態和錯誤處理
- ✅ **所有組件符合企業標準**：OnPush 變更檢測、Signals 狀態管理、類型安全、錯誤處理、內聯模板

### 2025-01-15：骨架組件改進完成

- ✅ **討論列表頁面改進**：添加完整的表格骨架結構（st 表格、篩選器、操作按鈕），實現篩選功能（資源類型、搜索關鍵字），使用 computed 實現響應式過濾
- ✅ **評論列表頁面改進**：添加完整的表格骨架結構（st 表格、篩選器、操作按鈕），實現篩選功能（資源類型、作者），使用 computed 實現響應式過濾
- ✅ **評論創建頁面改進**：添加完整的表單骨架結構（表單字段、文件上傳、提交按鈕），實現表單驗證邏輯
- ✅ **待辦中心頁面改進**：添加完整的表格骨架結構（st 表格、篩選器、操作按鈕），實現篩選功能（狀態、類型、優先級），使用 computed 實現響應式過濾
- ✅ **所有組件符合企業標準**：OnPush 變更檢測、Signals 狀態管理、類型安全、錯誤處理

### 2025-01-15：代碼審查改進建議

#### ⚠️ 代碼質量改進

1. **@switch 狀態渲染改進**：
   - **問題**：多個組件使用 `@switch` 渲染狀態標籤
   - **影響**：狀態值變更需要多處修改，違反 DRY 原則
   - **建議**：逐步替換為 `StatusPipe`（需要更多測試）
   - **涉及文件**：
     - `src/app/routes/communication/todos/todo-center.component.ts`（3 處 @switch：status、type、priority）
     - `src/app/routes/communication/realtime/realtime-notify.component.ts`
     - `src/app/routes/communication/team-notify/team-notify.component.ts`

2. **內聯樣式改進**：
   - **問題**：組件中大量使用 `style="..."` 內聯樣式
   - **建議**：將內聯樣式提取到組件的 `styles` 數組中

3. **過濾邏輯重複**：
   - **問題**：多個組件都有類似的 `computed` 過濾邏輯
   - **建議**：提取共享過濾工具函數到 `shared/utils/filter.utils.ts`

### 2025-01-15：組件架構優化

- ✅ **分支詳情組件架構確認**：Modal 和路由組件功能不同，保留兩者
  - Modal 組件（`branch-detail.component.ts`）：用於快速查看分支詳情
  - 路由組件（`branch-detail/branch-detail.ts`）：完整的分支詳情頁面，支持切換分支、權限管理
- ✅ **PR 詳情組件架構確認**：Modal 和路由組件功能不同，保留兩者
  - Modal 組件（`pull-request-detail.component.ts`）：在列表中快速查看 PR 詳情
  - 路由組件（`pull-request-detail.ts`）：完整的 PR 詳情頁面，支持審核、合併等操作
- ✅ **組件整合完成**：所有組件已符合企業標準（Signals、OnPush、錯誤處理）

---  
**維護者**：開發團隊  
**模組編號**：M8  
**資料表數量**：6 張

---

## 📊 模組資訊

### 資料表清單

1. **comments** - 留言表（任務、問題的討論留言）
2. **notifications** - 通知表（系統通知記錄）
3. **notification_rules** - 通知規則表（用戶自訂通知規則）
4. **notification_subscriptions** - 通知訂閱表
5. **personal_todos** - 個人待辦中心表（五種狀態分類：待執行/暫存中/品管中/驗收中/問題追蹤）
6. **todo_status_tracking** - 待辦狀態追蹤表

### 模組狀態

- **目前狀態**：🚧 進行中（核心服務完成，頁面組件待實現）
- **近期里程碑**：里程碑 8（2025-04-15）
- **主要阻塞**：頁面組件待實現，通知規則引擎待完善

### 里程碑對照表

| 里程碑 | 目標日期 | 關鍵任務 | 完成狀態 | 備註 |
|--------|---------|---------|---------|------|
| **里程碑 8** | 2025-04-15 | 協作溝通系統完成 | 🚧 60% | 核心服務完成，頁面組件待實現 |
| - | - | 數據層與服務層完成 | ✅ 100% | Repository、Service 層已完成 |
| - | - | 核心功能實現 | ✅ 100% | 留言、通知、待辦功能完成 |
| - | - | 頁面組件開發完成 | 🚧 22% | 2/9 頁面進行中 |
| - | - | CommunicationFacade 實施 | ⏳ 0% | 待開始 |
| - | - | RLS 權限驗證（6 張表） | ⏳ 0% | 待開始 |
| - | - | 單元測試（目標 80%） | ⏳ 0% | 待開始 |
| - | - | 集成測試 | ⏳ 0% | 待開始 |
| - | - | E2E 測試 | ⏳ 0% | 待開始 |

### 測試覆蓋率目標

| 層級 | 目標覆蓋率 | 當前覆蓋率 | 狀態 | 備註 |
|------|-----------|-----------|------|------|
| **Service 層** | ≥80% | 0% | ⏳ 待開始 | CommentService、NotificationService、PersonalTodoService 待測試 |
| **Repository 層** | ≥80% | 0% | ⏳ 待開始 | 6 個 Repository 待測試 |
| **Component 層** | ≥70% | 0% | ⏳ 待開始 | 9 個組件待測試 |
| **Facade 層** | ≥80% | 0% | ⏳ 待開始 | CommunicationFacade 待實施 |
| **整體目標** | ≥75% | 0% | ⏳ 待開始 | 需建立測試框架 |

### 技術債務清單

| 項目 | 優先級 | 影響範圍 | 預計工作量 | 狀態 |
|------|--------|---------|-----------|------|
| CommunicationFacade 實施 | 🔴 高 | 統一接口、錯誤處理 | 2-3 天 | ⏳ 待開始 |
| 頁面組件開發（7 個） | 🔴 高 | 用戶體驗 | 7-10 天 | ⏳ 待開始 |
| RLS 權限驗證（6 張表） | 🔴 高 | 安全性 | 3-4 天 | ⏳ 待開始 |
| 通知規則引擎完善 | 🟡 中 | 功能完整性 | 2-3 天 | ⏳ 待開始 |
| 單元測試覆蓋率不足 | 🔴 高 | 代碼質量 | 5-7 天 | ⏳ 待開始 |
| 集成測試缺失 | 🟡 中 | 功能驗證 | 3-4 天 | ⏳ 待開始 |
| E2E 測試缺失 | 🟡 中 | 端到端驗證 | 2-3 天 | ⏳ 待開始 |

### 已知問題清單

| 問題 | 嚴重程度 | 影響範圍 | 狀態 | 解決方案 |
|------|---------|---------|------|---------|
| 頁面組件待實現（7 個） | 🔴 高 | 用戶體驗 | ⏳ 待解決 | 實現待辦中心、通知中心等頁面 |
| RLS 權限驗證未實施 | 🔴 高 | 安全性 | ⏳ 待解決 | 實施 6 張表的 RLS 策略 |
| 通知規則引擎待完善 | 🟡 中 | 功能完整性 | ⏳ 待解決 | 完善通知規則引擎邏輯 |
| 測試覆蓋率為 0 | 🔴 高 | 代碼質量 | ⏳ 待解決 | 建立測試框架並補齊測試 |

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/communication/）[✅已完成]
創建 communication.types.ts（評論、通知類型）[✅已完成]
Repository 層（6 個 Repository）[✅已完成]
服務層（CommentService, NotificationService, PersonalTodoService）[✅已完成]
留言功能實現[✅已完成]
通知系統實現[✅已完成]
通知規則管理（NotificationService）[✅已完成]
待辦中心實現（五種狀態分類）[✅已完成]
待辦狀態追蹤（PersonalTodoService）[✅已完成]

#### Facade 层（Core）

CommunicationFacade 實施（core/facades/communication.facade.ts）[⏳待開始]
CommunicationFacade Signals 狀態管理[⏳待開始]
CommunicationFacade 評論管理（createComment, updateComment, deleteComment）[⏳待開始]
CommunicationFacade 通知管理（createNotification, markAsRead, markAllAsRead）[⏳待開始]
CommunicationFacade 待辦管理（createTodo, updateTodo, deleteTodo, updateTodoStatus）[⏳待開始]
CommunicationFacade 通知規則管理（createNotificationRule, updateNotificationRule, deleteNotificationRule）[⏳待開始]
CommunicationFacade 查詢方法（loadComments, loadNotifications, loadTodos）[⏳待開始]
CommunicationFacade Computed signals（unreadNotifications, pendingTodos, todosByStatus）[⏳待開始]
CommunicationFacade 統計功能（notificationStats, todoStats, commentStats）[⏳待開始]
CommunicationFacade 實時更新整合（RealtimeFacade）[⏳待開始]
CommunicationFacade 活動記錄整合（BlueprintActivityService）[⏳待開始]
CommunicationFacade 錯誤處理整合（ErrorStateService）[⏳待開始]
更新 core/index.ts 導出 CommunicationFacade[⏳待開始]

#### Realtime 邊界功能（Core）

RealtimeFacade 實施（core/facades/realtime.facade.ts）[⏳待開始]
RealtimeFacade Signals 狀態管理[⏳待開始]
RealtimeFacade 訂閱管理（subscribe, unsubscribe, subscribeToChannel）[⏳待開始]
RealtimeFacade 資料庫變更訂閱（subscribeToTable, subscribeToFilter）[⏳待開始]
RealtimeFacade Broadcast 廣播（broadcast, onBroadcast）[⏳待開始]
RealtimeFacade Presence 狀態管理（trackPresence, getPresence）[⏳待開始]
RealtimeFacade 連線狀態管理（connectionStatus, reconnect）[⏳待開始]
RealtimeFacade 錯誤處理與重連機制[⏳待開始]
RealtimeFacade 訂閱生命週期管理（自動清理、記憶體洩漏防止）[⏳待開始]
更新 core/index.ts 導出 RealtimeFacade[✅已完成]

#### Edge Function 整合

通知處理 Edge Function（notification-handler）實施[⏳待開始]
通知處理 Edge Function 整合（發送通知邏輯）[⏳待開始]
通知處理 Edge Function 錯誤處理與重試機制[⏳待開始]

#### 權限與安全

RLS 權限驗證[⏳待開始]
RLS 權限驗證（comments 表）[⏳待開始]
RLS 權限驗證（notifications 表）[⏳待開始]
RLS 權限驗證（notification_rules 表）[⏳待開始]
RLS 權限驗證（notification_subscriptions 表）[⏳待開始]
RLS 權限驗證（personal_todos 表）[⏳待開始]
RLS 權限驗證（todo_status_tracking 表）[⏳待開始]

### 頁面組件開發

討論列表頁面（DiscussionListComponent）[⏳待開始]
評論列表頁面（CommentListComponent）[⏳待開始]
評論創建頁面（CommentCreateComponent）[⏳待開始]
通知中心頁面（NotificationCenterComponent）[⏳待開始]
通知詳情頁面（NotificationDetailComponent）[🚧進行中]
通知規則頁面（NotificationRulesComponent）[🚧進行中]
實時通知頁面（RealtimeNotifyComponent）[⏳待開始]
待辦中心頁面（TodoCenterComponent）[⏳待開始]
團隊通知頁面（TeamNotifyComponent）[⏳待開始]

### 測試

單元測試[⏳待開始]
集成測試[⏳待開始]
E2E 測試（待辦中心 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（協作溝通系統 API 文檔）[⏳待開始]
用戶指南更新（協作溝通用戶指南）[⏳待開始]

---

## 📜 開發歷程記錄

### Phase 1: 基礎架構（2024-12）

- ✅ 數據模型層建立（shared/models/communication/）
- ✅ communication.types.ts 類型定義（評論、通知類型）
- ✅ Repository 層實現（6 個 Repository）
  - ✅ CommentRepository
  - ✅ NotificationRepository
  - ✅ NotificationRuleRepository
  - ✅ NotificationSubscriptionRepository
  - ✅ PersonalTodoRepository
  - ✅ TodoStatusTrackingRepository

### Phase 2: 服務層實現（2024-12 ~ 2025-01）

- ✅ CommentService（留言功能）
  - ✅ 巢狀回覆支援
  - ✅ @提及功能
  - ✅ Realtime 即時訊息整合
  - ✅ Signal 狀態管理

- ✅ NotificationService（通知系統）
  - ✅ 多種通知類型（任務、問題、留言、PR、系統）
  - ✅ 通知規則管理
  - ✅ 通知訂閱管理
  - ✅ Realtime 推送支援
  - ✅ Signal 狀態管理

- ✅ PersonalTodoService（待辦中心）
  - ✅ 五種狀態分類實現
    - 🟦 待執行（pending）
    - 🟨 暫存中（staging）
    - 🟧 品管中（in_qa）
    - 🟥 驗收中（in_inspection）
    - ⚠️ 問題追蹤（issue_tracking）
  - ✅ 待辦狀態追蹤
  - ✅ Realtime 即時更新
  - ✅ Signal 狀態管理
  - ✅ 統計數據計算

### Phase 3: 頁面組件開發（2025-01 起）

- ✅ 通知詳情頁面（NotificationDetailComponent）[🚧進行中]
- ✅ 通知規則頁面（NotificationRulesComponent）[🚧進行中]
- ✅ 討論列表頁面（DiscussionListComponent）[✅已完成]
  - 添加完整的表格骨架結構（st 表格、篩選器、操作按鈕）[✅已完成]
  - 實現篩選功能（資源類型、搜索關鍵字）[✅已完成]
  - 使用 computed 實現響應式過濾[✅已完成]
  - 符合企業標準（OnPush、Signals、類型安全）[✅已完成]
- ✅ 評論列表頁面（CommentListComponent）[✅已完成]
  - 添加完整的表格骨架結構（st 表格、篩選器、操作按鈕）[✅已完成]
  - 實現篩選功能（資源類型、作者）[✅已完成]
  - 使用 computed 實現響應式過濾[✅已完成]
  - 符合企業標準（OnPush、Signals、類型安全）[✅已完成]
- ✅ 評論創建頁面（CommentCreateComponent）[✅已完成]
  - 添加完整的表單骨架結構（表單字段、文件上傳、提交按鈕）[✅已完成]
  - 實現表單驗證邏輯[✅已完成]
  - 符合企業標準（OnPush、Signals、類型安全）[✅已完成]
- ⏳ 通知中心頁面（NotificationCenterComponent）[⏳待開始]
- ⏳ 實時通知頁面（RealtimeNotifyComponent）[⏳待開始]
- ✅ 待辦中心頁面（TodoCenterComponent）[✅已完成]
  - 添加完整的表格骨架結構（st 表格、篩選器、操作按鈕）[✅已完成]
  - 實現篩選功能（狀態、類型、優先級）[✅已完成]
  - 使用 computed 實現響應式過濾[✅已完成]
  - 符合企業標準（OnPush、Signals、類型安全）[✅已完成]
- ⏳ 團隊通知頁面（TeamNotifyComponent）[⏳待開始]

---

## 📦 應該要交付的

### 核心功能交付清單

#### ✅ 已完成交付

1. **數據層**
   - ✅ 6 個 Repository（100%）
   - ✅ 數據模型層（100%）
   - ✅ 類型定義（100%）

2. **服務層**
   - ✅ CommentService（留言功能，含巢狀回覆、@提及、Realtime）
   - ✅ NotificationService（通知系統，含規則管理、訂閱管理、Realtime 推送）
   - ✅ PersonalTodoService（待辦中心，含五種狀態分類、狀態追蹤、Realtime 更新）

3. **核心功能**
   - ✅ 留言功能實現（100%）
   - ✅ 通知系統實現（100%）
   - ✅ 通知規則管理（100%）
   - ✅ 待辦中心實現（五種狀態分類，100%）
   - ✅ 待辦狀態追蹤（100%）

4. **頁面組件（部分）**
   - ✅ 通知詳情頁面（NotificationDetailComponent）[🚧進行中]
   - ✅ 通知規則頁面（NotificationRulesComponent）[🚧進行中]

#### ⏳ 待交付

1. **頁面組件**
   - ⏳ 討論列表頁面（DiscussionListComponent）
   - ⏳ 評論列表頁面（CommentListComponent）
   - ⏳ 評論創建頁面（CommentCreateComponent）
   - ⏳ 通知中心頁面（NotificationCenterComponent）
   - ⏳ 實時通知頁面（RealtimeNotifyComponent）
   - ⏳ 待辦中心頁面（TodoCenterComponent）
   - ⏳ 團隊通知頁面（TeamNotifyComponent）

2. **功能完善**
   - ⏳ 通知規則引擎完善
   - ⏳ Realtime 推送優化
   - ⏳ 待辦中心 UI/UX 優化
   - ⏳ RLS 權限驗證（6 張表）

3. **測試**
   - ⏳ 單元測試（目標 80% 覆蓋率）
   - ⏳ 集成測試
   - ⏳ E2E 測試（待辦中心 E2E 測試）

4. **文檔**
   - ⏳ API 文檔更新（協作溝通系統 API 文檔）
   - ⏳ 用戶指南更新（協作溝通用戶指南）

### 交付標準

#### 功能完整性
- ✅ 數據層（100%）
- ✅ 服務層（100%）
- ✅ 核心功能（100%）
- 🚧 頁面組件（部分完成，20%）
- ⏳ RLS 權限驗證（0%）

#### 代碼質量
- ✅ TypeScript 類型安全（100%）
- ✅ 架構規範遵循（100%）
- ✅ Signal 狀態管理（100%）
- ✅ Realtime 整合（100%）
- ⏳ 單元測試（0%）
- ⏳ 集成測試（0%）
- ⏳ E2E 測試（0%）

#### 文檔完整性
- ✅ 代碼註釋（100%）
- ⏳ API 文檔（0%）
- ⏳ 用戶指南（0%）

---

## 📝 備註

### 下一步行動

- 實現待辦中心頁面（TodoCenterComponent）
- 實現通知中心頁面（NotificationCenterComponent）
- 實現評論相關頁面組件
- 完善通知規則引擎
- 建立 RLS 策略（6 張表）
- 補齊單元測試和集成測試

### 相關代碼位置

- **核心服務**：`src/app/shared/services/communication/`
  - `comment.service.ts` - 留言服務
  - `notification.service.ts` - 通知服務
  - `personal-todo.service.ts` - 待辦中心服務
- **Facade 層**：`src/app/core/facades/`
  - `communication.facade.ts` - 協作溝通 Facade（⏳待實施）
- **Repository 層**：`src/app/core/infra/repositories/`
  - `comment.repository.ts` - 留言 Repository
  - `notification.repository.ts` - 通知 Repository
  - `notification-rule.repository.ts` - 通知規則 Repository
  - `notification-subscription.repository.ts` - 通知訂閱 Repository
  - `personal-todo.repository.ts` - 待辦中心 Repository
  - `todo-status-tracking.repository.ts` - 待辦狀態追蹤 Repository
- **數據模型**：`src/app/shared/models/communication/`
  - `communication.models.ts` - 協作溝通相關模型
- **頁面組件**：`src/app/routes/communication/`
  - `notifications/notification-center.component.ts` - 通知中心
  - `notifications/notification-detail.component.ts` - 通知詳情
  - `notifications/notification-rules.component.ts` - 通知規則
  - `todos/todo-center.component.ts` - 待辦中心
  - `comments/comment-list.component.ts` - 評論列表

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)

---

## 📊 統計資訊

**總任務數**：約 30 個任務  
**已完成**：約 18 個任務（60%）  
**進行中**：約 2 個任務（7%）  
**待開始**：約 10 個任務（33%）

**完成度分析**：
- 數據層：✅ 100%（7/7 任務）
- 服務層：✅ 100%（5/5 任務）
- 核心功能：✅ 100%（5/5 任務）
- 頁面組件：🚧 22%（2/9 任務）
- 測試：⏳ 0%（0/3 任務）
- 文檔：⏳ 0%（0/2 任務）

