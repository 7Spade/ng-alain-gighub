import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface PermissionItem {
  readonly id: string;
  readonly userId: string;
  readonly userName: string;
  readonly permission: string;
  readonly grantedAt: string;
}

@Component({
  selector: 'app-document-permission',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="'权限设置'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()" style="margin-right: 8px;"> 取消 </button>
        <button nz-button nzType="primary" (click)="save()" [nzLoading]="saving()">
          <span nz-icon nzType="save"></span>
          保存
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="文档权限设置" style="margin-top: 16px;">
      <!-- 权限设置表单 -->
      <nz-card nzTitle="添加权限" [nzBordered]="true" style="margin-bottom: 16px;">
        <form nz-form [formGroup]="permissionForm" nzLayout="vertical">
          <nz-row [nzGutter]="16">
            <nz-col [nzXs]="24" [nzSm]="12">
              <nz-form-item>
                <nz-form-label nzRequired>用户/组织</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="userId" nzPlaceHolder="请选择用户或组织">
                    <!-- TODO: 加载用户和组织列表 -->
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>

            <nz-col [nzXs]="24" [nzSm]="12">
              <nz-form-item>
                <nz-form-label nzRequired>权限</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="permission" nzPlaceHolder="请选择权限">
                    <nz-option nzValue="read" nzLabel="只读"></nz-option>
                    <nz-option nzValue="write" nzLabel="读写"></nz-option>
                    <nz-option nzValue="admin" nzLabel="管理"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
          </nz-row>

          <nz-form-item>
            <nz-form-control>
              <button nz-button nzType="primary" (click)="addPermission()">
                <span nz-icon nzType="plus"></span>
                添加权限
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>
      </nz-card>

      <!-- 分享链接设置 -->
      <nz-card nzTitle="分享链接" [nzBordered]="true" style="margin-bottom: 16px;">
        <nz-form-item>
          <nz-form-label>启用分享链接</nz-form-label>
          <nz-form-control>
            <nz-switch formControlName="shareEnabled"></nz-switch>
          </nz-form-control>
        </nz-form-item>

        @if (shareLink()) {
          <nz-form-item>
            <nz-form-label>分享链接</nz-form-label>
            <nz-form-control>
              <nz-input-group [nzSuffix]="copyIcon">
                <input nz-input [value]="shareLink()" readonly />
              </nz-input-group>
              <ng-template #copyIcon>
                <span nz-icon nzType="copy" (click)="copyShareLink()" style="cursor: pointer;"></span>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        }
      </nz-card>

      <!-- 权限列表 -->
      <nz-card nzTitle="权限列表" [nzBordered]="true">
        <st
          #st
          [data]="permissions()"
          [columns]="columns"
          [loading]="loading()"
          [page]="{ front: false, show: true, showSize: true }"
          (change)="onTableChange()"
        >
          <ng-template #permission let-record>
            @switch (record.permission) {
              @case ('read') {
                <nz-tag nzColor="blue">只读</nz-tag>
              }
              @case ('write') {
                <nz-tag nzColor="orange">读写</nz-tag>
              }
              @case ('admin') {
                <nz-tag nzColor="red">管理</nz-tag>
              }
            }
          </ng-template>
        </st>
      </nz-card>
    </nz-card>
  `
})
export class DocumentPermissionComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  // Component signals
  loading = signal(false);
  saving = signal(false);
  documentId = signal<string | null>(null);
  permissions = signal<PermissionItem[]>([]);
  shareLink = signal<string>('');

  permissionForm: FormGroup = this.fb.group({
    userId: [''],
    permission: ['']
  });

  shareForm: FormGroup = this.fb.group({
    shareEnabled: [false]
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '用户/组织', index: 'userName', width: 200 },
    { title: '权限', index: 'permission', width: 120, render: 'permission' },
    { title: '授予时间', index: 'grantedAt', type: 'date', width: 180 },
    {
      title: '操作',
      width: 150,
      buttons: [
        {
          text: '编辑',
          click: (record: PermissionItem) => this.editPermission(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: PermissionItem) => this.deletePermission(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.documentId.set(id);
      this.loadPermissions();
    } else {
      this.message.error('缺少文档ID参数');
    }
  }

  loadPermissions(): void {
    // TODO: 加载权限列表
    // 暂时使用空数组，实际开发时连接真实数据
    this.permissions.set([]);
  }

  onTableChange(): void {
    // 处理表格变化事件（分页、排序等）
  }

  addPermission(): void {
    if (this.permissionForm.invalid) {
      this.message.error('请填写完整的表单信息');
      return;
    }
    // TODO: 实现添加权限逻辑
    this.message.info('添加权限功能开发中');
  }

  editPermission(id: string): void {
    // TODO: 实现编辑权限逻辑
    this.message.info('编辑权限功能开发中');
  }

  deletePermission(id: string): void {
    // TODO: 实现删除权限逻辑
    this.message.info('删除权限功能开发中');
  }

  save(): void {
    this.saving.set(true);
    // TODO: 实现保存逻辑
    setTimeout(() => {
      this.saving.set(false);
      this.message.success('权限设置保存成功');
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/documents']);
  }

  copyShareLink(): void {
    // TODO: 实现复制分享链接逻辑
    this.message.success('分享链接已复制到剪贴板');
  }
}
