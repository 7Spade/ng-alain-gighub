# ng-alain 專案 Agent（Project Context）

> **來源**：整合原 `.ai/` 目錄（quick-reference、architecture、tech-stack、business-context、api/database 概覽、user stories、epics）與既有 `ng-alain-project-agent.md`。此文件提供 AI / Copilot 在任何任務前需要的最小可行上下文。

## 1. 專案概述
- **願景**：提供企業級任務協作與審查系統，支援 Git-like 分支模型、暫存區機制與多組織協作。
- **核心價值**：
  - Blueprint（主專案）與 Branch（組織/任務分支）同步機制
  - 任務、品質、問題、文件等 51 張表構成的多模組資料層
  - Supabase 作為單一 BaaS：Auth、Postgres、Storage、Edge Functions
- **主要 Persona**：總管理員、組織管理者、現場指揮、稽核/驗收人員、AI Agent 協作者。

## 2. 架構與分支模型
### 2.1 Git-like Branch Model
- **Main / Blueprint**：全域真相來源，所有成果最終匯回。
- **Organization Branch**：授權協作組織的專屬分支。
- **Pull Request**：分支合併唯一入口，必須通過審查與自動檢查。
- **Staging Area**：48h rollback window，所有破壞性操作先進入 staging。
- **Issue Sync**：所有阻塞事項即時同步主分支，確保資訊透明。

### 2.2 應用層級架構
```
src/app/
├── core/    # 單例服務、Supabase、拦截器、權限
├── shared/  # 可重用元件、服務、utils、SHARED_IMPORTS
├── routes/  # 功能/領域頁面，遵循 feature-first 結構
└── layout/  # 佈局、導航、主題
```
- **依賴方向**：routes → shared → core；嚴禁反向依賴。
- **Angular 20 標準**：Standalone Components、Signals（input/output/viewChild API）、現代控制流（@if/@for/@switch/@defer）。
- **Change Detection**：預設 `OnPush`，僅在 `ngProjectAgent::Exceptions` 記錄時可使用 Default。

## 2.3 文檔索引（Docs Index）
- `@file .github/agents/docs-index.md`：九大類 `docs/` 資源索引（架構、流程、資料、權限、Agent...）。
- 核心流程：`@C7` → 查官方 → 比對 `docs-index.md` → `@S7` 分析 → `@SPT` 計畫。
- 若 `docs/` 有新增/更新，需同步維護 `docs-index.md` 與 `meta/CHANGELOG.md`。

## 3. 數據與 API 摘要
### 3.1 51 表模組（摘自 `database-overview.md`）
1. 帳戶與身份（accounts, teams, team_members, organization_schedules）
2. 組織協作（organization_collaborations, collaboration_invitations, collaboration_members）
3. 權限系統（roles, user_roles, permissions, role_permissions, branch_permissions）
4. 藍圖/專案（blueprints, blueprint_configs, blueprint_branches, branch_forks, pull_requests）
5. 任務執行（tasks, task_assignments, task_lists, task_staging, daily_reports, report_photos, weather_cache, task_dependencies, task_templates）
6. 品質驗收（quality_checks, qc_photos, inspections, inspection_photos）
7. 問題追蹤（issues, issue_assignments, issue_photos, issue_sync_logs）
8. 協作溝通（comments, notifications, notification_rules, notification_subscriptions, personal_todos, todo_status_tracking）
9. 資料分析（documents, document_versions, document_thumbnails, progress_tracking, activity_logs, analytics_cache）
10. 機器人（bots, bot_tasks, bot_execution_logs）
11. 系統管理（settings, feature_flags）

### 3.2 核心 API（Supabase REST/Auth）
- `POST /auth/v1/login|signup|logout|token` – 認證與 token 維護
- `GET /auth/v1/user` – 取得使用者與 metadata（roles, orgs）
- `GET/POST/PATCH /rest/v1/blueprints` – 專案 CRUD
- `GET/POST/PATCH /rest/v1/tasks` – 任務 CRUD + `select=*,task_assignments(*)`
- `POST /rest/v1/task_assignments` – 任務指派
- 其餘端點請參考 `docs/26-API-接口詳細文檔.md` 與 `domain/security-agent.md` 的權限要求。

### 3.3 安全層
- **Supabase RLS**：所有表啟用，視 branch/org/role 控制。
- **前端權限**：@delon/acl + branch_permissions。
- **敏感資料**：不得放在 localStorage；token 透過 `@delon/auth TokenService` 管理。

## 4. 技術棧與工具
- **前端**：Angular 20.3.x、ng-zorro-antd 20.3.x、ng-alain 20.0.x、Signals、RxJS 7、Less、ESLint+Prettier+Stylelint。
- **後端**：Supabase（Postgres 15、Storage、Realtime、Edge Functions）、Supabase CLI。
- **流程**：Yarn 4.9.2、Husky、lint-staged、Karma/Jasmine、Playwright（建議）。
- **必跑指令**：`yarn type-check`, `yarn lint`, `yarn lint:style`, `yarn build`, `yarn test`。

## 5. 工作流程（Methodology）
1. `@C7` 查詢官方或 ng-alain 最新指南。
2. `@S7`（Sequential Thinking）拆解問題並列出風險。
3. `@SPT` 建立可追蹤任務計畫（含複雜度）。
4. 實作時每個步驟都需驗證（lint/type-check/test）並更新 TODO 狀態。
5. 完成後撰寫變更摘要、測試紀錄、文件同步（README/CHANGELOG）。
6. 重大改動需使用 `meta/CHANGELOG.md` 與 `agents-index.json` 更新版本。

## 6. 目錄與對應指南
| 區塊 | 位置 | 內容 |
| --- | --- | --- |
| 規範 | `AGENTS.md`, `.cursor/rules/` | 全域規範、模組規範 |
| Docs 索引 | `.github/agents/docs-index.md` | `docs/` 目錄分類、快速引用 |
| Agent 說明 | `.github/agents/*.md` | 角色、流程、模板 |
| 技術背景 | `docs/00-開發作業指引.md`, `docs/27-完整架構流程圖.mermaid.md` | 詳細設計、流程圖 |
| 模板 | `.github/agents/templates/` | Prompt / Issue 樣板 |
| Workflow | `.github/agents/workflows/` | GitHub Actions / CI 指南 |
| 索引 | `.github/agents/meta/agents-index.json` | Agent 列表、版本 |

## 7. 快速檢查清單
- [ ] 是否遵循 Git-like Branch 與 staged rollout 流程？
- [ ] 是否移除對 `.ai/` 的依賴，改用本目錄內容？
- [ ] 是否引入 SHARED_IMPORTS + Standalone + Signals？
- [ ] 是否同時考慮 a11y、安全、性能與文件品質？
- [ ] 是否預留 staging rollback 與 PR 驗證步驟？

## 8. 延伸閱讀
- `docs/00-開發作業指引.md` – 完整開發規範
- `docs/27-完整架構流程圖.mermaid.md` – 架構視圖
- `docs/28-架構審查報告.md` – 架構判準
- `docs/30-0-完整SQL表結構定義.md` – 51 表詳解
- `docs/33-API-接口詳細文檔.md` – API 定義
- `docs/43-Agent開發指南與限制說明.md` – Agent 使用規則

---
**版本**：v2.0 – 2025-11-18（.ai → .github/agents 重構）
