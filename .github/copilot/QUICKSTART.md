# GitHub Copilot MCP 快速開始指南

> 🚀 5 分鐘快速上手 GitHub Copilot MCP 伺服器整合

## 什麼是 MCP？

**MCP (Model Context Protocol)** 是一個開放協議，讓 AI 助手（如 GitHub Copilot Agent）能夠安全地連接到外部工具和資料來源。

## 📋 前置需求

- ✅ GitHub Copilot Agent 存取權限
- ✅ Node.js 18+ 和 npx
- ✅ 對應的 API Tokens（GitHub、Supabase、Redis 等）

## 🎯 立即開始

### 1. 檢查配置

配置檔已就緒：`.github/copilot/mcp.json`

```bash
# 驗證 JSON 語法
cat .github/copilot/mcp.json | python3 -m json.tool
```

### 2. 使用 MCP 伺服器

GitHub Copilot Agent 會自動載入配置，直接在對話中使用：

#### 📊 查詢 Supabase 資料庫

```markdown
@copilot 請列出 Supabase 資料庫中所有的表
```

Agent 會使用 Supabase MCP 的 `list_tables` 工具。

#### 🤔 使用結構化思考

```markdown
@copilot 請使用 Sequential Thinking 分析如何實作使用者登入流程，
包括前端驗證、後端 API、資料庫設計和錯誤處理
```

Agent 會使用 Sequential Thinking MCP 進行步驟化分析。

#### 📝 建立開發計畫

```markdown
@copilot 請建立「待辦事項管理功能」的開發計畫，
包含任務分解、優先級排序和時程估算
```

Agent 會使用 Software Planning Tool 建立結構化計畫。

#### 🧪 執行 UI 測試

```markdown
@copilot 請使用 Puppeteer 測試以下流程：
1. 打開 http://localhost:4200/login
2. 填入帳號 admin@example.com
3. 填入密碼 admin123
4. 點擊登入按鈕
5. 驗證是否導向首頁
6. 截圖保存
```

Agent 會使用 Puppeteer MCP 執行瀏覽器自動化。

#### 💾 使用 Redis 快取

```markdown
@copilot 請在 Redis 中設定一個 key 為 "user:1:profile" 的快取，
值為 JSON 格式的使用者資料，過期時間 1 小時
```

Agent 會使用 Redis MCP 操作快取。

#### 📁 檔案系統操作

```markdown
@copilot 請列出 src/app/routes 目錄下所有的 component.ts 檔案
```

Agent 會使用 Filesystem MCP 瀏覽檔案。

## 🎨 實用範例

### 範例 1：完整功能開發流程

```markdown
@copilot 我需要開發一個「使用者設定」功能，請幫我：
1. 使用 Sequential Thinking 分析需求和設計
2. 使用 Software Planning Tool 建立開發計畫
3. 查詢 Supabase 確認 users 表結構
4. 產生必要的 Angular Component 和 Service
5. 撰寫單元測試
```

### 範例 2：資料庫遷移

```markdown
@copilot 請檢查 Supabase 資料庫中 organizations 表的結構，
並建議如何新增「logo_url」和「description」欄位的遷移腳本
```

### 範例 3：效能測試

```markdown
@copilot 請使用 Puppeteer 測試首頁載入效能：
1. 導航至首頁
2. 測量頁面載入時間
3. 檢查是否有 404 錯誤
4. 截圖保存結果
```

### 範例 4：程式碼審查

```markdown
@copilot 請使用 Git MCP 查看最近 5 次 commit 的變更，
並使用 Sequential Thinking 分析是否符合專案規範
```

## 📊 可用的 MCP 伺服器

| 伺服器 | 主要指令範例 | 適用場景 |
|--------|-------------|----------|
| **Supabase** | 列出表、執行 SQL、部署 Edge Function | 資料庫操作、架構查詢 |
| **Redis** | set/get/delete key | 快取管理、會話儲存 |
| **Sequential Thinking** | 分析、規劃、問題分解 | 複雜邏輯設計、架構決策 |
| **Software Planning** | 建立計畫、新增任務 | 專案管理、任務追蹤 |
| **GitHub** | 查詢 issues、PR、commits | 專案協作、版本追蹤 |
| **Puppeteer** | 瀏覽、點擊、截圖 | UI 測試、自動化操作 |
| **Git** | commit、branch、diff | 版本控制、代碼審查 |
| **Filesystem** | 讀寫檔案、瀏覽目錄 | 檔案操作、代碼產生 |
| **Memory** | 建立實體、新增觀察 | 持久化記憶、上下文保存 |

## 🔍 進階技巧

### 組合使用多個 MCP 伺服器

```markdown
@copilot 請執行以下任務：
1. 使用 Sequential Thinking 分析需求
2. 使用 Software Planning 建立計畫
3. 查詢 Supabase 資料庫結構
4. 使用 Filesystem 產生必要的檔案
5. 使用 Git 記錄變更
6. 使用 Memory 保存重要決策
```

### 持續對話與記憶

```markdown
# 第一次對話
@copilot 我想開發一個部落格系統，請使用 Sequential Thinking 分析

# 第二次對話（Agent 會記住前面的分析）
@copilot 根據剛才的分析，請建立 Software Planning 計畫

# 第三次對話
@copilot 請使用 Memory 儲存我們的設計決策，以便未來參考
```

## ⚠️ 注意事項

### 安全性
- 🔒 定期檢查 `mcp.json` 中的 Tokens 是否洩漏
- 🔑 定期輪換 API Tokens
- 🚫 不要在公開 Repository 中提交真實的 Tokens

### 最佳實踐
- ✅ 明確指定要使用的 MCP 伺服器
- ✅ 提供清晰的指令和預期結果
- ✅ 組合多個工具以完成複雜任務
- ✅ 使用 Memory 保存重要的上下文

### 常見問題

**Q: Agent 沒有使用我指定的 MCP 伺服器？**  
A: 確認 `mcp.json` 語法正確，並重啟 GitHub Copilot Agent。

**Q: Supabase MCP 連線失敗？**  
A: 檢查 Token 權限和專案 ID 是否正確。

**Q: Puppeteer 無法執行？**  
A: 確認環境中已安裝 Chrome/Chromium。

**Q: 如何查看 MCP 伺服器日誌？**  
A: GitHub Copilot Agent 會在執行時顯示相關日誌。

## 📚 延伸閱讀

- 📘 [完整 MCP 配置說明](./README.md)
- 🔐 [安全性注意事項](./SECURITY.md)
- 🎯 [GitHub Agents 使用說明](../agents/README.md)
- 📖 [MCP 官方規範](https://spec.modelcontextprotocol.io/)

## 🆘 需要協助？

遇到問題時：
1. 查閱 [README.md](./README.md) 完整文檔
2. 檢查 [SECURITY.md](./SECURITY.md) 安全設定
3. 參考 [mcp.json.example](./mcp.json.example) 範例配置
4. 查看 GitHub Copilot Agent 錯誤訊息

---

**快速提示**：開始時先用簡單的指令測試每個 MCP 伺服器，確認連線正常後再執行複雜任務。

**最後更新**：2025-11-20  
**維護者**：開發團隊
