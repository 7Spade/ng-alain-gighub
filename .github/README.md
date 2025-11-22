# .github 目錄說明

> **版本**：v3.0（企業標準）  
> **最後更新**：2025-01-22

---

## 📋 目錄概覽

本目錄包含 GitHub 相關的配置、工作流程、Agent 配置與自動化工具。所有內容已按企業標準組織，便於維護與擴展。

---

## 📂 目錄結構

```
.github/
├── README.md                     # 本文件
├── MIGRATION-GUIDE.md            # v3.0 遷移指南
│
├── copilot-instructions/         # 🎯 全局 Copilot 指令（VSCode 整合）
│   ├── README.md
│   ├── .copilot-instructions.md
│   ├── .copilot-review-instructions.md
│   ├── .copilot-commit-message-instructions.md
│   ├── .copilot-pull-request-description-instructions.md
│   └── .copilot-test-instructions.md
│
├── agents/                       # 🤖 GitHub Copilot Agent 配置中心
│   ├── README.md                 # Agent 配置總覽（v3.0）
│   ├── INDEX.md                  # 快速索引與導航
│   ├── core/                     # 核心配置（8 個模組）
│   ├── guides/                   # 指南文件（6 個指南）
│   ├── domain/                   # 領域專家（8 個專家）
│   ├── tools/                    # 自動化工具（4 個工具）
│   └── archive/                  # 歷史文檔歸檔
│
├── copilot/                      # 💾 專案記憶庫（Knowledge Graph）
│   ├── memory.jsonl              # 149 實體 + 170 關係
│   ├── README.md
│   ├── MEMORY_SUMMARY.md
│   └── ...其他記憶庫文件
│
├── workflows/                    # 🔄 GitHub Actions 工作流程
│   ├── ci.yml                    # CI 流程
│   └── deploy-site.yml           # 部署流程
│
├── ISSUE_TEMPLATE/               # 📝 Issue 模板
│   └── config.yml                # Issue 配置
│
├── CODEOWNERS                    # 👥 代碼所有者配置
├── FUNDING.yml                   # 💰 贊助配置
├── PULL_REQUEST_TEMPLATE.md      # 📋 PR 模板
├── alain-bot.yml                 # 🤖 機器人配置
├── lock.yml                      # 🔒 自動鎖定配置
├── no-response.yml               # ⏰ 無回應處理配置
└── semantic.yml                  # 📦 語意化版本配置
```

---

## 🎯 各目錄說明

### 1. copilot-instructions/ - 全局 Copilot 指令
**用途**：VSCode GitHub Copilot 整合的全局指令文件

**包含內容**：
- 代碼生成指引
- 代碼審查標準
- Commit 訊息規範
- PR 描述模板
- 測試生成規範

**使用場景**：
- 日常開發中使用 Copilot Chat
- 自動生成符合規範的代碼和文檔
- VSCode 自動載入，無需手動操作

**詳細說明**：[copilot-instructions/README.md](./copilot-instructions/README.md)

---

### 2. agents/ - GitHub Copilot Agent 配置中心
**用途**：GitHub Copilot Agent Mode 的完整配置體系

**包含內容**：
- **core/**：8 個核心配置模組（Agent 行為標準）
- **guides/**：6 個詳細操作指南（如何執行）
- **domain/**：8 個領域專家配置（特定技術領域）
- **tools/**：4 個自動化工具（檢查與驗證）
- **archive/**：歷史文檔歸檔（已完成的報告）

**使用場景**：
- 使用 GitHub Copilot Agent Mode 進行複雜任務
- 架構設計與深度分析
- 企業級開發標準執行

**詳細說明**：[agents/README.md](./agents/README.md)  
**快速索引**：[agents/INDEX.md](./agents/INDEX.md)

---

### 3. copilot/ - 專案記憶庫
**用途**：專案知識圖譜與規範記憶庫

**包含內容**：
- `memory.jsonl`：149 個實體 + 170 個關係
- 架構設計原則
- 開發標準與最佳實踐
- 安全規範與效能優化
- 測試策略與文檔結構

**使用場景**：
- 每次任務開始前查閱相關規範
- 了解專案架構與設計決策
- 確保遵循一致的開發標準

**詳細說明**：[copilot/README.md](./copilot/README.md)

---

### 4. workflows/ - GitHub Actions
**用途**：CI/CD 自動化工作流程

**包含內容**：
- `ci.yml`：持續整合流程（測試、建構、檢查）
- `deploy-site.yml`：自動部署流程

**使用場景**：
- 自動執行測試和建構
- 自動部署到生產環境
- PR 自動檢查

---

### 5. ISSUE_TEMPLATE/ - Issue 模板
**用途**：標準化 Issue 創建流程

**包含內容**：
- Issue 配置
- Bug 報告模板
- 功能請求模板

---

### 6. 全局配置文件
**用途**：GitHub 倉庫級別的配置

**包含文件**：
- `CODEOWNERS`：代碼所有者與審查者
- `FUNDING.yml`：贊助資訊
- `PULL_REQUEST_TEMPLATE.md`：PR 描述模板
- `alain-bot.yml`：機器人自動化配置
- `lock.yml`：過期 Issue/PR 自動鎖定
- `no-response.yml`：無回應自動處理
- `semantic.yml`：語意化版本規範

---

## 🚀 快速開始

### 我想使用 GitHub Copilot
1. **VSCode 日常開發**：
   - 自動載入 `copilot-instructions/` 中的指令
   - 直接使用 Copilot Chat 即可

2. **Agent Mode（複雜任務）**：
   - 閱讀 [agents/README.md](./agents/README.md)
   - 查看 [agents/INDEX.md](./agents/INDEX.md) 快速導航
   - 按需求選擇對應的配置文件

### 我想了解專案規範
1. 查閱 [copilot/memory.jsonl](./copilot/memory.jsonl)
2. 閱讀 [copilot/MEMORY_SUMMARY.md](./copilot/MEMORY_SUMMARY.md)
3. 參考 [agents/guides/](./agents/guides/) 詳細指南

### 我想設定 CI/CD
1. 查看 [workflows/ci.yml](./workflows/ci.yml)
2. 參考 GitHub Actions 文檔
3. 根據專案需求調整配置

---

## 📊 v3.0 企業標準重組

### 主要改進
1. **✅ 模組化結構**：清晰的目錄層次與職責分離
2. **✅ 全局與專用分離**：copilot-instructions（全局）vs agents（專用）
3. **✅ 核心配置拆分**：31KB 大文件拆分為 8 個模組
4. **✅ 指南文件整合**：統一放入 guides/ 目錄
5. **✅ 歷史文檔歸檔**：完成的報告妥善保存

### 遷移說明
詳細遷移指南請參考：[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)

---

## 🔗 相關資源

### 專案文檔
- **完整文檔索引**：[docs/README.md](../docs/README.md)
- **系統架構圖**：[docs/architecture/](../docs/architecture/)
- **開發指南**：[docs/guides/](../docs/guides/)

### 開發工具配置
- **VSCode 設定**：[.vscode/settings.json](../.vscode/settings.json)
- **Cursor 規則**：[.cursor/rules/](../.cursor/rules/)
- **根目錄 AI 配置**：[AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md), [GEMINI.md](../GEMINI.md)

### 官方資源
- [GitHub Actions 文檔](https://docs.github.com/actions)
- [GitHub Copilot 文檔](https://docs.github.com/copilot)
- [Angular 官方文檔](https://angular.dev)

---

## 🆘 支援與回饋

### 問題回報
- 在 [ISSUE_TEMPLATE/](./ISSUE_TEMPLATE/) 中選擇合適的模板
- 提供詳細的問題描述與重現步驟

### 建議與改進
- 提交 Pull Request
- 參考 [PULL_REQUEST_TEMPLATE.md](./PULL_REQUEST_TEMPLATE.md)

### 文檔問題
- 查看 [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)
- 參考 [agents/INDEX.md](./agents/INDEX.md)

---

## 📈 目錄統計

- **總文件數**：60+ 個
- **配置目錄**：6 個主要目錄
- **Agent 配置**：30+ 個文件
- **自動化工具**：4 個腳本
- **歷史歸檔**：9 個報告

---

**維護者**：開發團隊  
**版本歷史**：
- v3.0（2025-01-22）：企業標準重組
- v2.0（2025-01-15）：Agent 配置優化
- v1.0（2024）：初始版本
