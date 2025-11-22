# Memory MCP 限制說明

## 問題描述

在 GitHub Copilot Agent 環境（GitHub Actions）中運行時，調用 `store_memory` 工具會出現以下錯誤：

```
Call to store_memory
Failed to store memory with error: Resource not found
```

## 根本原因

### 技術原因
1. **Memory MCP 服務器未配置**：Memory MCP 是一個需要特定後端服務的工具，在 GitHub Actions 環境中該服務未啟動或配置。
2. **環境差異**：本地開發環境（VSCode with GitHub Copilot）和 GitHub Actions 環境的 MCP 服務配置不同。
3. **資源不存在**：`store_memory` 工具嘗試連接到一個在當前環境中不存在的記憶存儲後端。

### 為什麼 memory.jsonl 存在但 store_memory 仍然失敗？
- `memory.jsonl` 是一個靜態文件，儲存在 Git 倉庫中
- `store_memory` 工具需要連接到動態的 Memory MCP 服務器來寫入記憶
- 這兩者是不同的系統：一個是文件系統，一個是 MCP 服務

## 影響範圍

### 受影響的操作
- ❌ 調用 `store_memory` 工具
- ❌ 所有文檔中提到 "記錄到 Memory MCP" 的步驟

### 不受影響的操作
- ✅ 讀取 `.github/copilot/memory.jsonl`（使用 `view` 或 `bash` 工具）
- ✅ 查詢記憶庫內容（使用 `grep`、`jq` 等命令）
- ✅ 所有其他 MCP 工具（Sequential Thinking、Software Planning、Supabase 等）

## 解決方案

### 方案 1：在 PR 描述中記錄（推薦）⭐⭐⭐⭐⭐

當發現值得記錄到 memory.jsonl 的新模式或規範時：

```markdown
## 建議更新 memory.jsonl

### 新增實體
**名稱**：Error Handling Pattern for API Calls  
**類型**：Design Pattern  
**觀察**：
- 所有 API 調用都應該使用 try-catch 包裹
- 錯誤應該轉換為用戶友好的消息
- Loading 狀態應該在 finally 塊中重置

**引用**：`src/app/shared/services/example.service.ts:45-60`

### 新增關係
- Error Handling Pattern → Service Layer Development（關係類型：implements）
- Error Handling Pattern → User Experience（關係類型：improves）
```

### 方案 2：使用 report_progress 記錄

在提交代碼時，將關鍵決策記錄在 commit message 和 PR 描述中：

```typescript
await report_progress({
  commitMessage: "feat: implement new error handling pattern",
  prDescription: `
## 完成的工作
- [x] 實現新的錯誤處理模式
- [x] 應用到所有 Service 層

## 關鍵決策
- 採用統一的錯誤處理策略（try-catch + finally）
- 所有錯誤都轉換為用戶友好的消息
- Loading 狀態在 finally 塊中重置，確保狀態一致性

## 建議更新 memory.jsonl
建議添加 "Error Handling Pattern for API Calls" 實體
  `
});
```

### 方案 3：創建文檔文件

對於重要的模式和規範，創建專門的文檔文件：

```bash
# 創建文檔
echo "# Error Handling Pattern

## 概述
統一的錯誤處理策略...

## 實現示例
\`\`\`typescript
async loadData() {
  this.loading.set(true);
  try {
    const data = await this.repository.getData();
    this.data.set(data);
  } catch (error) {
    this.error.set(this.formatError(error));
  } finally {
    this.loading.set(false);
  }
}
\`\`\`
" > docs/patterns/error-handling.md
```

### 方案 4：人工審查後更新

由項目維護者定期審查 PR 中的建議，手動更新 memory.jsonl：

1. 審查 PR 描述中的 "建議更新 memory.jsonl" 章節
2. 驗證建議的合理性
3. 手動編輯 `.github/copilot/memory.jsonl`
4. 提交更新

## 更新的配置文件

以下文件已更新，移除或替換了對 `store_memory` 的引用：

1. ✅ `.github/agents/ng-alain-github-agent.md` - 添加了限制說明和警告
2. ✅ `.github/agents/core/tech-stack.md` - 更新 Memory MCP 章節
3. ✅ `.github/agents/core/error-handling.md` - 移除 store_memory 引用
4. ✅ `.github/agents/core/checklists.md` - 更新檢查清單
5. ✅ `.github/agents/core/development-workflow.md` - 更新工作流程
6. ✅ `MEMORY-MCP-LIMITATION.md` - 新增專門的說明文件（本文件）

## 使用記憶庫的正確方式

### ✅ 正確做法

```bash
# 1. 查詢記憶庫（讀取操作，正常工作）
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("關鍵字"))'

# 2. 在 PR 描述中記錄新發現
# 使用 report_progress 提交時包含建議

# 3. 創建文檔文件記錄重要模式
# 使用 create 工具創建 markdown 文件
```

### ❌ 錯誤做法

```typescript
// ❌ 不要這樣做（會報錯）
await store_memory({
  subject: "Error Handling",
  fact: "Use try-catch-finally pattern",
  citations: "src/app/services/example.service.ts:45",
  reason: "Standard error handling approach",
  category: "general"
});
```

## 常見問題

### Q1: 為什麼不直接修改 memory.jsonl 文件？
**A**: 可以修改，但需要謹慎：
- ✅ 可以使用 `edit` 工具直接修改 memory.jsonl
- ⚠️ 但要確保 JSON 格式正確（每行一個完整的 JSON 對象）
- ⚠️ 建議由人工審查後再修改，避免格式錯誤

### Q2: 其他 MCP 工具也會有這個問題嗎？
**A**: 不會。只有 Memory MCP 受影響：
- ✅ Sequential Thinking Tool - 正常工作
- ✅ Software Planning Tool - 正常工作
- ✅ Supabase MCP - 正常工作
- ✅ Filesystem MCP - 正常工作（view、create、edit）
- ✅ Redis MCP - 如果配置了就正常工作
- ❌ Memory MCP - 在 GitHub Agent 環境中不可用

### Q3: 如何知道 Memory MCP 是否可用？
**A**: 檢查環境：
- **本地 VSCode**：Memory MCP 可能可用（取決於配置）
- **GitHub Agent Mode**：Memory MCP 不可用（確定）
- **測試方法**：嘗試調用，如果返回 "Resource not found" 則不可用

### Q4: 未來會修復這個問題嗎？
**A**: 這取決於 GitHub Copilot 團隊的實現：
- 如果 GitHub 在 Actions 環境中啟用 Memory MCP 服務，問題會自動解決
- 目前的替代方案（PR 描述 + 人工審查）是可靠的工作流程
- 建議持續使用當前的替代方案

## 總結

**核心要點**：
1. 🚫 不要在 GitHub Agent 中使用 `store_memory` 工具
2. ✅ 改為在 PR 描述中記錄建議更新
3. ✅ 使用 `view`/`bash` 讀取 memory.jsonl（正常工作）
4. ✅ 由人工審查後更新 memory.jsonl
5. ✅ 其他 MCP 工具不受影響，正常使用

**工作流程**：
```
Agent 發現新模式
    ↓
在 PR 描述中記錄建議
    ↓
使用 report_progress 提交
    ↓
人工審查 PR
    ↓
手動更新 memory.jsonl
    ↓
提交更新到主分支
```

---

**創建日期**：2025-01-22  
**最後更新**：2025-01-22  
**維護者**：開發團隊
