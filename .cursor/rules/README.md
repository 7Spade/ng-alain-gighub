# Cursor 規則文件說明

本目錄包含專案的 Cursor IDE 規則文件，這些規則會自動應用於 Cursor 的 AI 功能（Agent、Inline Edit 等）。

## 📁 規則文件結構

### 核心開發規範

- **typescript.mdc** - TypeScript 類型安全與最佳實踐
  - 類型安全原則
  - 類型匹配檢查
  - 模型定義對齊數據庫

- **angular.mdc** - Angular 20 最佳實踐與現代語法
  - Standalone Components
  - Signals 狀態管理
  - 現代控制流程
  - Typed Forms
  - 效能優化

- **modern-angular.mdc** - Angular 20 現代化特性與遷移指南
  - Signal Inputs 和 Outputs
  - Signal Queries
  - Standalone 遷移
  - 模板最佳實踐
  - 診斷和錯誤處理

- **shared-imports.mdc** - 共享模組優先使用規範
  - SHARED_IMPORTS 使用原則
  - 例外情況處理

### 架構與設計規範

- **architecture.mdc** - 分層架構與依賴關係
  - 依賴方向規範
  - Git-like 分支模型
  - 51 張資料表架構
  - 核心設計原則

- **git-model.mdc** - Git-like 分支模型與版本控制
  - 分支模型規範
  - 版本控制規範
  - 分支權限

### 代碼質量規範

- **code-quality.mdc** - 代碼質量與最佳實踐
  - 禁止重複造輪
  - 禁止權宜式修改
  - 命名規範一致性
  - 文檔化要求

- **linting.mdc** - ESLint 代碼檢查規範
  - ESLint 配置和使用
  - 代碼檢查規則
  - Git Hooks 集成

- **formatting.mdc** - Prettier 代碼格式化規範
  - Prettier 配置
  - 格式化規則
  - 編輯器集成

- **styling.mdc** - Stylelint 和 Less 樣式規範
  - Stylelint 配置
  - Less 使用規範
  - 樣式組織

- **error-handling.mdc** - 錯誤處理與狀態管理
  - 錯誤處理原則
  - 錯誤分類
  - 錯誤處理服務

- **api-design.mdc** - API 設計與 Repository 模式
  - Repository 模式
  - API 功能要求
  - 權限驗證

- **security.mdc** - 安全規範與最佳實踐
  - 資料庫安全
  - 敏感資料處理
  - 權限驗證

- **testing.mdc** - 測試規範與覆蓋率要求
  - 覆蓋率要求
  - Karma + Jasmine 配置
  - Angular Testing Utilities
  - 測試最佳實踐

- **accessibility.mdc** - 可訪問性規範（WCAG 2.1 AA）
  - ARIA 標籤
  - 鍵盤導航
  - 視覺設計

### 工具使用規範

- **mcp-tools.mdc** - MCP 工具使用規範
  - Context7
  - Sequential Thinking
  - Software Planning Tool
  - Memory
  - Supabase MCP

### 開發工具規範

- **git-workflow.mdc** - Git 工作流和提交規範
  - Conventional Commits
  - Husky Git Hooks
  - lint-staged 配置
  - 分支策略

- **build-deploy.mdc** - 構建和部署規範
  - 構建命令和配置
  - 性能分析
  - 部署前檢查

- **dependency-management.mdc** - Yarn 依賴管理規範
  - Yarn 使用規範
  - 版本管理
  - 安全檢查

- **theming.mdc** - ng-alain 主題定制規範
  - 主題工具使用
  - 顏色系統
  - 主題變數

- **performance.mdc** - 性能監控和優化規範
  - Bundle 大小監控
  - 性能指標
  - 優化策略

### 模組特定規範

- **shared-specific.mdc** - Shared 模組特定規範
  - SHARED_IMPORTS 優先使用
  - 可重用組件設計
  - 工具函數和共享服務

- **routes-specific.mdc** - Routes 模組特定規範
  - 路由配置
  - API 設計規範
  - 業務邏輯組織

- **layout-specific.mdc** - Layout 模組特定規範
  - 響應式設計
  - 佈局狀態管理
  - 導航結構

- **core-specific.mdc** - Core 模組特定規範
  - HTTP 攔截器
  - 國際化服務
  - 路由守衛

## 📝 規則類型

根據 Cursor 文檔，規則分為以下類型：

- **Always** (`alwaysApply: true`) - 總是包含在模型上下文中
- **Auto Attached** (`globs` 指定) - 當文件匹配 glob 模式時自動附加
- **Agent Requested** (`alwaysApply: false` 且有 `description`) - AI 決定是否包含
- **Manual** - 僅在使用 `@ruleName` 時顯式包含

## 🔧 使用方式

### 在 Cursor IDE 中使用

1. **自動應用**：標記為 `alwaysApply: true` 的規則會自動應用
2. **手動引用**：使用 `@ruleName` 在對話中引用特定規則
3. **文件匹配**：當編輯匹配 `globs` 模式的文件時，相關規則會自動附加

### 查看規則

- 在 Cursor IDE 中，規則會自動顯示在 AI 對話的上下文中
- 可以在 `.cursor/rules/` 目錄中查看所有規則文件

## 📚 相關文檔

- [Cursor 規則文檔](https://docs.cursor.com/context/rules)
- [AGENTS.md](../AGENTS.md) - 高層次架構決策
- [開發作業指引](../docs/00-開發作業指引.md) - 完整開發規範

## 🔄 更新規則

當需要更新規則時：

1. 編輯對應的 `.mdc` 文件
2. 更新 `AGENTS.md` 中的引用（如需要）
3. 規則會在下一次 AI 對話時自動生效

---

**最後更新**：2025-01-15  
**維護者**：開發團隊

