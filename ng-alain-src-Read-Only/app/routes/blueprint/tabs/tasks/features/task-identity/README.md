# Task Identity Feature

## 職責
- 定義任務識別資訊（編碼、分類、標籤、facet）與維度切割。
- 為藍圖概覽、任務搜尋與配置面板提供一致的識別資料來源。

## Blueprint 協作接口
- `services/domain/task-identity.service.ts`：集中管理任務編碼、分類、標籤查詢，供 `blueprint/tabs/overview`、`task-overview` 與篩選面板共用。
- `services/repository/task-facet.repository.ts`、`task-event.repository.ts`：封裝 facet 與事件的讀寫流程，供藍圖儀表板與活動紀錄共用。
- `models/`：輸出核心 `TaskIdentity` 模型與 facet 資料結構，需與 Supabase schema 保持同步。

## 目錄結構
- `models/`：任務識別與 facet 型別定義、匯出入口。
- `services/`：區分 domain 與 repository 層，負責聚合識別相關邏輯。

