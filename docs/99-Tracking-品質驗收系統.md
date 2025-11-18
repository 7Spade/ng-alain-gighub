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

品管檢查詳情頁面（QualityCheckDetailComponent）[🚧進行中]
- 基本詳情顯示[✅已完成]
- 編輯功能[✅已完成]
- 狀態更新[✅已完成]
- 檢查項目顯示[✅已完成]
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

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)
- [安全與 RLS 權限矩陣](./09-安全與-RLS-權限矩陣.md)
- [系統架構思維導圖](./01-系統架構思維導圖.mermaid.md)

