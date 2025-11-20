# 安全性注意事項

## ⚠️ 重要：敏感資訊管理

### MCP 配置檔案
`mcp.json` 檔案包含以下敏感資訊：
- Redis 連線字串（包含密碼）
- GitHub Personal Access Token
- Supabase Service Bearer Token

### 🔒 安全建議

#### 1. 不要將 mcp.json 提交到公開 Repository
如果這是一個公開專案，請將 `mcp.json` 加入 `.gitignore`：

```bash
echo ".github/copilot/mcp.json" >> .gitignore
```

#### 2. 使用範例檔案
使用 `mcp.json.example` 作為模板：

```bash
cp .github/copilot/mcp.json.example .github/copilot/mcp.json
# 然後編輯 mcp.json 填入實際的 tokens
```

#### 3. 使用環境變數（推薦）
考慮修改配置以使用環境變數：

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

#### 4. 定期輪換 Tokens
- 至少每 90 天輪換一次 API Tokens
- 發現外洩時立即輪換
- 使用 Token 到期日設定

#### 5. 最小權限原則
確保 Tokens 僅擁有必要的權限：

**GitHub Token 權限**：
- `repo`：若需存取私有 Repository
- `read:org`：若需讀取組織資訊
- 避免授予 `admin` 或 `delete` 權限

**Supabase Token**：
- 使用 Service Role Key（僅在安全環境）
- 或使用具有適當 RLS 策略的 Anon Key

#### 6. 監控 Token 使用
- 定期檢查 GitHub Token 使用記錄
- 監控 Supabase API 使用量
- 設定異常警報

### 🔍 檢查清單

提交前檢查：
- [ ] 確認是否為私有 Repository
- [ ] 如為公開專案，已將 `mcp.json` 加入 `.gitignore`
- [ ] Tokens 權限已最小化
- [ ] 已設定 Token 到期日
- [ ] 已建立 Token 輪換計畫
- [ ] 團隊成員了解安全規範

### 📚 相關文件
- [GitHub Token 最佳實踐](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- [Supabase 安全指南](https://supabase.com/docs/guides/api/api-keys)
- [MCP 配置說明](./README.md)

---

**最後更新**：2025-11-20  
**維護者**：開發團隊
