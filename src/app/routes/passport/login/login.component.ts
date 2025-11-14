import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StartupService, SupabaseAuthAdapterService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { I18nPipe } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { finalize } from 'rxjs';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    I18nPipe,
    NzCheckboxModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class UserLoginComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);

  form = inject(FormBuilder).nonNullable.group({
    userName: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });
  error = '';
  loading = false;

  submit(): void {
    this.error = '';
    const { userName, password } = this.form.controls;
    userName.markAsDirty();
    userName.updateValueAndValidity();
    password.markAsDirty();
    password.updateValueAndValidity();
    if (userName.invalid || password.invalid) {
      return;
    }

    // 使用 Supabase Auth 進行登入
    // 適配器會自動將 Session 同步到 @delon/auth TokenService
    const email = String(this.form.value.userName || '');
    const pwd = String(this.form.value.password || '');

    if (!email || !pwd) {
      this.error = '請輸入帳號和密碼';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.supabaseAuthAdapter
      .signIn(email, pwd)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: result => {
          if (result.error) {
            this.error = result.error.message || '登入失敗';
            this.cdr.detectChanges();
            return;
          }
          // 清空路由复用信息
          this.reuseTabService?.clear();
          // 適配器已自動同步 Session 到 TokenService
          // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
          this.startupSrv.load().subscribe(() => {
            let url = this.tokenService.referrer!.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          });
        },
        error: err => {
          this.error = err.message || '登入失敗，請稍後再試';
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    // 不再需要清理 interval
  }
}
