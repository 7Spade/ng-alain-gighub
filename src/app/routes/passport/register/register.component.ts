import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { I18nPipe } from '@delon/theme';
import { MatchControl } from '@delon/util/form';
import { AuthService } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { finalize } from 'rxjs';

@Component({
  selector: 'passport-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    I18nPipe,
    RouterLink,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzPopoverModule,
    NzProgressModule,
    NzButtonModule
  ]
})
export class UserRegisterComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);

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

  submit(): void {
    this.error = '';
    Object.keys(this.form.controls).forEach(key => {
      const control = (this.form.controls as NzSafeAny)[key] as AbstractControl;
      control.markAsDirty();
      control.updateValueAndValidity();
    });
    if (this.form.invalid) {
      return;
    }

    const email = String(this.form.value.mail || '');
    const password = String(this.form.value.password || '');

    if (!email || !password) {
      this.error = '請填寫完整的註冊資訊';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.authService
      .signUp({ email, password })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: result => {
          if (!result.success || result.error) {
            this.error = result.error?.message || '註冊失敗';
            this.cdr.detectChanges();
            return;
          }
          // 註冊成功，導航到註冊結果頁面
          // Supabase 註冊可能返回 session（email 驗證關閉）或 null（email 驗證開啟）
          this.router.navigate(['passport', 'register-result'], { queryParams: { email } });
        },
        error: err => {
          this.error = err.message || '註冊失敗，請稍後再試';
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    // 不再需要清理 interval
  }
}
