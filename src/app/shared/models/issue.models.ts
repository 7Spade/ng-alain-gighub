import { Database } from '@core';

/**
 * 问题追踪系统数据模型
 *
 * 对应数据库表：
 * - issues: 问题主表
 * - issue_assignments: 问题指派表
 * - issue_photos: 问题照片表
 * - issue_sync_logs: 问题同步记录表
 *
 * @module shared/models/issue
 */

/**
 * Issue 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Issue = Database['public']['Tables']['issues']['Row'];
export type IssueInsert = Database['public']['Tables']['issues']['Insert'];
export type IssueUpdate = Database['public']['Tables']['issues']['Update'];

/**
 * IssueAssignment 实体类型（camelCase）
 */
export type IssueAssignment = Database['public']['Tables']['issue_assignments']['Row'];
export type IssueAssignmentInsert = Database['public']['Tables']['issue_assignments']['Insert'];
export type IssueAssignmentUpdate = Database['public']['Tables']['issue_assignments']['Update'];

/**
 * IssuePhoto 实体类型（camelCase）
 */
export type IssuePhoto = Database['public']['Tables']['issue_photos']['Row'];
export type IssuePhotoInsert = Database['public']['Tables']['issue_photos']['Insert'];
export type IssuePhotoUpdate = Database['public']['Tables']['issue_photos']['Update'];

/**
 * IssueSyncLog 实体类型（camelCase）
 */
export type IssueSyncLog = Database['public']['Tables']['issue_sync_logs']['Row'];
export type IssueSyncLogInsert = Database['public']['Tables']['issue_sync_logs']['Insert'];
export type IssueSyncLogUpdate = Database['public']['Tables']['issue_sync_logs']['Update'];
