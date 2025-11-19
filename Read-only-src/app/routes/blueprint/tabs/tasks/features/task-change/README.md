# Task Change Feature

## 職責
- 管理任務變更申請、版本差異與審批作業的前端表現層。
- 規劃變更流程的訊息流、驗證規則與審核狀態同步。

## Blueprint 協作接口
- `services/domain/task-change.service.ts`：暴露任務變更查詢與提交介面，供 `blueprint/tabs/issues` 及任務詳情頁取得最新變更紀錄。
- 預計補充 `state/` 下的 signal store，作為變更工作流程共用狀態來源。

## 目錄結構
- `components/`：變更列表、審核面板等 UI。
- `services/`：劃分領域邏輯（domain）與資料存取（repository，待補）。
- `models/`：對應變更單、審批歷程等型別定義。
- `state/`：集中管理變更流程 signal/store（待補強）。
- `assets/`：存放變更流程圖示、靜態配置。
