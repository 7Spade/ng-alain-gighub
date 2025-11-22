# 技術棧與工具鏈

## 核心技術棧

```yaml
框架: Angular 20.3.x (Standalone + Signals)
語言: TypeScript 5.9.x (strict mode)
UI庫: NG-ZORRO ^20.3.x + ng-alain 20.x
狀態管理: RxJS 7.8.x + Angular Signals
資料庫: Supabase (PostgreSQL 15+)
工具: ESLint 9.x + Prettier + Yarn 4 + Husky
```

## MCP 工具鏈整合

### 1. Sequential Thinking（序列化思考）
**用途**：複雜問題的步驟化拆解與邏輯驗證

**使用場景**：
- 新功能開發前的架構設計
- 複雜業務邏輯的拆解
- 錯誤處理流程的推導
- 依賴關係的分析

**標準思考流程**：
```markdown
1. 問題分析 → 確認需求與目標
2. 架構規劃 → 確定層級與依賴
3. 邏輯拆解 → 分步驟實現
4. 檢查驗證 → 確保符合企業標準
5. 文檔輸出 → 記錄決策與理由
```

### 2. Software Planning Tool（軟體規劃）
**用途**：項目規劃、任務分解、時間估算

**使用場景**：
- 新模組開發計劃
- 重構計劃制定
- 技術債務評估
- 里程碑規劃

**標準規劃模板**：
```yaml
項目: {功能名稱}
目標: {業務目標}
範圍: {包含/不包含}
架構:
  - 層級: [Types, Repositories, Models, Services, Facades, Routes]
  - 依賴: {列出依賴關係}
任務拆解:
  - 第1步: Types 層 (2h)
  - 第2步: Repositories 層 (4h)
  - 第3步: Models 層 (2h, 可並行)
  - 第4步: Services 層 (6h)
  - 第5步: Facades 層 (4h)
  - 第6步: Routes/Components 層 (8h)
  - 第7步: 測試與文檔 (4h)
風險: {技術風險、依賴風險}
檢查點: {每個步驟的驗證標準}
```

### 3. Supabase MCP
**用途**：資料庫操作、類型生成、RLS 策略驗證

**使用場景**：
- 生成 database.types.ts
- 驗證資料表設計
- 檢查 RLS 策略
- 執行資料庫查詢

**標準操作流程**：
```bash
# 1. 生成類型定義
supabase gen types typescript --project-id {project-id}

# 2. 驗證 RLS 策略
supabase db inspect --schema public

# 3. 測試資料庫連接
supabase db test
```

### 4. Filesystem MCP
**用途**：文件操作、程式碼生成、結構檢查

**使用場景**：
- 創建新模組文件結構
- 檢查導出鏈完整性
- 批量重構文件
- 生成樣板代碼

### 5. Memory MCP

> **⚠️ 重要限制**：`store_memory` 工具在 GitHub Agent 環境中**不可用**（會返回 "Resource not found" 錯誤）。
> 
> **替代方案**：
> - ✅ 在 PR 描述中建議 memory.jsonl 更新
> - ✅ 使用 report_progress 記錄關鍵決策
> - ✅ 創建文檔文件記錄重要模式
> - ✅ 人工審查後更新 memory.jsonl

**用途**：記憶上下文、學習模式、優化建議（僅限本地開發環境）

**使用場景**（僅限本地 Copilot）：
- 記住用戶偏好
- 學習項目模式
- 累積最佳實踐
- 提供個性化建議

**在 GitHub Agent 中的替代流程**：
```markdown
當發現值得記錄的模式或規範時：
1. 在 PR 描述中添加 "建議更新 memory.jsonl" 章節
2. 描述具體的實體和關係
3. 由人工審查後更新 memory.jsonl
```

### 6. Everything MCP
**用途**：全局搜索、快速定位、依賴分析

**使用場景**：
- 搜索類似實現
- 定位依賴關係
- 查找使用示例
- 分析影響範圍

### 7. Context7 MCP
**用途**：上下文理解、語義分析、智能建議

**使用場景**：
- 理解業務需求
- 分析代碼意圖
- 提供智能補全
- 優化命名建議

### 8. Redis MCP
**用途**：存儲與讀取開發原則、規範、最佳實踐

**使用場景**：
- 存儲 SRP 原則
- 存儲企業標準
- 存儲開發順序
- 存儲錯誤處理流程

**Redis 數據結構**：
```typescript
principles:srp           - SRP 原則
principles:development   - 開發順序與檢查清單
principles:error        - 錯誤處理流程
patterns:repository     - Repository 模式
patterns:facade         - Facade 模式
standards:naming        - 命名規範
standards:typescript    - TypeScript 規範
```

## 常用開發與測試工具

### 9. Git (Version Control)
**用途**：版本控制操作 (High Priority)
**使用場景**：代碼提交、分支管理、合併衝突解決
**基礎用法**：
```bash
# 創建新功能分支
git checkout -b feature/user-auth

# 提交變更（遵循 Conventional Commits）
git add .
git commit -m "feat(auth): implement login logic"

# 推送到遠端
git push origin feature/user-auth
```

### 10. Playwright (E2E Testing)
**用途**：Angular 端對端測試 (High Priority)
**使用場景**：關鍵業務流程驗證、自動化回歸測試
**基礎用法**：
```bash
# 運行所有測試
npx playwright test

# 運行 UI 模式（可視化排錯）
npx playwright test --ui

# 錄製新測試腳本
npx playwright codegen http://localhost:4200
```

### 11. Time (Data Management)
**用途**：資料管理系統的時間處理
**使用場景**：統一資料庫時間戳、跨時區一致性、效能計時
**基礎用法**：
```typescript
// 資料存儲：始終使用 UTC ISO 8601 格式
const dbTimestamp = new Date().toISOString(); 
// 輸出：2023-10-27T10:00:00.000Z

// 前端顯示：使用 date-fns 或 Intl 轉換為本地時間
// format(new Date(dbTimestamp), 'yyyy-MM-dd HH:mm:ss')
```

### 12. Fetch (API Testing)
**用途**：API 測試與資料獲取
**使用場景**：驗證後端端點、獲取遠端資源
**基礎用法**：
```typescript
// 1. 使用瀏覽器/Node 標準 Fetch API
const response = await fetch('https://api.example.com/v1/data');
if (!response.ok) throw new Error('Network response was not ok');
const data = await response.json();

// 2. 使用 MCP Fetch 工具 (Agent)
// call_tool: fetch { url: 'https://api.example.com/v1/data' }
```

### 13. Puppeteer (Browser Automation)
**用途**：替代的瀏覽器自動化
**使用場景**：生成 PDF、後端截圖、複雜爬蟲
**基礎用法**：
```typescript
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

---

**相關資源**：
- [MCP 工具工作流程指南](../guides/mcp-tools-workflow-guide.md) ⭐⭐⭐⭐⭐
- [開發順序指南](../guides/development-sequence-guide.md) ⭐⭐⭐⭐⭐
