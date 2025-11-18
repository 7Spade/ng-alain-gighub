# 代碼質量代理

> **相關文檔**：參考 [代碼質量](../../../.cursor/rules/code-quality.mdc)、[代碼檢查](../../../.cursor/rules/linting.mdc)

## 代理職責

代碼質量代理負責確保專案代碼符合質量標準，包括代碼規範、命名規範、文檔完整性等。

## 檢查項目

### 1. 禁止重複造輪

- ✅ 優先使用 `SHARED_IMPORTS` 中的共享組件
- ✅ 避免重複實現已有功能
- ✅ 使用 ng-zorro 和 ng-alain 提供的組件
- ✅ 檢查是否有可重用的工具函數

```typescript
// ❌ 錯誤：重複實現已有功能
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule]
})

// ✅ 正確：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared';

@Component({
  imports: [SHARED_IMPORTS]
})
```

### 2. 禁止權宜式修改

- ✅ 避免硬編碼（hard-coded）值
- ✅ 避免繞過既有機制的捷徑
- ✅ 避免臨時解決方案（workaround）
- ✅ 使用配置文件管理可變參數

```typescript
// ❌ 錯誤：硬編碼
const API_URL = 'https://api.example.com';

// ✅ 正確：使用環境配置
import { environment } from '@env/environment';
const API_URL = environment.apiUrl;
```

### 3. 命名規範一致性

- ✅ 使用 camelCase 命名變量和函數
- ✅ 使用 PascalCase 命名類和接口
- ✅ 使用 kebab-case 命名文件
- ✅ 使用有意義的名稱，避免縮寫

```typescript
// ❌ 錯誤：不一致的命名
const usr_data = getUserData();
function GetUserInfo() {}
class user_service {}

// ✅ 正確：一致的命名
const userData = getUserData();
function getUserInfo() {}
class UserService {}
```

### 4. 文檔化要求

- ✅ 所有公開 API 必須有 JSDoc 註釋
- ✅ 複雜邏輯必須有解釋性註釋
- ✅ 組件必須有使用說明
- ✅ 服務必須有接口文檔

```typescript
/**
 * 使用者服務
 * 
 * 提供使用者相關的業務邏輯處理
 * 
 * @example
 * ```typescript
 * const userService = inject(UserService);
 * const user = await userService.getUser('123');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * 獲取使用者資料
   * 
   * @param userId - 使用者 ID
   * @returns 使用者資料
   * @throws {Error} 當使用者不存在時拋出錯誤
   */
  async getUser(userId: string): Promise<User> {
    // 實現...
  }
}
```

### 5. 代碼複雜度控制

- ✅ 函數長度不超過 50 行
- ✅ 循環複雜度不超過 10
- ✅ 避免過深的嵌套（最多 3 層）
- ✅ 使用提早返回（early return）簡化邏輯

```typescript
// ❌ 錯誤：過深的嵌套
function processData(data: Data) {
  if (data) {
    if (data.valid) {
      if (data.active) {
        // 處理邏輯
      }
    }
  }
}

// ✅ 正確：提早返回
function processData(data: Data) {
  if (!data) return;
  if (!data.valid) return;
  if (!data.active) return;
  
  // 處理邏輯
}
```

### 6. 錯誤處理

- ✅ 所有非同步操作必須有錯誤處理
- ✅ 使用 try-catch 捕獲錯誤
- ✅ 提供有意義的錯誤訊息
- ✅ 記錄錯誤到日誌系統

```typescript
// ❌ 錯誤：沒有錯誤處理
async function loadData() {
  const data = await api.getData();
  return data;
}

// ✅ 正確：完整的錯誤處理
async function loadData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    console.error('Failed to load data:', error);
    throw new Error('資料載入失敗');
  }
}
```

## 自動化檢查

### Pre-commit 檢查

```bash
# ESLint 檢查
yarn lint

# Prettier 格式化
yarn format

# Stylelint 檢查
yarn stylelint
```

### Pull Request 檢查

在 Pull Request 中，代理會自動執行：

1. ESLint 規則檢查
2. 代碼複雜度分析
3. 重複代碼檢測
4. 文檔完整性檢查
5. 命名規範驗證

## 代碼審查清單

### 提交前檢查

- [ ] 代碼已通過 ESLint 檢查
- [ ] 代碼已格式化（Prettier）
- [ ] 樣式已通過 Stylelint 檢查
- [ ] 沒有 console.log 或調試代碼
- [ ] 沒有未使用的導入
- [ ] 沒有註釋掉的代碼
- [ ] 所有公開 API 有文檔
- [ ] 複雜邏輯有註釋說明

### Pull Request 前檢查

- [ ] 代碼覆蓋率達標（>80%）
- [ ] 所有測試通過
- [ ] 沒有重複代碼
- [ ] 沒有硬編碼值
- [ ] 命名規範一致
- [ ] 架構合規

## ESLint 規則

專案使用以下 ESLint 規則集：

- `@angular-eslint` - Angular 特定規則
- `@typescript-eslint` - TypeScript 規則
- `eslint-plugin-import` - 導入規則
- `eslint-plugin-unused-imports` - 未使用導入檢測

### 關鍵規則

```javascript
{
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  'import/order': 'error',
  'unused-imports/no-unused-imports': 'error'
}
```

## 參考資源

- [ESLint 配置](../../../eslint.config.mjs)
- [Prettier 配置](../../../.prettierrc.js)
- [Stylelint 配置](../../../stylelint.config.mjs)
- [代碼質量規範](../../../.cursor/rules/code-quality.mdc)
- [代碼檢查規範](../../../.cursor/rules/linting.mdc)

---

**最後更新**：2025-11-15  
**代理版本**：v1.0
