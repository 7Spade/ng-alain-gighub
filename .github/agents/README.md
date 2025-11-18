# GitHub Agents Knowledge Hub

> **目的**：集中管理原 `.ai/` 與舊 `.github/agents/` 的所有 AI 上下文，提供一致的代理說明、專案背景與工作流程。所有檔案皆依角色職責分類，方便在 GitHub Actions、Cursor 或任意 Agent Runtime 中引用。

## 📁 目錄結構

```
.github/agents/
├── README.md                 # 本文件，說明定位與結構
├── docs-index.md             # 🔍 docs/ 目錄索引（新）
├── role.agent.md             # Copilot / AI 角色設定
├── ng-project-agent.md       # 專案級上下文（由原 .ai 內容整合）
├── template-agent.md         # 範本與回答規範
│
├── domain/                   # 技術領域專家代理
│   ├── angular-agent.md
│   ├── typescript-agent.md
│   ├── code-quality-agent.md
│   ├── testing-agent.md
│   ├── security-agent.md
│   ├── performance-agent.md
│   ├── accessibility-agent.md
│   └── docs-agent.md
│
├── workflows/                # 在 CI / Actions 中使用 agents 的指南
│   ├── agents-workflow.md
│   └── agents-actions.md
│
├── templates/                # Prompt / Issue 樣板
│   ├── agent-prompt-template.md
│   └── issue-template-for-agents.md
│
├── examples/                 # 範例設定與產出
│   ├── sample-agent-config.md
│   └── sample-patch-response.md
│
└── meta/                     # 索引與版本紀錄
    ├── agents-index.json
    └── CHANGELOG.md
```

## 🔄 內容來源
- **原 `.ai/` 目錄**：architecture、tech-stack、business-context、quick-reference... 等背景資料已整合進 `ng-project-agent.md` 與各 domain agents。
- **舊 `.github/agents/`**：Angular / TypeScript / Code Quality / Testing 等代理移動至 `domain/`，內容依新路徑更新引用。

## 🚀 使用方式
- **Context7 → Docs Index**：先以 `@C7` 查官方資源，再透過 `docs-index.md` 對照 `docs/` 內的實際文件。
- **Cursor / Chat 模式**：引用 `ng-project-agent.md` 取得專案上下文，再依任務挑選 domain agent。
- **GitHub Actions**：於 workflow 中載入 `role.agent.md` + 相關 domain 文件，詳見 `workflows/agents-workflow.md`。
- **文件導覽**：若需模板或範例，參考 `templates/`、`examples/` 與 `meta/`。

## 🧭 推薦閱讀順序
1. `docs-index.md` – 先確認任務涉及的 `docs/` 原始資料。
2. `role.agent.md` – 了解 AI 角色定位與回覆原則。
3. `ng-project-agent.md` – 獲取專案願景、架構、資料與 API 摘要。
4. `domain/*.md` – 依任務類型套用專家檢查表。
5. `templates/` & `examples/` – 建立自動化流程或 prompt。

## 🔗 Docs Index 快速導覽
- `docs-index.md` 提供 `docs/` 目錄的分類索引（架構、流程、資料、權限、Agent 等九大類）。
- 每個項目都附 `@file` 標籤與說明，方便在回覆中引用。
- 若新增或修改 `docs/` 內容，請同步更新 `docs-index.md` 與 `meta/CHANGELOG.md`。

## 🔗 關聯資源
- `AGENTS.md` – 專案最高層決策與規範索引。
- `docs/` – 完整詳細文件，agents 僅保留摘要並附連結。
- `.cursor/rules/` – Cursor 自動載入的細部規範，domain agents 會引用對應章節。

---
**最後更新**：2025-11-18  
**維護者**：開發團隊
