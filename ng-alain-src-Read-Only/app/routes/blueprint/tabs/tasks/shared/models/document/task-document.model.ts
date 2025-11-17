/**
 * Task Document Model
 *
 * 任務文件維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：K. 文件維度
 *
 * 包含：
 * - 文件管理（Document Management）：文件版本控制、工作流程、責任人
 *
 * @see @ETMS_DESIGN_SPEC.md K. 文件維度
 */

/**
 * 文件類型
 * 定義文件的類型
 *
 * @see @ETMS_DESIGN_SPEC.md K.23 文件管理 (Document Management) - type
 */
export type DocumentType =
  | 'drawing' // 圖面
  | 'specification' // 規格書
  | 'report' // 報告
  | 'photo' // 照片
  | 'video' // 影片
  | 'certificate' // 證書
  | 'other'; // 其他

/**
 * 文件狀態
 * 定義文件的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md K.23 文件管理 (Document Management) - status
 */
export type DocumentStatus =
  | 'draft' // 草稿
  | 'in-review' // 審查中
  | 'approved' // 已批准
  | 'issued' // 已發行
  | 'superseded' // 已取代
  | 'obsolete' // 已廢止
  | 'void'; // 已作廢

/**
 * 任務與文件關聯角色
 */
export type TaskDocumentLinkRole = 'attachment' | 'reference' | 'deliverable';

/**
 * 任務與文件關聯狀態
 */
export type TaskDocumentLinkStatus = 'active' | 'archived';

/**
 * 修訂歷史接口
 * 定義文件的修訂歷史
 *
 * @see @ETMS_DESIGN_SPEC.md K.23 文件管理 (Document Management) - revisionHistory
 */
export interface DocumentRevision {
  /** 版本號，如 "1.0", "2.1", "Rev A" */
  version: string;

  /** 修訂日期 */
  date: Date;

  /** 作者 User ID */
  author: string;

  /** 變更說明 */
  changes: string;
}

/**
 * 文件項目接口
 * 定義單個文件項目
 *
 * @see @ETMS_DESIGN_SPEC.md K.23 文件管理 (Document Management)
 */
export interface DocumentItem {
  /** 文件 ID */
  id: string;

  /** 文件名稱 */
  name: string;

  /** 文件類型 */
  type: DocumentType;

  /** 文件分類 */
  category: string;

  /** 所屬專業（discipline） */
  discipline?: string;

  /** 施工階段（phase） */
  phase?: string;

  /** 工作包（package） */
  package?: string;

  /** 位於的目錄路徑（不含檔名） */
  folderPath?: string;

  /** 版本號，如 "1.0", "2.1", "Rev A" */
  version: string;

  /** 修訂歷史陣列 */
  revisionHistory: DocumentRevision[];

  /** 文件 URL */
  url: string;

  /** 檔案名稱 */
  fileName: string;

  /** 檔案大小（位元組） */
  fileSize: number;

  /** MIME 類型 */
  mimeType: string;

  /** Supabase 儲存路徑（僅供內部管理、權限控制） */
  storagePath?: string;

  /** 檔案雜湊值（SHA-256，用於完整性驗證，可選） */
  hash?: string;

  /** 文件狀態 */
  status: DocumentStatus;

  /** 工作流程階段 */
  workflowStage: string;

  /** 作者 User ID */
  author: string;

  /** 審查者 User ID（可選） */
  reviewer?: string;

  /** 批准者 User ID（可選） */
  approver?: string;

  /** 發行者 User ID（可選） */
  issuedBy?: string;

  /** 創建時間 */
  createdAt: Date;

  /** 提交時間（可選） */
  submittedAt?: Date;

  /** 批准時間（可選） */
  approvedAt?: Date;

  /** 發行時間（可選） */
  issuedAt?: Date;

  /** 任務文件連結的角色（可選） */
  linkRole?: TaskDocumentLinkRole;

  /** 任務文件連結的狀態（可選） */
  linkStatus?: TaskDocumentLinkStatus;

  /** 任務文件連結的附加資訊（可選） */
  linkMetadata?: Record<string, unknown>;
}

/**
 * 文件管理接口
 * 定義任務的文件管理資訊，包含文件版本控制、工作流程等
 *
 * @see @ETMS_DESIGN_SPEC.md K.23 文件管理 (Document Management)
 */
export interface DocumentManagement {
  /** 文件陣列 */
  documents: DocumentItem[];
}

/**
 * 任務文件關聯
 */
export interface TaskDocumentLink {
  id: string;
  taskId: string;
  documentId: string;
  role: TaskDocumentLinkRole;
  status: TaskDocumentLinkStatus;
  version?: string | null;
  linkedAt: Date;
  linkedBy?: string | null;
  metadata?: Record<string, unknown>;
  document: DocumentItem;
}

/**
 * 任務文件維度接口
 * 組合文件管理
 *
 * 此接口代表任務的完整文件資訊，用於文件管理和版本控制
 *
 * @see @ETMS_DESIGN_SPEC.md K. 文件維度
 */
export interface TaskDocument {
  /** 文件關聯 */
  links: TaskDocumentLink[];
}
