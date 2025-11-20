> **📌 重要提示**：
> - 基礎開發規範已遷移至 `.cursor/rules/` 目錄，這些規則會自動應用於 Cursor IDE 的 AI 功能
> - **VSCode GitHub Copilot 指引**位於根目錄的 `.copilot-*.md` 檔案（與 `.vscode/settings.json` 整合）
> - **GitHub Copilot Agent Mode 指引**位於 `.github/agents/` 目錄（供 Workspace/Agent Mode 使用）
> - 模組特定規範請參考各模組目錄下的 `AGENTS.md` 文件
> - 詳細規範請參考對應的規則文件
> - **⭐ [Agent 開發指南與限制說明](./docs/43-Agent開發指南與限制說明.md)** - 了解 AI Agent 開發的限制和最佳實踐

## 📂 AI 助手檔案組織結構

本專案的 AI 助手相關檔案分為三個層級，各有不同的用途和目標受眾：

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

## 📋 快速參考

### Cursor 規則文件
完整的 Cursor IDE 規則文件請參考：[.cursor/rules/README.md](./.cursor/rules/README.md)

包含核心開發規範、架構設計、代碼質量、開發工具、模組特定規範等 28 個規則文件。

### GitHub Agents 目錄
完整的 GitHub Agents 說明請參考：[.github/agents/README.md](./.github/agents/README.md)

包含專案開發代理、角色定位、領域專家 Agents（Angular、TypeScript、代碼質量、安全、效能、測試、可訪問性、文件）等。

---

## 🔧 VSCode 設定檔整合

`.vscode/settings.json` 已配置 GitHub Copilot 使用根目錄的指引檔案：
- **程式碼產生**：使用 `.copilot-instructions.md`
- **程式碼審查**：使用 `.copilot-review-instructions.md`
- **Commit 訊息**：使用 `.copilot-commit-message-instructions.md`
- **PR 描述**：使用 `.copilot-pull-request-description-instructions.md`
- **測試產生**：使用 `.copilot-test-instructions.md`

詳細配置請參考 [.vscode/settings.json](./.vscode/settings.json)

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

完整的文檔索引請參考：[docs/README.md](./docs/README.md)

### 核心文檔（精選）
- [開發作業指引](./docs/00-開發作業指引.md) - 開發規範與流程
- [快速開始指南](./docs/32-快速開始指南.md) - 環境設定與啟動
- [專案結構說明](./docs/01-專案結構說明.md) - 專案結構概覽
- [完整SQL表結構定義](./docs/22-完整SQL表結構定義.md) - 51 張表結構定義 ⭐⭐⭐⭐⭐
- [完整架構流程圖](./docs/27-完整架構流程圖.mermaid.md) - Git-like 分支模型 ⭐⭐⭐⭐⭐
- [架構審查報告](./docs/28-架構審查報告.md) - 生產就緒版 ⭐⭐⭐⭐⭐
- [SHARED_IMPORTS 使用指南](./docs/45-SHARED_IMPORTS-使用指南.md) - 必讀 ⭐
- [開發最佳實踐指南](./docs/51-開發最佳實踐指南.md) - 代碼示例和開發模式 ⭐

### 使用建議
- **架構理解**：優先閱讀架構流程圖、架構審查報告、SQL表結構定義
- **日常開發**：參考開發作業指引、SHARED_IMPORTS 使用指南、開發最佳實踐指南
- **詳細資料**：查閱 docs/README.md 獲取完整文檔分類

---

**最後更新**：2025-01-15  
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）  
**維護者**：開發團隊
