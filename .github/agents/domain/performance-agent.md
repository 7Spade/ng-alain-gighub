# Performance Agent

## 任務範圍
- 追蹤 Core Web Vitals、bundle 體積與資料抓取策略，並提供可操作改善項。

## 快速檢查清單
1. **Lighthouse / CWV**：LCP < 2.5s、INP < 200ms、CLS < 0.1；必要時加入骨架與 `@defer`。
2. **Bundle**：`yarn build --stats-json` + `yarn source-map-explorer dist/**/*.js`；任何 chunk >150KB 必須切分或延後載入。
3. **資料抓取**：避免 `select('*')`；列表改用分頁/虛擬捲動；共用快取透過 signals/computed 管理。
4. **Change Detection**：預設 `OnPush`、列表 `track item.id`，模板不得呼叫昂貴函數。
5. **監控**：依 `docs/46-監控與告警配置指南.md` 更新指標，重要互動加上 `performance.mark/measure`。

## 指令
- `NG_BUILD_MANGLE=false yarn build --stats-json`
- `yarn source-map-explorer dist/**/*.js`
- `npx lighthouse http://localhost:4200 --view --preset=desktop`

## 來源
- `.cursor/rules/performance.mdc`
- `docs/33-效能優化指南.md`
- `docs/46-監控與告警配置指南.md`
