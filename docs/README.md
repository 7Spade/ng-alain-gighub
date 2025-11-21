# ng-alain 專案文檔索引

> **📚 目的**：提供完整的文檔導航和快速查找功能，幫助開發者快速找到所需文檔

**最後更新**：2025-01-21  
**總文檔數**：215 個 Markdown 文件  
**文檔健康度**：54.9/100（需要改善，[詳見報告](./markdown-documentation-quality-analysis-report.md)）  
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）  
**技術棧版本**：Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.1.x + Supabase

---

## 📑 目錄

- [🚀 快速開始](#-快速開始)
- [📂 文檔分類](#-文檔分類)
- [🎯 按角色查找](#-按角色查找)
- [🔍 快速查詢](#-快速查詢)
- [🎯 核心架構要點](#-核心架構要點)
- [📊 統計資訊](#-統計資訊)

---

## 🚀 快速開始

### 新成員入門（推薦閱讀順序）

#### 第一天：環境設定與基礎了解
1. ⭐ [快速開始指南](./guides/getting-started.md) - 環境設定與啟動
2. [開發者快速檢查清單](./guides/developer-quick-checklist.md) - 5 分鐘環境驗證
3. [專案結構流程圖](./architecture/02-project-structure-flowchart.mermaid.md) - 專案結構概覽

#### 第二天：開發規範與流程
4. ⭐ [開發最佳實踐指南](./guides/development-best-practices.md) - 核心開發規範與範例
5. [開發工作流程](./guides/development-workflow.md) - Git 工作流程與 PR 流程
6. [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md) - 共用模組匯入（必讀）

#### 第三天：深入理解架構
7. ⭐⭐⭐⭐⭐ [完整架構流程圖](./architecture/20-complete-architecture-flowchart.mermaid.md) - Git-like 分支模型
8. ⭐⭐⭐⭐⭐ [完整 SQL 表結構定義](./reference/sql-schema-definition.md) - 51 張資料表完整定義
9. ⭐⭐⭐⭐⭐ [架構審查報告](./architecture/21-architecture-review-report.md) - 生產就緒版

### AI Agent 開發者

- ⭐ [Agent 快速參考](../.github/agents/agent-quick-reference.md) - Agent 必讀規則與檢查清單
- [Agent 開發指南](./guides/agent-development-guide.md) - AI Agent 開發的限制和最佳實踐
- [Markdown 文檔標準化規範](../.github/agents/markdown-documentation-standards.md) - 完整文檔規範
- [AI 助手角色配置](./reference/ai-assistant-role-configuration.md) - 工程師級 AI 助手角色定義

### 文檔品質報告

- 🔍 [Markdown 文檔品質分析報告](./markdown-documentation-quality-analysis-report.md) - 完整分析報告（2025-01-21）
- ⚡ [Markdown 文檔品質快速摘要](./markdown-quality-quick-summary.md) - 一分鐘快速了解

---

## 📂 文檔分類

### 📋 開發規範 (specs/)

**15 個規範文檔** - 開發標準、編碼規範、最佳實踐

完整索引：[specs/README.md](./specs/README.md)

### 🏗️ 系統架構 (architecture/)

**20 個架構文檔** - 系統設計圖、流程圖、架構說明

完整索引：[architecture/README.md](./architecture/README.md)

⭐ **NEW**: [architecture/layer-structure-classification.md](./architecture/layer-structure-classification.md) - 五層架構結構分類說明

### 📖 開發指南 (guides/)

**27 個開發指南** - 操作手冊、教學、工作流程

完整索引：[guides/README.md](./guides/README.md)

### 📚 參考文檔 (reference/)

**11 個參考文檔** - API 文檔、資料庫定義、查詢資料

完整索引：[reference/README.md](./reference/README.md)

### 💼 工作區系統 (workspace/)

**10 個工作區文檔** - 四層上下文系統

完整索引：[workspace/README.md](./workspace/README.md)

⭐⭐⭐ **重要**：[workspace/workspace-missing-work-items-analysis.md](./workspace/workspace-missing-work-items-analysis.md)  
全面分析報告：除了 86 個頁面重新設計，還識別出 47 個額外工作項（基礎設施、技術債務、服務層整合等）

### 📦 套件索引

#### @delon 套件 (delon-index/)
完整索引：[delon-index/README.md](./delon-index/README.md)

#### NG-ZORRO 元件 (ng-zorro-index/)
完整索引：[ng-zorro-index/README.md](./ng-zorro-index/README.md)

---

## 🎯 按角色查找

### 前端開發者

#### 必讀文檔
1. [快速開始指南](./guides/getting-started.md)
2. [開發最佳實踐](./guides/development-best-practices.md)
3. [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md)
4. [現代化語法規範](./specs/00-modern-syntax-standards.md)
5. [Component 規範](./specs/00-component-standards.md)

### 後端開發者

#### 必讀文檔
1. [快速開始指南](./guides/getting-started.md)
2. [完整 SQL 表結構定義](./reference/sql-schema-definition.md)
3. [Supabase 架構流程圖](./architecture/17-supabase-architecture-flowchart.mermaid.md)
4. [RLS 策略開發指南](./guides/rls-policy-development-guide.md)
5. [API 規範](./specs/00-api-standards.md)

### 架構師

#### 必讀文檔
1. [完整架構流程圖](./architecture/20-complete-architecture-flowchart.mermaid.md) ⭐⭐⭐⭐⭐
2. [架構審查報告](./architecture/21-architecture-review-report.md) ⭐⭐⭐⭐⭐
3. [系統架構思維導圖](./architecture/01-system-architecture-mindmap.mermaid.md)
4. [完整 SQL 表結構定義](./reference/sql-schema-definition.md)

---

## 🔍 快速查詢

### 常見問題

| 需求 | 文檔 |
|------|------|
| 如何開始開發？ | [快速開始指南](./guides/getting-started.md) |
| 如何匯入共用模組？ | [SHARED_IMPORTS 使用指南](./reference/shared-imports-guide.md) |
| 資料表有哪些欄位？ | [SQL 表結構定義](./reference/sql-schema-definition.md) |
| Git-like 分支模型是什麼？ | [完整架構流程圖](./architecture/20-complete-architecture-flowchart.mermaid.md) |
| 如何寫測試？ | [測試指南](./guides/testing-guide.md) |
| 遇到問題怎麼辦？ | [開發疑難排解指南](./guides/development-troubleshooting-guide.md) |

---

## 🎯 核心架構要點

### Git-like 分支模型 🌟

專案採用類似 Git 的分支模型進行專案管理：主分支（業主控制）+ 組織分支（協作者控制）+ PR 審查機制 + 48小時暫存區可撤回。

詳見：[完整架構流程圖](./architecture/20-complete-architecture-flowchart.mermaid.md) ⭐⭐⭐⭐⭐

### 51 張資料表架構 🗄️

系統包含 51 張資料表，分為 11 個業務模組：使用者、專案、工作區、任務、問題、PR、文件、活動、通知、搜尋、暫存區。

詳見：[SQL 表結構定義](./reference/sql-schema-definition.md) ⭐⭐⭐⭐⭐

---

## 📊 統計資訊

- **總文檔數**: 80+ 個
- **技術棧**: Angular 20.3.x + NG-ZORRO 20.3.x + ng-alain 20.1.x + Supabase 2.81.x
- **架構版本**: v2.0 (Git-like 分支模型 + 51 張資料表)

---

**維護者**: 開發團隊  
**最後更新**: 2025-01-20  
**文檔版本**: 2.0 (標準化重組版)

> 💡 **提示**：如果您是新成員，建議按照[快速開始](#-快速開始)章節的順序閱讀文檔。
