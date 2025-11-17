/**
 * Task Time Model
 *
 * 任務時間維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：B. 時間維度
 *
 * 包含：
 * - 計畫時間（Planned Time）：計畫開始/結束、基準計畫、目標日期
 * - 實際時間（Actual Time）：實際開始/結束、延遲分析、暫停記錄
 * - 時間彈性（Time Flexibility）：浮時、關鍵路徑、時間約束
 * - 時間約束（Time Constraint）：時間約束類型和日期
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */

/**
 * 時間約束類型
 * 定義任務的時間約束類型，用於排程邏輯
 *
 * @see @ETMS_DESIGN_SPEC.md B.6 時間彈性 (Time Flexibility) - TimeConstraint
 */
export type TimeConstraintType =
  | 'ASAP' // As Soon As Possible - 盡快開始
  | 'ALAP' // As Late As Possible - 盡晚開始
  | 'SNET' // Start No Earlier Than - 不早於開始
  | 'SNLT' // Start No Later Than - 不晚於開始
  | 'FNET' // Finish No Earlier Than - 不早於完成
  | 'FNLT' // Finish No Later Than - 不晚於完成
  | 'MFO' // Must Finish On - 必須在指定日期完成
  | 'MSO'; // Must Start On - 必須在指定日期開始

/**
 * 延遲類別
 * 定義延遲的分類，用於延遲分析
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time) - DelayCategory
 */
export type DelayCategory =
  | 'weather' // 天氣因素
  | 'material' // 材料因素
  | 'design' // 設計因素
  | 'coordination' // 協調因素
  | 'client' // 業主因素
  | 'other'; // 其他因素

/**
 * 延遲責任
 * 定義延遲的責任歸屬，用於責任分析
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time) - DelayResponsibility
 */
export type DelayResponsibility =
  | 'contractor' // 承包商
  | 'client' // 業主
  | 'designer' // 設計單位
  | 'force-majeure'; // 不可抗力

/**
 * 延遲影響
 * 定義延遲的影響程度，用於風險評估
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time) - DelayImpact
 */
export type DelayImpact =
  | 'none' // 無影響
  | 'low' // 低影響
  | 'medium' // 中影響
  | 'high' // 高影響
  | 'critical'; // 關鍵影響

/**
 * 暫停期間接口
 * 定義任務暫停的期間記錄
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time) - pausedPeriods
 */
export interface PausedPeriod {
  /** 暫停開始時間 */
  from: Date;

  /** 暫停結束時間 */
  to: Date;

  /** 暫停原因 */
  reason: string;

  /** 批准者 User ID */
  approvedBy: string;
}

/**
 * 時間調整記錄接口
 * 定義任務時間調整的歷史記錄
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time) - timeAdjustments
 */
export interface TimeAdjustment {
  /** 調整日期 */
  date: Date;

  /** 調整前開始時間 */
  oldStart: Date;

  /** 調整後開始時間 */
  newStart: Date;

  /** 調整前結束時間 */
  oldEnd: Date;

  /** 調整後結束時間 */
  newEnd: Date;

  /** 調整原因 */
  reason: string;

  /** 批准者 User ID */
  approvedBy: string;
}

/**
 * 計畫時間接口
 * 定義任務的計畫時間資訊，包含基準計畫、目標日期和合約日期
 *
 * @see @ETMS_DESIGN_SPEC.md B.4 計畫時間 (Planned Time)
 */
export interface PlannedTime {
  /** 計畫開始日期 */
  plannedStartDate: Date;

  /** 計畫結束日期 */
  plannedEndDate: Date;

  /** 計畫工作天數（排除假日） */
  plannedDuration: number;

  /** 預估工時（小時） */
  plannedWorkHours: number;

  /** 工作日曆 ID，關聯到工作日曆（定義假日） */
  workCalendarId?: string;

  /** 每週工作天數（預設 5） */
  workingDaysPerWeek?: number;

  /** 每日工時（預設 8） */
  workingHoursPerDay?: number;

  /** 基準開始日期（用於對比變更） */
  baselineStart?: Date;

  /** 基準結束日期 */
  baselineEnd?: Date;

  /** 基準持續時間 */
  baselineDuration?: number;

  /** 基準版本 */
  baselineVersion?: number;

  /** 基準建立日期 */
  baselineDate?: Date;

  /** 目標開始日期（業主要求） */
  targetStartDate?: Date;

  /** 目標結束日期 */
  targetEndDate?: Date;

  /** 合約開始日期 */
  contractStartDate?: Date;

  /** 合約結束日期 */
  contractEndDate?: Date;

  /** 合約里程碑日期陣列 */
  contractMilestones: Date[];
}

/**
 * 實際時間接口
 * 定義任務的實際執行時間資訊，包含實際開始/結束、延遲分析和暫停記錄
 *
 * @see @ETMS_DESIGN_SPEC.md B.5 實際時間 (Actual Time)
 */
export interface ActualTime {
  /** 實際開始日期（null 表示尚未開始） */
  actualStartDate: Date | null;

  /** 實際結束日期（null 表示尚未結束） */
  actualEndDate: Date | null;

  /** 實際天數 */
  actualDuration: number;

  /** 實際工時（小時） */
  actualWorkHours: number;

  /** 暫停期間記錄陣列 */
  pausedPeriods: PausedPeriod[];

  /** 總暫停天數 */
  totalPausedDays: number;

  /** 延遲天數（可為負數表示提前） */
  delayDays: number;

  /** 延遲原因 */
  delayReason?: string;

  /** 延遲類別 */
  delayCategory?: DelayCategory;

  /** 延遲責任 */
  delayResponsibility?: DelayResponsibility;

  /** 延遲影響 */
  delayImpact?: DelayImpact;

  /** 時間調整記錄陣列 */
  timeAdjustments: TimeAdjustment[];
}

/**
 * 時間約束接口
 * 定義任務的時間約束類型和日期
 *
 * @see @ETMS_DESIGN_SPEC.md B.6 時間彈性 (Time Flexibility) - constraint
 */
export interface TimeConstraint {
  /** 時間約束類型 */
  type: TimeConstraintType;

  /** 約束日期（根據類型可能為開始或結束日期） */
  date?: Date;
}

/**
 * 時間彈性接口
 * 定義任務的時間彈性資訊，包含 CPM 計算結果、浮時、關鍵路徑和時間約束
 *
 * @see @ETMS_DESIGN_SPEC.md B.6 時間彈性 (Time Flexibility)
 */
export interface TimeFlexibility {
  /** 最早開始日期 (ES - Earliest Start) */
  earliestStart: Date;

  /** 最晚開始日期 (LS - Latest Start) */
  latestStart: Date;

  /** 最早完成日期 (EF - Earliest Finish) */
  earliestFinish: Date;

  /** 最晚完成日期 (LF - Latest Finish) */
  latestFinish: Date;

  /** 總浮時 = LS - ES（不影響專案完成日期的延遲容忍度） */
  totalFloat: number;

  /** 自由浮時（不影響後續任務的延遲容忍度） */
  freeFloat: number;

  /** 是否在關鍵路徑上 */
  isCriticalPath: boolean;

  /** 關鍵性指數 0-1（1 表示完全在關鍵路徑上） */
  criticalityIndex: number;

  /** 緩衝天數 */
  bufferDays: number;

  /** 拖延係數（影響專案完成日的係數） */
  dragCoefficient: number;

  /** 時間約束（null 表示無約束） */
  constraint: TimeConstraint | null;
}

/**
 * 任務時間維度接口
 * 組合計畫時間、實際時間、時間彈性和時間約束
 *
 * 此接口代表任務的完整時間資訊，用於時間管理和關鍵路徑分析
 *
 * @see @ETMS_DESIGN_SPEC.md B. 時間維度
 */
export interface TaskTime {
  /** 計畫時間資訊 */
  planned?: PlannedTime;

  /** 實際時間資訊 */
  actual?: ActualTime;

  /** 時間彈性資訊（CPM 計算結果） */
  flexibility?: TimeFlexibility;

  /** 時間約束資訊（簡化版本，完整約束在 flexibility.constraint 中） */
  constraint?: TimeConstraint;
}

/**
 * 任務時程摘要（過渡期結構）
 *
 * 提供任務層快速顯示所需的精簡欄位，詳細排程資料將逐步上移至藍圖層服務。
 */
export type TaskDelayStatus = 'on-track' | 'at-risk' | 'delayed' | 'completed';

export interface TaskScheduleSummary {
  plannedStart?: Date | null;
  plannedEnd?: Date | null;
  actualStart?: Date | null;
  actualEnd?: Date | null;
  plannedDuration?: number | null;
  actualDuration?: number | null;
  progressPercentage: number;
  delayStatus: TaskDelayStatus;
  slackDays?: number | null;
  updatedAt: Date;
  updatedBy?: string;
}
