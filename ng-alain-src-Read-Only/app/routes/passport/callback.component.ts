import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorStateService, StartupService, SupabaseService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import type { EmailOtpType } from '@supabase/supabase-js';

@Component({
  selector: 'app-callback',
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div>正在處理確認郵件...</div>
    </div>
  `,
  standalone: true
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly supabaseService = inject(SupabaseService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly errorService = inject(ErrorStateService);

  async ngOnInit(): Promise<void> {
    await this.handleEmailConfirmation();
  }

  private async handleEmailConfirmation(): Promise<void> {
    try {
      // 從 URL 查詢參數中獲取 token_hash 和 type
      const token_hash = this.route.snapshot.queryParams['token_hash'];
      const type = this.route.snapshot.queryParams['type'] as EmailOtpType | null;

      if (!token_hash || !type) {
        this.errorService.addError({
          type: 'validation',
          severity: 'error',
          message: '郵件確認失敗',
          details: '缺少必要的確認參數，請重新點擊確認郵件中的連結',
          source: 'CallbackComponent.handleEmailConfirmation',
          retryable: false
        });
        this.router.navigate(['/passport/login'], { queryParams: { error: 'invalid_token' } });
        return;
      }

      // 使用 Supabase verifyOtp 驗證 token
      const { data, error } = await this.supabaseService.client.auth.verifyOtp({
        type,
        token_hash
      });

      if (error) {
        this.errorService.addError({
          type: 'permission',
          severity: 'error',
          message: '郵件確認失敗',
          details: error.message || '郵件確認過程中發生錯誤',
          source: 'CallbackComponent.handleEmailConfirmation',
          retryable: false
        });
        this.router.navigate(['/passport/login'], { queryParams: { error: error.message } });
        return;
      }

      const session = data.session;
      const user = data.user;

      if (!session || !user) {
        this.errorService.addError({
          type: 'business',
          severity: 'error',
          message: '郵件確認失敗',
          details: '無法獲取會話或用戶信息，請重新確認郵件',
          source: 'CallbackComponent.handleEmailConfirmation',
          retryable: false
        });
        this.router.navigate(['/passport/login'], { queryParams: { error: 'session_error' } });
        return;
      }

      // 轉換 Supabase session 為 delon/auth 格式
      const userMetadata = user.user_metadata || {};
      const tokenData = {
        token: session.access_token,
        refresh_token: session.refresh_token,
        expired: session.expires_at ? session.expires_at * 1000 : +new Date() + 1000 * 60 * 60,
        id: user.id,
        name: userMetadata['name'] || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatar: userMetadata['avatar_url'] || ''
      };

      // 清空路由複用信息
      this.reuseTabService?.clear();
      // 設置用戶 Token 信息
      this.tokenService.set(tokenData);

      // 重新獲取 StartupService 內容並導航
      this.startupSrv.load().subscribe({
        next: () => {
          const url = this.tokenService.referrer?.url || '/';
          this.router.navigateByUrl(url.includes('/passport') ? '/' : url);
        },
        error: err => {
          console.error('載入應用信息失敗:', err);
          this.errorService.addError({
            type: 'http',
            severity: 'error',
            message: '載入應用信息失敗',
            details: '郵件確認成功，但載入應用信息時發生錯誤',
            source: 'CallbackComponent.startupLoad',
            retryable: true,
            retryFn: () => {
              location.reload();
            }
          });
          this.router.navigate(['/']);
        }
      });
    } catch (err: any) {
      console.error('處理確認郵件時發生錯誤:', err);
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '處理確認郵件失敗',
        details: err.message || '處理確認郵件時發生未預期的錯誤',
        source: 'CallbackComponent.handleEmailConfirmation',
        retryable: false
      });
      this.router.navigate(['/passport/login'], { queryParams: { error: 'unexpected_error' } });
    }
  }
}
