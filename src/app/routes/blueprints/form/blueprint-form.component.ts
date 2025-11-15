import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintStatus } from '@core';
import { SHARED_IMPORTS, BlueprintService, Blueprint, BlueprintInsert, BlueprintUpdate } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 蓝图表单类型定义
 */
interface BlueprintFormValue {
  name: string;
  projectCode?: string | null;
  ownerId: string;
  status: BlueprintStatus;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

@Component({
  selector: 'app-blueprint-form',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule],
  template: `
    <page-header [title]="isEditMode() ? '编辑蓝图' : '创建蓝图'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </ng-template>
    </page-header>

    <div style="padding: 16px;">
      @if (blueprintService.loading()) {
        <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
          <ng-template #indicator>
            <span nz-icon nzType="loading" style="font-size: 24px;"></span>
          </ng-template>
        </nz-spin>
      } @else {
        <nz-card [nzTitle]="isEditMode() ? '编辑蓝图信息' : '创建新蓝图'">
          <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>项目名称</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入项目名称'">
                <input nz-input formControlName="name" placeholder="请输入项目名称" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">项目代码</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <input nz-input formControlName="projectCode" placeholder="请输入项目代码" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>拥有者ID</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者ID'">
                <input nz-input formControlName="ownerId" placeholder="请输入拥有者ID" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4" nzRequired>状态</nz-form-label>
              <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择状态'">
                <nz-select formControlName="status" nzPlaceHolder="请选择状态">
                  <nz-option [nzValue]="BlueprintStatus.PLANNING" nzLabel="规划中"></nz-option>
                  <nz-option [nzValue]="BlueprintStatus.ACTIVE" nzLabel="进行中"></nz-option>
                  <nz-option [nzValue]="BlueprintStatus.ON_HOLD" nzLabel="暂停"></nz-option>
                  <nz-option [nzValue]="BlueprintStatus.COMPLETED" nzLabel="已完成"></nz-option>
                  <nz-option [nzValue]="BlueprintStatus.ARCHIVED" nzLabel="已归档"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">开始日期</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <nz-date-picker formControlName="startDate" nzPlaceHolder="请选择开始日期" style="width: 100%;"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">结束日期</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <nz-date-picker formControlName="endDate" nzPlaceHolder="请选择结束日期" style="width: 100%;"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="4">描述</nz-form-label>
              <nz-form-control [nzSpan]="20">
                <textarea
                  nz-input
                  formControlName="description"
                  [nzAutosize]="{ minRows: 3, maxRows: 6 }"
                  placeholder="请输入描述"
                ></textarea>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzOffset]="4" [nzSpan]="20">
                <button nz-button nzType="primary" [disabled]="!form.valid" [nzLoading]="submitting()"> 提交 </button>
                <button nz-button nzType="default" (click)="goBack()" style="margin-left: 8px;"> 取消 </button>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-card>
      }
    </div>
  `
})
export class BlueprintFormComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 使用 signal 管理提交状态
  submitting = signal(false);

  // 使用 computed 判断是否为编辑模式
  isEditMode = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return !!id && id !== 'create';
  });

  // 导出枚举供模板使用
  BlueprintStatus = BlueprintStatus;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    projectCode: new FormControl(''),
    ownerId: new FormControl('', [Validators.required]),
    status: new FormControl(BlueprintStatus.PLANNING, [Validators.required]),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    description: new FormControl('')
  });

  ngOnInit(): void {
    if (this.isEditMode()) {
      const blueprintId = this.route.snapshot.paramMap.get('id');
      if (blueprintId) {
        this.loadBlueprint(blueprintId);
      }
    }
  }

  async loadBlueprint(id: string): Promise<void> {
    try {
      const blueprint = await this.blueprintService.loadBlueprintById(id);
      if (blueprint) {
        this.form.patchValue({
          name: blueprint.name,
          projectCode: blueprint.project_code || '',
          ownerId: blueprint.owner_id,
          status: blueprint.status as BlueprintStatus,
          startDate: blueprint.start_date || '',
          endDate: blueprint.end_date || '',
          description: blueprint.description || ''
        });
      }
    } catch (error) {
      this.message.error('加载蓝图信息失败');
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.submitting.set(true);

    try {
      const formValue = this.form.value as BlueprintFormValue;

      if (this.isEditMode()) {
        const blueprintId = this.route.snapshot.paramMap.get('id')!;
        const updateData = {
          name: formValue.name,
          project_code: formValue.projectCode || null,
          status: formValue.status,
          start_date: formValue.startDate || null,
          end_date: formValue.endDate || null,
          description: formValue.description || null
        } as any as BlueprintUpdate;
        await this.blueprintService.updateBlueprint(blueprintId, updateData);
        this.message.success('更新成功');
      } else {
        const insertData = {
          name: formValue.name,
          project_code: formValue.projectCode || null,
          owner_id: formValue.ownerId,
          status: formValue.status,
          start_date: formValue.startDate || null,
          end_date: formValue.endDate || null,
          description: formValue.description || null
        } as any as BlueprintInsert;
        const blueprint = await this.blueprintService.createBlueprint(insertData);
        this.message.success('创建成功');
        this.router.navigate(['/blueprints', blueprint.id]);
      }
    } catch (error) {
      this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
    } finally {
      this.submitting.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/blueprints/list']);
  }
}
