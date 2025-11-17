import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { SFSchema, SFComponent } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingRepository } from '@core';

interface SystemSettings {
  id?: string;
  category: string;
  key: string;
  value: string;
  value_type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-system-settings-final',
  standalone: true,
  imports: [SHARED_IMPORTS, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系统设置'" />
    <nz-card>
      <div style="margin-bottom: 16px;">
        <button nz-button nzType="primary" (click)="showAddForm()">
          <i nz-icon nzType="plus"></i>
          添加配置
        </button>
        <button nz-button style="margin-left: 8px;" (click)="refresh()" [nzLoading]="loading()">
          <i nz-icon nzType="reload"></i>
          刷新
        </button>
      </div>

      <!-- Settings by Category -->
      <nz-collapse>
        @for (category of categories(); track category) {
          <nz-collapse-panel [nzHeader]="category">
            <nz-descriptions [nzBordered]="true" [nzColumn]="1">
              @for (setting of getSettingsByCategory(category); track setting.id) {
                <nz-descriptions-item [nzTitle]="setting.key">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div><strong>{{ setting.value }}</strong></div>
                      <small style="color: #999;">{{ setting.description }}</small>
                    </div>
                    <div>
                      <button nz-button nzSize="small" (click)="edit(setting)">
                        <i nz-icon nzType="edit"></i>
                      </button>
                      <button nz-button nzSize="small" nzDanger style="margin-left: 8px;" 
                              (click)="delete(setting.id!)">
                        <i nz-icon nzType="delete"></i>
                      </button>
                    </div>
                  </div>
                </nz-descriptions-item>
              }
            </nz-descriptions>
          </nz-collapse-panel>
        }
      </nz-collapse>
    </nz-card>

    <!-- Add/Edit Modal -->
    <nz-modal
      [(nzVisible)]="modalVisible()"
      [nzTitle]="editingId() ? '编辑配置' : '添加配置'"
      (nzOnCancel)="closeModal()"
      (nzOnOk)="save()"
      [nzOkLoading]="saving()"
    >
      <ng-container *nzModalContent>
        <sf [schema]="schema" [formData]="formData()" (formSubmit)="save()" />
      </ng-container>
    </nz-modal>
  `,
  styles: [`
    :host ::ng-deep .ant-descriptions-item-label {
      width: 200px;
    }
  `]
})
export class SystemSettingsFinalComponent implements OnInit {
  private settingRepo = inject(SettingRepository);
  private message = inject(NzMessageService);

  settings = signal<SystemSettings[]>([]);
  categories = signal<string[]>([]);
  loading = signal(false);
  modalVisible = signal(false);
  saving = signal(false);
  editingId = signal<string | null>(null);
  formData = signal<any>({});

  schema: SFSchema = {
    properties: {
      category: {
        type: 'string',
        title: '分类',
        enum: ['system', 'app', 'email', 'storage', 'notification', 'integration'],
        ui: { widget: 'select' },
        default: 'system'
      },
      key: {
        type: 'string',
        title: '配置键',
        maxLength: 100,
        ui: { placeholder: '例如: app_name, max_upload_size' }
      },
      value: {
        type: 'string',
        title: '配置值',
        ui: { widget: 'textarea', autosize: { minRows: 2, maxRows: 6 } }
      },
      value_type: {
        type: 'string',
        title: '值类型',
        enum: ['string', 'number', 'boolean', 'json'],
        default: 'string',
        ui: { widget: 'select' }
      },
      description: {
        type: 'string',
        title: '描述',
        ui: { widget: 'textarea', autosize: { minRows: 2, maxRows: 4 } }
      },
      is_public: {
        type: 'boolean',
        title: '公开可见',
        default: false,
        ui: { widget: 'checkbox' }
      }
    },
    required: ['category', 'key', 'value', 'value_type']
  };

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.settingRepo.findAll({ pageSize: 1000 }).subscribe({
      next: (data: any) => {
        this.settings.set(data);
        this.updateCategories();
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.message.error('加载配置失败');
        this.loading.set(false);
      }
    });
  }

  updateCategories() {
    const cats = [...new Set(this.settings().map(s => s.category))];
    this.categories.set(cats.sort());
  }

  getSettingsByCategory(category: string): SystemSettings[] {
    return this.settings().filter(s => s.category === category);
  }

  showAddForm() {
    this.editingId.set(null);
    this.formData.set({});
    this.modalVisible.set(true);
  }

  edit(setting: SystemSettings) {
    this.editingId.set(setting.id!);
    this.formData.set(setting);
    this.modalVisible.set(true);
  }

  save() {
    this.saving.set(true);
    const data = this.formData();
    
    const operation = this.editingId()
      ? this.settingRepo.update(this.editingId()!, data)
      : this.settingRepo.create(data);

    operation.subscribe({
      next: () => {
        this.message.success(this.editingId() ? '更新成功' : '添加成功');
        this.closeModal();
        this.loadSettings();
        this.saving.set(false);
      },
      error: (err: Error) => {
        this.message.error('保存失败');
        this.saving.set(false);
      }
    });
  }

  delete(id: string) {
    this.settingRepo.delete(id).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadSettings();
      },
      error: (err: Error) => {
        this.message.error('删除失败');
      }
    });
  }

  closeModal() {
    this.modalVisible.set(false);
    this.editingId.set(null);
    this.formData.set({});
  }

  refresh() {
    this.loadSettings();
  }
}
