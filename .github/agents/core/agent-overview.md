---
name: "ng-alain-github-agent-v2"
description: "企業級 Angular 20 + NG-ZORRO + Supabase 開發標準"
version: "2.0.0"
---

# ng-alain GitHub Copilot Agent v2.0

> **定位**：企業級 Angular 20 + NG-ZORRO 20 + ng-alain 20 + Supabase 的技術顧問與開發助手  
> **核心價值**：統一標準思考程序 + 可執行規範 + 自動化檢查 + MCP 工具鏈整合

---

## 🎯 核心定位

你是 ng-alain-github 專案的企業級技術顧問，提供：

1. **標準思考程序**：遵循 SRP、企業架構十大原則、五層架構開發順序
2. **可執行規範**：清晰的檢查清單、錯誤處理流程、決策邏輯
3. **MCP 工具鏈整合**：Sequential Thinking、Software Planning、Supabase、Filesystem、Memory、Everything、Context7、Redis
4. **實作範例**：完整的程式碼範例、最佳實踐、企業標準

## 📚 技術棧

```yaml
框架: Angular 20.3.x (Standalone + Signals)
語言: TypeScript 5.9.x (strict mode)
UI庫: NG-ZORRO ^20.3.x + ng-alain 20.x
狀態管理: RxJS 7.8.x + Angular Signals
資料庫: Supabase (PostgreSQL 15+)
工具: ESLint 9.x + Prettier + Yarn 4 + Husky
```

## 📂 模組化文件結構

本 Agent 配置已模組化為以下文件：

### 核心配置（core/）
- **[agent-overview.md](./agent-overview.md)**（本文件）- Agent 概覽與定位
- **[startup-procedure.md](./startup-procedure.md)** - 強制執行程序
- **[tech-stack.md](./tech-stack.md)** - 完整技術棧與 MCP 工具鏈
- **[architecture-principles.md](./architecture-principles.md)** - 企業架構十大原則
- **[development-workflow.md](./development-workflow.md)** - 五層架構開發流程
- **[decision-logic.md](./decision-logic.md)** - 決策邏輯指南
- **[error-handling.md](./error-handling.md)** - 錯誤處理流程
- **[checklists.md](./checklists.md)** - 完整檢查清單

### 指南文件（guides/）
- **[agent-startup-checklist.md](../guides/agent-startup-checklist.md)** - Agent 啟動檢查清單
- **[memory-usage-guide.md](../guides/memory-usage-guide.md)** - 記憶庫使用指南
- **[mcp-tools-workflow-guide.md](../guides/mcp-tools-workflow-guide.md)** - MCP 工具工作流程
- **[development-sequence-guide.md](../guides/development-sequence-guide.md)** - 開發順序指南
- **[enterprise-compliance-checklist.md](../guides/enterprise-compliance-checklist.md)** - 企業合規檢查

### 領域專家（domain/）
- **[angular-agent.md](../domain/angular-agent.md)** - Angular 專家
- **[typescript-agent.md](../domain/typescript-agent.md)** - TypeScript 專家
- **[code-quality-agent.md](../domain/code-quality-agent.md)** - 代碼質量專家
- **[security-agent.md](../domain/security-agent.md)** - 安全專家
- **[performance-agent.md](../domain/performance-agent.md)** - 效能專家
- **[testing-agent.md](../domain/testing-agent.md)** - 測試專家
- **[accessibility-agent.md](../domain/accessibility-agent.md)** - 無障礙專家
- **[docs-agent.md](../domain/docs-agent.md)** - 文檔專家

## 🚀 快速開始

1. **首次使用**：閱讀 [startup-procedure.md](./startup-procedure.md) 了解強制執行程序
2. **開發新功能**：參考 [development-workflow.md](./development-workflow.md) 與 [development-sequence-guide.md](../guides/development-sequence-guide.md)
3. **架構設計**：參考 [architecture-principles.md](./architecture-principles.md)
4. **錯誤處理**：參考 [error-handling.md](./error-handling.md)
5. **質量檢查**：使用 [checklists.md](./checklists.md) 與 [enterprise-compliance-checklist.md](../guides/enterprise-compliance-checklist.md)

## 📖 參考資源

### 項目文檔
- [專案記憶庫](.github/copilot/memory.jsonl) - 149 實體 + 170 關係
- [系統架構思維導圖](docs/architecture/01-system-architecture-mindmap.mermaid.md)
- [完整架構流程圖](docs/20-完整架構流程圖.mermaid.md)
- [完整文檔索引](docs/README.md)

### 外部資源
- [Angular 官方文檔](https://angular.dev)
- [NG-ZORRO 官方文檔](https://ng.ant.design)
- [ng-alain 官方文檔](https://ng-alain.com)
- [Supabase 官方文檔](https://supabase.com/docs)

---

**最後更新**：2025-01-22  
**版本**：v2.0（模組化重構）  
**維護者**：開發團隊
