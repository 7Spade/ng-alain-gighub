# .github 目錄說明

> **版本**：v3.1（企業標準 + ng-gighub 對齊）  
> **最後更新**：2025-01-22

---

## 📋 目錄概覽

本目錄包含 GitHub 相關的配置、工作流程、Agent 配置與自動化工具。所有內容已按企業標準組織，便於維護與擴展。

---

## 📂 目錄結構

```
.github/
├── README.md                     # 本文件
├── MIGRATION-GUIDE.md            # 遷移指南（含 v3.1 更新）
│
├── copilot-instructions.md       # ⭐ Copilot 指令入口（新增）
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
├── actions/                      # ⚙️ 自訂 GitHub Actions（新增）
│   └── README.md                 # Actions 使用指南
│
├── workflows/                    # 🔄 GitHub Actions 工作流程
│   ├── ci.yml                    # CI 流程
│   └── deploy-site.yml           # 部署流程
│
├── pull_request_template/        # 📋 多種 PR 模板（新增）
│   ├── README.md                 # 模板選擇指南
│   ├── feature.md                # 功能開發模板
│   ├── bugfix.md                 # Bug 修復模板
│   └── documentation.md          # 文檔更新模板
│
├── ISSUE_TEMPLATE/               # 📝 Issue 模板
│   └── config.yml                # Issue 配置
│
├── CONTRIBUTING.md               # 🤝 貢獻指南（新增）
├── SECURITY.md                   # 🔒 安全政策（新增）
├── LICENSE                       # 📜 授權條款（新增）
├── labels.yml                    # 🏷️ GitHub 標籤配置（新增）
├── dependabot.yml                # 🤖 Dependabot 配置（新增）
│
├── CODEOWNERS                    # 👥 代碼所有者配置
├── FUNDING.yml                   # 💰 贊助配置
├── PULL_REQUEST_TEMPLATE.md      # 📋 預設 PR 模板
├── alain-bot.yml                 # 🤖 機器人配置
├── lock.yml                      # 🔒 自動鎖定配置
├── no-response.yml               # ⏰ 無回應處理配置
└── semantic.yml                  # 📦 語意化版本配置
```

---

## 🎯 各目錄說明

### 0. copilot-instructions.md - Copilot 指令入口（新增）
**用途**：GitHub Copilot 的規範入口文件

**特點**：
- 📌 **規範入口**：GitHub Copilot 和 Copilot Agents 的統一入口
- 🎯 **核心規則**：包含最重要的開發規範和標準
- 🔗 **索引導航**：連結到詳細的指令文件和配置
- 📚 **快速參考**：提供專案技術棧和架構概覽

**何時參考**：
- 開始使用 Copilot 前閱讀一次
- 需要快速查看核心規則
- 不確定如何使用 Copilot 功能時

**詳細說明**：[copilot-instructions.md](./copilot-instructions.md)

---

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

### 4. actions/ - 自訂 GitHub Actions（新增）
**用途**：可重複使用的自訂 GitHub Actions

**特點**：
- 📦 **封裝常用操作**：將重複的工作流程步驟封裝為 Action
- 🔄 **提升可維護性**：集中管理工作流程邏輯
- 🚀 **加速 CI/CD**：可在多個 workflow 中重複使用

**預計用途**（目前為空，未來擴展）：
- 環境設定 Actions（Node.js、快取）
- 建置 Actions（TypeScript 編譯、產品建置）
- 測試 Actions（單元測試、E2E 測試）
- 部署 Actions（環境部署）

**詳細說明**：[actions/README.md](./actions/README.md)

---

### 5. workflows/ - GitHub Actions 工作流程
**用途**：CI/CD 自動化工作流程

**包含內容**：
- `ci.yml`：持續整合流程（測試、建構、檢查）
- `deploy-site.yml`：自動部署流程

**使用場景**：
- 自動執行測試和建構
- 自動部署到生產環境
- PR 自動檢查

---

### 6. pull_request_template/ - 多種 PR 模板（新增）
**用途**：針對不同類型變更的專門 PR 模板

**可用模板**：
- **feature.md**：新功能開發（五層架構檢查清單）
- **bugfix.md**：Bug 修復（根因分析、回歸預防）
- **documentation.md**：文檔更新

**使用方式**：
```
創建 PR 時加上 URL 參數：
?template=feature.md
?template=bugfix.md
?template=documentation.md
```

**特點**：
- 🎯 **專門化**：針對不同變更類型的特定要求
- ✅ **檢查清單**：完整的 checklist 確保品質
- 📋 **結構化**：統一的 PR 描述格式

**詳細說明**：[pull_request_template/README.md](./pull_request_template/README.md)

---

### 7. ISSUE_TEMPLATE/ - Issue 模板
**用途**：標準化 Issue 創建流程

**包含內容**：
- Issue 配置
- Bug 報告模板
- 功能請求模板

---

### 8. 社群標準文件（新增）

#### CONTRIBUTING.md - 貢獻指南
**包含內容**：
- 🚀 開發環境設定
- 💻 開發工作流程
- 📏 代碼標準
- 📝 Commit 訊息規範
- 🔍 Pull Request 流程
- 🧪 測試要求

**詳細說明**：[CONTRIBUTING.md](./CONTRIBUTING.md)

#### SECURITY.md - 安全政策
**包含內容**：
- 🚨 漏洞回報流程
- 🛡️ 安全最佳實踐
- 🔒 內建安全功能
- 📋 安全檢查清單

**詳細說明**：[SECURITY.md](./SECURITY.md)

#### LICENSE - 授權條款
**授權類型**：MIT License  
**詳細內容**：[LICENSE](./LICENSE)

---

### 9. 自動化配置文件（新增）

#### labels.yml - GitHub 標籤配置
**標籤分類**：
- **類型標籤**：feature, bug, documentation, refactor, test, chore
- **優先級**：critical, high, medium, low
- **狀態**：needs review, in progress, blocked, on hold
- **領域**：frontend, backend, database, infrastructure, security
- **大小**：XS, S, M, L, XL

**用途**：統一的 Issue 和 PR 標籤管理

#### dependabot.yml - Dependabot 配置
**自動更新範圍**：
- 📦 **npm 套件**：每週一更新
- ⚙️ **GitHub Actions**：每月更新
- 🔄 **分組更新**：Angular、NG-ZORRO、Testing 套件分組

**特點**：自動創建 PR 更新依賴，保持專案安全性

---

### 10. 全局配置文件
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
1. **快速入門**：
   - 先閱讀 [copilot-instructions.md](./copilot-instructions.md) 了解核心規則 ⭐
   - 自動載入 `copilot-instructions/` 中的詳細指令
   - 直接使用 Copilot Chat 即可

2. **Agent Mode（複雜任務）**：
   - 閱讀 [agents/README.md](./agents/README.md)
   - 查看 [agents/INDEX.md](./agents/INDEX.md) 快速導航
   - 按需求選擇對應的配置文件

### 我想貢獻代碼
1. 閱讀 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解貢獻流程
2. 查看 [pull_request_template/](./pull_request_template/) 選擇合適的 PR 模板
3. 遵循 [copilot-instructions.md](./copilot-instructions.md) 的代碼標準

### 我想了解專案規範
1. 查閱 [copilot/memory.jsonl](./copilot/memory.jsonl)
2. 閱讀 [copilot/MEMORY_SUMMARY.md](./copilot/MEMORY_SUMMARY.md)
3. 參考 [agents/guides/](./agents/guides/) 詳細指南

### 我想回報安全問題
1. 閱讀 [SECURITY.md](./SECURITY.md) 了解回報流程
2. **勿公開回報**：使用 GitHub Security Advisories
3. 提供詳細資訊協助修復

### 我想設定 CI/CD
1. 查看 [workflows/ci.yml](./workflows/ci.yml)
2. 參考 [actions/](./actions/) 了解自訂 Actions
3. 檢查 [dependabot.yml](./dependabot.yml) 自動更新配置

---

## 📊 v3.1 企業標準重組（新版本）

### v3.1 新增功能（2025-01-22）
1. **✨ Copilot 入口文件**：新增 `copilot-instructions.md` 作為規範入口
2. **✨ 自訂 Actions 支援**：新增 `actions/` 目錄
3. **✨ 多種 PR 模板**：新增 `pull_request_template/` 目錄
4. **✨ 社群標準文件**：新增 `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE`
5. **✨ 自動化配置**：新增 `labels.yml`, `dependabot.yml`
6. **✨ 對齊 ng-gighub**：結構與 ng-gighub 參考倉庫對齊

### v3.0 主要改進（歷史）
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

- **總文件數**：70+ 個（新增 11 個文件）
- **配置目錄**：8 個主要目錄（新增 2 個）
- **Agent 配置**：30+ 個文件
- **PR 模板**：4 個（預設 + 3 個專用）
- **社群文件**：3 個（CONTRIBUTING, SECURITY, LICENSE）
- **自動化工具**：4 個腳本
- **歷史歸檔**：9 個報告

---

**維護者**：開發團隊  
**版本歷史**：
- v3.1（2025-01-22）：對齊 ng-gighub 結構，新增社群標準文件
- v3.0（2025-01-22）：企業標準重組
- v2.0（2025-01-15）：Agent 配置優化
- v1.0（2024）：初始版本
