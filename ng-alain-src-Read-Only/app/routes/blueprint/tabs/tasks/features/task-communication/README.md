# Task Communication Feature

## 職責
- 彙整任務的溝通紀錄、RFI/會議記錄與通知設定。
- 為藍圖討論、活動等頁籤提供任務維度的溝通資料。

## Blueprint 協作接口
- `services/domain/task-communication.service.ts`：集中處理任務溝通資料查詢與互動。
- `services/repository/task-communication.repository.ts`：封裝 Supabase/HTTP 存取，供 `blueprint/tabs/discussions` 與任務詳情頁共用。
- 規劃於 `state/` 建立 signal store，作為討論串與活動紀錄的共享狀態來源。

## 目錄結構
- `components/`：對話串、通知設定等 UI（待補）。
- `services/`：拆分 domain 與 repository 層。
- `models/`：任務溝通訊息、附件、參與者等型別定義。
- `state/`：預留溝通狀態容器。
- `assets/`：靜態圖示與範本。
