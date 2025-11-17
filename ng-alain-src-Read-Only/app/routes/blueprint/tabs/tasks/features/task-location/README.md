# Task Location Feature

## 職責
- 呈現任務地理位置、多時區背景與場址資訊。
- 支援藍圖概覽、天氣預報、資源調度頁籤整合位置資料。

## Blueprint 協作接口
- `services/domain/task-location.service.ts`：供天氣預報、資源調度等模組取得任務位置與時區資訊。
- `services/views/task-location-view.service.ts`：輸出投影資料（地圖、地址、時區），為 `blueprint/tabs/weather` 與 `task-overview` 共用。
- `state/` 預留位置 signal store，協助多視圖同步選擇的任務位置。

## 目錄結構
- `components/`：位置卡片、地圖呈現元件。
- `services/`：區分 domain 與 views 層。
- `models/`：座標、地址、時區等型別。
- `state/`：位置狀態容器。
- `assets/`：地圖樣式、地標圖示。
