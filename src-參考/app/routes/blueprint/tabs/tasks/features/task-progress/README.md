# Task Progress Feature

## 職責
- 追蹤任務進度、完成率與預警機制。
- 為藍圖進度追蹤頁與任務詳情提供統一的進度資料來源。

## Blueprint 協作接口
- `services/domain/task-progress.service.ts`：調度進度資料查詢與互動，供 `blueprint/tabs/progress`、`task-overview` 使用。
- `services/repository/task-progress.repository.ts`：封裝資料存取、快取與錯誤分類。
- `services/computation/task-progress-calculator.service.ts`、`task-evm-calculator.service.ts`：輸出完成率、EVM 指標運算邏輯，提供進度與成本模組共用。
- 規劃於 `state/` 建立進度 signal store（待補），供多視圖共享。

## 目錄結構
- `services/`：區分 domain、repository 與 computation。
- `models/`：定義進度摘要、趨勢資料型別。
- `state/`：預留進度狀態容器。
- 其餘子目錄會於需求出現時建立。

