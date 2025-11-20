# 已棄用的大型索引目錄

**移動日期**：2025-11-20  
**原因**：文件過大且內容可從官方文檔獲取

> ⚠️ **注意**：這些索引文件已被移至 Archive，不再主動維護。請使用官方文檔或專案精簡版索引。

---

## 📋 包含的內容

### DELON-Index（原 docs/DELON-Index/）
- **大小**：~204KB
- **內容**：10 個 @delon 包的完整 API 索引
- **問題**：文件過大，影響 AI Agent 索引性能

### NG-ZORRO-Index（原 docs/NG-ZORRO-Index/）
- **大小**：~344KB
- **內容**：NG-ZORRO 組件的完整 API 索引
- **問題**：文件過大，影響 AI Agent 索引性能

---

## 為什麼移動這些索引？

### 1. 檔案過大
- 總計超過 500KB 的 API 文檔
- 降低 AI Agent 的索引和查詢性能
- 增加專案大小和克隆時間

### 2. 官方文檔更準確
- 官方文檔總是最新的，避免過時信息
- 官方文檔有完整的範例和互動示範
- 官方文檔有更好的搜尋和導航功能

### 3. 專案已有精簡版
- [docs/38-ng-zorro-antd-組件清單與CLI指令.md](../../38-ng-zorro-antd-組件清單與CLI指令.md)：NG-ZORRO 常用組件
- [docs/39-DELON-Index-索引.md](../../39-DELON-Index-索引.md)：DELON 套件快速參考
- 這些精簡版包含最常用的內容，足夠日常開發使用

---

## 🔍 如何查找組件文檔？

### NG-ZORRO Components
1. **官方文檔**（推薦）：https://ng.ant.design/
2. **專案快速參考**：[docs/38-ng-zorro-antd-組件清單與CLI指令.md](../../38-ng-zorro-antd-組件清單與CLI指令.md)
3. **CLI 生成**：`ng g ng-alain:module my-module`

### DELON Packages
1. **官方文檔**（推薦）：https://ng-alain.com/
2. **專案快速參考**：[docs/39-DELON-Index-索引.md](../../39-DELON-Index-索引.md)
3. **GitHub**：https://github.com/ng-alain/delon

---

## 🤖 AI Agent 使用建議

### GitHub Copilot / Cursor AI
- ✅ 使用 `@web` 或 Context7 查詢官方文檔
- ✅ 參考 docs/38-* 和 docs/39-* 的精簡版索引
- ❌ 避免索引大型 API 文檔（會降低性能）

### 範例 Prompt
```
@web ng-zorro button component how to use
@C7 search for "nz-button" in ng-zorro docs
請參考 docs/38-ng-zorro-antd-組件清單與CLI指令.md 查找常用組件
```

---

## 📚 DELON 包列表

### 生產依賴（dependencies）
1. **@delon/abc** - 業務組件庫（ST 表格、SV 鍵值描述、SE 表單佈局等）
2. **@delon/acl** - 訪問控制列表（權限控制）
3. **@delon/auth** - 認證服務（登錄、登出、Token 管理）
4. **@delon/cache** - 緩存服務（本地存儲、內存緩存）
5. **@delon/chart** - 圖表組件（基於 G2）
6. **@delon/form** - 動態表單（JSON Schema 驅動）
7. **@delon/mock** - Mock 數據服務（開發環境模擬 API）
8. **@delon/theme** - 主題系統（佈局、樣式、國際化）
9. **@delon/util** - 工具函數庫（常用工具函數）

### 開發依賴（devDependencies）
10. **@delon/testing** - 測試工具（測試輔助函數）

**總計**：10 個包

---

## 📄 保留原始檔案

這些索引文件仍然保留在此目錄中，供離線查閱：
- `01-@delon-abc.md` 到 `10-@delon-testing.md`
- `NG-ZORRO-Index/` 子目錄

但**強烈建議優先使用官方文檔**，因為它們總是最新且最準確的。

---

**維護者**：開發團隊  
**如有疑問**：請參考 [docs/README.md](../../README.md) 或 [AGENTS.md](../../../AGENTS.md)

