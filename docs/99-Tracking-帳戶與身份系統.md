# 🔐 帳戶與身份系統 - 任務追蹤

> 📋 **目的**：追蹤帳戶與身份系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M1  
**資料表數量**：4 張

---

## 📊 模組資訊

### 資料表清單

1. **accounts** - 帳戶主表（統一身份抽象，支援 User/Bot/Organization）
2. **teams** - 團隊表
3. **team_members** - 團隊成員表
4. **organization_schedules** - 組織排班表（跨藍圖成員調派）

### 模組狀態

- **目前狀態**：🚧 進行中（85%）
- **近期里程碑**：里程碑 5（2025-02-15）
- **主要阻塞**：RLS 驗證、單元/整合測試未啟動

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/account/types.ts）[✅已完成]
Repository 層（4 個 Repository）[✅已完成]
服務層（AccountService, TeamService, OrganizationScheduleService）[✅已完成]
accounts 表 RLS 策略驗證和完善[✅已完成]
teams 表 RLS 策略驗證和完善[✅已完成]
team_members 表 RLS 策略驗證和完善[✅已完成]
organization_schedules 表 RLS 策略驗證和完善[✅已完成]

### 頁面組件開發

賬戶列表頁面（AccountListComponent）[✅已完成]
賬戶詳情頁面（AccountDetailComponent）[✅已完成]
賬戶表單頁面（AccountFormComponent）[✅已完成]
用戶列表頁面（UserListComponent）[✅已完成]
組織列表頁面（OrganizationListComponent）[✅已完成]
組織成員添加頁面（OrganizationMemberAddComponent）[✅已完成]
組織成員刪除頁面（OrganizationMemberDeleteComponent）[✅已完成]
組織角色編輯頁面（OrganizationRoleEditComponent）[✅已完成]
組織角色管理頁面（OrganizationRoleManageComponent）[✅已完成]
Bot 列表頁面（BotListComponent）[✅已完成]
創建組織頁面（CreateOrganizationComponent）[✅已完成]
創建 Bot 頁面（CreateBotComponent）[✅已完成]
團隊列表頁面（TeamListComponent）[✅已完成]
團隊詳情頁面（TeamDetailComponent）[✅已完成]
團隊創建頁面（TeamCreateComponent）[✅已完成]
團隊編輯頁面（TeamEditComponent）[✅已完成]
團隊刪除頁面（TeamDeleteComponent）[✅已完成]
團隊成員添加頁面（TeamMemberAddComponent）[✅已完成]
團隊成員刪除頁面（TeamMemberDeleteComponent）[✅已完成]
團隊角色編輯頁面（TeamRoleEditComponent）[✅已完成]
團隊角色管理頁面（TeamRoleManageComponent）[✅已完成]
排班列表頁面（ScheduleListComponent）[✅已完成]

### 系統評估與優化

賬戶系統完整評估（使用 Sequential Thinking + Software Planning Tool）[✅已完成]
賬戶系統架構違規修復（core 依賴 shared 問題）[✅已完成]
accounts 表 RLS 遞歸問題修復（使用 SECURITY DEFINER 函數）[✅已完成]
Bot 賬戶區分機制實施（個人 Bot 與組織 Bot）[✅已完成]
團隊和排班功能改為組織專有[✅已完成]
模型結構清理（刪除遺留文件，統一命名規範）[✅已完成]

### 測試

單元測試（目標 80% 覆蓋率）[⏳待開始]
集成測試[⏳待開始]
E2E 測試（帳戶管理 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（帳戶系統 API 文檔）[⏳待開始]
用戶指南更新（帳戶管理用戶指南）[⏳待開始]

---

## 📝 備註

### 下一步行動

- 補齊 RLS 四張表驗證
- 撰寫測試與 API 文檔
- 完成用戶指南

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)

