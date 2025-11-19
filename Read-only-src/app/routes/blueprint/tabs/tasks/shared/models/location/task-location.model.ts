/**
 * Task Location Model
 *
 * 任務空間維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：D. 空間維度
 *
 * 包含：
 * - 物理位置（Physical Location）：階層式位置、座標、BIM 關聯
 * - 空間關聯（Spatial Relationships）：鄰近任務、空間重疊、施工動線
 * - 空間約束與衝突檢測結果
 *
 * @see @ETMS_DESIGN_SPEC.md D. 空間維度
 */

/**
 * 座標類型
 * 定義座標系統的類型
 *
 * @see @ETMS_DESIGN_SPEC.md D.11 物理位置 (Physical Location) - coordinates.type
 */
export type CoordinateType = 'cartesian' | 'geographic';

/**
 * 方向類型
 * 定義空間方向
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - direction
 */
export type Direction =
  | 'north' // 北
  | 'south' // 南
  | 'east' // 東
  | 'west' // 西
  | 'above' // 上方
  | 'below'; // 下方

/**
 * 重疊類型
 * 定義空間重疊的類型
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - overlapType
 */
export type OverlapType = 'complete' | 'partial';

/**
 * 空間約束類型
 * 定義空間約束的類型
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - constraints.type
 */
export type SpatialConstraintType =
  | 'exclusive' // 獨佔
  | 'sequential' // 順序
  | 'limited-access' // 限制進出
  | 'safety-zone'; // 安全區域

/**
 * 空間衝突類型
 * 定義空間衝突的類型
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - spatialConflicts.conflictType
 */
export type SpatialConflictType =
  | 'overlap' // 重疊
  | 'access-blocked' // 進出受阻
  | 'safety-violation'; // 安全違規

/**
 * 座標接口
 * 定義任務的座標資訊，支援笛卡爾座標和地理座標
 *
 * @see @ETMS_DESIGN_SPEC.md D.11 物理位置 (Physical Location) - coordinates
 */
export interface Coordinates {
  /** 座標類型 */
  type: CoordinateType;

  /** X 座標（笛卡爾座標） */
  x: number;

  /** Y 座標（笛卡爾座標） */
  y: number;

  /** Z 座標（笛卡爾座標，可選） */
  z?: number;

  /** 緯度（地理座標 WGS84） */
  latitude?: number;

  /** 經度（地理座標 WGS84） */
  longitude?: number;

  /** 海拔高度（地理座標） */
  altitude?: number;

  /** 相對 X 座標（相對於建築基準點） */
  relativeX?: number;

  /** 相對 Y 座標（相對於建築基準點） */
  relativeY?: number;

  /** 相對 Z 座標（相對於建築基準點） */
  relativeZ?: number;
}

/**
 * 物理位置接口
 * 定義任務的物理位置資訊，包含階層式位置、座標和 BIM 關聯
 *
 * @see @ETMS_DESIGN_SPEC.md D.11 物理位置 (Physical Location)
 */
export interface PhysicalLocation {
  /** 階層式位置資訊 */
  location: {
    /** 工地/廠區，如 "新店廠區" */
    site: string;

    /** 建築物，如 "A棟" */
    building: string;

    /** 樓層，如 "3F" */
    floor: string;

    /** 區域，如 "北區" */
    zone: string;

    /** 房間，如 "301室" */
    room: string;

    /** 設備編號，如 "TR-01" */
    equipment: string;

    /** 完整路徑，如 "新店廠區 > A棟 > 3F > 北區 > 301室" */
    fullPath: string;

    /** 座標系統（可選） */
    coordinates?: Coordinates;

    /** BIM 元素 ID（IFC GUID） */
    bimElementId?: string;

    /** BIM 模型檔案路徑 */
    bimModel?: string;

    /** BIM 版本 */
    bimVersion?: string;

    /** 面積（平方米） */
    area?: number;

    /** 體積（立方米） */
    volume?: number;

    /** 淨高（米） */
    ceilingHeight?: number;
  };
}

/**
 * 鄰近任務接口
 * 定義與任務鄰近的其他任務
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - adjacentTasks
 */
export interface AdjacentTask {
  /** 鄰近任務 ID */
  taskId: string;

  /** 距離（米） */
  distance: number;

  /** 方向 */
  direction: Direction;
}

/**
 * 重疊任務接口
 * 定義與任務空間重疊的其他任務
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - overlappingTasks
 */
export interface OverlappingTask {
  /** 重疊任務 ID */
  taskId: string;

  /** 重疊類型 */
  overlapType: OverlapType;

  /** 重疊百分比 */
  overlapPercentage: number;

  /** 是否可以同時作業 */
  canWorkSimultaneously: boolean;
}

/**
 * 空間約束接口
 * 定義任務的空間約束
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - constraints
 */
export interface SpatialConstraint {
  /** 約束類型 */
  type: SpatialConstraintType;

  /** 約束描述 */
  description: string;

  /** 受影響的任務 IDs */
  affectedTasks: string[];
}

/**
 * 空間衝突接口
 * 定義任務的空間衝突
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships) - spatialConflicts
 */
export interface SpatialConflict {
  /** 衝突任務 ID */
  taskId: string;

  /** 衝突類型 */
  conflictType: SpatialConflictType;

  /** 嚴重程度（1-5） */
  severity: number;

  /** 解決方案（可選） */
  resolution?: string;
}

/**
 * 空間關聯接口
 * 定義任務的空間關聯資訊，包含鄰近任務、空間重疊、施工動線等
 *
 * @see @ETMS_DESIGN_SPEC.md D.12 空間關聯 (Spatial Relationships)
 */
export interface SpatialRelationships {
  /** 空間關聯資訊 */
  spatialRelations: {
    /** 鄰近任務陣列 */
    adjacentTasks: AdjacentTask[];

    /** 空間重疊任務陣列 */
    overlappingTasks: OverlappingTask[];

    /** 進出路徑（任務 IDs 陣列） */
    accessPath: string[];

    /** 所需淨空（米） */
    requiredClearance: number;

    /** 作業範圍（GeoJSON Polygon） */
    workArea?: {
      type: 'Polygon';
      coordinates: number[][][];
    };

    /** 空間約束陣列 */
    constraints: SpatialConstraint[];

    /** 3D 空間衝突檢測結果陣列 */
    spatialConflicts: SpatialConflict[];
  };
}

/**
 * 任務空間維度接口
 * 組合物理位置和空間關聯
 *
 * 此接口代表任務的完整空間資訊，用於空間管理和衝突檢測
 *
 * @see @ETMS_DESIGN_SPEC.md D. 空間維度
 */
export interface TaskLocation {
  /** 物理位置資訊 */
  physical?: PhysicalLocation;

  /** 空間關聯資訊 */
  relationships?: SpatialRelationships;
}

/**
 * 任務空間摘要（過渡期結構）
 *
 * 用於任務層快速顯示的位置與風險摘要。
 */
export interface TaskLocationSummary {
  site?: string;
  zone?: string;
  floor?: string;
  room?: string;
  equipmentCode?: string;
  bimElementId?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
    elevation?: number;
  };
}

export interface TaskSpatialRiskSummary {
  adjacentTaskIds: string[];
  conflictTaskIds: string[];
  accessNotes?: string;
}

export interface TaskLocationOverview {
  location?: TaskLocationSummary;
  spatial?: TaskSpatialRiskSummary;
}
