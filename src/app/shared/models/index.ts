/**
 * 数据模型统一导出
 *
 * 按 11 个业务模块分类：
 * - account: 账户与身份系统（4 张表）
 * - collaboration: 组织协作系统（3 张表）
 * - permission: 权限系统（5 张表）
 * - blueprint: 蓝图/专案系统（5 张表）
 * - task: 任务执行系统（9 张表）
 * - quality: 品质验收系统（4 张表）
 * - issue: 问题追踪系统（4 张表）
 * - communication: 协作沟通系统（6 张表）
 * - data: 资料分析系统（6 张表）
 * - bot: 机器人系统（3 张表）
 * - system: 系统管理（2 张表）
 *
 * @module shared/models
 */

// 按模块导出（按依赖顺序）
export * from './account';
export * from './collaboration';
export * from './permission';
export * from './blueprint';
export * from './task';
export * from './quality';
export * from './issue';
export * from './communication';
export * from './data';
export * from './bot';
export * from './system';

// 注意：quality-check.model.ts 和 activity-log.model.ts 已迁移到模块目录
// 请使用 @shared/models/quality 和 @shared/models/data 导入
// 以下导出仅用于向后兼容，建议迁移到新模块
// export * from './quality-check.model';
// export * from './activity-log.model';
