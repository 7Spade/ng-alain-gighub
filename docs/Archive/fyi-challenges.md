# 問題與挑戰記錄（Archive）

以下內容為 2025-11-14 前的歷史紀錄，保留以供查考：

---

## 2025-01-15: 權限系統設計權衡

#### 問題描述
在設計權限服務時，需要平衡以下幾個方面：
- 性能：權限檢查頻繁，需要快速響應
- 實時性：權限變更需要及時生效
- 一致性：多層緩存需要保持數據一致

#### 影響範圍
- 權限檢查性能
- 權限更新延遲
- 系統響應速度

#### 解決方案
採用三層緩存策略：
1. **ACLService 緩存**（框架級）：最快，但需要手動同步
2. **內存緩存**（應用級）：5 分鐘 TTL，平衡性能和實時性
3. **數據庫**（持久化）：權威數據源，實時更新

#### 權衡決策
- **緩存時間選擇**：5 分鐘 TTL
  - 過短（< 1 分鐘）：增加數據庫查詢，影響性能
  - 過長（> 10 分鐘）：權限更新延遲，影響實時性
  - 5 分鐘：平衡兩者，適合大多數場景

#### 經驗教訓
- 多層緩存需要明確的更新策略
- 緩存時間需要根據業務場景調整
- 需要提供手動刷新機制應對緊急情況

---

## 2025-11-14: Supabase 與 @delon/auth 整合挑戰

#### 問題描述
需要整合兩個不同的認證系統：
- Supabase Auth：使用 Session 格式
- @delon/auth：使用 Token 格式
- 需要零破壞性整合，保留所有現有代碼

#### 影響範圍
- 認證流程
- 現有業務代碼
- 系統兼容性

#### 解決方案
採用適配器模式：
- 創建 `SupabaseAuthAdapterService` 作為橋樑
- 自動轉換 Session 格式為 Token 格式
- 自動同步到 TokenService
- 保留所有現有 @delon/auth 使用方式

#### 權衡決策
- **增加抽象層**：增加一層適配器，但換來兼容性
- **零破壞性**：避免大規模重構，降低風險

#### 經驗教訓
- 適配器模式適合整合不同系統
- 格式轉換需要考慮所有字段映射
- 自動同步機制需要處理邊界情況

---

## 2025-01-15: 账户系统架构违规修复

#### 問題描述
在账户系统实施过程中，发现了两个严重的架构违规问题：
1. **架构依赖违规**：`core` 层依赖 `shared` 层
   - `core/infra/repositories/account.repository.ts` 导入 `@shared` 的 `AccountType` 和 `AccountStatus`
   - `core/infra/repositories/team-member.repository.ts` 导入 `@shared` 的 `TeamMemberRole`
   - 违反了分层架构：`routes → shared → core`，`core` 不应该依赖 `shared`

2. **路径别名使用错误**：使用深层路径别名
   - 使用 `@core/infra/repositories/team.repository` 深层路径
   - 路径别名只配置到 `@core` 和 `@shared`，不支持深层路径
   - 导致 TypeScript 编译错误

#### 影響範圍
- 架構合規性
- 代碼可維護性
- 類型檢查和編譯
- 未來擴展性

#### 解決方案

**1. 架構違規修復**：
- 將 `AccountType`、`AccountStatus`、`TeamMemberRole` 枚舉移到 `core/infra/types/account.types.ts`
- Repository 層使用相對路徑導入：`import { AccountType, AccountStatus } from '../types/account.types'`
- 在 `shared/models/account/types.ts` 重新導出，保持向後兼容

**2. 路徑別名修復**：
- 統一使用根導出：`import { TeamRepository } from '@core'`
- core 層內部使用相對路徑
- 確保所有類型和類都從根導出文件導出

#### 權衡決策
- **類型定義位置**：基礎設施類型應該在基礎設施層定義
  - 被 Repository 使用的類型 → 放在 `core/infra/types/`
  - 被 Service 使用的類型 → 可以放在 `shared/models/`
- **向後兼容**：在 shared 層重新導出 core 層的類型，避免大規模重構

#### 經驗教訓
1. **分層架構的重要性**：
   - 嚴格遵循分層架構原則，避免循環依賴
   - 基礎設施類型應該在基礎設施層定義
   - 使用工具自動檢測架構違規

2. **路徑別名使用規範**：
   - 路徑別名只配置到根導出文件，不支持深層路徑
   - 統一使用根導出，保持導入路徑一致性
   - 確保導出鏈完整：`具體文件` → `子模組 index.ts` → `根 index.ts`

3. **類型定義位置決策**：
   - 根據使用場景決定類型定義位置
   - 被基礎設施使用的類型必須在基礎設施層
   - 保持向後兼容，逐步遷移

#### 相關文檔
- [账户系统架构违规修复总结](../账户系统架构违规修复总结.md)
- [分層架構規範](../../.cursor/rules/architecture.mdc)
- [Core 模組規範](../../.cursor/rules/core-specific.mdc)

---


