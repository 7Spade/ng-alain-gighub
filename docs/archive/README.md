# Archive - 歷史文檔

> 📦 **目的**：保存已完成的報告和過時的參考文檔

**最新歸檔日期**：2025-11-22
**原因**：文檔整合計畫 - 工作區追蹤文件整理

---

## 📂 Archive Directory Structure

```
docs/archive/
├── workspace-tracking/     # Workspace tracking documents (NEW 2025-11-22)
├── phase-completions/      # Phase/sprint completion reports (NEW 2025-11-22)
├── progress-reports/       # Progress reports (NEW 2025-11-22)
├── session-summaries/      # Session summaries (NEW 2025-11-22)
├── agents-reports/         # Agent-related reports
├── architecture-diagrams/  # Archived architecture diagrams
└── [root files]           # Historical analysis reports and summaries
```

---

## 📋 歸檔文件清單

### 工作區追蹤文件（11 個）- NEW 2025-11-22

**位置**: [workspace-tracking/](./workspace-tracking/)

| 文件 | 說明 | 歸檔原因 |
|------|------|----------|
| SESSION_SUMMARY_2025-11-22.md | 2025-11-22 會議摘要 | 已完成的會議記錄 |
| PROGRESS_REPORT.md | 項目進度報告 | 階段性報告，已完成 |
| STAKEHOLDER_SUMMARY.md | 利害關係人摘要 | 階段性溝通文件，已完成 |
| STAKEHOLDER_UPDATE.md | 利害關係人更新 | 階段性更新，已完成 |
| INVENTORY_NAVIGATION.md | 盤點導航 | 已被更好的文檔取代 |
| PROJECT_INVENTORY_SUMMARY.md | 項目盤點摘要 | 已被 WORK_PROGRESS_TRACKER.md 取代 |
| NEXT_ACTIONS.md | 下一步行動 | 已被 WORK_PROGRESS_TRACKER.md 取代 |
| NEXT_BATCH_ANALYSIS.md | 下批次分析 | 分析已完成 |
| analysis-summary-zh.md | 分析摘要（中文） | 英文版為主要版本 |
| facades-enhancement-progress-history.md | Facades 增強進度歷史 | Phase 1 完成的歷史記錄 |
| facades-implementation-record.md | Facades 實施記錄 | Phase 1 完成的實施記錄 |

### 階段完成報告（5 個）- NEW 2025-11-22

**位置**: [phase-completions/](./phase-completions/)

| 文件 | 說明 | 歸檔原因 |
|------|------|----------|
| PHASE0_COMPLETION_REPORT.md | Phase 0 完成報告 | 階段已完成 |
| WEEK1_COMPLETION_REPORT.md | Week 1 完成報告 | Sprint 已完成 |
| WEEK2_COMPLETION_REPORT.md | Week 2 完成報告 | Sprint 已完成 |
| WEEK2_PROGRESS_REPORT.md | Week 2 進度報告 | Sprint 已完成 |
| facades-phase1-complete-summary.md | Facades Phase 1 完成摘要 | Phase 1 已完成 |

### 完成報告（5 個）- 2025-11-20

| 文件 | 說明 | 歸檔原因 |
|------|------|----------|
| SRP-重構完成報告.md | SRP 重構完成總結 | 歷史報告，已整合到 00-SRP.md |
| 62-專案開發改善實施總結報告.md | 專案改善實施總結 | 歷史報告，內容已過時 |
| FINAL-SUMMARY.md | 最終總結 | 歷史報告，內容已整合 |
| MCP-Server-Verification-Report.md | MCP 伺服器驗證報告（英文） | 歷史報告，功能已穩定 |
| MCP伺服器驗證總結.md | MCP 伺服器驗證總結（中文） | 歷史報告，功能已穩定 |

### FYI 參考文檔（4 個）

| 文件 | 說明 | 歸檔原因 |
|------|------|----------|
| fyi.md | FYI 總索引 | 功能被 00-文檔總覽與索引.md 取代 |
| fyi-background.md | 背景資訊 | 內容已整合到 README.md |
| fyi-history.md | 歷史資訊 | 過時的歷史記錄 |
| fyi-notes.md | 臨時筆記 | 臨時筆記，無正式價值 |

### SRP 參考文檔（1 個）

| 文件 | 說明 | 歸檔原因 |
|------|------|----------|
| SRP-檢查清單.md | SRP 合規性檢查清單 | 內容已整合到 00-SRP.md，保留作為參考 |

- --

## 📊 統計

- **總檔案數**：26 個（+16 個新增於 2025-11-22）
- **工作區追蹤文件**：11 個（NEW）
- **階段完成報告**：5 個（NEW）
- **完成報告**：5 個
- **FYI 文檔**：4 個
- **SRP 文檔**：1 個

---

## 🔍 如何查找舊文檔

如果需要查閱歷史文檔：

1. **在 Git 歷史中查找**：
   ```bash
   git log --all --full-history -- "docs/SRP-重構完成報告.md"
   ```

2. **在 archive/ 目錄查看**：
   ```bash
   ls docs/archive/
   ```

3. **還原歷史文檔**（如果需要）：
   ```bash
   git checkout <commit-hash> -- docs/archive/<filename>
   ```

- --

## 📌 活躍追蹤文件（未歸檔）

以下文件保持活躍狀態，持續更新：

- `WORK_PROGRESS_TRACKER.md` - 持續更新的進度追蹤器
- `WEEKLY_REPORT_TEMPLATE.md` - 週報模板（可重複使用）
- `WORKFLOW_GUIDE.md` - 工作流程指南（長期參考）
- `INCOMPLETE_ITEMS.csv` - 參考數據（持續追蹤）
- `TECHNICAL_DEBT_BACKLOG.md` - 技術債務（持續追蹤）
- `COPILOT_SETUP_COMPLETION.md` - 配置驗證（重要參考）

## ⚠️ 注意事項

- 這些文件僅作歷史參考，不再更新
- 內容可能已過時或被整合到其他文檔
- 建議優先參考最新的正式文檔
- 新增的子目錄（workspace-tracking, phase-completions）包含更詳細的 README

---

## 📚 Related Resources

### Active Tracking
- [WORK_PROGRESS_TRACKER.md](../../WORK_PROGRESS_TRACKER.md) - Current progress tracker
- [docs/workspace/README.md](../workspace/README.md) - Workspace documentation

### Archive Directories
- [workspace-tracking/README.md](./workspace-tracking/README.md) - Workspace tracking archive
- [phase-completions/README.md](./phase-completions/README.md) - Phase completion reports

---

**維護者**：開發團隊
**最後更新**：2025-11-22
