# Sample Agent Config

此範例示範如何組合 `role.agent.md`、`ng-project-agent.md` 與多個 domain 文件，供自訂 CLI / GitHub Action 使用。

```json
{
  "name": "ng-alain-review",
  "role": ".github/agents/role.agent.md",
  "contexts": [
    ".github/agents/ng-project-agent.md",
    ".github/agents/domain/angular-agent.md",
    ".github/agents/domain/code-quality-agent.md",
    ".github/agents/domain/testing-agent.md"
  ],
  "checklist": [
    "Confirm SHARED_IMPORTS + Standalone usage",
    "Verify Signals + OnPush patterns",
    "Run yarn lint && yarn type-check",
    "Run yarn test --watch=false",
    "Report findings with @file tags and severity"
  ],
  "output": {
    "format": "markdown",
    "sections": ["analysis", "findings", "tests", "risks", "next steps"]
  }
}
```

> 可將此 JSON 傳入內部 `scripts/run-agent.mjs` 或第三方 Agent 執行器，並依需求調整 contexts / checklist。
