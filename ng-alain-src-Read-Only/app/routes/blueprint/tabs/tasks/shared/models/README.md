# Shared Task Models

此目錄提供任務領域模型的統一匯出入口，所有程式碼應透過 `@models` 別名取得型別或列舉，避免直接引用個別 feature 目錄。

- `index.ts`：集中 re-export 各任務維度模型（Identity、Time、Dependency...）。新增模型時務必同步更新此檔案並與 Supabase schema 對齊。
- 匯入慣例：`import type { Task, TaskProgress } from '@models';`
- 若需要拆分子模組，可於本目錄新增檔案並由 `index.ts` 導出；禁止從 feature 目錄直接 re-export。
- 發現模型重複或欄位分歧時，先比對資料庫 schema，再調整此處定義與對應文件。
- 避免在模型內使用 `any`，必要時以 `unknown` + 型別守衛確保類型安全。

