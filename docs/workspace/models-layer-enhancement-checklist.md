# Models 層增強檢查清單

> **建立日期**: 2025-11-21  
> **優先級**: P1 (中優先級 - 類型定義層)  
> **預估工時**: 3-4 天

---

## 📋 目的

補充 Models 層（`shared/models/`）的枚舉重新導出、移動擴展接口、刪除重複定義，確保類型定義完整且統一。

## 🎯 總覽

### 主要工作
1. **重新導出枚舉**: 8 個模組缺少從 `@core` 重新導出枚舉
2. **移動擴展接口**: 4 個接口從 Service 層移動到 Models 層
3. **刪除重複定義**: 3 處枚舉重複定義需要刪除
4. **補充實體類型**: 1 個缺失的實體類型

### 工作量
| 類別 | 數量 | 工時 |
|------|------|------|
| 枚舉重新導出 | 8 個 | 2 天 |
| 接口移動 | 4 個 | 1 天 |
| 刪除重複 | 3 處 | 0.5 天 |
| 驗證測試 | - | 0.5 天 |
| **總計** | **16 項** | **3-4 天** |

---

## 📝 待補充枚舉重新導出清單

### 1. Issue Models ⭐⭐⭐⭐⭐
**文件**: `shared/models/issue/issue.models.ts`

**工作項**:
```typescript
// 在文件頂部添加
export { 
  IssueStatus, 
  IssuePriority, 
  IssueSeverity, 
  IssuePhotoType, 
  IssueSyncStatus 
} from '@core';
```

**檢查清單**:
- [ ] 添加枚舉重新導出
- [ ] 更新 `index.ts`
- [ ] 更新 Service 層導入路徑
- [ ] 驗證編譯無錯誤

**預估工時**: 0.25 天

---

### 2. Bot Models ⭐⭐⭐⭐
**文件**: `shared/models/bot/bot.models.ts`

**工作項**:
```typescript
export { 
  BotStatus, 
  BotTaskStatus, 
  BotTaskPriority, 
  BotExecutionStatus 
} from '@core';
```

**預估工時**: 0.25 天

---

### 3. Communication Models ⭐⭐⭐⭐
**文件**: `shared/models/communication/communication.models.ts`

**工作項**:
```typescript
export { 
  CommentableType, 
  NotificationType, 
  NotificationStatus, 
  NotificationPriority, 
  NotificationSubscriptionType 
} from '@core';
```

**預估工時**: 0.25 天

---

### 4. Collaboration Models ⭐⭐⭐
**文件**: `shared/models/collaboration/collaboration.models.ts`

**工作項**:
```typescript
export { 
  CollaborationType, 
  CollaborationStatus, 
  InvitationStatus 
} from '@core';
```

**預估工時**: 0.25 天

---

### 5. System Models ⭐⭐⭐
**文件**: `shared/models/system/system.models.ts`

**工作項**:
```typescript
export { 
  FeatureFlagStatus, 
  FeatureFlagTargetType, 
  SettingCategory, 
  SettingValueType 
} from '@core';
```

**預估工時**: 0.25 天

---

### 6. Explore Models ⭐⭐
**文件**: `shared/models/explore/explore.models.ts`

**工作項**:
```typescript
export { SearchType } from '@core';
```

**預估工時**: 0.25 天

---

### 7. Data Models (Document相關) ⭐⭐⭐
**文件**: `shared/models/data/data.models.ts`

**工作項**:
```typescript
export { 
  DocumentType, 
  DocumentStatus, 
  DocumentVersionStatus 
} from '@core';
```

**預估工時**: 0.25 天

---

### 8. Account Models ⭐⭐
**補充實體類型**: `OrganizationMember`

**工作項**:
```typescript
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type OrganizationMemberInsert = Database['public']['Tables']['organization_members']['Insert'];
export type OrganizationMemberUpdate = Database['public']['Tables']['organization_members']['Update'];
```

**預估工時**: 0.25 天

---

## 🔄 待移動擴展接口清單

### 1. InspectionDetail ⭐⭐⭐⭐
**從**: `quality/inspection.service.ts`  
**到**: `shared/models/quality/quality.models.ts`

**工作項**:
```typescript
// quality.models.ts
export interface InspectionDetail extends Inspection {
  task?: Task;
  inspector?: Account;
  photos?: InspectionPhoto[];
}
```

**檢查清單**:
- [ ] 從 Service 移動接口定義
- [ ] Service 層更新導入: `import { InspectionDetail } from '@shared/models';`
- [ ] 驗證編譯無錯誤

**預估工時**: 0.25 天

---

### 2. DocumentDetail ⭐⭐⭐
**從**: `document/document.service.ts`  
**到**: `shared/models/data/data.models.ts`

**預估工時**: 0.25 天

---

### 3. BotDetail ⭐⭐⭐
**從**: `bot/bot.service.ts`  
**到**: `shared/models/bot/bot.models.ts`

**預估工時**: 0.25 天

---

### 4. CommentDetail ⭐⭐⭐
**從**: `collab/comment.service.ts`  
**到**: `shared/models/communication/communication.models.ts`

**預估工時**: 0.25 天

---

## ❌ 待刪除重複定義清單

### 1. QualityCheckStatus
**位置**: `shared/models/quality/quality.models.ts`

**工作項**:
- [ ] 刪除枚舉定義
- [ ] 添加重新導出: `export { QualityCheckStatus } from '@core';`
- [ ] 驗證所有導入路徑

**預估工時**: 0.25 天

---

### 2. BranchPermissionLevel
**位置**: `shared/models/permission/permission.models.ts`

**工作項**: 同上

**預估工時**: 0.25 天

---

### 3. ActivityLogResourceType
**位置**: `shared/models/data/data.models.ts`

**工作項**: 同上

**預估工時**: 0.25 天

---

## 📋 實施步驟

### Day 1: 枚舉重新導出（1-4）
- [ ] Issue Models
- [ ] Bot Models
- [ ] Communication Models
- [ ] Collaboration Models

### Day 2: 枚舉重新導出（5-8）+ 刪除重複
- [ ] System Models
- [ ] Explore Models
- [ ] Data Models
- [ ] Account Models（補充類型）
- [ ] 刪除 3 處重複定義

### Day 3: 移動擴展接口
- [ ] InspectionDetail
- [ ] DocumentDetail
- [ ] BotDetail
- [ ] CommentDetail

### Day 4: 驗證與測試
- [ ] 編譯驗證
- [ ] 測試驗證
- [ ] 導入路徑檢查
- [ ] 文檔更新

---

## ✅ 驗證檢查清單

- [ ] 所有枚舉正確重新導出
- [ ] 所有擴展接口移動到 Models 層
- [ ] 所有重複定義已刪除
- [ ] 所有導入路徑正確更新
- [ ] TypeScript 編譯無錯誤
- [ ] 所有測試通過
- [ ] Lint 檢查通過

---

## 📊 進度追蹤

### 枚舉重新導出
- [ ] Issue Models (0/1)
- [ ] Bot Models (0/1)
- [ ] Communication Models (0/1)
- [ ] Collaboration Models (0/1)
- [ ] System Models (0/1)
- [ ] Explore Models (0/1)
- [ ] Data Models (0/1)
- [ ] Account Models (0/1)

**總進度**: 0/8 (0%)

### 擴展接口移動
- [ ] InspectionDetail (0/1)
- [ ] DocumentDetail (0/1)
- [ ] BotDetail (0/1)
- [ ] CommentDetail (0/1)

**總進度**: 0/4 (0%)

### 重複定義刪除
- [ ] QualityCheckStatus (0/1)
- [ ] BranchPermissionLevel (0/1)
- [ ] ActivityLogResourceType (0/1)

**總進度**: 0/3 (0%)

### 總體進度
**完成度**: 0/15 (0%)

---

## 📚 參考文檔

- [Models 層基礎方法完整性分析報告](../archive/models-analysis-report.md)
- [五層架構增強總計劃](./five-layer-architecture-enhancement-plan.md)

---

**最後更新**: 2025-11-21  
**狀態**: 📋 待開始
