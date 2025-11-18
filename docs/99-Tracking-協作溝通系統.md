# 💬 協作溝通系統 - 任務追蹤

> 📋 **目的**：追蹤協作溝通系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M8  
**資料表數量**：6 張

---

## 📊 模組資訊

### 資料表清單

1. **comments** - 留言表（任務、問題的討論留言）
2. **notifications** - 通知表（系統通知記錄）
3. **notification_rules** - 通知規則表（用戶自訂通知規則）
4. **notification_subscriptions** - 通知訂閱表
5. **personal_todos** - 個人待辦中心表（五種狀態分類：待執行/暫存中/品管中/驗收中/問題追蹤）
6. **todo_status_tracking** - 待辦狀態追蹤表

### 模組狀態

- **目前狀態**：⏳ 骨架完成
- **近期里程碑**：里程碑 8（2025-04-15）
- **主要阻塞**：通知/待辦資料模型缺失

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/communication/）[⏳待開始]
創建 communication.types.ts（評論、通知類型）[✅已完成]
Repository 層（6 個 Repository）[⏳待開始]
服務層（CommentService, NotificationService, TodoService）[⏳待開始]
留言功能實現[⏳待開始]
通知系統實現[⏳待開始]
通知規則引擎[⏳待開始]
待辦中心實現（五種狀態分類）[⏳待開始]
RLS 權限驗證[⏳待開始]

### 頁面組件開發

討論列表頁面（DiscussionListComponent）[⏳待開始]
評論列表頁面（CommentListComponent）[⏳待開始]
評論創建頁面（CommentCreateComponent）[⏳待開始]
通知中心頁面（NotificationCenterComponent）[⏳待開始]
通知詳情頁面（NotificationDetailComponent）[🚧進行中]
通知規則頁面（NotificationRulesComponent）[🚧進行中]
實時通知頁面（RealtimeNotifyComponent）[⏳待開始]
待辦中心頁面（TodoCenterComponent）[⏳待開始]
團隊通知頁面（TeamNotifyComponent）[⏳待開始]

### 測試

單元測試[⏳待開始]
集成測試[⏳待開始]
E2E 測試（待辦中心 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（協作溝通系統 API 文檔）[⏳待開始]
用戶指南更新（協作溝通用戶指南）[⏳待開始]

---

## 📝 備註

### 下一步行動

- 定義 comment/notification/todo 資料流
- 建立通知規則引擎
- 實現待辦中心五種狀態分類

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)

