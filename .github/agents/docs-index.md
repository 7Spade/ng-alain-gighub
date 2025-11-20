# Docs Index for Agents

> **目的**：把 `docs/` 目錄內最常用的規範、架構與流程文件映射到單一查詢入口，協助 Context7 / Sequential Thinking / Software Planning Tool 快速定位來源。所有列出的路徑皆可直接在 Cursor / GitHub 中開啟。

> ⚠️ **重要更新（2025-11-20）**：文檔編號已更新，部分過時文件已移至 Archive。請使用此索引查找最新文檔。

## 🔧 使用方式
1. **Context7 查詢 →** 先以 `@C7 "<topic>"` 搜尋 Angular / ng-alain / Supabase 官方資料，確認關鍵字。
2. **比對本索引 →** 依任務性質找到對應分類，開啟建議文件深入閱讀。
3. **Sequential Thinking (`@S7`) →** 根據文件要求拆解目標、輸入/輸出、風險。
4. **Software Planning Tool (`@SPT`) →** 把文檔中的必跑指令、依賴與測試納入計畫。
5. **實作 / 審查 →** 在 PR / 交付敘述中引用本索引列出的檔案，確保可追溯。

## 📚 快速索引
| 類別 | 主要文件 | 摘要 |
| --- | --- | --- |
| 架構與總覽 | `docs/20-完整架構流程圖.mermaid.md`, `docs/21-架構審查報告.md`, `docs/01-系統架構思維導圖.mermaid.md` | Git-like Branch 模型、視覺化架構圖與審查依據 |
| 規劃與工作流程 | `docs/24-開發前檢查清單.md`, `docs/28-開發工作流程.md`, `docs/25-快速開始指南.md` | 任務開展前的檢查項、拆解步驟、環境建立流程 |
| 模組與元件 | `docs/37-SHARED_IMPORTS-使用指南.md`, `docs/40-共用元件清單.md`, `docs/38-ng-zorro-antd-組件清單與CLI指令.md` | SHARED_IMPORTS 定義、共用元件職責、NG-ZORRO 元件與 CLI 指令 |
| 資料與 API | `docs/22-完整SQL表結構定義.md`, `docs/23-資料表清單總覽.md`, `docs/26-API-接口詳細文檔.md`, `docs/27-資料模型對照表.md` | 51 張資料表欄位、模組分群、API 參數與模型映射 |
| 安全與權限 | `docs/34-安全檢查清單.md`, `docs/50-RLS策略開發指南.md`, `docs/09-安全與-RLS-權限矩陣.md` | Supabase RLS、前後端權限、依賴審查與密鑰控管 |
| 測試與品質 | `docs/31-測試指南.md`, `docs/48-代碼審查規範.md`, `docs/33-效能優化指南.md` | 單元/端對端測試基線、Code Review 要求、效能診斷 |
| 部署與監控 | `docs/32-部署指南.md`, `docs/18-部署基礎設施視圖.mermaid.md`, `docs/46-監控與告警配置指南.md` | CI/CD、Infra 架構、可觀測性與告警流程 |
| Agent 與協作 | `docs/43-Agent開發指南與限制說明.md`, `AGENTS.md`, `docs/41-AI助手角色配置.md` | AI Agent 規範、角色設定、上下文同步方式 |
| 背景與脈絡 | `docs/fyi-architecture.md`, `docs/fyi-development.md`, `docs/fyi-data.md`, `docs/fyi-rls.md` | 歷史決策、背景限制、數據模型、RLS 安全策略 |

> **提示**：若索引未涵蓋的檔案，可搜尋 `docs/` 或參考 `docs/README.md` 的完整清單，再將結果補回本文件。

## 🚨 已棄用的文檔（已移至 Archive）

以下文檔已於 2025-11-20 移至 `docs/Archive/`：
- **00-* 規範系列**（14 個文件）→ 請使用 `.cursor/rules/*.mdc` 代替
- **DELON-Index/ 和 NG-ZORRO-Index/**（~500KB）→ 請參考官方文檔或精簡版索引（docs/38, docs/39）
- **fyi-codebase.md**（2.2MB）→ 請使用 Repomix MCP 工具
- **FINAL-SUMMARY.md, SRP-*.md** → 已完成的報告

詳細說明請參考 `docs/Archive/deprecated-specs/README.md` 和 `docs/Archive/deprecated-indexes/README.md`

## 🧭 類別詳解

### 1. 架構與總覽
- `@file docs/01-系統架構思維導圖.mermaid.md`：系統架構總覽、模組關係
- `@file docs/20-完整架構流程圖.mermaid.md`：**Git-like Branch、Supabase、ng-alain 前端完整流向圖** ⭐⭐⭐
- `@file docs/21-架構審查報告.md`：**審查項目、KPI、風險清單**（生產就緒版）⭐⭐⭐
- `@file docs/02-專案結構流程圖.mermaid.md`：專案目錄結構

### 2. 規劃與工作流程
- `@file docs/24-開發前檢查清單.md`：開始開發前的必備檢查
- `@file docs/28-開發工作流程.md`：SOP、責任分工、審查節點
- `@file docs/25-快速開始指南.md`：環境設定、指令與啟動步驟 ⭐
- `@file docs/42-開發最佳實踐指南.md`：**代碼示例、開發模式、最佳實踐** ⭐⭐⭐

### 3. 模組與元件
- `@file docs/37-SHARED_IMPORTS-使用指南.md`：**共享導入策略、禁忌** ⭐⭐⭐
- `@file docs/40-共用元件清單.md`：每個共享組件的 selector、inputs/outputs
- `@file docs/38-ng-zorro-antd-組件清單與CLI指令.md`：Zorro 元件支援度、CLI 指令
- `@file docs/39-DELON-Index-索引.md`：DELON 套件索引與配置

### 4. 資料與 API
- `@file docs/22-完整SQL表結構定義.md`：**51 表欄位、索引、關聯**（完整定義）⭐⭐⭐
- `@file docs/23-資料表清單總覽.md`：模組分層、資料責任 ⭐⭐
- `@file docs/26-API-接口詳細文檔.md`：REST 定義、錯誤碼 ⭐⭐
- `@file docs/27-資料模型對照表.md`：前端模型 ↔ 資料庫欄位映射 ⭐⭐
- `@file docs/06-實體關係圖.mermaid.md`：ER 圖

### 5. 安全與權限
- `@file docs/34-安全檢查清單.md`：依賴審查、密鑰管理、回報流程
- `@file docs/50-RLS策略開發指南.md`：Supabase RLS 設計、測試方法 ⭐⭐
- `@file docs/09-安全與-RLS-權限矩陣.md`：跨模組權限矩陣、角色/branch 對應 ⭐⭐

### 6. 測試與品質
- `@file docs/31-測試指南.md`：測試矩陣、覆蓋率目標
- `@file docs/48-代碼審查規範.md`：CR 流程與審查清單
- `@file docs/33-效能優化指南.md`：前端/後端效能 best practices

### 7. 部署與監控
- `@file docs/32-部署指南.md`：build、deploy、rollback
- `@file docs/18-部署基礎設施視圖.mermaid.md`：Infra 拓樸、各服務角色
- `@file docs/46-監控與告警配置指南.md`：可觀測性、告警閾值

### 8. Agent 與協作
- `@file docs/43-Agent開發指南與限制說明.md`：**AI 協作邊界、輸出格式、限制說明** ⭐⭐⭐
- `@file AGENTS.md`：高層決策、規範索引 ⭐⭐
- `@file docs/41-AI助手角色配置.md`：Agent persona 與權限 ⭐⭐

### 9. 背景與脈絡（FYI 系列）
- `@file docs/fyi.md`：FYI 系列索引
- `@file docs/fyi-architecture.md`：架構說明與設計決策
- `@file docs/fyi-development.md`：開發脈絡與決策紀錄
- `@file docs/fyi-data.md`：數據模型與訪問模式
- `@file docs/fyi-rls.md`：RLS 安全脈絡與策略
- `@file docs/fyi-context.md`：業務背景與用語
- `@file docs/fyi-history.md`：歷史演進與里程碑

## 🔍 常見開發任務快速查找

| 任務 | 主要文檔 | 次要文檔 |
|------|---------|---------|
| 創建新元件 | `docs/37-SHARED_IMPORTS-使用指南.md` | `docs/42-開發最佳實踐指南.md` |
| 整合 API | `docs/26-API-接口詳細文檔.md` | `docs/30-錯誤處理指南.md` |
| 開發 RLS | `docs/50-RLS策略開發指南.md` | `docs/09-安全與-RLS-權限矩陣.md` |
| 編寫測試 | `docs/31-測試指南.md` | `.copilot-test-instructions.md` |
| 型別定義 | `docs/22-完整SQL表結構定義.md` | `docs/27-資料模型對照表.md` |
| 架構理解 | `docs/20-完整架構流程圖.mermaid.md` | `docs/21-架構審查報告.md` |

## 🗂️ 維護指引
1. **新增文件**：在 `docs/` 加入新指南後，立刻補充本索引並在 PR 描述中記錄。
2. **版本同步**：若文件大幅改版，請在相對應 agent（如 Angular / Security）中更新引用。
3. **自動化建議**：可用 `rg "docs/" -g "*.md"` 搜尋新檔案、或用 `ls docs` 產生列表後人工分類。
4. **定期審查**：每月檢查一次文件編號和路徑是否正確。

## 📊 文檔統計（更新後）
- **總核心文檔**：58 個（01-57 + 工作區系統 + FYI 系列）
- **已移至 Archive**：~30 個（00-* 規範、大型索引、完成報告）
- **規範來源**：`.cursor/rules/`（28 個規則文件）

---
**版本**：v2.0（2025-11-20）  
**維護者**：AI Agents 小組  
**主要更新**：修正文件編號、移除過時文檔、添加棄用說明
