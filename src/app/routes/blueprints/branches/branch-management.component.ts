import { Component, OnInit, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchType } from '@core';
import { STColumn } from '@delon/abc/st';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { AccountService, AccountType, BlueprintBranch, BlueprintService, BranchService, SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { BranchDetailComponent } from './branch-detail.component';

// Fork 分支对话框组件
@Component({
  selector: 'app-fork-branch-dialog',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <div>
      <form nz-form [formGroup]="form">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>组织</nz-form-label>
          <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择组织'">
            <nz-select formControlName="organizationId" nzPlaceHolder="请选择组织" [nzLoading]="loading()">
              @for (org of organizations(); track org.id) {
                <nz-option [nzValue]="org.id" [nzLabel]="org.name || org.id"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>分支名称</nz-form-label>
          <nz-form-control [nzSpan]="18" [nzErrorTip]="'请输入分支名称'">
            <input nz-input formControlName="branchName" placeholder="请输入分支名称" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>分支类型</nz-form-label>
          <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择分支类型'">
            <nz-select formControlName="branchType" nzPlaceHolder="请选择分支类型">
              <nz-option [nzValue]="BranchType.CONTRACTOR" nzLabel="承揽商"></nz-option>
              <nz-option [nzValue]="BranchType.SUBCONTRACTOR" nzLabel="次承揽商"></nz-option>
              <nz-option [nzValue]="BranchType.CONSULTANT" nzLabel="顾问"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">备注</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <textarea
              nz-input
              formControlName="notes"
              [nzAutosize]="{ minRows: 3, maxRows: 6 }"
              placeholder="请输入备注（可选）"
            ></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `
})
class ForkBranchDialogComponent implements OnInit {
  modal = inject(NzModalRef);
  accountService = inject(AccountService);
  BranchType = BranchType;

  form = new FormGroup({
    organizationId: new FormControl<string>('', [Validators.required]),
    branchName: new FormControl<string>('', [Validators.required]),
    branchType: new FormControl<BranchType>(BranchType.CONTRACTOR, [Validators.required]),
    notes: new FormControl<string>('')
  });

  organizations = this.accountService.organizationAccounts;
  loading = this.accountService.loading;

  ngOnInit(): void {
    // 加载组织列表
    this.accountService.loadAccounts().catch(() => {
      // 错误处理已在service中完成
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.modal.close(this.form.value);
    }
  }

  cancel(): void {
    this.modal.destroy();
  }
}

@Component({
  selector: 'app-branch-management',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="'分支管理'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (!isPersonalBlueprint()) {
          <button nz-button nzType="primary" (click)="forkBranch()">
            <span nz-icon nzType="git-branch"></span>
            Fork 分支
          </button>
        } @else {
          <nz-tooltip nzTitle="个人蓝图不支持Fork功能">
            <button nz-button nzType="primary" nzDisabled>
              <span nz-icon nzType="git-branch"></span>
              Fork 分支
            </button>
          </nz-tooltip>
        }
      </ng-template>
    </page-header>

    <nz-card nzTitle="蓝图分支列表" style="margin-top: 16px;">
      <st
        #st
        [data]="branchService.branches()"
        [columns]="columns"
        [loading]="branchService.loading()"
        [page]="{ front: false, show: true, showSize: true }"
        (change)="onTableChange()"
      >
        <ng-template #type let-record>
          @switch (record.branch_type) {
            @case ('contractor') {
              <nz-tag nzColor="blue">承揽商</nz-tag>
            }
            @case ('subcontractor') {
              <nz-tag nzColor="cyan">次承揽商</nz-tag>
            }
            @case ('consultant') {
              <nz-tag nzColor="purple">顾问</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>

        <ng-template #status let-record>
          @switch (record.status) {
            @case ('active') {
              <nz-tag nzColor="success">活跃</nz-tag>
            }
            @case ('merged') {
              <nz-tag nzColor="blue">已合并</nz-tag>
            }
            @case ('closed') {
              <nz-tag nzColor="default">已关闭</nz-tag>
            }
            @default {
              <nz-tag>未知</nz-tag>
            }
          }
        </ng-template>
      </st>
    </nz-card>
  `
})
export class BranchManagementComponent implements OnInit {
  branchService = inject(BranchService);
  accountService = inject(AccountService);
  blueprintService = inject(BlueprintService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  modal = inject(NzModalService);
  tokenService = inject(DA_SERVICE_TOKEN);

  blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');

  // 蓝图信息
  blueprint = computed(() => this.blueprintService.selectedBlueprint());

  // 判断是否为个人蓝图
  isPersonalBlueprint = computed(() => {
    const bp = this.blueprint();
    if (!bp) return false;
    const owner = this.accountService.accounts().find(a => a.id === bp.owner_id);
    return owner?.type === AccountType.USER;
  });

  // 导出枚举供模板使用
  AccountType = AccountType;

  columns: STColumn[] = [
    { title: 'ID', index: 'id', width: 100 },
    { title: '分支名称', index: 'branch_name', width: 200 },
    { title: '组织ID', index: 'organization_id', width: 150 },
    { title: '分支类型', index: 'branch_type', width: 120, render: 'type' },
    { title: '状态', index: 'status', width: 100, render: 'status' },
    { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
    {
      title: '操作',
      width: 200,
      buttons: [
        {
          text: '查看',
          click: (record: BlueprintBranch) => this.viewBranch(record.id)
        },
        {
          text: '同步',
          click: (record: BlueprintBranch) => this.syncBranch(record.id)
        },
        {
          text: '关闭',
          click: (record: BlueprintBranch) => this.closeBranch(record.id)
        }
      ]
    }
  ];

  ngOnInit(): void {
    const id = this.blueprintId();
    if (id) {
      this.loadBlueprint(id);
      this.loadBranches(id);
    }
  }

  async loadBlueprint(id: string): Promise<void> {
    try {
      await this.blueprintService.loadBlueprintById(id);
      // 加载拥有者账户信息
      const blueprint = this.blueprint();
      if (blueprint) {
        await this.accountService.loadAccountById(blueprint.owner_id);
      }
    } catch (error) {
      // 静默失败，不影响主流程
      console.error('加载蓝图信息失败:', error);
    }
  }

  async loadBranches(blueprintId: string): Promise<void> {
    try {
      await this.branchService.loadBranchesByBlueprintId(blueprintId);
    } catch (error) {
      this.message.error('加载分支列表失败');
    }
  }

  onTableChange(): void {
    // 表格变化处理
  }

  goBack(): void {
    const blueprintId = this.blueprintId();
    if (blueprintId) {
      this.router.navigate(['/blueprints', blueprintId]);
    } else {
      this.router.navigate(['/blueprints/list']);
    }
  }

  forkBranch(): void {
    const blueprintId = this.blueprintId();
    if (!blueprintId) {
      this.message.error('蓝图ID不存在');
      return;
    }

    // 获取当前用户ID
    const currentUser = this.tokenService.get()?.['user'];
    if (!currentUser?.id) {
      this.message.error('请先登录');
      return;
    }

    // 打开Fork分支对话框
    const modalRef = this.modal.create({
      nzTitle: 'Fork 分支',
      nzContent: ForkBranchDialogComponent,
      nzWidth: 600,
      nzFooter: [
        {
          label: '取消',
          onClick: () => modalRef.destroy()
        },
        {
          label: '确定',
          type: 'primary',
          onClick: () => {
            const component = modalRef.getContentComponent() as ForkBranchDialogComponent;
            if (component.form.valid) {
              const formValue = component.form.value;
              this.handleForkBranch(
                blueprintId,
                currentUser.id,
                {
                  organizationId: formValue.organizationId ?? null,
                  branchName: formValue.branchName ?? null,
                  branchType: formValue.branchType ?? null,
                  notes: formValue.notes ?? null
                },
                modalRef
              );
            } else {
              // 标记表单为touched以显示验证错误
              Object.values(component.form.controls).forEach(control => {
                control.markAsTouched();
                control.updateValueAndValidity();
              });
            }
          }
        }
      ]
    });
  }

  private async handleForkBranch(
    blueprintId: string,
    forkedBy: string,
    formValue: { organizationId: string | null; branchName: string | null; branchType: BranchType | null; notes?: string | null },
    modalRef: any
  ): Promise<void> {
    if (!formValue.organizationId || !formValue.branchName || !formValue.branchType) {
      this.message.error('请填写所有必填字段');
      return;
    }

    try {
      await this.branchService.forkBranch(
        blueprintId,
        formValue.organizationId,
        formValue.branchName,
        formValue.branchType,
        forkedBy,
        formValue.notes || undefined
      );
      this.message.success('Fork 分支成功');
      modalRef.destroy();
      // 刷新分支列表
      await this.loadBranches(blueprintId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fork 分支失败';
      this.message.error(errorMessage);
    }
  }

  viewBranch(branchId: string): void {
    this.modal.create({
      nzTitle: '分支详情',
      nzContent: BranchDetailComponent,
      nzData: {
        branchId
      },
      nzWidth: 800,
      nzFooter: null
    });
  }

  async syncBranch(branchId: string): Promise<void> {
    try {
      await this.branchService.syncFromMainBranch(branchId);
      this.message.success('同步成功');
    } catch (error) {
      this.message.error('同步失败');
    }
  }

  async closeBranch(branchId: string): Promise<void> {
    try {
      await this.branchService.closeBranch(branchId);
      this.message.success('关闭成功');
      const blueprintId = this.blueprintId();
      if (blueprintId) {
        await this.loadBranches(blueprintId);
      }
    } catch (error) {
      this.message.error('关闭失败');
    }
  }
}
