/**
 * 身份上下文类型定义
 *
 * 定义身份切换相关的类型和接口
 *
 * @module core/identity
 */

/**
 * 身份类型
 */
export type IdentityType = 'personal' | 'organization' | 'team';

/**
 * 身份信息接口
 */
export interface IdentityInfo {
  /** 身份类型 */
  type: IdentityType;
  /** 身份ID（组织ID或团队ID，个人身份时为空） */
  id?: string;
  /** 显示名称 */
  name: string;
  /** 头像URL（可选） */
  avatar?: string;
  /** 邮箱（可选） */
  email?: string;
}

/**
 * 身份切换事件
 */
export interface IdentityChangeEvent {
  /** 旧身份 */
  previous: IdentityInfo | null;
  /** 新身份 */
  current: IdentityInfo;
}
