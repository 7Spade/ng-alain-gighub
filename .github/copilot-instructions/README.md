# GitHub Copilot 全局指令

> **目的**：統一管理 VSCode GitHub Copilot 整合的全局指令文件

## 📁 文件說明

本目錄包含 GitHub Copilot 在 VSCode 中使用的全局指令文件，用於指導 Copilot 在不同場景下的行為。

### 文件清單

| 文件名 | 用途 | 使用場景 |
|--------|------|----------|
| `.copilot-instructions.md` | 主要開發指引 | 日常代碼開發、功能實現 |
| `.copilot-review-instructions.md` | 程式碼審查指引 | Pull Request 審查、代碼品質檢查 |
| `.copilot-commit-message-instructions.md` | Commit 訊息規範 | 提交代碼時生成符合規範的訊息 |
| `.copilot-pull-request-description-instructions.md` | PR 描述規範 | 創建 Pull Request 時生成描述 |
| `.copilot-test-instructions.md` | 測試產生指引 | 生成單元測試、E2E 測試 |

## 🔧 VSCode 設定整合

這些文件已在 `.vscode/settings.json` 中配置：

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions/.copilot-instructions.md" }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "file": ".github/copilot-instructions/.copilot-review-instructions.md" }
  ],
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "file": ".github/copilot-instructions/.copilot-commit-message-instructions.md" }
  ],
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    { "file": ".github/copilot-instructions/.copilot-pull-request-description-instructions.md" }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    { "file": ".github/copilot-instructions/.copilot-test-instructions.md" }
  ]
}
```

## 🎯 使用方式

### 自動應用
這些指令會在 VSCode 中自動應用，無需手動操作：
- 當你使用 Copilot Chat 開發功能時，會參考 `.copilot-instructions.md`
- 當你使用 Copilot 審查代碼時，會參考 `.copilot-review-instructions.md`
- 當你生成 commit 訊息時，會參考 `.copilot-commit-message-instructions.md`
- 當你創建 PR 時，會參考 `.copilot-pull-request-description-instructions.md`
- 當你生成測試時，會參考 `.copilot-test-instructions.md`

### 手動更新
如果需要修改這些指令：
1. 直接編輯對應的 `.md` 文件
2. VSCode 會自動重新載入
3. 新的指令立即生效

## 📚 相關文檔

- **Agent Mode 配置**：[.github/agents/](../agents/) - GitHub Copilot Agent Mode 專用配置
- **專案記憶庫**：[.github/copilot/](../copilot/) - 專案知識庫與規範
- **開發規範**：[docs/](../../docs/) - 詳細開發文檔與架構設計

## 🔄 與 Agent Mode 的區別

| 特性 | Global Instructions（本目錄） | Agent Mode（.github/agents/） |
|------|------------------------------|------------------------------|
| **適用範圍** | VSCode Copilot Chat | GitHub Copilot Agent（獨立運行） |
| **觸發方式** | 自動應用於對話 | 通過 `@agent` 命令呼叫 |
| **配置位置** | .vscode/settings.json | .github/agents/ |
| **複雜度** | 簡潔的指引 | 完整的上下文與檢查清單 |
| **使用場景** | 日常開發輔助 | 複雜任務、架構設計、深度分析 |

---

**最後更新**：2025-01-22  
**維護者**：開發團隊
