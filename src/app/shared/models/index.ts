/**
 * 數據模型統一導出
 *
 * 按業務模組分類：
 * - account: 帳戶與身份系統（4 張表）
 * - collaboration: 組織協作系統（3 張表）
 * - permission: 權限系統（5 張表）
 * - blueprint: 藍圖/專案系統（5 張表）
 * - task: 任務執行系統（9 張表）
 * - quality: 品質驗收系統（4 張表）
 * - issue: 問題追蹤系統（4 張表）
 * - communication: 協作溝通系統（6 張表）
 * - data: 資料分析系統（6 張表）
 * - bot: 機器人系統（3 張表）
 * - system: 系統管理（2 張表）
 * - explore: 探索系統
 *
 * @module shared/models
 */

// 按模組導出（按依賴順序）
export * from './account';
export * from './blueprint';
export * from './bot';
export * from './collaboration';
export * from './communication';
export * from './data';
export * from './explore';
export * from './issue';
export * from './permission';
export * from './quality';
export * from './system';
export * from './task';

// 特定類型重新導出（保持向後兼容）
export type { AccountWithAvatar, BlueprintWithDescription } from './explore';

