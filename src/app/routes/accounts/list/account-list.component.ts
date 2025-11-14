import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { STColumn, STData } from '@delon/abc/st';
import { SHARED_IMPORTS } from '@shared';
import { AccountService, Account, AccountType, AccountStatus } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'账户管理'">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createAccount()">
          <span nz-icon nzType="plus"></span>
          新建账户
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="管理系统中的所有账户" style="margin-top: 16px;">
      <st
        #st
        [data]="accountService.accounts()"
        [columns]="columns"
        [loading]="accountService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange($event)"
      >
        <ng-template #type let-record>
          @switch (record.type) {
            @case ('User') {
              <nz-tag nzColor="blue">用户</nz-tag>
            }
            @case ('Bot') {
              <nz-tag nzColor="purple">机器人</nz-tag>
            }
            @case ('Organization') {
              <nz-tag nzColor="green">组织</nz-tag>
            }
          }
        </ng-template>

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
export class AccountListComponent implements OnInit {
  accountService = inject(AccountService);
  router = inject(Router);
  message = inject(NzMessageService);

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '名称', index: 'name', width: 200 },
    { title: '类型', index: 'type', width: 100, render: 'type' },
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
    this.loadAccounts();
  }

  async loadAccounts(): Promise<void> {
    try {
      await this.accountService.loadAccounts();
    } catch (error) {
      this.message.error('加载账户列表失败');
    }
  }

  onTableChange(event: any): void {
    // 处理表格变化事件（分页、排序等）
  }

  createAccount(): void {
    this.router.navigate(['/accounts/create']);
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
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}

