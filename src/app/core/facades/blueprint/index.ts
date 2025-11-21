/**
 * 蓝图/专案系统 Facade 导出
 *
 * 提供蓝图系统相关的 Facade：
 * - BlueprintFacade: 主协调器，提供统一接口
 * - BlueprintCrudFacade: Blueprint CRUD 操作
 * - BlueprintBranchFacade: Branch 管理（Git-like 分支模型）
 * - BlueprintPrFacade: Pull Request 工作流
 * - BlueprintConfigFacade: 配置管理
 * - BlueprintActivityFacade: 活动日志
 *
 * @module core/facades/blueprint
 */

// 主 Facade（协调器）
export * from './blueprint.facade';

// 子 Facade（按功能域拆分）
export * from './blueprint-activity.facade';
export * from './blueprint-branch.facade';
export * from './blueprint-config.facade';
export * from './blueprint-crud.facade';
export * from './blueprint-pr.facade';
