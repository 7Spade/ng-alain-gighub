import { Database, TaskType, TaskStatus, TaskPriority, TaskAssigneeType, TaskListType, TaskDependencyType } from '@core';

/**
 * 重新导出任务相关枚举（从 core 层导入）
 * 保持向后兼容，允许从 @shared/models/task 导入
 *
 * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
 * 符合分层架构：core 不依赖 shared
 */
export { TaskType, TaskStatus, TaskPriority, TaskAssigneeType, TaskListType, TaskDependencyType };

/**
 * Task 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];

/**
 * TaskAssignment 实体类型（camelCase）
 */
export type TaskAssignment = Database['public']['Tables']['task_assignments']['Row'];
export type TaskAssignmentInsert = Database['public']['Tables']['task_assignments']['Insert'];
export type TaskAssignmentUpdate = Database['public']['Tables']['task_assignments']['Update'];

/**
 * TaskList 实体类型（camelCase）
 */
export type TaskList = Database['public']['Tables']['task_lists']['Row'];
export type TaskListInsert = Database['public']['Tables']['task_lists']['Insert'];
export type TaskListUpdate = Database['public']['Tables']['task_lists']['Update'];

/**
 * TaskStaging 实体类型（camelCase）
 */
export type TaskStaging = Database['public']['Tables']['task_staging']['Row'];
export type TaskStagingInsert = Database['public']['Tables']['task_staging']['Insert'];
export type TaskStagingUpdate = Database['public']['Tables']['task_staging']['Update'];

/**
 * TaskDependency 实体类型（camelCase）
 */
export type TaskDependency = Database['public']['Tables']['task_dependencies']['Row'];
export type TaskDependencyInsert = Database['public']['Tables']['task_dependencies']['Insert'];
export type TaskDependencyUpdate = Database['public']['Tables']['task_dependencies']['Update'];

/**
 * TaskTemplate 实体类型（camelCase）
 */
export type TaskTemplate = Database['public']['Tables']['task_templates']['Row'];
export type TaskTemplateInsert = Database['public']['Tables']['task_templates']['Insert'];
export type TaskTemplateUpdate = Database['public']['Tables']['task_templates']['Update'];

/**
 * DailyReport 实体类型（camelCase）
 */
export type DailyReport = Database['public']['Tables']['daily_reports']['Row'];
export type DailyReportInsert = Database['public']['Tables']['daily_reports']['Insert'];
export type DailyReportUpdate = Database['public']['Tables']['daily_reports']['Update'];

/**
 * ReportPhoto 实体类型（camelCase）
 */
export type ReportPhoto = Database['public']['Tables']['report_photos']['Row'];
export type ReportPhotoInsert = Database['public']['Tables']['report_photos']['Insert'];
export type ReportPhotoUpdate = Database['public']['Tables']['report_photos']['Update'];

/**
 * WeatherCache 实体类型（camelCase）
 */
export type WeatherCache = Database['public']['Tables']['weather_cache']['Row'];
export type WeatherCacheInsert = Database['public']['Tables']['weather_cache']['Insert'];
export type WeatherCacheUpdate = Database['public']['Tables']['weather_cache']['Update'];

/**
 * Inspection 实体类型（camelCase）
 */
export type Inspection = Database['public']['Tables']['inspections']['Row'];
export type InspectionInsert = Database['public']['Tables']['inspections']['Insert'];
export type InspectionUpdate = Database['public']['Tables']['inspections']['Update'];

/**
 * InspectionPhoto 实体类型（camelCase）
 */
export type InspectionPhoto = Database['public']['Tables']['inspection_photos']['Row'];
export type InspectionPhotoInsert = Database['public']['Tables']['inspection_photos']['Insert'];
export type InspectionPhotoUpdate = Database['public']['Tables']['inspection_photos']['Update'];

/**
 * 任务树节点类型（用于前端树状结构展示）
 */
export interface TaskTreeNode extends Task {
  children?: TaskTreeNode[];
  expanded?: boolean;
  loading?: boolean;
}

/**
 * 任务指派信息（包含指派对象信息）
 */
export interface TaskAssignmentWithAssignee extends TaskAssignment {
  assignee?: {
    id: string;
    name: string;
    type: string;
  };
  assignedBy?: {
    id: string;
    name: string;
  };
}

/**
 * 任务详情（包含关联信息）
 */
export interface TaskDetail extends Task {
  assignments?: TaskAssignmentWithAssignee[];
  children?: Task[];
  parent?: Task;
  dependencies?: TaskDependency[];
  staging?: TaskStaging;
  dailyReports?: DailyReport[];
}
