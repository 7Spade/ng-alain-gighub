# Shared 模組開發規範摘要

> 📖 **重要提示**：本模組的開發規範已整合到 Cursor 規則系統中，規則會自動應用到 `src/app/shared/` 目錄下的文件。

## 🎯 Shared 模組職責

Shared 模組提供可重用的組件、服務和工具，包括：
- UI 組件（使用 `SHARED_IMPORTS`）
- 工具函數
- 共享服務
- 通用 Widget

## ⚠️ 核心規範

> 💡 **提示**：詳細規範請參考 [Shared 模組特定規範](../../../.cursor/rules/shared-specific.mdc)

### 關鍵要點

- **SHARED_IMPORTS 優先使用**：所有 UI 層組件必須優先使用 `SHARED_IMPORTS`
- **依賴關係**：可被 `routes` 依賴，可依賴 `core`，禁止依賴 `routes`
- **可重用設計**：組件、工具函數、服務都應高度可重用
- **無狀態服務**：使用 Signals 管理狀態，暴露 `ReadonlySignal` 給組件

## 📋 相關 Cursor 規則

以下規則會自動應用到本模組：

### 模組特定規則
- [Shared 模組特定規範](../../../.cursor/rules/shared-specific.mdc) - 本模組特定規範

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc) - Angular 現代語法與 Signals
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc) - TypeScript 類型安全規範
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc) - SHARED_IMPORTS 使用規範
- [代碼質量](../../../.cursor/rules/code-quality.mdc) - 代碼質量與最佳實踐
- [可訪問性](../../../.cursor/rules/accessibility.mdc) - 可訪問性規範

## 📚 相關文檔

- [完整開發規範](../../../AGENTS.md)
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) ⭐ 必讀
- [開發工作流程](../../../docs/35-開發工作流程.md)

### 開發脈絡文檔（FYI）
- [架構說明](../../../docs/fyi-architecture.md) - 分層架構設計、模組職責界線
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型、設計決策
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語、業務背景

---

**最後更新**：2025-01-15  
**架構版本**：v2.0

