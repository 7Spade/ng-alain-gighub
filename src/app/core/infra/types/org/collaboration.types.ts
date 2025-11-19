/**
 * 组织协作相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 协作类型枚举
 * 对应数据库 organization_collaborations.collaboration_type 字段
 */
export enum CollaborationType {
  /** 承揽商 */
  CONTRACTOR = 'contractor',
  /** 次承揽商 */
  SUBCONTRACTOR = 'subcontractor',
  /** 顾问 */
  CONSULTANT = 'consultant',
  /** 合作伙伴 */
  PARTNER = 'partner'
}

/**
 * 协作状态枚举
 * 对应数据库 organization_collaborations.status 字段
 */
export enum CollaborationStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 活跃 */
  ACTIVE = 'active',
  /** 已暂停 */
  SUSPENDED = 'suspended',
  /** 已结束 */
  ENDED = 'ended'
}

/**
 * 邀请状态枚举
 * 对应数据库 collaboration_invitations.status 字段
 */
export enum InvitationStatus {
  /** 待处理 */
  PENDING = 'pending',
  /** 已接受 */
  ACCEPTED = 'accepted',
  /** 已拒绝 */
  REJECTED = 'rejected',
  /** 已过期 */
  EXPIRED = 'expired'
}
