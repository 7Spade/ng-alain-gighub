/**
 * Task Resource Model
 *
 * 任務資源維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：E. 資源維度
 *
 * 包含：
 * - 人力資源（Human Resources）：計畫人力、實際配置、工時統計
 * - 材料資源（Material Resources）：材料清單、採購資訊、品質檢驗
 * - 機具資源（Equipment Resources）：機具清單、排程、檢驗、使用記錄
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */

/**
 * 技能等級
 * 定義人員的技能等級
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources) - skillLevel
 */
export type SkillLevel = 'junior' | 'intermediate' | 'senior' | 'expert';

/**
 * 缺勤類型
 * 定義缺勤的類型
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources) - absences.type
 */
export type AbsenceType = 'sick' | 'personal' | 'vacation';

/**
 * 材料狀態
 * 定義材料的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md E.14 材料資源 (Material Resources) - status
 */
export type MaterialStatus =
  | 'not-ordered' // 未訂購
  | 'ordered' // 已訂購
  | 'in-transit' // 運輸中
  | 'on-site' // 現場
  | 'in-use' // 使用中
  | 'depleted'; // 已耗盡

/**
 * 品質檢驗狀態
 * 定義品質檢驗的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md E.14 材料資源 (Material Resources) - qualityCheck.status
 */
export type QualityCheckStatus = 'pass' | 'fail' | 'pending' | 'waived';

/**
 * 機具狀態
 * 定義機具的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources) - status
 */
export type EquipmentStatus =
  | 'available' // 可用
  | 'reserved' // 已預約
  | 'in-use' // 使用中
  | 'maintenance' // 維護中
  | 'broken'; // 故障

/**
 * 檢驗狀態
 * 定義檢驗的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources) - inspectionStatus
 */
export type InspectionStatus = 'valid' | 'expired' | 'pending' | 'failed';

/**
 * 使用記錄事件類型
 * 定義使用記錄的事件類型
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources) - usageLog.event
 */
export type UsageEventType = 'start' | 'stop' | 'maintenance' | 'breakdown';

/**
 * 計畫團隊成員接口
 * 定義計畫人力中的單個成員
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources) - plannedTeam
 */
export interface PlannedTeamMember {
  /** 角色，如工程師/技師/工人/監工 */
  role: string;

  /** 人數 */
  count: number;

  /** 技能等級 */
  skillLevel: SkillLevel;

  /** 證照要求陣列，如 ['甲級電匠', '吊車操作證'] */
  certification: string[];

  /** 每日工時 */
  hoursPerDay: number;

  /** 總工時 */
  totalHours: number;

  /** 每小時費率 */
  hourlyRate: number;

  /** 總成本 */
  totalCost: number;
}

/**
 * 缺勤記錄接口
 * 定義單個缺勤記錄
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources) - absences
 */
export interface Absence {
  /** 缺勤日期 */
  date: Date;

  /** 缺勤類型 */
  type: AbsenceType;

  /** 缺勤時數 */
  hours: number;
}

/**
 * 已分配人員接口
 * 定義實際配置中的單個人員
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources) - assignedPersonnel
 */
export interface AssignedPersonnel {
  /** 用戶 ID */
  userId: string;

  /** 姓名 */
  name: string;

  /** 角色 */
  role: string;

  /** 技能等級 */
  skillLevel: string;

  /** 分配工時 */
  assignedHours: number;

  /** 實際工時 */
  actualHours: number;

  /** 開始日期 */
  startDate: Date;

  /** 結束日期（可選） */
  endDate?: Date;

  /** 生產力（0-1） */
  productivity: number;

  /** 品質評分（0-100） */
  qualityScore: number;

  /** 出勤率（%） */
  attendanceRate: number;

  /** 缺勤記錄陣列 */
  absences: Absence[];
}

/**
 * 人力資源接口
 * 定義任務的人力資源資訊
 *
 * @see @ETMS_DESIGN_SPEC.md E.13 人力資源 (Human Resources)
 */
export interface HumanResources {
  /** 人力資訊 */
  manpower: {
    /** 計畫團隊陣列 */
    plannedTeam: PlannedTeamMember[];

    /** 實際配置人員陣列 */
    assignedPersonnel: AssignedPersonnel[];

    /** 總工時 */
    totalManHours: number;

    /** 已完成工時 */
    completedManHours: number;

    /** 剩餘工時 */
    remainingManHours: number;

    /** 效率 = 實際產出 / 投入工時 */
    efficiency: number;

    /** 高峰人力（人數） */
    peakManpower?: number;

    /** 達到高峰人力的日期 */
    peakManpowerDate?: Date;

    /** 平均人力（人數） */
    averageManpower?: number;
  };
}

/**
 * 品質檢驗接口
 * 定義材料的品質檢驗資訊
 *
 * @see @ETMS_DESIGN_SPEC.md E.14 材料資源 (Material Resources) - qualityCheck
 */
export interface QualityCheck {
  /** 是否需檢驗 */
  required: boolean;

  /** 檢驗狀態（可選） */
  status?: QualityCheckStatus;

  /** 檢查者 User ID（可選） */
  inspector?: string;

  /** 檢驗日期（可選） */
  inspectionDate?: Date;

  /** 報告編號（可選） */
  reportNumber?: string;

  /** 缺陷陣列（可選） */
  defects?: string[];
}

/**
 * 材料項目接口
 * 定義單個材料項目
 *
 * @see @ETMS_DESIGN_SPEC.md E.14 材料資源 (Material Resources)
 */
export interface MaterialItem {
  /** 材料 ID */
  id: string;

  /** 材料名稱 */
  name: string;

  /** 單位，如 m, kg, 個 */
  unit: string;

  /** 計畫數量 */
  plannedQuantity: number;

  /** 已安裝數量（用於進度計算，預設 0） */
  installedQuantity: number;

  /** 已使用數量（備援值，預設 0） */
  usedQuantity: number;

  /** 已訂購數量（可選） */
  orderedQuantity?: number;

  /** 已送達數量（可選） */
  deliveredQuantity?: number;

  /** 送達日期（可選） */
  deliveredDate?: Date;

  /** 錄得安裝日期（可選） */
  installedDate?: Date;

  /** 浪費數量（可選） */
  wastedQuantity?: number;

  /** 剩餘數量（可選） */
  remainingQuantity?: number;

  /** 狀態（可選） */
  status?: MaterialStatus;

  /** 規格（可選） */
  specification?: string;

  /** 等級（可選） */
  grade?: string;

  /** 品牌（可選） */
  brand?: string;

  /** 型號（可選） */
  model?: string;

  /** 供應商（可選） */
  supplier?: string;

  /** 供應商聯絡方式（可選） */
  supplierContact?: string;

  /** 採購單號（可選） */
  poNumber?: string;

  /** 請購單號（可選） */
  prNumber?: string;

  /** 單價（可選） */
  unitPrice?: number;

  /** 總成本（可選） */
  totalCost?: number;

  /** 實際成本（可選） */
  actualCost?: number;

  /** 訂購日期（可選） */
  orderedDate?: Date;

  /** 預期送達日期（可選） */
  expectedDelivery?: Date;

  /** 實際送達日期（可選） */
  actualDelivery?: Date;

  /** 前置時間（天，預設 0） */
  leadTime?: number;

  /** 儲位（可選） */
  storageLocation?: string;

  /** 倉庫區域（可選） */
  warehouseSection?: string;

  /** 品質檢驗（可選） */
  qualityCheck?: QualityCheck;

  /** 其他擴充欄位 */
  metadata?: Record<string, unknown>;
}

/**
 * 任務主要數量設定負載
 * 提供更新任務主要材料數量時所需的輸入結構
 */
export interface TaskQuantityPayload {
  /** 數量單位，預設 item */
  unit?: string;
  /** 計畫數量（整數） */
  plannedQuantity: number;
  /** 已安裝數量 */
  installedQuantity?: number;
  /** 已使用數量 */
  usedQuantity?: number;
  /** 關聯的材料 ID */
  materialId?: string;
  /** 材料或數量顯示名稱 */
  name?: string;
}

/**
 * 材料資源接口
 * 定義任務的材料資源資訊
 *
 * @see @ETMS_DESIGN_SPEC.md E.14 材料資源 (Material Resources)
 */
export interface MaterialResources {
  /** 材料陣列 */
  materials: MaterialItem[];

  /** 總材料成本 */
  totalMaterialCost?: number;

  /** 材料浪費率（0-1） */
  materialWasteRate?: number;

  /** 材料短缺清單 */
  materialShortages?: MaterialShortage[];
}

/**
 * 材料短缺資訊
 */
export interface MaterialShortage {
  materialId: string;
  name: string;
  shortageQuantity: number;
  unit: string;
  expectedRecoveryDate?: Date;
  notes?: string;
}

/**
 * 使用記錄接口
 * 定義機具的使用記錄
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources) - usageLog
 */
export interface UsageLog {
  /** 時間戳記 */
  timestamp: Date;

  /** 事件類型 */
  event: UsageEventType;

  /** 操作者 User ID */
  operator: string;

  /** 使用時數 */
  hours: number;

  /** 燃料消耗量（可選） */
  fuelConsumed?: number;

  /** 備註（可選） */
  notes?: string;
}

/**
 * 安全檢驗接口
 * 定義機具的安全檢驗
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources) - safetyInspections
 */
export interface SafetyInspection {
  /** 檢驗日期 */
  date: Date;

  /** 檢查者 User ID */
  inspector: string;

  /** 檢驗結果 */
  result: 'pass' | 'fail' | 'conditional';

  /** 檢驗報告（可選） */
  report?: string;
}

/**
 * 機具項目接口
 * 定義單個機具項目
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources)
 */
export interface EquipmentItem {
  /** 機具 ID */
  id: string;

  /** 機具名稱 */
  name: string;

  /** 機具類型，如吊車/堆高機/電焊機/鷹架 */
  type: string;

  /** 型號 */
  model: string;

  /** 序號 */
  serialNumber: string;

  /** 預約開始日期 */
  reservedFrom: Date;

  /** 預約結束日期 */
  reservedTo: Date;

  /** 實際使用開始日期（可選） */
  actualUsageStart?: Date;

  /** 實際使用結束日期（可選） */
  actualUsageEnd?: Date;

  /** 狀態 */
  status: EquipmentStatus;

  /** 是否需檢驗 */
  inspectionRequired: boolean;

  /** 上次檢驗日期（可選） */
  lastInspectionDate?: Date;

  /** 下次檢驗日期（可選） */
  nextInspectionDate?: Date;

  /** 檢驗狀態 */
  inspectionStatus: InspectionStatus;

  /** 檢驗證書（可選） */
  inspectionCertificate?: string;

  /** 操作者 User ID（可選） */
  operator?: string;

  /** 操作者證照（可選） */
  operatorLicense?: string;

  /** 證照到期日（可選） */
  licenseExpiry?: Date;

  /** 租金（可選） */
  rentalCost?: number;

  /** 操作成本（可選） */
  operatingCost?: number;

  /** 維護成本（可選） */
  maintenanceCost?: number;

  /** 使用記錄陣列 */
  usageLog: UsageLog[];

  /** 使用率（%） */
  utilizationRate: number;

  /** 停機時數 */
  downtimeHours: number;

  /** 安全檢驗陣列 */
  safetyInspections: SafetyInspection[];
}

/**
 * 機具資源接口
 * 定義任務的機具資源資訊
 *
 * @see @ETMS_DESIGN_SPEC.md E.15 機具資源 (Equipment Resources)
 */
export interface EquipmentResources {
  /** 機具陣列 */
  equipment: EquipmentItem[];
}

/**
 * 任務資源維度接口
 * 組合人力資源、材料資源和機具資源
 *
 * 此接口代表任務的完整資源資訊，用於資源管理和配置
 *
 * @see @ETMS_DESIGN_SPEC.md E. 資源維度
 */
export interface TaskResource {
  /** 人力資源資訊 */
  manpower?: HumanResources;

  /** 材料資源資訊 */
  materials?: MaterialResources;

  /** 機具資源資訊 */
  equipment?: EquipmentResources;
}
