/**
 * 共享服务统一导出
 *
 * 按业务模块分类的服务：
 * - account: 账户服务
 * - analytics: 数据分析服务
 * - auth: 认证服务
 * - blueprint: 蓝图服务
 * - bot: 机器人服务
 * - collab: 协作基础服务（含 comment, notification）
 * - common: 通用基础服务（error state, aggregation refresh, analytics cache, progress tracking, supabase adapter）
 * - document: 文件管理服务
 * - issue: 问题追踪服务
 * - org: 组织协作服务（含 collaboration, invitation，并重新导出 collab 服务）
 * - permission: 权限服务
 * - quality: 品质验收服务（含 quality check, inspection）
 * - system: 系统管理服务（含 setting, feature flag）
 * - task: 任务服务（含 assignment, list, daily report, staging, state machine）
 * - todo: 待办中心服务
 *
 * @module shared/services
 */

// 按模块导出
export * from './account';
export * from './analytics';
export * from './auth';
export * from './blueprint';
export * from './bot';
export * from './collab';
export * from './common';
export * from './document';
export * from './explore';
export * from './issue';
export * from './org';
export * from './permission';
export * from './quality';
export * from './system';
export * from './task';
export * from './todo';
export * from './workspace-context';
