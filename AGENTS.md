> **📌 重要提示**：
> - 基礎開發規範：`.cursor/rules/` 目錄（Cursor IDE 自動應用）
> - VSCode Copilot 指引：根目錄 `.copilot-*.md`（與 `.vscode/settings.json` 整合）
> - Agent Mode 指引：`.github/agents/` 目錄
> - 模組規範：各模組目錄下的 `AGENTS.md`
> - ⭐ [Agent 開發指南](./docs/43-Agent開發指南與限制說明.md)

## 📂 AI 助手檔案組織

專案 AI 助手檔案分為三個層級：

### 1. 根目錄 Copilot 指引（VSCode 整合）⭐
根目錄 `.copilot-*.md` 檔案，由 `.vscode/settings.json` 參照，供 VSCode GitHub Copilot 使用：

- [`.copilot-instructions.md`](./.copilot-instructions.md) - **主要開發指引**
  專案概述、技術架構、核心開發原則、Angular 20 + Signals 規範、開發工作流程

- [`.copilot-review-instructions.md`](./.copilot-review-instructions.md) - **程式碼審查指引**
  10 大審查檢查清單、審查流程、建議格式、最佳實踐範例

- [`.copilot-commit-message-instructions.md`](./.copilot-commit-message-instructions.md) - **Commit 訊息規範**
  Conventional Commits 1.0.0 標準、Type/Scope/Subject 規範、正體中文撰寫

- [`.copilot-pull-request-description-instructions.md`](./.copilot-pull-request-description-instructions.md) - **PR 描述規範**
  PR 模板結構、不同類型範例、檢查清單

- [`.copilot-test-instructions.md`](./.copilot-test-instructions.md) - **測試產生指引**
  Jasmine/Karma 框架、元件/服務/整合測試、Signals API 測試、覆蓋率 ≥ 80%

### 2. GitHub Agents 目錄（Agent Mode）
`.github/agents/` 目錄，供 GitHub Copilot Workspace 和 Agent Mode 使用。

詳細說明：[.github/agents/README.md](./.github/agents/README.md)

### 3. Cursor 規則目錄（Cursor IDE）
`.cursor/rules/` 目錄，Cursor IDE 自動載入。

詳細說明：[.cursor/rules/README.md](./.cursor/rules/README.md)

---

## 📋 快速參考

### Cursor 規則文件
完整規則文件：[.cursor/rules/README.md](./.cursor/rules/README.md)

包含 28 個規則文件（核心開發規範、架構設計、代碼質量、開發工具、模組規範）。

### GitHub Agents 目錄
完整說明：[.github/agents/README.md](./.github/agents/README.md)

包含專案開發代理、角色定位、領域專家 Agents（Angular、TypeScript、代碼質量、安全、效能、測試、可訪問性、文件）。

---

## 🔧 VSCode 設定檔整合

`.vscode/settings.json` 已配置 GitHub Copilot 使用根目錄指引檔案：
- 程式碼產生：`.copilot-instructions.md`
- 程式碼審查：`.copilot-review-instructions.md`
- Commit 訊息：`.copilot-commit-message-instructions.md`
- PR 描述：`.copilot-pull-request-description-instructions.md`
- 測試產生：`.copilot-test-instructions.md`

詳細配置：[.vscode/settings.json](./.vscode/settings.json)

---

## 📝 模板文件

- [Component 模板](./.cursor/templates/component.mdc) - Angular Standalone Component 模板
- [Service 模板](./.cursor/templates/service.mdc) - Angular Service 模板（使用 Signals）

---

## 🔄 保留在 AGENTS.md 的內容

本文件作為高層次架構決策參考：

**架構理解**：
  - **Git-like 分支模型**：主分支、組織分支、PR 機制（參考 `docs/20-完整架構流程圖.mermaid.md`, `docs/21-架構審查報告.md`）
  - **51 張資料表架構**：分為 11 個模組（參考 `docs/22-完整SQL表結構定義.md`）
  - **核心設計原則**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步（即時至主分支）、活動記錄（集中記錄）、文件管理（版本控制、縮圖、軟刪除）

**文檔索引**：
  - 完整索引：[docs/README.md](./docs/README.md)
  - 規則文件：[.cursor/rules/README.md](./.cursor/rules/README.md)
  - GitHub Agents：[.github/agents/README.md](./.github/agents/README.md)

**核心開發原則** ⭐：
  - **常見做法**：遵循業界標準，參考官方文檔和最佳實踐
  - **企業標準**：代碼結構清晰、職責分離明確、錯誤處理完善、狀態管理規範
  - **符合邏輯**：數據流清晰、命名語義化、條件判斷合理、組件初始化順序正確
  - **符合常理**：功能真正可用、用戶體驗優先、避免過度設計、及時驗證
  - 詳細說明：[代碼質量規範](./.cursor/rules/code-quality.mdc#core-development-principles-)

---

## 📚 相關文檔

完整索引：[docs/README.md](./docs/README.md)

### 核心文檔
- [快速開始指南](./docs/25-快速開始指南.md) - 環境設定與啟動
- [專案結構流程圖](./docs/02-專案結構流程圖.mermaid.md) - 專案結構概覽
- [完整SQL表結構定義](./docs/22-完整SQL表結構定義.md) - 51 張表結構 ⭐⭐⭐⭐⭐
- [完整架構流程圖](./docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型 ⭐⭐⭐⭐⭐
- [架構審查報告](./docs/21-架構審查報告.md) - 生產就緒版 ⭐⭐⭐⭐⭐
- [SHARED_IMPORTS 使用指南](./docs/37-SHARED_IMPORTS-使用指南.md) - 必讀 ⭐
- [開發最佳實踐指南](./docs/42-開發最佳實踐指南.md) - 代碼示例 ⭐

### 使用建議
- **架構理解**：架構流程圖、架構審查報告、SQL表結構定義
- **日常開發**：SHARED_IMPORTS 使用指南、開發最佳實踐指南
- **詳細資料**：docs/README.md

---

**最後更新**：2025-01-15  
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）  
**維護者**：開發團隊
