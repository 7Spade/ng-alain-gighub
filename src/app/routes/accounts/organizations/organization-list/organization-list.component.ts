import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from '@core';
import { STColumn } from '@delon/abc/st';
import { Account, AccountService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OrganizationDeleteComponent, OrganizationDeleteData } from '../organization-delete/organization-delete.component';

@Component({
  selector: 'app-organization-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'组织管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createOrganization()">
          <span nz-icon nzType="plus"></span>
          新建组织
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有组织账户" style="margin-top: 16px;">
      <st
        #st
        [data]="organizations()"
        [columns]="columns"
        [loading]="loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('inactive') {
              <nz-tag nzColor="default">非活跃</nz-tag>
            }
            @case ('suspended') {
              <nz-tag nzColor="error">已暂停</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class OrganizationListComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);
  modal = inject(NzModalService);

  organizations = this.accountService.organizationAccounts;
  loading = this.accountService.loading;

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '组织名称', index: 'name', width: 200 },
    { title: '邮箱', index: 'email', width: 200 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: Account) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Account) => this.edit(record.id)
        },
        {
          text: '成员管理',
          click: (record: Account) => this.manageMembers(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: Account) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadOrganizations();
  }

  async loadOrganizations(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
      // organizationAccounts computed signal 会自动过滤出组织类型的账户
    } catch (error) {
      // 显示详细的错误信息
      let errorMessage = '加载组织列表失败';

      if (error instanceof Error) {
        const appError = error as AppError;
        if (appError.type && appError.severity) {
          errorMessage = appError.message || errorMessage;
          if (appError.details) {
            errorMessage += `: ${appError.details}`;
          }
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      console.error('加载组织列表失败:', error);
      this.message.error(errorMessage, { nzDuration: 5000 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTableChange(_event: unknown): void {
    // 处理表格变化事件（分页、排序等）
  }

  createOrganization(): void {
    this.router.navigate(['/accounts/create/organization']);
  }

  viewDetail(id: string): void {
    this.router.navigate(['/accounts', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/accounts', id, 'edit']);
  }

  manageMembers(id: string): void {
    // 导航到组织详情页面（可以在详情页面中管理成员）
    this.router.navigate(['/accounts', id]);
  }

  async delete(id: string): Promise<void> {
    const organization = this.organizations().find(org => org.id === id);
    const organizationName = organization?.name || id;

    const modalRef = this.modal.create({
      nzTitle: '刪除組織',
      nzContent: OrganizationDeleteComponent,
      nzData: {
        organizationId: id,
        organizationName
      } as OrganizationDeleteData,
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadOrganizations();
      }
    });
  }
}
