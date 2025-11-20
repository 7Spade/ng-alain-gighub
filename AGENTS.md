> **📌 重要提示**：
> - 基礎開發規範已遷移至 `.cursor/rules/` 目錄，這些規則會自動應用於 Cursor IDE 的 AI 功能
> - **VSCode GitHub Copilot 指引**位於根目錄的 `.copilot-*.md` 檔案（與 `.vscode/settings.json` 整合）
> - **GitHub Copilot 標準指引**位於 `.github/copilot-instructions.md`（GitHub Copilot 自動查找的標準位置）⭐
> - **GitHub Copilot Agent Mode 指引**位於 `.github/agents/` 目錄（供 Workspace/Agent Mode 使用）
> - 模組特定規範請參考各模組目錄下的 `AGENTS.md` 文件
> - 詳細規範請參考對應的規則文件
> - **⭐ [Agent 開發指南與限制說明](./docs/43-Agent開發指南與限制說明.md)** - 了解 AI Agent 開發的限制和最佳實踐

## 📂 AI 助手檔案組織結構

本專案的 AI 助手相關檔案分為四個層級，各有不同的用途和目標受眾：

### 0. GitHub Copilot 標準指引 ⭐⭐
位於 `.github/copilot-instructions.md`，這是 GitHub Copilot 自動查找的標準位置（遵循 [GitHub 最佳實踐](https://gh.io/copilot-coding-agent-tips)）：

- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) - **GitHub Copilot 標準指引**
  - 專案願景與架構概述
  - 開發規範與原則（核心四原則、Angular、TypeScript）
  - 認證與權限、測試要求、安全規範
  - 開發工作流程與 Agent 操作限制
  - 完整的文件索引與快速參考連結
  - **用途**：GitHub Copilot 在此專案中自動使用的主要指引檔案

### 1. 根目錄 Copilot 指引（VSCode 整合）⭐
位於專案根目錄的 `.copilot-*.md` 檔案，由 `.vscode/settings.json` 參照，供 VSCode GitHub Copilot 日常開發使用：

- [`.copilot-instructions.md`](./.copilot-instructions.md) - **主要開發指引**
  - 專案概述和技術架構
  - 核心開發原則（常見做法、企業標準、符合邏輯、符合常理）
  - Angular 20 + Signals 規範
  - 開發工作流程和文件參考

- [`.copilot-review-instructions.md`](./.copilot-review-instructions.md) - **程式碼審查指引**
  - 10 大審查檢查清單（架構、型別、Signals、品質、錯誤、安全、效能、測試、文件、格式）
  - 審查流程和建議格式
  - 最佳實踐範例

- [`.copilot-commit-message-instructions.md`](./.copilot-commit-message-instructions.md) - **Commit 訊息規範**
  - Conventional Commits 1.0.0 標準
  - Type/Scope/Subject 規範
  - 正體中文撰寫指引

- [`.copilot-pull-request-description-instructions.md`](./.copilot-pull-request-description-instructions.md) - **PR 描述規範**
  - PR 描述模板和結構
  - 不同類型 PR 的完整範例
  - 檢查清單和格式建議

- [`.copilot-test-instructions.md`](./.copilot-test-instructions.md) - **測試產生指引**
  - Jasmine/Karma 測試框架規範
  - 元件、服務、整合測試範例
  - Signals API 測試方法
  - 覆蓋率要求 (≥ 80%)

### 2. GitHub Agents 目錄（Agent Mode）
位於 `.github/agents/` 目錄，供 GitHub Copilot Workspace 和 Agent Mode 使用：

詳細說明請參考 [.github/agents/README.md](./.github/agents/README.md)

### 3. Cursor 規則目錄（Cursor IDE）
位於 `.cursor/rules/` 目錄，Cursor IDE 會自動載入這些規則：

詳細說明請參考 [.cursor/rules/README.md](./.cursor/rules/README.md)

---

## 📋 快速參考：Cursor 規則文件

詳細規則請參考 [.cursor/rules/README.md](./.cursor/rules/README.md)

### 核心開發規範
- [TypeScript 類型安全](./.cursor/rules/typescript.mdc) - TypeScript 類型安全與最佳實踐
- [Angular 20 最佳實踐](./.cursor/rules/angular.mdc) - Angular 20 現代語法與 Signals
- [Angular 20 現代化特性](./.cursor/rules/modern-angular.mdc) - Signal Inputs/Outputs、Signal Queries 等新特性
- [共享模組優先使用](./.cursor/rules/shared-imports.mdc) - SHARED_IMPORTS 使用規範
- [路徑別名使用](./.cursor/rules/path-aliases.mdc) - 路徑別名使用規範（@core、@shared）

### 架構與設計規範
- [分層架構](./.cursor/rules/architecture.mdc) - 分層架構與依賴關係
- [Git-like 分支模型](./.cursor/rules/git-model.mdc) - 分支模型與版本控制

### 代碼質量規範
- [核心開發原則](./.cursor/rules/development-principles.mdc) ⭐ - **四個核心原則：常見做法、企業標準、符合邏輯、符合常理**
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

---

## 📋 快速參考：GitHub Agents 目錄

詳細說明請參考 [.github/agents/README.md](./.github/agents/README.md)

### 主要指引文件
- [ng-project-agent.md](./.github/agents/ng-project-agent.md) ⭐ - **專案開發代理**
  - 專案核心架構（Git-like 分支模型 + 51 張表）
  - 認證系統整合（Supabase Auth + @delon/auth）
  - SHARED_IMPORTS 模式
  - 完整開發工作流程

- [role.agent.md](./.github/agents/role.agent.md) - **AI 角色定位與回覆原則**
- [role-config.md](./.github/agents/role-config.md) - **System message 快速參考**
- [docs-index.md](./.github/agents/docs-index.md) - **docs/ 目錄索引**
- [copilot-instructions.md](./.github/agents/copilot-instructions.md) - **Copilot 快速提醒**

### 領域專家 Agents（domain/）
- [angular-agent.md](./.github/agents/domain/angular-agent.md) - Angular 開發代理
- [typescript-agent.md](./.github/agents/domain/typescript-agent.md) - TypeScript 開發代理
- [code-quality-agent.md](./.github/agents/domain/code-quality-agent.md) - 代碼質量代理
- [security-agent.md](./.github/agents/domain/security-agent.md) - 安全代理
- [performance-agent.md](./.github/agents/domain/performance-agent.md) - 效能代理
- [testing-agent.md](./.github/agents/domain/testing-agent.md) - 測試代理
- [accessibility-agent.md](./.github/agents/domain/accessibility-agent.md) - 可訪問性代理
- [docs-agent.md](./.github/agents/domain/docs-agent.md) - 文件代理

---

## 🔧 VSCode 設定檔整合

`.vscode/settings.json` 已配置 GitHub Copilot 使用根目錄的指引檔案：

### Copilot 程式碼產生（Line 86-96）
```json
"github.copilot.chat.codeGeneration.instructions": [
  { "text": "術語對照..." },
  { "text": "Always response in #zh-tw." },
  { "file": ".copilot-instructions.md" }  // ← 主要開發指引
]
```

### Copilot 程式碼審查（Line 98-105）
```json
"github.copilot.chat.reviewSelection.instructions": [
  { "text": "Always response in #zh-tw." },
  { "file": ".copilot-review-instructions.md" }  // ← 審查指引
]
```

### Copilot Commit 訊息（Line 107-117）
```json
"github.copilot.chat.commitMessageGeneration.instructions": [
  { "text": "# Use Conventional Commits 1.0.0..." },
  { "text": "請一律使用正體中文..." },
  { "file": ".copilot-commit-message-instructions.md" }  // ← Commit 規範
]
```

### Copilot PR 描述（Line 119-126）
```json
"github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
  { "text": "請一律使用正體中文..." },
  { "file": ".copilot-pull-request-description-instructions.md" }  // ← PR 規範
]
```

### Copilot 測試產生（Line 71-78）
```json
"github.copilot.chat.testGeneration.instructions": [
  { "file": ".copilot-test-instructions.md" },  // ← 測試指引
  { "text": "Always try uniting related tests in a suite." }
]
```

### 使用建議
- **日常開發**：使用根目錄的 `.copilot-*.md` 檔案（VSCode 自動載入）
- **專案規劃**：參考 `.github/agents/` 檔案（Agent Mode 使用）
- **深入規範**：查閱 `.cursor/rules/` 檔案（Cursor IDE 自動載入）

---

## 📝 模板文件

- [Component 模板](./.cursor/templates/component.mdc) - Angular Standalone Component 模板
- [Service 模板](./.cursor/templates/service.mdc) - Angular Service 模板（使用 Signals）

---

## 🔄 保留在 AGENTS.md 的內容

以下內容保留在 AGENTS.md 中，作為高層次的架構決策和參考：

**架構理解**：
  - **Git-like 分支模型**：系統採用 Git-like 分支模型，包含主分支、組織分支、PR 機制（參考 `docs/27-完整架構流程圖.mermaid.md`, `docs/28-架構審查報告.md`）
  - **51 張資料表架構**：系統共包含 51 張資料表，分為 11 個模組（參考 `docs/22-完整SQL表結構定義.md`）
  - **核心設計原則**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步（即時同步至主分支）、活動記錄（集中記錄）、文件管理（版本控制、縮圖、軟刪除）

**相關文檔索引**：
  - 完整文檔索引請參考 [docs/README.md](./docs/README.md)
  - 規則文件說明請參考 [.cursor/rules/README.md](./.cursor/rules/README.md)
  - GitHub Agents 說明請參考 [.github/agents/README.md](./.github/agents/README.md)

**核心開發原則** ⭐：
  - **常見做法**：遵循業界標準做法，參考官方文檔和最佳實踐，保持代碼一致性
  - **企業標準**：代碼結構清晰、職責分離明確、錯誤處理完善、狀態管理規範
  - **符合邏輯**：數據流清晰、命名語義化、條件判斷合理、組件初始化順序正確
  - **符合常理**：功能真正可用、用戶體驗優先、避免過度設計、及時驗證
  - **詳細說明**：參考 [代碼質量規範](./.cursor/rules/code-quality.mdc#core-development-principles-)

---

## 📚 相關文檔

### 核心文檔
- [文檔索引](./docs/README.md) - 完整文檔導航
- [開發作業指引](./docs/00-開發作業指引.md) - 開發規範與流程（已更新新架構規範）
- [快速開始指南](./docs/32-快速開始指南.md) - 環境設定與啟動
- [專案結構說明](./docs/01-專案結構說明.md) - 專案結構概覽（已更新新架構說明）

### 資料庫架構文檔
- [資料表清單總覽](./docs/30-資料表清單總覽.md) - 資料表清單（51 張表） ⭐⭐⭐⭐⭐
- [完整SQL表結構定義](./docs/22-完整SQL表結構定義.md) - **完整 SQL 表結構定義（51 張表）** ⭐⭐⭐⭐⭐
- [資料模型對照表](./docs/27-資料模型對照表.md) - 資料模型對照

### 開發指南
- [SHARED_IMPORTS 使用指南](./docs/45-SHARED_IMPORTS-使用指南.md) - ⭐ 必讀
- [開發工作流程](./docs/35-開發工作流程.md) - 工作流程規範
- [錯誤處理指南](./docs/37-錯誤處理指南.md) - 錯誤處理規範
- [測試指南](./docs/38-測試指南.md) - 測試實踐

### 架構文檔
- [系統架構思維導圖](./docs/10-系統架構思維導圖.mermaid.md) - 系統架構總覽
- [完整架構流程圖](./docs/27-完整架構流程圖.mermaid.md) - **完整架構流程圖（Git-like 分支模型）** ⭐⭐⭐⭐⭐
- [架構審查報告](./docs/28-架構審查報告.md) - **架構審查報告（生產就緒版）** ⭐⭐⭐⭐⭐
- [帳戶層流程圖](./docs/13-帳戶層流程圖.mermaid.md) - 帳戶層架構（已更新 Git-like 分支模型）
- [重構後結構樹](./docs/04-重構後結構樹.md) - 專案結構樹
- [元件模組視圖](./docs/19-元件模組視圖.mermaid.md) - 前端架構
- [實體關係圖](./docs/12-實體關係圖.mermaid.md) - 資料庫 ER 圖
- [Supabase 架構流程圖](./docs/11-Supabase架構流程圖.mermaid.md) - Supabase 架構

### 快速參考
- [詞彙表](./docs/42-詞彙表.md) - 專案術語說明
- [狀態枚舉值定義](./docs/43-狀態枚舉值定義.md) - 狀態定義
- [開發最佳實踐指南](./docs/51-開發最佳實踐指南.md) - 代碼示例和開發模式 ⭐
- [AI 助手角色配置](./docs/50-AI助手角色配置.md) - AI 助手角色定義 ⭐

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

---

## 📖 規則文件說明

詳細的規則文件說明請參考 [.cursor/rules/README.md](./.cursor/rules/README.md)，包含：
- 規則文件結構說明
- 規則類型分類（Always、Auto Attached、Agent Requested、Manual）
- 使用方式和最佳實踐
