import { Component, OnInit, ViewChild, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintStatus } from '@core';
import { STColumn } from '@delon/abc/st';
import { SHARED_IMPORTS, BlueprintService, Blueprint, AccountService, Account, AccountType } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BlueprintCreateModalComponent } from './blueprint-create-modal.component';

@Component({
  selector: 'app-blueprint-list',
  standalone: true,
  imports: [SHARED_IMPORTS, BlueprintCreateModalComponent],
  template: `
    <page-header [title]="pageTitle()">
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="createBlueprint()">
          <span nz-icon nzType="plus"></span>
          新建蓝图
        </button>
      </ng-template>
    </page-header>

    <nz-card [nzTitle]="cardTitle()" style="margin-top: 16px;">
      <st
        #st
        [data]="blueprintService.blueprints()"
        [columns]="columns"
        [loading]="blueprintService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #status let-record>
          @switch (record.status) {
            @case ('planning') {
              <nz-tag nzColor="default">规划中</nz-tag>
            }
            @case ('active') {
              <nz-tag nzColor="success">进行中</nz-tag>
            }
            @case ('on_hold') {
              <nz-tag nzColor="warning">暂停</nz-tag>
            }
            @case ('completed') {
              <nz-tag nzColor="blue">已完成</nz-tag>
            }
            @case ('archived') {
              <nz-tag nzColor="default">已归档</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>
        <ng-template #owner let-record>
          @if (getOwnerAccount(record.owner_id)) {
            @switch (getOwnerAccount(record.owner_id)!.type) {
              @case (AccountType.USER) {
                <span>
                  <span nz-icon nzType="user" style="margin-right: 4px;"></span>
                  {{ getOwnerAccount(record.owner_id)!.name }}
                  <nz-tag nzColor="blue" style="margin-left: 8px;">个人</nz-tag>
                </span>
              }
              @case (AccountType.ORGANIZATION) {
                <span>
                  <span nz-icon nzType="team" style="margin-right: 4px;"></span>
                  {{ getOwnerAccount(record.owner_id)!.name }}
                  <nz-tag nzColor="green" style="margin-left: 8px;">组织</nz-tag>
                </span>
              }
              @default {
                {{ getOwnerAccount(record.owner_id)!.name }}
              }
            }
          } @else {
            <span style="color: #999;">{{ record.owner_id }}</span>
          }
        </ng-template>
      </st>
    </nz-card>

    <!-- Blueprint Create Modal -->
    <app-blueprint-create-modal #createModal (blueprintCreated)="onBlueprintCreated($event)"></app-blueprint-create-modal>
  `
})
export class BlueprintListComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  accountService = inject(AccountService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  message = inject(NzMessageService);

  @ViewChild('createModal') createModal!: BlueprintCreateModalComponent;

  // 导出枚举供模板使用
  AccountType = AccountType;

  // 组织ID（从查询参数获取）
  organizationId = signal<string | null>(null);
  organization = computed(() => {
    const orgId = this.organizationId();
    if (!orgId) return null;
    return this.accountService.accounts().find(a => a.id === orgId && a.type === AccountType.ORGANIZATION) || null;
  });

  // 页面标题
  pageTitle = computed(() => {
    const org = this.organization();
    return org ? `${org.name} - 蓝图管理` : '蓝图管理';
  });

  // 卡片标题
  cardTitle = computed(() => {
    const org = this.organization();
    return org ? `${org.name} 的蓝图列表` : '管理系统中的所有蓝图';
  });

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '项目名称', index: 'name', width: 200 },
    { title: '项目代码', index: 'project_code', width: 150 },
    { title: '拥有者', index: 'owner_id', width: 200, render: 'owner' },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '开始日期', index: 'start_date', type: 'date', width: 120 },
    { title: '结束日期', index: 'end_date', type: 'date', width: 120 },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 250,
      buttons: [
        {
          text: '查看',
          click: (record: Blueprint) => this.viewDetail(record.id)
        },
        {
          text: '编辑',
          click: (record: Blueprint) => this.edit(record.id)
        },
        {
          text: '分支管理',
          click: (record: Blueprint) => this.manageBranches(record.id)
        },
        {
          text: '删除',
          type: 'del',
          pop: {
            title: '确定要删除这个蓝图吗？',
            okType: 'danger'
          },
          click: (record: Blueprint) => this.delete(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    // 从查询参数获取组织ID
    this.route.queryParams.subscribe(params => {
      const orgId = params['org'] || null;
      this.organizationId.set(orgId);
      this.loadData();
    });
  }

  async loadData(): Promise<void> {
    try {
      const orgId = this.organizationId();
      if (orgId) {
        // 如果有组织ID，只加载该组织的蓝图
        await this.blueprintService.loadBlueprintsByOwnerId(orgId);
        // 加载组织账户信息
        await this.accountService.loadAccountsByIds([orgId]);
      } else {
        // 否则加载所有蓝图
        await this.blueprintService.loadBlueprints();
      }
      // 加载拥有者账户信息
      await this.loadOwnerAccounts();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async loadOwnerAccounts(): Promise<void> {
    const blueprints = this.blueprintService.blueprints();
    const ownerIds = [...new Set(blueprints.map(b => b.owner_id))];
    if (ownerIds.length > 0) {
      try {
        await this.accountService.loadAccountsByIds(ownerIds);
      } catch (error) {
        // 静默失败，不影响主流程
        console.error('加载拥有者账户信息失败:', error);
      }
    }
  }

  getOwnerAccount(ownerId: string): Account | undefined {
    return this.accountService.accounts().find(a => a.id === ownerId);
  }

  onTableChange(): void {
    // 表格变化处理
  }

  createBlueprint(): void {
    this.createModal.open();
  }

  onBlueprintCreated(blueprintId: string): void {
    // 重新加载数据
    this.loadData().then(() => {
      // 可选：导航到新创建的蓝图详情页
      // this.router.navigate(['/blueprints', blueprintId]);
    });
  }

  viewDetail(id: string): void {
    this.router.navigate(['/blueprints', id]);
  }

  edit(id: string): void {
    this.router.navigate(['/blueprints', id, 'edit']);
  }

  manageBranches(id: string): void {
    this.router.navigate(['/blueprints', id, 'branches']);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.blueprintService.deleteBlueprint(id);
      this.message.success('删除成功');
      await this.loadData();
    } catch (error) {
      this.message.error('删除失败');
    }
  }
}
