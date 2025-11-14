# 開發脈絡記錄索引 (FYI Index)

> 本文檔已按分類重新組織，請參考對應的分類文檔。

## 📋 文檔分類

### 📄 1. 專案背景（Background）
➡ [fyi-background.md](./fyi-background.md)

說明專案存在的原因、需求來源、使用者痛點、商業或技術動機、問題定義與目標。

---

### 📄 2. 開發脈絡（Development）
➡ [fyi-development.md](./fyi-development.md)

記錄開發過程中所有重要思考：
- 技術選型理由
- 解法評估
- 架構或模組設計背後的原則
- 取捨、權衡、背後原因

**主要內容**：
- 權限服務模組設計決策
- Supabase 與 @delon/auth 整合決策
- 認證方式統一決策
- 項目結構重構規劃

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
➡ [fyi-history.md](./fyi-history.md)

專案已經完成、已經發生的累積紀錄：
- 版本演進
- 已做的重大決策
- 改動歷史與重構紀錄
- 完成的里程碑
- 不再使用的舊方案與原因（Why dropped）

**主要內容**：
- 時間線總覽
- 版本演進
- 里程碑紀錄
- 重大改動
- 技術重構歷史
- 已完成事項
- 待完成事項

---

### 📄 6. 備忘 / 雜項筆記（Notes）
➡ [fyi-notes.md](./fyi-notes.md)

放置：
- 未分類資訊
- 中間過程筆記
- 研究結果
- 不適合放在正式文件中的暫存點

---

## 🔍 快速查找

### 按主題查找

#### 權限系統
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-實施階段-1---權限服務模組corepermissions)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#權限系統架構)
- **使用說明**：→ [fyi-context.md](./fyi-context.md#權限系統用語)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-實施階段-1---權限服務模組)

#### 認證系統
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-11-14-supabase-與-delonauth-整合)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#認證系統架構)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-11-14-supabase-與-delonauth-整合)

#### 項目結構
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-項目結構重構規劃)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#項目結構設計)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-項目結構重構規劃)

---

## 📝 更新說明

**2025-01-15**：按分類重新組織文檔結構
- 將原 `fyi.md` 內容拆分到 6 個分類文檔
- 保持所有歷史記錄完整
- 提升文檔可讀性和查找效率

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
