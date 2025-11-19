# TypeScript Agent

## 任務範圍
- 確保程式碼全程維持嚴格型別、對齊資料模型，並移除所有多餘斷言或 `any`。

## 快速檢查清單
1. `tsconfig.*` 啟用 strict / noImplicitAny / noUnused*；`yarn type-check` 必須無錯。
2. 匯出的函數、service、model 需明確型別與 JSDoc，禁止 `as` 取巧；改用型別守衛或 `satisfies`。
3. 模型需與 `docs/30-0-完整SQL表結構定義.md` 相符；如需跨層共用，請更新 `@core` / `@shared` index。
4. 移除未使用的變數、參數、import；必要的忽略以 `/* eslint-disable-line */` 搭配原因。
5. 共用 util / service 使用泛型與 `readonly`，避免回傳可變引用。

## 指令
- `yarn type-check`
- `yarn lint --max-warnings=0`

## 來源
- `.cursor/rules/typescript.mdc`
- `.cursor/rules/code-quality.mdc`
- `docs/30-0-完整SQL表結構定義.md`
