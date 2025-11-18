/**
 * Task Status Configuration
 *
 * Defines the status state machine for tasks:
 * - Status metadata (labels, colors, icons)
 * - Allowed state transitions
 * - Validation functions
 *
 * Implements Phase 3 (Task 3.1.1) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 */

export interface TaskStatusConfig {
  value: string;
  label: string;
  color: string;
  icon?: string;
  description?: string;
  allowedTransitions: string[];
}

/**
 * Task status configuration map
 *
 * Status flow:
 * pending → in_progress → staging → qc → acceptance → completed
 *                 ↓
 *              cancelled/issue
 */
export const TASK_STATUS_CONFIGS: Record<string, TaskStatusConfig> = {
  pending: {
    value: 'pending',
    label: '待處理',
    color: 'default',
    icon: 'clock-circle',
    description: '任務等待開始執行',
    allowedTransitions: ['in_progress', 'cancelled']
  },
  in_progress: {
    value: 'in_progress',
    label: '進行中',
    color: 'processing',
    icon: 'sync',
    description: '任務正在執行中',
    allowedTransitions: ['staging', 'pending', 'cancelled', 'issue']
  },
  staging: {
    value: 'staging',
    label: '暫存',
    color: 'warning',
    icon: 'pause-circle',
    description: '任務暫存，等待確認（48小時內可回滾）',
    allowedTransitions: ['in_progress', 'qc', 'issue']
  },
  qc: {
    value: 'qc',
    label: '品質驗收',
    color: 'cyan',
    icon: 'check-circle',
    description: '品質管理人員驗收中',
    allowedTransitions: ['staging', 'acceptance', 'issue']
  },
  acceptance: {
    value: 'acceptance',
    label: '業主驗收',
    color: 'blue',
    icon: 'audit',
    description: '業主最終驗收中',
    allowedTransitions: ['qc', 'completed', 'issue']
  },
  completed: {
    value: 'completed',
    label: '已完成',
    color: 'success',
    icon: 'check',
    description: '任務已完成並通過所有驗收',
    allowedTransitions: [] // Terminal state
  },
  issue: {
    value: 'issue',
    label: '有問題',
    color: 'error',
    icon: 'warning',
    description: '任務執行遇到問題，需要處理',
    allowedTransitions: ['in_progress', 'cancelled']
  },
  cancelled: {
    value: 'cancelled',
    label: '已取消',
    color: 'default',
    icon: 'close-circle',
    description: '任務已被取消',
    allowedTransitions: [] // Terminal state
  }
};

/**
 * Get status configuration by value
 * Returns default config if status not found
 */
export function getStatusConfig(status: string): TaskStatusConfig {
  return TASK_STATUS_CONFIGS[status] || TASK_STATUS_CONFIGS['pending'];
}

/**
 * Check if status transition is allowed
 *
 * @param from Current status
 * @param to Target status
 * @returns true if transition is allowed
 */
export function isStatusTransitionAllowed(from: string, to: string): boolean {
  const config = TASK_STATUS_CONFIGS[from];
  return config ? config.allowedTransitions.includes(to) : false;
}

/**
 * Get all allowed next statuses for a given status
 *
 * @param currentStatus Current status
 * @returns Array of allowed next status configurations
 */
export function getAllowedNextStatuses(currentStatus: string): TaskStatusConfig[] {
  const config = TASK_STATUS_CONFIGS[currentStatus];
  if (!config) return [];

  return config.allowedTransitions.map(status => TASK_STATUS_CONFIGS[status]).filter(Boolean);
}

/**
 * Get all status configurations as array
 *
 * @returns Array of all status configurations
 */
export function getAllStatusConfigs(): TaskStatusConfig[] {
  return Object.values(TASK_STATUS_CONFIGS);
}

/**
 * Validate status transition with detailed error message
 *
 * @param from Current status
 * @param to Target status
 * @returns Error message if invalid, null if valid
 */
export function validateStatusTransition(from: string, to: string): string | null {
  if (!TASK_STATUS_CONFIGS[from]) {
    return `無效的來源狀態：${from}`;
  }

  if (!TASK_STATUS_CONFIGS[to]) {
    return `無效的目標狀態：${to}`;
  }

  if (!isStatusTransitionAllowed(from, to)) {
    const fromLabel = TASK_STATUS_CONFIGS[from].label;
    const toLabel = TASK_STATUS_CONFIGS[to].label;
    return `不允許從「${fromLabel}」變更為「${toLabel}」`;
  }

  return null;
}
