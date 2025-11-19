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
 * - common: 通用基础服务（error state, aggregation refresh）
 *
 * @module shared/services
 */

// 按模块导出
export * from '../account';
export * from '../auth';
export * from '../blueprint';
export * from '../bot';
export * from '../common';
export * from '../document';
export * from '../issue';
export * from '../org';
export * from '../permission';
export * from '../quality';
export * from '../system';
export * from '../task';
export * from '../todo';

// Supabase adapter (if exists)
// export * from '../common/supabase-adapter.service';

// Analytics service
export * from './analytics.service';
