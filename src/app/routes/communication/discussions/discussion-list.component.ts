import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { CommentRepository } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { map } from 'rxjs/operators';

/**
 * Discussion thread interface
 * Discussions are comment threads grouped by entity
 */
interface DiscussionThread {
  id: string;
  commentable_type: string;
  commentable_id: string;
  entity_title: string;
  first_comment: string;
  first_author: string;
  reply_count: number;
  last_reply_at: string;
  created_at: string;
}

@Component({
  selector: 'app-discussion-list',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'讨论区'"></page-header>

    <nz-card nzTitle="讨论区" style="margin-top: 16px;">
      <st 
        #st
        [data]="discussions()" 
        [columns]="columns"
        [loading]="loading()"
        [page]="{
          show: true,
          showSize: true,
          front: false
        }"
        [responsive]="true"
        [scroll]="{ x: '1200px' }"
      ></st>
    </nz-card>
  `
})
export class DiscussionListComponent implements OnInit {
  private commentRepo = inject(CommentRepository);
  private message = inject(NzMessageService);

  // Signals for reactive state
  discussions = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    { 
      title: '讨论对象', 
      index: 'commentable_type',
      width: 120,
      type: 'tag',
      tag: {
        'task': { text: '任务', color: 'blue' },
        'issue': { text: '问题', color: 'red' },
        'pull_request': { text: 'PR', color: 'purple' },
        'inspection': { text: '验收', color: 'green' },
        'quality_check': { text: '质检', color: 'orange' }
      }
    },
    { 
      title: '标题/主题', 
      index: 'entity_title',
      width: 250,
      fixed: 'left'
    },
    { 
      title: '首条评论', 
      index: 'first_comment',
      width: 300,
      format: (item: STData) => {
        const comment = item['first_comment'] as string;
        return comment?.length > 80 ? comment.substring(0, 80) + '...' : comment;
      }
    },
    { 
      title: '发起人', 
      index: 'first_author',
      width: 120
    },
    { 
      title: '回复数', 
      index: 'reply_count',
      width: 100,
      type: 'number',
      numberDigits: '1.0-0'
    },
    { 
      title: '最后回复', 
      index: 'last_reply_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    { 
      title: '创建时间', 
      index: 'created_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: 160
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      buttons: [
        {
          text: '查看讨论',
          type: 'link',
          click: (item: STData) => this.viewDiscussion(
            item['commentable_type'] as string,
            item['commentable_id'] as string
          )
        },
        {
          text: '参与讨论',
          type: 'link',
          click: (item: STData) => this.joinDiscussion(item['commentable_id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadDiscussions();
  }

  /**
   * 加载讨论列表
   * Note: Since there's no discussions table, we query comments
   * and group them by commentable_type and commentable_id
   */
  loadDiscussions(): void {
    this.loading.set(true);
    
    // Query all parent comments (parent_comment_id is null)
    // In a real implementation, this would be done server-side with proper grouping
    this.commentRepo.findAll({
      orderBy: 'created_at',
      orderDirection: 'desc',
      pageSize: 100,
      filters: {
        parent_comment_id: null  // Only root comments
      }
    }).pipe(
      map(comments => {
        // Group comments by entity to create discussion threads
        const threadMap = new Map<string, DiscussionThread>();
        
        comments.forEach((comment: any) => {
          const key = `${comment.commentable_type}_${comment.commentable_id}`;
          
          if (!threadMap.has(key)) {
            threadMap.set(key, {
              id: key,
              commentable_type: comment.commentable_type,
              commentable_id: comment.commentable_id,
              entity_title: `${comment.commentable_type} #${comment.commentable_id.substring(0, 8)}`,
              first_comment: comment.content,
              first_author: comment.author_name || 'Unknown',
              reply_count: 0,
              last_reply_at: comment.created_at,
              created_at: comment.created_at
            });
          } else {
            const thread = threadMap.get(key)!;
            thread.reply_count++;
            if (new Date(comment.created_at) > new Date(thread.last_reply_at)) {
              thread.last_reply_at = comment.created_at;
            }
          }
        });
        
        return Array.from(threadMap.values());
      })
    ).subscribe({
      next: (threads) => {
        this.discussions.set(threads as STData[]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('加载讨论列表失败:', err);
        this.message.error('加载讨论列表失败');
        this.loading.set(false);
      }
    });
  }

  /**
   * 查看讨论详情
   */
  viewDiscussion(type: string, id: string): void {
    this.message.info('查看讨论功能待实现');
  }

  /**
   * 参与讨论
   */
  joinDiscussion(id: string): void {
    this.message.info('参与讨论功能待实现');
  }
}
