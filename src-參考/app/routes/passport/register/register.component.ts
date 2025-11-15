import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateService, SupabaseService } from '@core';
import { MatchControl } from '@delon/util/form';
import { SHARED_IMPORTS } from '@shared';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'passport-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class UserRegisterComponent {
  private readonly router = inject(Router);
  private readonly supabaseService = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly errorService = inject(ErrorStateService);

  // #region fields

  form = inject(FormBuilder).nonNullable.group(
    {
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
      confirm: ['', [Validators.required, Validators.minLength(6)]]
    },
    {
      validators: MatchControl('password', 'confirm')
    }
  );
  error = '';
  loading = false;
  visible = false;
  status = 'pool';
  progress = 0;
  passwordProgressMap: Record<string, 'success' | 'normal' | 'exception'> = {
    ok: 'success',
    pass: 'normal',
    pool: 'exception'
  };

  // #endregion

  static checkPassword(control: FormControl): NzSafeAny {
    if (!control) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: NzSafeAny = this;
    self.visible = !!control.value;
    if (control.value && control.value.length > 9) {
      self.status = 'ok';
    } else if (control.value && control.value.length > 5) {
      self.status = 'pass';
    } else {
      self.status = 'pool';
    }

    if (self.visible) {
      self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
    }
  }

  // #endregion

  async submit(): Promise<void> {
    this.error = '';
    Object.keys(this.form.controls).forEach(key => {
      const control = (this.form.controls as NzSafeAny)[key] as AbstractControl;
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue();
    const email: string = typeof formValue.mail === 'string' ? formValue.mail : '';
    const password: string = typeof formValue.password === 'string' ? formValue.password : '';

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // 構建重定向 URL（確認郵件後會導向到此 URL）
      const redirectUrl = `${window.location.origin}/passport/callback`;

      // 使用 Supabase Auth API 註冊用戶
      const result = await this.supabaseService.client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (result.error) {
        this.error = result.error.message || '註冊失敗，請稍後再試';
        this.errorService.addError({
          type: 'business',
          severity: 'error',
          message: '註冊失敗',
          details: result.error.message || '註冊過程中發生錯誤',
          source: 'UserRegisterComponent.submit',
          retryable: false
        });
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // 註冊成功，導航到註冊結果頁面
      this.router.navigate(['passport', 'register-result'], { queryParams: { email } });
    } catch (err: any) {
      this.error = err.message || '註冊失敗，請稍後再試';
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '註冊失敗',
        details: err.message || '註冊過程中發生未預期的錯誤',
        source: 'UserRegisterComponent.submit',
        retryable: false
      });
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
