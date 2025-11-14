# Layout 模組開發規範摘要

> 📖 **重要提示**：本模組的開發規範已整合到 Cursor 規則系統中，規則會自動應用到 `src/app/layout/` 目錄下的文件。

## 🎯 Layout 模組職責

Layout 模組提供應用程式的佈局結構，包括：
- 基本佈局（Basic Layout）- 包含側邊欄、頂部導航、內容區域
- 空白佈局（Blank Layout）- 無側邊欄的簡潔佈局
- 認證佈局（Passport Layout）- 登入、註冊等認證頁面佈局

## ⚠️ 核心規範

> 💡 **提示**：詳細規範請參考 [Layout 模組特定規範](../../../.cursor/rules/layout-specific.mdc)

### 關鍵要點

- **依賴關係**：可依賴 `shared` 和 `core`，禁止依賴 `routes`
- **響應式設計**：支援多螢幕尺寸，使用 Grid 系統，側邊欄自動收起
- **狀態管理**：使用 Signals 管理佈局狀態，持久化到 localStorage
- **導航結構**：可配置菜單、多級結構、路由高亮、麵包屑導航
- **可訪問性**：ARIA 標籤、鍵盤導航、焦點管理
- **性能優化**：OnPush 策略、`trackBy` 優化、延遲加載
- **測試要求**：80% 覆蓋率，測試響應式、鍵盤導航、側邊欄功能

## 📋 相關 Cursor 規則

以下規則會自動應用到本模組：

### 模組特定規則
- [Layout 模組特定規範](../../../.cursor/rules/layout-specific.mdc) - 本模組特定規範

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc) - Angular 現代語法與 Signals
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc) - TypeScript 類型安全規範
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc) - SHARED_IMPORTS 使用規範
- [可訪問性](../../../.cursor/rules/accessibility.mdc) - 可訪問性規範
- [性能優化](../../../.cursor/rules/performance.mdc) - 性能監控和優化規範

## 📚 相關文檔

- [完整開發規範](../../../AGENTS.md)
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) ⭐ 必讀
- [開發工作流程](../../../docs/35-開發工作流程.md)

### 開發脈絡文檔（FYI）
- [架構說明](../../../docs/fyi-architecture.md) - 系統架構設計、模組職責
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型、設計決策
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語、業務背景

---

**最後更新**：2025-01-15  
**架構版本**：v2.0

