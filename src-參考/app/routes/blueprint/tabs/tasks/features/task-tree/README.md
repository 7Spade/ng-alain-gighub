# Task Tree Feature

## 職責
- 建立任務階層結構、拖曳調整與依賴同步。
- 提供 `task-overview`、藍圖任務樹視圖與報表的基礎資料。

## Blueprint 協作接口
- `services/domain/*`：維護任務階層、子任務同步邏輯。
- `services/computation/*`：提供任務樹投影、統計運算，供 `task-overview`、`task-progress` 共用。
- `services/views/*`：輸出樹狀表格所需的投影資料，供藍圖任務首頁重用。
- `state/` 將保存選取節點、展開狀態等資訊（待補）。

## 目錄結構
- `models/`：任務樹節點、層級定義。
- `services/`：區分 computation、domain、views。
- `state/`：任務樹相關 signal/store。
- 其他子目錄視需求補齊。
