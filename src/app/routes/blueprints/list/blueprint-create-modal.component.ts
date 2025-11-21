import { Component, EventEmitter, Output, ViewChild, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlueprintStatus } from '@core';
import { SHARED_IMPORTS, BlueprintService, BlueprintInsert, AccountSelectorComponent } from '@shared';
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

/**
 * Blueprint Create Modal Component
 * 
 * 封装的蓝图创建模态框组件
 * 可在列表页面或其他需要创建蓝图的地方复用
 */
@Component({
  selector: 'app-blueprint-create-modal',
  standalone: true,
  imports: [SHARED_IMPORTS, ReactiveFormsModule, AccountSelectorComponent],
  template: `
    <nz-modal
      [(nzVisible)]="visible"
      nzTitle="创建新蓝图"
      [nzWidth]="720"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancel()"
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="form">
          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>项目名称</nz-form-label>
            <nz-form-control [nzSpan]="18" [nzErrorTip]="'请输入项目名称'">
              <input nz-input formControlName="name" placeholder="请输入项目名称" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6">项目代码</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <input nz-input formControlName="projectCode" placeholder="请输入项目代码" />
            </nz-form-control>
          </nz-form-item>

          <!-- 账户选择器 -->
          <app-account-selector
            (accountChange)="onOwnerAccountChange($event)"
            [helpText]="'选择蓝图拥有者。个人账户用于个人项目，组织账户用于团队项目。'"
          ></app-account-selector>

          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>状态</nz-form-label>
            <nz-form-control [nzSpan]="18" [nzErrorTip]="'请选择状态'">
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
            <nz-form-label [nzSpan]="6">开始日期</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <nz-date-picker formControlName="startDate" nzPlaceHolder="请选择开始日期" style="width: 100%;"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6">结束日期</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <nz-date-picker formControlName="endDate" nzPlaceHolder="请选择结束日期" style="width: 100%;"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6">描述</nz-form-label>
            <nz-form-control [nzSpan]="18">
              <textarea
                nz-input
                formControlName="description"
                [nzAutosize]="{ minRows: 3, maxRows: 6 }"
                placeholder="请输入描述"
              ></textarea>
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-container>

      <ng-template #modalFooter>
        <button nz-button nzType="default" (click)="handleCancel()">取消</button>
        <button nz-button nzType="primary" [disabled]="!form.valid" [nzLoading]="submitting()" (click)="handleOk()">
          创建
        </button>
      </ng-template>
    </nz-modal>
  `
})
export class BlueprintCreateModalComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly message = inject(NzMessageService);

  @Output() blueprintCreated = new EventEmitter<string>(); // 发出创建的蓝图ID

  @ViewChild(AccountSelectorComponent) accountSelector?: AccountSelectorComponent;

  // 使用 signal 管理状态
  visible = false;
  submitting = signal(false);

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

  /**
   * 打开模态框
   */
  open(): void {
    this.visible = true;
    this.form.reset({
      name: '',
      projectCode: '',
      ownerId: '',
      status: BlueprintStatus.PLANNING,
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  /**
   * 处理账户选择变化
   */
  onOwnerAccountChange(accountId: string): void {
    if (accountId && accountId.trim() !== '') {
      this.form.patchValue({ ownerId: accountId });
      this.form.get('ownerId')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.form.patchValue({ ownerId: '' });
      this.form.get('ownerId')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  /**
   * 处理取消
   */
  handleCancel(): void {
    this.visible = false;
    this.form.reset();
  }

  /**
   * 处理确认提交
   */
  async handleOk(): Promise<void> {
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
      this.visible = false;
      this.form.reset();
      
      // 发出创建成功事件，传递蓝图ID
      this.blueprintCreated.emit(blueprint.id);
    } catch (error) {
      this.message.error('创建失败');
    } finally {
      this.submitting.set(false);
    }
  }
}
