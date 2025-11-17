/**
 * 共享服务统一导出
 *
 * 按业务模块分类的服务：
 * - account: 账户服务
 * - auth: 認證服務
 * - collaboration: 協作服務
 * - blueprint: 藍圖服務 (包含 PullRequestService)
 * - task: 任務服務
 * - task-template: 任務範本服務
 * - todo: 待辦事項服務
 * - permission: 權限服務
 *
 * @module shared/services
 */

// 按模块导出
export * from './account';
export * from './auth';
export * from './collaboration';
export * from './blueprint';
export * from './task';
export * from './task-template';
export * from './todo';
export * from './permission';

// Supabase adapter
export * from './supabase-adapter.service';

// Quality & Analytics services
export * from './quality-check.service';
export * from './analytics.service';
