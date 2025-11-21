# GitHub Copilot Instructions Setup

> 本文件說明此專案的 GitHub Copilot 指引配置，遵循 [GitHub Copilot 最佳實踐](https://gh.io/copilot-coding-agent-tips)。

## ✅ 設定狀態

此專案已完整配置 GitHub Copilot 指引系統，包含：

### 1. GitHub 標準位置 ⭐
- **檔案**：`.github/copilot-instructions.md`
- **說明**：GitHub Copilot 自動識別並使用的主要指引檔案
- **內容**：396 行，包含完整的開發規範、架構說明、安全指引等
- **狀態**：✅ 已配置並持續維護

### 2. VSCode 整合檔案
以下檔案透過 `.vscode/settings.json` 整合至 VSCode GitHub Copilot：

| 檔案 | 用途 | 狀態 |
|------|------|------|
| `.copilot-instructions.md` | 主要開發指引 | ✅ |
| `.copilot-commit-message-instructions.md` | Commit 訊息規範 | ✅ |
| `.copilot-pull-request-description-instructions.md` | PR 描述規範 | ✅ |
| `.copilot-review-instructions.md` | 程式碼審查指引 | ✅ |
| `.copilot-test-instructions.md` | 測試產生指引 | ✅ |

### 3. Agent 模式支援
- **目錄**：`.github/agents/`
- **檔案數**：27 個 Agent 定義檔案
- **領域專家**：Angular、TypeScript、Security、Testing 等
- **狀態**：✅ 已配置

### 4. Cursor IDE 規則
- **目錄**：`.cursor/rules/`
- **說明**：Cursor IDE 自動載入的詳細規範
- **狀態**：✅ 已配置

## 📋 驗證清單

根據 [GitHub Copilot 最佳實踐](https://gh.io/copilot-coding-agent-tips) 的要求：

### 基本要求
- [x] `.github/copilot-instructions.md` 檔案存在
- [x] 包含專案概述
- [x] 包含技術棧說明
- [x] 包含程式碼規範
- [x] 包含測試要求

### 進階要求
- [x] 包含架構說明
- [x] 包含安全指引
- [x] 包含工作流程
- [x] 包含錯誤處理指引
- [x] 包含效能考量
- [x] 包含可訪問性要求

### 整合配置
- [x] VSCode 設定檔案配置正確
- [x] 指引檔案路徑正確
- [x] 文件引用連結有效
- [x] 版本資訊完整

### 內容品質
- [x] 使用正體中文撰寫
- [x] 包含程式碼範例
- [x] 包含快速參考連結
- [x] 包含相關資源連結

## 🎯 使用方式

### GitHub Copilot Chat
1. 開啟 VSCode 中的 GitHub Copilot Chat
2. Copilot 會自動讀取 `.github/copilot-instructions.md`
3. 詢問任何開發相關問題時，Copilot 會遵循這些指引

### 程式碼產生
在 VSCode 中：
- Copilot 會根據 `.copilot-instructions.md` 產生符合專案規範的程式碼
- 測試產生會使用 `.copilot-test-instructions.md` 的規範
- Commit 訊息會遵循 `.copilot-commit-message-instructions.md`

### Agent 模式
使用 GitHub Copilot Workspace 或 Agent Mode 時：
- 系統會載入 `.github/agents/` 目錄下的專家代理
- 可以呼叫特定領域的專家進行諮詢

### PR 描述產生
在 GitHub PR 頁面：
- 點擊 "Copilot" 按鈕產生 PR 描述
- Copilot 會使用 `.copilot-pull-request-description-instructions.md` 的模板

## 🔧 維護指引

### 更新指引檔案
當需要更新 Copilot 指引時：

1. **確認變更範圍**
   - 主要規範：更新 `.github/copilot-instructions.md`
   - VSCode 特定：更新對應的 `.copilot-*.md` 檔案
   - Agent 模式：更新 `.github/agents/` 下的相關檔案

2. **測試變更**
   - 在 VSCode 中重新載入 Copilot
   - 測試程式碼產生是否符合新規範
   - 驗證 Commit 和 PR 描述產生

3. **更新版本資訊**
   - 更新檔案中的版本號
   - 記錄最後更新日期
   - 在 CHANGELOG 中記錄變更

### 驗證配置
執行驗證腳本確認配置正確：

```bash
# 檢查檔案結構
ls -l .github/copilot-instructions.md
ls -l .copilot-*.md
ls -l .github/agents/

# 驗證 VSCode 設定
grep "copilot" .vscode/settings.json

# 檢查檔案內容
wc -l .github/copilot-instructions.md
grep -c "^##" .github/copilot-instructions.md
```

## 📚 相關資源

### 官方文檔
- [GitHub Copilot 最佳實踐](https://gh.io/copilot-coding-agent-tips)
- [GitHub Copilot 文檔](https://docs.github.com/en/copilot)
- [VSCode GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)

### 專案文檔
- [AGENTS.md](../AGENTS.md) - AI 助手檔案組織結構總覽
- [開發作業指引](../docs/00-開發作業指引.md) - 完整開發規範
- [Agent 開發指南與限制說明](../docs/43-Agent開發指南與限制說明.md)
- [.github/agents/README.md](./agents/README.md) - Agent 模式說明

### 設定檔案
- [.vscode/settings.json](../.vscode/settings.json) - VSCode 設定
- [.cursor/rules/README.md](../.cursor/rules/README.md) - Cursor 規則

## 🆘 疑難排解

### Copilot 沒有遵循指引
1. 確認檔案路徑正確
2. 重新載入 VSCode
3. 清除 Copilot 快取
4. 檢查指引檔案語法是否正確

### 無法產生符合規範的程式碼
1. 檢查 `.copilot-instructions.md` 內容
2. 確認 `.vscode/settings.json` 設定正確
3. 嘗試更明確的提示詞
4. 參考範例程式碼

### Agent 模式無法使用
1. 確認 `.github/agents/` 目錄存在
2. 檢查 Agent 檔案格式
3. 驗證 Agent 定義是否完整
4. 參考 `.github/agents/README.md`

## 📝 變更記錄

### v1.0 (2025-11-20)
- ✅ 初始配置完成
- ✅ 建立 `.github/copilot-instructions.md`
- ✅ 配置 VSCode 整合檔案
- ✅ 建立 Agent 模式支援
- ✅ 建立本說明文件

---

**維護者**：開發團隊  
**最後更新**：2025-11-20  
**狀態**：✅ 已完成並運作中
