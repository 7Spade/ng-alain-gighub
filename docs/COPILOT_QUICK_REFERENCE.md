# Copilot 指引快速參考

> 快速查找本專案的 GitHub Copilot 指引檔案與使用方式

## 📁 檔案位置

### 主要指引檔案
| 檔案 | 位置 | 用途 | 行數 |
|------|------|------|------|
| GitHub 標準指引 | `.github/copilot-instructions.md` | GitHub Copilot 自動使用 | 396 |
| VSCode 主指引 | `.copilot-instructions.md` | VSCode 整合 | 26 |
| Commit 訊息 | `.copilot-commit-message-instructions.md` | Commit 訊息產生 | 30 |
| PR 描述 | `.copilot-pull-request-description-instructions.md` | PR 描述產生 | 441 |
| 代碼審查 | `.copilot-review-instructions.md` | 代碼審查指引 | 27 |
| 測試產生 | `.copilot-test-instructions.md` | 測試產生指引 | 484 |

### Agent 模式檔案
| 目錄 | 檔案數 | 用途 |
|------|--------|------|
| `.github/agents/` | 27 | Agent Mode 定義 |
| `.github/agents/domain/` | 16 | 領域專家 Agent |

### 相關文檔
| 檔案 | 用途 |
|------|------|
| `.github/COPILOT_SETUP.md` | Copilot 設定完整說明 |
| `AGENTS.md` | AI 助手檔案組織總覽 |
| `docs/43-Agent開發指南與限制說明.md` | Agent 開發詳細指引 |

## 🚀 快速使用

### 在 VSCode 中使用 Copilot

#### 產生符合規範的程式碼
1. 開啟任意檔案
2. 開始輸入或使用 Copilot Chat
3. Copilot 會自動讀取指引並產生符合專案規範的程式碼

#### 產生 Commit 訊息
1. 在 Git 面板中準備提交
2. 點擊 Copilot 圖示或使用快捷鍵
3. Copilot 會產生符合 Conventional Commits 規範的訊息

#### 產生 PR 描述
1. 在 GitHub PR 頁面
2. 點擊 "Copilot" 按鈕
3. Copilot 會使用模板產生完整的 PR 描述

#### 代碼審查
1. 選取要審查的程式碼
2. 右鍵選擇 "Copilot: Review Selection"
3. Copilot 會根據專案規範提供審查意見

#### 產生測試
1. 開啟要測試的檔案
2. 使用 "Copilot: Generate Tests"
3. Copilot 會產生符合專案測試規範的測試案例

### 使用 Agent 模式

#### 呼叫領域專家
```
@workspace 請 Angular 專家協助審查這個元件
@workspace 請 Security 專家檢查這段程式碼
@workspace 請 TypeScript 專家協助優化型別定義
```

#### 可用的領域專家
- `angular-agent` - Angular 開發專家
- `typescript-agent` - TypeScript 型別專家
- `security-agent` - 安全性專家
- `testing-agent` - 測試專家
- `code-quality-agent` - 代碼品質專家
- `performance-agent` - 效能優化專家
- `accessibility-agent` - 無障礙性專家
- `docs-agent` - 文檔撰寫專家

## ✅ 驗證設定

### 執行驗證腳本
```bash
bash scripts/validate-copilot-setup.sh
```

### 預期輸出
```
╔══════════════════════════════════════════════════════════════╗
║   GitHub Copilot Instructions Setup Validation              ║
╚══════════════════════════════════════════════════════════════╝

✅ Passed: 25
⚠️  Warnings: 0
❌ Failed: 0

╔═══════════════════════════════════════════════════════════════╗
║  🎉 所有檢查通過！Copilot 指引配置完整且符合最佳實踐。║
╚═══════════════════════════════════════════════════════════════╝
```

## 🔧 常見任務

### 更新指引內容
```bash
# 1. 編輯指引檔案
vim .github/copilot-instructions.md

# 2. 更新版本資訊
# 在檔案底部更新：
# - 文件版本
# - 最後更新日期
# - 變更說明

# 3. 驗證變更
bash scripts/validate-copilot-setup.sh

# 4. 提交變更
git add .github/copilot-instructions.md
git commit -m "docs: 更新 Copilot 指引 - [變更說明]"
```

### 新增領域專家 Agent
```bash
# 1. 在 .github/agents/domain/ 建立新檔案
touch .github/agents/domain/.copilot-newdomain-agent.md
touch .github/agents/domain/newdomain-agent.md

# 2. 參考現有 Agent 格式撰寫
cat .github/agents/domain/.copilot-angular-agent.md

# 3. 更新 .github/agents/README.md 新增說明

# 4. 驗證設定
bash scripts/validate-copilot-setup.sh
```

### 疑難排解

#### Copilot 沒有遵循指引
```bash
# 1. 確認檔案存在
ls -l .github/copilot-instructions.md

# 2. 檢查 VSCode 設定
grep "copilot" .vscode/settings.json

# 3. 重新載入 VSCode
# Cmd+Shift+P / Ctrl+Shift+P
# 選擇 "Developer: Reload Window"

# 4. 清除 Copilot 快取
# Cmd+Shift+P / Ctrl+Shift+P
# 選擇 "Copilot: Clear Cache"
```

#### 驗證腳本失敗
```bash
# 1. 查看詳細錯誤
bash scripts/validate-copilot-setup.sh 2>&1 | less

# 2. 檢查缺少的檔案
ls -l .github/copilot-instructions.md
ls -l .copilot-*.md

# 3. 修正後重新驗證
bash scripts/validate-copilot-setup.sh
```

## 📊 統計資訊

### 檔案統計
- 主要指引檔案：6 個
- Agent 定義檔案：27 個
- 總行數：~1,400 行
- 文檔引用連結：59 個

### 涵蓋範圍
- ✅ 專案架構與願景
- ✅ 技術棧說明 (Angular 20, NG-ZORRO, Supabase)
- ✅ 開發規範 (TypeScript, Angular, Testing)
- ✅ 安全指引 (RLS, 認證, 權限)
- ✅ 工作流程 (Git, Commit, PR)
- ✅ 品質要求 (Lint, Test, Build)
- ✅ UI/UX 規範 (NG-ZORRO, 可訪問性)
- ✅ 效能考量 (OnPush, Signals)

### 品質指標
- ✅ 25/25 驗證檢查通過
- ✅ 符合 GitHub 最佳實踐
- ✅ 正體中文撰寫
- ✅ 包含版本控制
- ✅ 提供維護指引

## 🔗 相關連結

### 官方文檔
- [GitHub Copilot 最佳實踐](https://gh.io/copilot-coding-agent-tips)
- [GitHub Copilot 文檔](https://docs.github.com/en/copilot)
- [Copilot for VSCode](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

### 專案文檔
- [.github/COPILOT_SETUP.md](../.github/COPILOT_SETUP.md)
- [AGENTS.md](../AGENTS.md)
- [docs/43-Agent開發指南與限制說明.md](../docs/43-Agent開發指南與限制說明.md)

---

**最後更新**：2025-11-20  
**維護者**：開發團隊  
**版本**：v1.0
