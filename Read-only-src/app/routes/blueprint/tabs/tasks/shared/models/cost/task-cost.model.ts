/**
 * Task Cost Model
 *
 * 任務成本維度模型
 * 對應 @ETMS_DESIGN_SPEC.md 文件：G. 成本維度
 *
 * 包含：
 * - 預算與支出（Budget & Expense）：預算、實際支出、成本分項
 * - 折扣與加價（Discount & Markup）
 *
 * @see @ETMS_DESIGN_SPEC.md G. 成本維度
 */

/**
 * 貨幣類型
 * 定義貨幣類型
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense) - budgetCurrency
 */
export type Currency = 'TWD' | 'USD' | 'EUR' | 'JPY';

/**
 * 成本類型
 * 定義成本的分類
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense) - costType
 */
export type CostType = 'direct' | 'indirect' | 'fixed' | 'variable';

/**
 * 成本分項接口
 * 定義成本的各項分項
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense) - costBreakdown
 */
export interface CostBreakdown {
  /** 人工成本 */
  labor: number;

  /** 材料成本 */
  material: number;

  /** 機具成本 */
  equipment: number;

  /** 外包成本 */
  subcontract: number;

  /** 管理費 */
  overhead: number;

  /** 應急費 */
  contingency: number;

  /** 利潤 */
  profit: number;

  /** 其他成本 */
  other: number;
}

/**
 * 折扣接口
 * 定義折扣資訊
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense) - discount
 */
export interface Discount {
  /** 折扣百分比 */
  percentage: number;

  /** 折扣金額 */
  amount: number;

  /** 折扣原因 */
  reason: string;
}

/**
 * 加價接口
 * 定義加價資訊
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense) - markup
 */
export interface Markup {
  /** 加價百分比 */
  percentage: number;

  /** 加價金額 */
  amount: number;
}

/**
 * 預算與支出接口
 * 定義任務的預算和支出資訊，包含預算、實際支出、成本分項等
 *
 * @see @ETMS_DESIGN_SPEC.md G.19 預算與支出 (Budget & Expense)
 */
export interface BudgetAndExpense {
  /** 成本資訊 */
  cost: {
    /** 預算金額 */
    budgetAmount: number;

    /** 預算貨幣 */
    budgetCurrency: Currency;

    /** 匯率（可選） */
    exchangeRate?: number;

    /** 實際支出 */
    actualCost: number;

    /** 已承諾成本（已下訂但未付款） */
    committedCost: number;

    /** 剩餘預算 */
    remainingBudget: number;

    /** 成本分項 */
    costBreakdown: CostBreakdown;

    /** 成本類型 */
    costType: CostType;

    /** 折扣（可選） */
    discount?: Discount;

    /** 加價（可選） */
    markup?: Markup;
  };
}

/**
 * 任務成本維度接口
 * 組合預算與支出
 *
 * 此接口代表任務的完整成本資訊，用於成本管理和預算控制
 *
 * @see @ETMS_DESIGN_SPEC.md G. 成本維度
 */
export interface TaskCost {
  /** 預算與支出資訊 */
  cost?: BudgetAndExpense;
}
