import { Database, QualityCheckStatus } from '@core';

/**
 * 品质验收系统数据模型
 *
 * 对应数据库表：
 * - quality_checks: 品质管理表（品管检查记录）
 * - qc_photos: 品管照片表
 * - inspections: 验收表（最终验收/责任切割）
 * - inspection_photos: 验收照片表
 *
 * @module shared/models/quality
 */

/**
 * QualityCheck 数据库类型（snake_case）
 */
type QualityCheckDb = Database['public']['Tables']['quality_checks']['Row'];
type QualityCheckInsertDb = Database['public']['Tables']['quality_checks']['Insert'];
type QualityCheckUpdateDb = Database['public']['Tables']['quality_checks']['Update'];

/**
 * QualityCheck 实体类型（camelCase）
 * 應用層使用 camelCase 屬性名稱
 */
export interface QualityCheck {
  id: string;
  taskId: string;
  stagingId: string | null;
  inspectorId: string;
  checkType: string | null;
  status: string | null;
  checkItems: unknown[] | null;
  findings: string | null;
  recommendations: string | null;
  checkedAt: string | null;
  completedAt: string | null;
}

/**
 * QualityCheck 插入類型（camelCase）
 */
export interface QualityCheckInsert {
  taskId: string;
  stagingId?: string | null;
  inspectorId: string;
  checkType?: string | null;
  status?: string | null;
  checkItems?: unknown[] | null;
  findings?: string | null;
  recommendations?: string | null;
  checkedAt?: string | null;
  completedAt?: string | null;
}

/**
 * QualityCheck 更新類型（camelCase）
 */
export interface QualityCheckUpdate {
  status?: string | null;
  checkItems?: unknown[] | null;
  findings?: string | null;
  recommendations?: string | null;
  checkedAt?: string | null;
  completedAt?: string | null;
}

/**
 * QcPhoto 实体类型（camelCase）
 */
export type QcPhoto = Database['public']['Tables']['qc_photos']['Row'];
export type QcPhotoInsert = Database['public']['Tables']['qc_photos']['Insert'];
export type QcPhotoUpdate = Database['public']['Tables']['qc_photos']['Update'];

/**
 * Inspection 实体类型（camelCase）
 */
export type Inspection = Database['public']['Tables']['inspections']['Row'];
export type InspectionInsert = Database['public']['Tables']['inspections']['Insert'];
export type InspectionUpdate = Database['public']['Tables']['inspections']['Update'];

/**
 * InspectionPhoto 实体类型（camelCase）
 */
export type InspectionPhoto = Database['public']['Tables']['inspection_photos']['Row'];
export type InspectionPhotoInsert = Database['public']['Tables']['inspection_photos']['Insert'];
export type InspectionPhotoUpdate = Database['public']['Tables']['inspection_photos']['Update'];

/**
 * 检查類型
 * 保留原有枚举定义以保持向后兼容
 */
export enum QualityCheckType {
  ROUTINE = 'routine', // 例行檢查
  MILESTONE = 'milestone', // 里程碑檢查
  FINAL = 'final', // 最終驗收
  SPOT_CHECK = 'spot_check' // 抽查
}

/**
 * 檢查狀態
 * 統一從 core/types 重新導出，避免重複定義
 * @see core/infra/types/quality/quality.types.ts
 */
export { QualityCheckStatus };

/**
 * 檢查項目
 * 保留原有接口定义以保持向后兼容
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
 * 品質檢查詳情（包含關聯資料）
 * 使用 camelCase 屬性名稱以保持與應用層一致
 * 注意：不直接繼承 QualityCheck（數據庫類型，snake_case），而是明確定義 camelCase 屬性
 */
export interface QualityCheckDetail {
  // 基本屬性（camelCase）
  id: string;
  taskId: string | null;
  stagingId: string | null;
  inspectorId: string | null;
  checkType: string | null;
  status: string | null;
  checkItems: unknown[] | null;
  findings: string | null;
  recommendations: string | null;
  checkedAt: string | null;
  completedAt: string | null;

  // 關聯資料
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
