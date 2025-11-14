/**
 * 蓝图系统相关类型定义（基础设施层）
 * 
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 * 
 * @module core/infra/types
 */

/**
 * 蓝图状态枚举
 * 对应数据库 blueprints.status 字段
 */
export enum BlueprintStatus {
  /** 规划中 */
  PLANNING = 'planning',
  /** 进行中 */
  ACTIVE = 'active',
  /** 暂停 */
  ON_HOLD = 'on_hold',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已归档 */
  ARCHIVED = 'archived'
}

/**
 * 分支类型枚举
 * 对应数据库 blueprint_branches.branch_type 字段
 */
export enum BranchType {
  /** 承揽商 */
  CONTRACTOR = 'contractor',
  /** 分包商 */
  SUBCONTRACTOR = 'subcontractor',
  /** 顾问 */
  CONSULTANT = 'consultant'
}

/**
 * 分支状态枚举
 * 对应数据库 blueprint_branches.status 字段
 */
export enum BranchStatus {
  /** 活跃 */
  ACTIVE = 'active',
  /** 已合并 */
  MERGED = 'merged',
  /** 已关闭 */
  CLOSED = 'closed'
}

/**
 * Pull Request 状态枚举
 * 对应数据库 pull_requests.status 字段
 */
export enum PRStatus {
  /** 打开 */
  OPEN = 'open',
  /** 审核中 */
  REVIEWING = 'reviewing',
  /** 已批准 */
  APPROVED = 'approved',
  /** 已拒绝 */
  REJECTED = 'rejected',
  /** 已合并 */
  MERGED = 'merged',
  /** 已关闭 */
  CLOSED = 'closed'
}

