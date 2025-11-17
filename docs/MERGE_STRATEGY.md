# 分支合併策略 (Branch Merge Strategy)

**日期**: 2025-11-17  
**目標**: 將 g1 分支更新至與 main 分支一致  
**範圍**: 34+ 個配置檔案的處理策略

---

## 🎯 策略概述 (Strategy Overview)

### 核心原則
1. **Main 優先**: 使用 main 分支作為真實來源 (Source of Truth)
2. **保留價值**: 保留 g1 中有價值的配置
3. **向前兼容**: 確保更新不破壞現有功能
4. **逐步驗證**: 分階段執行,每階段都要驗證

### 關鍵決策

| 決策項 | 選擇 | 理由 |
|--------|------|------|
| 基準分支 | Main | 包含最新架構更新和認證系統文件 |
| MCP 配置 | 保留 g1 的 `.cursor/mcp.json` | 開發工具配置,需要保留 |
| 指令檔案 | 全部採用 main | 新的指令系統更完整 |
| Cursor 規則 | Main 為主,逐一審查 | Main 包含最新標準 |

---

## 📋 執行計畫 (Execution Plan)

### 階段 1: 準備工作 (5 分鐘)

```bash
# 1.1 建立工作分支
cd /home/runner/work/ng-alain-gighub/ng-alain-gighub
git checkout g1
git pull origin g1
git checkout -b g1-sync-with-main

# 1.2 確認狀態
git status
git log --oneline -5
```

**檢查點**:
- [ ] 分支建立成功
- [ ] 工作目錄乾淨

### 階段 2: 新增 Main 的新檔案 (10 分鐘)

#### 2.1 新增 .github/instructions/ 目錄

```bash
# 從 main 複製整個目錄
git checkout main -- .github/instructions/

# 檢查檔案
ls -la .github/instructions/
```

**新增檔案清單**:
- [x] `.github/instructions/README.md`
- [x] `.github/instructions/core.instructions.md`
- [x] `.github/instructions/documentation.instructions.md`
- [x] `.github/instructions/routes.instructions.md`
- [x] `.github/instructions/shared.instructions.md`
- [x] `.github/instructions/testing.instructions.md`

#### 2.2 新增其他 Main 獨有檔案

```bash
# 新增 development-principles.mdc
git checkout main -- .cursor/rules/development-principles.mdc

# 新增 ng-alain-project-agent.md
git checkout main -- .github/agents/ng-alain-project-agent.md

# 新增 role-config.md
git checkout main -- .github/role-config.md
```

**檢查點**:
- [ ] 所有新檔案已新增
- [ ] 檔案內容正確

### 階段 3: 更新關鍵配置檔案 (15 分鐘)

#### 3.1 更新 copilot-instructions.md (⚠️ 關鍵)

**策略**: 使用 main 版本,但保留 g1 的有價值內容

```bash
# 備份 g1 版本
cp .github/copilot-instructions.md /tmp/g1-copilot-instructions.md.backup

# 使用 main 版本
git checkout main -- .github/copilot-instructions.md

# 手動檢查 g1 版本是否有需要保留的內容
diff /tmp/g1-copilot-instructions.md.backup .github/copilot-instructions.md
```

**Main 版本優勢**:
- ✅ 包含認證系統完整說明
- ✅ 包含 AI 助手角色配置參考
- ✅ 包含企業標準和 4 步驟回應格式
- ✅ 更新的技術棧版本 (NG-ALAIN 20.1.x)

**G1 版本內容** (較舊,可以捨棄):
- ❌ 缺少認證系統文件
- ❌ SHARED_IMPORTS 說明較詳細但已過時
- ❌ 技術棧版本較舊 (NG-ALAIN 20.0.x)

**決定**: ✅ **完全採用 main 版本**

#### 3.2 保留 G1 的 MCP 配置

```bash
# 確認 .cursor/mcp.json 存在
ls -la .cursor/mcp.json

# 此檔案保持不變,因為是 g1 的開發工具配置
```

**MCP 配置內容**:
- Chrome DevTools 整合
- Context7 API 配置
- Playwright 整合

**決定**: ✅ **保留 g1 的 .cursor/mcp.json**

**檢查點**:
- [ ] copilot-instructions.md 已更新為 main 版本
- [ ] .cursor/mcp.json 保持 g1 版本
- [ ] 檔案可以正常讀取

### 階段 4: 更新 Cursor 規則檔案 (20 分鐘)

#### 4.1 批次更新策略

```bash
# 列出所有需要更新的規則檔案
RULE_FILES=(
  "README.md"
  "accessibility.mdc"
  "angular.mdc"
  "api-design.mdc"
  "architecture.mdc"
  "build-deploy.mdc"
  "code-quality.mdc"
  "core-specific.mdc"
  "dependency-management.mdc"
  "error-handling.mdc"
  "formatting.mdc"
  "git-model.mdc"
  "git-workflow.mdc"
  "layout-specific.mdc"
  "linting.mdc"
  "mcp-tools.mdc"
  "modern-angular.mdc"
  "path-aliases.mdc"
  "performance.mdc"
  "routes-specific.mdc"
  "security.mdc"
  "shared-imports.mdc"
  "shared-specific.mdc"
  "styling.mdc"
  "testing.mdc"
  "theming.mdc"
  "typescript.mdc"
)

# 批次更新(使用 main 版本)
cd .cursor/rules
for file in "${RULE_FILES[@]}"; do
  echo "Updating $file..."
  git checkout main -- "$file"
done
```

#### 4.2 特別注意的檔案

**高優先級** (建議詳細審查):
1. `angular.mdc` - 包含 Angular 20 最新實踐
2. `architecture.mdc` - 架構標準更新
3. `shared-imports.mdc` - SHARED_IMPORTS 模式
4. `testing.mdc` - 測試標準

**檢查點**:
- [ ] 所有規則檔案已更新
- [ ] 檔案格式正確 (.mdc)
- [ ] 內容可讀

### 階段 5: 驗證和測試 (10 分鐘)

```bash
# 5.1 檢查檔案結構
tree .github/ -L 2
tree .cursor/ -L 2

# 5.2 驗證關鍵檔案存在
test -f .github/copilot-instructions.md && echo "✓ copilot-instructions.md exists"
test -f .cursor/mcp.json && echo "✓ mcp.json exists"
test -d .github/instructions && echo "✓ instructions/ directory exists"
test -f .cursor/rules/development-principles.mdc && echo "✓ development-principles.mdc exists"

# 5.3 檢查檔案數量
echo "Instructions files: $(ls .github/instructions/*.md 2>/dev/null | wc -l)"
echo "Cursor rules: $(ls .cursor/rules/*.mdc 2>/dev/null | wc -l)"

# 5.4 驗證沒有意外刪除
git status --short
```

**預期結果**:
- `.github/instructions/`: 6 個檔案
- `.cursor/rules/*.mdc`: 28 個檔案
- `.cursor/mcp.json`: 存在(g1 版本)
- `.github/copilot-instructions.md`: 存在(main 版本)

**檢查點**:
- [ ] 所有檔案數量正確
- [ ] 沒有意外刪除的檔案
- [ ] Git 狀態顯示預期的變更

### 階段 6: 提交變更 (5 分鐘)

```bash
# 6.1 檢查變更
git status
git diff --stat

# 6.2 新增所有變更
git add .

# 6.3 提交
git commit -m "chore: sync g1 with main branch updates

- Add .github/instructions/ directory with 6 instruction files
- Update .github/copilot-instructions.md to include auth system docs
- Add .cursor/rules/development-principles.mdc
- Update all cursor rules to match main branch standards
- Preserve g1's .cursor/mcp.json configuration
- Add .github/agents/ng-alain-project-agent.md
- Add .github/role-config.md

Refs: main@d90fbba (docs: Update system architecture and process diagrams)"

# 6.4 推送(如果需要)
git push origin g1-sync-with-main
```

**檢查點**:
- [ ] 提交訊息清晰
- [ ] 變更已提交
- [ ] 推送成功(如果執行)

---

## 🔍 驗證檢查清單 (Verification Checklist)

### 檔案完整性檢查

- [ ] **指令檔案** (6 個)
  - [ ] .github/instructions/README.md
  - [ ] .github/instructions/core.instructions.md
  - [ ] .github/instructions/documentation.instructions.md
  - [ ] .github/instructions/routes.instructions.md
  - [ ] .github/instructions/shared.instructions.md
  - [ ] .github/instructions/testing.instructions.md

- [ ] **關鍵配置** (3 個)
  - [ ] .github/copilot-instructions.md (main 版本)
  - [ ] .github/role-config.md (main 版本)
  - [ ] .cursor/mcp.json (g1 版本 - 保留)

- [ ] **Cursor 規則** (28 個)
  - [ ] .cursor/rules/development-principles.mdc (新增)
  - [ ] .cursor/rules/*.mdc (27 個更新)

- [ ] **代理檔案**
  - [ ] .github/agents/ng-alain-project-agent.md (新增)

### 內容正確性檢查

- [ ] copilot-instructions.md 包含認證系統說明
- [ ] copilot-instructions.md 包含 AI 助手角色配置參考
- [ ] .cursor/mcp.json 包含 Context7 API 配置
- [ ] instructions/ 目錄下的檔案內容完整

### 功能性檢查

- [ ] GitHub Copilot 能讀取新的指令
- [ ] Cursor AI 能讀取更新的規則
- [ ] MCP 工具配置正常運作

---

## ⚠️ 風險管理 (Risk Management)

### 已識別風險

| 風險 | 影響 | 緩解措施 | 狀態 |
|------|------|---------|------|
| MCP 配置覆蓋 | 開發工具失效 | 保留 g1 的 .cursor/mcp.json | ✅ 已緩解 |
| 認證文件遺失 | 開發者不了解系統 | 使用 main 的完整文件 | ✅ 已緩解 |
| 舊規則不兼容 | 代碼標準混亂 | 統一使用 main 標準 | ✅ 已緩解 |
| 意外刪除檔案 | 功能遺失 | 分階段驗證 | ✅ 已緩解 |

### 回滾計畫

如果合併後發現問題:

```bash
# 方案 1: 軟回滾(建立修復分支)
git checkout g1
git checkout -b g1-sync-fix
# 修復特定檔案
git checkout <commit> -- <file>
git commit -m "fix: restore specific file"

# 方案 2: 硬回滾(重置到合併前)
git checkout g1
git reset --hard <before-merge-commit>
git push --force origin g1  # 謹慎使用!
```

---

## 📊 影響評估 (Impact Assessment)

### 正面影響

1. **✅ 標準化**: 所有配置檔案與 main 一致
2. **✅ 文件完整**: 包含認證系統完整說明
3. **✅ 開發指引**: 新增 6 個模組特定指引
4. **✅ 最新標準**: Cursor 規則更新至最新
5. **✅ 工具保留**: MCP 配置得以保留

### 潛在問題

1. **⚠️ 學習曲線**: 開發者需要熟悉新的指引
2. **⚠️ 習慣改變**: 某些開發習慣可能需要調整
3. **⚠️ 初期混亂**: 短期內可能需要適應期

### 建議溝通

**給團隊的訊息**:
```
📢 重要更新通知

G1 分支已完成與 main 分支的同步,主要變更:

1. 新增開發指引系統 (.github/instructions/)
2. 更新 GitHub Copilot 指令(包含認證系統文件)
3. 更新 Cursor AI 規則至最新標準
4. 保留開發工具配置(MCP)

請查看:
- docs/CONFLICT_ANALYSIS.md - 詳細分析報告
- docs/MERGE_STRATEGY.md - 合併策略說明

如有問題,請聯繫開發團隊。
```

---

## 🎓 經驗總結 (Lessons Learned)

### 成功因素

1. **詳細分析**: 在執行前完整分析差異
2. **分階段執行**: 降低風險,便於驗證
3. **保留價值**: 不盲目覆蓋,保留有用配置
4. **文件完整**: 提供清晰的執行計畫

### 未來改進

1. **自動化**: 考慮建立配置同步腳本
2. **CI 檢查**: 在 CI 中加入配置一致性檢查
3. **版本管理**: 建立配置檔案版本標記
4. **定期同步**: 設定配置檔案定期同步機制

---

## 📞 支援資源 (Support Resources)

- **技術文件**: `docs/CONFLICT_ANALYSIS.md`
- **架構文件**: `docs/10-系統架構思維導圖.mermaid.md`
- **開發指引**: `.github/instructions/README.md`
- **聯絡人**: 開發團隊

---

**文件版本**: 1.0  
**最後更新**: 2025-11-17  
**下次審查**: 合併完成後
