/**
 * Task Change Model
 *
 * 任務變更維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：M. 變更維度
 *
 * 包含：
 * - 變更管理（Change Management）：變更請求、影響分析、審核流程
 *
 * @see @ETMS_DESIGN_SPEC.md M. 變更維度
 */

import type { CostBreakdown } from '../cost/task-cost.model';

/**
 * 變更類型
 * 定義變更的類型
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - type
 */
export type ChangeType =
  | 'scope' // 範圍變更
  | 'schedule' // 時程變更
  | 'cost' // 成本變更
  | 'quality' // 品質變更
  | 'resource' // 資源變更
  | 'design' // 設計變更
  | 'specification'; // 規格變更

/**
 * 變更狀態
 * 定義變更的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - status
 * @note 對齊數據庫 blueprint_task_changes.status CHECK 約束
 */
export type ChangeStatus =
  | 'draft' // 草稿
  | 'submitted' // 已提交
  | 'under-review' // 審查中
  | 'approved' // 已批准
  | 'rejected' // 已拒絕
  | 'implemented' // 已實施
  | 'cancelled'; // 已取消

/**
 * 變更優先級
 * 定義變更的優先級
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - priority
 */
export type ChangePriority = 'low' | 'normal' | 'high' | 'critical';

/**
 * 範圍影響接口
 * 定義變更對範圍的影響
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact.scope
 */
export interface ScopeImpact {
  /** 影響描述 */
  description: string;

  /** 新增項目陣列 */
  added: string[];

  /** 移除項目陣列 */
  removed: string[];

  /** 修改項目陣列 */
  modified: string[];
}

/**
 * 受影響任務接口
 * 定義變更對任務的影響
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact.schedule.affectedTasks
 */
export interface AffectedTask {
  /** 任務 ID */
  taskId: string;

  /** 原始開始日期 */
  originalStart: Date;

  /** 新開始日期 */
  newStart: Date;

  /** 原始結束日期 */
  originalEnd: Date;

  /** 新結束日期 */
  newEnd: Date;

  /** 延遲天數 */
  delayDays: number;
}

/**
 * 時程影響接口
 * 定義變更對時程的影響
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact.schedule
 */
export interface ScheduleImpact {
  /** 受影響任務陣列 */
  affectedTasks: AffectedTask[];

  /** 是否影響關鍵路徑 */
  criticalPathAffected: boolean;

  /** 總延遲天數 */
  totalDelayDays: number;
}

/**
 * 成本分項接口
 * 定義變更對成本分項的影響
 *
 * 注意：此接口與 TaskCost 中的 CostBreakdown 相同，直接重用
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact.cost.breakdown
 */

/**
 * 成本影響接口
 * 定義變更對成本的影響
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact.cost
 */
export interface CostImpact {
  /** 額外成本 */
  additionalCost: number;

  /** 節省成本 */
  savings: number;

  /** 淨成本 */
  netCost: number;

  /** 成本分項 */
  breakdown: CostBreakdown;
}

/**
 * 變更影響接口
 * 定義變更的完整影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - impact
 */
export interface ChangeImpact {
  /** 範圍影響 */
  scope: ScopeImpact;

  /** 時程影響 */
  schedule: ScheduleImpact;

  /** 成本影響 */
  cost: CostImpact;

  /** 品質影響描述（可選） */
  quality?: string;

  /** 資源影響描述（可選） */
  resource?: string;
}

/**
 * 審核記錄接口
 * 定義變更的審核記錄
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management) - reviews
 */
export interface ChangeReview {
  /** 審核者 User ID */
  reviewer: string;

  /** 審核日期 */
  reviewDate: Date;

  /** 審核意見 */
  comments: string;

  /** 審核結果 */
  decision: 'approve' | 'reject' | 'conditional' | 'request-info';

  /** 條件（可選） */
  conditions?: string[];
}

/**
 * 變更請求接口
 * 定義單個變更請求
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management)
 */
export interface ChangeRequest {
  /** 變更 ID */
  id: string;

  /** 變更編號，如 "CO-001", "VR-002" */
  changeNumber: string;

  /** 變更類型 */
  type: ChangeType;

  /** 變更標題 */
  title: string;

  /** 變更描述 */
  description: string;

  /** 變更原因 */
  reason: string;

  /** 變更理由 */
  justification: string;

  /** 發起者 User ID */
  initiator: string;

  /** 發起者組織 */
  initiatorOrganization: string;

  /** 發起日期 */
  initiatedDate: Date;

  /** 影響分析 */
  impact: ChangeImpact;

  /** 優先級 */
  priority: ChangePriority;

  /** 變更狀態 */
  status: ChangeStatus;

  /** 審核記錄陣列 */
  reviews: ChangeReview[];

  /** 批准者 User ID（可選） */
  approver?: string;

  /** 批准日期（可選） */
  approvedDate?: Date;

  /** 拒絕原因（可選） */
  rejectionReason?: string;

  /** 實施日期（可選） */
  implementedDate?: Date;

  /** 實施者 User ID（可選） */
  implementedBy?: string;

  /** 相關文件陣列（可選） */
  relatedDocuments?: string[];
}

/**
 * 變更管理接口
 * 定義任務的變更管理資訊，包含所有變更請求
 *
 * @see @ETMS_DESIGN_SPEC.md M.25 變更管理 (Change Management)
 */
export interface ChangeManagement {
  /** 變更陣列 */
  changes: ChangeRequest[];
}

/**
 * 任務變更維度接口
 * 組合變更管理
 *
 * 此接口代表任務的完整變更資訊，用於變更管理和影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md M. 變更維度
 */
export interface TaskChange {
  /** 變更管理資訊 */
  changes?: ChangeManagement;
}
