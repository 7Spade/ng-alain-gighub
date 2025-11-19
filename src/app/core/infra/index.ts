/**
 * 基礎設施模組統一導出
 *
 * 本模組提供應用程式的核心基礎設施，包括：
 * - repositories: 數據訪問層（Repository 模式，51 張表的數據訪問）
 * - types: 類型定義（按業務模組組織，包含 Database 類型和業務類型）
 * - errors: 錯誤處理（錯誤類型定義和 Supabase 錯誤轉換器）
 * - utils: 工具函數（數據轉換工具、UUID 驗證等）
 *
 * @module core/infra
 */

// 數據訪問層
export * from './repositories';

// 類型定義（按業務模組組織）
export * from './types';

// 錯誤處理
export * from './errors';

// 工具函數
export * from './utils';
