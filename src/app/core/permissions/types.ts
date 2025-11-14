/**
 * 权限服务类型定义
 * 
 * 参考 docs/30-0-完整SQL表結構定義.md 中的权限表结构
 */

/**
 * 角色定义
 * 对应 roles 表
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_system_role: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 权限定义
 * 对应 permissions 表
 */
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  is_system_permission?: boolean;
  created_at?: string;
}

/**
 * 用户角色关联
 * 对应 user_roles 表
 */
export interface UserRole {
  id: string;
  account_id: string;
  role_id: string;
  blueprint_id?: string | null;
  branch_id?: string | null;
  granted_by?: string | null;
  granted_at?: string;
  // 关联查询时包含的角色信息
  roles?: Role;
}

/**
 * 分支权限
 * 对应 branch_permissions 表
 */
export interface BranchPermission {
  id: string;
  branch_id: string;
  account_id: string;
  permission_level: 'owner' | 'admin' | 'write' | 'read';
  granted_by: string;
  granted_at?: string;
}

/**
 * 权限检查结果
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
}

/**
 * 权限缓存项
 */
export interface PermissionCacheItem {
  permission: string;
  hasPermission: boolean;
  expiresAt: number;
  roles?: string[];
  abilities?: string[];
}

