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

// 按模块导出
export * from './account';
export * from './collaboration';
export * from './blueprint';

