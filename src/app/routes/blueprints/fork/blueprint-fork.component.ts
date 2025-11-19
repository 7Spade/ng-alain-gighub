import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationType, CollaborationStatus } from '@core';
import {
  SHARED_IMPORTS,
  BlueprintService,
  BranchService,
  CollaborationService,
  AccountService,
  AccountType,
  BranchType,
  AuthStateService,
  BranchPermissionService,
  BranchPermissionLevel
} from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-blueprint-fork',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'Fork 分支'">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>
            <a routerLink="/blueprints">蓝图列表</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>
            <a [routerLink]="['/blueprints', blueprintId]">蓝图详情</a>
          </nz-breadcrumb-item>
          <nz-breadcrumb-item>Fork 分支</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
    </page-header>

    <nz-card nzTitle="创建 Fork 分支" style="margin-top: 16px;">
      @if (blueprintService.loading() || accountService.loading() || branchService.loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (blueprintService.error() || accountService.error() || branchService.error()) {
        <nz-alert
          nzType="error"
          [nzMessage]="'加载失败'"
          [nzDescription]="blueprintService.error() || accountService.error() || branchService.error()"
          nzShowIcon
          style="margin-bottom: 16px;"
        ></nz-alert>
      } @else {
        <form nz-form [formGroup]="form" (ngSubmit)="submit()" nzLayout="vertical">
          <nz-form-item>
            <nz-form-label nzRequired>来源蓝图</nz-form-label>
            <nz-form-control nzErrorTip="请选择蓝图">
              <input nz-input [value]="blueprint()?.name || ''" disabled />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label nzRequired>选择组织</nz-form-label>
            <nz-form-control nzErrorTip="请选择要Fork的组织">
              <nz-select
                formControlName="organizationId"
                nzPlaceHolder="请选择组织"
                [nzLoading]="accountService.loading()"
                nzShowSearch
                [nzFilterOption]="filterOrganizationOption"
              >
                @for (org of availableOrganizations(); track org.id) {
                  <nz-option [nzValue]="org.id" [nzLabel]="org.name">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span nz-icon nzType="team" style="color: #1890ff;"></span>
                      <span>{{ org.name }}</span>
                      @if (org.email) {
                        <span style="color: #999; font-size: 12px;">({{ org.email }})</span>
                      }
                    </div>
                  </nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label nzRequired>分支名称</nz-form-label>
            <nz-form-control nzErrorTip="请输入分支名称">
              <input nz-input formControlName="branchName" placeholder="例如：contractor-org-name" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label nzRequired>分支类型</nz-form-label>
            <nz-form-control nzErrorTip="请选择分支类型">
              <nz-select formControlName="branchType" nzPlaceHolder="请选择分支类型">
                <nz-option [nzValue]="BranchType.CONTRACTOR" nzLabel="承揽商"></nz-option>
                <nz-option [nzValue]="BranchType.SUBCONTRACTOR" nzLabel="分包商"></nz-option>
                <nz-option [nzValue]="BranchType.CONSULTANT" nzLabel="顾问"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label>备注</nz-form-label>
            <nz-form-control>
              <textarea
                nz-input
                formControlName="notes"
                [nzAutosize]="{ minRows: 3, maxRows: 6 }"
                placeholder="可选：添加关于此Fork的说明"
              ></textarea>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control>
              <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button nz-button nzType="default" type="button" (click)="cancel()" [disabled]="submitting()"> 取消 </button>
                <button nz-button nzType="primary" type="submit" [nzLoading]="submitting()" [disabled]="!form.valid || submitting()">
                  <span nz-icon nzType="git-branch"></span>
                  创建 Fork
                </button>
              </div>
            </nz-form-control>
          </nz-form-item>
        </form>
      }
    </nz-card>
  `
})
export class BlueprintForkComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  branchService = inject(BranchService);
  collaborationService = inject(CollaborationService);
  accountService = inject(AccountService);
  branchPermissionService = inject(BranchPermissionService);
  authState = inject(AuthStateService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  blueprintId = signal<string>('');
  submitting = signal<boolean>(false);
  form!: FormGroup;

  // 導出枚舉供模板使用
  BranchType = BranchType;
  AccountType = AccountType;

  // 使用 computed 獲取當前藍圖
  blueprint = computed(() => {
    const id = this.blueprintId();
    if (!id) return null;
    return this.blueprintService.blueprints().find(b => b.id === id) || null;
  });

  // 過濾出可用的組織（排除當前藍圖擁有者）
  availableOrganizations = computed(() => {
    const blueprint = this.blueprint();
    if (!blueprint) return [];

    return this.accountService.organizationAccounts().filter(org => org.id !== blueprint.owner_id);
  });

  // 組織選擇器過濾函數
  filterOrganizationOption = (input: string, option: any): boolean => {
    const label = option.nzLabel?.toLowerCase() || '';
    const value = input.toLowerCase();
    return label.includes(value);
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.message.error('蓝图ID不存在');
      this.router.navigate(['/blueprints']);
      return;
    }

    this.blueprintId.set(id);
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.form = this.fb.group({
      organizationId: ['', [Validators.required]],
      branchName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      branchType: [BranchType.CONTRACTOR, [Validators.required]],
      notes: ['']
    });
  }

  async loadData(): Promise<void> {
    try {
      // 並行加載藍圖和組織列表
      await Promise.all([this.blueprintService.loadBlueprintById(this.blueprintId()), this.accountService.loadAccounts()]);

      const blueprint = this.blueprint();
      if (!blueprint) {
        this.message.error('蓝图不存在');
        this.router.navigate(['/blueprints']);
        return;
      }

      // 檢查是否已有協作關係
      const existingCollaborations = await this.collaborationService.loadCollaborationsByBlueprintId(blueprint.id);

      // 如果已存在協作關係，可以預填充組織選擇
      if (existingCollaborations.length > 0) {
        // 可以考慮預填充，但這裡先不處理
      }
    } catch (error) {
      this.message.error('加载数据失败');
      console.error('Load data error:', error);
    }
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprint = this.blueprint();
    if (!blueprint) {
      this.message.error('蓝图不存在');
      return;
    }

    this.submitting.set(true);

    try {
      const formValue = this.form.value;
      const organizationId = formValue.organizationId;
      const branchName = formValue.branchName;
      const branchType = formValue.branchType;
      const notes = formValue.notes || undefined;

      // 步驟1: 檢查或創建協作關係
      let collaboration = await this.ensureCollaboration(blueprint.id, blueprint.owner_id, organizationId);

      // 步驟2: 創建分支（BranchService.forkBranch 會自動創建 Fork 記錄）
      // 需要獲取當前用戶ID作為forkedBy
      const currentUser = this.getCurrentUserId();
      if (!currentUser) {
        throw new Error('无法获取当前用户信息');
      }

      const branch = await this.branchService.forkBranch(blueprint.id, organizationId, branchName, branchType, currentUser, notes);

      // 步驟3: 設置分支權限
      // 為協作組織設置 WRITE 權限（可以填寫承攬欄位）
      await this.branchPermissionService.grantPermission(branch.id, organizationId, BranchPermissionLevel.WRITE, currentUser);

      // 為藍圖擁有者設置 OWNER 權限（如果還沒有）
      const ownerPermission = await this.branchPermissionService.getPermissionLevel(branch.id, blueprint.owner_id);
      if (!ownerPermission) {
        await this.branchPermissionService.grantPermission(branch.id, blueprint.owner_id, BranchPermissionLevel.OWNER, currentUser);
      }

      this.message.success('Fork 分支创建成功');

      // 導航到分支詳情頁面
      this.router.navigate(['/blueprints/branches/detail'], {
        queryParams: { id: branch.id }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建 Fork 分支失败';
      this.message.error(errorMessage);
      console.error('Fork branch error:', error);
    } finally {
      this.submitting.set(false);
    }
  }

  /**
   * 確保協作關係存在，如果不存在則創建
   */
  private async ensureCollaboration(blueprintId: string, ownerOrgId: string, collaboratorOrgId: string): Promise<any> {
    // 檢查是否已存在協作關係
    const existingCollaborations = await this.collaborationService.loadCollaborationsByBlueprintId(blueprintId);
    const existing = existingCollaborations.find(c => c.collaborator_org_id === collaboratorOrgId && c.owner_org_id === ownerOrgId);

    if (existing) {
      return existing;
    }

    // 創建新的協作關係
    const collaboration = await this.collaborationService.createCollaboration({
      blueprint_id: blueprintId,
      owner_org_id: ownerOrgId,
      collaborator_org_id: collaboratorOrgId,
      collaboration_type: CollaborationType.CONTRACTOR,
      status: CollaborationStatus.ACTIVE
    } as any);

    return collaboration;
  }

  /**
   * 獲取當前用戶ID
   */
  private getCurrentUserId(): string | null {
    const currentUser = this.authState.user();
    if (!currentUser) {
      return null;
    }
    return currentUser.id || null;
  }

  cancel(): void {
    const blueprintId = this.blueprintId();
    if (blueprintId) {
      this.router.navigate(['/blueprints', blueprintId]);
    } else {
      this.router.navigate(['/blueprints']);
    }
  }
}
