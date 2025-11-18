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

- **目前狀態**：⏳ 骨架完成
- **近期里程碑**：里程碑 8（2025-04-15）
- **主要阻塞**：需任務系統資料、RLS 策略

---

## 📋 任務清單

### 數據層與服務層

數據模型層（shared/models/quality/）[✅已完成]
創建 quality.types.ts（QC 狀態、照片類型）[✅已完成]
Repository 層（4 個 Repository）[✅已完成]
服務層（QualityCheckService, InspectionService）[✅已完成]
品質檢查流程實現[⏳待開始]
驗收流程實現（責任切割）[⏳待開始]
RLS 權限驗證[⏳待開始]
與任務系統資料串接[⏳待開始]

### 頁面組件開發

品管檢查列表頁面（QualityChecksComponent）[🚧進行中]
品管檢查詳情頁面（QualityCheckDetailComponent）[🚧進行中]
品管檢查表單頁面（QualityCheckFormComponent）[⏳待開始]
品管提交頁面（QualitySubmitComponent）[⏳待開始]
驗收列表頁面（QualityInspectionsComponent）[⏳待開始]
驗收詳情頁面（QualityInspectionDetailComponent）[🚧進行中]
品管照片頁面（QualityPhotosComponent）[⏳待開始]
品管照片上傳組件（QualityPhotoUploadComponent）[⏳待開始]
品管照片查看器組件（QualityPhotoViewerComponent）[⏳待開始]
品質結果頁面（QualityResultsComponent）[⏳待開始]
驗收詳情組件（InspectionDetailComponent）[⏳待開始]

### 測試

單元測試[⏳待開始]
集成測試[⏳待開始]
E2E 測試（品質驗收流程 E2E 測試）[⏳待開始]

### 文檔

API 文檔更新（品質驗收系統 API 文檔）[⏳待開始]
用戶指南更新（品質驗收用戶指南）[⏳待開始]

---

## 📝 備註

### 下一步行動

- 定義 quality 模型與流程
- 串接任務資料
- 建立 RLS 策略

### 相關文檔

- [資料表清單總覽](./23-資料表清單總覽.md)
- [專案路線圖](./00-專案路線圖.md)
- [架構審查報告](./28-架構審查報告.md)

