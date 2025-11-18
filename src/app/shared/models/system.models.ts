import { Database } from '@core';

/**
 * 系统管理数据模型
 *
 * 对应数据库表：
 * - settings: 系统设定表
 * - feature_flags: 功能开关表
 *
 * @module shared/models/system
 */

/**
 * Setting 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Setting = Database['public']['Tables']['settings']['Row'];
export type SettingInsert = Database['public']['Tables']['settings']['Insert'];
export type SettingUpdate = Database['public']['Tables']['settings']['Update'];

/**
 * FeatureFlag 实体类型（camelCase）
 */
export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];
export type FeatureFlagInsert = Database['public']['Tables']['feature_flags']['Insert'];
export type FeatureFlagUpdate = Database['public']['Tables']['feature_flags']['Update'];
