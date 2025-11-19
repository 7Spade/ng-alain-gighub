import { Database } from '@core';

/**
 * 權限系統模型類型定義
 *
 * 使用 Database 類型自動生成，確保與數據庫結構一致
 */

/**
 * Role 實體類型（camelCase）
 * 對應 roles 表
 */
export type Role = Database['public']['Tables']['roles']['Row'];
export type RoleInsert = Database['public']['Tables']['roles']['Insert'];
export type RoleUpdate = Database['public']['Tables']['roles']['Update'];

/**
 * Permission 實體類型（camelCase）
 * 對應 permissions 表
 */
export type Permission = Database['public']['Tables']['permissions']['Row'];
export type PermissionInsert = Database['public']['Tables']['permissions']['Insert'];
export type PermissionUpdate = Database['public']['Tables']['permissions']['Update'];

/**
 * UserRole 實體類型（camelCase）
 * 對應 user_roles 表
 */
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type UserRoleInsert = Database['public']['Tables']['user_roles']['Insert'];
export type UserRoleUpdate = Database['public']['Tables']['user_roles']['Update'];

/**
 * RolePermission 實體類型（camelCase）
 * 對應 role_permissions 表
 */
export type RolePermission = Database['public']['Tables']['role_permissions']['Row'];
export type RolePermissionInsert = Database['public']['Tables']['role_permissions']['Insert'];
export type RolePermissionUpdate = Database['public']['Tables']['role_permissions']['Update'];

/**
 * BranchPermission 實體類型（camelCase）
 * 對應 branch_permissions 表
 */
export type BranchPermission = Database['public']['Tables']['branch_permissions']['Row'];
export type BranchPermissionInsert = Database['public']['Tables']['branch_permissions']['Insert'];
export type BranchPermissionUpdate = Database['public']['Tables']['branch_permissions']['Update'];

/**
 * 分支權限級別枚舉
 */
export enum BranchPermissionLevel {
  /** 擁有者：全權控制 */
  OWNER = 'owner',
  /** 管理員：管理權限 */
  ADMIN = 'admin',
  /** 寫入：可以修改承攬欄位 */
  WRITE = 'write',
  /** 讀取：唯讀 */
  READ = 'read'
}
