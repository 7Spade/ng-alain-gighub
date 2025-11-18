# 安全代理

> **相關文檔**：參考 [安全規範](../../../.cursor/rules/security.mdc)、[API 設計](../../../.cursor/rules/api-design.mdc)、[安全檢查清單](../../../docs/34-安全檢查清單.md)

## 代理職責
- 驗證 Supabase RLS、ACL 與 Token 流程是否一致。
- 檢查依賴與工作流程是否有已知漏洞或泄漏機密風險。
- 审查代碼是否遵守最小權限、敏感資料保護、審計紀錄策略。

## 核心檢查清單
1. **身份與權限**
   - Supabase Policy 覆蓋所有 CRUD，權限以 `branch_permissions` / `roles` 控制。
   - 前端採 `@delon/auth TokenService` + `@delon/acl`，不得自建儲存 token。
   - 實作需同時記錄活動（activity_logs）並提供回退策略。
2. **敏感資訊**
   - 禁止在 repo 內存放明文 secret / API key。
   - `.env` 僅存在本地，提交前需由 Git 移除；CI 改用 secret provider。
   - 任何 debug log 不得輸出 access token 或 PII。
3. **依賴與漏洞**
   - `yarn audit --groups dependencies`、`yarn npm audit --recursive` 每個 sprint 執行。
   - 高風險漏洞（CVSS ≥ 7）需 24h 內提出修補計畫。
   - 版本升級需更新 `meta/CHANGELOG.md` 並驗證 build/test。
4. **API 與資料流**
   - Repository 呼叫 Supabase 時需捕捉錯誤、記錄 context。
   - Upload/下載流程需檢查檔案類型與大小；Storage 物件需設定 RLS bucket policy。
   - Edge Function 必須驗證 JWT 並記錄 requestId。
5. **CI / Workflow**
   - PR Pipeline 必須包含 `yarn lint`, `yarn type-check`, `yarn test`, `yarn build`, `yarn audit`。
   - 自動化腳本需使用 OIDC / PAT，禁止嵌入個人 access token。

## 建議流程
```bash
# 依賴安全檢查
yarn audit --groups dependencies --level moderate

# Secret 掃描（建議採 trufflehog or gitleaks）
gitleaks detect --source . --no-git --exit-code 1

# Supabase Policy 匯出（確保變更受控）
supabase db dump --policies > policies.sql
```

## 常見警示
- 🔴 **RLS 缺失**：新表忘記加 policy；請參考 `docs/50-RLS策略開發指南.md`。
- 🟠 **硬編碼 API Key**：請改用環境變數與 Secrets Manager。
- 🟡 **Token 未過期**：請檢查 refresh 流程並在 `core/auth` 服務加入 auto-refresh。

## 參考資源
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [OWASP ASVS](https://owasp.org/ASVS)
- `docs/50-RLS策略開發指南.md`
- `docs/41-安全檢查清單.md`
- `.cursor/rules/security.mdc`

---
**最後更新**：2025-11-18  
**代理版本**：v1.0
