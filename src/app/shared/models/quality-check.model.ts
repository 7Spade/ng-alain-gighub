/**
 * Quality Check Models
 *
 * 品質檢查相關的資料模型，對應資料庫 quality_checks 表
 */

/**
 * 檢查類型
 */
export enum QualityCheckType {
  ROUTINE = 'routine', // 例行檢查
  MILESTONE = 'milestone', // 里程碑檢查
  FINAL = 'final', // 最終驗收
  SPOT_CHECK = 'spot_check' // 抽查
}

/**
 * 檢查狀態
 */
export enum QualityCheckStatus {
  PENDING = 'pending', // 待檢查
  IN_PROGRESS = 'in_progress', // 檢查中
  PASSED = 'passed', // 通過
  FAILED = 'failed', // 未通過
  CONDITIONAL_PASS = 'conditional_pass' // 條件通過
}

/**
 * 檢查項目
 */
export interface QualityCheckItem {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  passed: boolean;
  remarks?: string;
}

/**
 * 品質檢查記錄（資料庫完整結構）
 */
export interface QualityCheck {
  id: string;
  taskId: string;
  stagingId: string | null;
  inspectorId: string;
  checkType: QualityCheckType;
  status: QualityCheckStatus;
  checkItems: QualityCheckItem[];
  findings: string | null;
  recommendations: string | null;
  checkedAt: string; // ISO 8601 timestamp
  completedAt: string | null; // ISO 8601 timestamp
}

/**
 * 品質檢查詳情（包含關聯資料）
 */
export interface QualityCheckDetail extends QualityCheck {
  task?: {
    id: string;
    name: string;
    code: string;
  };
  inspector?: {
    id: string;
    name: string;
    email: string;
  };
  photos?: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
}

/**
 * 品質檢查新增資料
 */
export interface QualityCheckInsert {
  taskId: string;
  stagingId?: string | null;
  inspectorId: string;
  checkType: QualityCheckType;
  status?: QualityCheckStatus;
  checkItems: QualityCheckItem[];
  findings?: string | null;
  recommendations?: string | null;
  checkedAt?: string;
  completedAt?: string | null;
}

/**
 * 品質檢查更新資料
 */
export interface QualityCheckUpdate {
  status?: QualityCheckStatus;
  checkItems?: QualityCheckItem[];
  findings?: string | null;
  recommendations?: string | null;
  completedAt?: string | null;
}
