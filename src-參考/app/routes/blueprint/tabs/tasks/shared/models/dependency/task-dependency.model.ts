/**
 * Task Dependency Model
 *
 * 任務關聯維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：C. 關聯維度
 *
 * 包含：
 * - 前置任務（Predecessors）：FS/SS/FF/SF 四種依賴類型
 * - 後續任務（Successors）：影響鏈分析
 * - 關聯任務（Related Tasks）：相似、替代、參考等關係
 * - 里程碑（Milestones）：付款里程碑、驗收標準
 *
 * @see @ETMS_DESIGN_SPEC.md C. 關聯維度
 */

/**
 * 依賴類型枚舉
 * 定義任務之間的依賴關係類型
 *
 * FS（Finish-to-Start）是最常見的依賴類型，佔 85%
 *
 * @see @ETMS_DESIGN_SPEC.md C.7 前置任務 (Predecessors) - DependencyType
 */
export enum DependencyType {
  /** 完成→開始 (最常見, 85%) - A 完成後 B 才能開始 */
  FS = 'finish-to-start',
  /** 開始→開始 (10%) - A 開始後 B 才能開始 */
  SS = 'start-to-start',
  /** 完成→完成 (4%) - A 完成後 B 才能完成 */
  FF = 'finish-to-finish',
  /** 開始→完成 (罕見, 1%) - A 開始後 B 才能完成 */
  SF = 'start-to-finish'
}

/**
 * 關聯類型枚舉
 * 定義任務之間的非時間依賴關聯關係
 *
 * @see @ETMS_DESIGN_SPEC.md C.9 關聯任務 (Related Tasks) - RelationType
 */
export enum RelationType {
  /** 相似任務（可複製經驗） */
  SIMILAR = 'similar',
  /** 替代方案 */
  ALTERNATIVE = 'alternative',
  /** 參考案例 */
  REFERENCE = 'reference',
  /** 資源衝突 */
  CONFLICT = 'conflict',
  /** 協同效應 */
  SYNERGY = 'synergy',
  /** 前置條件（但非時間依賴） */
  PREREQUISITE = 'prerequisite',
  /** 邏輯後續 */
  FOLLOWS = 'follows',
  /** 重複任務 */
  DUPLICATE = 'duplicate',
  /** 取代 */
  SUPERSEDES = 'supersedes'
}

/**
 * 依賴強度類型
 * 定義依賴關係的強度，用於判斷是否可以調整
 *
 * @see @ETMS_DESIGN_SPEC.md C.7 前置任務 (Predecessors) - strength
 */
export type DependencyStrength =
  | 'mandatory' // 硬性依賴（技術限制）
  | 'discretionary' // 軟性依賴（最佳實踐）
  | 'external'; // 外部依賴（供應商/業主）

/**
 * 里程碑類型
 * 定義里程碑的分類
 *
 * @see @ETMS_DESIGN_SPEC.md C.10 里程碑 (Milestones) - type
 */
export type MilestoneType =
  | 'internal' // 內部里程碑
  | 'contractual' // 合約里程碑
  | 'payment' // 付款里程碑
  | 'regulatory'; // 法規里程碑

/**
 * 里程碑狀態
 * 定義里程碑的當前狀態
 *
 * @see @ETMS_DESIGN_SPEC.md C.10 里程碑 (Milestones) - status
 */
export type MilestoneStatus =
  | 'pending' // 待達成
  | 'achieved' // 已達成
  | 'missed' // 已錯過
  | 'cancelled'; // 已取消

/**
 * 付款狀態
 * 定義付款里程碑的付款狀態
 *
 * @see @ETMS_DESIGN_SPEC.md C.10 里程碑 (Milestones) - paymentStatus
 */
export type PaymentStatus =
  | 'not-due' // 未到期
  | 'invoiced' // 已開立發票
  | 'paid'; // 已付款

/**
 * 延遲單位
 * 定義延遲時間的單位
 *
 * @see @ETMS_DESIGN_SPEC.md C.7 前置任務 (Predecessors) - lagUnit
 */
export type LagUnit = 'days' | 'hours';

/**
 * 前置任務單一項目接口
 * 定義單個前置任務的詳細資訊
 *
 * @see @ETMS_DESIGN_SPEC.md C.7 前置任務 (Predecessors)
 */
export interface Predecessor {
  /** 前置任務 ID */
  taskId: string;

  /** 前置任務編碼（冗餘欄位，便於顯示） */
  taskCode: string;

  /** 前置任務名稱（冗餘欄位，便於顯示） */
  taskName: string;

  /** 依賴類型 */
  type: DependencyType;

  /** 延遲天數（可為負數表示重疊） */
  lag: number;

  /** 延遲單位 */
  lagUnit: LagUnit;

  /** 依賴強度 */
  strength: DependencyStrength;

  /** 是否違反依賴邏輯 */
  isViolated: boolean;

  /** 違反原因（當 isViolated 為 true 時） */
  violationReason?: string;

  /** 創建時間 */
  createdAt: Date;

  /** 創建者 User ID */
  createdBy: string;
}

/**
 * 前置任務接口
 * 定義任務的所有前置任務
 *
 * @see @ETMS_DESIGN_SPEC.md C.7 前置任務 (Predecessors)
 */
export interface TaskPredecessors {
  /** 前置任務陣列 */
  predecessors: Predecessor[];
}

/**
 * 後續任務單一項目接口
 * 定義單個後續任務的基本資訊
 *
 * @see @ETMS_DESIGN_SPEC.md C.8 後續任務 (Successors)
 */
export interface Successor {
  /** 後續任務 ID */
  taskId: string;

  /** 依賴類型 */
  type: DependencyType;

  /** 延遲天數（可為負數表示重疊） */
  lag: number;
}

/**
 * 影響鏈項目接口
 * 定義任務延遲對其他任務的影響
 *
 * @see @ETMS_DESIGN_SPEC.md C.8 後續任務 (Successors) - impactChain
 */
export interface ImpactChainItem {
  /** 受影響的任務 ID */
  taskId: string;

  /** 如果此任務延遲 X 天，該任務會延遲多少天 */
  delayDays: number;

  /** 是否在關鍵路徑上 */
  isCritical: boolean;
}

/**
 * 後續任務接口
 * 定義任務的所有後續任務和影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md C.8 後續任務 (Successors)
 */
export interface TaskSuccessors {
  /** 後續任務陣列 */
  successors: Successor[];

  /** 如果此任務延遲，會影響哪些任務（自動計算欄位） */
  blockedTasks: string[];

  /** 此任務被哪些任務阻塞（自動計算欄位） */
  blockingTasks: string[];

  /** 影響鏈分析 */
  impactChain: ImpactChainItem[];
}

/**
 * 關聯任務單一項目接口
 * 定義單個關聯任務的詳細資訊
 *
 * @see @ETMS_DESIGN_SPEC.md C.9 關聯任務 (Related Tasks)
 */
export interface RelatedTask {
  /** 關聯任務 ID */
  taskId: string;

  /** 關聯類型 */
  relationType: RelationType;

  /** 關聯描述 */
  description: string;

  /** 關聯強度 0-1 */
  strength: number;

  /** 是否雙向關聯 */
  isSymmetric: boolean;

  /** 創建時間 */
  createdAt: Date;

  /** 創建者 User ID */
  createdBy: string;
}

/**
 * 關聯任務接口
 * 定義任務的所有關聯任務（非時間依賴的邏輯關係）
 *
 * @see @ETMS_DESIGN_SPEC.md C.9 關聯任務 (Related Tasks)
 */
export interface RelatedTasks {
  /** 關聯任務陣列 */
  relatedTasks: RelatedTask[];
}

/**
 * 里程碑單一項目接口
 * 定義單個里程碑的完整資訊
 *
 * @see @ETMS_DESIGN_SPEC.md C.10 里程碑 (Milestones)
 */
export interface TaskMilestone {
  /** 里程碑 ID */
  id: string;

  /** 里程碑名稱 */
  name: string;

  /** 里程碑描述 */
  description: string;

  /** 里程碑類型 */
  type: MilestoneType;

  /** 優先級 1-5 */
  priority: number;

  /** 計畫日期 */
  plannedDate: Date;

  /** 實際日期（null 表示尚未達成） */
  actualDate: Date | null;

  /** 里程碑狀態 */
  status: MilestoneStatus;

  /** 付款百分比（僅適用於付款里程碑） */
  paymentPercentage?: number;

  /** 付款金額（僅適用於付款里程碑） */
  paymentAmount?: number;

  /** 付款狀態（僅適用於付款里程碑） */
  paymentStatus?: PaymentStatus;

  /** 驗收標準陣列 */
  acceptanceCriteria: string[];

  /** 所需文件陣列 */
  requiredDocuments: string[];

  /** 責任人 User ID */
  owner: string;

  /** 批准者 User ID */
  approver: string;

  /** 達成證明文件陣列 */
  evidenceDocuments?: string[];

  /** 達成者 User ID */
  achievedBy?: string;

  /** 達成時間 */
  achievedAt?: Date;

  /** 未達成原因（當 status 為 'missed' 時） */
  missedReason?: string;

  /** 補救措施 */
  remedialAction?: string;

  /** 修訂後日期 */
  revisedDate?: Date;
}

/**
 * 里程碑接口
 * 定義任務的所有里程碑
 *
 * @see @ETMS_DESIGN_SPEC.md C.10 里程碑 (Milestones)
 */
export interface TaskMilestones {
  /** 里程碑陣列 */
  milestones: TaskMilestone[];
}

/**
 * 任務關聯維度接口
 * 組合前置任務、後續任務、關聯任務和里程碑
 *
 * 此接口代表任務的完整關聯資訊，用於依賴關係管理和影響分析
 *
 * @see @ETMS_DESIGN_SPEC.md C. 關聯維度
 */
export interface TaskDependency {
  /** 前置任務資訊 */
  predecessors?: TaskPredecessors;

  /** 後續任務資訊 */
  successors?: TaskSuccessors;

  /** 關聯任務資訊（非時間依賴的邏輯關係） */
  relatedTasks?: RelatedTasks;

  /** 里程碑資訊 */
  milestones?: TaskMilestones;
}

/**
 * 任務關聯摘要（過渡期結構）
 *
 * 提供任務層快速顯示所需資訊，詳細依賴資料將逐步由藍圖層維護。
 */
export interface TaskDependencySummary {
  predecessors: Array<{
    taskId: string;
    type: DependencyType;
    lagDays: number;
  }>;
  successors: string[];
  isCritical: boolean;
  blockingCount: number;
}

export interface TaskRelationSummary {
  relatedTaskIds: string[];
  conflictTaskIds: string[];
}

export type TaskMilestoneStatus = 'pending' | 'achieved' | 'missed' | 'cancelled';

export interface TaskMilestoneLink {
  milestoneId: string;
  status: TaskMilestoneStatus;
  plannedDate?: Date | null;
  actualDate?: Date | null;
}

export interface TaskDependencyOverview {
  summary?: TaskDependencySummary;
  relations?: TaskRelationSummary;
  milestones?: TaskMilestoneLink[];
}
