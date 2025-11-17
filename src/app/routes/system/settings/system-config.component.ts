import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { SHARED_IMPORTS, STColumn, STComponent, STData, SFComponent, SFSchema } from '@shared';
import { SettingRepository } from '@core/repositories/setting.repository';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-system-config',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系統配置'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="showAddModal()">
          <span nz-icon nzType="plus"></span>
          新增配置
        </button>
        <button nz-button (click)="loadSettings()">
          <span nz-icon nzType="reload"></span>
          重新整理
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="系統配置列表" style="margin-top: 16px;">
      <st
        #st
        [data]="data()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ show: true, showSize: true }"
      ></st>
    </nz-card>

    <nz-modal
      [(nzVisible)]="modalVisible"
      [nzTitle]="modalTitle"
      [nzFooter]="null"
      (nzOnCancel)="closeModal()"
      nzWidth="600px"
    >
      <ng-container *nzModalContent>
        <sf
          #sf
          [schema]="schema"
          [formData]="formData"
          [loading]="submitting()"
          (formSubmit)="onSubmit($event)"
          button="none"
        >
          <button
            nz-button
            nzType="default"
            (click)="closeModal()"
            style="margin-right: 8px;"
          >
            取消
          </button>
          <button
            nz-button
            nzType="primary"
            [nzLoading]="submitting()"
            (click)="sf.submit()"
          >
            {{ isEdit ? '更新' : '新增' }}
          </button>
        </sf>
      </ng-container>
    </nz-modal>
  `
})
export class SystemConfigComponent implements OnInit {
  private settingRepo = inject(SettingRepository);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  data = signal<STData[]>([]);
  loading = signal(false);
  submitting = signal(false);

  modalVisible = false;
  modalTitle = '新增配置';
  isEdit = false;
  formData: any = {};

  columns: STColumn[] = [
    { title: '配置鍵', index: 'key', width: '200px' },
    { title: '配置值', index: 'value', width: '250px' },
    {
      title: '類別',
      index: 'category',
      width: '120px',
      type: 'tag',
      tag: {
        system: { text: '系統', color: 'blue' },
        project: { text: '專案', color: 'green' },
        user: { text: '使用者', color: 'orange' },
        integration: { text: '整合', color: 'purple' }
      }
    },
    { title: '描述', index: 'description' },
    {
      title: '最後更新',
      index: 'updated_at',
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm',
      width: '160px'
    },
    {
      title: '操作',
      width: '180px',
      buttons: [
        {
          text: '編輯',
          icon: 'edit',
          type: 'link',
          click: (record: any) => this.editSetting(record)
        },
        {
          text: '刪除',
          icon: 'delete',
          type: 'link',
          pop: {
            title: '確認刪除？',
            okType: 'danger'
          },
          click: (record: any) => this.deleteSetting(record.id)
        }
      ]
    }
  ];

  schema: SFSchema = {
    properties: {
      key: {
        type: 'string',
        title: '配置鍵',
        maxLength: 100,
        ui: {
          placeholder: '例如: max_upload_size',
          grid: { span: 24 }
        }
      },
      value: {
        type: 'string',
        title: '配置值',
        maxLength: 500,
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
          placeholder: '輸入配置值',
          grid: { span: 24 }
        }
      },
      category: {
        type: 'string',
        title: '類別',
        enum: [
          { label: '系統', value: 'system' },
          { label: '專案', value: 'project' },
          { label: '使用者', value: 'user' },
          { label: '整合', value: 'integration' }
        ],
        default: 'system',
        ui: {
          widget: 'select',
          placeholder: '選擇類別',
          grid: { span: 24 }
        }
      },
      description: {
        type: 'string',
        title: '描述',
        maxLength: 200,
        ui: {
          widget: 'textarea',
          autosize: { minRows: 2, maxRows: 4 },
          placeholder: '配置描述（可選）',
          grid: { span: 24 }
        }
      },
      is_public: {
        type: 'boolean',
        title: '公開配置',
        default: false,
        ui: {
          widget: 'checkbox',
          grid: { span: 24 }
        }
      }
    },
    required: ['key', 'value', 'category'],
    ui: {
      spanLabelFixed: 120,
      grid: { gutter: 16 }
    }
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.settingRepo.findAll({ pageSize: 100, sortBy: 'category' }).subscribe({
      next: (settings) => {
        this.data.set(settings);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('載入配置失敗:', err);
        this.message.error('載入配置失敗');
        this.loading.set(false);
      }
    });
  }

  showAddModal() {
    this.isEdit = false;
    this.modalTitle = '新增配置';
    this.formData = { category: 'system', is_public: false };
    this.modalVisible = true;
  }

  editSetting(record: any) {
    this.isEdit = true;
    this.modalTitle = '編輯配置';
    this.formData = { ...record };
    this.modalVisible = true;
  }

  deleteSetting(id: string) {
    this.settingRepo.delete(id).subscribe({
      next: () => {
        this.message.success('刪除成功');
        this.loadSettings();
      },
      error: (err) => {
        console.error('刪除失敗:', err);
        this.message.error('刪除失敗');
      }
    });
  }

  onSubmit(value: any) {
    this.submitting.set(true);
    const operation = this.isEdit
      ? this.settingRepo.update(this.formData.id, value)
      : this.settingRepo.create(value);

    operation.subscribe({
      next: () => {
        this.message.success(this.isEdit ? '更新成功' : '新增成功');
        this.closeModal();
        this.loadSettings();
        this.submitting.set(false);
      },
      error: (err) => {
        console.error('儲存失敗:', err);
        this.message.error('儲存失敗');
        this.submitting.set(false);
      }
    });
  }

  closeModal() {
    this.modalVisible = false;
    this.formData = {};
  }
}
