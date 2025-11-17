/**
 * Blueprint Aggregation Models
 *
 * 這些型別描述藍圖層的聚合輸出，供 Blueprint tabs（overview/progress/report/quality/charts 等）
 * 使用。來源資料涵蓋 Supabase 資料表（blueprint_tasks、blueprint_progress、
 * blueprint_milestones、blueprint_daily_reports、blueprint_members、blueprint_quality_checks）
 * 以及任務層 Facet/Event Repository（如 TaskQualityRepository）。
 */

import type {
  Blueprint,
  BlueprintActivityType,
  BlueprintDocument,
  BlueprintMemberRole,
  BlueprintMemberWithUser,
  BlueprintMilestone
} from './blueprint.model';

/**
 * 可選的聚合維度。
 */
export type BlueprintAggregationDimension =
  | 'progress'
  | 'milestones'
  | 'tasks'
  | 'dailyReports'
  | 'members'
  | 'quality'
  | 'activities'
  | 'documents'
  | 'discussions';

/**
 * 聚合請求時可選擇的篩選器。
 */
export interface BlueprintAggregationFilters {
  readonly taskIds?: readonly string[];
  readonly dateRange?: AggregatedDateRange;
  readonly includeDimensions?: readonly BlueprintAggregationDimension[];
}

/**
 * 聚合輸出的標準結構。
 */
export interface BlueprintAggregationResult {
  readonly blueprintId: string;
  readonly blueprintName: string;
  readonly generatedAt: string; // ISO 8601 timestamp
  readonly timezone?: string;
  readonly filters: BlueprintAggregationResolvedFilters;
  readonly progress?: BlueprintProgressAggregation;
  readonly milestones?: BlueprintMilestoneAggregation;
  readonly tasks?: BlueprintTaskAggregation;
  readonly dailyReports?: BlueprintDailyReportAggregation;
  readonly members?: BlueprintMemberAggregation;
  readonly quality?: BlueprintQualityAggregation;
  readonly activities?: BlueprintActivityAggregation;
  readonly documents?: BlueprintDocumentAggregation;
}

/**
 * 已解析的篩選內容，方便前端直接使用。
 */
export interface BlueprintAggregationResolvedFilters {
  readonly taskIds?: readonly string[];
  readonly dateRange?: AggregatedDateRange;
  readonly includeDimensions: readonly BlueprintAggregationDimension[];
}

/**
 * 聚合過程採用的日期範圍。
 */
export interface AggregatedDateRange {
  readonly start: string | null; // ISO 8601 date
  readonly end: string | null; // ISO 8601 date
}

/**
 * 進度聚合結果。
 */
export interface BlueprintProgressAggregation {
  readonly summary: BlueprintProgressSummary;
  readonly history: readonly BlueprintProgressHistoryPoint[];
  readonly velocity: readonly BlueprintProgressVelocityPoint[];
}

export interface BlueprintProgressSummary {
  readonly percent: number;
  readonly status: Blueprint['status'];
  readonly currentStage: string | null;
  readonly trend: 'up' | 'down' | 'flat';
  readonly deltaPercent: number; // 與上一筆進度的差值
  readonly lastUpdatedAt: string | null; // ISO 8601 timestamp
  readonly daysSinceUpdate: number | null;
  readonly recordCount: number;
}

export interface BlueprintProgressHistoryPoint {
  readonly date: string; // ISO 8601 date
  readonly recordedAt: string; // ISO 8601 timestamp
  readonly percent: number;
  readonly stage: string | null;
  readonly recordedBy: string;
  readonly notes?: string | null;
}

export interface BlueprintProgressVelocityPoint {
  readonly period: string; // e.g. "2025-W45"
  readonly averagePercent: number;
  readonly periodChange: number;
}

/**
 * 里程碑聚合結果。
 */
export interface BlueprintMilestoneAggregation {
  readonly totals: BlueprintMilestoneTotals;
  readonly list: readonly BlueprintMilestone[];
  readonly upcoming: readonly BlueprintMilestoneSnapshot[];
  readonly overdue: readonly BlueprintMilestoneSnapshot[];
}

export interface BlueprintMilestoneTotals {
  readonly total: number;
  readonly completed: number;
  readonly inProgress: number;
  readonly planned: number;
  readonly cancelled: number;
  readonly averageProgress: number;
  readonly successPercent: number;
}

export interface BlueprintMilestoneSnapshot {
  readonly id: string;
  readonly name: string;
  readonly status: BlueprintMilestoneTotalsStatus;
  readonly targetDate: string | null; // ISO 8601 date
  readonly progressPercentage: number | null;
  readonly isOverdue: boolean;
}

export type BlueprintMilestoneTotalsStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';

/**
 * 任務聚合結果。
 */
export type BlueprintTaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type BlueprintTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface BlueprintTaskSnapshot {
  readonly id: string;
  readonly blueprintId: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: BlueprintTaskStatus;
  readonly priority: BlueprintTaskPriority | null;
  readonly assignedTo: string | null;
  readonly dueDate: string | null;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface BlueprintTaskAggregation {
  readonly totals: BlueprintTaskTotals;
  readonly statusBreakdown: readonly AggregationDistributionEntry[];
  readonly priorityBreakdown: readonly AggregationDistributionEntry[];
  readonly tagCloud: readonly BlueprintTaskTagFrequency[];
  readonly timeline: readonly BlueprintTaskTimelinePoint[];
  readonly recent: readonly BlueprintTaskListItem[];
  readonly statusPriorityMatrix: readonly BlueprintTaskStatusPriorityEntry[];
}

export interface BlueprintTaskTotals {
  readonly total: number;
  readonly completed: number;
  readonly inProgress: number;
  readonly pending: number;
  readonly cancelled: number;
  readonly completionRate: number;
  readonly activeRate: number;
}

export interface BlueprintTaskTagFrequency {
  readonly tag: string;
  readonly weight: number; // 使用次數或權重
}

export interface BlueprintTaskStatusPriorityEntry {
  readonly status: BlueprintTaskStatus;
  readonly priority: BlueprintTaskPriority | null;
  readonly count: number;
}

export interface BlueprintTaskTimelinePoint {
  readonly date: string; // ISO 8601 date
  readonly taskCount: number;
  readonly milestoneCount: number;
}

export interface BlueprintTaskListItem {
  readonly id: string;
  readonly blueprintId: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: BlueprintTaskStatus;
  readonly priority: BlueprintTaskPriority | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * 活動聚合結果。
 */
export interface BlueprintActivityAggregation {
  readonly totals: BlueprintActivityTotals;
  readonly byType: readonly AggregationDistributionEntry[];
  readonly byUser: readonly BlueprintActivityUserEntry[];
  readonly timeline: readonly AggregatedSeriesPoint[];
  readonly recent: readonly BlueprintActivityListItem[];
}

export interface BlueprintActivityTotals {
  readonly total: number;
  readonly uniqueUsers: number;
  readonly since: string | null;
}

export interface BlueprintActivityUserEntry {
  readonly userId: string;
  readonly userName: string;
  readonly count: number;
}

export interface BlueprintActivityListItem {
  readonly id: string;
  readonly blueprintId: string;
  readonly type: BlueprintActivityType;
  readonly action: string;
  readonly description: string;
  readonly userId: string;
  readonly userName: string;
  readonly userAvatar: string | null;
  readonly relatedId: string | null;
  readonly createdAt: string;
}

/**
 * 文件聚合結果。
 */
export interface BlueprintDocumentClassificationAggregation {
  readonly discipline: readonly AggregationDistributionEntry[];
  readonly phase: readonly AggregationDistributionEntry[];
  readonly package: readonly AggregationDistributionEntry[];
}

export interface BlueprintDocumentAggregation {
  readonly totals: BlueprintDocumentTotals;
  readonly byType: readonly AggregationDistributionEntry[];
  readonly byDirectory: readonly BlueprintDocumentDirectoryEntry[];
  readonly classification: BlueprintDocumentClassificationAggregation;
  readonly recent: readonly BlueprintDocumentListItem[];
}

export interface BlueprintDocumentTotals {
  readonly total: number;
  readonly files: number;
  readonly directories: number;
  readonly storageSize: number;
  readonly lastUpdatedAt: string | null;
}

export interface BlueprintDocumentDirectoryEntry {
  readonly directoryId: string | null;
  readonly directoryPath: string;
  readonly count: number;
}

export interface BlueprintDocumentListItem {
  readonly id: string;
  readonly blueprintId: string;
  readonly name: string;
  readonly path: string;
  readonly type: BlueprintDocument['type'];
  readonly size: number | null;
  readonly currentVersion: number;
  readonly discipline?: string | null;
  readonly phase?: string | null;
  readonly package?: string | null;
  readonly updatedAt: string;
}

/**
 * 每日報表聚合結果。
 */
export interface BlueprintDailyReportAggregation {
  readonly summary: BlueprintDailyReportSummary;
  readonly progressSeries: readonly AggregatedSeriesPoint[];
  readonly activitySeries: readonly AggregatedSeriesPoint[];
  readonly weatherDistribution: readonly AggregationDistributionEntry[];
  readonly participantDistribution: readonly AggregationDistributionEntry[];
  readonly issueDistribution: readonly AggregationDistributionEntry[];
  readonly latestReports: readonly BlueprintDailyReportSnapshot[];
}

export interface BlueprintDailyReportSummary {
  readonly total: number;
  readonly todayCount: number;
  readonly firstReportDate: string | null;
  readonly lastReportDate: string | null;
  readonly streakDays: number;
}

export interface BlueprintDailyReportSnapshot {
  readonly id: string;
  readonly date: string; // ISO 8601 date
  readonly authorId: string;
  readonly progressPercentage: number | null;
  readonly weather: string | null;
  readonly hasIssues: boolean;
}

/**
 * 成員聚合結果。
 */
export interface BlueprintMemberAggregation {
  readonly total: number;
  readonly roles: readonly BlueprintMemberRoleDistribution[];
  readonly members: readonly BlueprintMemberWithUser[];
}

export interface BlueprintMemberRoleDistribution {
  readonly role: BlueprintMemberRole;
  readonly count: number;
}

/**
 * 品質聚合結果。資料來源：TaskQualityRepository（Facet/Event）與 blueprint_quality_checks。
 */
export interface BlueprintQualityAggregation {
  readonly scope: 'blueprint' | 'task-group' | 'task-selection';
  readonly summary: BlueprintQualitySummary;
  readonly alerts: readonly BlueprintQualityAlert[];
  readonly trend: readonly BlueprintQualityTrendPoint[];
  readonly tasks: readonly BlueprintQualityTaskSnapshot[];
}

export interface BlueprintQualitySummary {
  readonly standardsCovered: number;
  readonly standardsTotal: number;
  readonly inspectionsCompleted: number;
  readonly inspectionsPlanned: number;
  readonly firstPassYield: number; // 0-100
  readonly openNcr: number;
  readonly closeRate: number; // NCR/CAR 關閉率百分比
}

export interface BlueprintQualityAlert {
  readonly id: string;
  readonly type: 'standard' | 'inspection' | 'ncr' | 'car';
  readonly severity: 'info' | 'warning' | 'critical';
  readonly message: string;
  readonly relatedTaskIds: readonly string[];
}

export interface BlueprintQualityTrendPoint {
  readonly label: string; // 例如 2025-11 或 2025-W45
  readonly inspections: number;
  readonly firstPassYield: number;
  readonly ncr: number;
}

export interface BlueprintQualityTaskSnapshot {
  readonly taskId: string;
  readonly taskName: string;
  readonly firstPassYield: number;
  readonly openNcr: number;
  readonly lastInspectionAt: string | null;
}

/**
 * 通用的分佈資料格式。
 */
export interface AggregationDistributionEntry {
  readonly key: string;
  readonly label?: string;
  readonly value: number;
}

/**
 * 通用時間序列資料。
 */
export interface AggregatedSeriesPoint {
  readonly date: string; // ISO 8601 date
  readonly value: number;
  readonly secondaryValue?: number;
}
