import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseRepository, QueryOptions } from './base.repository';
import { Database } from '../types/database.types';

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
}
