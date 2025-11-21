import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type DocumentVersionRow = Database['public']['Tables']['document_versions']['Row'];
type DocumentVersionInsert = Database['public']['Tables']['document_versions']['Insert'];
type DocumentVersionUpdate = Database['public']['Tables']['document_versions']['Update'];

/**
 * DocumentVersion 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type DocumentVersion = DocumentVersionRow;
export type { DocumentVersionInsert, DocumentVersionUpdate };

/**
 * DocumentVersion Repository
 *
 * 提供文档版本相关的数据访问方法
 *
 * @example
 * ```typescript
 * const versionRepo = inject(DocumentVersionRepository);
 * versionRepo.findByDocumentId('document-id').subscribe(versions => {
 *   console.log('Document versions:', versions);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentVersionRepository extends BaseRepository<DocumentVersion, DocumentVersionInsert, DocumentVersionUpdate> {
  protected tableName = 'document_versions';

  /**
   * 根据文档 ID 查询文档版本
   *
   * @param documentId 文档 ID
   * @param options 查询选项
   * @returns Observable<DocumentVersion[]>
   */
  findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentVersion[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        documentId // 会自动转换为 document_id
      },
      orderBy: 'versionNumber', // 按版本号排序
      orderDirection: 'desc'
    });
  }

  /**
   * 查询最新版本
   *
   * @param documentId 文档 ID
   * @returns Observable<DocumentVersion | null>
   */
  findLatestVersion(documentId: string): Observable<DocumentVersion | null> {
    return this.findAll({
      filters: {
        documentId
      },
      orderBy: 'versionNumber',
      orderDirection: 'desc'
    }).pipe(map(versions => (versions.length > 0 ? versions[0] : null)));
  }

  /**
   * 根据版本号查询文档版本
   *
   * @param documentId 文档 ID
   * @param versionNumber 版本号
   * @returns Observable<DocumentVersion | null>
   */
  findByVersionNumber(documentId: string, versionNumber: number): Observable<DocumentVersion | null> {
    return this.findAll({
      filters: {
        documentId,
        versionNumber // 会自动转换为 version_number
      }
    }).pipe(map(versions => (versions.length > 0 ? versions[0] : null)));
  }

  /**
   * 根据创建人 ID 查询文档版本
   *
   * @param createdBy 创建人 ID
   * @param options 查询选项
   * @returns Observable<DocumentVersion[]>
   */
  findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<DocumentVersion[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        createdBy // 会自动转换为 created_by
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }
}
