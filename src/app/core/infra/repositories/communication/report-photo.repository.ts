import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from '../base.repository';
import { Database } from '../../types/common';

/**
 * ReportPhoto 实体类型（camelCase）
 */
type ReportPhotoRow = Database['public']['Tables']['report_photos']['Row'];
type ReportPhotoInsert = Database['public']['Tables']['report_photos']['Insert'];
type ReportPhotoUpdate = Database['public']['Tables']['report_photos']['Update'];

export type ReportPhoto = ReportPhotoRow;
export type { ReportPhotoInsert, ReportPhotoUpdate };

/**
 * ReportPhoto Repository
 *
 * 提供报告照片相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class ReportPhotoRepository extends BaseRepository<ReportPhoto, ReportPhotoInsert, ReportPhotoUpdate> {
  protected tableName = 'report_photos';

  /**
   * 根据报告 ID 查询照片
   *
   * @param reportId 报告 ID
   * @param options 查询选项
   * @returns Observable<ReportPhoto[]>
   */
  findByReportId(reportId: string, options?: QueryOptions): Observable<ReportPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        reportId // 会自动转换为 report_id
      },
      orderBy: 'sequence_order',
      orderDirection: 'asc'
    });
  }

  /**
   * 根据文档 ID 查询照片
   *
   * @param documentId 文档 ID
   * @param options 查询选项
   * @returns Observable<ReportPhoto[]>
   */
  findByDocumentId(documentId: string, options?: QueryOptions): Observable<ReportPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        documentId // 会自动转换为 document_id
      }
    });
  }

  /**
   * 根据上传者 ID 查询照片
   *
   * @param uploadedBy 上传者 ID
   * @param options 查询选项
   * @returns Observable<ReportPhoto[]>
   */
  findByUploadedBy(uploadedBy: string, options?: QueryOptions): Observable<ReportPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        uploadedBy // 会自动转换为 uploaded_by
      }
    });
  }
}
