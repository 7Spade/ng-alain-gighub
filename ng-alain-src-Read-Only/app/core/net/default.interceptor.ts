import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { IGNORE_BASE_URL } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable, of, throwError, mergeMap } from 'rxjs';

import { ErrorStateService, createErrorFromHttpResponse } from './error';
import { ReThrowHttpError, checkStatus, getAdditionalHeaders, toLogin } from './helper';
import { tryRefreshToken } from './refresh-token';

function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  // 現有邏輯：顯示通知（保持不變）
  checkStatus(injector, ev);

  // 新增：記錄 HTTP 錯誤到錯誤狀態管理
  if (ev instanceof HttpErrorResponse) {
    try {
      const errorService = injector.get(ErrorStateService);
      const errorRecord = createErrorFromHttpResponse(ev, req);
      errorService.addError(errorRecord);
    } catch (err) {
      // 如果 ErrorStateService 不可用，靜默失敗，不影響現有邏輯
      console.warn('Failed to record error to ErrorStateService', err);
    }
  }

  // 業務處理：一些通用操作
  switch (ev.status) {
    case 200:
      // 業務層級錯誤處理，以下是假定restful有一套統一輸出格式（指不管成功與否都有相應的數據格式）情況下進行處理
      // 例如響應內容：
      //  錯誤內容：{ status: 1, msg: '非法參數' }
      //  正確內容：{ status: 0, response: {  } }
      // 則以下代碼片斷可直接適用
      // if (ev instanceof HttpResponse) {
      //   const body = ev.body;
      //   if (body && body.status !== 0) {
      //     const customError = req.context.get(CUSTOM_ERROR);
      //     if (customError) injector.get(NzMessageService).error(body.msg);
      //     return customError ? throwError(() => ({ body, _throw: true }) as ReThrowHttpError) : of({});
      //   } else {
      //     // 返回原始返回體
      //     if (req.context.get(RAW_BODY) || ev.body instanceof Blob) {
      //       return of(ev);
      //     }
      //     // 重新修改 `body` 內容為 `response` 內容，對於絕大多數場景已經無須再關心業務狀態碼
      //     return of(new HttpResponse({ ...ev, body: body.response } as any));
      //     // 或者依然保持完整的格式
      //     return of(ev);
      //   }
      // }
      break;
    case 401:
      if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
        return tryRefreshToken(injector, ev, req, next);
      }
      toLogin(injector);
      break;
    case 403:
    case 404:
    case 500:
      // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
      break;
    default:
      if (ev instanceof HttpErrorResponse) {
        console.warn('未可知錯誤，大部分是由於後端不支持跨域CORS或無效配置引起，請參考 https://ng-alain.com/docs/server 解決跨域問題', ev);
      }
      break;
  }
  if (ev instanceof HttpErrorResponse) {
    return throwError(() => ev);
  } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
    return throwError(() => (ev as unknown as ReThrowHttpError).body);
  } else {
    return of(ev);
  }
}

export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
  // 統一加上服務端前綴
  let url = req.url;
  if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
    const { baseUrl } = environment.api;
    url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
  }
  const newReq = req.clone({ url, setHeaders: getAdditionalHeaders(req.headers) });
  const injector = inject(Injector);

  return next(newReq).pipe(
    mergeMap(ev => {
      // 允許統一對請求錯誤處理
      if (ev instanceof HttpResponseBase) {
        return handleData(injector, ev, newReq, next);
      }
      // 若一切都正常，則後續操作
      return of(ev);
    })
    // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
  );
};
