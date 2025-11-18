/**
 * 共享服务统一导出
 *
 * 按业务模块分类的服务：
 * - account: 账户服务
 * - auth: 认证服务
 * - collaboration: 协作服务（含 comment, notification）
 * - blueprint: 蓝图服务
 * - task: 任务服务（含 assignment, list, daily report）
 * - quality: 品质验收服务（含 quality check, inspection）
 * - todo: 待办中心服务
 * - permission: 权限服务
 * - issue: 问题追踪服务
 * - document: 文件管理服务
 * - bot: 机器人服务
 * - system: 系统管理服务（含 setting, feature flag）
 *
 * @module shared/services
 */

// 按模块导出
export * from './account';
export * from './auth';
export * from './collaboration';
export * from './blueprint';
export * from './task';
export * from './quality';
export * from './todo';
export * from './permission';
export * from './issue';
export * from './document';
export * from './bot';
export * from './system';

// Supabase adapter
export * from './supabase-adapter.service';

// Analytics service
export * from './analytics.service';
