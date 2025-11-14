import { Component, OnInit, inject, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '@shared';
import {
  CollaborationService,
  OrganizationCollaboration,
  OrganizationCollaborationInsert,
  OrganizationCollaborationUpdate
} from '@shared';
import { CollaborationType, CollaborationStatus } from '@core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 协作关系表单类型定义
 */
interface CollaborationFormValue {
  blueprint_id: string;
  owner_org_id: string;
  collaborator_org_id: string;
  collaboration_type: CollaborationType;
  status?: CollaborationStatus;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  notes?: string | null;
}

@Component({
  selector: 'app-collaboration-form',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="isEditMode() ? '编辑协作关系' : '创建协作关系'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div style="padding: 16px;">
      @if (collaborationService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
          <ng-template #indicator>
            <span nz-icon nzType="loading" style="font-size: 24px;"></span>
          </ng-template>
        </nz-spin>
      } @else {
        <nz-card [nzTitle]="isEditMode() ? '编辑协作关系信息' : '创建新协作关系'">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>蓝图ID</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入蓝图ID'">
                <input nz-input formControlName="blueprint_id" placeholder="请输入蓝图ID" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>拥有者组织ID</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者组织ID'">
                <input nz-input formControlName="owner_org_id" placeholder="请输入拥有者组织ID" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>协作组织ID</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入协作组织ID'">
                <input nz-input formControlName="collaborator_org_id" placeholder="请输入协作组织ID" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>协作类型</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择协作类型'">
                <nz-select formControlName="collaboration_type" nzPlaceHolder="请选择协作类型">
                  <nz-option [nzValue]="CollaborationType.CONTRACTOR" nzLabel="承揽商"></nz-option>
                  <nz-option [nzValue]="CollaborationType.SUBCONTRACTOR" nzLabel="次承揽商"></nz-option>
                  <nz-option [nzValue]="CollaborationType.CONSULTANT" nzLabel="顾问"></nz-option>
                  <nz-option [nzValue]="CollaborationType.PARTNER" nzLabel="合作伙伴"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            @if (isEditMode()) {
              <nz-form-item>
                <nz-form-label [nzSpan]="4">状态</nz-form-label>
                <nz-form-control [nzSpan]="20">
                  <nz-select formControlName="status" nzPlaceHolder="请选择状态">
                    <nz-option [nzValue]="CollaborationStatus.PENDING" nzLabel="待处理"></nz-option>
                    <nz-option [nzValue]="CollaborationStatus.ACTIVE" nzLabel="活跃"></nz-option>
                    <nz-option [nzValue]="CollaborationStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
                    <nz-option [nzValue]="CollaborationStatus.ENDED" nzLabel="已结束"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            }

            <nz-form-item>
              <nz-form-label [nzSpan]="4">合同开始日期</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <input nz-input formControlName="contract_start_date" type="date" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">合同结束日期</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <input nz-input formControlName="contract_end_date" type="date" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">备注</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <textarea nz-input formControlName="notes" rows="4" placeholder="请输入备注"></textarea>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzSpan]="24" [nzOffset]="4">
                <button
                  nz-button
                  nzType="primary"
                  [nzLoading]="collaborationService.loading()"
                  [disabled]="form.invalid"
                >
                  <span nz-icon nzType="save"></span>
                  {{ isEditMode() ? '保存' : '创建' }}
                </button>
                <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
                  取消
                </button>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-card>
      }
    </div>
  `
})
export class CollaborationFormComponent implements OnInit {
  collaborationService = inject(CollaborationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 导出枚举供模板使用
  CollaborationType = CollaborationType;
  CollaborationStatus = CollaborationStatus;

  // 判断是否为编辑模式
  isEditMode = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return !!id;
  });

  // 表单定义
  form = new FormGroup<{
    blueprint_id: FormControl<string>;
    owner_org_id: FormControl<string>;
    collaborator_org_id: FormControl<string>;
    collaboration_type: FormControl<CollaborationType>;
    status?: FormControl<CollaborationStatus>;
    contract_start_date?: FormControl<string | null>;
    contract_end_date?: FormControl<string | null>;
    notes?: FormControl<string | null>;
  }>({
    blueprint_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    owner_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    collaborator_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    collaboration_type: new FormControl(CollaborationType.CONTRACTOR, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    status: new FormControl(CollaborationStatus.ACTIVE, { nonNullable: true }),
    contract_start_date: new FormControl(null),
    contract_end_date: new FormControl(null),
    notes: new FormControl(null)
  });

  ngOnInit(): void {
    if (this.isEditMode()) {
      const collaborationId = this.route.snapshot.paramMap.get('id');
      if (collaborationId) {
        this.loadCollaboration(collaborationId);
      }
    }
  }

  async loadCollaboration(id: string): Promise<void> {
    try {
      const collaboration = await this.collaborationService.loadCollaborationById(id);
      if (collaboration) {
        this.form.patchValue({
          blueprint_id: collaboration.blueprint_id,
          owner_org_id: collaboration.owner_org_id,
          collaborator_org_id: collaboration.collaborator_org_id,
          collaboration_type: collaboration.collaboration_type as CollaborationType,
          status: collaboration.status as CollaborationStatus,
          contract_start_date: collaboration.contract_start_date || null,
          contract_end_date: collaboration.contract_end_date || null,
          notes: collaboration.notes || null
        });
      } else {
        this.message.warning('协作关系不存在');
        this.goBack();
      }
    } catch (error) {
      this.message.error('加载协作关系信息失败');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      // 标记所有字段为 touched，显示验证错误
      Object.values(this.form.controls).forEach(control => {
        if (control && control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const formValue = this.form.value as CollaborationFormValue;

    try {
      if (this.isEditMode()) {
        const collaborationId = this.route.snapshot.paramMap.get('id')!;
        const updateData: OrganizationCollaborationUpdate = {
          blueprint_id: formValue.blueprint_id,
          owner_org_id: formValue.owner_org_id,
          collaborator_org_id: formValue.collaborator_org_id,
          collaboration_type: formValue.collaboration_type,
          status: formValue.status,
          contract_start_date: formValue.contract_start_date || undefined,
          contract_end_date: formValue.contract_end_date || undefined,
          notes: formValue.notes || undefined
        };
        await this.collaborationService.updateCollaboration(collaborationId, updateData);
        this.message.success('更新成功');
        this.router.navigate(['/collaboration', collaborationId]);
      } else {
        const insertData: OrganizationCollaborationInsert = {
          blueprint_id: formValue.blueprint_id,
          owner_org_id: formValue.owner_org_id,
          collaborator_org_id: formValue.collaborator_org_id,
          collaboration_type: formValue.collaboration_type,
          status: formValue.status || CollaborationStatus.ACTIVE,
          contract_start_date: formValue.contract_start_date || undefined,
          contract_end_date: formValue.contract_end_date || undefined,
          notes: formValue.notes || undefined
        };
        const collaboration = await this.collaborationService.createCollaboration(insertData);
        this.message.success('创建成功');
        this.router.navigate(['/collaboration', collaboration.id]);
      }
    } catch (error) {
      this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
    }
  }

  goBack(): void {
    if (this.isEditMode()) {
      const collaborationId = this.route.snapshot.paramMap.get('id');
      if (collaborationId) {
        this.router.navigate(['/collaboration', collaborationId]);
      } else {
        this.router.navigate(['/collaboration/list']);
      }
    } else {
      this.router.navigate(['/collaboration/list']);
    }
  }
}

