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
   * 根据蓝图 ID 查询文档
   *
   * @param blueprintId 蓝图 ID
   * @param options 查询选项
   * @returns Observable<Document[]>
   *
   * @example
   * ```typescript
   * documentRepository.findByBlueprintId('blueprint-123')
   *   .subscribe(documents => console.log('文档:', documents));
   * ```
   */
  findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Document[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        blueprintId // 会自动转换为 blueprint_id
      },
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 搜索文档（支持模糊查询）
   *
   * @param query 搜索关键词 - 用于搜索文档文件名和描述
   * @param options 查询选项 - 包含排序、分页等配置
   * @returns Observable<Document[]> - 返回匹配的文档列表
   * @throws Error - 当查询失败时抛出错误
   *
   * @example
   * ```typescript
   * documentRepository.search('设计图', { page: 1, pageSize: 10 })
   *   .subscribe(documents => console.log('搜索结果:', documents));
   * ```
   */
  search(query: string, options?: QueryOptions): Observable<Document[]> {
    if (!query || query.trim().length === 0) {
      return from(Promise.resolve([]));
    }

    const trimmedQuery = query.trim();
    let searchQuery = this.supabase
      .from(this.tableName as any)
      .select(options?.select || '*')
      .or(`file_name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`) as any;

    // 应用排序
    if (options?.orderBy) {
      const snakeOrderBy = options.orderBy.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      searchQuery = searchQuery.order(snakeOrderBy, {
        ascending: options.orderDirection !== 'desc'
      });
    } else {
      searchQuery = searchQuery.order('uploaded_at', { ascending: false });
    }

    // 应用分页
    if (options?.page && options?.pageSize) {
      const fromIndex = (options.page - 1) * options.pageSize;
      const toIndex = fromIndex + options.pageSize - 1;
      searchQuery = searchQuery.range(fromIndex, toIndex);
    }

    return from(Promise.resolve(searchQuery) as Promise<{ data: any[] | null; error: any }>).pipe(
      map((response: { data: any[] | null; error: any }) => {
        if (response.error) {
          throw new Error(response.error.message || '搜索文档失败');
        }
        return (response.data || []).map(item => toCamelCaseData<Document>(item));
      })
    );
  }
}
