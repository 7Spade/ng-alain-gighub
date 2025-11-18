# Testing Agent

## 任務範圍
- 確保每次提交附帶可重現測試與覆蓋率報告，並針對缺口提出具體行動。

## 快速檢查清單
1. **覆蓋率**：單元 ≥80%、服務 ≥90%、關鍵邏輯 100%；PR 需附 `yarn test:coverage` 報告或摘要。
2. **測試型別**：所有 service / component / guard / pipe 皆有 `*.spec.ts`，Signals、錯誤路徑與異常流程必測。
3. **依賴控制**：測試模組僅載入被測元件與必要 providers（`provideHttpClientTesting` 等）；禁止整包 `SharedModule`。
4. **AAA + 描述清楚**：每個測試遵循 Arrange-Act-Assert，針對邊界條件拆分案例。
5. **CI 要求**：`yarn lint && yarn type-check && yarn test --watch=false && yarn test:coverage`；上傳 `coverage/lcov.info` 供品質門檻使用。

## 指令
- `yarn test --watch=false`
- `yarn test:coverage && open coverage/index.html`

## 來源
- `.cursor/rules/testing.mdc`
- `docs/38-測試指南.md`
- [Angular Testing Guide](https://angular.dev/guide/testing)
