# 34個檔案處理摘要 (Quick Reference Guide)

**用途**: 快速查閱34個配置檔案的處理決策  
**日期**: 2025-11-17

---

## 📌 一分鐘總結

### 問題
G1 分支需要與 main 分支同步,涉及 34+ 個配置檔案。

### 解決方案
✅ **Main 優先策略**: 使用 main 的檔案為主,保留 g1 的 MCP 配置

### 結果
- **新增**: 10 個 main 獨有檔案
- **更新**: 55+ 個共有檔案
- **保留**: 1 個 g1 獨有檔案

---

## 📋 檔案清單和處理決策

### 第一類: Main 新增檔案(直接採用)✅

| # | 檔案路徑 | 用途 | 動作 |
|---|---------|------|------|
| 1 | `.github/instructions/README.md` | 指令系統說明 | ✅ 新增 |
| 2 | `.github/instructions/core.instructions.md` | Core 模組指引 | ✅ 新增 |
| 3 | `.github/instructions/documentation.instructions.md` | 文件標準 | ✅ 新增 |
| 4 | `.github/instructions/routes.instructions.md` | Routes 模組指引 | ✅ 新增 |
| 5 | `.github/instructions/shared.instructions.md` | Shared 模組指引 | ✅ 新增 |
| 6 | `.github/instructions/testing.instructions.md` | 測試標準 | ✅ 新增 |
| 7 | `.cursor/rules/development-principles.mdc` | 開發原則 | ✅ 新增 |
| 8 | `.github/agents/ng-alain-project-agent.md` | 專案代理 | ✅ 新增 |
| 9 | `.github/role-config.md` | 角色配置 | ✅ 新增 |

**小計**: 9 個新增檔案

---

### 第二類: G1 獨有檔案(保留)⚠️

| # | 檔案路徑 | 用途 | 動作 |
|---|---------|------|------|
| 10 | `.cursor/mcp.json` | MCP 工具配置 | ⚠️ 保留 g1 版本 |

**小計**: 1 個保留檔案  
**原因**: 包含 Context7 API 金鑰和開發工具配置

---

### 第三類: 關鍵共有檔案(Main 優先)🔄

| # | 檔案路徑 | Main 優勢 | 動作 |
|---|---------|-----------|------|
| 11 | `.github/copilot-instructions.md` | 包含認證系統文件 | 🔄 更新為 main |
| 12 | `.cursor/rules/angular.mdc` | Angular 20 最新實踐 | 🔄 更新為 main |
| 13 | `.cursor/rules/architecture.mdc` | 架構標準更新 | 🔄 更新為 main |
| 14 | `.cursor/rules/shared-imports.mdc` | SHARED_IMPORTS 模式 | 🔄 更新為 main |
| 15 | `.cursor/rules/testing.mdc` | 測試標準 | 🔄 更新為 main |

**小計**: 5 個關鍵更新

---

### 第四類: 其他 Cursor 規則檔案(批次更新)🔄

**27 個檔案**,全部更新為 main 版本:

| # | 檔案名稱 | # | 檔案名稱 |
|---|---------|---|---------|
| 16 | `README.md` | 17 | `accessibility.mdc` |
| 18 | `api-design.mdc` | 19 | `build-deploy.mdc` |
| 20 | `code-quality.mdc` | 21 | `core-specific.mdc` |
| 22 | `dependency-management.mdc` | 23 | `error-handling.mdc` |
| 24 | `formatting.mdc` | 25 | `git-model.mdc` |
| 26 | `git-workflow.mdc` | 27 | `layout-specific.mdc` |
| 28 | `linting.mdc` | 29 | `mcp-tools.mdc` |
| 30 | `modern-angular.mdc` | 31 | `path-aliases.mdc` |
| 32 | `performance.mdc` | 33 | `routes-specific.mdc` |
| 34 | `security.mdc` | 35 | `styling.mdc` |
| 36 | `theming.mdc` | 37 | `typescript.mdc` |
| 38 | `.cursor/templates/component.mdc` | 39 | `.cursor/templates/service.mdc` |
| 40 | `.cursor/modes.json` | 41 | `.cursorindexignore` |
| 42 | `.github/agents/README.md` | | |

**小計**: 27 個批次更新

---

## 🎯 執行命令速查

### 快速合併腳本

```bash
#!/bin/bash
# G1 分支快速同步腳本

# 1. 準備
git checkout g1
git checkout -b g1-sync-with-main

# 2. 新增 main 新檔案(9 個)
git checkout main -- .github/instructions/
git checkout main -- .cursor/rules/development-principles.mdc
git checkout main -- .github/agents/ng-alain-project-agent.md
git checkout main -- .github/role-config.md

# 3. 更新關鍵檔案(保留 mcp.json)
git checkout main -- .github/copilot-instructions.md

# 4. 批次更新 cursor 規則
cd .cursor/rules
for file in *.mdc; do
  if [ "$file" != "development-principles.mdc" ]; then
    git checkout main -- "$file"
  fi
done
cd ../..

# 5. 更新其他配置
git checkout main -- .cursor/modes.json
git checkout main -- .cursor/templates/
git checkout main -- .cursorindexignore
git checkout main -- .github/agents/README.md

# 6. 提交
git add .
git commit -m "chore: sync g1 with main branch updates"

echo "✅ 同步完成!"
```

### 驗證命令

```bash
# 檢查檔案數量
echo "Instructions: $(ls .github/instructions/*.md 2>/dev/null | wc -l) (expected: 6)"
echo "Cursor rules: $(ls .cursor/rules/*.mdc 2>/dev/null | wc -l) (expected: 28)"
echo "MCP config: $(test -f .cursor/mcp.json && echo 'EXISTS' || echo 'MISSING')"

# 檢查關鍵內容
grep -q "Authentication System" .github/copilot-instructions.md && echo "✓ Auth docs present"
grep -q "Context7" .cursor/mcp.json && echo "✓ MCP config preserved"
```

---

## 🔍 常見問題 (FAQ)

### Q1: 為什麼不直接合併 main 到 g1?
**A**: 因為是 grafted repository,分支有 unrelated histories。逐檔案處理更安全。

### Q2: 為什麼保留 g1 的 mcp.json?
**A**: 包含開發工具配置和 API 金鑰,main 沒有這個檔案。

### Q3: 會不會遺失 g1 的改進?
**A**: Main 已經包含所有重要改進,且新增了認證系統文件。G1 的版本較舊。

### Q4: 需要手動審查哪些檔案?
**A**: 建議審查:
- `.github/copilot-instructions.md` (確認認證文件完整)
- `.cursor/mcp.json` (確認 API 金鑰正確)
- `.cursor/rules/architecture.mdc` (理解架構變更)

### Q5: 如果出錯怎麼辦?
**A**: 
```bash
# 回到合併前狀態
git checkout g1
git branch -D g1-sync-with-main
# 重新開始
```

---

## ✅ 檢查清單

執行前:
- [ ] 已閱讀 `docs/CONFLICT_ANALYSIS.md`
- [ ] 已閱讀 `docs/MERGE_STRATEGY.md`
- [ ] 已備份當前 g1 分支

執行中:
- [ ] 新增 9 個 main 獨有檔案
- [ ] 保留 `.cursor/mcp.json`
- [ ] 更新 34+ 個共有檔案

執行後:
- [ ] 驗證檔案數量正確
- [ ] 檢查關鍵內容存在
- [ ] 測試 GitHub Copilot
- [ ] 測試 Cursor AI
- [ ] 提交變更

---

## 📞 快速聯絡

- **詳細分析**: `docs/CONFLICT_ANALYSIS.md`
- **執行策略**: `docs/MERGE_STRATEGY.md`
- **支援**: 開發團隊

---

**版本**: 1.0  
**最後更新**: 2025-11-17
