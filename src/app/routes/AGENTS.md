# Routes 模組開發規範摘要

> 📖 **重要提示**：本模組的開發規範已整合到 Cursor 規則系統中，規則會自動應用到 `src/app/routes/` 目錄下的文件。

## 🎯 Routes 模組職責

Routes 模組是應用程式的路由層，包含所有功能頁面：
- 儀表板（Dashboard）
- 業務功能頁面（Pro）
- 認證頁面（Passport）
- 異常頁面（Exception）
- 其他功能模組

## ⚠️ 核心規範

> 💡 **提示**：詳細規範請參考 [Routes 模組特定規範](../../../.cursor/rules/routes-specific.mdc)

### 關鍵要點

- **依賴關係**：可依賴 `shared` 和 `core`，禁止依賴其他 `routes` 子模組
- **路由配置**：使用懶加載、路由守衛、RESTful 命名規範
- **業務邏輯**：放在服務層，使用 Repository 模式，組件只負責展示
- **API 設計**：Repository 模式、統一錯誤處理、權限驗證
- **測試要求**：組件 80% 覆蓋率，關鍵邏輯 100%，E2E 覆蓋關鍵流程

## 📋 相關 Cursor 規則

以下規則會自動應用到本模組：

### 模組特定規則
- [Routes 模組特定規範](../../../.cursor/rules/routes-specific.mdc) - 本模組特定規範

### 通用規則（自動應用）
- [Angular 20 最佳實踐](../../../.cursor/rules/angular.mdc) - Angular 現代語法與 Signals
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc) - TypeScript 類型安全規範
- [共享模組優先使用](../../../.cursor/rules/shared-imports.mdc) - SHARED_IMPORTS 使用規範
- [API 設計](../../../.cursor/rules/api-design.mdc) - API 設計與 Repository 模式
- [錯誤處理](../../../.cursor/rules/error-handling.mdc) - 錯誤處理與狀態管理
- [測試規範](../../../.cursor/rules/testing.mdc) - 測試規範與覆蓋率要求

## 📚 相關文檔

- [完整開發規範](../../../AGENTS.md)
- [SHARED_IMPORTS 使用指南](../../../docs/45-SHARED_IMPORTS-使用指南.md) ⭐ 必讀
- [開發工作流程](../../../docs/35-開發工作流程.md)
- [錯誤處理指南](../../../docs/37-錯誤處理指南.md)

---

**最後更新**：2025-01-15  
**架構版本**：v2.0

