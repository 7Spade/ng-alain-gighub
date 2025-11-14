import { Database, CollaborationType, CollaborationStatus, InvitationStatus } from '@core';

/**
 * 重新导出协作相关枚举（从 core 层导入）
 * 保持向后兼容，允许从 @shared/models/collaboration 导入
 * 
 * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 * 符合分层架构：core 不依赖 shared
 */
export { CollaborationType, CollaborationStatus, InvitationStatus };

/**
 * OrganizationCollaboration 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type OrganizationCollaboration = Database['public']['Tables']['organization_collaborations']['Row'];
export type OrganizationCollaborationInsert = Database['public']['Tables']['organization_collaborations']['Insert'];
export type OrganizationCollaborationUpdate = Database['public']['Tables']['organization_collaborations']['Update'];

/**
 * CollaborationInvitation 实体类型（camelCase）
 */
export type CollaborationInvitation = Database['public']['Tables']['collaboration_invitations']['Row'];
export type CollaborationInvitationInsert = Database['public']['Tables']['collaboration_invitations']['Insert'];
export type CollaborationInvitationUpdate = Database['public']['Tables']['collaboration_invitations']['Update'];

/**
 * CollaborationMember 实体类型（camelCase）
 */
export type CollaborationMember = Database['public']['Tables']['collaboration_members']['Row'];
export type CollaborationMemberInsert = Database['public']['Tables']['collaboration_members']['Insert'];
export type CollaborationMemberUpdate = Database['public']['Tables']['collaboration_members']['Update'];

