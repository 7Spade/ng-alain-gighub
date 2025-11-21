/**
 * 權限系統模型導出
 *
 * 提供權限相關的數據模型：
 * - Permission: 權限實體類型
 * - Role: 角色實體類型
 * - RolePermission: 角色權限關聯實體類型
 * - UserRole: 用戶角色關聯實體類型
 * - BranchPermission: 分支權限實體類型
 * - 相關枚舉：PermissionLevel, RoleType
 *
 * @module shared/models/permission
 */

export * from './permission.models';
