# Task Role Feature

## 職責
- 定義任務參與角色、責任分工與權限矩陣。
- 為藍圖設定頁、資源調度與討論權限提供一致的角色資訊。

## Blueprint 協作接口
- `services/views/task-role-view.service.ts`：產出角色與權限的視圖資料，供 `blueprint/tabs/settings`、`task-detail` 使用。
- 規劃新增 domain/repository 層，整合 `core/auth`或組織模組的資料（尚未實作）。
- `state/` 目錄將承載角色狀態 store，跨頁籤共享（待補）。

## 目錄結構
- `components/`：角色矩陣、權限配置 UI（待補）。
- `services/`：目前提供 view service，可擴充 domain/repository。
- `models/`：角色、權限、責任分類型別。
- `state/`：角色相關 signal/store。
- `assets/`：角色圖示、預設配置。

