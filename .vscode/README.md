# VSCode 設定檔說明

此目錄包含 VSCode 的專案設定，特別針對 GitHub Copilot 和 AI 助手功能進行了優化。

## 📁 檔案說明

### settings.json
VSCode 工作區設定，包含：

#### GitHub Copilot 設定
- **基礎設定**：啟用 Copilot、選擇模型（GPT-5-Codex）、啟用程式碼動作
- **Chat 設定**：正體中文介面、專案範本、TypeScript 語言上下文
- **內嵌聊天**：時間上下文、按住說話功能
- **偵錯設定**：啟用偵錯命令和審查功能
- **測試設定**：測試產生和設定功能

#### Copilot 指引檔案整合 ⭐
以下設定將根目錄的 `.copilot-*.md` 檔案整合到 Copilot 功能中：

```json
// 程式碼產生指引 (Line 86-96)
"github.copilot.chat.codeGeneration.instructions": [
  { "file": ".copilot-instructions.md" }
]

// 程式碼審查指引 (Line 98-105)
"github.copilot.chat.reviewSelection.instructions": [
  { "file": ".copilot-review-instructions.md" }
]

// Commit 訊息指引 (Line 107-117)
"github.copilot.chat.commitMessageGeneration.instructions": [
  { "file": ".copilot-commit-message-instructions.md" }
]

// PR 描述指引 (Line 119-126)
"github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
  { "file": ".copilot-pull-request-description-instructions.md" }
]

// 測試產生指引 (Line 71-78)
"github.copilot.chat.testGeneration.instructions": [
  { "file": ".copilot-test-instructions.md" }
]
```

#### MCP (Model Context Protocol) 設定
- 啟用 MCP 支援
- 停用自動探索（避免干擾）
- MCP 伺服器設定（可依需求添加）

#### Agent Mode 設定
- 啟用 Agent 模式
- 最大請求次數：100
- 啟用任務執行和新工作區建立
- Terminal 捲軸行數：50000（供 Agent 使用）

#### 編輯器設定
- 自動格式化和程式碼修正
- TypeScript 和 ESLint 整合
- Prettier 格式化

### extensions.json
推薦的 VSCode 擴充套件：

#### 必備擴充套件
- `github.copilot` - GitHub Copilot 主擴充套件
- `github.copilot-chat` - GitHub Copilot Chat 功能
- `cipchk.ng-alain-extension-pack` - ng-alain 開發套件

#### 開發工具
- `angular.ng-template` - Angular 模板支援
- `dbaeumer.vscode-eslint` - ESLint 整合
- `esbenp.prettier-vscode` - Prettier 格式化
- `stylelint.vscode-stylelint` - Stylelint 整合

#### 輔助工具
- `eamodio.gitlens` - Git 增強功能
- `yzhang.markdown-all-in-one` - Markdown 編輯（編輯 Agent 檔案用）

### launch.json
偵錯設定：

#### ng serve
啟動 Angular 開發伺服器並在 Chrome 中偵錯
- URL: http://localhost:4200/
- 自動執行 `npm start`

#### ng test
啟動 Karma 測試執行器並在 Chrome 中偵錯
- URL: http://localhost:9876/debug.html
- 自動執行 `npm test`

## 🚀 使用方式

### 初次設定
1. 開啟專案後，VSCode 會提示安裝推薦的擴充套件
2. 點擊「安裝所有推薦的擴充套件」
3. 等待安裝完成並重新載入 VSCode

### GitHub Copilot 功能

#### 程式碼產生
1. 開始撰寫程式碼
2. Copilot 會根據 `.copilot-instructions.md` 提供建議
3. 建議會符合專案的 Angular 20 + Signals 規範

#### 程式碼審查
1. 選取要審查的程式碼
2. 右鍵 → "Copilot" → "Review Selection"
3. Copilot 會根據 `.copilot-review-instructions.md` 提供審查意見

#### Commit 訊息產生
1. 在 Source Control 面板中
2. 點擊 Commit Message 欄位旁的 ✨ 圖示
3. Copilot 會根據 `.copilot-commit-message-instructions.md` 產生符合 Conventional Commits 的訊息

#### PR 描述產生
1. 在 GitHub Pull Request 擴充套件中建立 PR
2. Copilot 會根據 `.copilot-pull-request-description-instructions.md` 產生描述

#### 測試產生
1. 在程式碼檔案中
2. 右鍵 → "Copilot" → "Generate Tests"
3. Copilot 會根據 `.copilot-test-instructions.md` 產生測試

### Agent Mode
1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. 輸入 "Copilot: Start Agent"
3. 描述你的任務
4. Agent 會參考 `.github/agents/` 中的檔案執行任務

### 偵錯
1. 按 F5 或點擊 Run and Debug 面板
2. 選擇 "ng serve" 或 "ng test"
3. VSCode 會啟動對應的偵錯工作階段

## 🔧 自訂設定

### 新增 MCP 伺服器
在 `settings.json` 的 `mcp.servers` 中新增：

```json
"mcp": {
  "servers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/server.js"]
    }
  }
}
```

### 調整 Copilot 行為
修改對應的指引檔案：
- 程式碼風格 → `.copilot-instructions.md`
- 審查標準 → `.copilot-review-instructions.md`
- Commit 格式 → `.copilot-commit-message-instructions.md`
- PR 模板 → `.copilot-pull-request-description-instructions.md`
- 測試模式 → `.copilot-test-instructions.md`

## 📚 相關文件

- [根目錄 Copilot 指引](../.copilot-instructions.md) - 主要開發指引
- [GitHub Agents 目錄](../.github/agents/README.md) - Agent Mode 指引
- [Cursor 規則目錄](../.cursor/rules/README.md) - Cursor IDE 規則
- [AGENTS.md](../AGENTS.md) - AI 助手總覽

## ⚙️ 疑難排解

### Copilot 沒有讀取指引檔案
1. 確認檔案路徑正確（根目錄的 `.copilot-*.md`）
2. 重新載入 VSCode (`Ctrl+Shift+P` → "Reload Window")
3. 檢查 Copilot 輸出面板是否有錯誤訊息

### Agent Mode 無法啟動
1. 確認已安裝 `github.copilot` 和 `github.copilot-chat` 擴充套件
2. 檢查 `chat.agent.enabled` 設定為 `true`
3. 重新登入 GitHub Copilot

### 偵錯無法啟動
1. 確認已執行 `yarn install`
2. 檢查 Chrome 是否已安裝
3. 嘗試手動執行 `yarn start` 或 `yarn test`

---

**版本**：v2.0  
**最後更新**：2025-11-18  
**維護者**：開發團隊
