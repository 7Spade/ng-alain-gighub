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

### 📄 7. 性能優化（Performance）
➡ [fyi-performance.md](./fyi-performance.md)

記錄性能優化策略和指標：
- 緩存策略
- 性能優化方案
- 性能指標歷史數據
- 構建時間、測試覆蓋率等

---

### 📄 8. 問題與挑戰（Challenges）
➡ [fyi-challenges.md](./fyi-challenges.md)

記錄開發過程中遇到的問題和挑戰：
- 問題描述
- 影響範圍
- 解決方案
- 經驗教訓

---

### 📄 9. 代碼庫索引（Codebase）
➡ [fyi-codebase.md](./fyi-codebase.md)

完整的代碼庫打包內容：
- 所有 TypeScript 源代碼
- 項目結構與文件組織
- 代碼庫完整快照
- 用於 AI 分析與代碼審查

**生成方式**：
- 使用 Repomix 工具自動生成
- 執行：`npx -y repomix --config repomix.config.json --output docs/fyi-codebase.md --style markdown --verbose`

---

## 🔍 快速查找

### 按主題查找

#### 權限系統
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-實施階段-1---權限服務模組corepermissions)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#權限系統架構)
- **性能優化**：→ [fyi-performance.md](./fyi-performance.md#權限系統緩存策略)
- **使用說明**：→ [fyi-context.md](./fyi-context.md#權限系統用語)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-實施階段-1---權限服務模組)
- **設計挑戰**：→ [fyi-challenges.md](./fyi-challenges.md#2025-01-15-權限系統設計權衡)

#### 認證系統
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-11-14-supabase-與-delonauth-整合)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#認證系統架構)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-11-14-supabase-與-delonauth-整合)
- **整合挑戰**：→ [fyi-challenges.md](./fyi-challenges.md#2025-11-14-supabase-與-delonauth-整合挑戰)

#### 項目結構
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-項目結構重構規劃)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#項目結構設計)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-項目結構重構規劃)
- **代碼庫內容**：→ [fyi-codebase.md](./fyi-codebase.md)

#### 賬戶系統開發
- **架構決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15賬戶系統架構決策反覆)
- **架構違規修復**：→ [賬戶系統架構違規修復總結.md](./賬戶系統架構違規修復總結.md) ⭐ 新增
- **結構評估**：→ [賬戶系統開發-結構評估總結.md](./賬戶系統開發-結構評估總結.md)
- **完整評估**：→ [fyi-history.md](./fyi-history.md#2025-01-15-賬戶系統完整評估) ⭐ 新增（2025-01-15）
- **評估方法**：→ [fyi-development.md](./fyi-development.md#2025-01-15-賬戶系統完整評估方法) ⭐ 新增（2025-01-15）
- **MVP 實施完成**：→ [账户系统MVP实施完成总结.md](./账户系统MVP实施完成总结.md) ⭐ 新增（2025-01-15）
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-賬戶系統-mvp-實施完成) ⭐ 新增（2025-01-15）
- **技術決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-賬戶系統-mvp-實施) ⭐ 新增（2025-01-15）
- **RLS 策略驗證**：→ [fyi-history.md](./fyi-history.md#2025-01-15-賬戶系統-rls-策略驗證和完善) ⭐ 新增（2025-01-15）
- **RLS 技術決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-賬戶系統-rls-策略驗證和完善) ⭐ 新增（2025-01-15）
- **修復記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-賬戶系統架構違規修復)
- **問題挑戰**：→ [fyi-challenges.md](./fyi-challenges.md#2025-01-15-賬戶系統架構違規修復)

#### 組織協作系統開發
- **數據模型和 Repository 層實施**：→ [组织协作系统-数据模型和Repository层实施总结.md](./组织协作系统-数据模型和Repository层实施总结.md) ⭐ 新增（2025-01-15）
- **Service 層和 UI 層實施**：→ [组织协作系统-Service层和UI层实施总结.md](./组织协作系统-Service层和UI层实施总结.md) ⭐ 更新（2025-01-15）
  - ✅ Service 層：100% 完成（CollaborationService、InvitationService）
  - ✅ UI 層：75% 完成（列表、詳情、表單、邀請列表）
  - ✅ 路由配置：100% 完成
  - ✅ 構建驗證：通過
  - ✅ 自驗收：通過
- **RLS 權限驗證**：→ [工作總結-組織協作系統-RLS驗證-2025-01-15.md](./工作總結-組織協作系統-RLS驗證-2025-01-15.md) ⭐ 新增（2025-01-15）
  - ✅ 共創建 12 個 RLS 策略（3 張表 × 4 個操作）
  - ✅ 策略覆蓋所有操作類型（SELECT, INSERT, UPDATE, DELETE）
  - ✅ 構建驗證通過
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-組織協作系統-數據模型和-repository-層實施) ⭐ 新增（2025-01-15）
- **技術決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-組織協作系統-數據模型和-repository-層實施) ⭐ 新增（2025-01-15）

#### 資料庫安全（RLS）
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-基礎-rls-策略實施)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-基礎-rls-策略實施)
- **詳細策略**：→ [21-安全與-RLS-權限矩陣.md](./21-安全與-RLS-權限矩陣.md)
- **RLS 遞歸問題修復**：→ [fyi-development.md](./fyi-development.md#2025-01-15-accounts-表-rls-遞歸問題修復) ⭐ 新增（2025-01-15）
- **修復記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-accounts-表-rls-遞歸問題修復) ⭐ 新增（2025-01-15）
- **官方方法**：→ [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md) ⭐ 新增（2025-01-15）

#### 基礎設施模組（Infrastructure）
- **實施總結**：→ [基礎設施模組實施總結.md](./基礎設施模組實施總結.md) ⭐ 新增
- **設計決策**：→ [fyi-development.md](./fyi-development.md#2025-01-15-基礎設施模組實施)
- **架構設計**：→ [fyi-architecture.md](./fyi-architecture.md#基礎設施模組架構)
- **實施記錄**：→ [fyi-history.md](./fyi-history.md#2025-01-15-基礎設施模組實施)
- **使用指南**：→ [src/app/core/infra/README.md](../src/app/core/infra/README.md)
- **快速開始**：→ [src/app/core/infra/QUICK_START.md](../src/app/core/infra/QUICK_START.md)

#### 代碼庫
- **完整代碼庫**：→ [fyi-codebase.md](./fyi-codebase.md)
- **生成配置**：→ [repomix.config.json](../repomix.config.json)

---

## 📝 更新說明

**2025-01-15**：按分類重新組織文檔結構
- 將原 `fyi.md` 內容拆分到 6 個分類文檔
- 保持所有歷史記錄完整
- 提升文檔可讀性和查找效率
- 新增代碼庫索引（fyi-codebase.md）

**2025-01-15**：基礎 RLS 策略實施
- 完成所有 51 張表的 RLS 啟用
- 建立基礎安全策略
- 為後續細化策略留下空間

**2025-01-15**：賬戶系統架構評估
- 完成代碼結構評估和基礎目錄創建
- 重新評估 Repository 和 Service 位置
- 確定採用 Repository 模式，充分利用現有基礎設施
- 記錄決策反覆過程，為後續開發提供參考

**2025-01-15**：基礎設施模組實施
- 完成 TypeScript 類型定義生成（51 張表）
- 建立統一錯誤處理機制
- 建立數據轉換工具（snake_case ↔ camelCase）
- 建立基礎 Repository 類（BaseRepository）
- 建立 BlueprintRepository 示例
- 完成模組導出和文檔編寫
- 構建驗證通過，所有代碼編譯成功

**2025-01-15**：賬戶系統 RLS 策略驗證和完善
- 使用 Supabase MCP 工具驗證和完善 4 張表的 RLS 策略
- 共創建 15 個 RLS 策略，覆蓋所有操作類型
- 確保數據訪問權限正確，為後續開發提供安全基礎
- 構建驗證通過

**2025-01-15**：組織協作系統 - 數據模型和 Repository 層實施
- 完成 Core 層類型定義（3 個枚舉）
- 完成 Shared 層數據模型（3 個類型定義）
- 完成 3 個 Repository（共 15 個查詢方法）
- 更新模組導出文件
- 構建驗證通過

**2025-01-15**：賬戶系統架構違規修復
- 修復 core 依賴 shared 的架構違規
- 將 `AccountType`、`AccountStatus`、`TeamMemberRole` 枚舉移到 core 層
- 修復路徑別名使用錯誤，統一使用根導出
- 保持向後兼容，現有代碼無需修改
- 建立架構違規修復總結文檔

**2025-01-15**：專案路線圖建立
- 建立專案路線圖文檔（[44-專案路線圖.md](./44-專案路線圖.md)）
- 記錄當前狀態、開發計劃和里程碑
- 規劃 Phase 1 MVP（3 個月）和 Phase 2 功能增強（3 個月）
- 定義開發優先級和 9 個關鍵里程碑
- 在文檔索引和脈絡文檔中建立引用

**2025-01-15**：專案自驗收
- 使用 Chrome DevTools MCP 工具進行自驗收
- 檢查應用啟動、登入功能、網絡請求
- 發現 user_roles 查詢問題（400 錯誤）需要修復
- 發現 i18n 翻譯缺失問題
- 生成自驗收報告（[工作總結-自驗收-2025-01-15.md](./工作總結-自驗收-2025-01-15.md)）⭐ 新增

**2025-01-15**：accounts 表 RLS 遞歸問題修復
- 發現並修復 accounts 表 RLS 策略遞歸問題（500 錯誤）
- 使用 Supabase 官方推薦的 SECURITY DEFINER 函數方法
- 創建 `private.is_user_org_member` 和 `private.is_user_org_admin` 函數
- 更新 accounts 表的 SELECT 和 UPDATE 策略
- 驗證修復成功，查詢返回 200 OK
- 生成完整修復文檔（[工作總結-完整流程-accounts-RLS修復-2025-01-15.md](./工作總結-完整流程-accounts-RLS修復-2025-01-15.md)）⭐ 新增
- 相關文檔：
  - [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md) ⭐ 新增
  - [工作總結-修復失敗原因分析-2025-01-15.md](./工作總結-修復失敗原因分析-2025-01-15.md) ⭐ 新增
  - [工作總結-accounts-RLS修復完成-2025-01-15.md](./工作總結-accounts-RLS修復完成-2025-01-15.md) ⭐ 新增
  - [工作總結-最終驗證-accounts-RLS修復-2025-01-15.md](./工作總結-最終驗證-accounts-RLS修復-2025-01-15.md) ⭐ 新增

**2025-01-15**：完整開發工作流程執行
- 按照完整開發工作流程指令執行，包括思考框架建立、專案脈絡回顧、構建驗證、自驗收和總結
- 使用 Sequential Thinking + Software Planning Tool 進行任務規劃
- 使用 Chrome DevTools MCP 進行自驗收測試
- 構建驗證通過（Bundle 大小 3.47 MB，超出預算但功能正常）
- 發現 5 個問題：Bundle 大小超出、ESLint 配置問題、登入表單驗證問題、i18n 翻譯缺失、可訪問性問題
- 生成完整工作總結（[工作總結-完整開發工作流程執行-2025-01-15.md](./工作總結-完整開發工作流程執行-2025-01-15.md)）⭐ 新增

---

**最後更新**：2025-01-15  
**維護者**：開發團隊
