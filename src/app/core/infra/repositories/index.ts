/**
 * Repository 模块导出
 *
 * 注意：Permission, Role, UserRole 類型已在 @core/permissions 中定義
 * 此處只導出 Repository 類，不導出類型以避免衝突
 */
export * from './account.repository';
export * from './activity-log.repository';
export * from './base.repository';
export * from './blueprint-branch.repository';
export * from './blueprint-config.repository';
export * from './blueprint.repository';
export * from './bot-execution-log.repository';
export * from './bot-task.repository';
export * from './bot.repository';
export * from './branch-fork.repository';
export * from './branch-permission.repository';
export * from './collaboration-invitation.repository';
export * from './collaboration-member.repository';
export * from './comment.repository';
export * from './daily-report.repository';
export * from './document-thumbnail.repository';
export * from './document-version.repository';
export * from './document.repository';
export * from './feature-flag.repository';
export * from './inspection-photo.repository';
export * from './inspection.repository';
export * from './issue-assignment.repository';
export * from './issue-photo.repository';
export * from './issue-sync-log.repository';
export * from './issue.repository';
export * from './notification-rule.repository';
export * from './notification-subscription.repository';
export * from './notification.repository';
export * from './organization-collaboration.repository';
export * from './organization-member.repository';
export * from './organization-schedule.repository';
export * from './personal-todo.repository';
// 只導出 Repository 類，不導出類型（避免與 @core/permissions 衝突）
export * from './analytics-cache.repository';
export { PermissionRepository } from './permission.repository';
export type { PermissionInsert, PermissionUpdate } from './permission.repository';
export * from './progress-tracking.repository';
export * from './pull-request.repository';
export * from './qc-photo.repository';
export * from './quality-check.repository';
export * from './report-photo.repository';
export * from './role-permission.repository';
export * from './setting.repository';
// 只導出 Repository 類，不導出類型（避免與 @core/permissions 衝突）
export { RoleRepository } from './role.repository';
export type { RoleInsert, RoleUpdate } from './role.repository';
export * from './task-assignment.repository';
export * from './task-dependency.repository';
export * from './task-list.repository';
export * from './task-staging.repository';
export * from './task-template.repository';
export * from './task.repository';
export * from './team-member.repository';
export * from './team.repository';
export * from './todo-status-tracking.repository';
// 只導出 Repository 類，不導出類型（避免與 @core/permissions 衝突）
export { UserRoleRepository } from './user-role.repository';
export type { UserRoleInsert, UserRoleUpdate } from './user-role.repository';
export * from './weather-cache.repository';
