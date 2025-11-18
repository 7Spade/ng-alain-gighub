# 🔐 帳戶與身份系統 - 任務追蹤

> 📋 **目的**：追蹤帳戶與身份系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M1  
**資料表數量**：4 張

---

## 📊 模組資訊

### 資料表清單

1. **accounts** - 帳戶主表（統一身份抽象，支援 User/Bot/Organization）
2. **teams** - 團隊表
3. **team_members** - 團隊成員表
4. **organization_schedules** - 組織排班表（跨藍圖成員調派）

### 模組狀態

- **目前狀態**：🚧 進行中（90%）
- **近期里程碑**：里程碑 5（2025-02-15）
- **主要阻塞**：測試覆蓋率不足、文檔待補齊

### 里程碑對照表 ⭐

| 里程碑 | 目標日期 | 關鍵任務 | 完成狀態 | 備註 |
|--------|---------|---------|---------|------|
| **里程碑 5** | 2025-02-15 | 帳戶與身份系統完成 | 🚧 90% | 核心功能完成，測試和文檔待補齊 |
| - | - | 數據層與服務層完成 | ✅ 100% | Repository、Service 層已完成 |
| - | - | 頁面組件開發完成 | ✅ 100% | 所有頁面組件已完成 |
| - | - | RLS 權限驗證（4 張表） | ✅ 100% | 已完成 |
| - | - | 單元測試（目標 80%） | ⏳ 0% | 待開始 |
| - | - | 集成測試 | ⏳ 0% | 待開始 |
| - | - | E2E 測試 | ⏳ 0% | 待開始 |
| - | - | API 文檔 | ⏳ 0% | 待開始 |
| - | - | 用戶指南 | ⏳ 0% | 待開始 |

### 測試覆蓋率目標 ⭐

| 層級 | 目標覆蓋率 | 當前覆蓋率 | 狀態 | 備註 |
|------|-----------|-----------|------|------|
| **Service 層** | ≥80% | 0% | ⏳ 待開始 | AccountService、TeamService 待測試 |
| **Repository 層** | ≥80% | 0% | ⏳ 待開始 | 4 個 Repository 待測試 |
| **Component 層** | ≥70% | 0% | ⏳ 待開始 | 頁面組件待測試 |
| **整體目標** | ≥75% | 0% | ⏳ 待開始 | 需建立測試框架 |

### 技術債務清單 ⭐

| 項目 | 優先級 | 影響範圍 | 預計工作量 | 狀態 |
|------|--------|---------|-----------|------|
| 單元測試覆蓋率不足 | 🔴 高 | 代碼質量 | 5-7 天 | ⏳ 待開始 |
| 集成測試缺失 | 🟡 中 | 功能驗證 | 3-4 天 | ⏳ 待開始 |
| E2E 測試缺失 | 🟡 中 | 端到端驗證 | 2-3 天 | ⏳ 待開始 |
| API 文檔缺失 | 🟡 中 | 開發體驗 | 2-3 天 | ⏳ 待開始 |
| 用戶指南缺失 | 🟢 低 | 用戶體驗 | 2-3 天 | ⏳ 待開始 |

### 已知問題清單 ⭐

| 問題 | 嚴重程度 | 影響範圍 | 狀態 | 解決方案 |
|------|---------|---------|------|---------|
| 測試覆蓋率為 0 | 🔴 高 | 代碼質量 | ⏳ 待解決 | 建立測試框架並補齊測試 |
| API 文檔缺失 | 🟡 中 | 開發體驗 | ⏳ 待解決 | 撰寫 API 文檔 |
| 用戶指南缺失 | 🟢 低 | 用戶體驗 | ⏳ 待解決 | 撰寫用戶指南 |

---

## 📋 任務清單

### 數據層與服務層

#### 數據模型層

數據模型層（shared/models/account.models.ts）[✅已完成]
- Account, Team, TeamMember, OrganizationSchedule 類型定義
- AccountType, AccountStatus, TeamMemberRole 枚舉定義
- 從 core 層重新導出類型，保持向後兼容

#### Repository 層

AccountRepository（core/infra/repositories/account.repository.ts）[✅已完成]
- 基礎 CRUD 操作
- 按類型查詢（findByType）
- 按狀態查詢（findByStatus）
- 按 auth_user_id 查詢（findByAuthUserId）
- 按 email 查詢（findByEmail）

TeamRepository（core/infra/repositories/team.repository.ts）[✅已完成]
- 基礎 CRUD 操作
- 按組織 ID 查詢（findByOrganizationId）

TeamMemberRepository（core/infra/repositories/team-member.repository.ts）[✅已完成]
- 基礎 CRUD 操作
- 團隊成員相關查詢方法

OrganizationScheduleRepository（core/infra/repositories/organization-schedule.repository.ts）[✅已完成]
- 基礎 CRUD 操作
- 按組織 ID 查詢（findByOrganizationId）
- 按日期範圍查詢

#### 服務層

AccountService（shared/services/account/account.service.ts）[✅已完成]
- 使用 Signals 管理狀態
- 賬戶 CRUD 業務邏輯
- 按類型、狀態查詢
- 錯誤處理和狀態管理

TeamService（shared/services/account/team.service.ts）[✅已完成]
- 使用 Signals 管理狀態
- 團隊 CRUD 業務邏輯
- 團隊成員管理
- 團隊角色管理

OrganizationScheduleService（shared/services/account/organization-schedule.service.ts）[✅已完成]
- 使用 Signals 管理狀態
- 排班 CRUD 業務邏輯
- 按組織查詢排班
- 日期範圍查詢

OrganizationMemberService（shared/services/account/organization-member.service.ts）[✅已完成]
- 組織成員管理業務邏輯
- 成員添加、刪除、角色編輯

#### RLS 策略驗證

accounts 表 RLS 策略驗證和完善[✅已完成]
- SELECT 策略：用戶可查看自己的賬戶、組織成員可查看組織賬戶
- INSERT 策略：用戶可創建自己的賬戶
- UPDATE 策略：用戶可更新自己的賬戶、組織管理員可更新組織賬戶
- DELETE 策略：用戶可刪除自己的賬戶（軟刪除）
- 使用 SECURITY DEFINER 函數解決遞歸查詢問題

teams 表 RLS 策略驗證和完善[✅已完成]
- SELECT 策略：組織成員可查看組織下的團隊
- INSERT 策略：組織管理員可創建團隊
- UPDATE 策略：團隊管理員可更新團隊信息
- DELETE 策略：組織管理員可刪除團隊

team_members 表 RLS 策略驗證和完善[✅已完成]
- SELECT 策略：團隊成員可查看團隊成員列表
- INSERT 策略：團隊管理員可添加成員
- UPDATE 策略：團隊管理員可更新成員角色
- DELETE 策略：團隊管理員可移除成員

organization_schedules 表 RLS 策略驗證和完善[✅已完成]
- SELECT 策略：組織成員可查看組織排班
- INSERT 策略：組織管理員可創建排班
- UPDATE 策略：組織管理員可更新排班
- DELETE 策略：組織管理員可刪除排班

### 頁面組件開發

#### 賬戶管理頁面

賬戶列表頁面（AccountListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/list/account-list.component.ts`
- 支持按類型、狀態篩選
- 分頁和搜索功能

賬戶詳情頁面（AccountDetailComponent）[✅已完成]
- 文件：`src/app/routes/accounts/detail/account-detail.component.ts`
- 顯示賬戶詳細信息
- 支持編輯和刪除操作

賬戶表單頁面（AccountFormComponent）[✅已完成]
- 文件：`src/app/routes/accounts/form/account-form.component.ts`
- 創建和編輯賬戶表單
- 表單驗證

#### 用戶管理頁面

用戶列表頁面（UserListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/users/user-list.component.ts`
- 顯示所有用戶賬戶
- 用戶篩選和搜索

#### 組織管理頁面

組織列表頁面（OrganizationListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/organizations/organization-list/organization-list.component.ts`
- 顯示所有組織
- 組織篩選和搜索

創建組織頁面（CreateOrganizationComponent）[✅已完成]
- 文件：`src/app/routes/accounts/create/create-organization.component.ts`
- 創建新組織表單

組織成員添加頁面（OrganizationMemberAddComponent）[✅已完成]
- 文件：`src/app/routes/accounts/organizations/organization-member/organization-member-add.component.ts`
- 添加組織成員功能

組織成員刪除頁面（OrganizationMemberDeleteComponent）[✅已完成]
- 文件：`src/app/routes/accounts/organizations/organization-member/organization-member-delete.component.ts`
- 移除組織成員功能

組織角色編輯頁面（OrganizationRoleEditComponent）[✅已完成]
- 文件：`src/app/routes/accounts/organizations/organization-role/organization-role-edit.component.ts`
- 編輯組織成員角色

組織角色管理頁面（OrganizationRoleManageComponent）[✅已完成]
- 文件：`src/app/routes/accounts/organizations/organization-role-manage/organization-role-manage.component.ts`
- 管理組織成員角色

#### Bot 管理頁面

Bot 列表頁面（BotListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/bots/bot-list.component.ts`
- 顯示所有 Bot 賬戶
- 支持個人 Bot 和組織 Bot 區分

創建 Bot 頁面（CreateBotComponent）[✅已完成]
- 文件：`src/app/routes/accounts/create/create-bot.component.ts`
- 創建新 Bot 表單
- 支持選擇個人或組織 Bot

#### 團隊管理頁面

團隊列表頁面（TeamListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-list/team-list.component.ts`
- 顯示組織下的所有團隊
- 團隊篩選和搜索

團隊詳情頁面（TeamDetailComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-detail/team-detail.component.ts`
- 顯示團隊詳細信息
- 支持編輯和刪除操作

團隊創建頁面（TeamCreateComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-create/team-create.component.ts`
- 創建新團隊表單

團隊編輯頁面（TeamEditComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-edit/team-edit.component.ts`
- 編輯團隊信息表單

團隊刪除頁面（TeamDeleteComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-delete/team-delete.component.ts`
- 刪除團隊確認對話框

團隊成員添加頁面（TeamMemberAddComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-member/team-member-add.component.ts`
- 添加團隊成員功能

團隊成員刪除頁面（TeamMemberDeleteComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-member/team-member-delete.component.ts`
- 移除團隊成員功能

團隊角色編輯頁面（TeamRoleEditComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-role/team-role-edit.component.ts`
- 編輯團隊成員角色

團隊角色管理頁面（TeamRoleManageComponent）[✅已完成]
- 文件：`src/app/routes/accounts/teams/team-role-manage/team-role-manage.component.ts`
- 管理團隊成員角色

#### 排班管理頁面

排班列表頁面（ScheduleListComponent）[✅已完成]
- 文件：`src/app/routes/accounts/schedules/schedule-list.component.ts`
- 顯示組織排班列表
- 支持日期範圍篩選

### 系統評估與優化

賬戶系統完整評估（使用 Sequential Thinking + Software Planning Tool）[✅已完成]
- 架構評估和改進建議
- 依賴關係分析
- 性能優化建議

賬戶系統架構違規修復（core 依賴 shared 問題）[✅已完成]
- 將 AccountType, AccountStatus, TeamMemberRole 枚舉移至 core 層
- 修復 core 層依賴 shared 層的問題
- 保持向後兼容性

accounts 表 RLS 遞歸問題修復（使用 SECURITY DEFINER 函數）[✅已完成]
- 創建 SECURITY DEFINER 函數解決 RLS 遞歸查詢問題
- 確保 RLS 策略正確執行

Bot 賬戶區分機制實施（個人 Bot 與組織 Bot）[✅已完成]
- 實現個人 Bot 和組織 Bot 的區分邏輯
- 更新相關查詢和顯示邏輯

團隊和排班功能改為組織專有[✅已完成]
- 將團隊和排班功能限制為組織專有
- 更新相關權限檢查邏輯

模型結構清理（刪除遺留文件，統一命名規範）[✅已完成]
- 統一使用 account.models.ts 命名
- 刪除遺留的類型定義文件
- 統一導出結構

### 測試

#### 單元測試

AccountService 單元測試（account.service.spec.ts）[✅已完成]
- 文件：`src/app/shared/services/account/account.service.spec.ts`
- 測試 CRUD 操作
- 測試狀態管理
- 測試錯誤處理

TeamService 單元測試（team.service.spec.ts）[✅已完成]
- 文件：`src/app/shared/services/account/team.service.spec.ts`
- 測試團隊 CRUD 操作
- 測試團隊成員管理
- 測試狀態管理

OrganizationScheduleService 單元測試[⏳待開始]
- 需要創建 `organization-schedule.service.spec.ts`
- 測試排班 CRUD 操作
- 測試狀態管理

OrganizationMemberService 單元測試[⏳待開始]
- 需要創建 `organization-member.service.spec.ts`
- 測試組織成員管理操作
- 測試狀態管理

Repository 層單元測試[⏳待開始]
- AccountRepository 單元測試
- TeamRepository 單元測試
- TeamMemberRepository 單元測試
- OrganizationScheduleRepository 單元測試

頁面組件單元測試[⏳待開始]
- AccountListComponent 單元測試
- AccountDetailComponent 單元測試
- AccountFormComponent 單元測試
- UserListComponent 單元測試
- OrganizationListComponent 單元測試
- OrganizationMemberAddComponent 單元測試
- OrganizationMemberDeleteComponent 單元測試
- OrganizationRoleEditComponent 單元測試
- OrganizationRoleManageComponent 單元測試
- BotListComponent 單元測試
- CreateOrganizationComponent 單元測試
- CreateBotComponent 單元測試
- TeamListComponent 單元測試
- TeamDetailComponent 單元測試
- TeamCreateComponent 單元測試
- TeamEditComponent 單元測試
- TeamDeleteComponent 單元測試
- TeamMemberAddComponent 單元測試
- TeamMemberDeleteComponent 單元測試
- TeamRoleEditComponent 單元測試
- TeamRoleManageComponent 單元測試
- ScheduleListComponent 單元測試

#### 集成測試

Service 層集成測試[⏳待開始]
- AccountService 與 AccountRepository 集成測試
- TeamService 與 TeamRepository 集成測試
- OrganizationScheduleService 與 OrganizationScheduleRepository 集成測試
- OrganizationMemberService 集成測試

組件與服務集成測試[⏳待開始]
- 頁面組件與對應 Service 的集成測試
- 表單驗證和提交流程測試
- 狀態同步測試

#### E2E 測試

賬戶管理 E2E 測試[⏳待開始]
- 賬戶創建流程測試
- 賬戶編輯流程測試
- 賬戶刪除流程測試
- 賬戶列表和搜索測試

組織管理 E2E 測試[⏳待開始]
- 組織創建流程測試
- 組織成員管理流程測試
- 組織角色管理流程測試

團隊管理 E2E 測試[⏳待開始]
- 團隊創建流程測試
- 團隊成員管理流程測試
- 團隊角色管理流程測試

排班管理 E2E 測試[⏳待開始]
- 排班創建流程測試
- 排班查詢和篩選測試

### 文檔

#### API 文檔

API 文檔更新（帳戶系統 API 文檔）[⏳待開始]
- AccountService API 文檔
- TeamService API 文檔
- OrganizationScheduleService API 文檔
- OrganizationMemberService API 文檔
- Repository 層 API 文檔
- 更新 `docs/26-API-接口詳細文檔.md`

#### 用戶指南

用戶指南更新（帳戶管理用戶指南）[⏳待開始]
- 賬戶管理操作指南
- 組織管理操作指南
- 團隊管理操作指南
- 排班管理操作指南
- 權限說明文檔

#### 開發文檔

開發文檔更新[⏳待開始]
- 架構設計文檔更新
- 數據模型文檔更新
- RLS 策略文檔更新（參考 `docs/09-安全與-RLS-權限矩陣.md` 和 `docs/50-RLS策略開發指南.md`）

---

## 📜 開發歷程記錄

### 2025-01-15：核心功能完成

- ✅ **數據層與服務層完成**：完成 4 個 Repository 和 4 個 Service
- ✅ **頁面組件開發完成**：完成 23 個頁面組件
- ✅ **RLS 權限驗證完成**：完成 4 張表的 RLS 策略
- ✅ **系統評估與優化**：完成架構評估、違規修復、RLS 遞歸問題修復
- ✅ **部分單元測試**：完成 AccountService 和 TeamService 單元測試

### 待完成階段

- ⏳ **測試覆蓋率補齊**：補齊 Service 層、Repository 層、組件層測試
- ⏳ **文檔補齊**：API 文檔、用戶指南、開發文檔

---

## 📦 應該要交付的

### 已完成交付

1. **數據層與服務層**：
   - ✅ 完整的 Repository 層（4 個 Repository）
   - ✅ 完整的 Service 層（4 個 Service）
   - ✅ 完整的數據模型層

2. **頁面組件**：
   - ✅ 23 個頁面組件全部完成
   - ✅ 賬戶管理、用戶管理、組織管理、Bot 管理、團隊管理、排班管理

3. **權限與安全**：
   - ✅ RLS 權限驗證（4 張表）
   - ✅ 使用 SECURITY DEFINER 函數解決遞歸查詢問題

4. **系統優化**：
   - ✅ 架構評估和改進
   - ✅ 架構違規修復
   - ✅ Bot 賬戶區分機制
   - ✅ 模型結構清理

5. **測試**：
   - ✅ AccountService 單元測試
   - ✅ TeamService 單元測試

### 待交付

1. **測試**：
   - ⏳ OrganizationScheduleService 單元測試
   - ⏳ OrganizationMemberService 單元測試
   - ⏳ Repository 層單元測試（4 個 Repository）
   - ⏳ 頁面組件單元測試（23 個組件）
   - ⏳ 集成測試
   - ⏳ E2E 測試

2. **文檔**：
   - ⏳ API 文檔更新
   - ⏳ 用戶指南更新
   - ⏳ 開發文檔更新

### 交付標準

- **功能完整性**：所有核心功能必須可用
- **代碼質量**：通過類型檢查、代碼檢查、構建檢查
- **測試覆蓋率**：Service 層 ≥80%，Repository 層 ≥80%，Component 層 ≥70%
- **文檔完整性**：API 文檔、用戶指南必須完整

---

## 📝 備註

### 下一步行動

1. **優先級 1（高）**：補齊 Service 層單元測試
   - OrganizationScheduleService 單元測試
   - OrganizationMemberService 單元測試

2. **優先級 2（中）**：補齊 Repository 層單元測試
   - 4 個 Repository 的單元測試

3. **優先級 3（中）**：補齊組件單元測試
   - 關鍵組件優先（AccountListComponent, AccountFormComponent, OrganizationListComponent）

4. **優先級 4（低）**：撰寫集成測試和 E2E 測試
   - 關鍵流程的集成測試
   - 關鍵流程的 E2E 測試

5. **優先級 5（低）**：補齊文檔
   - API 文檔更新
   - 用戶指南更新

### 已知問題

1. **測試覆蓋率不足**：目前只有 AccountService 和 TeamService 有單元測試，其他 Service 和所有組件都沒有測試
2. **文檔缺失**：API 文檔和用戶指南尚未更新，缺少賬戶系統相關內容
3. **E2E 測試缺失**：沒有端到端測試，無法驗證完整流程

### 相關代碼位置

- **核心服務**：`src/app/shared/services/account/`
  - `account.service.ts` - 帳戶管理服務
  - `team.service.ts` - 團隊管理服務
- **Repository 層**：`src/app/core/infra/repositories/`
  - `account.repository.ts` - 帳戶 Repository
  - `team.repository.ts` - 團隊 Repository
  - `team-member.repository.ts` - 團隊成員 Repository
  - `organization-schedule.repository.ts` - 組織排班 Repository
- **數據模型**：`src/app/shared/models/account.models.ts`
- **頁面組件**：`src/app/routes/accounts/`
  - `list/account-list.component.ts` - 帳戶列表
  - `detail/account-detail.component.ts` - 帳戶詳情
  - `teams/team-list.component.ts` - 團隊列表
  - `teams/team-detail.component.ts` - 團隊詳情

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [安全與 RLS 權限矩陣](./09-安全與-RLS-權限矩陣.md)
- [RLS 策略開發指南](./50-RLS策略開發指南.md)
- [API 接口詳細文檔](./26-API-接口詳細文檔.md)
- [測試指南](./31-測試指南.md)

---

## 📊 統計資訊

**總任務數**：約 85 個任務  
**已完成**：約 55 個任務（65%）  
**進行中**：約 0 個任務（0%）  
**待開始**：約 30 個任務（35%）

**完成度分析**：
- 數據層：✅ 100%（4/4 任務）
- 服務層：✅ 100%（4/4 任務）
- 頁面組件：✅ 100%（23/23 任務）
- RLS 策略：✅ 100%（4/4 任務）
- 系統評估：✅ 100%（6/6 任務）
- 測試：🚧 8%（2/25 任務）
- 文檔：⏳ 0%（0/3 任務）

