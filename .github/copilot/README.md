# GitHub Copilot MCP 配置說明

> **目的**：為 GitHub Copilot Agent 配置 MCP (Model Context Protocol) 伺服器，提供增強的工具和資料來源整合。

## 📁 目錄結構

```
.github/copilot/
├── mcp.json          # MCP 伺服器配置檔（本檔案）
├── mcp.json.example  # 配置範例模板
├── memory.jsonl      # Memory MCP 伺服器的記憶體儲存
├── README.md         # 本說明文件（完整配置說明）
├── QUICKSTART.md     # 5 分鐘快速上手指南
├── SECURITY.md       # 安全性注意事項
└── TESTING.md        # 測試指南與驗收標準
```

## 🔧 MCP 伺服器配置

### 已配置的 MCP 伺服器

`.github/copilot/mcp.json` 檔案包含以下 13 個 MCP 伺服器配置：

#### 1. Redis (`redis`)
- **類型**：Local
- **用途**：資料快取與儲存
- **連線**：Redis Labs Cloud（asia-northeast1-1）
- **工具**：所有 Redis 操作（set, get, delete, list 等）

#### 2. Sequential Thinking (`sequential-thinking`)
- **類型**：Local
- **用途**：結構化思考與問題分解
- **工具**：思考鏈工具，幫助 Agent 進行複雜推理

#### 3. Software Planning Tool (`software-planning-tool`)
- **類型**：Local
- **來源**：GitHub (NightTrek/Software-planning-mcp)
- **用途**：軟體開發規劃與任務管理
- **工具**：start_planning, save_plan, add_todo, remove_todo, get_todos, update_todo_status

#### 4. Everything (`everything`)
- **類型**：Local
- **用途**：示範各種 MCP 功能
- **工具**：echo, add, longRunningOperation, sampleLLM, getTinyImage 等

#### 5. Filesystem (`filesystem`)
- **類型**：Local
- **用途**：檔案系統存取
- **根目錄**：`./`（專案根目錄）
- **工具**：檔案讀寫、目錄瀏覽

#### 6. GitHub (`github`)
- **類型**：HTTP
- **用途**：GitHub API 整合
- **認證**：使用 GitHub Personal Access Token
- **工具**：Repository、Issues、Pull Requests、Commits 等操作

#### 7. Memory (`memory`)
- **類型**：Local
- **用途**：持久化記憶體儲存
- **儲存位置**：`./.github/copilot/memory.jsonl`
- **工具**：create_entities, create_relations, add_observations 等

#### 8. Supabase (`supabase`)
- **類型**：HTTP
- **用途**：Supabase 資料庫整合
- **專案**：pfxxjtvnqptdvjfakotc
- **認證**：使用 Supabase Service Bearer Token
- **工具**：
  - 資料庫查詢：list_tables, execute_sql, apply_migration
  - 日誌查詢：get_logs
  - 安全檢查：get_advisors
  - Edge Functions：list_edge_functions, deploy_edge_function
  - 分支管理：create_branch, list_branches, merge_branch

#### 9. Git (`git`)
- **類型**：Local
- **用途**：Git 版本控制操作
- **工具**：commit, branch, merge, diff, log 等

#### 10. Time (`time`)
- **類型**：Local
- **用途**：時間相關操作
- **工具**：獲取當前時間、時區轉換等

#### 11. Fetch (`fetch`)
- **類型**：Local
- **用途**：HTTP 請求
- **工具**：GET, POST, PUT, DELETE 等 HTTP 操作

#### 12. Puppeteer (`puppeteer`)
- **類型**：Local
- **用途**：Chrome/Chromium 瀏覽器自動化
- **工具**：
  - puppeteer_navigate：導航至 URL
  - puppeteer_screenshot：截圖
  - puppeteer_click：點擊元素
  - puppeteer_fill：填寫表單
  - puppeteer_evaluate：執行 JavaScript

#### 13. Playwright (`playwright`)
- **類型**：Local
- **用途**：跨瀏覽器自動化測試
- **工具**：類似 Puppeteer，但支援多瀏覽器

## 🚀 使用方式

### 啟用 MCP 伺服器

GitHub Copilot Agent 會自動讀取 `.github/copilot/mcp.json` 配置檔。當 Agent 執行任務時，它會根據需要自動連接到配置的 MCP 伺服器。

### 使用範例

#### 範例 1：使用 Supabase MCP 查詢資料庫表

```markdown
@copilot 請列出 Supabase 資料庫中所有的表
```

Agent 會使用 Supabase MCP 的 `list_tables` 工具。

#### 範例 2：使用 Sequential Thinking 分解複雜問題

```markdown
@copilot 請使用結構化思考分析如何實作使用者認證流程
```

Agent 會使用 Sequential Thinking MCP 進行思考鏈推理。

#### 範例 3：使用 Software Planning Tool 規劃開發任務

```markdown
@copilot 請建立一個新功能的開發計畫
```

Agent 會使用 Software Planning Tool 建立規劃。

#### 範例 4：使用 Puppeteer 進行 UI 測試

```markdown
@copilot 請使用 Puppeteer 測試登入頁面
```

Agent 會使用 Puppeteer MCP 進行瀏覽器自動化測試。

## 🔐 安全考量

### Token 管理

配置檔中包含以下敏感資訊：

1. **Redis 連線字串**：包含密碼
2. **GitHub Personal Access Token**：用於 GitHub API 存取
3. **Supabase Service Bearer Token**：用於 Supabase API 存取

### 最佳實踐

- ✅ **不要**將 `mcp.json` 提交到公開的 Git Repository
- ✅ **建議**將敏感資訊移至環境變數
- ✅ **定期**輪換 API Tokens
- ✅ **限制** Token 權限範圍（最小權限原則）
- ✅ **監控** Token 使用情況

### 安全改進建議

考慮使用環境變數替代硬編碼的 Token：

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_TOKEN}"
      },
      "tools": ["*"]
    }
  }
}
```

## 📝 配置檔案格式

### MCP 伺服器配置結構

```typescript
interface MCPServerConfig {
  type: 'local' | 'http';
  
  // Local 類型專屬
  command?: string;           // 執行命令（通常是 'npx'）
  args?: string[];           // 命令參數
  env?: Record<string, string>; // 環境變數
  
  // HTTP 類型專屬
  url?: string;              // API URL
  headers?: Record<string, string>; // HTTP Headers
  
  // 共用
  tools: string[];           // 可用的工具列表（'*' 表示全部）
}
```

### 完整配置範例

參考 `.github/copilot/mcp.json` 檔案。

## 🔄 維護與更新

### 新增 MCP 伺服器

1. 在 `mcp.json` 的 `mcpServers` 物件中新增伺服器配置
2. 更新本 README.md 文件
3. 測試新伺服器功能

### 移除 MCP 伺服器

1. 從 `mcp.json` 移除對應配置
2. 更新本 README.md 文件

### 更新 Token

1. 產生新的 API Token
2. 更新 `mcp.json` 中的 Token
3. 測試連線

## 🐛 故障排除

### MCP 伺服器無法連線

1. 檢查網路連線
2. 驗證 Token 是否有效
3. 確認 API URL 正確
4. 查看 GitHub Copilot 錯誤日誌

### Redis 連線失敗

1. 確認 Redis 伺服器運行中
2. 驗證連線字串正確
3. 檢查防火牆設定

### Supabase 操作失敗

1. 確認 Supabase 專案存在
2. 驗證 Token 權限
3. 檢查 RLS 策略

## 📚 相關資源

### 官方文件
- [Model Context Protocol (MCP) 規範](https://spec.modelcontextprotocol.io/)
- [GitHub Copilot Agent 文件](https://docs.github.com/en/copilot)
- [Supabase MCP 伺服器](https://github.com/supabase/mcp)

### 專案文件
- [GitHub Agents 使用說明](../agents/README.md)
- [專案開發規範](../../AGENTS.md)
- [快速開始指南](../agents/QUICK-START.md)

## 📋 檢查清單

### 配置前
- [ ] 確認需要的 MCP 伺服器類型
- [ ] 準備必要的 API Tokens
- [ ] 了解各伺服器的功能與限制

### 配置後
- [ ] 驗證 JSON 語法正確
- [ ] 測試每個 MCP 伺服器連線（參考 [TESTING.md](./TESTING.md)）
- [ ] 確認 Token 權限適當
- [ ] 更新相關文件

### 安全檢查
- [ ] Token 已妥善保管（參考 [SECURITY.md](./SECURITY.md)）
- [ ] 權限範圍最小化
- [ ] 監控機制已設置
- [ ] 定期輪換計畫

## 📖 相關文件

### 本目錄文件
- 📘 [README.md](./README.md) - 本檔案，完整配置說明
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - 5 分鐘快速上手指南
- 🔐 [SECURITY.md](./SECURITY.md) - 安全性注意事項與最佳實踐
- 🧪 [TESTING.md](./TESTING.md) - 測試指南與驗收標準
- 📝 [mcp.json.example](./mcp.json.example) - 配置範例模板

### 專案文件
- 📚 [GitHub Agents 使用說明](../agents/README.md)
- 🎯 [快速開始指南](../agents/QUICK-START.md)
- 📖 [專案開發規範](../../AGENTS.md)

### 外部資源
- 🌐 [Model Context Protocol (MCP) 規範](https://spec.modelcontextprotocol.io/)
- 🤖 [GitHub Copilot Agent 文件](https://docs.github.com/en/copilot)
- 🔗 [Supabase MCP 伺服器](https://github.com/supabase/mcp)

---

**最後更新**：2025-11-20  
**維護者**：開發團隊  
**版本**：v1.0
