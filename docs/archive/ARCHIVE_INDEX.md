# Archive Index - Quick Reference

> **Purpose**: Quick reference guide for all archived documents  
> **Last Updated**: 2025-11-22  
> **Total Archived Files**: 26 files

---

## 📂 Archive Directory Structure

```
docs/archive/
├── workspace-tracking/      # Workspace tracking documents (11 files)
│   ├── SESSION_SUMMARY_2025-11-22.md
│   ├── PROGRESS_REPORT.md
│   ├── STAKEHOLDER_SUMMARY.md
│   ├── STAKEHOLDER_UPDATE.md
│   ├── INVENTORY_NAVIGATION.md
│   ├── PROJECT_INVENTORY_SUMMARY.md
│   ├── NEXT_ACTIONS.md
│   ├── NEXT_BATCH_ANALYSIS.md
│   ├── analysis-summary-zh.md
│   ├── facades-enhancement-progress-history.md
│   └── facades-implementation-record.md
│
├── phase-completions/       # Phase completion reports (5 files)
│   ├── PHASE0_COMPLETION_REPORT.md
│   ├── WEEK1_COMPLETION_REPORT.md
│   ├── WEEK2_COMPLETION_REPORT.md
│   ├── WEEK2_PROGRESS_REPORT.md
│   └── facades-phase1-complete-summary.md
│
├── progress-reports/        # Progress reports (empty, ready for use)
├── session-summaries/       # Session summaries (empty, ready for use)
│
└── [root files]            # Historical analysis reports (10 files)
    ├── SRP-重構完成報告.md
    ├── 62-專案開發改善實施總結報告.md
    ├── FINAL-SUMMARY.md
    ├── MCP-Server-Verification-Report.md
    ├── MCP伺服器驗證總結.md
    ├── fyi.md
    ├── fyi-background.md
    ├── fyi-history.md
    ├── fyi-notes.md
    └── SRP-檢查清單.md
```

---

## 🔍 Quick Search by Topic

### By Date
- **2025-11-22**: SESSION_SUMMARY_2025-11-22.md (workspace-tracking)
- **2025-11-20**: Historical SRP and FYI documents (root)

### By Type

#### 📊 Progress Reports
- [PROGRESS_REPORT.md](./workspace-tracking/PROGRESS_REPORT.md) - Project inventory progress report
- [WEEK2_PROGRESS_REPORT.md](./phase-completions/WEEK2_PROGRESS_REPORT.md) - Week 2 progress report

#### 📝 Session Summaries
- [SESSION_SUMMARY_2025-11-22.md](./workspace-tracking/SESSION_SUMMARY_2025-11-22.md) - Enterprise tracking system completion

#### 🎯 Phase Completions
- [PHASE0_COMPLETION_REPORT.md](./phase-completions/PHASE0_COMPLETION_REPORT.md) - Phase 0 (Planning)
- [WEEK1_COMPLETION_REPORT.md](./phase-completions/WEEK1_COMPLETION_REPORT.md) - Week 1 sprint
- [WEEK2_COMPLETION_REPORT.md](./phase-completions/WEEK2_COMPLETION_REPORT.md) - Week 2 sprint
- [facades-phase1-complete-summary.md](./phase-completions/facades-phase1-complete-summary.md) - Facades Phase 1

#### 💼 Stakeholder Communications
- [STAKEHOLDER_SUMMARY.md](./workspace-tracking/STAKEHOLDER_SUMMARY.md) - Stakeholder summary
- [STAKEHOLDER_UPDATE.md](./workspace-tracking/STAKEHOLDER_UPDATE.md) - Stakeholder update

#### 📋 Planning & Analysis
- [NEXT_ACTIONS.md](./workspace-tracking/NEXT_ACTIONS.md) - Next actions plan (superseded)
- [NEXT_BATCH_ANALYSIS.md](./workspace-tracking/NEXT_BATCH_ANALYSIS.md) - Batch analysis
- [INVENTORY_NAVIGATION.md](./workspace-tracking/INVENTORY_NAVIGATION.md) - Inventory navigation
- [PROJECT_INVENTORY_SUMMARY.md](./workspace-tracking/PROJECT_INVENTORY_SUMMARY.md) - Inventory summary

#### 🏗️ Architecture & Implementation
- [facades-enhancement-progress-history.md](./workspace-tracking/facades-enhancement-progress-history.md) - Facades Phase 1 history
- [facades-implementation-record.md](./workspace-tracking/facades-implementation-record.md) - Facades Phase 1 implementation
- [analysis-summary-zh.md](./workspace-tracking/analysis-summary-zh.md) - Chinese analysis summary

#### 🔧 Historical Technical Reports
- [SRP-重構完成報告.md](./) - SRP refactoring completion
- [62-專案開發改善實施總結報告.md](./) - Project improvement summary
- [MCP-Server-Verification-Report.md](./) - MCP server verification

---

## 🎯 When to Look Here

### Looking for Historical Context?
Start here:
1. Session summaries → workspace-tracking/
2. Phase completion reports → phase-completions/
3. Historical technical reports → root files

### Need Stakeholder Communication Templates?
See:
- workspace-tracking/STAKEHOLDER_SUMMARY.md
- workspace-tracking/STAKEHOLDER_UPDATE.md

### Understanding Phase 1 Facades Implementation?
See:
- phase-completions/facades-phase1-complete-summary.md
- workspace-tracking/facades-enhancement-progress-history.md
- workspace-tracking/facades-implementation-record.md

### Reviewing Project Planning History?
See:
- workspace-tracking/PROJECT_INVENTORY_SUMMARY.md
- workspace-tracking/NEXT_BATCH_ANALYSIS.md
- workspace-tracking/PROGRESS_REPORT.md

---

## 📌 Active vs Archived Documents

### ✅ Active Documents (NOT in Archive)
These remain in root or docs/workspace:
- `WORK_PROGRESS_TRACKER.md` - Current progress tracker
- `WEEKLY_REPORT_TEMPLATE.md` - Reusable weekly report template
- `WORKFLOW_GUIDE.md` - Standard workflow guide
- `INCOMPLETE_ITEMS.csv` - Current work items list
- `TECHNICAL_DEBT_BACKLOG.md` - Technical debt tracker
- `COPILOT_SETUP_COMPLETION.md` - Copilot configuration validation

### 📦 Archived Documents
Documents here are:
- ✅ Completed phases/sprints
- ✅ Superseded by newer documents
- ✅ Historical reference only
- ❌ No longer actively updated

---

## 🔗 Quick Links

### Documentation
- [Archive README](./README.md) - Complete archive documentation
- [Workspace Tracking README](./workspace-tracking/README.md) - Workspace tracking archive details
- [Phase Completions README](./phase-completions/README.md) - Phase completion archive details

### Active Resources
- [WORK_PROGRESS_TRACKER.md](../../WORK_PROGRESS_TRACKER.md) - Current progress
- [docs/workspace/README.md](../workspace/README.md) - Active workspace documentation
- [docs/workspace/MASTER_IMPLEMENTATION_PLAN.md](../workspace/MASTER_IMPLEMENTATION_PLAN.md) - Master plan

---

## 💡 Tips

### Searching Archives
```bash
# Search for specific content
grep -r "search_term" docs/archive/

# List all markdown files
find docs/archive/ -name "*.md" -type f

# Show files modified in last 7 days
find docs/archive/ -name "*.md" -mtime -7
```

### Referencing Archived Documents
When linking to archived documents in new documentation:

```markdown
For historical context, see: [Document Name](../archive/category/document.md) (Archived YYYY-MM-DD)
```

### Before Archiving New Documents
Check if document meets archive criteria:
1. ✅ Phase/sprint completed
2. ✅ Information superseded
3. ✅ Still valuable for reference
4. ✅ No longer actively maintained

---

**Maintained By**: Development Team  
**Archive Policy**: [docs/archive/README.md](./README.md)  
**Last Review**: 2025-11-22
