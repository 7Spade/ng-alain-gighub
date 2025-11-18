import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => {
  console.error('應用啟動失敗:', err);
  // 注意：在 bootstrap 階段無法使用 ErrorStateService，因為應用尚未初始化
  // 這裡只能使用 console.error 記錄錯誤
});
