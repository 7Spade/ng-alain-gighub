# 企業架構十大原則（SRP 核心）

## 1. 單一職責原則（Single Responsibility Principle）

**定義**：每個模組、類別、函數只有一個改變的理由

**實踐**：
- **Component**：只處理 UI 展示與用戶交互
- **Service**：只處理業務邏輯
- **Repository**：只處理資料存取
- **Facade**：只處理狀態與 UI 溝通
- **Pipe**：只處理數據轉換
- **Directive**：只處理 DOM 行為

**禁止**：
- ❌ Component 中包含業務邏輯
- ❌ Service 同時處理 API + domain logic
- ❌ Repository 做 UI model mapping
- ❌ Facade 做 API mapping 或 UI 轉換

**檢查方法**：
```typescript
// ❌ 錯誤：Component 包含業務邏輯
class UserListComponent {
  async loadUsers() {
    const data = await fetch('/api/users');
    this.users = data.map(u => ({ ...u, fullName: `${u.first} ${u.last}` }));
  }
}

// ✅ 正確：Component 只處理 UI
class UserListComponent {
  private facade = inject(UserFacade);
  users = this.facade.users;
  
  ngOnInit() {
    this.facade.loadUsers();
  }
}
```

## 2. 封裝與界限（Clear Boundaries）

**定義**：明確隔離不同層級，避免跨層依賴

**架構分層**：
```
Routes (業務層)
  ↓ 依賴
Shared (共享層)
  ↓ 依賴
Core (基礎設施層)
  ├─ Facades
  ├─ Services
  ├─ Repositories
  └─ SupabaseService
```

**依賴規則**：
- ✅ Routes → Shared → Core
- ✅ Facades → Services → Repositories → SupabaseService
- ❌ Core ← Shared（禁止反向依賴）
- ❌ Repositories → Facades（禁止跨層依賴）

## 3. 可組合性（Composability）

**定義**：功能可自由組合，拆解後仍能運作

**實踐**：
- 小而專注的 Component
- 小而單一的 Service
- 小而純粹的 Utility
- 可組合的 Signals

**範例**：
```typescript
// ✅ 可組合的 Signals
readonly activeItems = computed(() => 
  this.items().filter(i => i.status === 'active')
);

readonly itemCount = computed(() => this.items().length);

readonly summary = computed(() => ({
  total: this.itemCount(),
  active: this.activeItems().length
}));
```

## 4. 明確的依賴方向（Dependency Direction）

**定義**：依賴方向從上到下，避免循環依賴

**依賴方向**：
```
Component → Facade → Service → Repository → SupabaseService → Supabase
  ↓          ↓        ↓          ↓
Models   ← Types  ← Types    ← Types
```

**檢查方法**：
- 使用 `madge` 檢查循環依賴
- 使用 ESLint 規則檢查導入路徑
- Code Review 時檢查依賴關係

## 5. 低耦合、高內聚（Low Coupling & High Cohesion）

**定義**：相關功能放在一起，不同領域弱依賴

**實踐**：
- Feature 模組內部高內聚
- Feature 模組之間低耦合
- 通過 Facade 暴露接口
- 通過 Models 傳遞數據

## 6. 可測試性（Testability）

**定義**：架構必須為測試設計

**實踐**：
- 小而乾淨的函數（易於測試）
- 低耦合（易於 mock）
- SRP（每個測試只驗證一件事）
- 分層架構（UI 與邏輯分離）

**測試標準**：
- Service 層：≥80% 覆蓋率
- Repository 層：建議測試（可選）
- Facade 層：≥80% 覆蓋率
- Component 層：建議測試

## 7. 可維護性（Maintainability）

**定義**：今天能維護，三年後也能維護

**實踐**：
- 嚴格型別（TypeScript strict mode）
- 嚴格 lint（ESLint 規則）
- 嚴格架構規範（分層架構）
- 可閱讀的檔案結構
- 低複雜度的代碼

## 8. 可替換性（Replaceability）

**定義**：能夠替換任何基礎設施層

**實踐**：
- Repository 模式（封裝資料存取）
- Service 模式（封裝業務邏輯）
- Facade 模式（統一對外接口）
- 依賴注入（inject() 函數）

**可替換的部分**：
- 資料庫（Supabase → Cognito）
- UI 庫（NG-ZORRO → Material）
- 狀態管理（Signals → NgRx）

## 9. 漸進式演進（Incremental Evolution）

**定義**：架構可部分重構，無需一次性重建

**實踐**：
- NgModule → Standalone（漸進遷移）
- RxJS → Signals（逐步引入）
- CSR → SSR（漸進增強）

## 10. 一致性（Consistency）

**定義**：一致性比「聰明」更重要

**實踐**：
- 一致的程式碼風格（Prettier）
- 一致的 API 格式（RESTful）
- 一致的命名（語義化）
- 一致的 Component 架構
- 一致的錯誤處理
- 一致的 UX 行為

---

**相關資源**：
- [開發最佳實踐指南](../../../docs/42-開發最佳實踐指南.md) ⭐
- [架構審查報告](../../../docs/21-架構審查報告.md) ⭐⭐⭐⭐⭐
