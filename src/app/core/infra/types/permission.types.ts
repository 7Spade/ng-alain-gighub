/**
 * 权限管理相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 分支权限级别枚举
 * 对应数据库 branch_permissions.permission_level 字段
 */
export enum BranchPermissionLevel {
  /** 擁有者：全權控制 */
  OWNER = 'owner',
  /** 管理員：管理權限 */
  ADMIN = 'admin',
  /** 寫入：可以修改承攬欄位 */
  WRITE = 'write',
  /** 讀取：唯讀 */
  READ = 'read'
}

/**
 * 权限操作类型枚举
 */
export enum PermissionAction {
  /** 读取 */
  READ = 'read',
  /** 写入 */
  WRITE = 'write',
  /** 管理 */
  ADMIN = 'admin',
  /** 创建任务 */
  CREATE_TASK = 'create_task',
  /** 修改任务结构 */
  MODIFY_TASK_STRUCTURE = 'modify_task_structure',
  /** Fork 分支 */
  FORK_BRANCH = 'fork_branch',
  /** 审核 PR */
  REVIEW_PR = 'review_pr',
  /** 合并 PR */
  MERGE_PR = 'merge_pr',
  /** 管理权限 */
  MANAGE_PERMISSIONS = 'manage_permissions',
  /** 填写承揽栏位 */
  FILL_CONTRACTOR_FIELDS = 'fill_contractor_fields',
  /** 提交 PR */
  SUBMIT_PR = 'submit_pr',
  /** 创建日报 */
  CREATE_DAILY_REPORT = 'create_daily_report',
  /** 创建品质检查 */
  CREATE_QUALITY_CHECK = 'create_quality_check'
}

/**
 * 权限矩阵类型
 * 定义每个权限级别可以执行的操作
 */
export type PermissionMatrix = Record<BranchPermissionLevel, PermissionAction[]>;

/**
 * 默认权限矩阵
 */
export const DEFAULT_PERMISSION_MATRIX: PermissionMatrix = {
  [BranchPermissionLevel.OWNER]: [
    PermissionAction.READ,
    PermissionAction.WRITE,
    PermissionAction.ADMIN,
    PermissionAction.CREATE_TASK,
    PermissionAction.MODIFY_TASK_STRUCTURE,
    PermissionAction.FORK_BRANCH,
    PermissionAction.REVIEW_PR,
    PermissionAction.MERGE_PR,
    PermissionAction.MANAGE_PERMISSIONS
  ],
  [BranchPermissionLevel.ADMIN]: [
    PermissionAction.READ,
    PermissionAction.WRITE,
    PermissionAction.ADMIN,
    PermissionAction.CREATE_TASK,
    PermissionAction.REVIEW_PR,
    PermissionAction.MANAGE_PERMISSIONS
  ],
  [BranchPermissionLevel.WRITE]: [
    PermissionAction.READ,
    PermissionAction.WRITE,
    PermissionAction.FILL_CONTRACTOR_FIELDS,
    PermissionAction.SUBMIT_PR,
    PermissionAction.CREATE_DAILY_REPORT,
    PermissionAction.CREATE_QUALITY_CHECK
  ],
  [BranchPermissionLevel.READ]: [PermissionAction.READ]
};
