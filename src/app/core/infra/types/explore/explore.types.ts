/**
 * 探索功能相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types/explore
 */

/**
 * 搜索类型枚举
 */
export enum SearchType {
  /** 全部 */
  ALL = 'all',
  /** 用户 */
  USERS = 'users',
  /** 组织 */
  ORGANIZATIONS = 'organizations',
  /** 蓝图 */
  BLUEPRINTS = 'blueprints'
}
