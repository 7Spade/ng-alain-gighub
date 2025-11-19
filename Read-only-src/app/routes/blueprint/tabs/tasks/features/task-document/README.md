# Task Document Feature

## 職責
- 管理任務文件、版本控管與權限設定。
- 支援藍圖文件管理頁與任務詳情中文件標籤的展示與操作。

## Blueprint 協作接口
- `services/task-document.service.ts`：提供文件上傳、簽核與狀態更新 API。
- `services/repository/task-document.repository.ts`：封裝文件清單讀取、版本歷史與權限檢查，供藍圖 `documents/` 與任務詳情共用。
- 規劃在 `state/` 建立文件 signal store，共享給不同視圖。

## 目錄結構
- `components/`：文件列表、預覽、版本歷程 UI（待補）。
- `services/`：包含 domain/service 與 repository。
- `models/`：文件、版本、權限等資料模型。
- `state/`：文件狀態容器（待補）。
- `assets/`：檔案類型圖示、靜態配置。
