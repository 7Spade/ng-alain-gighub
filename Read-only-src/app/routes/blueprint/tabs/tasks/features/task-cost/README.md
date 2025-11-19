# Task Cost Feature

## 職責
- 處理任務成本、預算與 EVM 指標的計算與呈現。
- 對應藍圖圖表分析、成本報表與進度頁面的財務面資料。

## Blueprint 協作接口
- `services/domain/task-cost.service.ts`：提供成本摘要查詢與互動 API。
- `services/repository/task-cost.repository.ts`：封裝資料來源與快取策略，供藍圖總覽/圖表頁面取用。
- `services/computation/task-cost-calculator.service.ts`：統一 EVM、成本差異等運算邏輯，提供給任務與藍圖共享。
- 規劃於 `state/` 建立成本 signal store（待補），供多視圖共用。

## 目錄結構
- `components/`：成本摘要卡、趨勢圖 UI（待補）。
- `services/`：區分 domain / repository / computation。
- `models/`：成本科目、時序資料等型別。
- `state/`：存放成本 signal/store（待補）。
- `assets/`：成本圖示、範本設定。
