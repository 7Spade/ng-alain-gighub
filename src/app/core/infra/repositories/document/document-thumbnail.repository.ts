import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type DocumentThumbnailRow = Database['public']['Tables']['document_thumbnails']['Row'];
type DocumentThumbnailInsert = Database['public']['Tables']['document_thumbnails']['Insert'];
type DocumentThumbnailUpdate = Database['public']['Tables']['document_thumbnails']['Update'];

/**
 * DocumentThumbnail 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type DocumentThumbnail = DocumentThumbnailRow;
export type { DocumentThumbnailInsert, DocumentThumbnailUpdate };

/**
 * DocumentThumbnail Repository
 *
 * 提供文档缩图相关的数据访问方法
 *
 * @example
 * ```typescript
 * const thumbnailRepo = inject(DocumentThumbnailRepository);
 * thumbnailRepo.findByDocumentId('document-id').subscribe(thumbnails => {
 *   console.log('Thumbnails:', thumbnails);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentThumbnailRepository extends BaseRepository<DocumentThumbnail, DocumentThumbnailInsert, DocumentThumbnailUpdate> {
  protected tableName = 'document_thumbnails';

  /**
   * 根据文档 ID 查询文档缩图
   *
   * @param documentId 文档 ID
   * @param options 查询选项
   * @returns Observable<DocumentThumbnail[]>
   */
  findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentThumbnail[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        documentId // 会自动转换为 document_id
      }
    });
  }

  /**
   * 根据尺寸查询文档缩图
   *
   * @param documentId 文档 ID
   * @param thumbnailSize 缩图尺寸
   * @returns Observable<DocumentThumbnail | null>
   */
  findBySize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null> {
    return this.findAll({
      filters: {
        documentId,
        thumbnailSize // 会自动转换为 thumbnail_size
      }
    }).pipe(map(thumbnails => (thumbnails.length > 0 ? thumbnails[0] : null)));
  }

  /**
   * 查询指定文档和尺寸的缩图
   *
   * @param documentId 文档 ID
   * @param thumbnailSize 缩图尺寸
   * @returns Observable<DocumentThumbnail | null>
   */
  findByDocumentAndSize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null> {
    return this.findBySize(documentId, thumbnailSize);
  }
}
