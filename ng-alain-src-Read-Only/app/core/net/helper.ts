import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface ReThrowHttpError {
  body: any;
  _throw: true;
}

export const CODEMESSAGE: Record<number, string> = {
  200: '服務器成功返回請求的數據。',
  201: '新建或修改數據成功。',
  202: '一個請求已經進入後臺排隊（異步任務）。',
  204: '刪除數據成功。',
  400: '發出的請求有錯誤，服務器沒有進行新建或修改數據的操作。',
  401: '用戶沒有權限（令牌、用戶名、密碼錯誤）。',
  403: '用戶得到授權，但是訪問是被禁止的。',
  404: '發出的請求針對的是不存在的記錄，服務器沒有進行操作。',
  406: '請求的格式不可得。',
  410: '請求的資源被永久刪除，且不會再得到的。',
  422: '當創建一個對象時，發生一個驗證錯誤。',
  500: '服務器發生錯誤，請檢查服務器。',
  502: '網關錯誤。',
  503: '服務不可用，服務器暫時過載或維護。',
  504: '網關超時。'
};

export function goTo(injector: Injector, url: string): void {
  setTimeout(() => injector.get(Router).navigateByUrl(url));
}

export function toLogin(injector: Injector): void {
  injector.get(NzNotificationService).error(`未登錄或登錄已過期，請重新登錄。`, ``);
  goTo(injector, injector.get(DA_SERVICE_TOKEN).login_url!);
}

export function getAdditionalHeaders(headers?: HttpHeaders): Record<string, string> {
  const res: Record<string, string> = {};
  const lang = inject(ALAIN_I18N_TOKEN).currentLang;
  if (!headers?.has('Accept-Language') && lang) {
    res['Accept-Language'] = lang;
  }

  return res;
}

export function checkStatus(injector: Injector, ev: HttpResponseBase): void {
  if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
    return;
  }

  const errortext = CODEMESSAGE[ev.status] || ev.statusText;
  injector.get(NzNotificationService).error(`請求錯誤 ${ev.status}: ${ev.url}`, errortext);
}
