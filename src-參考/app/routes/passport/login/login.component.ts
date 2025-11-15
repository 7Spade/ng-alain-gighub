import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorStateService, StartupService, SupabaseService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'passport-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class UserLoginComponent {
  private readonly router = inject(Router);
  // private readonly settingsService = inject(SettingsService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly supabaseService = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly errorService = inject(ErrorStateService);

  form = inject(FormBuilder).nonNullable.group({
    userName: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [true]
  });
  error = '';
  loading = false;

  async submit(): Promise<void> {
    this.error = '';
    const { userName, password } = this.form.controls;
    userName.markAsDirty();
    userName.updateValueAndValidity();
    password.markAsDirty();
    password.updateValueAndValidity();
    if (userName.invalid || password.invalid) {
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    try {
      // Email/Password 登入
      const email = this.form.value.userName || '';
      const passwordValue = this.form.value.password || '';
      const result = await this.supabaseService.client.auth.signInWithPassword({
        email,
        password: passwordValue
      });

      if (result.error) {
        this.error = result.error.message;
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '登入失敗',
          details: result.error.message,
          source: 'UserLoginComponent.submit',
          retryable: false
        });
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // 轉換 Supabase session 為 delon/auth 格式
      const session = result.data.session;
      if (!session) {
        this.error = '登入失敗：無法獲取會話信息';
        this.errorService.addError({
          type: 'business',
          severity: 'error',
          message: '登入失敗',
          details: '無法獲取會話信息，請重試',
          source: 'UserLoginComponent.submit',
          retryable: false
        });
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const user = result.data.user;
      if (!user) {
        this.error = '登入失敗：無法獲取用戶信息';
        this.errorService.addError({
          type: 'business',
          severity: 'error',
          message: '登入失敗',
          details: '無法獲取用戶信息，請重試',
          source: 'UserLoginComponent.submit',
          retryable: false
        });
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const userMetadata = user.user_metadata || {};
      const tokenData = {
        token: session.access_token,
        refresh_token: session.refresh_token,
        expired: session.expires_at ? session.expires_at * 1000 : +new Date() + 1000 * 60 * 60, // 轉為毫秒時間戳
        id: user.id,
        name: userMetadata['name'] || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatar: userMetadata['avatar_url'] || ''
      };

      // 清空路由複用信息
      this.reuseTabService?.clear();
      // 設置用戶Token信息
      this.tokenService.set(tokenData);
      // 重新獲取 StartupService 內容
      this.startupSrv.load().subscribe({
        next: () => {
          let url = this.tokenService.referrer?.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        },
        error: err => {
          console.error('StartupService.load failed:', err);
          this.error = '載入應用信息失敗';
          this.errorService.addError({
            type: 'http',
            severity: 'error',
            message: '載入應用信息失敗',
            details: '啟動服務載入失敗，請刷新頁面重試',
            source: 'UserLoginComponent.startupLoad',
            retryable: true,
            retryFn: () => {
              location.reload();
            }
          });
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (err: any) {
      this.error = err.message || '登入失敗，請稍後再試';
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '登入失敗',
        details: err.message || '登入過程中發生未預期的錯誤',
        source: 'UserLoginComponent.submit',
        retryable: false
      });
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
