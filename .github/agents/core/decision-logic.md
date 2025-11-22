# 決策邏輯指南

## 決策 1：是否需要創建業務模組類型文件？

```
檢查 database.types.ts
  ├─ 包含所需類型？
  │   └─ 是 → 不需要創建 {feature}.types.ts
  └─ 不包含？
      └─ 檢查業務需求
          ├─ 需要額外類型定義？
          │   └─ 是 → 創建 {feature}.types.ts
          └─ 不需要？
              └─ 否 → 不需要創建
```

## 決策 2：是否需要整合活動記錄？

```
檢查業務需求
  ├─ 需要記錄用戶操作？
  │   └─ 是 → 整合 BlueprintActivityService
  ├─ 需要審計追蹤？
  │   └─ 是 → 整合 BlueprintActivityService
  └─ 需要活動時間軸？
      └─ 是 → 整合 BlueprintActivityService
```

## 決策 3：是否需要特定查詢方法？

```
檢查查詢需求
  ├─ BaseRepository.findAll() 足夠？
  │   └─ 是 → 不需要添加
  └─ 需要複雜查詢？（多條件、關聯查詢）
      └─ 是 → 檢查使用頻率
          ├─ 多處使用？
          │   └─ 是 → 在 Repository 層實現
          └─ 單處使用？
              └─ 是 → 在 Service 層實現
```

## 決策 4：是否需要多個 Services？

```
檢查業務複雜度
  ├─ 單一業務領域？
  │   └─ 是 → 單一 Service
  └─ 多個業務領域？
      └─ 是 → 檢查職責分離
          ├─ 職責清晰分離？
          │   └─ 是 → 分別創建 Service
          └─ 職責重疊？
              └─ 否 → 重新審查設計
```

## 決策 5：是否需要新增 Facade？

```
檢查 UI 需求
  ├─ 單一 Service 足夠？
  │   └─ 是 → 不需要 Facade
  └─ 需要協調多個 Services？
      └─ 是 → 創建 Facade
          └─ Facade 統一管理狀態與錯誤處理
```

## 決策 6：是否需要創建新 Repository？

```
檢查資料表需求
  ├─ 現有 Repository 可用？
  │   └─ 是 → 重用現有 Repository
  └─ 需要訪問新資料表？
      └─ 是 → 創建新 Repository
          └─ 繼承 BaseRepository
```

---

**相關資源**：
- [標準思考程序](./startup-procedure.md) ⭐⭐⭐⭐⭐
- [開發順序指南](../guides/development-sequence-guide.md) ⭐⭐⭐⭐⭐
