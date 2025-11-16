/**
 * 共享服务统一导出
 *
 * 按业务模块分类的服务：
 * - account: 账户服务
 * - repository: Repository 模式服务（规划中）
 * - storage: Storage 服务（规划中）
 *
 * @module shared/services
 */

// 按模块导出
export * from './account';
export * from './auth';
export * from './collaboration';
export * from './blueprint';
export * from './task';
export * from './todo';
export * from './permission';

// Supabase adapter
export * from './supabase-adapter.service';

// Quality & Analytics services
export * from './quality-check.service';
export * from './analytics.service';
