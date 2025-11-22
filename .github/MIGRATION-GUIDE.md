# .github 目錄重組遷移指南

> **版本**：v3.0  
> **日期**：2025-01-22

---

## 📋 重組概覽

本次重組將 `.github` 目錄從混亂狀態整理為企業標準結構，主要變更包括：

1. **全局指令整合**：5 個 `.copilot-*.md` 文件移至 `copilot-instructions/` 目錄
2. **Agent 配置模組化**：31KB 的 `ng-alain-github-agent.md` 拆分為 8 個模組化文件
3. **指南文件歸類**：6 個指南文件移至 `agents/guides/` 目錄
4. **歷史文檔歸檔**：9 個完成的報告移至 `archive/` 目錄

---

## 🗂️ 目錄結構變更

### 新結構
```
.github/
├── copilot-instructions/     # ✨ 新增：全局 Copilot 指令
│   ├── README.md
│   ├── .copilot-instructions.md
│   ├── .copilot-review-instructions.md
│   ├── .copilot-commit-message-instructions.md
│   ├── .copilot-pull-request-description-instructions.md
│   └── .copilot-test-instructions.md
│
├── agents/                   # 📁 重組：Agent 配置中心
│   ├── README.md (v3.0)      # ✨ 全新重寫
│   ├── INDEX.md              # ✨ 新增：快速索引
│   ├── QUICK-START.md
│   ├── copilot-instructions.md
│   ├── role.agent.md
│   ├── role-config.md
│   ├── docs-index.md
│   ├── redis-external-brain-guide.md
│   │
│   ├── core/                 # ✨ 新增：核心配置
│   │   ├── README.md
│   │   ├── agent-overview.md     # ✨ 從 ng-alain-github-agent.md 拆分
│   │   ├── startup-procedure.md  # ✨ 從 ng-alain-github-agent.md 拆分
│   │   ├── tech-stack.md         # 📝 待創建
│   │   ├── architecture-principles.md  # 📝 待創建
│   │   ├── development-workflow.md     # 📝 待創建
│   │   ├── decision-logic.md           # 📝 待創建
│   │   ├── error-handling.md           # 📝 待創建
│   │   └── checklists.md               # 📝 待創建
│   │
│   ├── guides/               # ✨ 新增：指南目錄
│   │   ├── README.md
│   │   ├── agent-startup-checklist.md        # 移動自根目錄
│   │   ├── memory-usage-guide.md             # 移動自根目錄
│   │   ├── mcp-tools-workflow-guide.md       # 移動自根目錄
│   │   ├── development-sequence-guide.md     # 移動自根目錄
│   │   ├── enterprise-compliance-checklist.md # 移動自根目錄
│   │   └── agent-quick-reference.md          # 移動自根目錄
│   │
│   ├── domain/               # 保留：領域專家
│   │   ├── angular-agent.md
│   │   ├── typescript-agent.md
│   │   ├── code-quality-agent.md
│   │   ├── security-agent.md
│   │   ├── performance-agent.md
│   │   ├── testing-agent.md
│   │   ├── accessibility-agent.md
│   │   └── docs-agent.md
│   │
│   ├── tools/                # 保留：自動化工具
│   │   ├── README.md
│   │   ├── check-memory-coverage.sh
│   │   ├── validate-compliance.sh
│   │   ├── verify-dev-sequence.sh
│   │   └── monitoring-prototype.md
│   │
│   └── archive/              # ✨ 新增：歷史歸檔
│       ├── README.md
│       ├── README-v2-backup.md  # 舊版 README 備份
│       ├── document-refactoring-plan.md        # 移動自根目錄
│       ├── documentation-completion-report.md  # 移動自根目錄
│       ├── documentation-final-summary.md      # 移動自根目錄
│       ├── documentation-quality-improvement-report.md  # 移動自根目錄
│       └── markdown-documentation-standards.md # 移動自根目錄
│
├── copilot/                  # 保留：專案記憶庫
│   ├── memory.jsonl
│   ├── README.md
│   ├── MEMORY_SUMMARY.md
│   └── ...其他文件
│
├── workflows/                # 保留：CI/CD
├── ISSUE_TEMPLATE/           # 保留：Issue 模板
├── CODEOWNERS                # 保留：全局配置
├── FUNDING.yml               # 保留：全局配置
├── PULL_REQUEST_TEMPLATE.md  # 保留：全局配置
└── ...其他配置文件           # 保留：全局配置
```

---

## 📊 文件移動對照表

### copilot-instructions/ 目錄
| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `.github/.copilot-instructions.md` | `.github/copilot-instructions/.copilot-instructions.md` | ✅ 已移動 |
| `.github/.copilot-review-instructions.md` | `.github/copilot-instructions/.copilot-review-instructions.md` | ✅ 已移動 |
| `.github/.copilot-commit-message-instructions.md` | `.github/copilot-instructions/.copilot-commit-message-instructions.md` | ✅ 已移動 |
| `.github/.copilot-pull-request-description-instructions.md` | `.github/copilot-instructions/.copilot-pull-request-description-instructions.md` | ✅ 已移動 |
| `.github/.copilot-test-instructions.md` | `.github/copilot-instructions/.copilot-test-instructions.md` | ✅ 已移動 |

### agents/core/ 目錄
| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `.github/agents/ng-alain-github-agent.md`（部分） | `.github/agents/core/agent-overview.md` | ✅ 已創建 |
| `.github/agents/ng-alain-github-agent.md`（部分） | `.github/agents/core/startup-procedure.md` | ✅ 已創建 |
| `.github/agents/ng-alain-github-agent.md`（其餘） | `.github/agents/core/*.md`（其他 6 個文件） | 📝 待完成 |

### agents/guides/ 目錄
| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `.github/agents/agent-startup-checklist.md` | `.github/agents/guides/agent-startup-checklist.md` | ✅ 已移動 |
| `.github/agents/memory-usage-guide.md` | `.github/agents/guides/memory-usage-guide.md` | ✅ 已移動 |
| `.github/agents/mcp-tools-workflow-guide.md` | `.github/agents/guides/mcp-tools-workflow-guide.md` | ✅ 已移動 |
| `.github/agents/development-sequence-guide.md` | `.github/agents/guides/development-sequence-guide.md` | ✅ 已移動 |
| `.github/agents/enterprise-compliance-checklist.md` | `.github/agents/guides/enterprise-compliance-checklist.md` | ✅ 已移動 |
| `.github/agents/agent-quick-reference.md` | `.github/agents/guides/agent-quick-reference.md` | ✅ 已移動 |

### agents/archive/ 目錄
| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `.github/agents/document-refactoring-plan.md` | `.github/agents/archive/document-refactoring-plan.md` | ✅ 已移動 |
| `.github/agents/documentation-completion-report.md` | `.github/agents/archive/documentation-completion-report.md` | ✅ 已移動 |
| `.github/agents/documentation-final-summary.md` | `.github/agents/archive/documentation-final-summary.md` | ✅ 已移動 |
| `.github/agents/documentation-quality-improvement-report.md` | `.github/agents/archive/documentation-quality-improvement-report.md` | ✅ 已移動 |
| `.github/agents/markdown-documentation-standards.md` | `.github/agents/archive/markdown-documentation-standards.md` | ✅ 已移動 |

### docs/archive/agents-reports/ 目錄
| 舊路徑 | 新路徑 | 狀態 |
|--------|--------|------|
| `docs/documentation-organization-summary.md` | `docs/archive/agents-reports/documentation-organization-summary.md` | ✅ 已移動 |
| `docs/infrastructure-completion-summary.md` | `docs/archive/agents-reports/infrastructure-completion-summary.md` | ✅ 已移動 |
| `docs/markdown-documentation-quality-analysis-report.md` | `docs/archive/agents-reports/markdown-documentation-quality-analysis-report.md` | ✅ 已移動 |
| `docs/markdown-quality-quick-summary.md` | `docs/archive/agents-reports/markdown-quality-quick-summary.md` | ✅ 已移動 |

---

## 🔧 需要更新的配置

### VSCode 設定（.vscode/settings.json）
✅ **已更新**：所有 Copilot 指令路徑已更新為新路徑

### 內部連結更新
需要更新以下文件中的內部連結：

#### agents/ 目錄內的文件
- [ ] `copilot-instructions.md` - 更新指向 guides/ 的連結
- [ ] `role.agent.md` - 更新指向 core/ 的連結
- [ ] `QUICK-START.md` - 更新所有連結
- [ ] `redis-external-brain-guide.md` - 更新指向 guides/ 的連結

#### 其他文件
- [ ] `AGENTS.md`（根目錄） - 更新 .github 結構說明
- [ ] `CLAUDE.md` - 更新配置路徑
- [ ] `GEMINI.md` - 更新配置路徑
- [ ] `.cursor/rules/README.md` - 更新相關說明

---

## ✅ 驗證清單

### 文件完整性
- [x] 所有文件已移至正確位置
- [x] 新目錄已創建 README
- [x] 舊版 README 已備份至 archive/

### 配置更新
- [x] VSCode settings.json 已更新
- [ ] 內部連結需要更新（待完成）
- [ ] 其他配置文件檢查（待完成）

### 功能驗證
- [ ] Copilot 指令正常載入
- [ ] Agent 配置可正常訪問
- [ ] 內部連結可正常跳轉
- [ ] 歸檔文件可正常查看

---

## 🎯 後續工作

### 高優先級（P0）
1. **完成 core/ 模組拆分**：從 `ng-alain-github-agent.md` 拆分剩餘 6 個文件
2. **更新內部連結**：修正所有文件中的路徑引用
3. **驗證功能**：確保所有配置正常運作

### 中優先級（P1）
1. **創建過渡期指南**：幫助用戶適應新結構
2. **更新文檔索引**：更新 docs/README.md 中的 .github 說明
3. **檢查外部引用**：確認是否有其他文件引用舊路徑

### 低優先級（P2）
1. **優化 README 內容**：進一步完善各目錄的 README
2. **創建快速參考卡**：一頁紙的快速查找指南
3. **添加圖表說明**：使用 Mermaid 圖表展示目錄結構

---

## 📝 注意事項

### 向後兼容性
- ⚠️ **舊路徑不再有效**：所有移動的文件在舊位置不再存在
- ⚠️ **需要更新書籤**：如有文件書籤需手動更新
- ⚠️ **Git 歷史保留**：使用 `git mv` 保留文件歷史（本次未使用，可考慮後續優化）

### 最佳實踐
- ✅ **查看 INDEX.md**：快速找到所需文件
- ✅ **使用 README**：每個目錄都有說明文件
- ✅ **按任務查找**：參考 INDEX.md 中的任務對照表

---

## 🆘 遇到問題？

### 找不到文件
1. 查看 [agents/INDEX.md](.github/agents/INDEX.md)
2. 參考本文件的「文件移動對照表」
3. 使用全局搜尋（Ctrl+Shift+F）

### 連結失效
1. 檢查是否使用舊路徑
2. 參考「需要更新的配置」章節
3. 聯繫開發團隊更新

### 配置問題
1. 確認 VSCode settings.json 已更新
2. 重新載入 VSCode
3. 清除 Copilot 快取

---

**最後更新**：2025-01-22  
**維護者**：開發團隊
