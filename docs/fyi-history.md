# 歷史紀錄 (FYI - History)

> 參考：[@fyi.md](./fyi.md)

記錄專案的時間線：版本演進、重大改動、里程碑紀錄、技術重構歷史等。

---

## 📅 時間線總覽

### 2025-01-15
- ✅ 實施階段 1 - 權限服務模組（core/permissions/）
- ✅ 文檔一致性更新 v2.0

### 2025-11-14
- ✅ Supabase 與 @delon/auth 整合
- ✅ 註冊功能改為 Supabase Auth，移除手機號登入
- ✅ 移除社交登入功能（其他登入方式、Auth0）
- ✅ 項目結構重構規劃

---

## 🏷️ 版本演進

### v20.1.0 (當前版本)
- **技術棧**：Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.0.x + Supabase
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

- [開發脈絡記錄](./fyi-development.md) - 詳細的開發決策記錄
- [架構說明](./fyi-architecture.md) - 系統架構設計
- [上下文](./fyi-context.md) - Domain 用語和業務背景
- [PRD 文檔](./PRD.md) - 產品需求文檔
- [完整架構流程圖](./27-完整架構流程圖.mermaid.md) - 系統架構圖
- [架構審查報告](./28-架構審查報告.md) - 架構設計說明

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
