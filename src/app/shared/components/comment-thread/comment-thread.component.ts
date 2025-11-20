import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

export interface CommentData {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: CommentData[];
  mentions?: string[];
}

/**
 * 討論串元件
 *
 * 用途：巢狀留言討論，支援 @提及和即時更新
 *
 * @example
 * ```html
 * <app-comment-thread
 *   [comments]="comments()"
 *   [currentUserId]="userId()"
 *   (commentSubmit)="handleSubmit($event)"
 *   (commentEdit)="handleEdit($event)"
 *   (commentDelete)="handleDelete($event)" />
 * ```
 */
@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="comment-thread">
      <!-- Add comment -->
      <div class="comment-editor">
        <nz-comment>
          <nz-avatar nz-comment-avatar [nzSrc]="currentUserAvatar() || undefined" [nzText]="currentUserName().charAt(0)" />
          <nz-comment-content>
            <textarea
              nz-input
              [(ngModel)]="newCommentText"
              [placeholder]="'輸入留言... 使用 @ 提及其他人'"
              [nzAutosize]="{ minRows: 3, maxRows: 6 }"
              (keydown.enter)="handleKeyDown($event)"
            >
            </textarea>
            <div class="comment-actions">
              <button nz-button nzType="primary" nzSize="small" [disabled]="!newCommentText.trim()" (click)="submitComment()">
                <span nz-icon nzType="send"></span>
                發送
              </button>
              <button nz-button nzType="default" nzSize="small" (click)="cancelComment()"> 取消 </button>
            </div>
          </nz-comment-content>
        </nz-comment>
      </div>

      <!-- Comment list -->
      <nz-list [nzDataSource]="topLevelComments()" [nzRenderItem]="commentTemplate" class="comment-list">
        <ng-template #commentTemplate let-comment>
          <nz-comment>
            <nz-avatar nz-comment-avatar [nzSrc]="comment.authorAvatar || undefined" [nzText]="comment.authorName.charAt(0)" />

            <nz-comment-content>
              <p class="comment-author">
                {{ comment.authorName }}
                <span class="comment-time">{{ comment.createdAt | date: 'yyyy-MM-dd HH:mm' }}</span>
              </p>

              <div class="comment-text" [innerHTML]="formatCommentContent(comment.content)"></div>

              @if (comment.updatedAt && comment.updatedAt !== comment.createdAt) {
                <span class="comment-edited">(已編輯)</span>
              }

              <div class="comment-actions-inline">
                <button nz-button nzType="link" nzSize="small" (click)="replyToComment(comment)">
                  <span nz-icon nzType="message"></span>
                  回覆
                </button>

                @if (canEditComment(comment)) {
                  <button nz-button nzType="link" nzSize="small" (click)="editComment(comment)">
                    <span nz-icon nzType="edit"></span>
                    編輯
                  </button>
                }

                @if (canDeleteComment(comment)) {
                  <button nz-button nzType="link" nzSize="small" nzDanger (click)="deleteComment(comment)">
                    <span nz-icon nzType="delete"></span>
                    刪除
                  </button>
                }
              </div>

              <!-- Nested replies -->
              @if (comment.replies && comment.replies.length > 0) {
                <div class="comment-replies">
                  @for (reply of comment.replies; track reply.id) {
                    <app-comment-thread
                      [comments]="[reply]"
                      [currentUserId]="currentUserId()"
                      [currentUserName]="currentUserName()"
                      [currentUserAvatar]="currentUserAvatar()"
                      [isNested]="true"
                      (commentSubmit)="commentSubmit.emit($event)"
                      (commentEdit)="commentEdit.emit($event)"
                      (commentDelete)="commentDelete.emit($event)"
                      (commentReply)="commentReply.emit($event)"
                    />
                  }
                </div>
              }
            </nz-comment-content>
          </nz-comment>
        </ng-template>
      </nz-list>

      @if (comments().length === 0 && !isNested()) {
        <nz-empty nzNotFoundContent="暫無留言" />
      }
    </div>
  `,
  styles: [
    `
      .comment-thread {
        width: 100%;
      }

      .comment-editor {
        margin-bottom: 24px;
      }

      .comment-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .comment-list {
        :host ::ng-deep .ant-list-item {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 0;
        }
      }

      .comment-author {
        font-weight: 500;
        margin-bottom: 8px;
      }

      .comment-time {
        margin-left: 8px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        font-weight: normal;
      }

      .comment-text {
        line-height: 1.6;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;

        :host ::ng-deep .mention {
          color: #1890ff;
          font-weight: 500;
        }
      }

      .comment-edited {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
        font-style: italic;
      }

      .comment-actions-inline {
        display: flex;
        gap: 4px;
        margin-top: 8px;
      }

      .comment-replies {
        margin-left: 48px;
        margin-top: 16px;
        padding-left: 16px;
        border-left: 2px solid #f0f0f0;
      }
    `
  ]
})
export class CommentThreadComponent {
  /** 留言列表 */
  comments = input.required<CommentData[]>();

  /** 當前用戶 ID */
  currentUserId = input.required<string>();

  /** 當前用戶名稱 */
  currentUserName = input<string>('');

  /** 當前用戶頭像 */
  currentUserAvatar = input<string>();

  /** 是否為巢狀顯示 */
  isNested = input<boolean>(false);

  /** 提交留言事件 */
  readonly commentSubmit = output<{ content: string; parentId?: string }>();

  /** 編輯留言事件 */
  readonly commentEdit = output<{ commentId: string; content: string }>();

  /** 刪除留言事件 */
  readonly commentDelete = output<string>();

  /** 回覆留言事件 */
  readonly commentReply = output<CommentData>();

  /** 新留言內容 */
  newCommentText = '';

  /** 頂層留言（不包含回覆） */
  topLevelComments = () => this.comments().filter(c => !c.parentId);

  /**
   * 提交留言
   */
  submitComment(parentId?: string): void {
    const content = this.newCommentText.trim();
    if (content) {
      this.commentSubmit.emit({ content, parentId });
      this.newCommentText = '';
    }
  }

  /**
   * 取消留言
   */
  cancelComment(): void {
    this.newCommentText = '';
  }

  /**
   * 回覆留言
   */
  replyToComment(comment: CommentData): void {
    this.commentReply.emit(comment);
  }

  /**
   * 編輯留言
   */
  editComment(comment: CommentData): void {
    // 觸發編輯事件，由父元件處理編輯邏輯
    this.commentEdit.emit({ commentId: comment.id, content: comment.content });
  }

  /**
   * 刪除留言
   */
  deleteComment(comment: CommentData): void {
    this.commentDelete.emit(comment.id);
  }

  /**
   * 檢查是否可以編輯留言
   */
  canEditComment(comment: CommentData): boolean {
    return comment.authorId === this.currentUserId();
  }

  /**
   * 檢查是否可以刪除留言
   */
  canDeleteComment(comment: CommentData): boolean {
    return comment.authorId === this.currentUserId();
  }

  /**
   * 格式化留言內容（處理 @提及）
   */
  formatCommentContent(content: string): string {
    // 將 @username 轉換為 HTML
    return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  }

  /**
   * 處理 Enter 鍵
   */
  handleKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.submitComment();
    }
  }
}
