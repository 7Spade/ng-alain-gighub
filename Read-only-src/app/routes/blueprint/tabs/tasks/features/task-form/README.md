# Task Form Feature

## 職責
- 提供任務建立、編輯、複製等操作的 Typed Forms 與驗證流程。
- 與藍圖任務詳情、快速建立入口協作。

## Blueprint 協作接口
- `components/task-form.component.ts`：可作為懶載入元件，供藍圖任務頁、每日報表等場景嵌入。
- 預計於 `services/` 補強 form facade / repository，統一提交流程與錯誤處理。
- `state/` 將存放表單草稿 signal，支援跨分頁繼續編輯（待補）。

## 目錄結構
- `components/`：任務表單容器與欄位群組。
- `services/`：預留 facade/repository。
- `models/`：表單 DTO、驗證規則型別。
- `state/`：表單狀態與暫存資料。
- `assets/`：表單樣板、欄位配置。
