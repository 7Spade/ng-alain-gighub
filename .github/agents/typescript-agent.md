# TypeScript 開發代理

> **相關文檔**：參考 [TypeScript 規範](../../.cursor/rules/typescript.mdc)、[代碼質量](../../.cursor/rules/code-quality.mdc)

## 代理職責

TypeScript 開發代理負責確保專案中的 TypeScript 代碼符合類型安全和最佳實踐標準。

## 檢查項目

### 1. 類型安全

- ✅ 所有 TypeScript 文件使用嚴格模式
- ✅ 禁止使用 `any` 類型（除非有明確註釋說明原因）
- ✅ 函數參數和返回值都有明確的類型標註
- ✅ 避免使用類型斷言（`as`），優先使用類型守衛
- ✅ 使用 `readonly` 修飾符保護不可變數據

### 2. 類型定義一致性

- ✅ TypeScript 模型與數據庫結構保持一致
- ✅ 類型定義與實際使用一致
- ✅ 使用泛型約束確保類型安全
- ✅ 導入語句清理，移除未使用的導入

### 3. 編譯檢查

- ✅ 執行 `yarn type-check` 無錯誤
- ✅ 啟用所有 strict 編譯選項
- ✅ 無隱含的 `any` 類型錯誤
- ✅ 無未使用的變量或參數（除非有 `_` 前綴）

## 自動化檢查

### Pre-commit 檢查

```bash
# 類型檢查
yarn type-check

# ESLint 檢查
yarn lint
```

### Pull Request 檢查

在 Pull Request 中，代理會自動執行：

1. TypeScript 編譯檢查
2. 類型安全驗證
3. 未使用導入檢測
4. 類型定義與數據庫一致性檢查

## 常見問題

### 如何處理第三方庫的類型問題？

```typescript
// ❌ 錯誤：直接使用 any
const data: any = externalLib.getData();

// ✅ 正確：定義明確的類型
interface ExternalData {
  id: string;
  name: string;
}
const data: ExternalData = externalLib.getData();
```

### 如何處理複雜的聯合類型？

```typescript
// ❌ 錯誤：使用類型斷言
const value = data as SpecificType;

// ✅ 正確：使用類型守衛
function isSpecificType(data: unknown): data is SpecificType {
  return typeof data === 'object' && data !== null && 'property' in data;
}

if (isSpecificType(data)) {
  // 在這裡可以安全地使用 data
}
```

## 配置文件

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 參考資源

- [TypeScript 官方文檔](https://www.typescriptlang.org/docs/)
- [TypeScript 深入理解](https://basarat.gitbook.io/typescript/)
- [專案 TypeScript 規範](../../.cursor/rules/typescript.mdc)
- [資料表結構定義](../../docs/30-0-完整SQL表結構定義.md)

---

**最後更新**：2025-11-15  
**代理版本**：v1.0
