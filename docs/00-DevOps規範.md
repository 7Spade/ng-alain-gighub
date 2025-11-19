建置流程：type check → lint → test → build → deploy。

任何 PR 都必須經過至少 1 reviewer。

Conventional Commit 強制。

Versioning 使用 SemVer。

CI 必須產出 production build artifacts。

Sentry / APM 必須整合錯誤追蹤。

所有秘密由 Vault / Secret Manager 管理。