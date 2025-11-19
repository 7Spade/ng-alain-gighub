import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type QcPhotoRow = Database['public']['Tables']['qc_photos']['Row'];
type QcPhotoInsert = Database['public']['Tables']['qc_photos']['Insert'];
type QcPhotoUpdate = Database['public']['Tables']['qc_photos']['Update'];

/**
 * QcPhoto 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type QcPhoto = QcPhotoRow;
export type { QcPhotoInsert, QcPhotoUpdate };

/**
 * QcPhoto Repository
 *
 * 提供品质检查照片相关的数据访问方法
 *
 * @example
 * ```typescript
 * const qcPhotoRepo = inject(QcPhotoRepository);
 * qcPhotoRepo.findByQcId('qc-id').subscribe(photos => {
 *   console.log('QC photos:', photos);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class QcPhotoRepository extends BaseRepository<QcPhoto, QcPhotoInsert, QcPhotoUpdate> {
  protected tableName = 'qc_photos';

  /**
   * 根据品质检查 ID 查询照片
   *
   * @param qcId 品质检查 ID
   * @param options 查询选项
   * @returns Observable<QcPhoto[]>
   */
  findByQcId(qcId: string, options?: QueryOptions): Observable<QcPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        qcId // 会自动转换为 qc_id
      },
      orderBy: 'sequenceOrder', // 按顺序排序
      orderDirection: 'asc'
    });
  }

  /**
   * 根据文档 ID 查询照片
   *
   * @param documentId 文档 ID
   * @param options 查询选项
   * @returns Observable<QcPhoto[]>
   */
  findByDocumentId(documentId: string, options?: QueryOptions): Observable<QcPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        documentId // 会自动转换为 document_id
      }
    });
  }

  /**
   * 根据照片类型查询照片
   *
   * @param photoType 照片类型
   * @param options 查询选项
   * @returns Observable<QcPhoto[]>
   */
  findByPhotoType(photoType: string, options?: QueryOptions): Observable<QcPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        photoType // 会自动转换为 photo_type
      }
    });
  }

  /**
   * 根据上传人 ID 查询照片
   *
   * @param uploadedBy 上传人 ID
   * @param options 查询选项
   * @returns Observable<QcPhoto[]>
   */
  findByUploadedBy(uploadedBy: string, options?: QueryOptions): Observable<QcPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        uploadedBy // 会自动转换为 uploaded_by
      },
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    });
  }
}
