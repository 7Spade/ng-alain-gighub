# Agents Actions Mapping

> 列出可與本專案 Agents 搭配的 GitHub Actions / CLI Snippets，協助在不同流程中載入正確文件。

## 1. 直接呼叫 OpenAI / Azure OpenAI
```yaml
- name: Agent Review (OpenAI)
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    npx @cloudflare/ai-agent \
      --role .github/agents/role.agent.md \
      --context .github/agents/ng-project-agent.md \
      --context .github/agents/domain/security-agent.md \
      --prompt "請審查本 PR 是否有安全風險"
```

## 2. Cursor CLI（若啟用）
```yaml
- name: Cursor Agent
  run: |
    cursor agent \
      --mode review \
      --context .github/agents/ng-project-agent.md \
      --context .github/agents/domain/testing-agent.md
```

## 3. 內部腳本 `scripts/run-agent.mjs`
> 範例：將 Agent 結果輸出為 Markdown comment。
```yaml
- name: Run Docs Agent
  run: |
    node scripts/run-agent.mjs \
      --role .github/agents/role.agent.md \
      --context .github/agents/domain/docs-agent.md \
      --input "請檢查本 PR 是否同步更新 README"
```

## 4. Lighthouse + Performance 代理
```yaml
- name: Lighthouse Audit
  run: |
    yarn build
    npx http-server dist/app -p 4200 &
    npx lighthouse http://127.0.0.1:4200 --output=json --output-path=./lighthouse.json
- name: Analyze with Performance Agent
  run: |
    node scripts/run-agent.mjs \
      --role .github/agents/role.agent.md \
      --context .github/agents/domain/performance-agent.md \
      --input "依據 lighthouse.json 給出優化建議"
```

## 5. Issue / 任務整合
- 在 GitHub Issue 使用 `templates/issue-template-for-agents.md`，提供：目標、輸入、約束、驗證與風險。
- Actions 可監聽 `issues.assigned` 事件，自動指派對應 agent。

## 6. 注意事項
- 所有腳本必須記錄所用檔案（role/context），以便稽核。
- 對產出結果需附上 lint/type-check/test 證明。
- 若 Agent 建議變更，CI 需確保對應修復 commit 已存在。

---
**最後更新**：2025-11-18
