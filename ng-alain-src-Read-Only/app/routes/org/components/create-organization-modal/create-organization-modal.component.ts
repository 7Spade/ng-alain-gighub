import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationContextService, OrganizationService } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-organization-modal',
  standalone: true,
  template: `
    <div class="modal-header">
      <div class="modal-title">建立組織</div>
    </div>
    <form [formGroup]="form" (ngSubmit)="submit()" nz-form>
      <nz-form-item>
        <nz-form-label nzRequired>組織名稱</nz-form-label>
        <nz-form-control nzErrorTip="請輸入組織名稱">
          <input nz-input formControlName="name" placeholder="例如：我的公司" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label nzRequired>組織代號</nz-form-label>
        <nz-form-control nzErrorTip="請輸入組織代號（僅允許小寫字母、數字和連字符）">
          <input nz-input formControlName="slug" placeholder="例如：my-company" />
          <div nz-form-explain>組織代號將用於 URL，例如：/org/my-company</div>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label>描述</nz-form-label>
        <nz-form-control>
          <textarea
            nz-input
            formControlName="description"
            [nzAutosize]="{ minRows: 2, maxRows: 4 }"
            placeholder="組織簡介（選填）"
          ></textarea>
        </nz-form-control>
      </nz-form-item>
      <div class="modal-footer">
        <button nz-button type="button" (click)="close()">取消</button>
        <button nz-button type="submit" nzType="primary" [nzLoading]="loading" [disabled]="!form.valid">建立</button>
      </div>
    </form>
  `,
  styles: [
    `
      .modal-header {
        padding: 16px 24px;
        border-bottom: 1px solid #f0f0f0;
      }
      .modal-title {
        font-size: 16px;
        font-weight: 500;
      }
      .modal-footer {
        padding: 16px 24px;
        text-align: right;
        border-top: 1px solid #f0f0f0;
      }
      .modal-footer button {
        margin-left: 8px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class CreateOrganizationModalComponent {
  private readonly modal = inject(NzModalRef);
  private readonly orgService = inject(OrganizationService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly msg = inject(NzMessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/), Validators.maxLength(50)]],
    description: ['']
  });

  loading = false;

  close(): void {
    this.modal.destroy();
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

    this.loading = true;
    this.cdr.detectChanges();

    try {
      const { name, slug, description } = this.form.value;
      const { data, error } = await this.orgService.createOrganization({
        name,
        slug,
        description: description || undefined
      });

      if (error || !data) {
        this.msg.error(error?.message || '建立組織失敗');
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      this.msg.success('組織建立成功');
      // 自動切換到新建立的組織
      await this.orgContext.switchToOrganization(data.id);
      this.modal.close(data);
    } catch (error: any) {
      this.msg.error(error?.message || '建立組織失敗');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
