import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFSchema, SFUISchema } from '@delon/form';
import { SHARED_IMPORTS, CollaborationService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-collaboration-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="title()"></page-header>

    <nz-card [nzTitle]="title()" style="margin-top: 16px;">
      <sf #sf [schema]="schema" [ui]="ui" [loading]="loading()" (formSubmit)="onSubmit($event)">
        <button nz-button nzType="default" type="button" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        <button nz-button nzType="primary" type="submit" [nzLoading]="loading()">
          <span nz-icon nzType="save"></span>
          保存
        </button>
      </sf>
    </nz-card>
  `
})
export class CollaborationFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private collaborationService = inject(CollaborationService);
  private message = inject(NzMessageService);

  loading = signal(false);
  collaborationId = signal<string | null>(null);
  title = signal('新建协作关系');

  schema: SFSchema = {
    properties: {
      collaborating_org_id: {
        type: 'string',
        title: '协作组织',
        ui: {
          widget: 'select',
          asyncData: () => this.collaborationService.getOrganizations(),
          placeholder: '请选择协作组织'
        }
      },
      collaboration_type: {
        type: 'string',
        title: '协作类型',
        enum: ['contractor', 'subcontractor', 'consultant', 'partner'],
        ui: {
          widget: 'select',
          placeholder: '请选择协作类型'
        },
        default: 'contractor'
      },
      status: {
        type: 'string',
        title: '状态',
        enum: ['active', 'pending', 'suspended', 'terminated'],
        ui: {
          widget: 'select',
          placeholder: '请选择状态'
        },
        default: 'pending'
      },
      start_date: {
        type: 'string',
        title: '开始日期',
        format: 'date',
        ui: {
          widget: 'date',
          placeholder: '请选择开始日期'
        }
      },
      end_date: {
        type: 'string',
        title: '结束日期',
        format: 'date',
        ui: {
          widget: 'date',
          placeholder: '请选择结束日期（可选）'
        }
      },
      notes: {
        type: 'string',
        title: '备注',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 4, maxRows: 8 },
          placeholder: '请输入备注信息'
        }
      }
    },
    required: ['collaborating_org_id', 'collaboration_type', 'status', 'start_date']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 }
    }
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.collaborationId.set(params['id']);
        this.title.set('编辑协作关系');
        this.loadCollaboration(params['id']);
      }
    });
  }

  loadCollaboration(id: string) {
    this.loading.set(true);
    this.collaborationService.getCollaborationById(id).subscribe({
      next: (data) => {
        // SF will auto-fill form with data
        this.loading.set(false);
      },
      error: (err) => {
        this.message.error('加载协作关系失败');
        this.loading.set(false);
      }
    });
  }

  onSubmit(value: any) {
    this.loading.set(true);
    const id = this.collaborationId();
    
    const operation = id
      ? this.collaborationService.updateCollaboration(id, value)
      : this.collaborationService.createCollaboration(value);

    operation.subscribe({
      next: () => {
        this.message.success(id ? '更新成功' : '创建成功');
        this.loading.set(false);
        this.goBack();
      },
      error: (err) => {
        this.message.error(id ? '更新失败' : '创建失败');
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/collaboration/list']);
  }
}
