/**
 * 通信相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 评论类型枚举
 * 对应数据库 comments.commentable_type 字段
 */
export enum CommentableType {
  /** 任务 */
  TASK = 'Task',
  /** 问题 */
  ISSUE = 'Issue',
  /** 文档 */
  DOCUMENT = 'Document',
  /** 品质检查 */
  QUALITY_CHECK = 'QualityCheck',
  /** Pull Request */
  PULL_REQUEST = 'PullRequest'
}

/**
 * 通知类型枚举
 * 对应数据库 notifications.notification_type 字段
 */
export enum NotificationType {
  /** 系统通知 */
  SYSTEM = 'system',
  /** 任务分配 */
  TASK_ASSIGNMENT = 'task_assignment',
  /** 任务更新 */
  TASK_UPDATE = 'task_update',
  /** 问题提及 */
  ISSUE_MENTION = 'issue_mention',
  /** 评论回复 */
  COMMENT_REPLY = 'comment_reply',
  /** PR 审核 */
  PR_REVIEW = 'pr_review',
  /** 协作邀请 */
  COLLABORATION_INVITE = 'collaboration_invite'
}

/**
 * 通知状态枚举
 * 对应数据库 notifications.status 字段
 */
export enum NotificationStatus {
  /** 未读 */
  UNREAD = 'unread',
  /** 已读 */
  READ = 'read',
  /** 已归档 */
  ARCHIVED = 'archived'
}

/**
 * 通知优先级枚举
 * 对应数据库 notifications.priority 字段
 */
export enum NotificationPriority {
  /** 低 */
  LOW = 'low',
  /** 中 */
  MEDIUM = 'medium',
  /** 高 */
  HIGH = 'high'
}

/**
 * 通知订阅类型枚举
 * 对应数据库 notification_subscriptions.subscription_type 字段
 */
export enum NotificationSubscriptionType {
  /** 蓝图 */
  BLUEPRINT = 'blueprint',
  /** 分支 */
  BRANCH = 'branch',
  /** 任务 */
  TASK = 'task',
  /** 问题 */
  ISSUE = 'issue'
}
