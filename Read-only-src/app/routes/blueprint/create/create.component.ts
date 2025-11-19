import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlueprintService, ErrorStateService, OrganizationContextService, OrganizationService, UserService } from '@core';
import type { CreateBlueprintInput, Organization, User } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { debounceTime, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-blueprint-create',
  standalone: true,
  templateUrl: './create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintCreateComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly orgService = inject(OrganizationService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly msg = inject(NzMessageService);
  private readonly errorService = inject(ErrorStateService);

  readonly loading = signal(false);
  readonly organizations = signal<Organization[]>([]);
  readonly currentUser = signal<User | null>(null);

  form!: FormGroup;
  readonly tags = signal<string[]>([]);
  readonly tagInput = signal('');

  // 計算屬性
  readonly isUserView = computed(() => this.orgContext.isUserView());
  readonly selectedOrganization = computed(() => this.orgContext.currentOrganization());

  // 表單值 signal - 在 initForm() 中初始化
  formValueSignal = signal<any>({});

  // 計算表單驗證狀態
  readonly isFormValid = computed(() => {
    // 依賴表單值的 signal，確保狀態變更時會重新計算
    this.formValueSignal();
    return !!this.form?.valid;
  });

  constructor() {
    this.initForm();

    // 響應式載入用戶數據
    effect(() => {
      // 當組件初始化時載入用戶數據
      this.loadUserData();
    });
  }

  private initForm(): void {
    const org = this.orgContext.currentOrganization();

    this.form = this.fb.group({
      organization_id: [org?.id || null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/), Validators.maxLength(50)]],
      description: [''],
      site_location: [''],
      project_manager_id: [null],
      current_stage: [''],
      is_private: [false],
      status: ['planning', [Validators.required]],
      start_date: [null],
      end_date: [null]
    });

    // 簡化表單處理：直接使用 toSignal 綁定整個表單值變化
    const formValue = toSignal(
      this.form.valueChanges.pipe(
        debounceTime(100), // 輕微延遲以優化性能
        shareReplay(1)
      ),
      { initialValue: this.form.value }
    );

    // 同步表單值到 signal
    effect(() => {
      const value = formValue();
      if (value) {
        this.formValueSignal.set(value);
      }
    });

    // 監聽表單值變化，自動生成 slug
    effect(() => {
      const formValue = this.formValueSignal();
      const name = formValue?.name;
      if (name && this.form && !this.form.get('slug')?.dirty) {
        const slug = this.generateSlug(name);
        this.form.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  private async loadUserData(): Promise<void> {
    // 載入當前用戶（只執行一次）
    if (!this.currentUser()) {
      const { data: user } = await this.userService.getCurrentUser();
      if (user) {
        this.currentUser.set(user);
      }
    }

    // 如果是在個人視圖，載入用戶的組織列表
    if (this.isUserView()) {
      // 載入用戶所屬的組織列表（如果有的話）
      try {
        const { data: orgs } = await this.orgService.getMyOrganizations();
        if (orgs && orgs.length > 0) {
          this.organizations.set(orgs);
        }
      } catch (error) {
        // 如果沒有組織或載入失敗，靜默處理（個人藍圖不需要組織）
        console.debug('用戶沒有組織或載入失敗:', error);
      }
    }
  }

  private generateSlug(name: string, maxLength = 50): string {
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');

    // 如果超過最大長度，截斷到最後一個連字符之前，或直接截斷
    if (slug.length > maxLength) {
      const lastDashIndex = slug.substring(0, maxLength).lastIndexOf('-');
      if (lastDashIndex > 0) {
        slug = slug.substring(0, lastDashIndex);
      } else {
        slug = slug.substring(0, maxLength);
      }
      // 移除末尾可能的連字符
      slug = slug.replace(/-+$/, '');
    }

    return slug;
  }

  private buildSubmitData(): CreateBlueprintInput | null {
    if (!this.form || !this.currentUser()) {
      return null;
    }

    const formValue = this.form.value;
    const user = this.currentUser()!;
    const isUserView = this.isUserView();
    const org = this.selectedOrganization();

    return {
      organization_id: isUserView ? null : org?.id || null,
      owner_id: user.id,
      name: formValue.name,
      slug: formValue.slug,
      description: formValue.description || undefined,
      site_location: formValue.site_location || undefined,
      project_manager_id: formValue.project_manager_id || undefined,
      current_stage: formValue.current_stage || undefined,
      is_private: formValue.is_private ?? false,
      status: formValue.status || 'planning',
      start_date: formValue.start_date ? new Date(formValue.start_date).toISOString() : undefined,
      end_date: formValue.end_date ? new Date(formValue.end_date).toISOString() : undefined,
      tags: this.tags().length > 0 ? this.tags() : undefined
    };
  }

  private buildNavigateUrl(blueprintSlug: string): string[] {
    const isUserView = this.isUserView();
    const org = this.selectedOrganization();

    return isUserView || !org ? ['/blueprint', blueprintSlug] : ['/blueprint', org.slug, blueprintSlug];
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.errorService.addError({
        type: 'validation',
        severity: 'warning',
        message: '表單驗證失敗',
        details: '請填寫所有必填欄位',
        source: 'BlueprintCreateComponent.onSubmit',
        retryable: false
      });
      return;
    }

    const input = this.buildSubmitData();
    if (!input) {
      this.errorService.addError({
        type: 'permission',
        severity: 'error',
        message: '操作失敗',
        details: '請先登入',
        source: 'BlueprintCreateComponent.onSubmit',
        retryable: false
      });
      this.msg.error('請先登入');
      return;
    }

    this.loading.set(true);

    try {
      const { data: blueprint, error } = await this.blueprintService.createBlueprint(input);

      if (error || !blueprint) {
        this.errorService.addError({
          type: 'business',
          severity: 'error',
          message: '創建藍圖失敗',
          details: error?.message || '無法創建藍圖，請稍後再試',
          source: 'BlueprintCreateComponent.onSubmit',
          retryable: true,
          retryFn: () => {
            this.onSubmit();
          }
        });
        this.msg.error(error?.message || '創建藍圖失敗');
        this.loading.set(false);
        return;
      }

      this.msg.success('藍圖創建成功');

      // 使用 computed 的導航 URL
      const url = this.buildNavigateUrl(blueprint.slug);
      this.router.navigate(url);
    } catch (error: any) {
      this.errorService.addError({
        type: 'unknown',
        severity: 'error',
        message: '創建藍圖失敗',
        details: error?.message || '發生未預期的錯誤',
        source: 'BlueprintCreateComponent.onSubmit',
        retryable: false
      });
      this.msg.error(error?.message || '創建藍圖失敗');
      this.loading.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate(['/blueprint/list']);
  }

  addTag(): void {
    const tag = this.tagInput().trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.tagInput.set('');
    }
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }
}
