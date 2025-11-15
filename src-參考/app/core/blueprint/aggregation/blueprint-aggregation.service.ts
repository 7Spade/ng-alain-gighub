/**
 * Blueprint Aggregation Service
 *
 * 提供藍圖層聚合資料，集中計算 KPI 與統計結果，供 Blueprint 頁面使用。
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type {
  AggregatedSeriesPoint,
  AggregationDistributionEntry,
  BlueprintActivityAggregation,
  BlueprintActivityListItem,
  BlueprintActivityTotals,
  BlueprintAggregationDimension,
  BlueprintAggregationFilters,
  BlueprintAggregationResolvedFilters,
  BlueprintAggregationResult,
  BlueprintDailyReportAggregation,
  BlueprintDailyReportSnapshot,
  BlueprintDailyReportSummary,
  BlueprintDocumentAggregation,
  BlueprintDocumentClassificationAggregation,
  BlueprintDocumentDirectoryEntry,
  BlueprintDocumentListItem,
  BlueprintDocumentTotals,
  BlueprintMemberAggregation,
  BlueprintMemberRoleDistribution,
  BlueprintMilestoneAggregation,
  BlueprintMilestoneSnapshot,
  BlueprintMilestoneTotals,
  BlueprintProgressAggregation,
  BlueprintProgressHistoryPoint,
  BlueprintProgressSummary,
  BlueprintProgressVelocityPoint,
  BlueprintQualityAggregation,
  BlueprintQualityAlert,
  BlueprintQualitySummary,
  BlueprintQualityTaskSnapshot,
  BlueprintQualityTrendPoint,
  BlueprintTaskAggregation,
  BlueprintTaskPriority,
  BlueprintTaskSnapshot,
  BlueprintTaskListItem,
  BlueprintTaskTagFrequency,
  BlueprintTaskTimelinePoint,
  BlueprintTaskTotals,
  BlueprintTaskStatusPriorityEntry,
  BlueprintTaskStatus
} from '@shared/models/blueprint-aggregation.model';
import type {
  Blueprint,
  BlueprintActivityType,
  BlueprintDocument,
  BlueprintDailyReport,
  BlueprintMemberWithUser,
  BlueprintMilestone,
  BlueprintProgress,
  BlueprintQualityCheckWithUsers
} from '@shared/models/blueprint.model';

import { ErrorStateService } from '../../net/error';
import { SupabaseService } from '../../supabase/supabase.service';
import { BlueprintQualityCheckService } from '../quality/blueprint-quality-check.service';

@Injectable({ providedIn: 'root' })
export class BlueprintAggregationService {
  private readonly supabase = inject(SupabaseService);
  private readonly errorService = inject(ErrorStateService);
  private readonly qualityService = inject(BlueprintQualityCheckService);

  /**
   * 暫無快取機制；後續可接入快取層。
   */
  async getAggregationResult(blueprintId: string, filters?: BlueprintAggregationFilters): Promise<BlueprintAggregationResult> {
    const resolvedFilters = this.resolveFilters(filters);
    const include = new Set(resolvedFilters.includeDimensions);

    const blueprint = await this.loadBlueprint(blueprintId);

    const [progress, milestones, tasks, membersData, dailyReports, quality, activities, documents] = await Promise.all([
      include.has('progress') ? this.buildProgressAggregation(blueprint) : Promise.resolve(undefined),
      include.has('milestones') ? this.buildMilestoneAggregation(blueprintId) : Promise.resolve(undefined),
      include.has('tasks') ? this.buildTaskAggregation(blueprintId) : Promise.resolve(undefined),
      include.has('members') || include.has('dailyReports')
        ? this.loadMembers(blueprintId)
        : Promise.resolve<BlueprintMemberWithUser[] | undefined>(undefined),
      include.has('dailyReports') ? this.buildDailyReportAggregation(blueprintId, resolvedFilters) : Promise.resolve(undefined),
      include.has('quality') ? this.buildQualityAggregation(blueprintId) : Promise.resolve(undefined),
      include.has('activities') ? this.buildActivityAggregation(blueprintId) : Promise.resolve(undefined),
      include.has('documents') ? this.buildDocumentAggregation(blueprintId) : Promise.resolve(undefined)
    ]);

    const memberAggregation = include.has('members') ? this.buildMemberAggregation(membersData ?? []) : undefined;
    const dailyReportAggregation = include.has('dailyReports')
      ? this.enrichDailyReportAggregation(dailyReports, membersData ?? [])
      : undefined;

    return {
      blueprintId,
      blueprintName: blueprint.name,
      generatedAt: new Date().toISOString(),
      filters: resolvedFilters,
      timezone: undefined,
      progress,
      milestones,
      tasks,
      dailyReports: dailyReportAggregation,
      members: memberAggregation,
      quality,
      activities,
      documents
    };
  }

  /**
   * 標記藍圖聚合資料為過期（目前為 NO-OP，預留快取擴充）。
   */
  notifyBlueprintChanged(blueprintId: string): void {
    void blueprintId;
    // 未實作快取時無需處理。
  }

  /**
   * 重新計算聚合資料（目前直接呼叫 getAggregationResult）。
   */
  recalculate(blueprintId: string, filters?: BlueprintAggregationFilters): Promise<BlueprintAggregationResult> {
    return this.getAggregationResult(blueprintId, filters);
  }

  private resolveFilters(filters?: BlueprintAggregationFilters): BlueprintAggregationResolvedFilters {
    const allDimensions: BlueprintAggregationDimension[] = [
      'progress',
      'milestones',
      'tasks',
      'dailyReports',
      'members',
      'quality',
      'activities',
      'documents'
    ];

    const include = filters?.includeDimensions?.length ? Array.from(new Set(filters.includeDimensions)) : allDimensions;

    return {
      includeDimensions: include,
      taskIds: filters?.taskIds,
      dateRange: filters?.dateRange
    };
  }

  private async loadBlueprint(blueprintId: string): Promise<Blueprint> {
    const { data, error } = await this.supabase.client.from('blueprints').select('*').eq('id', blueprintId).maybeSingle();

    if (error || !data) {
      const wrappedError = error ?? new Error('Blueprint not found');
      this.logError('載入藍圖失敗', 'BlueprintAggregationService.loadBlueprint', wrappedError, { blueprintId });
      throw wrappedError;
    }

    return data as Blueprint;
  }

  private async buildProgressAggregation(blueprint: Blueprint): Promise<BlueprintProgressAggregation> {
    const { data, error } = await this.supabase.client
      .from('blueprint_progress')
      .select('*')
      .eq('blueprint_id', blueprint.id)
      .order('recorded_at', { ascending: true });

    if (error) {
      this.logError('載入進度紀錄失敗', 'BlueprintAggregationService.buildProgressAggregation', error, {
        blueprintId: blueprint.id
      });
      return {
        summary: this.emptyProgressSummary(blueprint),
        history: [],
        velocity: []
      };
    }

    const records = (data ?? []) as BlueprintProgress[];
    const history: BlueprintProgressHistoryPoint[] = records.map(record => ({
      date: this.toDateString(record.recorded_at),
      recordedAt: record.recorded_at,
      percent: record.progress_percentage,
      stage: record.stage ?? null,
      recordedBy: record.recorded_by,
      notes: record.notes ?? null
    }));

    const summary = this.computeProgressSummary(blueprint, records);
    const velocity = this.computeProgressVelocity(records);

    return {
      summary,
      history,
      velocity
    };
  }

  private emptyProgressSummary(blueprint: Blueprint): BlueprintProgressSummary {
    return {
      percent: blueprint.progress_percentage ?? 0,
      status: blueprint.status,
      currentStage: blueprint.current_stage ?? null,
      trend: 'flat',
      deltaPercent: 0,
      lastUpdatedAt: blueprint.updated_at ?? null,
      daysSinceUpdate: null,
      recordCount: 0
    };
  }

  private computeProgressSummary(blueprint: Blueprint, records: BlueprintProgress[]): BlueprintProgressSummary {
    if (!records.length) {
      return this.emptyProgressSummary(blueprint);
    }

    const latest = records[records.length - 1];
    const previous = records.length > 1 ? records[records.length - 2] : null;
    const percent = latest?.progress_percentage ?? blueprint.progress_percentage ?? 0;
    const currentStage = latest?.stage ?? blueprint.current_stage ?? null;

    const delta = previous ? latest.progress_percentage - previous.progress_percentage : 0;
    const trend: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    const lastUpdatedAt = latest?.recorded_at ?? blueprint.updated_at ?? null;
    const daysSinceUpdate = lastUpdatedAt ? this.diffInDays(lastUpdatedAt, new Date().toISOString()) : null;

    return {
      percent,
      status: blueprint.status,
      currentStage,
      trend,
      deltaPercent: delta,
      lastUpdatedAt,
      daysSinceUpdate,
      recordCount: records.length
    };
  }

  private computeProgressVelocity(records: BlueprintProgress[]): BlueprintProgressVelocityPoint[] {
    if (!records.length) {
      return [];
    }

    const bucket = new Map<string, number[]>();

    for (const record of records) {
      const key = this.toYearMonth(record.recorded_at);
      const values = bucket.get(key) ?? [];
      values.push(record.progress_percentage);
      bucket.set(key, values);
    }

    const periods = Array.from(bucket.keys()).sort();
    let previousAverage: number | null = null;

    return periods.map(period => {
      const values = bucket.get(period) ?? [];
      const averagePercent = values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
      const periodChange = previousAverage === null ? 0 : averagePercent - previousAverage;
      previousAverage = averagePercent;
      return {
        period,
        averagePercent,
        periodChange
      };
    });
  }

  private async buildMilestoneAggregation(blueprintId: string): Promise<BlueprintMilestoneAggregation> {
    const { data, error } = await this.supabase.client.from('blueprint_milestones').select('*').eq('blueprint_id', blueprintId);

    if (error) {
      this.logError('載入里程碑失敗', 'BlueprintAggregationService.buildMilestoneAggregation', error, { blueprintId });
      return {
        totals: {
          total: 0,
          completed: 0,
          inProgress: 0,
          planned: 0,
          cancelled: 0,
          averageProgress: 0,
          successPercent: 0
        },
        list: [],
        upcoming: [],
        overdue: []
      };
    }

    const milestones = (data ?? []) as BlueprintMilestone[];
    const totals = this.computeMilestoneTotals(milestones);
    const upcoming = this.pickUpcomingMilestones(milestones);
    const overdue = upcoming.filter(item => item.isOverdue);

    return {
      totals,
      list: milestones,
      upcoming,
      overdue
    };
  }

  private computeMilestoneTotals(milestones: BlueprintMilestone[]): BlueprintMilestoneTotals {
    if (!milestones.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        planned: 0,
        cancelled: 0,
        averageProgress: 0,
        successPercent: 0
      };
    }

    let completed = 0;
    let inProgress = 0;
    let planned = 0;
    let cancelled = 0;
    let totalProgress = 0;

    for (const milestone of milestones) {
      totalProgress += milestone.progress_percentage ?? 0;
      switch (milestone.status) {
        case 'completed':
          completed += 1;
          break;
        case 'in-progress':
          inProgress += 1;
          break;
        case 'cancelled':
          cancelled += 1;
          break;
        default:
          planned += 1;
          break;
      }
    }

    const total = milestones.length;
    const averageProgress = totalProgress / total;
    const successPercent = (completed / total) * 100;

    return {
      total,
      completed,
      inProgress,
      planned,
      cancelled,
      averageProgress,
      successPercent
    };
  }

  private pickUpcomingMilestones(milestones: BlueprintMilestone[]): BlueprintMilestoneSnapshot[] {
    const today = new Date();
    return milestones
      .filter(milestone => milestone.status !== 'completed' && milestone.status !== 'cancelled')
      .map<BlueprintMilestoneSnapshot>(milestone => {
        const targetDate = milestone.target_date ?? null;
        const isOverdue = targetDate ? new Date(targetDate) < today : false;
        return {
          id: milestone.id,
          name: milestone.name,
          status: milestone.status,
          targetDate,
          progressPercentage: milestone.progress_percentage ?? null,
          isOverdue
        };
      })
      .sort((a, b) => {
        const aTime = a.targetDate ? new Date(a.targetDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.targetDate ? new Date(b.targetDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      })
      .slice(0, 3);
  }

  private async buildTaskAggregation(blueprintId: string): Promise<BlueprintTaskAggregation> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('*').eq('blueprint_id', blueprintId);

    if (error) {
      this.logError('載入任務失敗', 'BlueprintAggregationService.buildTaskAggregation', error, { blueprintId });
      return {
        totals: {
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
          cancelled: 0,
          completionRate: 0,
          activeRate: 0
        },
        statusBreakdown: [],
        priorityBreakdown: [],
        tagCloud: [],
        timeline: [],
        recent: [],
        statusPriorityMatrix: []
      };
    }

    const tasks = (data ?? []).map(task => this.mapTaskSnapshot(task)) as BlueprintTaskSnapshot[];
    const totals = this.computeTaskTotals(tasks);
    const statusBreakdown = this.buildStatusDistribution(tasks);
    const priorityBreakdown = this.buildPriorityDistribution(tasks);
    const tagCloud = this.buildTaskTagCloud(tasks);
    const timeline = await this.buildTaskTimeline(blueprintId, tasks);
    const recent = this.buildRecentTasks(tasks);
    const statusPriorityMatrix = this.buildStatusPriorityMatrix(tasks);

    return {
      totals,
      statusBreakdown,
      priorityBreakdown,
      tagCloud,
      timeline,
      recent,
      statusPriorityMatrix
    };
  }

  private mapTaskSnapshot(task: Record<string, unknown>): BlueprintTaskSnapshot {
    const tagsValue = task['tags'];
    const tags = Array.isArray(tagsValue) ? (tagsValue as string[]) : [];
    const createdAt = (task['created_at'] ?? task['createdAt'] ?? new Date().toISOString()) as string;

    return {
      id: String(task['id'] ?? ''),
      blueprintId: String(task['blueprint_id'] ?? ''),
      name: (task['name'] ?? task['title'] ?? '') as string,
      description: (task['description'] ?? null) as string | null,
      status: (task['status'] ?? 'todo') as BlueprintTaskStatus,
      priority: (task['priority'] ?? null) as BlueprintTaskPriority | null,
      assignedTo: (task['assigned_to'] ?? task['assignedTo'] ?? null) as string | null,
      dueDate: (task['due_date'] ?? task['dueDate'] ?? null) as string | null,
      tags,
      createdAt,
      updatedAt: (task['updated_at'] ?? task['updatedAt'] ?? createdAt) as string
    };
  }

  private computeTaskTotals(tasks: readonly BlueprintTaskSnapshot[]): BlueprintTaskTotals {
    if (!tasks.length) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
        completionRate: 0,
        activeRate: 0
      };
    }

    let completed = 0;
    let inProgress = 0;
    let pending = 0;
    let cancelled = 0;

    for (const task of tasks) {
      switch (task.status) {
        case 'completed':
          completed += 1;
          break;
        case 'in-progress':
          inProgress += 1;
          break;
        case 'cancelled':
          cancelled += 1;
          break;
        default:
          pending += 1;
          break;
      }
    }

    const total = tasks.length;
    const completionRate = (completed / total) * 100;
    const activeRate = ((inProgress + pending) / total) * 100;

    return {
      total,
      completed,
      inProgress,
      pending,
      cancelled,
      completionRate,
      activeRate
    };
  }

  private buildStatusDistribution(tasks: readonly BlueprintTaskSnapshot[]): AggregationDistributionEntry[] {
    const statusOrder: BlueprintTaskStatus[] = ['todo', 'in-progress', 'completed', 'cancelled'];
    const map = new Map<string, number>();

    for (const task of tasks) {
      map.set(task.status, (map.get(task.status) ?? 0) + 1);
    }

    return statusOrder
      .map(status => ({ key: status, label: this.translateTaskStatus(status), value: map.get(status) ?? 0 }))
      .filter(entry => entry.value > 0);
  }

  private buildPriorityDistribution(tasks: readonly BlueprintTaskSnapshot[]): AggregationDistributionEntry[] {
    const priorityOrder: BlueprintTaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    const map = new Map<string, number>();

    for (const task of tasks) {
      if (task.priority) {
        map.set(task.priority, (map.get(task.priority) ?? 0) + 1);
      }
    }

    return priorityOrder
      .map(priority => ({ key: priority, label: this.translateTaskPriority(priority), value: map.get(priority) ?? 0 }))
      .filter(entry => entry.value > 0);
  }

  private buildStatusPriorityMatrix(tasks: readonly BlueprintTaskSnapshot[]): BlueprintTaskStatusPriorityEntry[] {
    const statuses: BlueprintTaskStatus[] = ['todo', 'in-progress', 'completed', 'cancelled'];
    const priorities: Array<BlueprintTaskPriority | null> = ['low', 'medium', 'high', 'urgent', null];
    const result: BlueprintTaskStatusPriorityEntry[] = [];

    for (const status of statuses) {
      for (const priority of priorities) {
        const count = tasks.filter(task => task.status === status && (task.priority ?? null) === priority).length;
        if (count > 0) {
          result.push({ status, priority, count });
        }
      }
    }

    return result;
  }

  private buildTaskTagCloud(tasks: readonly BlueprintTaskSnapshot[]): BlueprintTaskTagFrequency[] {
    const map = new Map<string, number>();

    for (const task of tasks) {
      for (const tag of task.tags ?? []) {
        const normalized = tag.trim();
        if (!normalized) continue;
        map.set(normalized, (map.get(normalized) ?? 0) + 1);
      }
    }

    return Array.from(map.entries())
      .map(([tag, weight]) => ({ tag, weight }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 30);
  }

  private async buildTaskTimeline(blueprintId: string, tasks: readonly BlueprintTaskSnapshot[]): Promise<BlueprintTaskTimelinePoint[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_milestones')
      .select('id, target_date')
      .eq('blueprint_id', blueprintId);

    if (error) {
      this.logError('載入里程碑時間資料失敗', 'BlueprintAggregationService.buildTaskTimeline', error, { blueprintId });
      return [];
    }

    const milestoneDates = new Map<string, number>();
    for (const milestone of (data ?? []) as Array<Pick<BlueprintMilestone, 'id' | 'target_date'>>) {
      if (!milestone.target_date) continue;
      const date = this.toDateString(milestone.target_date);
      milestoneDates.set(date, (milestoneDates.get(date) ?? 0) + 1);
    }

    const taskDates = new Map<string, number>();
    for (const task of tasks) {
      if (!task.dueDate) continue;
      const date = this.toDateString(task.dueDate);
      taskDates.set(date, (taskDates.get(date) ?? 0) + 1);
    }

    const mergedDates = new Set<string>([...taskDates.keys(), ...milestoneDates.keys()]);
    const timeline = Array.from(mergedDates)
      .sort()
      .map(date => ({
        date,
        taskCount: taskDates.get(date) ?? 0,
        milestoneCount: milestoneDates.get(date) ?? 0
      }));

    return timeline;
  }

  private buildRecentTasks(tasks: readonly BlueprintTaskSnapshot[]): BlueprintTaskListItem[] {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt ?? b.createdAt).getTime() - new Date(a.updatedAt ?? a.createdAt).getTime())
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        blueprintId: task.blueprintId,
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }));
  }

  private async loadMembers(blueprintId: string): Promise<BlueprintMemberWithUser[]> {
    const { data, error } = await this.supabase.client
      .from('blueprint_members')
      .select(
        `
        *,
        user:users (*)
      `
      )
      .eq('blueprint_id', blueprintId)
      .eq('status', 'active');

    if (error) {
      this.logError('載入藍圖成員失敗', 'BlueprintAggregationService.loadMembers', error, { blueprintId });
      return [];
    }

    return (data ?? []).map(item => ({
      ...item,
      user: item.user
    })) as BlueprintMemberWithUser[];
  }

  private buildMemberAggregation(members: BlueprintMemberWithUser[]): BlueprintMemberAggregation {
    if (!members.length) {
      return {
        total: 0,
        roles: [],
        members: []
      };
    }

    const map = new Map<string, number>();
    for (const member of members) {
      map.set(member.role, (map.get(member.role) ?? 0) + 1);
    }

    const roles: BlueprintMemberRoleDistribution[] = Array.from(map.entries()).map(([role, count]) => ({
      role: role as BlueprintMemberRoleDistribution['role'],
      count
    }));

    return {
      total: members.length,
      roles,
      members
    };
  }

  private async buildDailyReportAggregation(
    blueprintId: string,
    filters: BlueprintAggregationResolvedFilters
  ): Promise<BlueprintDailyReportAggregation> {
    const query = this.supabase.client
      .from('blueprint_daily_reports')
      .select('*')
      .eq('blueprint_id', blueprintId)
      .order('date', { ascending: true });

    if (filters.dateRange?.start) {
      query.gte('date', filters.dateRange.start);
    }

    if (filters.dateRange?.end) {
      query.lte('date', filters.dateRange.end);
    }

    const { data, error } = await query;

    if (error) {
      this.logError('載入每日報表失敗', 'BlueprintAggregationService.buildDailyReportAggregation', error, { blueprintId });
      return this.emptyDailyReportAggregation();
    }

    const reports = (data ?? []) as BlueprintDailyReport[];
    if (!reports.length) {
      return this.emptyDailyReportAggregation();
    }

    const summary = this.computeDailyReportSummary(reports);
    const progressSeries = reports
      .filter(report => typeof report.progress_percentage === 'number')
      .map<AggregatedSeriesPoint>(report => ({
        date: report.date,
        value: report.progress_percentage ?? 0
      }));

    const activitySeries = this.buildDailyReportActivitySeries(reports);
    const weatherDistribution = this.buildDailyReportWeatherDistribution(reports);
    const issueDistribution = this.buildDailyReportIssueDistribution(reports);
    const participantDistribution = this.buildDailyReportParticipantDistribution(reports);

    return {
      summary,
      progressSeries,
      activitySeries,
      weatherDistribution,
      participantDistribution,
      issueDistribution,
      latestReports: this.buildLatestDailyReports(reports)
    };
  }

  private emptyDailyReportAggregation(): BlueprintDailyReportAggregation {
    return {
      summary: {
        total: 0,
        todayCount: 0,
        firstReportDate: null,
        lastReportDate: null,
        streakDays: 0
      },
      progressSeries: [],
      activitySeries: [],
      weatherDistribution: [],
      participantDistribution: [],
      issueDistribution: [],
      latestReports: []
    };
  }

  private computeDailyReportSummary(reports: BlueprintDailyReport[]): BlueprintDailyReportSummary {
    const sorted = [...reports].sort((a, b) => a.date.localeCompare(b.date));
    const total = sorted.length;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = sorted.filter(report => report.date === today).length;
    const firstReportDate = sorted[0]?.date ?? null;
    const lastReportDate = sorted[sorted.length - 1]?.date ?? null;
    const streakDays = this.computeReportStreak(sorted);

    return {
      total,
      todayCount,
      firstReportDate,
      lastReportDate,
      streakDays
    };
  }

  private computeReportStreak(reports: BlueprintDailyReport[]): number {
    if (!reports.length) {
      return 0;
    }

    const dates = new Set(reports.map(report => report.date));
    let streak = 0;
    let cursor = reports[reports.length - 1]?.date;

    while (cursor && dates.has(cursor)) {
      streak += 1;
      cursor = this.addDays(cursor, -1);
    }

    return streak;
  }

  private buildDailyReportActivitySeries(reports: BlueprintDailyReport[]): AggregatedSeriesPoint[] {
    const map = new Map<string, number>();

    for (const report of reports) {
      map.set(report.date, (map.get(report.date) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private buildDailyReportWeatherDistribution(reports: BlueprintDailyReport[]): AggregationDistributionEntry[] {
    const map = new Map<string, number>();

    for (const report of reports) {
      const key = report.weather?.trim() || '未知';
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  private buildDailyReportIssueDistribution(reports: BlueprintDailyReport[]): AggregationDistributionEntry[] {
    let withIssue = 0;
    let withoutIssue = 0;

    for (const report of reports) {
      const hasIssues = Boolean(report.issues && report.issues.trim().length > 0);
      if (hasIssues) {
        withIssue += 1;
      } else {
        withoutIssue += 1;
      }
    }

    return [
      { key: 'withIssues', label: '有問題記錄', value: withIssue },
      { key: 'withoutIssues', label: '無問題記錄', value: withoutIssue }
    ].filter(entry => entry.value > 0);
  }

  private buildLatestDailyReports(reports: BlueprintDailyReport[]): BlueprintDailyReportSnapshot[] {
    return [...reports]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
      .map(report => ({
        id: report.id,
        date: report.date,
        authorId: report.created_by,
        progressPercentage: report.progress_percentage ?? null,
        weather: report.weather ?? null,
        hasIssues: Boolean(report.issues && report.issues.trim().length > 0)
      }));
  }

  private enrichDailyReportAggregation(
    aggregation: BlueprintDailyReportAggregation | undefined,
    members: BlueprintMemberWithUser[]
  ): BlueprintDailyReportAggregation | undefined {
    if (!aggregation) {
      return undefined;
    }

    if (!members.length) {
      return aggregation;
    }

    const memberMap = new Map<string, string>();
    for (const member of members) {
      const name = member.user?.display_name || member.user?.email || member.user_id;
      memberMap.set(member.user_id, name);
    }

    const participantDistribution = aggregation.participantDistribution.map(entry => ({
      ...entry,
      label: memberMap.get(entry.key) ?? entry.label ?? entry.key
    }));

    return {
      ...aggregation,
      participantDistribution
    };
  }

  private buildDailyReportParticipantDistribution(reports: BlueprintDailyReport[]): AggregationDistributionEntry[] {
    const map = new Map<string, number>();

    for (const report of reports) {
      for (const participant of report.participants ?? []) {
        const key = participant.trim();
        if (!key) continue;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }

    return Array.from(map.entries())
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  private async buildQualityAggregation(blueprintId: string): Promise<BlueprintQualityAggregation> {
    const { data, error } = await this.qualityService.getQualityChecks(blueprintId);

    if (error) {
      this.logError('載入品質檢查失敗', 'BlueprintAggregationService.buildQualityAggregation', error, { blueprintId });
      const taskSnapshots: BlueprintQualityTaskSnapshot[] = [];
      return {
        scope: 'blueprint',
        summary: this.emptyQualitySummary(),
        alerts: [],
        trend: [],
        tasks: taskSnapshots
      };
    }

    const checks = data ?? [];
    const summary = this.computeQualitySummary(checks);
    const alerts = this.buildQualityAlerts(summary);
    const trend = this.buildQualityTrend(checks);
    const taskSnapshots: BlueprintQualityTaskSnapshot[] = [];

    return {
      scope: 'blueprint',
      summary,
      alerts,
      trend,
      tasks: taskSnapshots
    };
  }

  private emptyQualitySummary(): BlueprintQualitySummary {
    return {
      standardsCovered: 0,
      standardsTotal: 0,
      inspectionsCompleted: 0,
      inspectionsPlanned: 0,
      firstPassYield: 0,
      openNcr: 0,
      closeRate: 0
    };
  }

  private computeQualitySummary(checks: BlueprintQualityCheckWithUsers[]): BlueprintQualitySummary {
    if (!checks.length) {
      return this.emptyQualitySummary();
    }

    let passed = 0;
    let failed = 0;
    let needsImprovement = 0;

    for (const check of checks) {
      switch (check.status) {
        case 'passed':
          passed += 1;
          break;
        case 'failed':
          failed += 1;
          break;
        case 'needs-improvement':
          needsImprovement += 1;
          break;
        default:
          break;
      }
    }

    const completed = passed + failed + needsImprovement;
    const planned = checks.length;
    const firstPassYield = completed > 0 ? (passed / completed) * 100 : 0;
    const closeRate = planned > 0 ? (passed / planned) * 100 : 0;
    const openNcr = failed + needsImprovement;

    return {
      standardsCovered: passed,
      standardsTotal: planned,
      inspectionsCompleted: completed,
      inspectionsPlanned: planned,
      firstPassYield,
      openNcr,
      closeRate
    };
  }

  private buildQualityAlerts(summary: BlueprintQualitySummary): BlueprintQualityAlert[] {
    const alerts: BlueprintQualityAlert[] = [];

    if (summary.firstPassYield < 95 && summary.inspectionsCompleted > 0) {
      alerts.push({
        id: 'quality-fpy',
        type: 'inspection',
        severity: 'warning',
        message: `一次通過率下降至 ${summary.firstPassYield.toFixed(1)}%`,
        relatedTaskIds: []
      });
    }

    if (summary.openNcr > 0) {
      alerts.push({
        id: 'quality-ncr',
        type: 'ncr',
        severity: summary.openNcr > 5 ? 'critical' : 'info',
        message: `目前有 ${summary.openNcr} 筆開放 NCR`,
        relatedTaskIds: []
      });
    }

    return alerts;
  }

  private buildQualityTrend(checks: BlueprintQualityCheckWithUsers[]): BlueprintQualityTrendPoint[] {
    if (!checks.length) {
      return [];
    }

    const bucket = new Map<string, { inspections: number; passed: number; ncr: number }>();

    for (const check of checks) {
      const key = this.toYearMonth(check.check_date ?? check.created_at);
      const entry = bucket.get(key) ?? { inspections: 0, passed: 0, ncr: 0 };
      entry.inspections += 1;
      if (check.status === 'passed') {
        entry.passed += 1;
      }
      if (check.status === 'failed' || check.status === 'needs-improvement') {
        entry.ncr += 1;
      }
      bucket.set(key, entry);
    }

    return Array.from(bucket.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({
        label,
        inspections: value.inspections,
        firstPassYield: value.inspections > 0 ? (value.passed / value.inspections) * 100 : 0,
        ncr: value.ncr
      }));
  }

  private async buildActivityAggregation(blueprintId: string): Promise<BlueprintActivityAggregation> {
    interface ActivityRow {
      id: string;
      blueprint_id: string;
      type: BlueprintActivityType;
      action: string;
      description: string;
      user_id: string;
      related_id: string | null;
      created_at: string;
      user:
        | {
            display_name: string | null;
            email: string | null;
            avatar_url: string | null;
          }
        | Array<{
            display_name: string | null;
            email: string | null;
            avatar_url: string | null;
          }>
        | null;
    }

    const { data, error } = await this.supabase.client
      .from('blueprint_activities')
      .select(
        `
        id,
        blueprint_id,
        type,
        action,
        description,
        user_id,
        related_id,
        created_at,
        user:users(display_name, email, avatar_url)
      `
      )
      .eq('blueprint_id', blueprintId)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) {
      this.logError('載入活動記錄失敗', 'BlueprintAggregationService.buildActivityAggregation', error, { blueprintId });
      return {
        totals: {
          total: 0,
          uniqueUsers: 0,
          since: null
        },
        byType: [],
        byUser: [],
        timeline: [],
        recent: []
      };
    }

    const rows = (data ?? []) as ActivityRow[];
    const recent = rows.map(row => this.normalizeActivityRow(row));

    const totals: BlueprintActivityTotals = {
      total: recent.length,
      uniqueUsers: new Set(recent.map(item => item.userId)).size,
      since: recent.length ? (recent[recent.length - 1]?.createdAt ?? null) : null
    };

    const byTypeMap = new Map<BlueprintActivityType, number>();
    const byUserMap = new Map<string, { name: string; count: number }>();
    const timelineMap = new Map<string, number>();

    for (const item of recent) {
      byTypeMap.set(item.type, (byTypeMap.get(item.type) ?? 0) + 1);

      const currentUser = byUserMap.get(item.userId) ?? { name: item.userName, count: 0 };
      currentUser.name = item.userName;
      currentUser.count += 1;
      byUserMap.set(item.userId, currentUser);

      const dateKey = item.createdAt.substring(0, 10);
      timelineMap.set(dateKey, (timelineMap.get(dateKey) ?? 0) + 1);
    }

    const byType = Array.from(byTypeMap.entries()).map(([key, value]) => ({
      key,
      label: this.translateActivityType(key),
      value
    }));

    const byUser = Array.from(byUserMap.entries())
      .map(([userId, { name, count }]) => ({ userId, userName: name, count }))
      .sort((a, b) => b.count - a.count);

    const timeline = Array.from(timelineMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));

    return {
      totals,
      byType,
      byUser,
      timeline,
      recent
    };
  }

  private normalizeActivityRow(row: {
    id: string;
    blueprint_id: string;
    type: BlueprintActivityType;
    action: string;
    description: string;
    user_id: string;
    related_id: string | null;
    created_at: string;
    user:
      | { display_name: string | null; email: string | null; avatar_url: string | null }
      | Array<{ display_name: string | null; email: string | null; avatar_url: string | null }>
      | null;
  }): BlueprintActivityListItem {
    const user = Array.isArray(row.user) ? (row.user[0] ?? null) : row.user;
    const userName = user?.display_name || user?.email || '未知用戶';
    return {
      id: row.id,
      blueprintId: row.blueprint_id,
      type: row.type,
      action: row.action,
      description: row.description,
      userId: row.user_id,
      userName,
      userAvatar: user?.avatar_url ?? null,
      relatedId: row.related_id,
      createdAt: row.created_at
    };
  }

  private translateActivityType(type: BlueprintActivityType): string {
    const labelMap: Record<BlueprintActivityType, string> = {
      blueprint: '藍圖',
      task: '任務',
      milestone: '里程碑',
      document: '文件',
      member: '成員',
      progress: '進度',
      comment: '評論',
      report: '報告',
      issue: '議題',
      discussion: '討論',
      quality: '品質'
    };
    return labelMap[type] ?? type;
  }

  private async buildDocumentAggregation(blueprintId: string): Promise<BlueprintDocumentAggregation> {
    type DocumentRow = BlueprintDocument;

    const { data, error } = await this.supabase.client.from('blueprint_documents').select('*').eq('blueprint_id', blueprintId);

    if (error) {
      this.logError('載入文件列表失敗', 'BlueprintAggregationService.buildDocumentAggregation', error, { blueprintId });
      return this.emptyDocumentAggregation();
    }

    const documents = (data ?? []) as DocumentRow[];

    if (!documents.length) {
      return this.emptyDocumentAggregation();
    }

    const totals = this.computeDocumentTotals(documents);
    const byType = this.buildDocumentTypeDistribution(documents);
    const byDirectory = this.buildDocumentDirectoryDistribution(documents);
    const classification = this.buildDocumentClassificationAggregation(documents);
    const recent = this.buildRecentDocuments(documents);

    return {
      totals,
      byType,
      byDirectory,
      classification,
      recent
    };
  }

  private emptyDocumentAggregation(): BlueprintDocumentAggregation {
    return {
      totals: {
        total: 0,
        files: 0,
        directories: 0,
        storageSize: 0,
        lastUpdatedAt: null
      },
      byType: [],
      byDirectory: [],
      classification: {
        discipline: [],
        phase: [],
        package: []
      },
      recent: []
    };
  }

  private computeDocumentTotals(documents: BlueprintDocument[]): BlueprintDocumentTotals {
    let fileCount = 0;
    let directoryCount = 0;
    let totalSize = 0;
    let lastUpdatedAt: string | null = null;

    for (const doc of documents) {
      if (doc.type === 'file') {
        fileCount += 1;
        totalSize += doc.size ?? 0;
      } else {
        directoryCount += 1;
      }

      if (!lastUpdatedAt || (doc.updated_at && doc.updated_at > lastUpdatedAt)) {
        lastUpdatedAt = doc.updated_at;
      }
    }

    return {
      total: documents.length,
      files: fileCount,
      directories: directoryCount,
      storageSize: totalSize,
      lastUpdatedAt
    };
  }

  private buildDocumentTypeDistribution(documents: BlueprintDocument[]): AggregationDistributionEntry[] {
    const map = new Map<string, { label: string; value: number }>();

    for (const doc of documents) {
      const key = doc.type;
      const label = doc.type === 'file' ? '文件' : '目錄';
      const entry = map.get(key) ?? { label, value: 0 };
      entry.value += 1;
      map.set(key, entry);
    }

    return Array.from(map.entries()).map(([key, entry]) => ({ key, label: entry.label, value: entry.value }));
  }

  private buildDocumentDirectoryDistribution(documents: BlueprintDocument[]): BlueprintDocumentDirectoryEntry[] {
    const map = new Map<string | null, number>();
    const docMap = new Map<string, BlueprintDocument>();
    documents.forEach(doc => docMap.set(doc.id, doc));

    for (const doc of documents) {
      const parentId = doc.parent_id ?? null;
      map.set(parentId, (map.get(parentId) ?? 0) + 1);
    }

    const toPath = (dirId: string | null): string => {
      if (!dirId) {
        return '/';
      }
      const dir = docMap.get(dirId);
      return dir?.path ?? '/';
    };

    return Array.from(map.entries())
      .map<BlueprintDocumentDirectoryEntry>(([directoryId, count]) => ({
        directoryId,
        directoryPath: toPath(directoryId),
        count
      }))
      .sort((a, b) => b.count - a.count);
  }

  private buildDocumentClassificationAggregation(documents: BlueprintDocument[]): BlueprintDocumentClassificationAggregation {
    return {
      discipline: this.buildDocumentClassificationDistribution(documents, doc => doc.discipline, '未設定專業'),
      phase: this.buildDocumentClassificationDistribution(documents, doc => doc.phase, '未設定階段'),
      package: this.buildDocumentClassificationDistribution(documents, doc => doc.package, '未設定工作包')
    };
  }

  private buildDocumentClassificationDistribution(
    documents: BlueprintDocument[],
    extractor: (doc: BlueprintDocument) => string | null | undefined,
    emptyLabel: string
  ): AggregationDistributionEntry[] {
    const counter = new Map<string, number>();

    for (const doc of documents) {
      if (doc.type !== 'file') {
        continue;
      }
      const key = this.normalizeClassificationValue(extractor(doc));
      counter.set(key, (counter.get(key) ?? 0) + 1);
    }

    return Array.from(counter.entries())
      .map<AggregationDistributionEntry>(([key, value]) => ({
        key,
        label: key === '__EMPTY__' ? emptyLabel : key,
        value
      }))
      .sort((a, b) => b.value - a.value);
  }

  private buildRecentDocuments(documents: BlueprintDocument[]): BlueprintDocumentListItem[] {
    return documents
      .filter(doc => doc.type === 'file')
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 5)
      .map(doc => ({
        id: doc.id,
        blueprintId: doc.blueprint_id,
        name: doc.name,
        path: doc.path,
        type: doc.type,
        size: doc.size ?? null,
        currentVersion: doc.current_version,
        discipline: doc.discipline ?? null,
        phase: doc.phase ?? null,
        package: doc.package ?? null,
        updatedAt: doc.updated_at
      }));
  }

  private normalizeClassificationValue(value: string | null | undefined): string {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : '__EMPTY__';
  }

  private logError(message: string, source: string, error: unknown, metadata?: Record<string, unknown>): void {
    const details = error instanceof Error ? error.message : error instanceof HttpErrorResponse ? error.message : String(error);
    this.errorService.addError({
      type: 'unknown',
      severity: 'error',
      message,
      details,
      source,
      retryable: false,
      metadata
    });
  }

  private translateTaskStatus(status: BlueprintTaskStatus): string {
    switch (status) {
      case 'todo':
        return '待辦';
      case 'in-progress':
        return '進行中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  }

  private translateTaskPriority(priority: BlueprintTaskPriority): string {
    switch (priority) {
      case 'low':
        return '低';
      case 'medium':
        return '中';
      case 'high':
        return '高';
      case 'urgent':
        return '緊急';
      default:
        return priority;
    }
  }

  private toDateString(timestamp: string): string {
    return timestamp.split('T')[0];
  }

  private toYearMonth(timestamp: string | null | undefined): string {
    if (!timestamp) {
      return new Date().toISOString().slice(0, 7);
    }
    return timestamp.slice(0, 7);
  }

  private diffInDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000));
  }

  private addDays(date: string, delta: number): string {
    const current = new Date(date);
    current.setDate(current.getDate() + delta);
    return current.toISOString().split('T')[0];
  }
}
