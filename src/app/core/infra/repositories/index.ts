/**
 * Repository 模組統一導出
 *
 * 按業務模組分類導出：
 * - account: 帳戶與身份系統
 * - analytics: 資料分析系統
 * - auth: 認證系統
 * - blueprint: 藍圖/專案系統
 * - bot: 機器人系統
 * - collaboration: 組織協作系統
 * - communication: 協作溝通系統
 * - document: 文件管理系統
 * - issue: 問題追蹤系統
 * - notification: 通知系統
 * - permission: 權限系統
 * - quality: 品質驗收系統
 * - task: 任務執行系統
 * - todo: 待辦中心系統
 * - system: 系統管理
 *
 * 注意：Permission, Role, UserRole 類型已在 @core/permissions 中定義
 * 此處只導出 Repository 類，不導出類型以避免衝突
 *
 * @module core/infra/repositories
 */

// 基礎 Repository
export * from './base.repository';

// 按模組導出
export * from './account';
export * from './analytics';
export * from './auth';
export * from './blueprint';
export * from './bot';
export * from './collaboration';
export * from './communication';
export * from './document';
export * from './issue';
export * from './notification';
export * from './quality';
export * from './task';
export * from './todo';
export * from './system';

// Permission 模組特殊處理（避免與 @core/permissions 衝突）
export { PermissionRepository } from './permission/permission.repository';
export type { PermissionInsert, PermissionUpdate } from './permission/permission.repository';
export { RoleRepository } from './permission/role.repository';
export type { RoleInsert, RoleUpdate } from './permission/role.repository';
export { UserRoleRepository } from './permission/user-role.repository';
export type { UserRoleInsert, UserRoleUpdate } from './permission/user-role.repository';
