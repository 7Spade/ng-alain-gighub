import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { IssueRepository, IssueInsert } from '@core';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="isEdit() ? '编辑问题' : '新建问题'">
      <ng-template #action>
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <nz-card [nzTitle]="isEdit() ? '编辑问题信息' : '填写问题信息'" style="margin-top: 16px;">
      <sf 
        #sf
        [schema]="schema"
        [ui]="ui"
        [loading]="loading()"
        [button]="button"
        (formSubmit)="onSubmit($event)"
      ></sf>
    </nz-card>
  `
})
export class IssueFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private issueRepo = inject(IssueRepository);

  // Signals for reactive state
  isEdit = signal(false);
  loading = signal(false);
  issueId = signal('');

  // SF Schema configuration
  schema: SFSchema = {
    properties: {
      title: {
        type: 'string',
        title: '问题标题',
        maxLength: 200,
        ui: {
          placeholder: '请输入问题标题',
          grid: { span: 24 }
        }
      },
      description: {
        type: 'string',
        title: '问题描述',
        ui: {
          widget: 'textarea',
          placeholder: '请详细描述问题',
          autosize: { minRows: 4, maxRows: 8 },
          grid: { span: 24 }
        }
      },
      issue_type: {
        type: 'string',
        title: '问题类型',
        enum: [
          { label: '一般问题', value: 'general' },
          { label: '质量问题', value: 'quality' },
          { label: '安全问题', value: 'safety' },
          { label: '进度延误', value: 'schedule_delay' },
          { label: '材料问题', value: 'material' },
          { label: '设计变更', value: 'design_change' }
        ],
        default: 'general',
        ui: {
          widget: 'select',
          placeholder: '请选择问题类型',
          grid: { span: 12 }
        }
      },
      severity: {
        type: 'string',
        title: '严重程度',
        enum: [
          { label: '低', value: 'low' },
          { label: '中', value: 'medium' },
          { label: '高', value: 'high' },
          { label: '紧急', value: 'critical' }
        ],
        default: 'medium',
        ui: {
          widget: 'select',
          placeholder: '请选择严重程度',
          grid: { span: 12 }
        }
      },
      priority: {
        type: 'string',
        title: '优先级',
        enum: [
          { label: '低', value: 'low' },
          { label: '中', value: 'medium' },
          { label: '高', value: 'high' },
          { label: '紧急', value: 'urgent' }
        ],
        default: 'medium',
        ui: {
          widget: 'select',
          placeholder: '请选择优先级',
          grid: { span: 12 }
        }
      },
      status: {
        type: 'string',
        title: '状态',
        enum: [
          { label: '新建', value: 'new' },
          { label: '进行中', value: 'in_progress' },
          { label: '待审查', value: 'review' },
          { label: '已解决', value: 'resolved' },
          { label: '已关闭', value: 'closed' }
        ],
        default: 'new',
        ui: {
          widget: 'select',
          placeholder: '请选择状态',
          grid: { span: 12 }
        }
      },
      location: {
        type: 'string',
        title: '问题位置',
        ui: {
          placeholder: '请输入问题发生的位置',
          grid: { span: 24 }
        }
      },
      resolution_notes: {
        type: 'string',
        title: '解决方案',
        ui: {
          widget: 'textarea',
          placeholder: '请输入解决方案或备注',
          autosize: { minRows: 3, maxRows: 6 },
          grid: { span: 24 }
        }
      }
    },
    required: ['title', 'description', 'issue_type'],
    ui: {
      spanLabelFixed: 120,
      grid: { gutter: 16 }
    }
  };

  // UI Schema for additional customization
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 12 }
    }
  };

  // Button configuration
  button = {
    submit: '提交',
    reset: '重置'
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.issueId.set(id);
    this.isEdit.set(!!id);

    if (this.isEdit()) {
      this.loadIssue(id);
    }
  }

  /**
   * 加载问题数据（编辑模式）
   */
  loadIssue(id: string): void {
    this.loading.set(true);
    
    this.issueRepo.findById(id).subscribe({
      next: (issue) => {
        // SF will automatically populate form with issue data
        // You can transform the data here if needed
        this.loading.set(false);
      },
      error: (err) => {
        console.error('加载问题失败:', err);
        this.message.error('加载问题失败');
        this.loading.set(false);
      }
    });
  }

  /**
   * 表单提交处理
   */
  onSubmit(value: any): void {
    this.loading.set(true);

    const issueData: Partial<IssueInsert> = {
      title: value.title,
      description: value.description,
      issue_type: value.issue_type,
      severity: value.severity,
      priority: value.priority,
      status: value.status,
      location: value.location,
      resolution_notes: value.resolution_notes
    };

    if (this.isEdit()) {
      // Update existing issue
      this.issueRepo.update(this.issueId(), issueData as any).subscribe({
        next: () => {
          this.message.success('问题更新成功');
          this.loading.set(false);
          this.goBack();
        },
        error: (err) => {
          console.error('更新问题失败:', err);
          this.message.error('更新问题失败');
          this.loading.set(false);
        }
      });
    } else {
      // Create new issue
      this.issueRepo.create(issueData as IssueInsert).subscribe({
        next: () => {
          this.message.success('问题创建成功');
          this.loading.set(false);
          this.goBack();
        },
        error: (err) => {
          console.error('创建问题失败:', err);
          this.message.error('创建问题失败');
          this.loading.set(false);
        }
      });
    }
  }

  /**
   * 返回列表页
   */
  goBack(): void {
    this.router.navigate(['/issues/list']);
  }
}
