# GitHub Agents 快速索引

> **目的**：提供快速導航與文件查找

---

## 🎯 按需求快速查找

### 我是新手，從哪裡開始？
1. **[QUICK-START.md](./QUICK-START.md)** - 快速開始指南
2. **[core/agent-overview.md](./core/agent-overview.md)** - 了解 Agent 定位
3. **[core/startup-procedure.md](./core/startup-procedure.md)** - 學習執行程序

### 我要開發新功能
1. **[core/startup-procedure.md](./core/startup-procedure.md)** - 執行啟動程序
2. **[guides/development-sequence-guide.md](./guides/development-sequence-guide.md)** - 遵循開發順序
3. **[domain/angular-agent.md](./domain/angular-agent.md)** - Angular 最佳實踐

### 我要修復 Bug
1. **[core/error-handling.md](./core/error-handling.md)** - 錯誤處理流程
2. **[guides/agent-quick-reference.md](./guides/agent-quick-reference.md)** - 快速參考
3. **[domain/code-quality-agent.md](./domain/code-quality-agent.md)** - 代碼質量檢查

### 我要優化效能
1. **[domain/performance-agent.md](./domain/performance-agent.md)** - 效能優化專家
2. **[guides/enterprise-compliance-checklist.md](./guides/enterprise-compliance-checklist.md)** - 效能檢查項目

### 我要加強安全性
1. **[domain/security-agent.md](./domain/security-agent.md)** - 安全專家
2. **[guides/memory-usage-guide.md](./guides/memory-usage-guide.md)** - 查閱安全規範

### 我要撰寫測試
1. **[domain/testing-agent.md](./domain/testing-agent.md)** - 測試專家
2. **[guides/development-sequence-guide.md](./guides/development-sequence-guide.md)** - 測試開發順序

### 我要撰寫文檔
1. **[domain/docs-agent.md](./domain/docs-agent.md)** - 文檔專家
2. **[guides/enterprise-compliance-checklist.md](./guides/enterprise-compliance-checklist.md)** - 文檔標準

---

## 📂 按目錄瀏覽

### 核心配置（core/）
定義 Agent 的核心行為標準

| 文件 | 說明 | 狀態 |
|------|------|------|
| [agent-overview.md](./core/agent-overview.md) | Agent 概覽與定位 | ✅ |
| [startup-procedure.md](./core/startup-procedure.md) | 強制執行程序 | ✅ |
| [tech-stack.md](./core/tech-stack.md) | 技術棧與 MCP 工具 | ✅ |
| [architecture-principles.md](./core/architecture-principles.md) | 企業架構原則 | ✅ |
| [development-workflow.md](./core/development-workflow.md) | 開發工作流程 | ✅ |
| [decision-logic.md](./core/decision-logic.md) | 決策邏輯指南 | ✅ |
| [error-handling.md](./core/error-handling.md) | 錯誤處理流程 | ✅ |
| [checklists.md](./core/checklists.md) | 完整檢查清單 | ✅ |

### 指南文件（guides/）
提供詳細的操作指南

| 文件 | 說明 | 重要性 |
|------|------|--------|
| [agent-startup-checklist.md](./guides/agent-startup-checklist.md) | 啟動檢查清單 | ⭐⭐⭐⭐⭐ |
| [memory-usage-guide.md](./guides/memory-usage-guide.md) | 記憶庫使用指南 | ⭐⭐⭐⭐⭐ |
| [mcp-tools-workflow-guide.md](./guides/mcp-tools-workflow-guide.md) | MCP 工具工作流程 | ⭐⭐⭐⭐⭐ |
| [development-sequence-guide.md](./guides/development-sequence-guide.md) | 開發順序指南 | ⭐⭐⭐⭐⭐ |
| [enterprise-compliance-checklist.md](./guides/enterprise-compliance-checklist.md) | 企業合規檢查 | ⭐⭐⭐⭐⭐ |
| [agent-quick-reference.md](./guides/agent-quick-reference.md) | 快速參考指南 | ⭐⭐⭐⭐ |

### 領域專家（domain/）
特定技術領域的專家配置

| 文件 | 專家領域 |
|------|----------|
| [angular-agent.md](./domain/angular-agent.md) | Angular 框架 |
| [typescript-agent.md](./domain/typescript-agent.md) | TypeScript 語言 |
| [code-quality-agent.md](./domain/code-quality-agent.md) | 代碼質量 |
| [security-agent.md](./domain/security-agent.md) | 安全性 |
| [performance-agent.md](./domain/performance-agent.md) | 效能優化 |
| [testing-agent.md](./domain/testing-agent.md) | 測試策略 |
| [accessibility-agent.md](./domain/accessibility-agent.md) | 無障礙設計 |
| [docs-agent.md](./domain/docs-agent.md) | 文檔撰寫 |

### 自動化工具（tools/）
自動化檢查與驗證腳本

| 文件 | 說明 |
|------|------|
| [README.md](./tools/README.md) | 工具說明 |
| [check-memory-coverage.sh](./tools/check-memory-coverage.sh) | 記憶庫覆蓋率檢查 |
| [validate-compliance.sh](./tools/validate-compliance.sh) | 企業合規驗證 |
| [verify-dev-sequence.sh](./tools/verify-dev-sequence.sh) | 開發順序驗證 |
| [monitoring-prototype.md](./tools/monitoring-prototype.md) | 監控原型設計 |

---

## 🔗 外部資源快速連結

### 專案資源
- **記憶庫**：[.github/copilot/memory.jsonl](../copilot/memory.jsonl)
- **系統架構**：[docs/architecture/01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md)
- **完整文檔**：[docs/README.md](../../docs/README.md)

### 全局配置
- **Copilot 指令**：[.github/copilot-instructions/](../copilot-instructions/)
- **工作流程**：[.github/workflows/](../workflows/)
- **問題模板**：[.github/ISSUE_TEMPLATE/](../ISSUE_TEMPLATE/)

### 官方文檔
- [Angular 官方](https://angular.dev)
- [NG-ZORRO 官方](https://ng.ant.design)
- [ng-alain 官方](https://ng-alain.com)
- [Supabase 官方](https://supabase.com/docs)

---

## 📊 文件狀態

### 完成度統計
- ✅ **已完成**：21 個文件（含 6 個新創建的核心配置）
- 🗄️ **已歸檔**：10 個歷史文件（含原 ng-alain-github-agent-v2.0-backup.md）

### 核心配置完成度
- [x] agent-overview.md（已創建）
- [x] startup-procedure.md（已創建）
- [x] tech-stack.md（✅ 已完成 - 2025-01-22）
- [x] architecture-principles.md（✅ 已完成 - 2025-01-22）
- [x] development-workflow.md（✅ 已完成 - 2025-01-22）
- [x] decision-logic.md（✅ 已完成 - 2025-01-22）
- [x] error-handling.md（✅ 已完成 - 2025-01-22）
- [x] checklists.md（✅ 已完成 - 2025-01-22）

**狀態**：✅ core/ 模組化重構已完成（主文件從 31KB 降至 12KB）

---

## 🔍 搜尋技巧

### 按關鍵字搜尋
```bash
# 搜尋 Angular 相關內容
grep -r "Angular" .github/agents/

# 搜尋安全相關內容
grep -r "Security" .github/agents/

# 搜尋 MCP 工具相關內容
grep -r "MCP" .github/agents/
```

### 按檔案類型查找
```bash
# 列出所有 Markdown 文件
find .github/agents/ -name "*.md"

# 列出所有 Shell 腳本
find .github/agents/ -name "*.sh"
```

---

**最後更新**：2025-01-22  
**維護者**：開發團隊
