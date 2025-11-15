/**
 * Task Identity Model
 *
 * 任務本體屬性模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：A. 任務本體屬性
 *
 * 包含：
 * - 識別屬性（Identity）：ID、編碼、版本、創建/更新資訊
 * - 描述屬性（Description）：名稱、說明、標籤、分類、工作類型
 * - 階層屬性（Hierarchy）：父子關係、路徑、層級等樹狀結構資訊
 * - 唯一性驗證與軟刪除標記
 *
 * @see @ETMS_DESIGN_SPEC.md A. 任務本體屬性
 */

/**
 * 工作類型枚舉
 * 定義任務的標準化工作類型，便於統計分析
 *
 * @see @ETMS_DESIGN_SPEC.md A.2 描述屬性 (Description) - WorkType
 */
export enum WorkType {
  /** 安裝 */
  INSTALLATION = 'installation',
  /** 配線 */
  WIRING = 'wiring',
  /** 測試 */
  TESTING = 'testing',
  /** 檢驗 */
  INSPECTION = 'inspection',
  /** 送電/啟用 */
  COMMISSIONING = 'commissioning',
  /** 文件製作 */
  DOCUMENTATION = 'documentation',
  /** 運輸 */
  TRANSPORTATION = 'transportation',
  /** 基礎工程 */
  FOUNDATION = 'foundation',
  /** 拆除 */
  DEMOLITION = 'demolition',
  /** 採購 */
  PROCUREMENT = 'procurement',
  /** 製作 */
  FABRICATION = 'fabrication'
}

/**
 * 任務識別屬性接口
 * 定義任務的唯一識別資訊、版本控制和軟刪除標記
 *
 * @see @ETMS_DESIGN_SPEC.md A.1 識別屬性 (Identity)
 */
export interface TaskIdentity {
  /** UUID v4 - 任務唯一識別碼 */
  id: string;

  /** 所屬藍圖 ID */
  blueprintId: string;

  /** 階層式編碼，如 "10.1.2.3"，便於人工識別與排序 */
  code: string;

  /** 版本控制，從 1 開始，用於追蹤任務歷史變更 */
  version: number;

  /** 創建時間 */
  createdAt: Date;

  /** 創建者 User ID */
  createdBy: string;

  /** 更新時間 */
  updatedAt: Date;

  /** 更新者 User ID */
  updatedBy: string;

  /** 軟刪除標記，保留歷史記錄 */
  isArchived: boolean;

  /** 歸檔時間（當 isArchived 為 true 時） */
  archivedAt?: Date;

  /** 歸檔者 User ID（當 isArchived 為 true 時） */
  archivedBy?: string;
}

/**
 * 任務描述屬性接口
 * 定義任務的名稱、說明、分類和工作類型等描述性資訊
 *
 * @see @ETMS_DESIGN_SPEC.md A.2 描述屬性 (Description)
 */
export interface TaskDescription {
  /** 任務名稱，最多 200 字，簡潔明瞭 */
  name: string;

  /** 詳細說明，支援 Markdown 格式 */
  description?: string;

  /** 備註，內部使用 */
  notes?: string;

  /** 標籤陣列，如 ['緊急', '高風險', '需監造']，用於快速篩選與分類 */
  tags: string[];

  /** 大分類，如 "一、貳、參..." */
  category?: string;

  /** 子分類 */
  subcategory?: string;

  /** 工作類型，標準化分類便於統計分析 */
  workType?: WorkType;

  /** 專業分類，如 "土建/機電/裝修..." */
  discipline?: string;

  /** 承包商 ID */
  contractorId?: string;

  /** 分包商 ID */
  subcontractorId?: string;

  /** 業主參考編號 */
  clientReference?: string;
}

/**
 * 任務階層屬性接口
 * 定義任務的樹狀結構關係，包含父子關係、路徑、層級等資訊
 * 用於優化階層查詢和遞迴操作
 *
 * @see @ETMS_DESIGN_SPEC.md A.3 階層屬性 (Hierarchy)
 */
export interface TaskHierarchySummary {
  /** 父任務 ID，null 表示根節點 */
  parentId: string | null;

  /** 層級，從 1 開始，最多 6 層 */
  level: number;

  /** 路徑字串，如 "10/10.1/10.1.2"，用於快速查找祖先鏈 */
  path: string;

  /** 同層排序順序，從 0 開始 */
  sortOrder: number;

  /** 直接子任務數量 */
  childrenCount: number;

  /** 是否為葉節點（原子任務，無子任務） */
  isLeaf: boolean;

  /** 是否可展開（用於 UI 顯示） */
  isExpandable: boolean;
}

/**
 * 完整的任務本體屬性接口
 * 組合識別屬性、描述屬性和階層屬性
 *
 * 此接口代表任務的核心本體資訊，是所有任務維度的基礎
 *
 * @see @ETMS_DESIGN_SPEC.md A. 任務本體屬性
 * @note 包含數據庫主表欄位（用於查詢優化）
 */
export interface TaskIdentityComplete extends TaskIdentity, TaskDescription, TaskHierarchySummary {
  /** 任務狀態（數據庫主表欄位，用於查詢優化） */
  status?: 'todo' | 'in-progress' | 'completed' | 'cancelled';

  /** 任務優先級（數據庫主表欄位，用於查詢優化） */
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  /** 任務負責人 User ID（數據庫主表欄位，用於查詢優化） */
  assignedTo?: string;
}
