# Types 層增強檢查清單

> **建立日期**: 2025-11-21  
> **文檔類型**: 企業級工作檢查清單  
> **優先級**: P1 (中優先級 - 基礎設施層)  
> **預估工時**: 2-3 天

---

## 📋 目的 (Purpose)

本文檔提供 Types 層（`core/infra/types/`）的詳細增強檢查清單，確保所有枚舉定義完整、一致且符合企業標準。

## 👥 目標讀者 (Audience)

- 前端開發者
- 架構師
- AI Agents

---

## 📖 目錄

1. [總覽](#總覽)
2. [待補充枚舉清單](#待補充枚舉清單)
3. [待統一枚舉清單](#待統一枚舉清單)
4. [實施步驟](#實施步驟)
5. [驗證檢查清單](#驗證檢查清單)
6. [參考文檔](#參考文檔)

---

## 🎯 總覽

### 背景

Types 層是五層架構的基礎，定義了所有業務枚舉和基礎類型。當前存在以下問題：

1. **缺少枚舉定義**: 10+ 個枚舉未定義，使用字符串類型代替
2. **重複定義**: 3 處枚舉在 core/types 和 shared/models 重複定義
3. **命名不一致**: 部分枚舉值未使用小寫字符串
4. **缺少註釋**: 部分枚舉缺少 JSDoc 註釋

### 目標

- ✅ 補充所有缺失的枚舉定義（10+ 個）
- ✅ 統一重複定義的枚舉（3 處）
- ✅ 確保所有枚舉值使用小寫字符串
- ✅ 為所有枚舉添加清晰的 JSDoc 註釋

### 工作量統計

| 類別 | 數量 | 預估工時 |
|------|------|---------|
| 待補充枚舉 | 10 個 | 1.5 天 |
| 待統一枚舉 | 3 處 | 0.5 天 |
| 驗證測試 | - | 0.5 天 |
| **總計** | **13 項** | **2-3 天** |

---

## 📝 待補充枚舉清單

### 🔴 P0: 高優先級枚舉（核心業務）

#### 1. InspectionStatus（檢查狀態）
**文件**: `core/infra/types/quality/quality.types.ts`

**現狀**: ❌ 不存在，使用字符串類型

**需求**: 
- 數據庫有 status 字段
- Inspection Service 中需要按狀態查詢

**工作項**:
- [ ] 在 `quality.types.ts` 中定義 `InspectionStatus` 枚舉
- [ ] 添加 JSDoc 註釋
- [ ] 更新 `index.ts` 匯出

**代碼示例**:
```typescript
/**
 * 檢查狀態枚舉
 * 
 * @description 定義檢查的各種狀態
 */
export enum InspectionStatus {
  /** 待檢查 */
  PENDING = 'pending',
  /** 檢查中 */
  IN_PROGRESS = 'in_progress',
  /** 已通過 */
  PASSED = 'passed',
  /** 未通過 */
  FAILED = 'failed',
  /** 已完成 */
  COMPLETED = 'completed'
}
```

**驗證**:
- [ ] 枚舉值與數據庫字段一致
- [ ] JSDoc 註釋完整
- [ ] TypeScript 編譯無錯誤
- [ ] Lint 檢查通過

**預估工時**: 0.5 小時

---

#### 2. InspectionType（檢查類型）
**文件**: `core/infra/types/quality/quality.types.ts`

**現狀**: ❌ 不存在，使用字符串類型

**需求**: 
- 數據庫有 inspection_type 字段
- Inspection Repository 需要按類型查詢

**工作項**:
- [ ] 在 `quality.types.ts` 中定義 `InspectionType` 枚舉
- [ ] 添加 JSDoc 註釋
- [ ] 更新 `index.ts` 匯出

**代碼示例**:
```typescript
/**
 * 檢查類型枚舉
 * 
 * @description 定義檢查的類型分類
 */
export enum InspectionType {
  /** 現場檢查 */
  SITE = 'site',
  /** 文件檢查 */
  DOCUMENT = 'document',
  /** 進度檢查 */
  PROGRESS = 'progress',
  /** 安全檢查 */
  SAFETY = 'safety',
  /** 質量檢查 */
  QUALITY = 'quality'
}
```

**驗證**:
- [ ] 枚舉值與數據庫字段一致
- [ ] JSDoc 註釋完整
- [ ] TypeScript 編譯無錯誤
- [ ] Lint 檢查通過

**預估工時**: 0.5 小時

---

### 🟡 P1: 中優先級枚舉（輔助功能）

#### 3. DocumentUploadSource（文檔上傳來源）
**文件**: `core/infra/types/analytics/data.types.ts`

**現狀**: ❌ 不存在，使用字符串類型

**需求**: 
- 數據庫有 upload_source 字段
- Document Repository 有 `findByUploadSource` 方法

**工作項**:
- [ ] 在 `data.types.ts` 中定義 `DocumentUploadSource` 枚舉
- [ ] 添加 JSDoc 註釋
- [ ] 更新 `index.ts` 匯出

**代碼示例**:
```typescript
/**
 * 文檔上傳來源枚舉
 * 
 * @description 定義文檔的上傳來源
 */
export enum DocumentUploadSource {
  /** 手動上傳 */
  MANUAL = 'manual',
  /** 任務關聯 */
  TASK = 'task',
  /** 問題關聯 */
  ISSUE = 'issue',
  /** 質檢關聯 */
  QUALITY_CHECK = 'quality_check',
  /** 檢查關聯 */
  INSPECTION = 'inspection',
  /** 系統自動 */
  SYSTEM = 'system'
}
```

**驗證**:
- [ ] 枚舉值與數據庫字段一致
- [ ] JSDoc 註釋完整
- [ ] TypeScript 編譯無錯誤
- [ ] Lint 檢查通過

**預估工時**: 0.5 小時

---

#### 4. BotType（機器人類型）
**文件**: `core/infra/types/bot/bot.types.ts`

**現狀**: ❌ 不存在，使用字符串類型

**需求**: 
- 數據庫有 bot_type 字段
- Bot Repository 有 `findByBotType` 方法

**工作項**:
- [ ] 在 `bot.types.ts` 中定義 `BotType` 枚舉
- [ ] 添加 JSDoc 註釋
- [ ] 更新 `index.ts` 匯出

**代碼示例**:
```typescript
/**
 * 機器人類型枚舉
 * 
 * @description 定義機器人的類型分類
 */
export enum BotType {
  /** 自動化任務機器人 */
  AUTOMATION = 'automation',
  /** 通知機器人 */
  NOTIFICATION = 'notification',
  /** 數據同步機器人 */
  SYNC = 'sync',
  /** 報告生成機器人 */
  REPORT = 'report',
  /** 監控機器人 */
  MONITORING = 'monitoring',
  /** 自定義機器人 */
  CUSTOM = 'custom'
}
```

**驗證**:
- [ ] 枚舉值與數據庫字段一致
- [ ] JSDoc 註釋完整
- [ ] TypeScript 編譯無錯誤
- [ ] Lint 檢查通過

**預估工時**: 0.5 小時

---

### 🟢 P2: 低優先級枚舉（可選優化）

#### 5-10. 其他缺失枚舉

**待補充枚舉列表**:
- [ ] `PermissionType` (如果需要)
- [ ] `RoleType` (如果需要)
- [ ] `BranchPermissionType` (如果需要)
- [ ] `SettingType` (如果需要)
- [ ] `CommentStatus` (如果需要)
- [ ] 其他業務特定枚舉

**說明**: 這些枚舉可能已經有替代方案（如使用現有枚舉代替），需要根據實際業務需求評估是否需要補充。

**預估工時**: 1-2 小時（根據實際需求）

---

## 🔄 待統一枚舉清單

### 重複定義問題

以下枚舉在 `core/infra/types` 和 `shared/models` 兩處都有定義，需要統一到 core/types 層，models 層只負責重新導出。

---

#### 1. QualityCheckStatus（質檢狀態）

**重複位置**:
- ✅ `core/infra/types/quality/quality.types.ts` (應保留)
- ❌ `shared/models/quality/quality.models.ts` (應刪除定義，改為重新導出)

**工作項**:
- [ ] 刪除 `shared/models/quality/quality.models.ts` 中的 `QualityCheckStatus` 定義
- [ ] 在 `shared/models/quality/quality.models.ts` 添加重新導出: `export { QualityCheckStatus } from '@core';`
- [ ] 更新所有導入路徑（如果有直接從 models 層導入）
- [ ] 驗證編譯無錯誤

**預估工時**: 0.5 小時

---

#### 2. BranchPermissionLevel（分支權限級別）

**重複位置**:
- ✅ `core/infra/types/permission/permission.types.ts` (應保留)
- ❌ `shared/models/permission/permission.models.ts` (應刪除定義，改為重新導出)

**工作項**:
- [ ] 刪除 `shared/models/permission/permission.models.ts` 中的 `BranchPermissionLevel` 定義
- [ ] 在 `shared/models/permission/permission.models.ts` 添加重新導出: `export { BranchPermissionLevel } from '@core';`
- [ ] 更新所有導入路徑（如果有直接從 models 層導入）
- [ ] 驗證編譯無錯誤

**預估工時**: 0.5 小時

---

#### 3. ActivityLogResourceType（活動日誌資源類型）

**重複位置**:
- ✅ `core/infra/types/system/system.types.ts` (應保留)
- ❌ `shared/models/data/data.models.ts` (應刪除定義，改為重新導出)

**工作項**:
- [ ] 刪除 `shared/models/data/data.models.ts` 中的 `ActivityLogResourceType` 定義
- [ ] 在 `shared/models/data/data.models.ts` 添加重新導出: `export { ActivityLogResourceType } from '@core';`
- [ ] 更新所有導入路徑（如果有直接從 models 層導入）
- [ ] 驗證編譯無錯誤

**預估工時**: 0.5 小時

---

## 📋 實施步驟

### Step 1: 補充缺失枚舉（1.5 天）

#### 準備工作
- [ ] 確認數據庫表結構（參考 `docs/reference/22-完整SQL表結構定義.md`）
- [ ] 確認業務需求（與產品/業務團隊確認）
- [ ] 創建工作分支: `git checkout -b feature/types-layer-enhancement`

#### 實施順序
1. **Day 1 上午**: P0 高優先級枚舉
   - [ ] `InspectionStatus`
   - [ ] `InspectionType`
   
2. **Day 1 下午**: P1 中優先級枚舉
   - [ ] `DocumentUploadSource`
   - [ ] `BotType`
   
3. **Day 2 上午**: P2 低優先級枚舉（如需要）
   - [ ] 評估其他枚舉需求
   - [ ] 實施必要的枚舉

#### 每個枚舉的實施步驟
1. [ ] 在對應的 types 文件中添加枚舉定義
2. [ ] 確保枚舉值使用小寫字符串（如 `'pending'`）
3. [ ] 添加完整的 JSDoc 註釋（包括描述和每個值的說明）
4. [ ] 更新同目錄下的 `index.ts`，匯出新枚舉
5. [ ] 運行 `yarn lint` 檢查代碼規範
6. [ ] 運行 `yarn build` 確認編譯無錯誤
7. [ ] 提交變更: `git commit -m "feat(types): add XXX enum"`

---

### Step 2: 統一重複枚舉（0.5 天）

#### 實施順序
1. **Day 2 下午**: 統一所有重複枚舉
   - [ ] `QualityCheckStatus`
   - [ ] `BranchPermissionLevel`
   - [ ] `ActivityLogResourceType`

#### 每個重複枚舉的處理步驟
1. [ ] 確認 core/types 層的枚舉定義正確且完整
2. [ ] 刪除 shared/models 層的枚舉定義
3. [ ] 在 shared/models 層添加重新導出語句
4. [ ] 搜索整個專案，更新所有導入路徑
   ```bash
   # 搜索直接從 models 層導入枚舉的地方
   grep -r "from '@shared/models" --include="*.ts" | grep "EnumName"
   ```
5. [ ] 運行 `yarn lint` 檢查代碼規範
6. [ ] 運行 `yarn build` 確認編譯無錯誤
7. [ ] 運行 `yarn test` 確認測試通過
8. [ ] 提交變更: `git commit -m "refactor(types): unify XXX enum definition"`

---

### Step 3: 驗證與測試（0.5 天）

#### 編譯驗證
- [ ] 運行 `yarn build` - 確認無 TypeScript 編譯錯誤
- [ ] 運行 `yarn lint` - 確認無 ESLint 錯誤
- [ ] 運行 `yarn test` - 確認所有測試通過

#### 手動驗證
- [ ] 檢查所有新增枚舉的匯出
- [ ] 檢查所有重複枚舉的統一
- [ ] 檢查 JSDoc 註釋完整性
- [ ] 檢查枚舉值命名規範

#### 文檔更新
- [ ] 更新 Types 層的 README（如果存在）
- [ ] 更新相關的開發文檔
- [ ] 在本檢查清單中標記完成項

---

## ✅ 驗證檢查清單

### 枚舉定義檢查

對於每個新增/修改的枚舉，確認：

- [ ] 枚舉名稱使用 PascalCase（如 `TaskStatus`）
- [ ] 枚舉成員使用 UPPER_SNAKE_CASE（如 `IN_PROGRESS`）
- [ ] 枚舉值使用小寫字符串（如 `'in_progress'`）
- [ ] 添加了 JSDoc 註釋（枚舉和每個成員）
- [ ] 枚舉值與數據庫字段值一致
- [ ] 在 `index.ts` 中正確匯出

### 代碼質量檢查

- [ ] 無 TypeScript 編譯錯誤
- [ ] 無 ESLint 警告或錯誤
- [ ] 無 Prettier 格式問題
- [ ] 無 console.log 或調試代碼
- [ ] 無 any 類型使用

### 影響範圍檢查

- [ ] Models 層正確重新導出（如需要）
- [ ] Services 層導入路徑正確
- [ ] Repositories 層導入路徑正確
- [ ] Facades 層導入路徑正確
- [ ] Components 層導入路徑正確（如有）

### 測試檢查

- [ ] 相關單元測試仍然通過
- [ ] 相關集成測試仍然通過
- [ ] 手動測試相關功能正常

---

## 📊 進度追蹤

### 待補充枚舉進度

- [ ] InspectionStatus (0/1) - P0
- [ ] InspectionType (0/1) - P0
- [ ] DocumentUploadSource (0/1) - P1
- [ ] BotType (0/1) - P1
- [ ] 其他枚舉 (0/6) - P2

**總進度**: 0/10 (0%)

### 待統一枚舉進度

- [ ] QualityCheckStatus (0/1)
- [ ] BranchPermissionLevel (0/1)
- [ ] ActivityLogResourceType (0/1)

**總進度**: 0/3 (0%)

### 總體進度

**完成度**: 0/13 (0%)

---

## 📚 參考文檔

### 分析報告
- [Types 層基礎方法完整性分析報告](../archive/types-analysis-report.md)

### 工作計劃
- [五層架構增強總計劃](./five-layer-architecture-enhancement-plan.md)

### 參考實現
- Blueprint Types: `src/app/core/infra/types/blueprint/blueprint.types.ts`
- Task Types: `src/app/core/infra/types/task/task.types.ts`
- Issue Types: `src/app/core/infra/types/issue/issue.types.ts`

### 數據庫結構
- [完整 SQL 表結構定義](../reference/22-完整SQL表結構定義.md)

### 開發規範
- [核心開發標準](.cursor/rules/01-core-development-standards.mdc)
- [TypeScript 嚴格模式規範](.cursor/rules/02-typescript-strict-mode.mdc)

---

## 💡 實用技巧

### 快速檢查枚舉定義
```bash
# 查找所有枚舉定義
grep -r "export enum" src/app/core/infra/types/

# 查找特定枚舉的使用
grep -r "InspectionStatus" src/app/
```

### 快速查找重複定義
```bash
# 在 types 和 models 中查找同名枚舉
grep -r "export enum QualityCheckStatus" src/app/
```

### 批量更新導入路徑
```bash
# 使用 sed 替換導入路徑（謹慎使用）
find src/app -name "*.ts" -exec sed -i 's/from "@shared\/models"/from "@core"/g' {} +
```

---

## 🚨 注意事項

1. **向後兼容性**: 項目還在開發中，不需要考慮向後兼容。所有枚舉應統一在 core/types 層定義。

2. **枚舉值命名**: 
   - ✅ 使用小寫字符串（`'pending'`）
   - ❌ 不使用大寫（`'PENDING'`）
   - ❌ 不使用數字（`1`）

3. **數據庫一致性**: 枚舉值必須與數據庫字段值完全一致，否則會導致查詢錯誤。

4. **導入路徑**: 統一使用 `@core` 導入 Types 層枚舉，不要從 `@shared/models` 導入。

5. **測試覆蓋**: 雖然枚舉定義不需要單元測試，但需要確保使用枚舉的代碼測試仍然通過。

---

**最後更新**: 2025-11-21  
**負責人**: 開發團隊  
**審查週期**: 每日  
**狀態**: 📋 待開始
