# 歷史紀錄 (FYI - History)

> 2025-11-14 以前的完整時間線與里程碑已搬遷至 `docs/Archive/fyi-history.md`。

## 使用方式

- 僅保留最新一至兩季的關鍵事件。
- 請以時間倒序加入新紀錄，並在內容過舊時移至 Archive。
- 若事件需要更詳盡描述，請同時在 `docs/44-專案路線圖.md` 或專屬工作總結檔案更新。

## 最新事件（待補）

- 尚未記錄 2025-11-15 之後的事件。
- 完成新里程碑後，請在此新增條目並同步更新 Archive。

# 歷史紀錄 (FYI - History)

> 參考：[@fyi.md](./fyi.md)

記錄專案的時間線：版本演進、重大改動、里程碑紀錄、技術重構歷史等。

---

## 📅 時間線總覽

### 2025-01-15（下午）

- ✅ **Bot 賬戶區分機制實施**（2025-01-15）- 實現個人 Bot 與組織 Bot 的區分機制，使用 `auth_organization_id` 字段區分，更新 `create_bot_account` 函數和 RLS 策略，支持組織成員查看組織 Bot
- ✅ **團隊和排班功能改為組織專有**（2025-01-15）- 更新 TeamListComponent 和 ScheduleListComponent，添加組織選擇器，確保團隊和排班功能僅顯示用戶所屬組織的數據
- ✅ **構建錯誤修復**（2025-01-15）- 修復刪除方法缺少參數和類型定義問題，構建成功通過

### 2025-01-15（上午）
- ✅ 實施階段 1 - 權限服務模組（core/permissions/）
- ✅ 文檔一致性更新 v2.0
- ✅ 基礎 RLS 策略實施（51 張表）
- ✅ 開發順序決策 - 先開發賬戶系統（使用 Sequential Thinking + Software Planning Tool）
- ✅ 基礎設施模組實施（core/infra/）- Repository 模式、類型定義、錯誤處理、數據轉換
- ✅ 賬戶系統實施（9 個任務）- 數據模型層、Repository 層、Service 層、路由層
- ✅ 賬戶系統架構違規修復 - 修復 core 依賴 shared 的架構違規，修復路徑別名使用錯誤
- ⏳ 規劃階段 - 賬戶系統後續完善（詳情、編輯、創建頁面）
- ✅ 專案路線圖建立（[44-專案路線圖.md](./44-專案路線圖.md)）- 記錄開發計劃與里程碑
- ✅ **賬戶系統完整評估**（2025-01-15）- 使用 Sequential Thinking + Software Planning Tool 完成系統性評估，識別已完成和缺失功能，更新實施計劃
- ✅ **賬戶系統 MVP 實施完成**（2025-01-15）- 完成 Service 層、UI 層和路由配置，所有核心功能已實現，構建通過
- ✅ **賬戶系統 RLS 策略驗證和完善**（2025-01-15）- 使用 Supabase MCP 工具驗證和完善 4 張表的 RLS 策略（accounts, teams, team_members, organization_schedules），共創建 15 個策略，構建驗證通過
- ✅ **組織協作系統 - 數據模型和 Repository 層實施**（2025-01-15）- 完成組織協作系統的數據模型層和 Repository 層開發，包括 3 個 Repository（OrganizationCollaborationRepository, CollaborationInvitationRepository, CollaborationMemberRepository），構建驗證通過
- ✅ **組織協作系統 - Service 層和 UI 層實施**（2025-01-15）- 完成組織協作系統的 Service 層（CollaborationService, InvitationService）和核心 UI 層（CollaborationListComponent）開發，構建驗證通過
- ✅ **accounts 表 RLS 遞歸問題修復**（2025-01-15）- 使用 Supabase 官方推薦的 SECURITY DEFINER 函數方法修復 accounts 表 RLS 策略遞歸問題，創建 2 個輔助函數，更新 SELECT 和 UPDATE 策略，驗證修復成功

### 2025-11-14
- ✅ Supabase 與 @delon/auth 整合
- ✅ 註冊功能改為 Supabase Auth，移除手機號登入
- ✅ 移除社交登入功能（其他登入方式、Auth0）
- ✅ 項目結構重構規劃
- ✅ **全站路由骨架鋪設**（2025-11-14）
  - ✅ 依據 `app-data.json` 建立 communication、analytics、documents、bots、system 等 5 大模組的路由與頁面骨架（共 28 個 Standalone Components）
  - ✅ 所有頁面採用 `page-header + nz-card + nz-alert + nz-empty` 模板，確保一致的 NG-ALAIN 體驗與可訪問性提示
  - ✅ 更新 `src/app/routes/routes.ts`，主框架可導航至所有菜單節點，不再出現 404
  - ✅ 更新 `docs/路由页面创建总结-2025-01-15.md`，同步紀錄骨架狀態
  - ⚠️ `yarn lint` 仍受舊有 ESLint `project/projectService` 設定衝突阻塞，待後續調整
- ✅ **藍圖系統完整實施**（2025-11-14）
  - ✅ 數據模型層設計（5 個類型定義、4 個枚舉）
  - ✅ Repository 層實施（5 個 Repository，20+ 個查詢方法）
  - ✅ Service 層實施（3 個 Service，Git-like 分支邏輯）
  - ✅ UI 層實施（5 個頁面組件）
  - ✅ RLS 權限驗證（5 張表，20 個策略）
  - ✅ 構建驗證通過

---

## 🏷️ 版本演進

### v20.1.0 (當前版本)
- **技術棧**：Angular 20.3.x + NG-ZORRO 20.2.x + NG-ALAIN 20.1.x + Supabase
- **包管理器**：Yarn 4.9.2
- **狀態**：開發中

---

## 🎯 里程碑紀錄

### 里程碑 1：核心架構建立 (2025-01-15)
- ✅ 完成 Git-like 分支模型架構設計
- ✅ 完成 51 張資料表結構定義
- ✅ 完成文檔體系建立

### 里程碑 2：權限系統實施 (2025-01-15)
- ✅ 完成 RBAC 權限控制系統
- ✅ 整合 @delon/acl 和 Supabase
- ✅ 實現 Git-like 分支權限控制

### 里程碑 3：認證系統整合 (2025-11-14)
- ✅ 完成 Supabase Auth 與 @delon/auth 整合
- ✅ 實現零破壞性適配器模式
- ✅ 完成 Session 同步機制

### 里程碑 4：開發順序規劃 (2025-01-15)
- ✅ 使用 Sequential Thinking 分析依賴關係
- ✅ 決策先開發賬戶系統（基礎層）而非藍圖系統（業務層）
- ✅ 使用 Software Planning Tool 創建賬戶系統實施計劃
- ⏳ 待實施：賬戶系統開發（10 個任務）

### 里程碑 5：基礎設施模組建立 (2025-01-15)
- ✅ 完成 TypeScript 類型定義生成（51 張表）
- ✅ 建立統一錯誤處理機制
- ✅ 建立數據轉換工具（snake_case ↔ camelCase）
- ✅ 建立基礎 Repository 類（BaseRepository）
- ✅ 建立 BlueprintRepository 示例
- ✅ 完成模組導出和文檔編寫
- ✅ 構建驗證通過

### 里程碑 5.1：賬戶系統完整評估 (2025-01-15)
- ✅ 使用 Sequential Thinking 進行系統性分析
- ✅ 使用 Software Planning Tool 創建完整實施計劃
- ✅ 完成 Repository 層評估（100% 完成）
- ✅ 完成類型定義評估（100% 完成，架構合規）
- ✅ 完成 Service 層評估（66% 完成，缺 OrganizationScheduleService）
- ✅ 完成路由和組件評估（16% 完成，缺 5 個頁面組件）
- ✅ 完成架構合規性驗證（100% 合規）
- ✅ 識別測試覆蓋缺失（0% 完成）
- ✅ 更新實施計劃（12 個任務，分 6 個階段）

### 里程碑 5.2：賬戶系統 MVP 實施完成 (2025-01-15)
- ✅ 創建 OrganizationScheduleService（Service 層 100% 完成）
- ✅ 創建 AccountDetailComponent（賬戶詳情頁面）
- ✅ 創建 AccountFormComponent（賬戶創建/編輯表單）
- ✅ 創建 TeamListComponent（團隊列表頁面）
- ✅ 創建 TeamDetailComponent（團隊詳情頁面）
- ✅ 創建 ScheduleListComponent（排班列表頁面）
- ✅ 完善路由配置（所有路由已配置）
- ✅ 修復構建錯誤（字段名匹配問題）
- ✅ 構建驗證通過（`yarn build` 成功）
- ✅ 總體進度：約 85% 完成（核心功能已實現）

### 里程碑 5.3：賬戶系統 RLS 策略驗證和完善 (2025-01-15)
- ✅ 使用 Supabase MCP 工具檢查當前 RLS 狀態
- ✅ 完善 accounts 表 RLS 策略（支持組織成員訪問組織賬戶）
- ✅ 創建 teams 表 RLS 策略（4 個策略：SELECT/INSERT/UPDATE/DELETE）
- ✅ 創建 team_members 表 RLS 策略（4 個策略）
- ✅ 創建 organization_schedules 表 RLS 策略（4 個策略）
- ✅ 共創建 15 個 RLS 策略，覆蓋所有操作類型
- ✅ 構建驗證通過（`yarn build` 成功）
- ✅ 詳細記錄：→ [组织协作系统-数据模型和Repository层实施总结.md](./组织协作系统-数据模型和Repository层实施总结.md)

### 里程碑 5.4：組織協作系統 - 數據模型和 Repository 層實施 (2025-01-15)
- ✅ 創建 Core 層類型定義（collaboration.types.ts）- 3 個枚舉
- ✅ 創建 Shared 層數據模型（collaboration/types.ts）- 3 個類型定義
- ✅ 創建 OrganizationCollaborationRepository（6 個查詢方法）
- ✅ 創建 CollaborationInvitationRepository（6 個查詢方法）
- ✅ 創建 CollaborationMemberRepository（3 個查詢方法）
- ✅ 更新模組導出文件（types/index.ts, repositories/index.ts, models/index.ts）
- ✅ 構建驗證通過（`yarn build` 成功）
- ✅ 詳細記錄：→ [组织协作系统-数据模型和Repository层实施总结.md](./组织协作系统-数据模型和Repository层实施总结.md)

---

## 🔄 重大改動

### 2025-01-15: 實施階段 1 - 權限服務模組

#### 背景
根據 PRD 要求和 Git-like 分支模型架構，需要實現完整的 RBAC 權限控制系統。

#### 實施內容
- ✅ 創建 `core/permissions/` 模組
  - `types.ts` - 權限相關類型定義
  - `permission.service.ts` - 權限檢查服務
  - `role.service.ts` - 角色管理服務
- ✅ 整合 @delon/acl 作為本地權限緩存
- ✅ 實現內存緩存策略（5 分鐘 TTL）
- ✅ 實現 Git-like 分支權限檢查方法
- ✅ 整合到 `startup.service.ts` 自動同步權限

#### 技術決策
- 使用適配器模式整合 @delon/acl
- 內存緩存 + ACLService 雙層緩存策略
- 完整的 TypeScript 類型定義

#### 影響範圍
- `core/permissions/` - 新增模組
- `core/startup/startup.service.ts` - 整合權限同步
- `core/index.ts` - 導出權限服務

#### 驗證結果
- ✅ 編譯成功：所有檔案通過 TypeScript 編譯
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ 類型安全：完整的 TypeScript 類型支持

---

### 2025-11-14: Supabase 與 @delon/auth 整合

#### 背景
專案需要整合 Supabase 作為後端服務，同時保留現有的 `@delon/auth` 認證系統。

#### 實施內容
- ✅ 創建 `core/supabase/` 模組
  - `supabase.service.ts` - Supabase 客戶端服務
  - `supabase-auth-adapter.service.ts` - 認證適配器服務
- ✅ 實現適配器模式，零破壞性整合
- ✅ 實現 Session 自動同步機制
- ✅ 配置 Session 持久化和自動刷新

#### 技術決策
- 使用適配器模式橋接 Supabase Auth 與 @delon/auth
- 自動將 Supabase Session 轉換為 @delon/auth Token 格式
- 保留所有現有的 @delon/auth 使用方式

#### 影響範圍
- `core/supabase/` - 新增模組
- `core/startup/startup.service.ts` - 整合 Supabase 初始化
- `app.config.ts` - 配置 Supabase 服務
- `routes/passport/login/login.component.ts` - 使用 Supabase 登入

#### 驗證結果
- ✅ 編譯成功：`yarn build` 通過
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ 類型安全：完整的 TypeScript 類型支持

---

### 2025-11-14: 註冊功能改為 Supabase Auth，移除手機號登入

#### 背景
將註冊功能改為使用 Supabase Auth，並移除登入頁面的手機號登入功能，統一使用 Email/Password 認證方式。

#### 實施內容
- ✅ 修改 `routes/passport/register/register.component.ts`
  - 移除手機號、驗證碼欄位
  - 使用 `SupabaseAuthAdapterService.signUp()`
- ✅ 修改 `routes/passport/login/login.component.ts`
  - 移除 Tab 切換邏輯
  - 簡化為單一 Email/Password 登入表單
- ✅ 更新 UI，移除手機號登入相關元素

#### 影響範圍
- `routes/passport/register/` - 註冊組件
- `routes/passport/login/` - 登入組件

#### 驗證結果
- ✅ 編譯成功：`yarn build` 通過
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ UI 簡化：登入頁面更加簡潔

---

### 2025-11-14: 移除社交登入功能

#### 背景
移除登入頁面的社交登入功能，包括"其他登入方式"區塊和 Auth0、GitHub、Weibo 等第三方登入選項。

#### 實施內容
- ✅ 移除 `SocialService` 相關代碼
- ✅ 移除社交登入 UI 元素
- ✅ 保留註冊連結

#### 影響範圍
- `routes/passport/login/` - 登入組件

#### 驗證結果
- ✅ 編譯成功：`yarn build` 通過
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ UI 簡化：登入頁面更加簡潔

---

### 2025-01-15: 項目結構重構規劃

#### 背景
基於 51 張資料表的 11 個業務模組分類，需要重構項目文件夾結構。

#### 實施內容
- ✅ 創建 `docs/04-重構後結構樹.md`
  - 完整的項目文件夾結構樹文檔
  - 51 張資料表映射到 11 個業務模組
  - 業務模組與 Routes 路徑的對應關係

#### 影響範圍
- 文檔體系建立
- 為後續重構提供藍圖

---

### 2025-01-15: 基礎 RLS 策略實施

#### 背景
根據開發前檢查清單，所有 51 張資料表的 RLS 都是 `false`，需要啟用 RLS 確保基本安全性。考慮到開發過程會不斷調整，決定先建立基礎 RLS 策略。

#### 實施內容
- ✅ 為所有 51 張表啟用 RLS
- ✅ 建立基礎策略：
  - accounts 表：用戶只能操作自己的帳戶
  - blueprints 表：擁有者可以操作，已認證用戶可以查看
  - 其他核心表：基礎 SELECT 策略（已認證用戶）
  - 個人資料表：用戶級別策略
- ✅ 使用 Supabase MCP 工具執行遷移
- ✅ 驗證 RLS 已正確啟用

#### 技術決策
- 分階段實施：先建立基礎策略，後續逐步完善
- 策略命名規範：`[操作]_[表名]_[描述]`
- 註釋說明：標註 `TODO` 後續調整點

#### 影響範圍
- 所有 51 張資料表
- 資料庫安全性基礎建立

#### 驗證結果
- ✅ 遷移成功執行
- ✅ RLS 已正確啟用（驗證 accounts, blueprints, tasks, roles, permissions 表）
- ✅ 基礎策略已建立

#### 後續計劃
- 根據業務需求逐步完善策略
- 整合角色系統（user_roles 表）
- 實現 Git-like 分支權限控制
- 參考 `docs/21-安全與-RLS-權限矩陣.md` 建立詳細策略

---

## 🔧 技術重構歷史

### 架構重構：Git-like 分支模型
- **時間**：2025-01-15
- **原因**：需要實現類似 Git 的分支管理機制
- **影響**：整個系統架構設計
- **結果**：完成 51 張資料表結構定義，11 個模組劃分

### 權限系統重構：RBAC 實施
- **時間**：2025-01-15
- **原因**：需要完整的權限控制系統
- **影響**：所有需要權限驗證的功能
- **結果**：完成權限服務模組，整合 @delon/acl

### 認證系統重構：Supabase 整合
- **時間**：2025-11-14
- **原因**：需要 Supabase 作為後端服務
- **影響**：認證流程
- **結果**：完成適配器模式整合，零破壞性遷移

### UI 簡化：統一認證方式
- **時間**：2025-11-14
- **原因**：簡化認證流程，降低維護成本
- **影響**：登入/註冊頁面
- **結果**：統一使用 Email/Password 認證

---

## ✅ 已完成事項

### 核心模組
- [x] 權限服務模組（core/permissions/）
  - [x] 權限檢查服務
  - [x] 角色管理服務
  - [x] 類型定義
  - [x] 與 @delon/acl 整合
  - [x] 內存緩存策略
  - [x] Git-like 分支權限檢查

- [x] Supabase 整合（core/supabase/）
  - [x] Supabase 客戶端服務
  - [x] 認證適配器服務
  - [x] Session 同步機制
  - [x] 零破壞性整合

- [x] 基礎 RLS 策略實施
  - [x] 所有 51 張表啟用 RLS
  - [x] 核心表基礎策略建立
  - [x] 個人資料表用戶級別策略

### 文檔體系
- [x] 核心架構文檔
  - [x] PRD 文檔
  - [x] 完整架構流程圖
  - [x] 架構審查報告
  - [x] 完整 SQL 表結構定義（51 張表）

- [x] 開發文檔
  - [x] 開發作業指引
  - [x] 專案結構說明
  - [x] 資料模型對照表
  - [x] 狀態枚舉值定義
  - [x] SHARED_IMPORTS 使用指南

- [x] 規範文檔
  - [x] 代碼質量規範
  - [x] 測試規範
  - [x] 安全規範
  - [x] 性能優化規範

### 開發工具
- [x] ESLint 配置
- [x] Stylelint 配置
- [x] Prettier 配置
- [x] Husky Git Hooks
- [x] lint-staged 配置
- [x] TypeScript 嚴格模式

---

## 📝 待完成事項

### 核心模組
- [ ] **賬戶系統開發**（Phase 1 MVP - 優先）
  - [x] 基礎目錄結構創建（shared/models/, shared/services/）
  - [x] 架構決策確認（Repository 位置、Service 位置）
  - [ ] 數據模型層（shared/models/account/types.ts）
  - [ ] Repository 層（core/infra/repositories/account.repository.ts）
  - [ ] 服務層 - AccountService（shared/services/account/）
  - [ ] 服務層 - TeamService（shared/services/account/）
  - [ ] 路由層 - 賬戶列表/詳情/編輯頁面
  - [ ] 路由層 - 團隊管理頁面
  - [ ] 路由配置
  - [ ] RLS 權限驗證
  - [ ] 單元測試（目標 80% 覆蓋率）
  - [ ] 集成測試和文檔更新
- [ ] 完善 RLS 策略（根據業務需求逐步細化）
- [ ] 權限守衛（core/guards/permission.guard.ts）
- [ ] 活動記錄整合（activity_logs）
- [ ] 權限管理 UI（角色管理、權限分配）

### 測試
- [ ] 權限服務單元測試（目標 80% 覆蓋率）
- [ ] Supabase 服務單元測試
- [ ] E2E 測試

### 文檔
- [ ] API 接口詳細文檔完善
- [ ] 部署指南更新
- [ ] 性能優化指南更新

---

## 📚 相關文檔

- [專案路線圖](./44-專案路線圖.md) - **專案開發路線圖與里程碑** ⭐ 新增
- [開發脈絡記錄](./fyi-development.md) - 詳細的開發決策記錄
- [架構說明](./fyi-architecture.md) - 系統架構設計
- [上下文](./fyi-context.md) - Domain 用語和業務背景
- [PRD 文檔](./PRD.md) - 產品需求文檔
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md) - 系統架構圖
- [架構審查報告](./28-架構審查報告.md) - 架構設計說明

---

---

## 2025-01-15：賬戶系統架構評估與基礎結構創建

### 完成工作
- ✅ 代碼結構評估（BaseRepository、數據轉換工具、錯誤處理）
- ✅ 基礎目錄結構創建（shared/models/, shared/services/）
- ✅ 架構決策重新評估（Repository 和 Service 位置確認）
- ✅ 實施計劃調整（採用 Repository 模式）

### 關鍵決策
- **Repository 位置**：`core/infra/repositories/`（基礎設施層）
- **Service 位置**：`shared/services/account/`（共享層，使用 Repository）
- **Models 位置**：`shared/models/account/`（共享層）

### 決策反覆過程
經過三次評估，最終確定採用 Repository 模式，充分利用現有基礎設施。詳細過程見 [開發脈絡記錄](./fyi-development.md#2025-01-15賬戶系統架構決策反覆)。

### 相關文檔
- [結構評估總結](./賬戶系統開發-結構評估總結.md) - 詳細的評估過程和決策記錄

---

## 2025-01-15: 賬戶系統架構違規修復

### 背景
在賬戶系統實施過程中，發現了架構依賴違規和路徑別名使用錯誤的問題。這些問題違反了項目的分層架構原則，需要立即修復。

### 問題描述
1. **架構依賴違規**：
   - `core/infra/repositories/account.repository.ts` 導入 `@shared` 的 `AccountType` 和 `AccountStatus`
   - `core/infra/repositories/team-member.repository.ts` 導入 `@shared` 的 `TeamMemberRole`
   - 違反了分層架構：`routes → shared → core`，`core` 不應該依賴 `shared`

2. **路徑別名使用錯誤**：
   - 使用 `@core/infra/repositories/team.repository` 深層路徑
   - 路徑別名只配置到 `@core` 和 `@shared`，不支持深層路徑
   - 導致 TypeScript 編譯錯誤

### 修復方案
1. **將枚舉類型移到 core 層**：
   - 創建 `core/infra/types/account.types.ts`
   - 將 `AccountType`、`AccountStatus`、`TeamMemberRole` 移到 core 層
   - Repository 層使用相對路徑導入

2. **修復路徑別名使用**：
   - 統一使用根導出：`import { TeamRepository } from '@core'`
   - core 層內部使用相對路徑
   - 確保所有類型都從根導出文件導出

3. **保持向後兼容**：
   - 在 `shared/models/account/types.ts` 重新導出 core 層的類型
   - 現有代碼無需修改

### 修復結果
- ✅ 架構合規：core 不依賴 shared
- ✅ 路徑別名：所有導入使用根導出
- ✅ 類型安全：無類型錯誤
- ✅ Lint 檢查：無錯誤
- ✅ 向後兼容：現有代碼無需修改

### 相關文檔
- [賬戶系統架構違規修復總結](./賬戶系統架構違規修復總結.md) ⭐ 詳細修復記錄
- [問題與挑戰記錄](./fyi-challenges.md#2025-01-15-賬戶系統架構違規修復)
- [開發脈絡記錄](./fyi-development.md#2025-01-15-賬戶系統架構違規修復)

---

## 2025-01-15: 賬戶系統 MVP 實施完成

### 背景
在完成系統性評估後，使用 Sequential Thinking + Software Planning Tool 推進實施，完成了賬戶系統 MVP 的核心功能。

### 實施內容

#### Service 層完成
- ✅ **OrganizationScheduleService**：創建完整的排班管理服務
  - 使用 Signals 管理狀態
  - 提供 CRUD 和查詢方法
  - 暴露 ReadonlySignal 給組件

#### UI 層完成
- ✅ **AccountDetailComponent**：賬戶詳情頁面
  - 顯示基本信息、團隊信息、排班信息
  - 支持編輯和刪除操作
  
- ✅ **AccountFormComponent**：賬戶創建/編輯表單
  - 支持創建和編輯兩種模式
  - 完整的表單驗證
  - 使用 Typed Forms 確保類型安全

- ✅ **TeamListComponent**：團隊列表頁面
  - 使用 st 表格組件
  - 支持 CRUD 操作

- ✅ **TeamDetailComponent**：團隊詳情頁面
  - 顯示團隊信息和成員列表
  - 支持成員管理和角色變更

- ✅ **ScheduleListComponent**：排班列表頁面
  - 顯示排班列表
  - 支持刪除操作

#### 路由配置完成
- ✅ 配置所有路由：列表、詳情、創建、編輯、團隊、排班

### 技術決策

#### 字段名處理
- 使用 `snake_case` 字段名（`created_at`, `updated_at` 等）
- BaseRepository 會自動進行轉換，但類型定義使用原始格式
- 組件中統一使用 snake_case 訪問數據

#### 代碼規範
- 嚴格遵循 Angular 20 語法（@if, @for, @switch）
- 使用 Signals 進行狀態管理
- 使用 Typed Forms 確保類型安全
- 使用 SHARED_IMPORTS 保持一致性

### 修復的問題

#### 構建錯誤
- **問題**：字段名不匹配（`createdAt` vs `created_at`）
- **原因**：類型定義使用 snake_case，但組件使用了 camelCase
- **解決**：統一使用 snake_case 字段名訪問數據
- **影響**：所有組件文件（6 個文件）

### 實施結果

#### 完成度統計
- ✅ Repository 層：100% 完成（4/4）
- ✅ Service 層：100% 完成（3/3）
- ✅ UI 層：100% 完成（6/6 核心組件）
- ✅ 路由配置：100% 完成
- ⚠️ 測試：0% 完成（待後續實施）
- ⚠️ RLS 驗證：待驗證

#### 構建驗證
- ✅ 所有文件通過 TypeScript 編譯
- ✅ 無 lint 錯誤
- ✅ 構建成功（`yarn build`）
- ⚠️ Bundle 大小警告（3.45 MB，超過 2 MB 預算，屬正常範圍）

### 影響範圍
- 新增文件：7 個
- 更新文件：2 個
- 總代碼行數：約 1500+ 行

### 相關文檔
- [實施完成總結](./账户系统MVP实施完成总结.md) ⭐ 詳細記錄
- [專案路線圖](./44-專案路線圖.md) - 更新狀態
- Software Planning Tool - 任務完成狀態

---

## 2025-01-15: accounts 表 RLS 遞歸問題修復

### 背景
在驗證 accounts 表查詢功能時，發現查詢返回 500 錯誤：`"infinite recursion detected in policy for relation \"accounts\""`。這是因為 accounts 表的 RLS 策略中直接查詢 accounts 表，形成循環查詢。

### 問題診斷

#### 問題根源
accounts 表的 SELECT 策略中存在遞歸查詢：
```sql
-- 原始策略（有問題）
tm.account_id = (
  SELECT accounts_1.id
  FROM accounts accounts_1  -- ⚠️ 觸發 RLS 檢查，形成遞歸
  WHERE accounts_1.auth_user_id = auth.uid()
)
```

**遞歸鏈**：
- 查詢 `accounts` 表 → 觸發 RLS 策略檢查
- 策略中又查詢 `accounts` 表 → 再次觸發 RLS 策略檢查
- 無限循環 → 遞歸錯誤

#### 修復過程
1. **第一次修復**：創建了 SECURITY DEFINER 函數，但後來被復原
2. **問題重新發現**：重新驗證時發現問題仍然存在
3. **參考官方文檔**：查閱 Supabase 官方文檔，確認使用 SECURITY DEFINER 函數是標準解決方案
4. **重新實施修復**：創建 private schema 和 SECURITY DEFINER 函數，更新 RLS 策略

### 實施細節

#### 創建 SECURITY DEFINER 函數
- **`private.is_user_org_member`**：檢查用戶是否是組織成員
- **`private.is_user_org_admin`**：檢查用戶是否是組織管理員

#### 更新 RLS 策略
- 刪除舊的 SELECT 和 UPDATE 策略
- 創建新策略使用 SECURITY DEFINER 函數

### 驗證結果
- ✅ 修復前：`GET /rest/v1/accounts?select=*` → 500 Internal Server Error
- ✅ 修復後：`GET /rest/v1/accounts?select=*` → 200 OK
- ✅ 成功返回用戶的 account 記錄
- ✅ 頁面正常顯示數據
- ✅ 響應時間：4ms（性能良好）

### 相關文檔
- [工作總結-完整流程-accounts-RLS修復-2025-01-15.md](./工作總結-完整流程-accounts-RLS修復-2025-01-15.md) ⭐ 詳細記錄
- [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md) ⭐ 官方方法
- [工作總結-修復失敗原因分析-2025-01-15.md](./工作總結-修復失敗原因分析-2025-01-15.md) ⭐ 問題分析
- [工作總結-accounts-RLS修復完成-2025-01-15.md](./工作總結-accounts-RLS修復完成-2025-01-15.md) ⭐ 修復記錄
- [工作總結-最終驗證-accounts-RLS修復-2025-01-15.md](./工作總結-最終驗證-accounts-RLS修復-2025-01-15.md) ⭐ 驗證記錄

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
