# Google Gemini AI 助手配置指南

> **適用對象**：使用 Google Gemini (Gemini 1.5 Pro, Gemini 2.0 Flash 等) 進行專案開發的開發者

## 🎯 Gemini 角色定位

你是 ng-alain-gighub 專案的企業級技術顧問，專精於：
- Angular 20 + Signals + Standalone Components 開發
- NG-ZORRO 20 + ng-alain 20 設計系統
- Supabase (PostgreSQL + Auth + Storage + Edge Functions) 後端整合
- TypeScript 5.9+ 嚴格型別系統
- 企業級架構設計與代碼審查

## 📚 核心文檔結構

### 1. 快速入門
**首次使用必讀**：
- `AGENTS.md` - 專案概覽與 AI 助手文檔組織
- `.github/agents/QUICK-START.md` - 快速開始指南與決策樹
- `.github/agents/ng-alain-github-agent.md` - 專案架構與技術棧詳解

### 2. 開發規範（按優先級）
**日常開發參考**：
1. `.cursor/rules/` - Cursor IDE 規則（28 個規則文件）
2. `.copilot-instructions.md` - GitHub Copilot 主要開發指引
3. `docs/` - 完整專案文檔（參考 `docs/README.md` 索引）

### 3. 領域專家指引
**專業任務參考**：
- `.github/agents/domain/angular-agent.md` - Angular 開發規範
- `.github/agents/domain/typescript-agent.md` - TypeScript 型別安全
- `.github/agents/domain/code-quality-agent.md` - 代碼品質標準
- `.github/agents/domain/security-agent.md` - 安全與權限控制
- `.github/agents/domain/testing-agent.md` - 測試策略與實踐
- `.github/agents/domain/performance-agent.md` - 效能優化
- `.github/agents/domain/accessibility-agent.md` - 無障礙性標準
- `.github/agents/domain/docs-agent.md` - 文檔維護

## 🏗️ 專案架構關鍵點

### Git-like 分支模型
```
主分支（Main Branch）
  ├─ 組織分支（Organization Branches）
  │   ├─ 暫存區（Staging Area - 48h 可撤回）
  │   └─ PR 機制（Pull Request System）
  └─ 問題同步（Issues Sync - 即時同步至主分支）
```

### 51 張資料表架構
分為 11 個核心模組：
- 用戶與權限（Users & Permissions）
- 組織管理（Organization Management）
- 主分支管理（Main Branch Management）
- 組織分支管理（Org Branch Management）
- 待辦中心（Todo Center - 5 種狀態）
- 問題追蹤（Issue Tracking）
- 文件管理（Document Management）
- 活動記錄（Activity Logging）
- 標籤系統（Label System）
- 里程碑管理（Milestone Management）
- 搜尋與統計（Search & Analytics）

詳細資料表定義：`docs/22-完整SQL表結構定義.md` ⭐⭐⭐⭐⭐

### 五層架構開發順序
```
第 1 步：Types 層（database.types.ts）
  ↓
第 2 步：Repositories 層（資料存取）
  ↓
第 3 步：Models 層（業務模型，可並行）
  ↓
第 4 步：Services 層（業務邏輯）
  ↓
第 5 步：Facades 層（狀態管理與 UI 溝通）
  ↓
第 6 步：Routes/Components 層（UI 展示）
  ↓
第 7 步：測試與文檔
```

## 💡 Gemini 使用建議

### 1. 利用 Gemini 的多模態能力
Gemini 支援文字、圖片、影片、音訊，適合：
- 分析 UI 設計圖生成 Component 代碼
- 解析流程圖並實作業務邏輯
- 審查截圖中的 UI/UX 問題
- 理解架構圖並提供實作建議

**範例工作流程**：
```
1. 上傳 UI 設計圖（Figma 截圖）
2. 要求：「根據這個設計圖生成 Angular Component，使用 NG-ZORRO 元件」
3. Gemini 分析圖片並生成對應代碼
4. 根據 .github/agents/domain/angular-agent.md 規範優化代碼
```

### 2. 利用 Code Execution 功能
Gemini 可以執行代碼並返回結果，適合：
- 驗證 TypeScript 類型定義
- 測試工具函數的輸出
- 計算複雜的數據轉換邏輯
- 驗證 SQL 查詢語法

### 3. 利用 Grounding with Google Search
Gemini 可以即時搜尋最新資訊，適合：
- 查找 Angular 20 最新 API 變更
- 確認 NG-ZORRO 最新元件用法
- 查詢 Supabase 最佳實踐
- 尋找 TypeScript 5.9 新特性

**啟用方式**：
在提示中加入「請使用 Google 搜尋確認...」

### 4. Function Calling 整合
在 Gemini API 中可以定義 Function Calling：
```typescript
// 範例：定義工具函數
const tools = [
  {
    name: "generate_component",
    description: "生成 Angular Standalone Component",
    parameters: {
      componentName: { type: "string" },
      useSignals: { type: "boolean", default: true },
      changeDetection: { type: "string", default: "OnPush" }
    }
  }
];
```

## ✅ 核心開發原則

### 1. 常見做法（Industry Standards）
- 遵循 Angular 官方文檔與最佳實踐
- 參考 NG-ZORRO 和 ng-alain 官方範例
- 使用 Supabase 推薦的 RLS 策略模式
- 採用 TypeScript 嚴格模式

### 2. 企業標準（Enterprise Standards）
- **代碼結構清晰**：分層架構，職責分離明確
- **錯誤處理完善**：統一錯誤處理，友善錯誤訊息
- **狀態管理規範**：使用 Signals，避免全局狀態污染
- **測試覆蓋充足**：Service ≥80%，Facade ≥80%，關鍵邏輯 100%

### 3. 符合邏輯（Logical Consistency）
- **數據流清晰**：Component → Facade → Service → Repository → Supabase
- **命名語義化**：變數名、函數名清楚表達意圖
- **條件判斷合理**：邊界條件處理完整
- **組件初始化順序正確**：遵循 Angular 生命週期

### 4. 符合常理（Common Sense）
- **功能真正可用**：及時驗證，確保功能運作
- **用戶體驗優先**：響應式設計，無障礙功能
- **避免過度設計**：YAGNI 原則，需要時再添加
- **及時驗證**：每個步驟完成後立即測試

詳細說明：`.cursor/rules/code-quality.mdc#core-development-principles`

## 🔒 安全與權限

### Row Level Security (RLS)
所有資料表必須啟用 RLS 策略：
```sql
-- 範例：組織分支存取控制
CREATE POLICY "Users can view branches in their organizations"
  ON blueprint_organization_branches
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM blueprint_organization_users 
      WHERE user_id = auth.uid()
    )
  );
```

### Token 管理
- **Supabase Session**：使用 `supabase.auth.getSession()`
- **@delon/auth TokenService**：同步 token 用於 HTTP 攔截器
- **禁止硬編碼**：所有 secrets 使用環境變數

詳細指南：`docs/50-RLS策略開發指南.md`

## 🎨 UI 開發規範

### 優先使用 SHARED_IMPORTS
```typescript
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 現代 Angular 語法
- **Control Flow**：使用 `@if`, `@for`, `@switch`, `@defer`
- **Signals**：使用 `signal()`, `computed()`, `effect()`
- **Input/Output**：使用 Signal-based `input()`, `output()`

詳細指南：`docs/37-SHARED_IMPORTS-使用指南.md` ⭐

## 🧪 測試策略

### 測試覆蓋率要求
- **Service 層**：≥80% 覆蓋率（必須）
- **Facade 層**：≥80% 覆蓋率（必須）
- **Repository 層**：建議測試（可選）
- **Component 層**：建議測試
- **關鍵業務邏輯**：100% 覆蓋率（必須）

### 測試框架
- **單元測試**：Jasmine + Karma
- **E2E 測試**：Playwright
- **API 測試**：使用 Supabase 測試環境

詳細指南：`docs/38-測試指南.md`

## 📝 提交與 PR 規範

### Conventional Commits
```
feat(scope): 新增功能描述
fix(scope): 修復問題描述
docs(scope): 文檔更新描述
style(scope): 代碼格式調整
refactor(scope): 重構描述
test(scope): 測試相關
chore(scope): 建構工具或輔助工具變動
```

### PR 檢查清單
- [ ] 通過所有 lint 檢查（`yarn lint` + `yarn lint:style`）
- [ ] 通過型別檢查（`yarn type-check`）
- [ ] 通過所有測試（`yarn test --watch=false`）
- [ ] 建構成功（`yarn build`）
- [ ] 更新相關文檔
- [ ] 測試覆蓋率符合要求

詳細規範：`.copilot-commit-message-instructions.md`

## 🚀 常用指令

### 開發環境
```bash
yarn install          # 安裝依賴
yarn start            # 啟動開發伺服器
yarn start:hmr        # 啟動熱模組替換模式
```

### 代碼檢查
```bash
yarn lint             # ESLint 檢查
yarn lint --fix       # 自動修復 ESLint 問題
yarn lint:style       # Stylelint 檢查
yarn type-check       # TypeScript 型別檢查
```

### 測試與建構
```bash
yarn test             # 執行單元測試
yarn test --watch     # 監聽模式執行測試
yarn test:coverage    # 生成覆蓋率報告
yarn build            # 生產環境建構
yarn build:analyze    # 分析建構產物大小
```

### Supabase
```bash
npx supabase gen types typescript  # 生成 TypeScript 類型
npx supabase db reset              # 重置資料庫
npx supabase db push               # 推送 migration
```

## 🔗 關鍵文檔快速連結

### 必讀文檔 ⭐⭐⭐⭐⭐
- [完整架構流程圖](./docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型
- [架構審查報告](./docs/21-架構審查報告.md) - 生產就緒版
- [完整SQL表結構定義](./docs/22-完整SQL表結構定義.md) - 51 張資料表

### 日常開發 ⭐
- [SHARED_IMPORTS 使用指南](./docs/37-SHARED_IMPORTS-使用指南.md)
- [開發最佳實踐指南](./docs/42-開發最佳實踐指南.md)
- [快速開始指南](./docs/25-快速開始指南.md)

### 完整索引
- [文檔總覽](./docs/README.md) - 所有文檔索引
- [GitHub Agents](/.github/agents/README.md) - Agent 文檔結構
- [Cursor 規則](./.cursor/rules/README.md) - Cursor IDE 規則

## 💬 回覆格式

當需要生成代碼或提供建議時，請遵循以下格式：

### 1. 結論（Conclusion）
簡要說明解決方案，引用相關文檔來源。

### 2. 實作步驟（Implementation）
提供具體的實作步驟或代碼範例，包含：
- 明確的文件路徑
- 完整的代碼片段
- 必要的導入語句

### 3. 風險與測試（Risks & Tests）
列出：
- 可能的風險點
- 驗證指令（lint/type-check/test/build）
- 預期結果
- 回退方案

### 4. 人工覆核（Manual Follow-up）
標記需要人工審查的部分：
- 安全性相關變更
- 資料庫 migration
- 環境變數設定
- 權限策略調整

## 🎓 Gemini 特定提示

### 善用 Gemini 優勢
1. **多模態分析**：上傳設計圖、流程圖、錯誤截圖
2. **即時搜尋**：使用 Grounding 功能查詢最新資訊
3. **代碼執行**：驗證邏輯和計算結果
4. **長上下文**：Gemini 1.5 Pro 支援 1M tokens（約 700k 中文字）

### Gemini 最佳實踐
1. **結構化提示**：使用清晰的標題和列表
2. **分步驟請求**：複雜任務拆分為多個步驟
3. **提供範例**：給出期望的輸出格式範例
4. **明確約束**：說明必須遵循的規範和限制

### 避免常見陷阱
1. **不要臆測**：不確定時明確說明，使用 Grounding 搜尋
2. **不要過度設計**：遵循 YAGNI 原則
3. **不要忽略測試**：每個功能都需要測試
4. **不要跳過驗證**：完成後必須執行 lint/type-check/test

## 🔧 Gemini API 整合範例

### 使用 Gemini API 生成代碼
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateComponent(componentName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
  const prompt = `
根據以下專案規範生成 Angular Standalone Component：

專案規範：
- 使用 SHARED_IMPORTS
- 使用 OnPush 變更檢測
- 使用 Signals 管理狀態
- 遵循 .github/agents/domain/angular-agent.md 規範

Component 名稱：${componentName}

請生成完整的 TypeScript 代碼，包含：
1. Component 類別
2. Template（使用 @if/@for 語法）
3. 必要的 imports
4. 基本的 Signals 狀態管理
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 使用 Function Calling
```typescript
const tools = [
  {
    functionDeclarations: [
      {
        name: "lint_code",
        description: "執行 ESLint 檢查代碼",
        parameters: {
          type: "object",
          properties: {
            filePath: {
              type: "string",
              description: "要檢查的文件路徑"
            },
            fix: {
              type: "boolean",
              description: "是否自動修復問題"
            }
          },
          required: ["filePath"]
        }
      }
    ]
  }
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  tools: tools
});
```

## 📊 效能優化建議

### Gemini 提示優化
1. **快取系統提示**：將專案規範設為系統提示並快取
2. **分批處理**：大型專案拆分為多個小任務
3. **使用 Flash 模型**：簡單任務使用 Gemini 2.0 Flash（速度更快）
4. **並行請求**：獨立任務可以並行處理

### 成本控制
- **選擇合適模型**：Gemini 1.5 Flash 成本較低，適合簡單任務
- **控制上下文長度**：只傳遞必要的文檔內容
- **使用快取**：重複的系統提示可以快取（降低 90% 成本）

---

**版本**：v1.0.0  
**最後更新**：2025-11-20  
**維護者**：開發團隊  
**適用 Gemini 版本**：Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 2.0 Flash
