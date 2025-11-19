/**
 * Core 模組統一導出
 *
 * Core 模組是應用程式的核心基礎設施層，提供：
 *
 * ## 📦 模組結構
 *
 * ### 業務邏輯層
 * - **facades**: 業務邏輯封裝層（Facade 模式，統一 API 給 routes 層使用）
 * - **guards**: 路由守衛（認證、授權、未保存變更檢查）
 * - **permissions**: 權限管理服務（角色、權限驗證）
 *
 * ### 基礎設施層
 * - **infra**: 基礎設施模組
 *   - **repositories**: 數據訪問層（Repository 模式，51 張表的數據訪問）
 *   - **types**: 類型定義（按業務模組組織，包含 Database 類型和業務類型）
 *   - **errors**: 錯誤處理（錯誤類型定義和 Supabase 錯誤轉換器）
 *   - **utils**: 工具函數（數據轉換工具、UUID 驗證等）
 *
 * ### 應用服務層
 * - **i18n**: 國際化服務（多語言支持、資源統一管理）
 * - **net**: 網路請求攔截器（認證 token、錯誤處理、重試邏輯）
 * - **supabase**: Supabase 客戶端服務（數據庫連接、認證適配器）
 * - **startup**: 應用啟動服務（初始化、認證恢復、資源預加載）
 * - **services**: 核心業務服務（分支上下文等）
 * - **menu-context**: 菜單上下文服務
 *
 * ### 其他
 * - **start-page.guard**: 啟動頁路由守衛
 *
 * ## 🎯 使用方式
 *
 * ```typescript
 * // 從 @core 導入需要的服務、類型、Repository 等
 * import { AccountFacade, Database, AccountRepository, AuthGuard } from '@core';
 *
 * // 使用 Facade（推薦）
 * const accountFacade = inject(AccountFacade);
 * accountFacade.accounts$.subscribe(accounts => {
 *   console.log('Accounts:', accounts);
 * });
 *
 * // 使用 Repository（基礎設施層）
 * const accountRepo = inject(AccountRepository);
 * accountRepo.findAll().subscribe(accounts => {
 *   console.log('Accounts:', accounts);
 * });
 * ```
 *
 * ## ⚠️ 重要規範
 *
 * - **依賴關係**：可被 `routes` 和 `shared` 依賴，禁止依賴 `routes` 或 `shared`
 * - **分層架構**：嚴格遵循分層架構，確保依賴方向正確
 * - **類型安全**：所有類型定義在 `infra/types` 中，按業務模組組織
 * - **數據訪問**：統一通過 Repository 模式訪問數據，禁止直接使用 Supabase 客戶端
 *
 * @module core
 */

// ============================================================================
// 業務邏輯層
// ============================================================================

/**
 * Facades - 業務邏輯封裝層
 * 提供統一的 API 給 routes 層使用，封裝複雜的業務邏輯
 */
export * from './facades';

/**
 * Guards - 路由守衛
 * 保護路由、驗證認證和權限、檢查未保存變更
 */
export * from './guards';

/**
 * Permissions - 權限管理服務
 * 角色管理、權限驗證、權限矩陣
 */
export * from './permissions';

// ============================================================================
// 基礎設施層
// ============================================================================

/**
 * Infrastructure - 基礎設施模組
 * 包含：repositories（數據訪問）、types（類型定義）、errors（錯誤處理）、utils（工具函數）
 */
export * from './infra';

// ============================================================================
// 應用服務層
// ============================================================================

/**
 * Internationalization - 國際化服務
 * 多語言支持、資源統一管理、動態切換
 */
export * from './i18n';

/**
 * Network - 網路請求攔截器
 * 統一處理請求、認證 token、錯誤處理、重試邏輯
 */
export * from './net';

/**
 * Supabase - Supabase 客戶端服務
 * 數據庫連接、認證適配器、Session 管理
 */
export * from './supabase';

/**
 * Startup - 應用啟動服務
 * 初始化、認證恢復、資源預加載
 */
export * from './startup';

/**
 * Services - 核心業務服務
 * 分支上下文等核心業務服務
 */
export * from './services';

/**
 * Menu Context - 菜單上下文服務
 * 菜單狀態管理、上下文切換
 */
export * from './menu-context';

// ============================================================================
// 其他
// ============================================================================

/**
 * Start Page Guard - 啟動頁路由守衛
 * 動態加載啟動頁
 */
export * from './start-page.guard';
