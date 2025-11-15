import { Database, BlueprintStatus, BranchType, BranchStatus, PRStatus } from '@core';

/**
 * 重新导出蓝图系统相关枚举（从 core 层导入）
 * 保持向后兼容，允许从 @shared/models/blueprint 导入
 *
 * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 * 符合分层架构：core 不依赖 shared
 */
export { BlueprintStatus, BranchType, BranchStatus, PRStatus };

/**
 * Blueprint 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Blueprint = Database['public']['Tables']['blueprints']['Row'];
export type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
export type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];

/**
 * BlueprintConfig 实体类型（camelCase）
 */
export type BlueprintConfig = Database['public']['Tables']['blueprint_configs']['Row'];
export type BlueprintConfigInsert = Database['public']['Tables']['blueprint_configs']['Insert'];
export type BlueprintConfigUpdate = Database['public']['Tables']['blueprint_configs']['Update'];

/**
 * BlueprintBranch 实体类型（camelCase）
 */
export type BlueprintBranch = Database['public']['Tables']['blueprint_branches']['Row'];
export type BlueprintBranchInsert = Database['public']['Tables']['blueprint_branches']['Insert'];
export type BlueprintBranchUpdate = Database['public']['Tables']['blueprint_branches']['Update'];

/**
 * BranchFork 实体类型（camelCase）
 */
export type BranchFork = Database['public']['Tables']['branch_forks']['Row'];
export type BranchForkInsert = Database['public']['Tables']['branch_forks']['Insert'];
export type BranchForkUpdate = Database['public']['Tables']['branch_forks']['Update'];

/**
 * PullRequest 实体类型（camelCase）
 */
export type PullRequest = Database['public']['Tables']['pull_requests']['Row'];
export type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
export type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];
