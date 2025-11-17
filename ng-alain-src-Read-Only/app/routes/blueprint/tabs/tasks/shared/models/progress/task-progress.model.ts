/**
 * Task Progress Model
 *
 * 任務進度維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：F. 進度維度
 *
 * 包含：
 * - 進度狀態（Progress State）：百分比、計算方式、狀態、趨勢分析
 * - 檢查點（Checkpoints）：檢查點清單、檢查結果
 *
 * @see @ETMS_DESIGN_SPEC.md F. 進度維度
 */

/**
 * 任務狀態枚舉
 * 定義任務的當前狀態
 *
 * @see @ETMS_DESIGN_SPEC.md F.16 進度狀態 (Progress State) - TaskStatus
 */
export enum TaskStatus {
  /** 未開始 */
  NOT_STARTED = 'not-started',
  /** 準備開始 */
  READY_TO_START = 'ready-to-start',
  /** 等待批准 */
  WAITING_APPROVAL = 'waiting-approval',
  /** 進行中 */
  IN_PROGRESS = 'in-progress',
  /** 已暫停 */
  PAUSED = 'paused',
  /** 已延遲 */
  DELAYED = 'delayed',
  /** 暫停中 */
  ON_HOLD = 'on-hold',
  /** 審查中 */
  UNDER_REVIEW = 'under-review',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 已驗證 */
  VERIFIED = 'verified',
  /** 已接受 */
  ACCEPTED = 'accepted',
  /** 已取消 */
  CANCELLED = 'cancelled'
}

/**
 * 進度計算方式
 * 定義進度的計算方法
 *
 * @see @ETMS_DESIGN_SPEC.md F.16 進度狀態 (Progress State) - calculationMethod
 */
export type CalculationMethod = 'quantity';

/**
 * 檢查點狀態
 * 定義檢查點的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints) - status
 */
export type CheckpointStatus =
  | 'pending' // 待檢查
  | 'in-progress' // 檢查中
  | 'completed' // 已完成
  | 'failed' // 失敗
  | 'skipped'; // 已跳過（例如豁免）

/**
 * 檢查結果
 * 定義檢查項目的結果
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints) - checklist.result
 */
export type CheckResult = 'pass' | 'fail' | 'n/a';

/**
 * 進度歷史記錄接口
 * 定義進度的歷史記錄
 *
 * @see @ETMS_DESIGN_SPEC.md F.16 進度狀態 (Progress State) - progressHistory
 */
export interface ProgressHistoryItem {
  /** 記錄日期 */
  date: Date;

  /** 進度百分比 */
  percentage: number;

  /** 任務狀態 */
  status: TaskStatus;

  /** 記錄者 User ID */
  recordedBy: string;

  /** 備註（可選） */
  notes?: string;
}

/**
 * 檢查項目接口
 * 定義檢查點中的單個檢查項目
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints) - checklist
 */
export interface CheckpointItem {
  /** 檢查項目名稱 */
  item: string;

  /** 是否必填 */
  required: boolean;

  /** 是否已檢查 */
  checked: boolean;

  /** 檢查者 User ID（可選） */
  checkedBy?: string;

  /** 檢查時間（可選） */
  checkedAt?: Date;

  /** 備註（可選） */
  notes?: string;

  /** 照片陣列（可選） */
  photos?: string[];

  /** 附件陣列（可選） */
  attachments?: string[];

  /** 檢查結果（可選） */
  result?: CheckResult;
}

/**
 * 檢查點簽名資訊
 * 定義檢查點簽名紀錄
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints) - signatures
 */
export interface CheckpointSignature {
  /** 簽名者 User ID */
  userId: string;

  /** 簽名者名稱 */
  userName: string;

  /** 角色（例如 inspector, approver, witness） */
  role: string;

  /** 簽名內容（Base64 或 URI） */
  signature: string;

  /** 簽名時間 */
  timestamp: Date;
}

/**
 * 檢查點接口
 * 定義單個檢查點
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints)
 */
export interface Checkpoint {
  /** 檢查點 ID */
  id: string;

  /** 任務 ID */
  taskId?: string;

  /** 檢查點名稱 */
  name: string;

  /** 檢查點描述 */
  description: string;

  /** 順序 */
  sequence: number;

  /** 前置檢查點 IDs（可選） */
  dependsOn?: string[];

  /** 檢查點狀態 */
  status: CheckpointStatus;

  /** 檢查清單 */
  checklist: CheckpointItem[];

  /** 檢查者 User ID（可選） */
  inspector?: string | null;

  /** 批准者 User ID（可選） */
  approver?: string | null;

  /** 見證者 User IDs（可選） */
  witnesses?: string[];

  /** 計畫日期（可選） */
  plannedDate?: Date | null;

  /** 實際日期（可選） */
  actualDate?: Date;

  /** 檢查耗時（小時，可選） */
  duration?: number | null;

  /** 檢查結果（可選） */
  result?: CheckResult;

  /** 檢查報告（可選） */
  report?: string;

  /** 附件陣列（可選） */
  attachments?: string[];

  /** 檢查發現（JSON，可選） */
  findings?: Record<string, unknown> | null;

  /** 缺陷記錄（JSON，可選） */
  defects?: Record<string, unknown> | null;

  /** 矯正措施（JSON，可選） */
  correctiveActions?: Record<string, unknown> | null;

  /** 簽名紀錄（可選） */
  signatures?: CheckpointSignature[];

  /** 建立時間（可選） */
  createdAt?: Date;

  /** 更新時間（可選） */
  updatedAt?: Date;

  /** 建立者 User ID（可選） */
  createdBy?: string | null;
}

/**
 * 進度狀態接口
 * 定義任務的進度狀態資訊，包含百分比、計算方式、狀態和趨勢分析
 *
 * @see @ETMS_DESIGN_SPEC.md F.16 進度狀態 (Progress State)
 */
export interface QuantityProgressSnapshot {
  /** 單位，如「孔」「次」「項目」 */
  unit: string;

  /** 計畫數量（必須 ≥ 1） */
  planned: number;

  /** 已安裝/已完成數量 */
  installed: number;

  /** 已使用數量（沒有 installed 時採用此值） */
  used: number;

  /** 快照時間 */
  lastUpdatedAt: Date;
}

export interface ProgressState {
  /** 進度資訊 */
  progress: {
    /** 進度百分比（0-100） */
    percentage: number;

    /** 計算方式（固定 quantity） */
    calculationMethod: CalculationMethod;

    /** 數量進度快照 */
    quantity: QuantityProgressSnapshot;

    /** 當前狀態 */
    status: TaskStatus;

    /** 先前狀態（可選） */
    previousStatus?: TaskStatus;

    /** 狀態變更時間（可選） */
    statusChangedAt?: Date;

    /** 狀態變更者 User ID（可選） */
    statusChangedBy?: string;

    /** 歷史進度記錄陣列 */
    progressHistory: ProgressHistoryItem[];

    /** 完成標準陣列 */
    completionCriteria: string[];

    /** 驗證方法 */
    verificationMethod: string;
  };
}

/**
 * 檢查點集合接口
 * 定義任務的所有檢查點
 *
 * @see @ETMS_DESIGN_SPEC.md F.17 檢查點 (Checkpoints)
 */
export interface TaskCheckpoints {
  /** 檢查點陣列 */
  checkpoints: Checkpoint[];
}

/**
 * 任務進度維度接口
 * 組合進度狀態和檢查點
 *
 * 此接口代表任務的完整進度資訊，用於進度追蹤和驗證
 *
 * @see @ETMS_DESIGN_SPEC.md F. 進度維度
 */
export interface TaskProgress {
  /** 進度狀態資訊 */
  progress?: ProgressState;

  /** 檢查點資訊 */
  checkpoints?: TaskCheckpoints;
}
