import type { User } from './user.model';

/**
 * Organization 組織模型
 */
export interface Organization {
  id: string; // UUID
  name: string;
  slug: string; // GitHub 風格: company-name
  description?: string | null;
  avatar_url?: string | null;
  website_url?: string | null;
  owner_id: string; // UUID，對應 users.id
  is_public: boolean;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Organization Member 角色類型
 */
export type OrganizationMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * Organization Member 狀態類型
 */
export type OrganizationMemberStatus = 'pending' | 'active' | 'suspended';

/**
 * Organization Member 組織成員模型
 */
export interface OrganizationMember {
  id: string; // UUID
  organization_id: string; // UUID
  user_id: string; // UUID
  role: OrganizationMemberRole;
  invited_by?: string | null; // UUID
  invited_at: string; // ISO 8601 timestamp
  joined_at?: string | null; // ISO 8601 timestamp
  status: OrganizationMemberStatus;
}

/**
 * 擴展的組織成員模型（包含用戶資訊）
 */
export interface OrganizationMemberWithUser extends OrganizationMember {
  user: User;
}

/**
 * 擴展的組織模型（包含擁有者資訊）
 */
export interface OrganizationWithOwner extends Organization {
  owner: User;
}

/**
 * 擴展的組織模型（包含成員列表）
 */
export interface OrganizationWithMembers extends Organization {
  members: OrganizationMemberWithUser[];
}

/**
 * 創建組織的輸入參數
 */
export interface CreateOrganizationInput {
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  website_url?: string;
  is_public?: boolean;
}

/**
 * 更新組織的輸入參數
 */
export interface UpdateOrganizationInput {
  name?: string;
  slug?: string;
  description?: string;
  avatar_url?: string;
  website_url?: string;
  is_public?: boolean;
}

/**
 * 邀請用戶加入組織的輸入參數
 */
export interface InviteMemberInput {
  organization_id: string;
  email: string;
  role?: OrganizationMemberRole;
}
