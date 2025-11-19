/**
 * 系统相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 功能标识状态枚举
 * 对应数据库 feature_flags.status 字段
 */
export enum FeatureFlagStatus {
  /** 启用 */
  ENABLED = 'enabled',
  /** 禁用 */
  DISABLED = 'disabled'
}

/**
 * 功能标识目标枚举
 * 对应数据库 feature_flags.target_type 字段
 */
export enum FeatureFlagTargetType {
  /** 全局 */
  GLOBAL = 'global',
  /** 蓝图 */
  BLUEPRINT = 'blueprint',
  /** 组织 */
  ORGANIZATION = 'organization',
  /** 用户 */
  USER = 'user'
}

/**
 * 设置分类枚举
 * 对应数据库 settings.category 字段
 */
export enum SettingCategory {
  /** 系统设置 */
  SYSTEM = 'system',
  /** 用户设置 */
  USER = 'user',
  /** 项目设置 */
  PROJECT = 'project',
  /** 通知设置 */
  NOTIFICATION = 'notification'
}

/**
 * 设置数据类型枚举
 * 对应数据库 settings.value_type 字段
 */
export enum SettingValueType {
  /** 字符串 */
  STRING = 'string',
  /** 数字 */
  NUMBER = 'number',
  /** 布尔值 */
  BOOLEAN = 'boolean',
  /** JSON 对象 */
  JSON = 'json'
}

/**
 * 活动日志动作枚举
 * 对应数据库 activity_logs.action 字段
 */
export enum ActivityLogAction {
  /** 创建 */
  CREATED = 'created',
  /** 更新 */
  UPDATED = 'updated',
  /** 删除 */
  DELETED = 'deleted',
  /** 分叉 */
  FORKED = 'forked',
  /** 合并 */
  MERGED = 'merged',
  /** 评论 */
  COMMENTED = 'commented'
}

/**
 * 活动日志资源类型枚举
 * 对应数据库 activity_logs.resource_type 字段
 */
export enum ActivityLogResourceType {
  /** 蓝图 */
  BLUEPRINT = 'blueprint',
  /** 分支 */
  BRANCH = 'branch',
  /** 任务 */
  TASK = 'task',
  /** 问题 */
  ISSUE = 'issue',
  /** 文档 */
  DOCUMENT = 'document',
  /** 品质检查 */
  QUALITY_CHECK = 'quality_check',
  /** Pull Request */
  PULL_REQUEST = 'pull_request'
}
