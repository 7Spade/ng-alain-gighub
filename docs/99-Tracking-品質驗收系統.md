# ✅ 品質驗收系統 - 任務追蹤

> 📋 **目的**：追蹤品質驗收系統模組的開發任務  
> **格式**：一行一個任務[狀態]  
> **狀態標記**：✅已完成、🚧進行中、⏳待開始、🧊阻塞

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**模組編號**：M6  
**資料表數量**：4 張

---

## 📊 模組資訊

### 架構層級完成情況

#### Routes Layer（業務層）
- ✅ **頁面組件骨架**：20/20 組件骨架完成（100%）
- 🚧 **頁面組件功能**：15/20 組件功能完成（75%）
- ⏳ **待完成**：5 個組件功能完善（篩選、排序、批量操作、照片上傳、核准/退回）

#### Shared Layer（共享層）
- ✅ **Services（業務服務）**：2/2 服務完成（100%）
  - ✅ QualityCheckService
  - ✅ InspectionService
- ✅ **Models（數據模型）**：4 張表的類型定義完成（100%）

#### Core Layer（基礎設施層）
- ⏳ **Facades（門面層）**：0/1 Facade 完成（0%）
  - ⏳ QualityFacade（品質驗收 Facade，待實施）
- ✅ **Services（核心服務）**：無（品質驗收使用 Shared Services）
- ✅ **Repositories（數據訪問層）**：4/4 Repository 完成（100%）
  - ✅ QualityCheckRepository
  - ✅ QcPhotoRepository
  - ✅ InspectionRepository
  - ✅ InspectionPhotoRepository
- ✅ **SupabaseService（數據庫客戶端）**：已完成（基礎設施）

### 資料表清單

1. **quality_checks** - 品質管理表（品管檢查記錄）
2. **qc_photos** - 品管照片表
3. **inspections** - 驗收表（最終驗收/責任切割）
4. **inspection_photos** - 驗收照片表

### 模組狀態

- **目前狀態**：🚧 基礎架構完成，組件開發進行中
- **完成度**：約 60%（基礎層完成，業務邏輯層部分完成，UI 層基本完成但功能不完整）
- **近期里程碑**：里程碑 8（2025-04-15）
- **主要阻塞**：🧊 需任務系統資料串接、🧊 RLS 策略實現、🧊 Supabase Storage 整合

### 里程碑對照表

| 里程碑 | 目標日期 | 關鍵任務 | 完成狀態 | 備註 |
|--------|---------|---------|---------|------|
| **里程碑 8** | 2025-04-15 | 品質驗收系統完成 | 🚧 60% | 基礎架構完成，業務邏輯待實作 |
| - | - | 數據層與服務層完成 | ✅ 100% | Repository、Service 層已完成 |
| - | - | 頁面組件骨架完成 | ✅ 100% | 所有頁面骨架已建立 |
| - | - | 頁面組件功能完成 | 🚧 75% | 15/20 組件功能完成 |
| - | - | QualityFacade 實施 | ⏳ 0% | 待開始 |
| - | - | 業務邏輯實現 | ⏳ 0% | 品質檢查流程、驗收流程待實現 |
| - | - | RLS 權限驗證（4 張表） | 🧊 0% | 阻塞：需先定義策略 |
| - | - | Supabase Storage 整合 | 🧊 0% | 阻塞：照片上傳功能 |
| - | - | 任務系統資料串接 | 🧊 0% | 阻塞：依賴任務系統 |
| - | - | 單元測試（目標 80%） | ⏳ 13% | 僅部分組件有測試 |
| - | - | 集成測試 | ⏳ 0% | 待開始 |
| - | - | E2E 測試 | ⏳ 0% | 待開始 |

### 測試覆蓋率目標

| 層級 | 目標覆蓋率 | 當前覆蓋率 | 狀態 | 備註 |
|------|-----------|-----------|------|------|
| **Service 層** | ≥80% | 0% | ⏳ 待開始 | QualityCheckService、InspectionService 待測試 |
| **Repository 層** | ≥80% | 0% | ⏳ 待開始 | 4 個 Repository 待測試 |
| **Component 層** | ≥70% | ~10% | ⏳ 待補齊 | 僅部分組件有測試 |
| **Facade 層** | ≥80% | 0% | ⏳ 待開始 | QualityFacade 待實施 |
| **整體目標** | ≥75% | ~13% | ⏳ 待補齊 | 需大幅提升測試覆蓋率 |

### 技術債務清單

| 項目 | 優先級 | 影響範圍 | 預計工作量 | 狀態 |
|------|--------|---------|-----------|------|
| QualityFacade 實施 | 🔴 高 | 統一接口、錯誤處理 | 2-3 天 | ⏳ 待開始 |
| 業務邏輯實現 | 🔴 高 | 核心功能 | 5-7 天 | ⏳ 待開始 |
| RLS 權限驗證（4 張表） | 🔴 高 | 安全性 | 2-3 天 | 🧊 阻塞 |
| Supabase Storage 整合 | 🔴 高 | 照片上傳功能 | 2-3 天 | 🧊 阻塞 |
| 任務系統資料串接 | 🔴 高 | 功能完整性 | 2-3 天 | 🧊 阻塞 |
| 單元測試覆蓋率不足 | 🔴 高 | 代碼質量 | 5-7 天 | ⏳ 待開始 |
| 集成測試缺失 | 🟡 中 | 功能驗證 | 3-4 天 | ⏳ 待開始 |
| E2E 測試缺失 | 🟡 中 | 端到端驗證 | 2-3 天 | ⏳ 待開始 |

### 已知問題清單

| 問題 | 嚴重程度 | 影響範圍 | 狀態 | 解決方案 |
|------|---------|---------|------|---------|
| 需任務系統資料串接 | 🔴 高 | 功能完整性 | 🧊 阻塞 | 等待任務系統完成，定義資料串接接口 |
| RLS 權限驗證未實施 | 🔴 高 | 安全性 | 🧊 阻塞 | 定義 RLS 策略（參考 `docs/09-安全與-RLS-權限矩陣.md`） |
| Supabase Storage 整合未實現 | 🔴 高 | 照片上傳功能 | 🧊 阻塞 | 實現照片上傳到 Storage，創建 Document 記錄 |
| 業務邏輯未實現 | 🔴 高 | 核心功能 | ⏳ 待解決 | 實現品質檢查流程、驗收流程 |
| 測試覆蓋率不足 | 🔴 高 | 代碼質量 | ⏳ 待解決 | 補齊單元測試和集成測試 |

---

## 📋 任務清單

### 數據層與服務層

#### 數據模型層

數據模型層（shared/models/quality.models.ts）[✅已完成]
- QualityCheck 實體類型定義[✅已完成]
- QualityCheckInsert/Update 類型定義[✅已完成]
- QcPhoto 實體類型定義[✅已完成]
- Inspection 實體類型定義[✅已完成]
- InspectionPhoto 實體類型定義[✅已完成]
- QualityCheckDetail 詳情類型定義[✅已完成]
- QualityCheckType 枚舉定義[✅已完成]
- QualityCheckStatus 枚舉定義[✅已完成]
- QualityCheckItem 接口定義[✅已完成]

#### 類型定義層

創建 quality.types.ts（core/infra/types/quality.types.ts）[✅已完成]
- QualityCheckStatus 枚舉（基礎層）[✅已完成]
- QcPhotoType 枚舉[✅已完成]
- InspectionPhotoType 枚舉[✅已完成]

#### Repository 層

QualityCheckRepository[✅已完成]
- 基礎 CRUD 操作[✅已完成]
- findByTaskId 方法[✅已完成]
- findByInspectorId 方法[✅已完成]
- findByStatus 方法[✅已完成]

QcPhotoRepository[✅已完成]
- 基礎 CRUD 操作[✅已完成]
- findByQcId 方法[✅已完成]
- findByDocumentId 方法[✅已完成]
- findByPhotoType 方法[✅已完成]
- findByUploadedBy 方法[✅已完成]

InspectionRepository[✅已完成]
- 基礎 CRUD 操作[✅已完成]
- findByTaskId 方法[✅已完成]
- findByInspectorId 方法[✅已完成]
- findByStatus 方法[✅已完成]

InspectionPhotoRepository[✅已完成]
- 基礎 CRUD 操作[✅已完成]
- findByInspectionId 方法[✅已完成]
- findByPhotoType 方法[✅已完成]

#### 服務層

QualityCheckService[✅已完成]
- 使用 Signals 管理狀態[✅已完成]
- getById 方法（取得品質檢查詳情）[✅已完成]
- create 方法[✅已完成]
- update 方法[✅已完成]
- delete 方法[✅已完成]
- 資料庫類型與應用模型類型轉換[✅已完成]

InspectionService[✅已完成]
- 使用 Signals 管理狀態[✅已完成]
- loadByTask 方法[✅已完成]
- getById 方法[✅已完成]
- create 方法[✅已完成]
- update 方法[✅已完成]
- delete 方法[✅已完成]
- Computed signals（按狀態分類）[✅已完成]

#### Core Layer - Facades（門面層）

**依賴關係**：Facades → Services → Repositories → SupabaseService

QualityFacade 實施（core/facades/quality.facade.ts）[⏳待開始]
- **依賴**：QualityCheckService, InspectionService（Shared Layer）
- **依賴**：BlueprintActivityService, ErrorStateService（Shared Layer）
QualityFacade Signals 狀態管理[⏳待開始]
QualityFacade 品質檢查管理（createQualityCheck, updateQualityCheck, deleteQualityCheck）[⏳待開始]
QualityFacade 驗收管理（createInspection, updateInspection, deleteInspection）[⏳待開始]
QualityFacade 照片管理（addQcPhoto, removeQcPhoto, addInspectionPhoto, removeInspectionPhoto）[⏳待開始]
QualityFacade 查詢方法（loadQualityChecksByTask, loadInspectionsByTask）[⏳待開始]
QualityFacade Computed signals（pendingQualityChecks, passedQualityChecks, failedQualityChecks, pendingInspections）[⏳待開始]
QualityFacade 統計功能（qualityStats, inspectionStats, passRate）[⏳待開始]
QualityFacade 活動記錄整合（BlueprintActivityService）[⏳待開始]
QualityFacade 錯誤處理整合（ErrorStateService）[⏳待開始]
更新 core/index.ts 導出 QualityFacade[⏳待開始]

#### Core Layer - Repositories（數據訪問層）

**依賴關係**：Repositories → SupabaseService → Supabase

✅ **已完成**：4/4 Repository（100%）
- ✅ QualityCheckRepository（依賴 SupabaseService）
- ✅ QcPhotoRepository（依賴 SupabaseService）
- ✅ InspectionRepository（依賴 SupabaseService）
- ✅ InspectionPhotoRepository（依賴 SupabaseService）

#### Core Layer - SupabaseService（數據庫客戶端）

✅ **已完成**：SupabaseService 基礎設施已完成（core/infra/supabase.service.ts）

#### 業務邏輯層

品質檢查流程實現[⏳待開始]
- 檢查項目管理[⏳待開始]
- 檢查狀態流轉[⏳待開始]
- 自動觸發問題開立[⏳待開始]
- 檢查結果通知[⏳待開始]

驗收流程實現（責任切割）[⏳待開始]
- 驗收類型管理（初步/最終/保固/移交）[⏳待開始]
- 責任轉移記錄[⏳待開始]
- 驗收狀態流轉[⏳待開始]
- 驗收結果通知[⏳待開始]

與任務系統資料串接[🧊阻塞]
- 任務關聯查詢[🧊阻塞]
- 任務狀態同步[🧊阻塞]
- 任務完成觸發驗收[🧊阻塞]

RLS 權限驗證[🧊阻塞]
- quality_checks 表 RLS 策略[🧊阻塞]
- qc_photos 表 RLS 策略[🧊阻塞]
- inspections 表 RLS 策略[🧊阻塞]
- inspection_photos 表 RLS 策略[🧊阻塞]
- 應用層權限驗證[🧊阻塞]

### 頁面組件開發

#### 品質檢查相關組件

品管檢查列表頁面（QualityChecksComponent）[🚧進行中]
- 基本列表顯示[✅已完成]
- 藍圖選擇功能[✅已完成]
- 任務關聯顯示[✅已完成]
- 新建檢查功能[✅已完成]
- 查看詳情功能[✅已完成]
- 篩選功能[⏳待開始]
- 排序功能[⏳待開始]
- 批量操作[⏳待開始]

品管檢查詳情頁面（QualityCheckDetailComponent）[✅已完成]
- 基本詳情顯示[✅已完成]
- 編輯功能[✅已完成]
- 狀態更新[✅已完成]
- 檢查項目顯示[✅已完成]
- Modal 組件用於快速查看[✅已完成]
- 路由組件用於完整操作[✅已完成]
- 照片顯示[⏳待開始]
- 歷史記錄[⏳待開始]
- 關聯任務顯示[⏳待開始]

品管檢查表單頁面（QualityCheckFormComponent）[✅已完成]
- 表單基本結構[✅已完成]
- 檢查類型選擇[✅已完成]
- 檢查項目輸入[✅已完成]
- 表單驗證[✅已完成]
- 提交功能[✅已完成]
- 檢查項目動態管理[⏳待開始]

品管提交頁面（QualitySubmitComponent）[🚧進行中]
- 基本表單結構[✅已完成]
- 藍圖選擇[✅已完成]
- 任務選擇（TODO）[🧊阻塞]
- 驗收類型選擇[✅已完成]
- 提交功能（TODO）[⏳待開始]

#### 驗收相關組件

驗收列表頁面（QualityInspectionsComponent）[🚧進行中]
- 基本列表顯示[✅已完成]
- 藍圖選擇功能[✅已完成]
- 列表數據載入（使用 mock 數據）[🚧進行中]
- 查看詳情功能[✅已完成]
- 篩選功能[⏳待開始]
- 排序功能[⏳待開始]

驗收詳情頁面（QualityInspectionDetailComponent）[🚧進行中]
- 基本詳情顯示[✅已完成]
- Mock 數據展示[✅已完成]
- 檢查項目顯示[✅已完成]
- 照片顯示[✅已完成]
- 歷史記錄顯示[✅已完成]
- 通過率計算[✅已完成]
- 真實數據連接[🧊阻塞]
- 核准/退回功能（TODO）[⏳待開始]
- 匯出報表功能（TODO）[⏳待開始]

驗收詳情組件（InspectionDetailComponent）[✅已完成]
- 基本詳情顯示[✅已完成]
- 驗收類型顯示[✅已完成]
- 狀態顯示[✅已完成]
- 檢查項目顯示[✅已完成]
- 缺陷顯示[✅已完成]
- 責任轉移顯示[✅已完成]
- 真實數據載入[✅已完成]

#### 照片相關組件

品管照片頁面（QualityPhotosComponent）[✅已完成]
- 照片列表顯示[✅已完成]
- 藍圖選擇功能[✅已完成]
- 照片網格展示[✅已完成]
- 上傳照片功能[✅已完成]
- 查看照片功能[✅已完成]
- 照片篩選[⏳待開始]

品管照片上傳組件（QualityPhotoUploadComponent）[🚧進行中]
- 基本表單結構[✅已完成]
- 照片類型選擇[✅已完成]
- 文件選擇功能[✅已完成]
- 文件驗證[✅已完成]
- Supabase Storage 上傳（TODO）[🧊阻塞]
- Document 記錄創建（TODO）[🧊阻塞]

品管照片查看器組件（QualityPhotoViewerComponent）[✅已完成]
- 照片顯示[✅已完成]
- 照片資訊顯示[✅已完成]
- 照片類型標籤[✅已完成]

#### 結果相關組件

品質結果頁面（QualityResultsComponent）[✅已完成]
- 結果列表顯示[✅已完成]
- 藍圖選擇功能[✅已完成]
- 狀態篩選[✅已完成]
- 結果統計[✅已完成]
- 查看詳情功能[✅已完成]
- 匯出功能[⏳待開始]

### 路由配置

品質驗收路由配置（routes.ts）[✅已完成]
- 路由結構定義[✅已完成]
- 懶加載配置[✅已完成]
- 路由守衛（TODO）[⏳待開始]

### 測試

#### 單元測試

QualityCheckService 單元測試[⏳待開始]
InspectionService 單元測試[⏳待開始]
QualityCheckRepository 單元測試[⏳待開始]
InspectionRepository 單元測試[⏳待開始]
QualityChecksComponent 單元測試[⏳待開始]
QualityCheckDetailComponent 單元測試[✅已完成]（測試文件存在）
QualityInspectionDetailComponent 單元測試[✅已完成]（測試文件存在）

#### 集成測試

品質檢查流程集成測試[⏳待開始]
驗收流程集成測試[⏳待開始]
照片上傳流程集成測試[⏳待開始]

#### E2E 測試

品質驗收流程 E2E 測試[⏳待開始]
- 創建品質檢查[⏳待開始]
- 提交驗收申請[⏳待開始]
- 驗收審核流程[⏳待開始]
- 照片上傳流程[⏳待開始]

### 文檔

API 文檔更新（品質驗收系統 API 文檔）[⏳待開始]
- Service 層 API 文檔[⏳待開始]
- Repository 層 API 文檔[⏳待開始]
- 組件使用文檔[⏳待開始]

用戶指南更新（品質驗收用戶指南）[⏳待開始]
- 品質檢查操作指南[⏳待開始]
- 驗收流程操作指南[⏳待開始]
- 照片管理操作指南[⏳待開始]

---

## 📜 開發歷程記錄

### Phase 1: 基礎架構（2024-12）

- ✅ 數據模型層建立（shared/models/quality.models.ts）
- ✅ 類型定義層建立（core/infra/types/quality.types.ts）
- ✅ Repository 層實現（4 個 Repository）
  - ✅ QualityCheckRepository
  - ✅ QcPhotoRepository
  - ✅ InspectionRepository
  - ✅ InspectionPhotoRepository
- ✅ 基礎 Service 層實現（QualityCheckService, InspectionService）

### Phase 2: 頁面組件開發（2025-01）

- ✅ 品質檢查相關組件骨架建立
  - ✅ QualityChecksComponent（品管檢查列表）
  - ✅ QualityCheckDetailComponent（品管檢查詳情）
  - ✅ QualityCheckFormComponent（品管檢查表單）
  - ✅ QualitySubmitComponent（品管提交）
- ✅ 驗收相關組件骨架建立
  - ✅ QualityInspectionsComponent（驗收列表）
  - ✅ QualityInspectionDetailComponent（驗收詳情）
  - ✅ InspectionDetailComponent（驗收詳情組件）
- ✅ 照片相關組件建立
  - ✅ QualityPhotosComponent（品管照片）
  - ✅ QualityPhotoUploadComponent（品管照片上傳）
  - ✅ QualityPhotoViewerComponent（品管照片查看器）
- ✅ 結果相關組件建立
  - ✅ QualityResultsComponent（品質結果）

### Phase 3: 功能完善（進行中）

- 🚧 頁面組件功能完善（15/20 組件功能完成）
- ⏳ 業務邏輯實現（品質檢查流程、驗收流程）
- ⏳ QualityFacade 實施
- 🧊 RLS 權限驗證（阻塞：需先定義策略）
- 🧊 Supabase Storage 整合（阻塞：照片上傳功能）
- 🧊 任務系統資料串接（阻塞：依賴任務系統）

### 2025-01-15：組件架構優化

- ✅ **組件架構確認**：質量檢查詳情組件 Modal 和路由組件功能不同，保留兩者
  - Modal 組件：用於快速查看檢查詳情
  - 路由組件：完整的質量檢查詳情頁面，支持編輯狀態、發現和建議
- ✅ **組件整合完成**：所有組件已符合企業標準（Signals、OnPush、錯誤處理）

### 2025-01-15：代碼審查改進建議

#### ⚠️ 代碼質量改進

1. **@switch 狀態渲染改進**：
   - **問題**：多個組件使用 `@switch` 渲染狀態標籤
   - **影響**：狀態值變更需要多處修改，違反 DRY 原則
   - **建議**：逐步替換為 `StatusPipe`（需要更多測試）
   - **涉及文件**：
     - `src/app/routes/quality/checks/quality-check-detail.component.ts`
     - `src/app/routes/quality/results/inspection-detail.component.ts`

2. **內聯樣式改進**：
   - **問題**：組件中大量使用 `style="..."` 內聯樣式
   - **建議**：將內聯樣式提取到組件的 `styles` 數組中

---

## 📦 應該要交付的

### 核心功能交付清單

#### ✅ 已完成交付

1. **數據層**
   - ✅ 4 個 Repository（100%）
   - ✅ 數據模型層（100%）
   - ✅ 類型定義（100%）

2. **服務層**
   - ✅ QualityCheckService（品質檢查服務）
   - ✅ InspectionService（驗收服務）

3. **頁面組件（骨架和部分功能）**
   - ✅ QualityChecksComponent（品管檢查列表，基本功能完成）
   - ✅ QualityCheckDetailComponent（品管檢查詳情，基本功能完成）
   - ✅ QualityCheckFormComponent（品管檢查表單，100%）
   - ✅ QualitySubmitComponent（品管提交，部分功能）
   - ✅ QualityInspectionsComponent（驗收列表，基本功能完成）
   - ✅ QualityInspectionDetailComponent（驗收詳情，基本功能完成）
   - ✅ InspectionDetailComponent（驗收詳情組件，100%）
   - ✅ QualityPhotosComponent（品管照片，100%）
   - ✅ QualityPhotoUploadComponent（品管照片上傳，部分功能）
   - ✅ QualityPhotoViewerComponent（品管照片查看器，100%）
   - ✅ QualityResultsComponent（品質結果，100%）

4. **路由配置**
   - ✅ 品質驗收路由配置（routes.ts）

5. **測試（部分）**
   - ✅ QualityCheckDetailComponent 單元測試
   - ✅ QualityInspectionDetailComponent 單元測試

#### ⏳ 待交付

1. **功能完善**
   - ⏳ 業務邏輯實現（品質檢查流程、驗收流程）
   - ⏳ QualityFacade 實施
   - 🧊 RLS 權限驗證（4 張表，阻塞）
   - 🧊 Supabase Storage 整合（阻塞）
   - 🧊 任務系統資料串接（阻塞）

2. **頁面組件功能完善**
   - ⏳ 篩選、排序、批量操作功能
   - ⏳ 照片上傳完整功能（Storage 整合）
   - ⏳ 真實數據連接（移除 mock 數據）
   - ⏳ 核准/退回功能
   - ⏳ 匯出報表功能

3. **測試**
   - ⏳ 完整單元測試（目標 80% 覆蓋率）
   - ⏳ 集成測試
   - ⏳ E2E 測試（品質驗收流程）

4. **文檔**
   - ⏳ API 文檔更新（品質驗收系統 API 文檔）
   - ⏳ 用戶指南更新（品質驗收用戶指南）

### 交付標準

#### 功能完整性
- ✅ 基礎架構（100%）
- ✅ 數據層（100%）
- ✅ 服務層（100%）
- 🚧 頁面組件（75%，15/20 組件功能完成）
- ⏳ 業務邏輯（0%）
- 🧊 RLS 權限驗證（0%，阻塞）

#### 代碼質量
- ✅ TypeScript 類型安全（100%）
- ✅ 架構規範遵循（100%）
- ⏳ 單元測試（13%，僅部分組件有測試）
- ⏳ 集成測試（0%）
- ⏳ E2E 測試（0%）

#### 文檔完整性
- ✅ 代碼註釋（100%）
- ⏳ API 文檔（0%）
- ⏳ 用戶指南（0%）

---

## 📝 備註

### 已完成項目總結

✅ **基礎架構層（100% 完成）**
- 數據模型定義完整
- Repository 層實現完整
- Service 層實現完整
- 類型定義完整

✅ **UI 組件層（約 80% 完成）**
- 所有主要組件已創建
- 基本功能已實現
- 部分組件使用 mock 數據

### 進行中項目

🚧 **業務邏輯完善**
- 品質檢查流程需要完善
- 驗收流程需要完善
- 組件功能需要完善

### 阻塞項目

🧊 **任務系統資料串接**
- 需要等待任務系統完成
- 需要定義資料串接接口
- 需要實現狀態同步機制

🧊 **RLS 權限驗證**
- 需要定義 RLS 策略（參考 `docs/09-安全與-RLS-權限矩陣.md`）
- 需要實現應用層權限驗證
- 需要測試權限控制

🧊 **Supabase Storage 整合**
- 需要實現照片上傳到 Storage
- 需要創建 Document 記錄
- 需要實現照片 URL 生成

### 下一步行動

1. **優先級 1（阻塞解除）**
   - 實現 RLS 策略（參考 `docs/09-安全與-RLS-權限矩陣.md`）
   - 實現 Supabase Storage 整合
   - 完成任務系統資料串接

2. **優先級 2（功能完善）**
   - 完善品質檢查流程實現
   - 完善驗收流程實現（責任切割）
   - 移除 mock 數據，連接真實數據

3. **優先級 3（測試與文檔）**
   - 編寫單元測試
   - 編寫集成測試
   - 編寫 E2E 測試
   - 更新 API 文檔
   - 更新用戶指南

### 相關代碼位置

- **核心服務**：`src/app/shared/services/quality/`
  - `quality-check.service.ts` - 品質檢查服務
  - `inspection.service.ts` - 驗收服務
- **Facade 層**：`src/app/core/facades/`
  - `quality.facade.ts` - 品質驗收 Facade（⏳待實施）
- **Repository 層**：`src/app/core/infra/repositories/`
  - `quality-check.repository.ts` - 品質檢查 Repository
  - `qc-photo.repository.ts` - 品管照片 Repository
  - `inspection.repository.ts` - 驗收 Repository
  - `inspection-photo.repository.ts` - 驗收照片 Repository
- **數據模型**：`src/app/shared/models/quality.models.ts`
- **頁面組件**：`src/app/routes/quality/`
  - `checks/quality-checks.component.ts` - 品管檢查列表
  - `checks/quality-check-detail.component.ts` - 品管檢查詳情
  - `checks/quality-check-form.component.ts` - 品管檢查表單
  - `inspections/quality-inspections.component.ts` - 驗收列表
  - `inspections/quality-inspection-detail.component.ts` - 驗收詳情
  - `photos/quality-photos.component.ts` - 品管照片
  - `results/quality-results.component.ts` - 品質結果

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [安全與 RLS 權限矩陣](./09-安全與-RLS-權限矩陣.md)
- [系統架構思維導圖](./01-系統架構思維導圖.mermaid.md)

---

## 📊 統計資訊

**總任務數**：約 90 個任務  
**已完成**：約 54 個任務（60%）  
**進行中**：約 6 個任務（7%）  
**待開始**：約 30 個任務（33%）

**完成度分析**：
- 數據層：✅ 100%（20/20 任務）
- 服務層：✅ 100%（9/9 任務）
- 頁面組件：🚧 75%（15/20 任務）
- 業務邏輯：⏳ 0%（0/8 任務）
- 權限與安全：🧊 0%（0/5 任務）
- 測試：⏳ 13%（2/15 任務）
- 文檔：⏳ 0%（0/2 任務）

