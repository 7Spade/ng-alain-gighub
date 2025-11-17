# Task Discussion Feature

## 職責
- 承載任務的討論與評論串，串接藍圖討論模組。
- 提供任務上下文的留言、@mention、附件等互動。

## Blueprint 協作接口
- 計畫沿用 `blueprint/tabs/discussions` 的資料結構，並在 `services/` 建立任務範圍的 facade 以避免重複造輪。
- `services/state` 將快取任務與討論串映射，供任務詳情、每日報表等上下文顯示。
- 與 `task-communication` 協作，統一通知與討論事件的來源。

## 目錄結構（規劃中）
- `components/`：任務討論面板、回覆表單。
- `services/`：facade、repository、notification handler。
- `models/`：討論串、留言、附件型別。
- `state/`：討論串狀態管理。
- `assets/`：討論圖示、模板。

