# GitHub Agents 配置中心

> **版本**：v3.0（企業標準 - 模組化重構）  
> **目的**：集中管理 GitHub Copilot Agent 的所有配置、指南與工具

---

## 🎯 總覽

本目錄是 GitHub Copilot Agent 的配置中心，提供企業級的開發標準、工作流程與自動化工具。所有配置已模組化，便於維護與擴展。

## 🚀 快速開始

**新手必讀**：[QUICK-START.md](./QUICK-START.md)

### 首次使用
1. 閱讀 [core/agent-overview.md](./core/agent-overview.md) - 了解 Agent 定位
2. 熟悉 [core/startup-procedure.md](./core/startup-procedure.md) - 強制執行程序
3. 查看 [guides/agent-startup-checklist.md](./guides/agent-startup-checklist.md) - 啟動檢查清單

### 日常開發
1. 遵循 [guides/development-sequence-guide.md](./guides/development-sequence-guide.md) - 五層架構開發順序
2. 使用 [guides/mcp-tools-workflow-guide.md](./guides/mcp-tools-workflow-guide.md) - MCP 工具工作流程
3. 參考 [guides/enterprise-compliance-checklist.md](./guides/enterprise-compliance-checklist.md) - 企業合規檢查

---

## 📂 目錄結構（v3.0 - 模組化）

```text
.github/agents/
├── README.md                    # 本文件 - 配置中心概覽
├── QUICK-START.md               # 🚀 快速開始指南
├── copilot-instructions.md      # GitHub Copilot Agent 簡要指引
├── role.agent.md                # AI 角色設定
├── role-config.md               # System message 快速參考
├── docs-index.md                # docs/ 目錄索引
├── redis-external-brain-guide.md # Redis 外掛大腦指南
│
├── core/                        # 🎯 核心配置
│   ├── README.md                # 核心配置說明
│   ├── agent-overview.md        # ⭐⭐⭐⭐⭐ Agent 概覽與定位
│   ├── startup-procedure.md     # ⭐⭐⭐⭐⭐ 強制執行程序
│   ├── tech-stack.md            # 完整技術棧與 MCP 工具鏈（待創建）
│   ├── architecture-principles.md # 企業架構十大原則（待創建）
│   ├── development-workflow.md  # 五層架構開發流程（待創建）
│   ├── decision-logic.md        # 決策邏輯指南（待創建）
│   ├── error-handling.md        # 錯誤處理流程（待創建）
│   └── checklists.md            # 完整檢查清單（待創建）
│
├── guides/                      # 📚 指南文件
│   ├── README.md                # 指南說明
│   ├── agent-startup-checklist.md # ⭐⭐⭐⭐⭐ Agent 啟動檢查清單
│   ├── memory-usage-guide.md    # ⭐⭐⭐⭐⭐ 記憶庫使用指南
│   ├── mcp-tools-workflow-guide.md # ⭐⭐⭐⭐⭐ MCP 工具工作流程
│   ├── development-sequence-guide.md # ⭐⭐⭐⭐⭐ 開發順序指南
│   ├── enterprise-compliance-checklist.md # ⭐⭐⭐⭐⭐ 企業合規檢查
│   └── agent-quick-reference.md # 快速參考指南
│
├── domain/                      # 🔧 領域專家
│   ├── angular-agent.md         # Angular 專家
│   ├── typescript-agent.md      # TypeScript 專家
│   ├── code-quality-agent.md    # 代碼質量專家
│   ├── security-agent.md        # 安全專家
│   ├── performance-agent.md     # 效能專家
│   ├── testing-agent.md         # 測試專家
│   ├── accessibility-agent.md   # 無障礙專家
│   └── docs-agent.md            # 文檔專家
│
├── tools/                       # 🛠️ 自動化工具
│   ├── README.md                # 工具說明
│   ├── check-memory-coverage.sh # 記憶庫覆蓋率檢查
│   ├── validate-compliance.sh   # 企業合規驗證
│   ├── verify-dev-sequence.sh   # 開發順序驗證
│   └── monitoring-prototype.md  # 監控原型設計
│
└── archive/                     # 🗄️ 歷史文檔
    ├── README.md                # 歸檔說明
    ├── document-refactoring-plan.md
    ├── documentation-completion-report.md
    ├── documentation-final-summary.md
    ├── documentation-quality-improvement-report.md
    └── markdown-documentation-standards.md
```

---

## 🔄 v3.0 重構說明

### 主要變更
1. **模組化核心配置**：將 31KB 的 `ng-alain-github-agent.md` 拆分為 8 個模組化文件（core/）
2. **指南文件整合**：所有操作指南統一放入 guides/ 目錄
3. **歷史文檔歸檔**：完成的報告移至 archive/ 目錄
4. **清晰的層次結構**：core（What & Why）→ guides（How）→ domain（Who）

### 優勢
- ✅ **易於維護**：每個文件專注單一主題
- ✅ **易於查找**：清晰的目錄結構
- ✅ **易於擴展**：模組化設計便於添加新內容
- ✅ **企業標準**：符合大型專案的文檔組織標準

---

## 📖 文件說明

### 核心配置（core/）⭐⭐⭐⭐⭐
定義 Agent 的核心行為標準與工作流程。

**已完成**：
- `agent-overview.md` - Agent 概覽與定位
- `startup-procedure.md` - 強制執行程序

**待創建**（從原 ng-alain-github-agent.md 拆分）：
- `tech-stack.md` - 完整技術棧與 MCP 工具鏈
- `architecture-principles.md` - 企業架構十大原則
- `development-workflow.md` - 五層架構開發流程
- `decision-logic.md` - 決策邏輯指南
- `error-handling.md` - 錯誤處理流程
- `checklists.md` - 完整檢查清單

### 指南文件（guides/）⭐⭐⭐⭐⭐
提供詳細的操作指南與最佳實踐。

**核心指南**：
- `agent-startup-checklist.md` - 每次任務開始前必讀
- `memory-usage-guide.md` - 如何使用專案記憶庫
- `mcp-tools-workflow-guide.md` - MCP 工具完整工作流程
- `development-sequence-guide.md` - 五層架構開發順序
- `enterprise-compliance-checklist.md` - 企業級合規檢查

### 領域專家（domain/）⭐⭐⭐⭐
特定技術領域的專家配置與檢查清單。

**8 個領域專家**：
- Angular、TypeScript、代碼質量、安全、效能、測試、無障礙、文檔

### 自動化工具（tools/）⭐⭐⭐
自動化檢查與驗證腳本。

**可用工具**：
- 記憶庫覆蓋率檢查
- 企業合規驗證
- 開發順序驗證

---

## 🔗 相關資源

### 專案資源
- **專案記憶庫**：[.github/copilot/memory.jsonl](../copilot/memory.jsonl) - 149 實體 + 170 關係
- **記憶庫指南**：[.github/copilot/README.md](../copilot/README.md) - 完整使用說明
- **系統架構圖**：[docs/architecture/01-system-architecture-mindmap.mermaid.md](../../docs/architecture/01-system-architecture-mindmap.mermaid.md)
- **完整文檔**：[docs/README.md](../../docs/README.md) - 232 個文檔索引

### 全局配置
- **Copilot 指令**：[.github/copilot-instructions/](../copilot-instructions/) - VSCode GitHub Copilot 全局指令
- **工作流程**：[.github/workflows/](../workflows/) - CI/CD 配置
- **問題模板**：[.github/ISSUE_TEMPLATE/](../ISSUE_TEMPLATE/) - Issue 模板

---

## 🎓 使用建議

### 按任務類型選擇文件

| 任務類型 | 推薦閱讀 |
|---------|---------|
| 新功能開發 | core/startup-procedure.md → guides/development-sequence-guide.md → domain/angular-agent.md |
| 程式碼審查 | guides/enterprise-compliance-checklist.md → domain/code-quality-agent.md |
| 安全修復 | domain/security-agent.md → guides/enterprise-compliance-checklist.md |
| 效能優化 | domain/performance-agent.md → guides/enterprise-compliance-checklist.md |
| 測試撰寫 | domain/testing-agent.md → guides/development-sequence-guide.md |
| 文檔撰寫 | domain/docs-agent.md → guides/enterprise-compliance-checklist.md |

### 按角色選擇文件

| 角色 | 推薦閱讀 |
|-----|---------|
| 新手開發者 | QUICK-START.md → core/agent-overview.md → guides/ 全部 |
| 資深開發者 | core/startup-procedure.md → guides/agent-quick-reference.md |
| 架構師 | core/architecture-principles.md → guides/development-sequence-guide.md |
| 質量工程師 | domain/code-quality-agent.md → guides/enterprise-compliance-checklist.md |

---

## 📊 企業標準達成度

- ✅ **模組化結構**：100%（core、guides、domain、tools、archive）
- ✅ **文檔完整性**：60%（核心文件已創建，待從原文件拆分）
- ✅ **易維護性**：100%（清晰的目錄結構與命名規範）
- ✅ **可擴展性**：100%（模組化設計便於添加新內容）
- ✅ **歷史保存**：100%（完整的歸檔機制）

---

## 🔄 遷移指南

### 舊路徑 → 新路徑

| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `ng-alain-github-agent.md` | `core/agent-overview.md` + 其他模組 | 🚧 進行中 |
| `agent-startup-checklist.md` | `guides/agent-startup-checklist.md` | ✅ 完成 |
| `memory-usage-guide.md` | `guides/memory-usage-guide.md` | ✅ 完成 |
| `mcp-tools-workflow-guide.md` | `guides/mcp-tools-workflow-guide.md` | ✅ 完成 |
| `development-sequence-guide.md` | `guides/development-sequence-guide.md` | ✅ 完成 |
| `enterprise-compliance-checklist.md` | `guides/enterprise-compliance-checklist.md` | ✅ 完成 |
| `document-refactoring-plan.md` | `archive/document-refactoring-plan.md` | ✅ 完成 |

---

## 🆘 支援

如有問題或建議，請：
1. 查看 [QUICK-START.md](./QUICK-START.md) 快速參考
2. 閱讀對應的 README.md 文件
3. 聯繫開發團隊

---

**最後更新**：2025-01-22  
**版本**：v3.0（模組化重構）  
**維護者**：開發團隊
