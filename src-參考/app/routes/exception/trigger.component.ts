import { Component, inject } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'exception-trigger',
  standalone: true,
  template: `
    <div class="pt-lg">
      <nz-card>
        @for (t of types; track $index) {
          <button (click)="go(t)" nz-button nzDanger>觸發{{ t }}</button>
        }
        <button nz-button nzType="link" (click)="refresh()">觸發刷新Token</button>
      </nz-card>
    </div>
  `,
  imports: [SHARED_IMPORTS]
})
export class ExceptionTriggerComponent {
  private readonly http = inject(_HttpClient);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  // private readonly errorService = inject(ErrorStateService);

  types = [401, 403, 404, 500];

  go(type: number): void {
    this.http.get(`/api/${type}`).subscribe({
      error: () => {
        // HTTP 錯誤會自動由攔截器處理
      }
    });
  }

  refresh(): void {
    this.tokenService.set({ token: 'invalid-token' });
    // 必須提供一個後端地址，無法通過 Mock 來模擬
    this.http.post(`https://localhost:5001/auth`).subscribe({
      next: res => console.warn('成功', res),
      error: () => {
        // HTTP 錯誤會自動由攔截器處理
      }
    });
  }
}
