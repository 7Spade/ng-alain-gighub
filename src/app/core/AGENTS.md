# Core 模組開發規範摘要

> 📖 **重要提示**：本模組的開發規範已整合到 Cursor 規則系統中，規則會自動應用到 `src/app/core/` 目錄下的文件。

## 🎯 Core 模組職責

Core 模組是應用程式的核心基礎設施層，提供：
- 網路請求攔截與錯誤處理
- 國際化服務
- 應用啟動邏輯
- 路由守衛

## ⚠️ 核心規範

> 💡 **提示**：詳細規範請參考 [Core 模組特定規範](../../../.cursor/rules/core-specific.mdc)

### 關鍵要點

- **依賴關係**：可被 `routes` 和 `shared` 依賴，禁止依賴 `routes` 或 `shared`
- **HTTP 攔截器**：統一處理請求、認證 token、錯誤處理、重試邏輯
- **錯誤處理**：`ErrorStateService` 統一管理，明確分類，提供重試機制
- **國際化服務**：多語言支持、資源統一管理、動態切換
- **應用啟動**：`startup.service.ts` 處理初始化、認證恢復、資源預加載
- **路由守衛**：`canActivate`/`canActivateChild` 保護路由、驗證認證和權限
- **資料庫操作**：通過 Supabase MCP 工具，啟用 RLS，Repository 模式
- **測試要求**：服務 80% 覆蓋率，關鍵邏輯 100%，測試錯誤處理和路由守衛

## 📋 相關 Cursor 規則

以下規則會自動應用到本模組：

### 模組特定規則
- [Core 模組特定規範](../../../.cursor/rules/core-specific.mdc) - 本模組特定規範

### 通用規則（自動應用）
- [TypeScript 類型安全](../../../.cursor/rules/typescript.mdc) - TypeScript 類型安全規範
- [錯誤處理](../../../.cursor/rules/error-handling.mdc) - 錯誤處理與狀態管理
- [API 設計](../../../.cursor/rules/api-design.mdc) - API 設計與 Repository 模式
- [安全規範](../../../.cursor/rules/security.mdc) - 安全規範與最佳實踐
- [測試規範](../../../.cursor/rules/testing.mdc) - 測試規範與覆蓋率要求

## 📚 相關文檔

- [完整開發規範](../../../AGENTS.md)
- [錯誤處理指南](../../../docs/37-錯誤處理指南.md)
- [測試指南](../../../docs/38-測試指南.md)

### 開發脈絡文檔（FYI）
- [架構說明](../../../docs/fyi-architecture.md) - 系統架構設計、模組依賴關係
- [開發脈絡](../../../docs/fyi-development.md) - 技術選型、設計決策（Supabase 整合、權限系統）
- [上下文脈絡](../../../docs/fyi-context.md) - Domain 用語、業務背景

---

**最後更新**：2025-01-15  
**架構版本**：v2.0

