# 五層架構開發順序

## 標準開發流程

```
第 1 步：Types 層（P0 - 必須最先完成）
  ↓
第 2 步：Repositories 層（P0 - 依賴 Types）
  ↓
第 3 步：Models 層（P0 - 可與 Repositories 並行）
  ↓
第 4 步：Services 層（P0 - 依賴 Repositories + Models）
  ↓
第 5 步：Facades 層（P0 - 依賴 Services）
  ↓
第 6 步：Routes/Components 層（P0 - 依賴 Facades）
  ↓
第 7 步：測試與文檔（P0 - 必須完成）
```

## 使用 MCP 工具的標準流程

### 開發前（使用 Sequential Thinking + Software Planning）

#### 1. 需求分析（Sequential Thinking）
```
步驟 1：理解業務需求
步驟 2：識別核心問題
步驟 3：確認技術可行性
步驟 4：評估複雜度
```

#### 2. 架構規劃（Software Planning）
```yaml
項目: {功能名稱}
層級規劃:
  - Types: 需要新增類型定義嗎？
  - Repositories: 需要新 Repository 嗎？
  - Models: 需要業務模型嗎？
  - Services: 需要新 Service 嗎？
  - Facades: 需要新 Facade 嗎？
時間估算: {總計 XX 小時}
```

#### 3. 資料庫設計（Supabase MCP）
```bash
# 檢查現有資料表
supabase db inspect

# 設計新資料表（如需要）
# 生成類型定義
supabase gen types typescript
```

### 開發中（使用 Filesystem + Redis，記錄在 PR 中）

#### 4. 創建文件結構（Filesystem MCP）
```bash
# 創建標準文件結構
mkdir -p src/app/core/infra/types
mkdir -p src/app/core/infra/repositories
mkdir -p src/app/shared/models
mkdir -p src/app/shared/services/{feature}
mkdir -p src/app/core/facades
mkdir -p src/app/routes/{feature}
```

#### 5. 讀取開發原則（Redis MCP）
```bash
# 讀取 SRP 原則
GET principles:srp

# 讀取開發順序
GET principles:development

# 讀取錯誤處理流程
GET principles:error
```

#### 6. 記錄開發決策（在 PR 描述中）

> **⚠️ 注意**：在 GitHub Agent 環境中，`store_memory` 工具不可用。
> 改為在 PR 描述中記錄關鍵決策和新發現的模式。

**記錄內容**：
- 為什麼選擇某種實現
- 遇到的問題與解決方案
- 值得記錄的新模式或規範
- 建議更新到 memory.jsonl 的內容

### 開發後（使用 Everything + Context7）

#### 7. 檢查類似實現（Everything MCP）
```bash
# 搜索類似的 Repository 實現
search "extends BaseRepository"

# 搜索類似的 Service 實現
search "inject(.*Repository)"
```

#### 8. 語義檢查與優化（Context7 MCP）
- 檢查命名是否語義化
- 檢查代碼意圖是否清晰
- 提供優化建議

---

**相關資源**：
- [開發順序指南](../guides/development-sequence-guide.md) ⭐⭐⭐⭐⭐
- [MCP 工具工作流程](../guides/mcp-tools-workflow-guide.md) ⭐⭐⭐⭐⭐
