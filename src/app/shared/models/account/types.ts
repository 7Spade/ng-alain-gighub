import { Database, AccountType, AccountStatus, TeamMemberRole } from '@core';

/**
 * 重新导出账户相关枚举（从 core 层导入）
 * 保持向后兼容，允许从 @shared/models/account 导入
 * 
 * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 * 符合分层架构：core 不依赖 shared
 */
export { AccountType, AccountStatus, TeamMemberRole };

/**
 * Account 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Account = Database['public']['Tables']['accounts']['Row'];
export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

/**
 * Team 实体类型（camelCase）
 */
export type Team = Database['public']['Tables']['teams']['Row'];
export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
export type TeamUpdate = Database['public']['Tables']['teams']['Update'];

/**
 * TeamMember 实体类型（camelCase）
 */
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];

/**
 * OrganizationSchedule 实体类型（camelCase）
 */
export type OrganizationSchedule = Database['public']['Tables']['organization_schedules']['Row'];
export type OrganizationScheduleInsert = Database['public']['Tables']['organization_schedules']['Insert'];
export type OrganizationScheduleUpdate = Database['public']['Tables']['organization_schedules']['Update'];

