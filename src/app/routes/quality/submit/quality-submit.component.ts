import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-quality-submit',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'提交验收'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()">
          <span nz-icon nzType="close"></span>
          取消
        </button>
        <button nz-button nzType="primary" (click)="submit()" [nzLoading]="loading()" style="margin-left: 8px;">
          <span nz-icon nzType="check"></span>
          提交
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      <form nz-form [formGroup]="form" (ngSubmit)="submit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>蓝图</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="请选择蓝图">
            <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图">
              @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
                <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
              }
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>任务</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="请选择任务">
            <nz-select formControlName="taskId" nzPlaceHolder="请选择任务">
              <!-- TODO: 加载任务列表 -->
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>验收类型</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="请选择验收类型">
            <nz-select formControlName="inspectionType" nzPlaceHolder="请选择验收类型">
              <nz-option [nzValue]="'quality'" nzLabel="质量验收"></nz-option>
              <nz-option [nzValue]="'safety'" nzLabel="安全验收"></nz-option>
              <nz-option [nzValue]="'completion'" nzLabel="完工验收"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4">备注</nz-form-label>
          <nz-form-control [nzSpan]="20">
            <textarea nz-input formControlName="notes" [nzAutosize]="{ minRows: 3, maxRows: 6 }" placeholder="请输入备注信息"></textarea>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class QualitySubmitComponent implements OnInit {
  readonly blueprintService = inject(BlueprintService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal<boolean>(false);
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadBlueprints();
  }

  initForm(): void {
    this.form = this.fb.group({
      blueprintId: [null, [Validators.required]],
      taskId: [null, [Validators.required]],
      inspectionType: ['quality', [Validators.required]],
      notes: ['']
    });
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading.set(true);
    try {
      // TODO: 提交验收申请
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.message.success('提交成功');
      this.router.navigate(['/quality/checks']);
    } catch (error) {
      this.message.error('提交失败');
    } finally {
      this.loading.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/quality/checks']);
  }
}
