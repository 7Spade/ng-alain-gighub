import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface SystemSetting extends STData {
  id: string;
  category: string;
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系统设置'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="addSetting()">
          <span nz-icon nzType="plus"></span>
          新建设置
        </button>
        <button nz-button (click)="refresh()">
          <span nz-icon nzType="reload"></span>
          刷新
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="系统配置管理" style="margin-top: 16px;">
      <nz-alert
        nzType="info"
        nzMessage="系统设置说明"
        nzDescription="管理平台级参数配置、主题设置、默认值等。修改某些设置可能需要重启系统。"
        [nzShowIcon]="true"
        [nzCloseable]="true"
        style="margin-bottom: 16px;"
      ></nz-alert>

      <nz-tabset [(nzSelectedIndex)]="activeTab" (nzSelectedIndexChange)="onTabChange($event)">
        <nz-tab nzTitle="全部设置">
          <st #st
            [data]="settings()"
            [columns]="columns"
            [loading]="loading()"
            [page]="{ show: true, showSize: true }"
            [scroll]="{ x: '1200px' }"
          ></st>
        </nz-tab>
        <nz-tab nzTitle="系统配置">
          <st
            [data]="filterByCategory('system')"
            [columns]="columns"
            [loading]="loading()"
          ></st>
        </nz-tab>
        <nz-tab nzTitle="外观主题">
          <st
            [data]="filterByCategory('appearance')"
            [columns]="columns"
            [loading]="loading()"
          ></st>
        </nz-tab>
        <nz-tab nzTitle="邮件通知">
          <st
            [data]="filterByCategory('notification')"
            [columns]="columns"
            [loading]="loading()"
          ></st>
        </nz-tab>
        <nz-tab nzTitle="安全设置">
          <st
            [data]="filterByCategory('security')"
            [columns]="columns"
            [loading]="loading()"
          ></st>
        </nz-tab>
      </nz-tabset>
    </nz-card>
  `
})
export class SystemSettingsComponent implements OnInit {
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  settings = signal<SystemSetting[]>([]);
  loading = signal(false);
  activeTab = 0;

  columns: STColumn[] = [
    { title: '配置类别', index: 'category', width: 120, render: 'category' },
    { title: '配置键', index: 'key', width: 200 },
    { title: '配置值', index: 'value', width: 250, render: 'value' },
    { title: '说明', index: 'description' },
    { title: '更新时间', index: 'updated_at', width: 180, type: 'date' },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '编辑',
          icon: 'edit',
          type: 'link',
          click: (record: SystemSetting) => this.editSetting(record)
        },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          pop: {
            title: '确认删除此配置？',
            okType: 'danger'
          },
          click: (record: SystemSetting) => this.deleteSetting(record.id)
        }
      ]
    }
  ];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    
    // Simulated data - in production, fetch from SettingsRepository
    setTimeout(() => {
      const mockSettings: SystemSetting[] = [
        {
          id: '1',
          category: 'system',
          key: 'app.name',
          value: 'ng-alain-github',
          description: '应用程序名称',
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          category: 'appearance',
          key: 'theme.primary_color',
          value: '#1890ff',
          description: '主题主色调',
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          category: 'notification',
          key: 'email.smtp_host',
          value: 'smtp.example.com',
          description: 'SMTP服务器地址',
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          category: 'security',
          key: 'auth.session_timeout',
          value: '3600',
          description: '会话超时时间（秒）',
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          category: 'system',
          key: 'upload.max_file_size',
          value: '52428800',
          description: '最大上传文件大小（字节）',
          updated_at: new Date().toISOString()
        }
      ];
      
      this.settings.set(mockSettings);
      this.loading.set(false);
    }, 500);
  }

  filterByCategory(category: string): SystemSetting[] {
    return this.settings().filter(s => s.category === category);
  }

  onTabChange(index: number) {
    this.activeTab = index;
  }

  addSetting() {
    this.modal.create({
      nzTitle: '新建系统设置',
      nzContent: '设置表单组件',
      nzWidth: 600,
      nzOnOk: () => {
        this.message.success('设置创建成功');
        this.loadSettings();
      }
    });
  }

  editSetting(record: SystemSetting) {
    this.modal.create({
      nzTitle: '编辑系统设置',
      nzContent: `编辑 ${record.key}`,
      nzWidth: 600,
      nzOnOk: () => {
        this.message.success('设置更新成功');
        this.loadSettings();
      }
    });
  }

  deleteSetting(id: string) {
    this.loading.set(true);
    setTimeout(() => {
      const newSettings = this.settings().filter(s => s.id !== id);
      this.settings.set(newSettings);
      this.message.success('设置已删除');
      this.loading.set(false);
    }, 300);
  }

  refresh() {
    this.loadSettings();
    this.message.success('数据已刷新');
  }
}
