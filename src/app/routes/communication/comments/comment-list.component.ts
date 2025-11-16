import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommentRepository, Comment } from '@core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'评论管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createComment()">
          <span nz-icon nzType="plus"></span>
          新建评论
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="评论列表" style="margin-top: 16px;">
      <st
        #st
        [data]="comments()"
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
export class CommentListComponent implements OnInit {
  private commentRepo = inject(CommentRepository);
  private message = inject(NzMessageService);
  private router = inject(Router);

  // Signals for reactive state
  comments = signal<STData[]>([]);
  loading = signal(false);

  // ST Table columns configuration
  columns: STColumn[] = [
    {
      title: '评论对象',
      index: 'commentable_type',
      width: 120,
      format: (item: STData) => {
        const typeMap: Record<string, string> = {
          Task: '任务',
          Issue: '问题',
          Blueprint: '蓝图',
          Document: '文档'
        };
        return typeMap[item['commentable_type'] as string] || (item['commentable_type'] as string);
      }
    },
    {
      title: '评论内容',
      index: 'content',
      width: 300,
      format: (item: STData) => {
        const content = item['content'] as string;
        return content?.length > 50 ? `${content.substring(0, 50)}...` : content;
      }
    },
    {
      title: '评论人',
      index: 'author_name',
      width: 120
    },
    {
      title: '提及用户',
      index: 'mentioned_users',
      width: 150,
      format: (item: STData) => {
        const mentioned = item['mentioned_users'];
        if (Array.isArray(mentioned) && mentioned.length > 0) {
          return mentioned.join(', ');
        }
        return '-';
      }
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
          text: '查看',
          type: 'link',
          click: (item: STData) => this.viewComment(item['id'] as string)
        },
        {
          text: '删除',
          type: 'del',
          pop: {
            title: '确认删除？',
            okType: 'danger'
          },
          click: (item: STData) => this.deleteComment(item['id'] as string)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadComments();
  }

  /**
   * 加载评论列表
   */
  loadComments(): void {
    this.loading.set(true);

    this.commentRepo
      .findAll({
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageSize: 100
      })
      .subscribe({
        next: data => {
          this.comments.set(data as STData[]);
          this.loading.set(false);
        },
        error: err => {
          console.error('加载评论列表失败:', err);
          this.message.error('加载评论列表失败');
          this.loading.set(false);
        }
      });
  }

  /**
   * 查看评论详情
   */
  viewComment(id: string): void {
    this.message.info('查看评论功能待实现');
  }

  /**
   * 删除评论
   */
  deleteComment(id: string): void {
    this.commentRepo.delete(id).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadComments();
      },
      error: err => {
        console.error('删除评论失败:', err);
        this.message.error('删除评论失败');
      }
    });
  }

  /**
   * 创建新评论
   */
  createComment(): void {
    this.router.navigate(['/communication/comments/create']);
  }
}
