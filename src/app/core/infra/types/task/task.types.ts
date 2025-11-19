/**
 * 任务系统相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 任务类型枚举
 * 对应数据库 tasks.task_type 字段
 */
export enum TaskType {
  /** 里程碑 */
  MILESTONE = 'milestone',
  /** 阶段 */
  PHASE = 'phase',
  /** 任务 */
  TASK = 'task',
  /** 子任务 */
  SUBTASK = 'subtask'
}

/**
 * 任务状态枚举
 * 对应数据库 tasks.status 字段
 */
export enum TaskStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已指派 */
  ASSIGNED = 'assigned',
  /** 进行中 */
  IN_PROGRESS = 'in_progress',
  /** 暂存中（48小时可撤回） */
  STAGING = 'staging',
  /** 品管中 */
  IN_QA = 'in_qa',
  /** 验收中 */
  IN_INSPECTION = 'in_inspection',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已取消 */
  CANCELLED = 'cancelled'
}

/**
 * 任务优先级枚举
 * 对应数据库 tasks.priority 字段
 */
export enum TaskPriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  MEDIUM = 'medium',
  /** 高 */
  HIGH = 'high',
  /** 紧急 */
  URGENT = 'urgent'
}

/**
 * 任务指派类型枚举
 * 对应数据库 task_assignments.assignee_type 字段
 */
export enum TaskAssigneeType {
  /** 个人 */
  INDIVIDUAL = 'individual',
  /** 团队 */
  TEAM = 'team',
  /** 组织 */
  ORGANIZATION = 'organization',
  /** 承揽商 */
  CONTRACTOR = 'contractor'
}

/**
 * 任务列表类型枚举
 * 对应数据库 task_lists.list_type 字段
 */
export enum TaskListType {
  /** 已指派 */
  ASSIGNED = 'assigned',
  /** 关注中 */
  WATCHING = 'watching',
  /** 已归档 */
  ARCHIVED = 'archived'
}

/**
 * 任务依赖类型枚举
 * 对应数据库 task_dependencies.dependency_type 字段
 */
export enum TaskDependencyType {
  /** 完成到开始 */
  FINISH_TO_START = 'finish_to_start',
  /** 开始到开始 */
  START_TO_START = 'start_to_start',
  /** 完成到完成 */
  FINISH_TO_FINISH = 'finish_to_finish',
  /** 开始到完成 */
  START_TO_FINISH = 'start_to_finish'
}
