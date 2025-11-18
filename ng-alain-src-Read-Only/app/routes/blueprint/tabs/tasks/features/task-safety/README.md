# Task Safety Feature

## 職責
- 管理任務的安全規範、巡檢紀錄與事故回報。
- 為藍圖品質、安全頁面提供最新安全資訊與警示。

## Blueprint 協作接口
- `services/domain/task-safety.service.ts`：提供安全巡檢、事故紀錄等資料查詢。
- `services/repository/task-safety.repository.ts`：封裝安全資料存取與快取策略，供 `blueprint/tabs/quality`、`task-report` 共用。
- 規劃在 `state/` 建立安全 signal/store，支援跨頁籤同步。

## 目錄結構
- `components/`：安全儀表、巡檢 checklist UI（待補）。
- `services/`：區分 domain 與 repository。
- `models/`：安全事件、安全指標型別。
- `state/`：安全狀態容器。
- `assets/`：安全圖示、表單樣板。
