/**
 * Task State Machine
 *
 * 定義任務狀態轉換規則和驗證邏輯
 * 實現 8 種狀態的有效轉換路徑
 *
 * 狀態流轉圖：
 * pending → assigned → in_progress → staging → in_qa → in_inspection → completed
 *                          ↓                      ↓           ↓
 *                      cancelled              cancelled   cancelled
 */

import { TaskStatus } from '@core';

/**
 * 狀態轉換結果
 */
export interface StateTransitionResult {
  /** 是否允許轉換 */
  allowed: boolean;
  /** 錯誤訊息（如果不允許） */
  reason?: string;
  /** 警告訊息（允許但需注意） */
  warning?: string;
}

/**
 * 狀態轉換規則映射
 * key: 當前狀態
 * value: 允許轉換到的下一個狀態列表
 */
const STATE_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.PENDING]: [TaskStatus.ASSIGNED, TaskStatus.CANCELLED],
  [TaskStatus.ASSIGNED]: [TaskStatus.IN_PROGRESS, TaskStatus.PENDING, TaskStatus.CANCELLED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.STAGING, TaskStatus.ASSIGNED, TaskStatus.CANCELLED],
  [TaskStatus.STAGING]: [TaskStatus.IN_QA, TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
  [TaskStatus.IN_QA]: [TaskStatus.IN_INSPECTION, TaskStatus.STAGING, TaskStatus.CANCELLED],
  [TaskStatus.IN_INSPECTION]: [TaskStatus.COMPLETED, TaskStatus.IN_QA, TaskStatus.CANCELLED],
  [TaskStatus.COMPLETED]: [], // 已完成不可轉換
  [TaskStatus.CANCELLED]: [] // 已取消不可轉換
};

/**
 * 檢查狀態轉換是否有效
 *
 * @param fromStatus 當前狀態
 * @param toStatus 目標狀態
 * @returns 轉換結果
 */
export function validateStateTransition(fromStatus: TaskStatus, toStatus: TaskStatus): StateTransitionResult {
  // 相同狀態不需要轉換
  if (fromStatus === toStatus) {
    return {
      allowed: true,
      warning: '狀態未改變'
    };
  }

  // 檢查轉換是否在允許列表中
  const allowedTransitions = STATE_TRANSITIONS[fromStatus] || [];
  const isAllowed = allowedTransitions.includes(toStatus);

  if (!isAllowed) {
    return {
      allowed: false,
      reason: `不允許從 ${fromStatus} 轉換到 ${toStatus}。允許的轉換：${allowedTransitions.join(', ')}`
    };
  }

  // 特殊情況警告
  let warning: string | undefined;

  // 回退警告
  if (isRollbackTransition(fromStatus, toStatus)) {
    warning = '這是回退操作，請確認是否正確';
  }

  // 跳過階段警告
  if (isSkippingStages(fromStatus, toStatus)) {
    warning = '跳過了某些階段，請確認流程正確';
  }

  return {
    allowed: true,
    warning
  };
}

/**
 * 檢查是否為回退操作
 */
function isRollbackTransition(fromStatus: TaskStatus, toStatus: TaskStatus): boolean {
  const progressOrder = [
    TaskStatus.PENDING,
    TaskStatus.ASSIGNED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.STAGING,
    TaskStatus.IN_QA,
    TaskStatus.IN_INSPECTION,
    TaskStatus.COMPLETED
  ];

  const fromIndex = progressOrder.indexOf(fromStatus);
  const toIndex = progressOrder.indexOf(toStatus);

  return fromIndex > toIndex && fromIndex !== -1 && toIndex !== -1;
}

/**
 * 檢查是否跳過了階段
 */
function isSkippingStages(fromStatus: TaskStatus, toStatus: TaskStatus): boolean {
  const progressOrder = [
    TaskStatus.PENDING,
    TaskStatus.ASSIGNED,
    TaskStatus.IN_PROGRESS,
    TaskStatus.STAGING,
    TaskStatus.IN_QA,
    TaskStatus.IN_INSPECTION,
    TaskStatus.COMPLETED
  ];

  const fromIndex = progressOrder.indexOf(fromStatus);
  const toIndex = progressOrder.indexOf(toStatus);

  // 如果跳過超過1個階段，視為跳過
  return toIndex - fromIndex > 1 && fromIndex !== -1 && toIndex !== -1;
}

/**
 * 獲取狀態的所有允許轉換
 */
export function getAllowedTransitions(status: TaskStatus): TaskStatus[] {
  return STATE_TRANSITIONS[status] || [];
}

/**
 * 獲取下一個推薦狀態（正常流程）
 */
export function getNextStatus(currentStatus: TaskStatus): TaskStatus | null {
  const statusOrder: Record<TaskStatus, TaskStatus | null> = {
    [TaskStatus.PENDING]: TaskStatus.ASSIGNED,
    [TaskStatus.ASSIGNED]: TaskStatus.IN_PROGRESS,
    [TaskStatus.IN_PROGRESS]: TaskStatus.STAGING,
    [TaskStatus.STAGING]: TaskStatus.IN_QA,
    [TaskStatus.IN_QA]: TaskStatus.IN_INSPECTION,
    [TaskStatus.IN_INSPECTION]: TaskStatus.COMPLETED,
    [TaskStatus.COMPLETED]: null,
    [TaskStatus.CANCELLED]: null
  };

  return statusOrder[currentStatus];
}

/**
 * 檢查狀態是否為終止狀態
 */
export function isFinalStatus(status: TaskStatus): boolean {
  return status === TaskStatus.COMPLETED || status === TaskStatus.CANCELLED;
}

/**
 * 檢查狀態是否可以撤回（處於 staging 階段）
 */
export function isWithdrawableStatus(status: TaskStatus): boolean {
  return status === TaskStatus.STAGING;
}
