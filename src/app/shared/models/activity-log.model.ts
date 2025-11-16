/**
 * Activity Log Models
 *
 * 活動記錄相關的資料模型，對應資料庫 activity_logs 表
 */

/**
 * 資源類型
 */
export enum ActivityLogResourceType {
  BLUEPRINT = 'blueprint',
  BRANCH = 'branch',
  TASK = 'task',
  ISSUE = 'issue',
  PR = 'pr',
  COMMENT = 'comment',
  DOCUMENT = 'document',
  INSPECTION = 'inspection',
  QA = 'qa'
}

/**
 * 活動記錄（資料庫完整結構）
 */
export interface ActivityLog {
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
  createdAt: string; // ISO 8601 timestamp
}

/**
 * 活動記錄詳情（包含關聯資料）
 */
export interface ActivityLogDetail extends ActivityLog {
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
 * 活動記錄新增資料
 */
export interface ActivityLogInsert {
  blueprintId: string;
  branchId?: string | null;
  actorId: string;
  action: string;
  resourceType: ActivityLogResourceType;
  resourceId?: string | null;
  actionDetails?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string;
}

/**
 * 活動記錄過濾條件
 */
export interface ActivityLogFilters {
  blueprintId?: string;
  branchId?: string | null;
  actorId?: string;
  resourceType?: ActivityLogResourceType;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
}
