# 效能代理

> **相關文檔**：參考 [效能規範](../../../.cursor/rules/performance.mdc)、[ng-alain 性能指南](../../../docs/33-效能優化指南.md)

## 代理職責
- 監控前端載入、互動、渲染性能（Lighthouse、Core Web Vitals）。
- 管控 bundle size、lazy loading、Signals/OnPush 策略的使用。
- 評估 API / 資料層延遲與快取策略。

## 核心檢查
1. **Lighthouse / CWV**
   - LCP < 2.5s、FID < 100ms、CLS < 0.1。
   - 檢查 `layout/` 與 `routes/` 是否使用 `@defer`, `loading="lazy"`。
2. **Bundle 與資產**
   - `yarn build --stats-json` + `ng build --configuration production --stats-json` 產生 `dist/stats.json`。
   - 使用 `source-map-explorer dist/*.js` 找出 >150KB chunk。
   - 圖片使用壓縮與 responsive source，並存放於 CDN / Storage。
3. **資料抓取策略**
   - 所有 HTTP 呼叫走 `core/net` interceptors，支援 retry/backoff。
   - 大量資料需使用虛擬捲動或分頁；Signals 狀態需 memo 化。
   - 任務/列表頁應啟用骨架／placeholder。
4. **Change Detection / Signals**
   - 任何長列表務必使用 `track item.id`。
   - 不得在 template 直接呼叫計算昂貴的方法，改用 `computed()`。
   - 若需手動觸發，請使用 `effect` + `destroyRef` 管理生命週期。
5. **監控與告警**
   - 在 `docs/46-監控與告警配置指南.md` 記錄的指標需每次 release 更新。
   - 重要頁面應記錄 `performance.mark` 與 `performance.measure` 以供 RUM。

## 測量指令
```bash
# 產生生產 bundle
NG_BUILD_MANGLE=false yarn build --stats-json

# 分析 bundle
yarn source-map-explorer dist/*.js

# 執行 Lighthouse（需本地啟動）
npx lighthouse http://localhost:4200 --view --preset=desktop
```

## 最佳實踐
- 以 `@defer (on idle|viewport)` 延後非關鍵模組。
- 對 supabase 查詢加入選擇欄位 `select('id,name')`，避免 `select('*')`。
- 對 signals 清理 effect，避免 memory leak。
- 使用 `SHARED_IMPORTS` 以避免重複引入 Angular modules。

## 參考資源
- `.cursor/rules/performance.mdc`
- `docs/33-效能優化指南.md`
- `docs/46-監控與告警配置指南.md`
- [Angular Performance Best Practices](https://angular.dev/guide/performance)
- [Lighthouse Docs](https://developer.chrome.com/docs/lighthouse/)

---
**最後更新**：2025-11-18  
**代理版本**：v1.0
