import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/common';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type IssuePhotoRow = Database['public']['Tables']['issue_photos']['Row'];
type IssuePhotoInsert = Database['public']['Tables']['issue_photos']['Insert'];
type IssuePhotoUpdate = Database['public']['Tables']['issue_photos']['Update'];

/**
 * IssuePhoto 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type IssuePhoto = IssuePhotoRow;
export type { IssuePhotoInsert, IssuePhotoUpdate };

/**
 * IssuePhoto Repository
 *
 * 提供问题照片相关的数据访问方法
 *
 * @example
 * ```typescript
 * const issuePhotoRepo = inject(IssuePhotoRepository);
 * issuePhotoRepo.findByIssueId('issue-id').subscribe(photos => {
 *   console.log('Issue photos:', photos);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class IssuePhotoRepository extends BaseRepository<IssuePhoto, IssuePhotoInsert, IssuePhotoUpdate> {
  protected tableName = 'issue_photos';

  /**
   * 根据问题 ID 查询问题照片
   *
   * @param issueId 问题 ID
   * @param options 查询选项
   * @returns Observable<IssuePhoto[]>
   */
  findByIssueId(issueId: string, options?: QueryOptions): Observable<IssuePhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        issueId // 会自动转换为 issue_id
      },
      orderBy: 'sequenceOrder', // 按顺序排序
      orderDirection: 'asc'
    });
  }

  /**
   * 根据文档 ID 查询问题照片
   *
   * @param documentId 文档 ID
   * @param options 查询选项
   * @returns Observable<IssuePhoto[]>
   */
  findByDocumentId(documentId: string, options?: QueryOptions): Observable<IssuePhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        documentId // 会自动转换为 document_id
      }
    });
  }

  /**
   * 根据照片类型查询问题照片
   *
   * @param photoType 照片类型
   * @param options 查询选项
   * @returns Observable<IssuePhoto[]>
   */
  findByPhotoType(photoType: string, options?: QueryOptions): Observable<IssuePhoto[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        photoType // 会自动转换为 photo_type
      }
    });
  }
}
