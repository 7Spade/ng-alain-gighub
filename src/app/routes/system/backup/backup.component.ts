import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { STColumn, STComponent, STData } from '@delon/abc/st';
import { SFComponent, SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface BackupRecord extends STData {
  id: string;
  backup_type: 'full' | 'incremental' | 'differential';
  file_name: string;
  file_size: number;
  created_at: string;
  created_by: string;
  status: 'success' | 'failed' | 'in_progress';
  description?: string;
}

@Component({
  selector: 'app-system-backup',
  standalone: true,
  imports: [SHARED_IMPORTS, STComponent, SFComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'系统备份管理'"></page-header>

    <nz-card nzTitle="备份操作" style="margin-top: 16px;">
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="24">
          <button nz-button nzType="primary" (click)="showBackupModal()" [nzLoading]="loading()">
            <span nz-icon nzType="cloud-download"></span>
            创建备份
          </button>
          <button nz-button style="margin-left: 8px;" (click)="showRestoreModal()">
            <span nz-icon nzType="cloud-upload"></span>
            恢复备份
          </button>
          <button nz-button style="margin-left: 8px;" (click)="loadBackups()">
            <span nz-icon nzType="reload"></span>
            刷新
          </button>
        </div>
      </div>
    </nz-card>

    <nz-card nzTitle="备份记录" style="margin-top: 16px;">
      <st
        #st
        [data]="backups()"
        [columns]="columns"
        [loading]="loading()"
        [scroll]="{ x: '1200px' }"
      ></st>
    </nz-card>

    <nz-modal
      [(nzVisible)]="backupModalVisible"
      nzTitle="创建备份"
      (nzOnOk)="handleBackupSubmit()"
      (nzOnCancel)="backupModalVisible = false"
      [nzOkLoading]="loading()"
    >
      <ng-container *nzModalContent>
        <sf #backupForm [schema]="backupSchema" [loading]="loading()"></sf>
      </ng-container>
    </nz-modal>

    <nz-modal
      [(nzVisible)]="restoreModalVisible"
      nzTitle="恢复备份"
      (nzOnOk)="handleRestoreSubmit()"
      (nzOnCancel)="restoreModalVisible = false"
      [nzOkLoading]="loading()"
      nzOkDanger
    >
      <ng-container *nzModalContent>
        <nz-alert
          nzType="warning"
          nzMessage="警告"
          nzDescription="恢复备份将覆盖当前数据库，此操作不可逆。请确认您已经了解风险。"
          [nzShowIcon]="true"
          style="margin-bottom: 16px;"
        ></nz-alert>
        <sf #restoreForm [schema]="restoreSchema" [loading]="loading()"></sf>
      </ng-container>
    </nz-modal>
  `
})
export class SystemBackupComponent implements OnInit {
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  backups = signal<BackupRecord[]>([]);
  loading = signal(false);
  backupModalVisible = false;
  restoreModalVisible = false;

  columns: STColumn[] = [
    { title: '备份ID', index: 'id', width: 120 },
    { title: '文件名', index: 'file_name', width: 200 },
    {
      title: '备份类型',
      index: 'backup_type',
      width: 120,
      type: 'badge',
      badge: {
        full: { text: '完整备份', color: 'blue' },
        incremental: { text: '增量备份', color: 'green' },
        differential: { text: '差异备份', color: 'orange' }
      }
    },
    {
      title: '文件大小',
      index: 'file_size',
      width: 120,
      format: (item: BackupRecord) => this.formatFileSize(item.file_size)
    },
    {
      title: '状态',
      index: 'status',
      width: 100,
      type: 'badge',
      badge: {
        success: { text: '成功', color: 'success' },
        failed: { text: '失败', color: 'error' },
        in_progress: { text: '进行中', color: 'processing' }
      }
    },
    { title: '创建人', index: 'created_by', width: 120 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    { title: '描述', index: 'description', width: 200 },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      buttons: [
        {
          text: '下载',
          icon: 'download',
          click: (item: BackupRecord) => this.downloadBackup(item)
        },
        {
          text: '恢复',
          icon: 'cloud-upload',
          click: (item: BackupRecord) => this.restoreBackup(item),
          iif: (item: BackupRecord) => item.status === 'success'
        },
        {
          text: '删除',
          icon: 'delete',
          type: 'del',
          pop: {
            title: '确认删除此备份？',
            okType: 'danger'
          },
          click: (item: BackupRecord) => this.deleteBackup(item)
        }
      ]
    }
  ];

  backupSchema: SFSchema = {
    properties: {
      backup_type: {
        type: 'string',
        title: '备份类型',
        enum: [
          { label: '完整备份', value: 'full' },
          { label: '增量备份', value: 'incremental' },
          { label: '差异备份', value: 'differential' }
        ],
        default: 'full',
        ui: {
          widget: 'select'
        }
      },
      description: {
        type: 'string',
        title: '备份描述',
        maxLength: 200,
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 }
        }
      }
    },
    required: ['backup_type'],
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 }
    }
  };

  restoreSchema: SFSchema = {
    properties: {
      backup_id: {
        type: 'string',
        title: '选择备份',
        enum: [],
        ui: {
          widget: 'select',
          placeholder: '请选择要恢复的备份'
        }
      },
      confirm_text: {
        type: 'string',
        title: '确认文本',
        description: '请输入 "RESTORE" 以确认恢复操作',
        ui: {
          placeholder: '输入 RESTORE 确认'
        }
      }
    },
    required: ['backup_id', 'confirm_text'],
    ui: {
      spanLabelFixed: 100,
      grid: { span: 24 }
    }
  };

  ngOnInit(): void {
    this.loadBackups();
  }

  loadBackups(): void {
    this.loading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData: BackupRecord[] = [
        {
          id: 'backup_001',
          backup_type: 'full',
          file_name: 'full_backup_20231116.sql.gz',
          file_size: 524288000, // 500 MB
          created_at: '2023-11-16 02:00:00',
          created_by: '系统管理员',
          status: 'success',
          description: '每日自动完整备份'
        },
        {
          id: 'backup_002',
          backup_type: 'incremental',
          file_name: 'incr_backup_20231116_14.sql.gz',
          file_size: 52428800, // 50 MB
          created_at: '2023-11-16 14:00:00',
          created_by: '系统管理员',
          status: 'success',
          description: '增量备份'
        },
        {
          id: 'backup_003',
          backup_type: 'differential',
          file_name: 'diff_backup_20231116_18.sql.gz',
          file_size: 104857600, // 100 MB
          created_at: '2023-11-16 18:00:00',
          created_by: 'admin',
          status: 'success',
          description: '差异备份'
        }
      ];

      this.backups.set(mockData);
      this.loading.set(false);

      // Update restore schema with backup options
      this.restoreSchema.properties!['backup_id'].enum = mockData
        .filter(b => b.status === 'success')
        .map(b => ({ label: `${b.file_name} (${b.created_at})`, value: b.id }));
    }, 800);
  }

  showBackupModal(): void {
    this.backupModalVisible = true;
  }

  showRestoreModal(): void {
    this.restoreModalVisible = true;
  }

  handleBackupSubmit(): void {
    this.loading.set(true);
    
    // Simulate backup creation
    setTimeout(() => {
      this.message.success('备份任务已创建，正在后台执行');
      this.backupModalVisible = false;
      this.loading.set(false);
      this.loadBackups();
    }, 1500);
  }

  handleRestoreSubmit(): void {
    // Validate confirm text
    this.loading.set(true);
    
    setTimeout(() => {
      this.message.success('恢复任务已启动，请等待完成');
      this.restoreModalVisible = false;
      this.loading.set(false);
    }, 1500);
  }

  downloadBackup(record: BackupRecord): void {
    this.message.info(`正在下载: ${record.file_name}`);
    // Implement download logic
    console.log('Download backup:', record);
  }

  restoreBackup(record: BackupRecord): void {
    this.modal.confirm({
      nzTitle: '确认恢复备份？',
      nzContent: `将使用 "${record.file_name}" 恢复数据库。此操作不可逆，是否继续？`,
      nzOkText: '确认恢复',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.message.success('恢复任务已启动');
        // Implement restore logic
        console.log('Restore backup:', record);
      }
    });
  }

  deleteBackup(record: BackupRecord): void {
    this.loading.set(true);
    setTimeout(() => {
      this.message.success('备份已删除');
      this.loadBackups();
    }, 500);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
