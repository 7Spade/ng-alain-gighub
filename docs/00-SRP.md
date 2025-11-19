Component：只處理 UI → 單一職責

Service：只處理邏輯 → 單一職責

Repository：只處理 API/資料存取 → 單一職責

Pipe：只處理轉換 → 單一職責

Directive：只處理 DOM 行為 → 單一職責

Facade：只處理狀態與 UI 溝通 → 單一職責

企業級 Angular 最常見規範包含：

👉 Component 禁止放業務邏輯

👉 Service 不可同時處理 API + domain logic

👉 Repository 不能做 UI model mapping

👉 Facade 不能做 API mapping 或 UI 轉換