/**
 * Task Quality Model
 *
 * 任務品質維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：H. 品質維度
 *
 * 包含：
 * - 品質標準與管制（Quality Standards）：標準規範、品質目標、檢驗計畫
 * - 檢驗記錄（Inspections）
 *
 * @see @ETMS_DESIGN_SPEC.md H. 品質維度
 */

export type QualityTargetStatus = 'achieved' | 'at-risk' | 'not-achieved';

export type InspectionType = 'self' | 'third-party' | 'client' | 'regulatory';

export type InspectionStage = 'pre' | 'during' | 'post';

export type InspectionResult = 'pass' | 'fail' | 'conditional';

export type QualityCorrectiveActionStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

export type QualityNonConformanceStatus = 'open' | 'investigating' | 'closed';

export interface QualityTarget {
  id?: string;
  metric: string;
  target: number;
  actual: number;
  unit: string;
  status: QualityTargetStatus;
}

export interface QualityInspectionPlan {
  id?: string;
  type: InspectionType;
  stage: InspectionStage;
  frequency: string;
  criteria: string[];
  tolerance?: string;
  sampleSize?: number;
  inspectorId?: string | null;
}

export interface QualityCorrectiveAction {
  id?: string;
  action: string;
  responsible?: string | null;
  status: QualityCorrectiveActionStatus;
  dueDate?: Date | null;
  completedDate?: Date | null;
  notes?: string | null;
}

export interface QualityNonConformance {
  id?: string;
  issue: string;
  description?: string | null;
  status: QualityNonConformanceStatus;
  raisedAt: Date;
  resolvedAt?: Date | null;
  relatedSpec?: string | null;
}

export interface QualityInspectionFinding {
  id?: string;
  description: string;
  severity?: string | null;
  status?: string | null;
}

export interface QualityInspection {
  id: string;
  taskId: string;
  type: InspectionType | string;
  date: Date;
  inspectorId?: string | null;
  result: InspectionResult | string;
  status: string;
  score?: number | null;
  findings?: QualityInspectionFinding[];
  attachments?: string[];
  notes?: string | null;
  reportNumber?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface TaskQualitySummary {
  taskId: string;
  standards: string[];
  specifications: string[];
  codes: string[];
  targets: QualityTarget[];
  inspectionPlan: QualityInspectionPlan[];
  nonConformances: QualityNonConformance[];
  correctiveActions: QualityCorrectiveAction[];
  metadata?: Record<string, unknown> | null;
  updatedAt: Date;
  updatedBy?: string | null;
}

export interface TaskQuality {
  summary?: TaskQualitySummary;
  inspections?: QualityInspection[];
}
