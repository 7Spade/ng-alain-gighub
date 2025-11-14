# 開發脈絡記錄 (FYI)

## 2025-11-14: Supabase 與 @delon/auth 整合

### 背景
專案需要整合 Supabase 作為後端服務，同時保留現有的 `@delon/auth` 認證系統，確保零破壞性整合。

### 設計決策
- **適配器模式**：創建 `SupabaseAuthAdapterService` 作為 Supabase Auth 與 `@delon/auth` 之間的橋樑
- **Session 同步**：自動將 Supabase Session 轉換為 `@delon/auth` Token 格式並同步到 `TokenService`
- **零破壞性**：保留所有現有的 `@delon/auth` 使用方式，無需修改業務代碼

### 實施內容

#### 新創建的檔案
1. **src/app/core/supabase/supabase.service.ts**
   - Supabase 客戶端服務
   - 初始化 SupabaseClient 單例
   - 配置 Session 持久化和自動刷新

2. **src/app/core/supabase/supabase-auth-adapter.service.ts**
   - Supabase Auth 適配器服務
   - 實現 `signIn()`, `signUp()`, `signOut()`, `refreshSession()` 方法
   - Session 格式轉換（Supabase Session → @delon/auth Token 格式）
   - 自動同步 Session 到 TokenService
   - 監聽 Auth 狀態變化並自動同步

3. **src/app/core/supabase/index.ts**
   - 導出 Supabase 相關服務

#### 修改的檔案
1. **src/app/core/index.ts**
   - 添加 `export * from './supabase'` 導出

2. **src/app/core/startup/startup.service.ts**
   - 在 `load()` 方法中添加 `restoreSession()` 調用
   - 應用啟動時自動恢復 Supabase Session

3. **src/app/routes/passport/login/login.component.ts**
   - 修改 `submit()` 方法使用 `SupabaseAuthAdapterService.signIn()`
   - 保持現有的響應處理邏輯（tokenService.set() 和 startupSrv.load()）
   - 目前僅支持帳號密碼登入（type === 0），手機驗證碼登入保持原有邏輯

4. **src/app/core/net/refresh-token.ts**
   - 修改 `refreshTokenRequest()` 使用 `SupabaseAuthAdapterService.refreshSession()`
   - 保持相同的返回格式，確保 `tryRefreshToken()` 邏輯不變

5. **src/environments/environment.ts** 和 **environment.prod.ts**
   - 已添加 Supabase 配置（url, anonKey, storage）

### 整合流程

```
用戶登入
  ↓
SupabaseAuthAdapter.signIn()
  ↓
Supabase Auth API
  ↓
獲得 Supabase Session
  ↓
適配器轉換為 @delon/auth 格式
  ↓
TokenService.set() ← 現有代碼繼續工作
  ↓
HTTP 攔截器自動添加 Authorization: Bearer {token}
```

### 關鍵特性
- **自動 Session 恢復**：應用啟動時自動檢查並恢復 Supabase Session
- **自動狀態同步**：監聽 Supabase Auth 狀態變化，自動同步到 TokenService
- **Token 自動刷新**：使用 Supabase 的 `refreshSession()` 方法
- **類型安全**：完整的 TypeScript 類型支持

### 技術細節
- 使用 Angular 20 的 `inject()` 進行依賴注入
- 使用 RxJS Observable 處理異步操作
- Session 格式轉換包含：`access_token` → `token`, `refresh_token`, `expired` 計算
- 適配器在構造函數中自動初始化 Auth 監聽器（僅在瀏覽器環境）

### 後續工作
- [ ] 創建 Repository 基礎類（shared/repositories/base.repository.ts）
- [ ] 實作資料表相關的 Repository
- [ ] 整合 Supabase Realtime 訂閱功能
- [ ] 整合 Supabase Storage 功能

### 參考文檔
- [Supabase Auth 文檔](https://supabase.com/docs/guides/auth)
- [@delon/auth 文檔](https://ng-alain.com/auth/getting-started)
- [專案架構文檔](./13-1.md)
- [API 接口文檔](./33-API-接口詳細文檔.md)

---

## 2025-11-14: 註冊功能改為 Supabase Auth，移除手機號登入

### 背景
將註冊功能改為使用 Supabase Auth，並移除登入頁面的手機號登入功能，統一使用 Email/Password 認證方式。

### 設計決策
- **統一認證方式**：僅使用 Email/Password 認證，移除手機號登入
- **簡化 UI**：移除登入頁面的 Tab 切換，簡化表單結構
- **保持一致性**：註冊和登入都使用 Supabase Auth

### 實施內容

#### 修改的檔案

1. **src/app/routes/passport/register/register.component.ts**
   - 移除表單中的 `mobilePrefix`, `mobile`, `captcha` 欄位
   - 移除 `getCaptcha()` 方法和相關計數器邏輯
   - 修改 `submit()` 方法使用 `SupabaseAuthAdapterService.signUp()`
   - 移除未使用的 `_HttpClient` 和 `ALLOW_ANONYMOUS` 導入

2. **src/app/routes/passport/register/register.component.html**
   - 移除手機號輸入欄位（包含 mobilePrefix select）
   - 移除驗證碼輸入欄位和獲取驗證碼按鈕

3. **src/app/routes/passport/login/login.component.ts**
   - 移除 `type` 切換邏輯
   - 移除 `mobile`, `captcha` 表單欄位
   - 移除 `getCaptcha()` 方法和 `switch()` 方法
   - 移除 `count` 和 `interval$` 變數
   - 簡化 `submit()` 方法，只處理 Email/Password 登入
   - 將 `userName` 欄位驗證改為 `Validators.email`
   - 移除未使用的 `HttpContext`, `ALLOW_ANONYMOUS`, `_HttpClient`, `NzTabsModule` 導入

4. **src/app/routes/passport/login/login.component.html**
   - 移除 `nz-tabs` 組件和 Tab 切換
   - 移除手機號登入 Tab 的整個表單區塊
   - 簡化為單一 Email/Password 登入表單
   - 更新表單驗證錯誤提示

### 變更摘要

#### 註冊組件
- **移除欄位**：手機號前綴、手機號、驗證碼
- **保留欄位**：郵箱、密碼、確認密碼
- **認證方式**：使用 Supabase Auth `signUp()` 方法

#### 登入組件
- **移除功能**：手機號登入 Tab、驗證碼獲取
- **簡化表單**：單一 Email/Password 登入表單
- **驗證規則**：Email 格式驗證、密碼最小長度 6 字符

### 技術細節
- 使用 `String()` 轉換確保類型安全
- 保持現有的錯誤處理和用戶體驗
- 註冊成功後導航到註冊結果頁面（支援 Email 驗證流程）

### 驗證結果
- ✅ 編譯成功：`yarn build` 通過
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ 類型安全：完整的 TypeScript 類型支持

---

## 2025-11-14: 移除社交登入功能（其他登入方式、Auth0）

### 背景
移除登入頁面的社交登入功能，包括"其他登入方式"區塊和 Auth0、GitHub、Weibo 等第三方登入選項，統一使用 Supabase Auth 的 Email/Password 認證。

### 設計決策
- **簡化認證流程**：僅保留 Supabase Auth 的 Email/Password 認證
- **移除社交登入**：移除所有第三方登入選項（Auth0、GitHub、Weibo）
- **保留註冊連結**：保留註冊頁面連結，方便新用戶註冊

### 實施內容

#### 修改的檔案

1. **src/app/routes/passport/login/login.component.ts**
   - 移除 `open()` 方法（處理社交登入）
   - 移除 `SocialService` 注入和相關導入
   - 移除 `SocialOpenType` 導入
   - 移除 `SettingsService` 注入（僅用於社交登入）
   - 移除 `environment` 導入（僅用於社交登入回調 URL）
   - 移除 `NzToolTipModule` 和 `NzIconModule` 導入（僅用於社交登入圖標）
   - 移除 `providers: [SocialService]` 配置

2. **src/app/routes/passport/login/login.component.html**
   - 移除 `<div class="other">` 區塊（包含"其他登入方式"文字）
   - 移除所有社交登入圖標（Auth0、GitHub、Weibo）
   - 保留註冊連結，移至表單底部並居中顯示

### 變更摘要

#### 移除的功能
- **社交登入選項**：Auth0、GitHub、Weibo
- **"其他登入方式"區塊**：整個社交登入 UI 區塊
- **相關服務**：`SocialService`、`SettingsService`（社交登入相關部分）

#### 保留的功能
- **註冊連結**：移至表單底部，方便新用戶註冊
- **Email/Password 登入**：核心認證功能保持不變

### 技術細節
- 移除未使用的導入和服務，減少代碼複雜度
- 保持組件結構清晰，僅保留必要的功能
- 註冊連結使用 `RouterLink` 導航，保持路由一致性

### 驗證結果
- ✅ 編譯成功：`yarn build` 通過
- ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
- ✅ UI 簡化：登入頁面更加簡潔，專注於核心認證功能

### 備註
- `callback.component.ts` 組件仍保留在路由中，但由於已移除社交登入功能，該路由將不會被使用
- 如需完全清理，可考慮在後續版本中移除 `callback` 路由和組件

