> **📌 重要提示**：
> - 基礎開發規範已遷移至 `.cursor/rules/` 目錄，這些規則會自動應用於 Cursor IDE 的 AI 功能
> - 模組特定規範請參考各模組目錄下的 `AGENTS.md` 文件
> - 詳細規範請參考對應的規則文件

## 📋 Cursor 規則文件

### 核心開發規範
- [TypeScript 類型安全](./.cursor/rules/typescript.mdc) - TypeScript 類型安全與最佳實踐
- [Angular 20 最佳實踐](./.cursor/rules/angular.mdc) - Angular 20 現代語法與 Signals
- [Angular 20 現代化特性](./.cursor/rules/modern-angular.mdc) - Signal Inputs/Outputs、Signal Queries 等新特性
- [共享模組優先使用](./.cursor/rules/shared-imports.mdc) - SHARED_IMPORTS 使用規範

### 架構與設計規範
- [分層架構](./.cursor/rules/architecture.mdc) - 分層架構與依賴關係
- [Git-like 分支模型](./.cursor/rules/git-model.mdc) - 分支模型與版本控制

### 代碼質量規範
- [代碼質量](./.cursor/rules/code-quality.mdc) - 代碼質量與最佳實踐
- [代碼檢查](./.cursor/rules/linting.mdc) - ESLint 代碼檢查規範
- [代碼格式化](./.cursor/rules/formatting.mdc) - Prettier 格式化規範
- [樣式規範](./.cursor/rules/styling.mdc) - Stylelint 和 Less 樣式規範
- [錯誤處理](./.cursor/rules/error-handling.mdc) - 錯誤處理與狀態管理
- [API 設計](./.cursor/rules/api-design.mdc) - API 設計與 Repository 模式
- [安全規範](./.cursor/rules/security.mdc) - 安全規範與最佳實踐
- [測試規範](./.cursor/rules/testing.mdc) - 測試規範與覆蓋率要求（Karma/Jasmine）
- [可訪問性](./.cursor/rules/accessibility.mdc) - 可訪問性規範（WCAG 2.1 AA）

### 開發工具規範
- [Git 工作流](./.cursor/rules/git-workflow.mdc) - Husky、lint-staged 和 Git 工作流
- [構建部署](./.cursor/rules/build-deploy.mdc) - 構建腳本、部署和性能分析
- [依賴管理](./.cursor/rules/dependency-management.mdc) - Yarn 包管理器規範
- [主題定制](./.cursor/rules/theming.mdc) - ng-alain 主題定制規範
- [性能優化](./.cursor/rules/performance.mdc) - 性能監控和優化規範

### 模組特定規範
- [Shared 模組規範](./.cursor/rules/shared-specific.mdc) - Shared 模組特定規範
- [Routes 模組規範](./.cursor/rules/routes-specific.mdc) - Routes 模組特定規範
- [Layout 模組規範](./.cursor/rules/layout-specific.mdc) - Layout 模組特定規範
- [Core 模組規範](./.cursor/rules/core-specific.mdc) - Core 模組特定規範

### 工具使用規範
- [MCP 工具](./.cursor/rules/mcp-tools.mdc) - MCP 工具使用規範

## 📝 模板文件

- [Component 模板](./.cursor/templates/component.mdc) - Angular Standalone Component 模板
- [Service 模板](./.cursor/templates/service.mdc) - Angular Service 模板（使用 Signals）

---

## 🔄 保留在 AGENTS.md 的內容

以下內容保留在 AGENTS.md 中，作為高層次的架構決策和參考：

**架構理解**：
  - **Git-like 分支模型**：系統採用 Git-like 分支模型，包含主分支、組織分支、PR 機制（參考 `docs/27-完整架構流程圖.mermaid.md`, `docs/28-架構審查報告.md`）
  - **51 張資料表架構**：系統共包含 51 張資料表，分為 11 個模組（參考 `docs/30-0-完整SQL表結構定義.md`）
  - **核心設計原則**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步（即時同步至主分支）、活動記錄（集中記錄）、文件管理（版本控制、縮圖、軟刪除）

---

## 📚 相關文檔

### 核心文檔
- [文檔索引](./docs/README.md) - 完整文檔導航
- [開發作業指引](./docs/00-開發作業指引.md) - 開發規範與流程（已更新新架構規範）
- [快速開始指南](./docs/32-快速開始指南.md) - 環境設定與啟動
- [專案結構說明](./docs/01-專案結構說明.md) - 專案結構概覽（已更新新架構說明）

### 資料庫架構文檔
- [資料表清單總覽](./docs/30-資料表清單總覽.md) - 資料表清單（51 張表） ⭐⭐⭐⭐⭐
- [30-0-完整SQL表結構定義.md](./docs/30-0-完整SQL表結構定義.md) - **完整 SQL 表結構定義（51 張表）** ⭐⭐⭐⭐⭐
- [資料模型對照表](./docs/34-資料模型對照表.md) - 資料模型對照

### 開發指南
- [SHARED_IMPORTS 使用指南](./docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發工作流程](./docs/35-開發工作流程.md) - 工作流程規範
- [錯誤處理指南](./docs/37-錯誤處理指南.md) - 錯誤處理規範
- [測試指南](./docs/38-測試指南.md) - 測試實踐

### 架構文檔
- [系統架構思維導圖](./docs/10-系統架構思維導圖.mermaid.md) - 系統架構總覽
- [27-完整架構流程圖.mermaid.md](./docs/27-完整架構流程圖.mermaid.md) - **完整架構流程圖（Git-like 分支模型）** ⭐⭐⭐⭐⭐
- [28-架構審查報告.md](./docs/28-架構審查報告.md) - **架構審查報告（生產就緒版）** ⭐⭐⭐⭐⭐
- [帳戶層流程圖](./docs/13-帳戶層流程圖.mermaid.md) - 帳戶層架構（已更新 Git-like 分支模型）
- [重構後結構樹](./docs/04-重構後結構樹.md) - 專案結構樹
- [元件模組視圖](./docs/19-元件模組視圖.mermaid.md) - 前端架構
- [實體關係圖](./docs/12-實體關係圖.mermaid.md) - 資料庫 ER 圖
- [Supabase 架構流程圖](./docs/11-Supabase架構流程圖.mermaid.md) - Supabase 架構

### 快速參考
- [快速參考卡片](./docs/49-快速參考卡片.md) - 常用命令和代碼片段
- [常見錯誤預防指南](./docs/50-常見錯誤預防指南.md) - 錯誤預防
- [詞彙表](./docs/42-詞彙表.md) - 專案術語說明
- [狀態枚舉值定義](./docs/43-狀態枚舉值定義.md) - 狀態定義

### 開發脈絡文檔（FYI）
- [開發脈絡索引](./docs/fyi.md) - 完整開發脈絡文檔索引
- [架構說明](./docs/fyi-architecture.md) - 系統架構設計理念、模組拆分、技術架構
- [開發脈絡](./docs/fyi-development.md) - 技術選型、設計決策、權衡取捨
- [上下文脈絡](./docs/fyi-context.md) - Domain 用語、業務背景、跨模組知識
- [歷史紀錄](./docs/fyi-history.md) - 版本演進、重大決策、改動歷史
- [問題與挑戰](./docs/fyi-challenges.md) - 開發過程中的問題和解決方案
- [性能優化](./docs/fyi-performance.md) - 性能優化策略和指標記錄

---

**最後更新**：2025-01-15  
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）  
**維護者**：開發團隊
