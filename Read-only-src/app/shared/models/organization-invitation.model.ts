import type { OrganizationMemberRole } from './organization.model';

/**
 * Organization Invitation 組織邀請模型
 */
export interface OrganizationInvitation {
  id: string; // UUID
  organization_id: string; // UUID
  email: string;
  role: OrganizationMemberRole;
  invited_by: string; // UUID
  token: string;
  expires_at: string; // ISO 8601 timestamp
  accepted_at?: string | null; // ISO 8601 timestamp
  created_at: string; // ISO 8601 timestamp
}

/**
 * 接受邀請的輸入參數
 */
export interface AcceptInvitationInput {
  token: string;
}
