/**
 * Task Communication Model
 *
 * 任務溝通維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：L. 溝通維度
 *
 * 包含：
 * - 溝通記錄（Communication Log）：會議、郵件、電話、現場指令等
 *
 * @see @ETMS_DESIGN_SPEC.md L. 溝通維度
 */

/**
 * 溝通分類
 * 定義討論主題的分類
 */
export type TaskCommunicationCategory = 'general' | 'rfi' | 'issue' | 'meeting';

/**
 * 溝通主題狀態
 */
export type TaskCommunicationThreadStatus = 'open' | 'resolved' | 'archived';

/**
 * 任務溝通主題摘要
 * 代表一個任務下的討論串/溝通主題
 */
export interface TaskCommunicationThreadSummary {
  /** 主題 ID */
  id: string;

  /** 任務 ID */
  taskId: string;

  /** 主題/標題 */
  topic: string;

  /** 主題分類 */
  category: TaskCommunicationCategory;

  /** 主題狀態 */
  status: TaskCommunicationThreadStatus;

  /** 建立者 */
  createdBy?: string | null;

  /** 更新者 */
  updatedBy?: string | null;

  /** 建立時間 */
  createdAt: Date;

  /** 更新時間 */
  updatedAt: Date;

  /** 最後訊息時間（可選） */
  lastMessageAt?: Date | null;

  /** 額外資訊 */
  metadata?: Record<string, unknown>;
}

/**
 * 溝通訊息
 * 代表主題下的一則訊息
 */
export interface TaskCommunicationMessage {
  /** 訊息 ID */
  id: string;

  /** 主題 ID */
  communicationId: string;

  /** 作者 User ID */
  authorId?: string | null;

  /** 內容 */
  content: string;

  /** 附件 */
  attachments: string[];

  /** 額外資訊（如 RFI 編號、參與者等） */
  metadata?: Record<string, unknown>;

  /** 建立時間 */
  createdAt: Date;
}

/**
 * 主題包含的訊息集合
 */
export interface TaskCommunicationThread {
  summary: TaskCommunicationThreadSummary;
  messages: TaskCommunicationMessage[];
}

/**
 * 任務溝通維度接口
 * 組合溝通記錄
 *
 * 此接口代表任務的完整溝通資訊，用於溝通管理和追蹤
 *
 * @see @ETMS_DESIGN_SPEC.md L. 溝通維度
 */
export interface TaskCommunication {
  threads: TaskCommunicationThread[];
}
