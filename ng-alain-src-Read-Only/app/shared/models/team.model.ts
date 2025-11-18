import type { User } from './user.model';

/**
 * Team 團隊模型
 */
export interface Team {
  id: string; // UUID
  organization_id: string; // UUID
  name: string;
  slug: string; // GitHub 風格: team-slug
  description?: string | null;
  avatar_url?: string | null;
  privacy: 'secret' | 'closed'; // 'secret': 僅成員可見, 'closed': 組織內可見
  parent_team_id?: string | null; // UUID，支持嵌套團隊
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * Team Member 角色類型
 */
export type TeamMemberRole = 'maintainer' | 'member';

/**
 * Team Member 狀態類型
 */
export type TeamMemberStatus = 'active' | 'inactive';

/**
 * Team Member 團隊成員模型
 */
export interface TeamMember {
  id: string; // UUID
  team_id: string; // UUID
  user_id: string; // UUID
  role: TeamMemberRole;
  joined_at: string; // ISO 8601 timestamp
  status: TeamMemberStatus;
}

/**
 * 擴展的團隊成員模型（包含用戶資訊）
 */
export interface TeamMemberWithUser extends TeamMember {
  user: User;
}

/**
 * 擴展的團隊模型（包含成員列表）
 */
export interface TeamWithMembers extends Team {
  members: TeamMemberWithUser[];
}

/**
 * 創建團隊的輸入參數
 */
export interface CreateTeamInput {
  organization_id: string;
  name: string;
  slug: string;
  description?: string;
  avatar_url?: string;
  privacy?: 'secret' | 'closed';
  parent_team_id?: string;
}

/**
 * 更新團隊的輸入參數
 */
export interface UpdateTeamInput {
  name?: string;
  slug?: string;
  description?: string;
  avatar_url?: string;
  privacy?: 'secret' | 'closed';
  parent_team_id?: string;
}

/**
 * 團隊層級結構
 */
export interface TeamHierarchy {
  team: Team;
  children: TeamHierarchy[];
}
