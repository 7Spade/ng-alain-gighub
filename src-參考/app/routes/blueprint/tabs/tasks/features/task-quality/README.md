# Task Quality Feature

## 職責
- 管理任務品質檢測、缺陷追蹤與改善計畫。
- 為藍圖品質管理頁提供任務層級 KPI 與稽核資訊。

## Blueprint 協作接口
- `services/domain/task-quality.service.ts`：輸出品質稽核、檢測結果等資料。
- `services/repository/task-quality.repository.ts`：封裝品質相關資料來源，供 `blueprint/tabs/quality`、任務詳情共用。
- 規劃於 `state/` 建立品質 signal store，支援總覽、任務詳情同步顯示。

## 目錄結構
- `components/`：品質儀表、檢測列表等 UI（待補）。
- `services/`：區分 domain 與 repository。
- `models/`：稽核項目、缺陷分類、改善措施等型別。
- `state/`：品質狀態容器。
- `assets/`：品質指標圖示與樣板。
