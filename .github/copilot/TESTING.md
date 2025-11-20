# GitHub Copilot MCP 測試指南

> 🧪 驗證 MCP 伺服器配置與功能的完整測試指南

## 📋 測試前檢查清單

- [ ] GitHub Copilot Agent 已安裝並啟用
- [ ] Node.js 18+ 已安裝
- [ ] `mcp.json` 配置檔已就緒
- [ ] API Tokens 已設定並有效
- [ ] 網路連線正常

## 🧪 測試計畫

### 階段 1：配置驗證（5 分鐘）

#### 1.1 JSON 語法驗證
```bash
# 驗證 JSON 語法
cat .github/copilot/mcp.json | python3 -m json.tool > /dev/null && echo "✅ JSON 語法正確" || echo "❌ JSON 語法錯誤"

# 檢查伺服器數量
cat .github/copilot/mcp.json | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'MCP 伺服器數量: {len(data[\"mcpServers\"])}')"
```

**預期結果**：
- ✅ JSON 語法正確
- ✅ 顯示 13 個 MCP 伺服器

#### 1.2 檔案權限檢查
```bash
# 檢查檔案是否可讀
ls -lh .github/copilot/mcp.json
```

**預期結果**：
- ✅ 檔案存在且可讀
- ✅ 檔案大小約 3KB

### 階段 2：基礎 MCP 伺服器測試（15 分鐘）

#### 2.1 Memory MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Memory MCP 建立一個名為 "test-project" 的實體，
類型為 "project"，並新增觀察 "這是一個測試專案"
```

**預期結果**：
- ✅ 成功建立實體
- ✅ 可以查詢到該實體

**驗證指令**：
```markdown
@copilot 請查詢 Memory 中是否有 "test-project" 實體
```

#### 2.2 Time MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Time MCP 取得當前時間
```

**預期結果**：
- ✅ 返回當前 UTC 時間
- ✅ 格式正確（ISO 8601）

#### 2.3 Everything MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Everything MCP 的 echo 工具，輸出 "Hello MCP!"
```

**預期結果**：
- ✅ 返回 "Hello MCP!"

#### 2.4 Filesystem MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Filesystem MCP 列出 src/app 目錄的內容
```

**預期結果**：
- ✅ 列出目錄內容
- ✅ 包含 core, shared, layout, routes 等目錄

### 階段 3：進階 MCP 伺服器測試（30 分鐘）

#### 3.1 Supabase MCP 測試
**前置條件**：
- Supabase 專案存在
- Token 有效
- 網路可連線

**測試指令**：
```markdown
@copilot 請使用 Supabase MCP 列出所有資料庫表
```

**預期結果**：
- ✅ 返回資料庫表列表
- ✅ 包含專案的主要表（如 users, organizations 等）

**進階測試**：
```markdown
@copilot 請使用 Supabase MCP 查詢 users 表的結構
```

#### 3.2 Git MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Git MCP 顯示最近 5 次 commit
```

**預期結果**：
- ✅ 顯示 commit 列表
- ✅ 包含 commit hash, message, author, date

**進階測試**：
```markdown
@copilot 請使用 Git MCP 顯示當前分支名稱
```

#### 3.3 GitHub MCP 測試
**測試指令**：
```markdown
@copilot 請使用 GitHub MCP 查詢 7Spade/ng-alain-gighub 專案的 README.md
```

**預期結果**：
- ✅ 返回 README.md 內容
- ✅ 格式正確

**進階測試**：
```markdown
@copilot 請使用 GitHub MCP 列出最近 5 個 issues
```

#### 3.4 Sequential Thinking MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Sequential Thinking 分析以下問題：
「如何設計一個可擴展的使用者權限系統？」
請提供至少 5 個思考步驟。
```

**預期結果**：
- ✅ 提供結構化的思考步驟
- ✅ 包含問題分析、方案設計、實作考量等
- ✅ 每個步驟邏輯清晰

#### 3.5 Software Planning Tool MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Software Planning Tool 建立一個「使用者登入功能」的開發計畫，
包含以下任務：
1. 前端登入表單 UI
2. 表單驗證邏輯
3. API 整合
4. 錯誤處理
5. 單元測試
```

**預期結果**：
- ✅ 建立結構化的開發計畫
- ✅ 每個任務有明確的描述
- ✅ 可以查詢任務列表

**驗證指令**：
```markdown
@copilot 請顯示剛才建立的開發計畫中的所有任務
```

#### 3.6 Redis MCP 測試
**測試指令**：
```markdown
@copilot 請使用 Redis MCP 設定一個 key 為 "test:key" 的值為 "test-value"，
並設定 60 秒後過期
```

**預期結果**：
- ✅ 成功設定 key
- ✅ 可以讀取該 key

**驗證指令**：
```markdown
@copilot 請使用 Redis MCP 讀取 "test:key" 的值
```

### 階段 4：瀏覽器自動化測試（20 分鐘）

#### 4.1 Puppeteer MCP 測試（需要 Chrome/Chromium）

**基礎測試**：
```markdown
@copilot 請使用 Puppeteer 執行以下操作：
1. 導航至 https://www.google.com
2. 截圖並保存
3. 返回頁面標題
```

**預期結果**：
- ✅ 成功導航至 Google
- ✅ 截圖保存成功
- ✅ 返回正確的頁面標題

**進階測試**（如果有本地開發環境）：
```markdown
@copilot 請使用 Puppeteer 測試本地應用：
1. 導航至 http://localhost:4200
2. 檢查是否有登入按鈕
3. 截圖保存
```

#### 4.2 Playwright MCP 測試

**測試指令**：
```markdown
@copilot 請使用 Playwright 執行以下操作：
1. 在 Chromium 中打開 https://github.com
2. 截圖
3. 返回頁面 URL
```

**預期結果**：
- ✅ 成功在 Chromium 中打開頁面
- ✅ 截圖成功
- ✅ 返回正確的 URL

### 階段 5：整合測試（30 分鐘）

#### 5.1 多 MCP 伺服器協同測試
**測試指令**：
```markdown
@copilot 請執行以下完整流程：
1. 使用 Sequential Thinking 分析「如何實作一個待辦事項功能」
2. 使用 Software Planning Tool 建立開發計畫
3. 使用 Supabase MCP 查詢 todos 表是否存在
4. 使用 Filesystem MCP 檢查是否已有相關的 Component 檔案
5. 使用 Memory MCP 儲存這次的分析結果
```

**預期結果**：
- ✅ 所有步驟順利執行
- ✅ 各 MCP 伺服器協同工作
- ✅ 最終產生完整的分析與計畫

#### 5.2 實際開發流程測試
**測試指令**：
```markdown
@copilot 我要開發一個「使用者個人資料編輯」功能，請協助：
1. 使用 Sequential Thinking 分析需求
2. 查詢 Supabase 中 users 表的結構
3. 建立 Software Planning 開發計畫
4. 檢查 src/app/routes 目錄結構
5. 產生 Component 和 Service 的基礎代碼
6. 使用 Memory 儲存這次的設計決策
```

## 📊 測試結果記錄

### 測試摘要表

| MCP 伺服器 | 基礎測試 | 進階測試 | 整合測試 | 備註 |
|-----------|---------|---------|---------|------|
| Memory | ⬜ | ⬜ | ⬜ | |
| Time | ⬜ | ⬜ | ⬜ | |
| Everything | ⬜ | ⬜ | ⬜ | |
| Filesystem | ⬜ | ⬜ | ⬜ | |
| Supabase | ⬜ | ⬜ | ⬜ | |
| Git | ⬜ | ⬜ | ⬜ | |
| GitHub | ⬜ | ⬜ | ⬜ | |
| Sequential Thinking | ⬜ | ⬜ | ⬜ | |
| Software Planning | ⬜ | ⬜ | ⬜ | |
| Redis | ⬜ | ⬜ | ⬜ | |
| Puppeteer | ⬜ | ⬜ | ⬜ | 需要 Chrome |
| Playwright | ⬜ | ⬜ | ⬜ | 需要瀏覽器 |
| Fetch | ⬜ | ⬜ | ⬜ | |

### 測試符號說明
- ⬜ 未測試
- ✅ 通過
- ⚠️ 部分通過
- ❌ 失敗

## 🐛 故障排除

### 常見問題

#### 1. MCP 伺服器無法連線
**症狀**：Agent 回應「無法連接到 MCP 伺服器」

**可能原因**：
- Token 無效或過期
- 網路連線問題
- 伺服器地址錯誤

**解決方案**：
```bash
# 驗證 Token
# GitHub Token
curl -H "Authorization: Bearer YOUR_GITHUB_TOKEN" https://api.github.com/user

# Supabase Token
curl -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  https://pfxxjtvnqptdvjfakotc.supabase.co/rest/v1/

# Redis 連線
redis-cli -h redis-13923.c299.asia-northeast1-1.gce.cloud.redislabs.com \
  -p 13923 -a YOUR_PASSWORD ping
```

#### 2. Puppeteer 無法執行
**症狀**：提示「找不到 Chrome/Chromium」

**解決方案**：
```bash
# 安裝 Chromium
# Ubuntu/Debian
sudo apt-get install chromium-browser

# macOS
brew install chromium

# 或使用 npx 自動下載
npx puppeteer browsers install chrome
```

#### 3. JSON 語法錯誤
**症狀**：配置檔無法載入

**解決方案**：
```bash
# 驗證 JSON
cat .github/copilot/mcp.json | python3 -m json.tool

# 或使用 jq
jq . .github/copilot/mcp.json

# 比對範例檔案
diff .github/copilot/mcp.json .github/copilot/mcp.json.example
```

#### 4. Token 權限不足
**症狀**：API 操作被拒絕

**解決方案**：
- 檢查 GitHub Token 權限範圍
- 確認 Supabase Token 是 Service Role Key
- 驗證 Redis 密碼正確

## 📈 效能基準

### 預期回應時間

| MCP 伺服器 | 基礎操作 | 複雜操作 |
|-----------|---------|---------|
| Memory | < 1s | < 2s |
| Filesystem | < 1s | < 3s |
| Git | < 2s | < 5s |
| Supabase | < 2s | < 10s |
| GitHub | < 3s | < 10s |
| Redis | < 1s | < 2s |
| Puppeteer | < 5s | < 30s |

## ✅ 驗收標準

### 最低要求
- [ ] 至少 10 個 MCP 伺服器測試通過
- [ ] 基礎操作全部正常
- [ ] 無安全性警告
- [ ] 文檔齊全

### 理想狀態
- [ ] 全部 13 個 MCP 伺服器測試通過
- [ ] 進階操作測試通過
- [ ] 整合測試通過
- [ ] 效能符合基準
- [ ] 無故障或警告

## 📝 測試報告範本

```markdown
## MCP 測試報告

**測試日期**：YYYY-MM-DD
**測試人員**：Your Name
**環境**：GitHub Copilot Agent vX.X.X

### 測試結果
- 通過：X/13
- 失敗：X/13
- 跳過：X/13

### 失敗項目
1. [伺服器名稱] - [失敗原因] - [解決方案]

### 建議
[改進建議]

### 附件
- 測試截圖
- 錯誤日誌
```

---

**最後更新**：2025-11-20  
**維護者**：開發團隊
