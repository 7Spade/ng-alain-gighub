import type { BlueprintMilestone, Blueprint } from '@shared';
import type { BlueprintTaskPriority, BlueprintTaskStatus } from '@shared/models/blueprint-aggregation.model';

export interface OverviewMilestoneStats {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
  cancelled: number;
  averageProgress: number;
  successPercent: number;
  upcoming: BlueprintMilestone[];
}

export interface OverviewTaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  completionRate: number;
  activeRate: number;
  recent: OverviewTaskRecentItem[];
}

export interface OverviewMemberStats {
  total: number;
  owners: number;
  managers: number;
}

export interface OverviewProgressSummary {
  percent: number;
  status: Blueprint['status'];
  lastUpdatedAt: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  hasDates: boolean;
  health: {
    status: 'success' | 'warning' | 'processing' | 'error';
    label: string;
  };
}

export interface OverviewTaskSegments {
  completed: number;
  active: number;
}

export interface OverviewTaskRecentItem {
  id: string;
  name: string;
  description: string | null;
  status: BlueprintTaskStatus;
  priority: BlueprintTaskPriority | null;
  createdAt: string;
  updatedAt: string;
}
