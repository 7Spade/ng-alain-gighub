/**
 * 问题相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 问题状态枚举
 * 对应数据库 issues.status 字段
 */
export enum IssueStatus {
  /** 待处理 */
  OPEN = 'open',
  /** 处理中 */
  IN_PROGRESS = 'in_progress',
  /** 已解决 */
  RESOLVED = 'resolved',
  /** 已关闭 */
  CLOSED = 'closed',
  /** 已重开 */
  REOPENED = 'reopened'
}

/**
 * 问题优先级枚举
 * 对应数据库 issues.priority 字段
 */
export enum IssuePriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  MEDIUM = 'medium',
  /** 高 */
  HIGH = 'high',
  /** 紧急 */
  CRITICAL = 'critical'
}

/**
 * 问题严重程度枚举
 * 对应数据库 issues.severity 字段
 */
export enum IssueSeverity {
  /** 轻微 */
  MINOR = 'minor',
  /** 一般 */
  MODERATE = 'moderate',
  /** 严重 */
  MAJOR = 'major',
  /** 致命 */
  CRITICAL = 'critical'
}

/**
 * 问题照片类型枚举
 * 对应数据库 issue_photos.photo_type 字段
 */
export enum IssuePhotoType {
  /** 发现时 */
  DISCOVERY = 'discovery',
  /** 修复前 */
  BEFORE_FIX = 'before_fix',
  /** 修复后 */
  AFTER_FIX = 'after_fix'
}

/**
 * 问题同步状态枚举
 * 对应数据库 issue_sync_logs.sync_status 字段
 */
export enum IssueSyncStatus {
  /** 等待同步 */
  PENDING = 'pending',
  /** 同步中 */
  IN_PROGRESS = 'in_progress',
  /** 同步成功 */
  SUCCESS = 'success',
  /** 同步失败 */
  FAILED = 'failed'
}
