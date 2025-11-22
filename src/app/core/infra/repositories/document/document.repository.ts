import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type DocumentRow = Database['public']['Tables']['documents']['Row'];
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

/**
 * Document 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Document = DocumentRow;
export type { DocumentInsert, DocumentUpdate };

/**
 * Document Repository
 *
 * 提供文档相关的数据访问方法
 *
 * @example
 * ```typescript
 * const documentRepo = inject(DocumentRepository);
 * documentRepo.findByUploaderId('account-id').subscribe(documents => {
 *   console.log('Documents:', documents);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentRepository extends BaseRepository<Document, DocumentInsert, DocumentUpdate> {
  protected tableName = 'documents';

  /**
   * 根据上传人 ID 查询文档
   *
   * @param uploaderId 上传人 ID
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findByUploaderId(uploaderId: string, options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        uploaderId // 会自动转换为 uploader_id
      },
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 根据存储桶查询文档
   *
   * @param storageBucket 存储桶
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findByStorageBucket(storageBucket: string, options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        storageBucket // 会自动转换为 storage_bucket
      }
    });
  }

  /**
   * 根据文件类型查询文档
   *
   * @param fileType 文件类型
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findByFileType(fileType: string, options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        fileType // 会自动转换为 file_type
      }
    });
  }

  /**
   * 查询未删除的文件
   *
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findNotDeleted(options?: QueryOptions): Observable<Document[]> {
    // 未删除的文件：soft_deleted_at IS NULL
    // 需要使用 Supabase client 直接查询
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .is('soft_deleted_at', null);

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      query = query.order(snakeOrderBy, { ascending: options.orderDirection !== 'desc' });
    } else {
      query = query.order('uploaded_at', { ascending: false });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      query = query.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询未删除文件失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Document>(item));
      })
    );
  }

  /**
   * 查询公开文件
   *
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findPublicDocuments(options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        isPublic: true // 会自动转换为 is_public
      }
    });
  }

  /**
   * 根据上传来源查询文档
   *
   * @param uploadSource 上传来源
   * @param options 查询选项
   * @returns Observable<Document[]>
   */
  findByUploadSource(uploadSource: string, options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        uploadSource // 会自动转换为 upload_source
      }
    });
  }

  /**
   * 查询软删除的文件
   *
   * @returns Observable<Document[]>
   */
  findSoftDeleted(): Observable<Document[]> {
    // 软删除的文件：soft_deleted_at IS NOT NULL
    let query: any = this.supabase
      .from(this.tableName as any)
      .select('*')
      .not('soft_deleted_at', 'is', null)
      .order('soft_deleted_at', { ascending: false });

    return from(Promise.resolve(query) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '查询软删除文件失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Document>(item));
      })
    );
  }

  /**
   * 搜索文档（按文件名和描述）
   *
   * 使用全文搜索功能在文档的文件名和描述中查找匹配的关键字
   *
   * @param query 搜索关键字
   * @param options 搜索选项
   * @param options.documentType 按文档类型筛选
   * @param options.uploadSource 按上传来源筛选
   * @param options.blueprintId 按蓝图筛选
   * @param options.uploadedBy 按上传者筛选
   * @param options.page 页码（默认 1）
   * @param options.pageSize 每页数量（默认 50）
   * @returns Observable<Document[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"设计图"的文档
   * documentRepo.search('设计图').subscribe(documents => {
   *   console.log('Found documents:', documents);
   * });
   *
   * // 搜索PDF类型的文档
   * documentRepo.search('设计图', { documentType: 'pdf' }).subscribe(documents => {
   *   console.log('PDF documents:', documents);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      documentType?: string;
      uploadSource?: string;
      blueprintId?: string;
      uploadedBy?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<Document[]> {
    // 构建基础查询
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .or(`file_name.ilike.%${query}%,description.ilike.%${query}%`)
      .is('soft_deleted_at', null) as any; // 排除软删除的文档

    // 应用筛选条件
    if (options?.documentType) {
      supabaseQuery = supabaseQuery.eq('document_type', options.documentType);
    }

    if (options?.uploadSource) {
      supabaseQuery = supabaseQuery.eq('upload_source', options.uploadSource);
    }

    if (options?.blueprintId) {
      supabaseQuery = supabaseQuery.eq('blueprint_id', options.blueprintId);
    }

    if (options?.uploadedBy) {
      supabaseQuery = supabaseQuery.eq('uploaded_by', options.uploadedBy);
    }

    // 应用分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按上传时间倒序排序
    supabaseQuery = supabaseQuery.order('uploaded_at', { ascending: false });

    return from(Promise.resolve(supabaseQuery) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '搜索文档失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Document>(item));
      })
    );
  }
}
