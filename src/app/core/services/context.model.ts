/**
 * 應用上下文模型
 *
 * 定義應用上下文的類型和結構，用於全局狀態管理
 */

/**
 * 上下文類型
 */
export type AppContextType = 'personal' | 'organization' | 'team';

/**
 * 應用上下文介面
 */
export interface AppContext {
  /** 上下文類型 */
  type: AppContextType;
  /** 上下文關聯的 ID（個人時為 null） */
  id?: string | null;
  /** 上下文名稱（用於顯示） */
  name?: string;
  /** 額外的上下文資料 */
  data?: Record<string, any>;
}
