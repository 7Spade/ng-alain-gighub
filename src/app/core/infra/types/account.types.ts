/**
 * 账户相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 账户类型枚举
 * 对应数据库 accounts.type 字段
 */
export enum AccountType {
  /** 用户账户 */
  USER = 'User',
  /** 机器人账户 */
  BOT = 'Bot',
  /** 组织账户 */
  ORGANIZATION = 'Organization'
}

/**
 * 账户状态枚举
 * 对应数据库 accounts.status 字段
 */
export enum AccountStatus {
  /** 活跃 */
  ACTIVE = 'active',
  /** 非活跃 */
  INACTIVE = 'inactive',
  /** 已暂停 */
  SUSPENDED = 'suspended'
}

/**
 * 团队成员角色枚举
 * 对应数据库 team_members.role 字段
 */
export enum TeamMemberRole {
  /** 团队负责人 */
  LEADER = 'leader',
  /** 团队成员 */
  MEMBER = 'member'
}

/**
 * 组织成员角色枚举
 * 对应数据库 organization_members.role 字段
 */
export enum OrganizationMemberRole {
  /** 组织拥有者 */
  OWNER = 'owner',
  /** 组织管理员 */
  ADMIN = 'admin',
  /** 组织成员 */
  MEMBER = 'member'
}
