/**
 * Task Risk Model
 *
 * 任務風險維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：I. 風險維度
 *
 * 包含：
 * - 風險管理（Risk Management）：風險識別、評估、應對策略
 *
 * @see @ETMS_DESIGN_SPEC.md I. 風險維度
 */

/**
 * 風險類別
 * 定義風險的分類
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management) - category
 */
export type RiskCategory =
  | 'technical' // 技術風險
  | 'schedule' // 時程風險
  | 'cost' // 成本風險
  | 'safety' // 安全風險
  | 'quality' // 品質風險
  | 'external' // 外部風險
  | 'resource' // 資源風險
  | 'regulatory'; // 法規風險

/**
 * 風險等級
 * 定義風險的等級
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management) - riskLevel
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * 風險應對策略
 * 定義風險的應對策略
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management) - strategy
 */
export type RiskStrategy = 'avoid' | 'mitigate' | 'transfer' | 'accept';

/**
 * 風險狀態
 * 定義風險的狀態
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management) - status
 */
export type RiskStatus =
  | 'identified' // 已識別
  | 'analyzing' // 分析中
  | 'mitigating' // 減緩中
  | 'monitoring' // 監控中
  | 'realized' // 已實現
  | 'closed'; // 已關閉

/**
 * 潛在影響接口
 * 定義風險的潛在影響
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management) - potentialImpacts
 */
export interface PotentialImpacts {
  /** 潛在成本影響 */
  cost: number;

  /** 潛在時程影響（天） */
  schedule: number;

  /** 品質影響描述 */
  quality: string;

  /** 安全影響描述 */
  safety: string;

  /** 聲譽影響描述 */
  reputation: string;
}

/**
 * 風險項目接口
 * 定義單個風險項目
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management)
 */
export interface RiskItem {
  /** 風險 ID */
  id: string;

  /** 風險編號，如 "R-001" */
  riskNumber: string;

  /** 風險標題 */
  title: string;

  /** 風險描述 */
  description: string;

  /** 風險類別 */
  category: RiskCategory;

  /** 發生機率（0-1 或 1-5） */
  probability: number;

  /** 影響程度（0-1 或 1-5） */
  impact: number;

  /** 風險分數 = probability × impact */
  riskScore: number;

  /** 風險等級 */
  riskLevel: RiskLevel;

  /** 潛在影響 */
  potentialImpacts: PotentialImpacts;

  /** 應對策略 */
  strategy: RiskStrategy;

  /** 減緩計畫（可選） */
  mitigationPlan?: string;

  /** 應急計畫（可選） */
  contingencyPlan?: string;

  /** 備援計畫（可選） */
  fallbackPlan?: string;

  /** 風險負責人 User ID */
  owner: string;

  /** 行動負責人 User ID（可選） */
  actionOwner?: string;

  /** 風險狀態 */
  status: RiskStatus;
}

/**
 * 風險管理接口
 * 定義任務的風險管理資訊，包含風險識別、評估、應對策略等
 *
 * @see @ETMS_DESIGN_SPEC.md I.21 風險管理 (Risk Management)
 */
export interface RiskManagement {
  /** 風險陣列 */
  risks: RiskItem[];
}

/**
 * 任務風險維度接口
 * 組合風險管理
 *
 * 此接口代表任務的完整風險資訊，用於風險識別和應對
 *
 * @see @ETMS_DESIGN_SPEC.md I. 風險維度
 */
export interface TaskRisk {
  /** 風險管理資訊 */
  risks?: RiskManagement;
}
