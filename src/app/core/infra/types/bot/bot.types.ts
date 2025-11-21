/**
 * 机器人相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 机器人状态枚举
 * 对应数据库 bots.status 字段
 */
export enum BotStatus {
  /** 活跃 */
  ACTIVE = 'active',
  /** 非活跃 */
  INACTIVE = 'inactive',
  /** 已暂停 */
  SUSPENDED = 'suspended'
}

/**
 * 机器人任务状态枚举
 * 对应数据库 bot_tasks.status 字段
 */
export enum BotTaskStatus {
  /** 待执行 */
  PENDING = 'pending',
  /** 执行中 */
  RUNNING = 'running',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 失败 */
  FAILED = 'failed',
  /** 已取消 */
  CANCELLED = 'cancelled'
}

/**
 * 机器人任务优先级枚举
 * 对应数据库 bot_tasks.priority 字段
 */
export enum BotTaskPriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  MEDIUM = 'medium',
  /** 高 */
  HIGH = 'high'
}

/**
 * 机器人执行日志状态枚举
 * 对应数据库 bot_execution_logs.execution_status 字段
 */
export enum BotExecutionStatus {
  /** 开始 */
  STARTED = 'started',
  /** 进行中 */
  IN_PROGRESS = 'in_progress',
  /** 成功 */
  SUCCESS = 'success',
  /** 失败 */
  FAILED = 'failed',
  /** 超时 */
  TIMEOUT = 'timeout'
}

/**
 * 机器人类型枚举
 * 对应数据库 bots.bot_type 字段
 * 
 * @description 定义机器人的类型分类
 */
export enum BotType {
  /** 自动化任务机器人 */
  AUTOMATION = 'automation',
  /** 通知机器人 */
  NOTIFICATION = 'notification',
  /** 数据同步机器人 */
  SYNC = 'sync',
  /** 报告生成机器人 */
  REPORT = 'report',
  /** 监控机器人 */
  MONITORING = 'monitoring',
  /** 自定义机器人 */
  CUSTOM = 'custom'
}
