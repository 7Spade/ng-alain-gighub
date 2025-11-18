import { Injectable, inject, signal, computed } from '@angular/core';
import { CommentRepository } from '@core';
import { Comment, CommentInsert, CommentUpdate } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Comment Detail
 *
 * 聚合留言相關資訊（包含回覆）
 */
export interface CommentDetail extends Comment {
  replies?: Comment[];
  author?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

/**
 * Comment Service
 *
 * 提供留言相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援功能：
 * - 巢狀回覆
 * - @提及功能
 * - Realtime 即時訊息（配合 Supabase Realtime）
 *
 * @example
 * ```typescript
 * const commentService = inject(CommentService);
 *
 * // 載入資源的留言
 * await commentService.loadByResource('task', 'task-id');
 *
 * // 訂閱留言狀態
 * effect(() => {
 *   console.log('Comments:', commentService.comments());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentRepository = inject(CommentRepository);

  // 使用 Signals 管理狀態
  private commentsState = signal<Comment[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly comments = this.commentsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly topLevelComments = computed(() => this.comments().filter(c => !c.parentCommentId));

  readonly commentCount = computed(() => this.comments().length);

  readonly recentComments = computed(() =>
    [...this.comments()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10)
  );

  /**
   * 載入指定資源的所有留言
   */
  async loadByResource(resourceType: string, resourceId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.commentRepository.findByCommentableId(resourceType, resourceId));
      this.commentsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入留言失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定任務的留言
   */
  async loadByTask(taskId: string): Promise<void> {
    return this.loadByResource('task', taskId);
  }

  /**
   * 載入指定問題的留言
   */
  async loadByIssue(issueId: string): Promise<void> {
    return this.loadByResource('issue', issueId);
  }

  /**
   * 載入指定 PR 的留言
   */
  async loadByPullRequest(prId: string): Promise<void> {
    return this.loadByResource('pull_request', prId);
  }

  /**
   * 創建新留言
   */
  async create(data: CommentInsert): Promise<Comment> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const comment = await firstValueFrom(this.commentRepository.create(data));

      // 更新本地狀態
      this.commentsState.update(current => [...current, comment]);

      return comment;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建留言失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 回覆留言（創建巢狀回覆）
   */
  async reply(parentCommentId: string, data: Omit<CommentInsert, 'parentCommentId'>): Promise<Comment> {
    return this.create({
      ...data,
      parentCommentId
    });
  }

  /**
   * 更新留言
   */
  async update(id: string, data: CommentUpdate): Promise<Comment> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.commentRepository.update(id, data));

      // 更新本地狀態
      this.commentsState.update(current => current.map(c => (c.id === id ? updated : c)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新留言失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除留言
   */
  async delete(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.commentRepository.delete(id));

      // 更新本地狀態
      this.commentsState.update(current => current.filter(c => c.id !== id));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除留言失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 標記留言為已讀
   */
  async markAsRead(id: string): Promise<Comment> {
    return this.update(id, { isRead: true });
  }

  /**
   * 取得留言的回覆
   */
  getReplies(parentCommentId: string): Comment[] {
    return this.comments().filter(c => c.parentCommentId === parentCommentId);
  }

  /**
   * 建構留言樹狀結構
   */
  buildCommentTree(): CommentDetail[] {
    const comments = this.comments();
    const topLevel = comments.filter(c => !c.parentCommentId);

    const buildTree = (comment: Comment): CommentDetail => {
      const replies = comments.filter(c => c.parentCommentId === comment.id).map(buildTree);

      return {
        ...comment,
        replies: replies.length > 0 ? replies : undefined
      };
    };

    return topLevel.map(buildTree);
  }

  /**
   * 解析留言中的 @提及
   */
  extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.commentsState.set([]);
    this.errorState.set(null);
  }
}
