# Task Charts Feature

## 職責
- 集中任務相關圖表（進度、成本、風險、資源等）配置與渲染。
- 與藍圖圖表分析頁協同維護圖表資料來源與展示規格。

## Blueprint 協作接口
- `services/`（待建）：將聚合 `task-progress`、`task-cost`、`task-risk` 等模型，輸出圖表可用的 Dataset。
- 規劃在 `state/` 保存圖表篩選條件與快取資料，供 `blueprint/tabs/charts` 與任務概覽共用。
- `components/` 將提供標準化的圖表 wrapper，與 `shared/components` 配合避免重複造輪。

## 目錄結構（規劃中）
- `components/`：圖表容器、filter bar。
- `services/`：dataset projector、chart config provider。
- `models/`：圖表資料模型、指標型別。
- `state/`：圖表層級的 signal/store。
- `assets/`：圖表設定模板、配色。

