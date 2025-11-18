import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

/**
 * InspectionPhoto 实体类型（camelCase）
 */
type InspectionPhotoRow = Database['public']['Tables']['inspection_photos']['Row'];
type InspectionPhotoInsert = Database['public']['Tables']['inspection_photos']['Insert'];
type InspectionPhotoUpdate = Database['public']['Tables']['inspection_photos']['Update'];

export type InspectionPhoto = InspectionPhotoRow;
export type { InspectionPhotoInsert, InspectionPhotoUpdate };

/**
 * InspectionPhoto Repository
 *
 * 提供验收照片相关的数据访问方法
 */
@Injectable({
  providedIn: 'root'
})
export class InspectionPhotoRepository extends BaseRepository<InspectionPhoto, InspectionPhotoInsert, InspectionPhotoUpdate> {
  protected tableName = 'inspection_photos';

  /**
   * 根据验收记录 ID 查询照片
   *
   * @param inspectionId 验收记录 ID
   * @param options 查询选项
   * @returns Observable<InspectionPhoto[]>
   */
  findByInspectionId(inspectionId: string, options?: QueryOptions): Observable<InspectionPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        inspectionId // 会自动转换为 inspection_id
      },
      orderBy: 'sequence_order',
      orderDirection: 'asc'
    });
  }

  /**
   * 根据照片类型查询
   *
   * @param photoType 照片类型
   * @param options 查询选项
   * @returns Observable<InspectionPhoto[]>
   */
  findByPhotoType(photoType: string, options?: QueryOptions): Observable<InspectionPhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        photoType // 会自动转换为 photo_type
      },
      orderBy: 'uploaded_at',
      orderDirection: 'desc'
    });
  }
}
