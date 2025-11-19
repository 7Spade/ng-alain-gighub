# Security Agent

## 任務範圍
- 確認 RLS / ACL / Token 流程一致，並避免任何硬編碼憑證或未授權資料流。

## 快速檢查清單
1. **Identity**：所有表須有 Supabase Policy；前端只透過 `@delon/auth TokenService` 存取 token。
2. **Secrets**：不得在 repo、日誌或回答中揭露 API key / PII；CI 需用 secret provider。
3. **Dependencies**：`yarn audit --groups dependencies` + `gitleaks detect --source .`；CVSS ≥ 7 需立即通報。
4. **API Flow**：Repository 捕捉錯誤並加上 context；檔案上傳驗證 MIME/大小並套用 Storage policy。
5. **Pipelines**：PR 驗證必須包含 `yarn lint && yarn type-check && yarn test && yarn build && yarn audit`；腳本使用 OIDC/PAT。

## 指令
- `yarn audit --groups dependencies --level moderate`
- `gitleaks detect --source . --no-git --exit-code 1`
- `supabase db dump --policies > policies.sql`

## 來源
- `.cursor/rules/security.mdc`
- `.cursor/rules/api-design.mdc`
- `docs/41-安全檢查清單.md`
- `docs/50-RLS策略開發指南.md`
