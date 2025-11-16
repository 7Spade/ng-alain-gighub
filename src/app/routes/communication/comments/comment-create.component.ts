import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommentRepository, CommentInsert } from '@core';

@Component({
  selector: 'app-comment-create',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'发表评论'">
      <ng-template #action>
        <button nz-button (click)="goBack()">
          <i nz-icon nzType="arrow-left"></i>
          返回列表
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      <sf
        [schema]="schema"
        [ui]="ui"
        [button]="button"
        [loading]="loading()"
        (formSubmit)="onSubmit($event.value)"
      ></sf>
    </nz-card>
  `
})
export class CommentCreateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commentRepo = inject(CommentRepository);
  private message = inject(NzMessageService);

  loading = signal(false);

  schema: SFSchema = {
    properties: {
      commentable_type: {
        type: 'string',
        title: '评论对象类型',
        enum: [
          { label: '任务', value: 'task' },
          { label: '问题', value: 'issue' },
          { label: '拉取请求', value: 'pull_request' },
          { label: '质检记录', value: 'quality_check' },
          { label: '验收记录', value: 'inspection' }
        ],
        ui: {
          widget: 'select',
          placeholder: '请选择评论对象类型',
          grid: { span: 12 }
        }
      },
      commentable_id: {
        type: 'string',
        title: '评论对象ID',
        maxLength: 100,
        ui: {
          placeholder: '请输入对象ID',
          grid: { span: 12 }
        }
      },
      content: {
        type: 'string',
        title: '评论内容',
        ui: {
          widget: 'textarea',
          placeholder: '请输入评论内容，支持 Markdown 格式',
          autosize: { minRows: 6, maxRows: 12 },
          grid: { span: 24 }
        }
      },
      parent_comment_id: {
        type: 'string',
        title: '父评论ID（回复）',
        ui: {
          placeholder: '留空表示主评论，填写ID表示回复',
          grid: { span: 12 }
        }
      },
      mentioned_user_ids: {
        type: 'string',
        title: '@提及用户',
        ui: {
          widget: 'textarea',
          placeholder: '多个用户ID用逗号分隔，例如: user1,user2,user3',
          autosize: { minRows: 2, maxRows: 4 },
          grid: { span: 12 }
        }
      }
    },
    required: ['commentable_type', 'commentable_id', 'content']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 140,
      grid: { gutter: 16 }
    }
  };

  button = {
    submit: '发表评论',
    reset: '重置'
  };

  ngOnInit(): void {
    // Pre-fill from query params if available
    const type = this.route.snapshot.queryParamMap.get('type');
    const id = this.route.snapshot.queryParamMap.get('id');
    const parentId = this.route.snapshot.queryParamMap.get('parent');

    if (type && id) {
      // Could set form default values here if SF supports it
    }
  }

  onSubmit(value: any): void {
    this.loading.set(true);

    // Parse mentioned user IDs from comma-separated string
    let mentionedUserIds: string[] | null = null;
    if (value.mentioned_user_ids) {
      mentionedUserIds = value.mentioned_user_ids
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0);
    }

    const commentData: Partial<CommentInsert> = {
      commentable_type: value.commentable_type,
      commentable_id: value.commentable_id,
      content: value.content,
      parent_comment_id: value.parent_comment_id || null,
      mentioned_user_ids: mentionedUserIds
    };

    this.commentRepo.create(commentData).subscribe({
      next: () => {
        this.message.success('评论发表成功');
        this.router.navigate(['/communication/comments']);
      },
      error: err => {
        this.message.error('评论发表失败');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/communication/comments']);
  }
}
