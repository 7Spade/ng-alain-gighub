/**
 * 品质检查相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 品质检查状态枚举
 * 对应数据库 quality_checks.status 字段
 */
export enum QualityCheckStatus {
  /** 待检查 */
  PENDING = 'pending',
  /** 检查中 */
  IN_PROGRESS = 'in_progress',
  /** 已通过 */
  PASSED = 'passed',
  /** 未通过 */
  FAILED = 'failed',
  /** 条件通过 */
  CONDITIONAL_PASS = 'conditional_pass',
  /** 需重检 */
  RECHECK_REQUIRED = 'recheck_required'
}

/**
 * QC 照片类型枚举
 * 对应数据库 qc_photos.photo_type 字段
 */
export enum QcPhotoType {
  /** 检查前 */
  BEFORE = 'before',
  /** 检查中 */
  DURING = 'during',
  /** 检查后 */
  AFTER = 'after',
  /** 缺陷 */
  DEFECT = 'defect'
}

/**
 * 检查照片类型枚举
 * 对应数据库 inspection_photos.photo_type 字段
 */
export enum InspectionPhotoType {
  /** 现场照片 */
  SITE = 'site',
  /** 问题照片 */
  ISSUE = 'issue',
  /** 进度照片 */
  PROGRESS = 'progress'
}

/**
 * 检查状态枚举
 * 对应数据库 inspections.status 字段
 *
 * @description 定义检查的各种状态
 */
export enum InspectionStatus {
  /** 待检查 */
  PENDING = 'pending',
  /** 检查中 */
  IN_PROGRESS = 'in_progress',
  /** 已通过 */
  PASSED = 'passed',
  /** 未通过 */
  FAILED = 'failed',
  /** 已完成 */
  COMPLETED = 'completed'
}

/**
 * 检查类型枚举
 * 对应数据库 inspections.inspection_type 字段
 *
 * @description 定义检查的类型分类
 */
export enum InspectionType {
  /** 现场检查 */
  SITE = 'site',
  /** 文件检查 */
  DOCUMENT = 'document',
  /** 进度检查 */
  PROGRESS = 'progress',
  /** 安全检查 */
  SAFETY = 'safety',
  /** 质量检查 */
  QUALITY = 'quality'
}
