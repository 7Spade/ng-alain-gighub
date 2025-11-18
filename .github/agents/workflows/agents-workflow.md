# Agents Workflow 指南

此文件提供在 GitHub Actions / CI 中載入本資料夾 Agents 的建議做法，涵蓋上下文注入、測試流程與權限控管。

## 1. 推薦 Workflow 結構
```yaml
name: agent-review
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: yarn
      - run: yarn install --immutable
      - name: Load Agents Context
        run: |
          cat .github/agents/role.agent.md
          cat .github/agents/ng-project-agent.md
      - name: Run Domain Agents
        run: |
          node scripts/run-agent.mjs \
            --role .github/agents/role.agent.md \
            --context .github/agents/domain/angular-agent.md \
            --context .github/agents/domain/code-quality-agent.md
```

## 2. 建議步驟
1. **安裝依賴**：`yarn install --immutable`，確保版本鎖定。
2. **靜態檢查**：`yarn type-check`, `yarn lint`, `yarn lint:style`, `yarn test`。
3. **Agent 任務**：讀取 role + project + domain 文件後，以自訂腳本或第三方 Action 呼叫 LLM。
4. **報告整合**：將 Agent output 轉成 Markdown comment 送回 PR，並附上測試結果。

## 3. 權限控管
- 只給最小 `pull-requests: write` 權限以張貼評論。
- 若需存取 secrets（如 Supabase Service Role），應透過 OIDC + 短期 token，禁止硬編碼。

## 4. Domain 選擇策略
| 任務 | 建議 Agents |
| --- | --- |
| Angular / UI | `domain/angular-agent.md`, `domain/accessibility-agent.md` |
| 型別 / API | `domain/typescript-agent.md`, `domain/security-agent.md` |
| 測試 / 覆蓋率 | `domain/testing-agent.md`, `domain/performance-agent.md` |
| 文件 / 品質 | `domain/docs-agent.md`, `domain/code-quality-agent.md` |

## 5. 版本管理
- Workflow 更新後請同步 `meta/CHANGELOG.md`。
- 若新增/移除 agent，務必更新 `meta/agents-index.json`。
- 每次 release 應記錄 workflow 使用的 Node / Yarn 版本。

---
**最後更新**：2025-11-18  
**維護者**：DevOps 團隊
