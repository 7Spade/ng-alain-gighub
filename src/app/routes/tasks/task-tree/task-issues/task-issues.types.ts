/**
 * Task Issues Integration Types
 * Phase 7.1: Issues integration with task tree
 * 
 * Provides type definitions for linking issues to tasks,
 * displaying issue status, and creating issues from tasks.
 */

export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskIssue {
  id: string;
  task_id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  created_by: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  assigned_to?: string;
}

export interface IssueCreateInput {
  task_id: string;
  title: string;
  description: string;
  priority: IssuePriority;
}

export interface IssueUpdateInput {
  status?: IssueStatus;
  priority?: IssuePriority;
  assigned_to?: string;
  description?: string;
}

export interface IssueDisplayConfig {
  showStatusBadge: boolean;
  showPriority: boolean;
  showAssignee: boolean;
  maxDisplayCount: number;
}

// Helper functions
export function getIssueStatusColor(status: IssueStatus): string {
  const colorMap: Record<IssueStatus, string> = {
    open: 'red',
    in_progress: 'blue',
    resolved: 'green',
    closed: 'default',
    wont_fix: 'orange'
  };
  return colorMap[status] || 'default';
}

export function getIssuePriorityIcon(priority: IssuePriority): string {
  const iconMap: Record<IssuePriority, string> = {
    low: 'arrow-down',
    medium: 'minus',
    high: 'arrow-up',
    critical: 'exclamation-circle'
  };
  return iconMap[priority] || 'minus';
}

export function getIssuePriorityColor(priority: IssuePriority): string {
  const colorMap: Record<IssuePriority, string> = {
    low: 'green',
    medium: 'blue',
    high: 'orange',
    critical: 'red'
  };
  return colorMap[priority] || 'blue';
}
