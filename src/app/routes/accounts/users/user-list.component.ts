import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, AccountService, Account } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'用户管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createUser()">
          <span nz-icon nzType="plus"></span>
          新建用户
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有用户账户" style="margin-top: 16px;">
      <st
        #st
        [data]="users()"
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
export class UserListComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);

  users = this.accountService.accounts;
  loading = this.accountService.loading;

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '用户名', index: 'name', width: 200 },
    { title: '邮箱', index: 'email', width: 200 },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
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
          text: '删除',
          type: 'del',
          pop: true,
          click: (record: Account) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
      // 过滤出用户类型的账户
      // 注意：这里需要根据实际业务逻辑过滤
    } catch (error) {
      this.message.error('加载用户列表失败');
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createUser(): void {
    this.router.navigate(['/accounts/create'], { queryParams: { type: 'User' } });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/accounts', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/accounts', id, 'edit']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.accountService.deleteAccount(id);
      this.message.success('删除成功');
      await this.loadUsers();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}
