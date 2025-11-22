# 錯誤處理流程

## 通用錯誤處理流程

```
開始執行步驟
  ↓
執行開發步驟
  ↓
檢查完成標準
  ├─ 全部通過？
  │   └─ 是 → 檢查企業標準
  │       ├─ 全部通過？
  │       │   └─ 是 → 進入下一步 ✅
  │       └─ 部分失敗？
  │           └─ 執行修復 → 重新檢查
  └─ 部分失敗？
      └─ 執行錯誤處理流程
          ├─ 1. 識別錯誤類型
          ├─ 2. 讀取錯誤處理原則（Redis MCP）
          ├─ 3. 選擇修復策略（Sequential Thinking）
          ├─ 4. 執行修復（Filesystem MCP）
          ├─ 5. 重新驗證
          ├─ 修復成功？
          │   └─ 是 → 重新檢查完成標準
          └─ 修復失敗？
              └─ 記錄問題（在 PR 描述中）→ 尋求協助
```

## 常見錯誤處理（使用 Redis + Sequential Thinking）

### TypeScript 編譯錯誤

```bash
# 1. 讀取 TypeScript 規範（Redis）
GET standards:typescript

# 2. 識別錯誤類型（Sequential Thinking）
步驟 1：檢查錯誤訊息
步驟 2：定位問題文件和行號
步驟 3：檢查類型定義
步驟 4：檢查導入路徑
步驟 5：修復問題
步驟 6：重新驗證

# 3. 執行修復（Filesystem MCP）
# 4. 記錄解決方案（在 PR 描述中，不使用 store_memory）
```

### ESLint 錯誤

```bash
# 1. 讀取 ESLint 規範（Redis）
GET standards:eslint

# 2. 嘗試自動修復
yarn lint --fix

# 3. 手動修復（如需要）
步驟 1：檢查錯誤規則名稱
步驟 2：查閱規則文檔
步驟 3：修復問題
步驟 4：重新驗證

# 4. 記錄解決方案（在 PR 描述中，不使用 store_memory）
```

### 構建錯誤

```bash
# 1. 識別錯誤類型
步驟 1：檢查構建日誌
步驟 2：定位失敗的步驟
步驟 3：檢查依賴完整性

# 2. 常見構建問題
- 缺少依賴：yarn install
- 類型錯誤：yarn type-check
- 循環依賴：使用 madge 檢查
- 配置錯誤：檢查 angular.json

# 3. 執行修復並重新構建
yarn build
```

### 運行時錯誤

```bash
# 1. 檢查瀏覽器控制台
步驟 1：查看錯誤訊息
步驟 2：檢查網絡請求
步驟 3：檢查狀態變化

# 2. 常見運行時問題
- Signal 更新錯誤：檢查 set() vs update()
- API 錯誤：檢查 Supabase RLS 策略
- 路由錯誤：檢查 routes 配置
- 權限錯誤：檢查 Auth Guard

# 3. 使用 Angular DevTools 調試
```

### 測試失敗

```bash
# 1. 運行失敗的測試
yarn test {test-file}.spec.ts

# 2. 檢查測試日誌
步驟 1：識別失敗的測試案例
步驟 2：檢查預期 vs 實際結果
步驟 3：檢查 mock 設置

# 3. 修復測試
- 更新測試案例
- 修復業務邏輯
- 更新 mock 數據

# 4. 重新運行測試
yarn test
```

## 錯誤處理最佳實踐

### 1. 預防性錯誤處理
- 使用 TypeScript strict mode
- 啟用所有 ESLint 規則
- 編寫單元測試
- 進行 Code Review

### 2. 漸進式調試
- 從最簡單的檢查開始
- 逐步縮小問題範圍
- 使用 console.log / debugger
- 記錄調試過程

### 3. 文檔化解決方案
- 記錄常見問題與解決方案（在 PR 描述或文檔中，不使用 store_memory）
- 更新錯誤處理指南
- 分享給團隊成員

---

**相關資源**：
- [開發最佳實踐指南](../../../docs/42-開發最佳實踐指南.md) ⭐
- [MCP 工具工作流程](../guides/mcp-tools-workflow-guide.md) ⭐⭐⭐⭐⭐
