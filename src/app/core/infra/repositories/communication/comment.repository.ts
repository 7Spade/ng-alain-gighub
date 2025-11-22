import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { handleSupabaseResponse } from '../../errors/supabase-error.transformer';
import { Database } from '../../types/common';
import { toCamelCaseData } from '../../utils/transformers';
import { BaseRepository, QueryOptions } from '../base.repository';

/**
 * 从数据库类型中提取原始类型（snake_case）
 */
type CommentRow = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];
type CommentUpdate = Database['public']['Tables']['comments']['Update'];

/**
 * Comment 实体类型（camelCase）
 * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 */
export type Comment = CommentRow;
export type { CommentInsert, CommentUpdate };

/**
 * Comment Repository
 *
 * 提供留言/评论相关的数据访问方法
 *
 * @example
 * ```typescript
 * const commentRepo = inject(CommentRepository);
 * commentRepo.findByCommentableId('Task', 'task-id').subscribe(comments => {
 *   console.log('Comments:', comments);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CommentRepository extends BaseRepository<Comment, CommentInsert, CommentUpdate> {
  protected tableName = 'comments';

  /**
   * 根据可评论类型查询评论
   *
   * @param commentableType 可评论类型（如 'Task', 'Issue'）
   * @param options 查询选项
   * @returns Observable<Comment[]>
   */
  findByCommentableType(commentableType: string, options?: QueryOptions): Observable<Comment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        commentableType // 会自动转换为 commentable_type
      }
    });
  }

  /**
   * 根据可评论对象查询评论
   *
   * @param commentableType 可评论类型
   * @param commentableId 可评论对象 ID
   * @param options 查询选项
   * @returns Observable<Comment[]>
   */
  findByCommentableId(commentableType: string, commentableId: string, options?: QueryOptions): Observable<Comment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        commentableType,
        commentableId // 会自动转换为 commentable_id
      },
      orderBy: 'createdAt',
      orderDirection: 'asc'
    });
  }

  /**
   * 根据父评论 ID 查询评论（嵌套回复）
   *
   * @param parentCommentId 父评论 ID
   * @param options 查询选项
   * @returns Observable<Comment[]>
   */
  findByParentCommentId(parentCommentId: string, options?: QueryOptions): Observable<Comment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        parentCommentId // 会自动转换为 parent_comment_id
      },
      orderBy: 'createdAt',
      orderDirection: 'asc'
    });
  }

  /**
   * 根据作者 ID 查询评论
   *
   * @param authorId 作者 ID
   * @param options 查询选项
   * @returns Observable<Comment[]>
   */
  findByAuthorId(authorId: string, options?: QueryOptions): Observable<Comment[]> {
    return this.findAll({
      ...options,
      filters: {
        ...options?.filters,
        authorId // 会自动转换为 author_id
      },
      orderBy: 'createdAt',
      orderDirection: 'desc'
    });
  }

  /**
   * 查询根评论（无父评论）
   *
   * @param commentableType 可评论类型
   * @param commentableId 可评论对象 ID
   * @returns Observable<Comment[]>
   */
  findRootComments(commentableType: string, commentableId: string): Observable<Comment[]> {
    return this.findAll({
      filters: {
        commentableType,
        commentableId,
        parentCommentId: null // 根评论没有父评论
      },
      orderBy: 'createdAt',
      orderDirection: 'asc'
    });
  }

  /**
   * 搜索评论（按内容）
   *
   * 使用全文搜索功能在评论内容中查找匹配的关键字
   *
   * @param query 搜索关键字
   * @param options 搜索选项
   * @param options.commentableType 按可评论类型筛选
   * @param options.commentableId 按可评论对象筛选
   * @param options.authorId 按作者筛选
   * @param options.page 页码（默认 1）
   * @param options.pageSize 每页数量（默认 50）
   * @returns Observable<Comment[]>
   *
   * @example
   * ```typescript
   * // 搜索包含"问题"的评论
   * commentRepo.search('问题').subscribe(comments => {
   *   console.log('Found comments:', comments);
   * });
   *
   * // 搜索任务相关的评论
   * commentRepo.search('问题', {
   *   commentableType: 'Task'
   * }).subscribe(comments => {
   *   console.log('Task comments:', comments);
   * });
   * ```
   */
  search(
    query: string,
    options?: {
      commentableType?: string;
      commentableId?: string;
      authorId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Observable<Comment[]> {
    // 构建基础查询
    let supabaseQuery = this.supabase
      .from(this.tableName as any)
      .select('*')
      .ilike('content', `%${query}%`) as any;

    // 应用筛选条件
    if (options?.commentableType) {
      supabaseQuery = supabaseQuery.eq('commentable_type', options.commentableType);
    }

    if (options?.commentableId) {
      supabaseQuery = supabaseQuery.eq('commentable_id', options.commentableId);
    }

    if (options?.authorId) {
      supabaseQuery = supabaseQuery.eq('author_id', options.authorId);
    }

    // 应用分页
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 50;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    supabaseQuery = supabaseQuery.range(fromIndex, toIndex);

    // 按创建时间倒序排序
    supabaseQuery = supabaseQuery.order('created_at', { ascending: false });

    return from(Promise.resolve(supabaseQuery) as Promise<PostgrestResponse<any>>).pipe(
      map((response: PostgrestResponse<any>) => {
        const data = handleSupabaseResponse(response, `${this.constructor.name}.search`);
        return Array.isArray(data) ? data.map(item => toCamelCaseData<Comment>(item)) : [toCamelCaseData<Comment>(data)];
      })
    );
  }
}
