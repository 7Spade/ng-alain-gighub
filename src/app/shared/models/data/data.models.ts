import { Database, ActivityLogResourceType } from '@core';

/**
 * 资料分析系统数据模型
 *
 * 对应数据库表：
 * - documents: 文件元资料表（统一文件管理，支援版本控制、缩图、软删除）
 * - document_versions: 文件版本控制表
 * - document_thumbnails: 图片缩图表
 * - progress_tracking: 进度追踪表（视觉化仪表板数据）
 * - activity_logs: 活动记录表（集中记录所有操作，所有分支同步到主分支）
 * - analytics_cache: 数据分析快取表（预计算的分析报表快取）
 *
 * @module shared/models/data
 */

/**
 * Document 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

/**
 * DocumentVersion 实体类型（camelCase）
 */
export type DocumentVersion = Database['public']['Tables']['document_versions']['Row'];
export type DocumentVersionInsert = Database['public']['Tables']['document_versions']['Insert'];
export type DocumentVersionUpdate = Database['public']['Tables']['document_versions']['Update'];

/**
 * DocumentThumbnail 实体类型（camelCase）
 */
export type DocumentThumbnail = Database['public']['Tables']['document_thumbnails']['Row'];
export type DocumentThumbnailInsert = Database['public']['Tables']['document_thumbnails']['Insert'];
export type DocumentThumbnailUpdate = Database['public']['Tables']['document_thumbnails']['Update'];

/**
 * ProgressTracking 实体类型（camelCase）
 */
export type ProgressTracking = Database['public']['Tables']['progress_tracking']['Row'];
export type ProgressTrackingInsert = Database['public']['Tables']['progress_tracking']['Insert'];
export type ProgressTrackingUpdate = Database['public']['Tables']['progress_tracking']['Update'];

/**
 * ActivityLog 数据库类型（snake_case）
 */
type ActivityLogDb = Database['public']['Tables']['activity_logs']['Row'];
type ActivityLogInsertDb = Database['public']['Tables']['activity_logs']['Insert'];
type ActivityLogUpdateDb = Database['public']['Tables']['activity_logs']['Update'];

/**
 * ActivityLog 实体类型（camelCase）
 * 應用層使用 camelCase 屬性名稱
 */
export interface ActivityLog {
  id: string;
  blueprintId: string;
  branchId: string | null;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  actionDetails: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

/**
 * ActivityLog 插入類型（camelCase）
 */
export interface ActivityLogInsert {
  actorId: string;
  blueprintId: string;
  branchId?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  actionDetails?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * ActivityLog 更新類型（camelCase）
 */
export interface ActivityLogUpdate {
  action?: string;
  resourceType?: string;
  resourceId?: string | null;
  actionDetails?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * AnalyticsCache 实体类型（camelCase）
 */
export type AnalyticsCache = Database['public']['Tables']['analytics_cache']['Row'];
export type AnalyticsCacheInsert = Database['public']['Tables']['analytics_cache']['Insert'];
export type AnalyticsCacheUpdate = Database['public']['Tables']['analytics_cache']['Update'];

/**
 * 資源類型
 * 統一從 core/types 重新導出，避免重複定義
 *
 * @see core/infra/types/system/system.types.ts
 */
export { ActivityLogResourceType };

/**
 * 活動記錄詳情（包含關聯資料）
 * 使用 camelCase 屬性名稱以保持與應用層一致
 */
export interface ActivityLogDetail {
  id: string;
  blueprintId: string;
  branchId: string | null;
  actorId: string;
  action: string;
  resourceType: ActivityLogResourceType;
  resourceId: string | null;
  actionDetails: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    email: string;
  };
  blueprint?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
}

/**
 * 活動記錄過濾條件
 * 保留原有接口定义以保持向后兼容
 */
export interface ActivityLogFilters {
  blueprintId?: string;
  branchId?: string | null;
  actorId?: string;
  resourceType?: ActivityLogResourceType;
  resourceId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}
