# 開發脈絡記錄索引 (FYI Index)

> 本文檔已按分類重新組織，請參考對應的分類文檔。

## 📋 文檔分類

### 📄 1. 專案背景（Background）
➡ [fyi-background.md](./fyi-background.md)

說明專案存在的原因、需求來源、使用者痛點、商業或技術動機、問題定義與目標。

---

### 📄 2. 開發脈絡（Development）
➡ [fyi-development.md](./fyi-development.md) ｜ 歷史：[`Archive`](./Archive/fyi-development.md)

- `fyi-development.md` 現在僅保留最新一至兩季的決策紀錄。
- 2025-11-14 以前的完整決策、取捨與實施細節已搬遷至 Archive 版本。
- 如需查詢既有案例（例如權限模組設計、Supabase 與 @delon/auth 整合、項目結構重構等），請優先搜尋 Archive。

---

### 📄 3. 架構說明（Architecture）
➡ [fyi-architecture.md](./fyi-architecture.md)

描述系統整體設計：
- 系統架構圖
- 模組切分與責任界線
- 資料流、事件流
- 使用到的技術與模式

**主要內容**：
- 分層架構設計
- 權限系統架構
- 認證系統架構
- 模組依賴關係
- 緩存架構

---

### 📄 4. 上下文（Context）
➡ [fyi-context.md](./fyi-context.md)

跨領域共用脈絡：
- Domain 用語
- 模組之間的關係
- 業務背景
- 需跨團隊理解的重要知識

**主要內容**：
- Git-like 分支模型用語
- 權限系統用語
- 業務邏輯背景
- 技術上下文
- 業務規則

---

### 📄 5. 歷史紀錄（History）
➡ [fyi-history.md](./fyi-history.md) ｜ 歷史：[`Archive`](./Archive/fyi-history.md)

- 主檔僅保留最新事件概覽；請依需求補寫 2025-11-15 之後的里程碑。
- 2025-11-14（含）以前的時間線、重大改動與里程碑已完整存放於 Archive。

---

### 📄 6. 備忘 / 雜項筆記（Notes）
➡ [fyi-notes.md](./fyi-notes.md)

放置：
- 未分類資訊
- 中間過程筆記
- 研究結果
- 不適合放在正式文件中的暫存點

---

### 📄 7. 性能優化（Performance）
➡ [fyi-performance.md](./fyi-performance.md)

記錄性能優化策略和指標：
- 緩存策略
- 性能優化方案
- 性能指標歷史數據
- 構建時間、測試覆蓋率等

---

### 📄 8. 問題與挑戰（Challenges）
➡ [fyi-challenges.md](./fyi-challenges.md) ｜ 歷史：[`Archive`](./Archive/fyi-challenges.md)

- 主檔僅用於記錄最新、仍在影響中的問題。
- 歷史案例（2025-11-14 前）已彙整至 Archive，包含權限緩存權衡、Supabase 整合挑戰、賬戶系統架構修復等紀錄。

---

### 📄 9. 代碼庫索引（Codebase）
➡ [fyi-codebase.md](./fyi-codebase.md) ｜ 歷史：[`Archive`](./Archive/fyi-codebase.md)

- 主檔目前僅提供重新生成指引，避免舊快照誤導。
- 之前的 Repomix 輸出已移至 Archive，可在那裡查閱完整 20K+ 行快照或重新生成最新版本。

---

## 🔍 快速查找

### 按主題查找

- 歷史案例（2025-11-14 前）請直接查閱 `docs/Archive/` 下對應 FYI 文件或各工作總結。
- 若需要最新版的實施狀態，請參考：
  - `docs/44-專案路線圖.md`（整體計畫與里程碑）
  - `docs/00-開發作業指引.md` / `docs/35-開發工作流程.md`（流程規範）
  - 對應模組的 README / SUMMARY（例如 `src/app/core/infra/README.md`）
- 新的主題分類可在此區增補；移除的連結已搬遷至 Archive，避免指向不存在的章節。

---

## 📝 更新說明

- 2025-11-14 以前的更新紀錄已搬遷至 `docs/Archive/fyi-history.md` 與對應 FYI Archive 檔案。
- 若需要補充新事件，請在此以倒序方式紀錄，並同步更新對應 FYI/Archive 文件。
- 新增/調整後請更新「最後更新」日期與維護者資訊。

---

**最後更新**：2025-11-14  
**維護者**：開發團隊
