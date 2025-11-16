import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProgressTrackingRepository, ProgressTrackingInsert } from '@core';

@Component({
  selector: 'app-progress-update',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="isEdit() ? '编辑进度' : '新增进度记录'">
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
export class ProgressUpdateComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private progressRepo = inject(ProgressTrackingRepository);
  private message = inject(NzMessageService);

  loading = signal(false);
  isEdit = signal(false);
  recordId = signal<string | null>(null);

  schema: SFSchema = {
    properties: {
      blueprint_id: {
        type: 'string',
        title: '蓝图ID',
        maxLength: 100,
        ui: {
          placeholder: '请输入蓝图ID',
          grid: { span: 12 }
        }
      },
      branch_id: {
        type: 'string',
        title: '分支ID',
        maxLength: 100,
        ui: {
          placeholder: '请输入分支ID（可选）',
          grid: { span: 12 }
        }
      },
      tracking_date: {
        type: 'string',
        title: '追踪日期',
        format: 'date',
        ui: {
          widget: 'date',
          grid: { span: 12 }
        }
      },
      tracking_type: {
        type: 'string',
        title: '追踪类型',
        enum: [
          { label: '蓝图追踪', value: 'blueprint' },
          { label: '分支追踪', value: 'branch' }
        ],
        default: 'blueprint',
        ui: {
          widget: 'select',
          grid: { span: 12 }
        }
      },
      planned_progress: {
        type: 'number',
        title: '计划进度 (%)',
        minimum: 0,
        maximum: 100,
        ui: {
          widget: 'number',
          placeholder: '0-100',
          grid: { span: 8 }
        }
      },
      actual_progress: {
        type: 'number',
        title: '实际进度 (%)',
        minimum: 0,
        maximum: 100,
        ui: {
          widget: 'number',
          placeholder: '0-100',
          grid: { span: 8 }
        }
      },
      progress_variance: {
        type: 'number',
        title: '进度偏差 (%)',
        ui: {
          widget: 'number',
          placeholder: '自动计算',
          grid: { span: 8 },
          readOnly: true
        }
      },
      tracking_status: {
        type: 'string',
        title: '追踪状态',
        enum: [
          { label: '正常', value: 'normal' },
          { label: '延迟', value: 'delayed' },
          { label: '提前', value: 'ahead' },
          { label: '暂停', value: 'paused' }
        ],
        default: 'normal',
        ui: {
          widget: 'select',
          grid: { span: 12 }
        }
      },
      remarks: {
        type: 'string',
        title: '备注',
        ui: {
          widget: 'textarea',
          placeholder: '进度更新说明、关键里程碑等',
          autosize: { minRows: 4, maxRows: 8 },
          grid: { span: 24 }
        }
      }
    },
    required: ['blueprint_id', 'tracking_date', 'tracking_type']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { gutter: 16 }
    }
  };

  button = {
    submit: '提交',
    reset: '重置'
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recordId.set(id);
      this.isEdit.set(true);
      this.loadRecord(id);
    }
  }

  loadRecord(id: string): void {
    this.loading.set(true);
    this.progressRepo.findById(id).subscribe({
      next: record => {
        if (record) {
          // Load record data into form
          // Note: SF will handle this via formData binding if needed
        }
        this.loading.set(false);
      },
      error: err => {
        this.message.error('加载进度记录失败');
        this.loading.set(false);
      }
    });
  }

  onSubmit(value: any): void {
    this.loading.set(true);

    // Calculate progress variance
    const planned = value.planned_progress || 0;
    const actual = value.actual_progress || 0;
    const variance = actual - planned;

    const progressData: Partial<ProgressTrackingInsert> = {
      blueprint_id: value.blueprint_id,
      branch_id: value.branch_id || null,
      tracking_date: value.tracking_date,
      tracking_type: value.tracking_type,
      planned_progress: planned,
      actual_progress: actual,
      progress_variance: variance,
      tracking_status: value.tracking_status,
      remarks: value.remarks
    };

    const operation = this.isEdit()
      ? this.progressRepo.update(this.recordId()!, progressData)
      : this.progressRepo.create(progressData);

    operation.subscribe({
      next: () => {
        this.message.success(this.isEdit() ? '进度记录更新成功' : '进度记录创建成功');
        this.router.navigate(['/analytics/progress']);
      },
      error: err => {
        this.message.error(this.isEdit() ? '进度记录更新失败' : '进度记录创建失败');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/analytics/progress']);
  }
}
