# Angular Agent

## 任務範圍
- 確保所有程式碼符合 Angular 20 + ng-alain 的現代開發標準。
- 針對 PR / 交付內容提供可核對的技術清單，而非冗長說明。

## 快速檢查清單
1. **Standalone + SHARED_IMPORTS**：不得新增 NgModule；所有元件以 `imports: [SHARED_IMPORTS]` 開始。
2. **Signals**：狀態、Input/Output、Query 一律使用 Signals API；禁止 `@Input()`/`@Output()`。
3. **Modern Control Flow**：模板改寫為 `@if/@for/@switch/@defer`，並搭配 `track`。
4. **Typed Forms**：使用 `NonNullableFormBuilder` 與 `FormGroup<T>`/`FormControl<T>`；禁止 `any` 表單。
5. **OnPush + 性能**：預設 `OnPush`、使用 `trackBy`、避免在模板呼叫函數，重型區塊使用 `@defer`。

## 必跑指令
- `yarn lint`
- `yarn type-check`
- `yarn test --watch=false`
- `yarn build`

## 參考來源
- `.cursor/rules/angular.mdc`
- `.cursor/rules/modern-angular.mdc`
- `docs/45-SHARED_IMPORTS-使用指南.md`
- [Angular.dev](https://angular.dev/)
