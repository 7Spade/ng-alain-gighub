/**
 * 数据管理相关类型定义（基础设施层）
 *
 * 这些类型被 Repository 层使用，因此放在 core 层
 * 符合分层架构：core 不依赖 shared
 *
 * @module core/infra/types
 */

/**
 * 文档类型枚举
 * 对应数据库 documents.document_type 字段
 */
export enum DocumentType {
  /** 设计图 */
  DESIGN = 'design',
  /** 规范文件 */
  SPECIFICATION = 'specification',
  /** 合约 */
  CONTRACT = 'contract',
  /** 报告 */
  REPORT = 'report',
  /** 其他 */
  OTHER = 'other'
}

/**
 * 文档状态枚举
 * 对应数据库 documents.status 字段
 */
export enum DocumentStatus {
  /** 草稿 */
  DRAFT = 'draft',
  /** 审核中 */
  UNDER_REVIEW = 'under_review',
  /** 已批准 */
  APPROVED = 'approved',
  /** 已归档 */
  ARCHIVED = 'archived'
}

/**
 * 文档版本状态枚举
 * 对应数据库 document_versions.version_status 字段
 */
export enum DocumentVersionStatus {
  /** 草稿 */
  DRAFT = 'draft',
  /** 当前版本 */
  CURRENT = 'current',
  /** 历史版本 */
  OBSOLETE = 'obsolete'
}

/**
 * 报告照片类型枚举
 * 对应数据库 report_photos.photo_type 字段
 */
export enum ReportPhotoType {
  /** 进度照片 */
  PROGRESS = 'progress',
  /** 现场照片 */
  SITE = 'site',
  /** 其他 */
  OTHER = 'other'
}

/**
 * 日报类型枚举
 * 对应数据库 daily_reports.report_type 字段
 */
export enum DailyReportType {
  /** 施工日报 */
  CONSTRUCTION = 'construction',
  /** 检查日报 */
  INSPECTION = 'inspection',
  /** 进度日报 */
  PROGRESS = 'progress'
}
