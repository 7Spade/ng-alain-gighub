/**
 * 權限系統 Repository 導出
 *
 * 提供權限相關的數據訪問方法：
 * - PermissionRepository: 權限數據訪問
 * - RoleRepository: 角色數據訪問
 * - RolePermissionRepository: 角色權限關聯數據訪問
 * - UserRoleRepository: 用戶角色關聯數據訪問
 * - BranchPermissionRepository: 分支權限數據訪問
 *
 * @module core/infra/repositories/permission
 */

export * from './permission.repository';
export * from './role.repository';
export * from './role-permission.repository';
export * from './user-role.repository';
export * from './branch-permission.repository';
