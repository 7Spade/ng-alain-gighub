import { HttpClient, HttpHandlerFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { EnvironmentProviders, Injector, inject, provideAppInitializer } from '@angular/core';
import { DA_SERVICE_TOKEN, type ITokenModel } from '@delon/auth';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { ErrorStateService } from './error';
import { toLogin } from './helper';

let refreshToking = false;

type TokenPayload = ITokenModel & {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  expires_in?: number;
  [key: string]: unknown;
};

let refreshToken$: BehaviorSubject<TokenPayload | null> = new BehaviorSubject<TokenPayload | null>(null);

function normalizeTokenPayload(
  next: Partial<TokenPayload> | null | undefined,
  current: Partial<TokenPayload> | null | undefined
): TokenPayload {
  const now = Date.now();
  const currentModel: Partial<TokenPayload> = current ? { ...current } : {};
  const nextModel: Partial<TokenPayload> = next ? { ...next } : {};

  const resolveToken = (value?: unknown): string | undefined => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
    return undefined;
  };

  const token = resolveToken(nextModel.token) || resolveToken(nextModel.access_token) || resolveToken(currentModel.token) || '';

  const refreshToken = resolveToken(nextModel.refresh_token) || resolveToken(currentModel.refresh_token) || '';

  const expired = (() => {
    if (typeof nextModel.expired === 'number' && Number.isFinite(nextModel.expired)) {
      return nextModel.expired;
    }
    if (typeof nextModel.expires_at === 'number' && Number.isFinite(nextModel.expires_at)) {
      return nextModel.expires_at > 1_000_000_000_000 ? nextModel.expires_at : nextModel.expires_at * 1000;
    }
    if (typeof nextModel.expires_in === 'number' && Number.isFinite(nextModel.expires_in)) {
      return now + nextModel.expires_in * 1000;
    }
    if (typeof currentModel.expired === 'number' && Number.isFinite(currentModel.expired)) {
      return currentModel.expired;
    }
    return now + 1000 * 60 * 10;
  })();

  const normalized: TokenPayload = {
    ...(currentModel as TokenPayload),
    ...(nextModel as TokenPayload),
    token,
    refresh_token: refreshToken,
    expired
  };

  return normalized;
}

/**
 * 重新附加新 Token 信息
 *
 * > 由於已經發起的請求，不會再走一遍 `@delon/auth` 因此需要結合業務情況重新附加新的 Token
 */
function reAttachToken(injector: Injector, req: HttpRequest<any>): HttpRequest<any> {
  const token = injector.get(DA_SERVICE_TOKEN).get()?.token;
  return req.clone({
    setHeaders: {
      token: `Bearer ${token}`
    }
  });
}

function refreshTokenRequest(injector: Injector): Observable<TokenPayload> {
  const tokenSrv = injector.get(DA_SERVICE_TOKEN);
  const model = tokenSrv.get() as TokenPayload | null;
  const refreshToken = typeof model?.refresh_token === 'string' ? model.refresh_token : '';
  return injector.get(HttpClient).post<TokenPayload>(
    `/api/auth/refresh`,
    {},
    {
      headers: {
        refresh_token: refreshToken
      }
    }
  );
}

/**
 * 刷新Token方式一：使用 401 重新刷新 Token
 */
export function tryRefreshToken(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  // 1、若請求為刷新Token請求，表示來自刷新Token可以直接跳轉登錄頁
  if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
    toLogin(injector);
    return throwError(() => ev);
  }
  // 2、如果 `refreshToking` 為 `true` 表示已經在請求刷新 Token 中，後續所有請求轉入等待狀態，直至結果返回後再重新發起請求
  if (refreshToking) {
    return refreshToken$.pipe(
      filter(v => !!v),
      take(1),
      switchMap(() => next(reAttachToken(injector, req)))
    );
  }
  // 3、嘗試調用刷新 Token
  refreshToking = true;
  refreshToken$.next(null);

  const tokenSrv = injector.get(DA_SERVICE_TOKEN);
  return refreshTokenRequest(injector).pipe(
    switchMap(res => {
      // 通知後續請求繼續執行
      refreshToking = false;
      const normalized = normalizeTokenPayload(res, tokenSrv.get() as Partial<TokenPayload> | null);
      refreshToken$.next(normalized);
      // 重新保存新 token
      tokenSrv.set(normalized);
      // 重新發起請求
      return next(reAttachToken(injector, req));
    }),
    catchError(err => {
      refreshToking = false;
      try {
        const errorService = injector.get(ErrorStateService);
        errorService.addError({
          type: 'permission',
          severity: 'error',
          message: 'Token 刷新失敗',
          details: '無法刷新訪問令牌，請重新登入',
          source: 'tryRefreshToken',
          retryable: false
        });
      } catch {
        // ErrorStateService 不可用時靜默失敗
      }
      toLogin(injector);
      return throwError(() => err);
    })
  );
}

function buildAuthRefresh(injector: Injector): void {
  const tokenSrv = injector.get(DA_SERVICE_TOKEN);
  tokenSrv.refresh
    .pipe(
      filter(() => !refreshToking),
      switchMap(res => {
        console.log(res);
        refreshToking = true;
        return refreshTokenRequest(injector);
      })
    )
    .subscribe({
      next: res => {
        const normalized = normalizeTokenPayload(res, tokenSrv.get() as Partial<TokenPayload> | null);
        refreshToking = false;
        refreshToken$.next(normalized);
        tokenSrv.set(normalized);
      },
      error: () => {
        try {
          const errorService = injector.get(ErrorStateService);
          errorService.addError({
            type: 'permission',
            severity: 'error',
            message: 'Token 刷新失敗',
            details: '無法刷新訪問令牌，請重新登入',
            source: 'buildAuthRefresh',
            retryable: false
          });
        } catch {
          // ErrorStateService 不可用時靜默失敗
        }
        toLogin(injector);
      }
    });
}

/**
 * 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口，需要在 `app.config.ts` 中註冊 `provideBindAuthRefresh`
 */
export function provideBindAuthRefresh(): EnvironmentProviders[] {
  return [
    provideAppInitializer(() => {
      const initializerFn = (
        (injector: Injector) => () =>
          buildAuthRefresh(injector)
      )(inject(Injector));
      return initializerFn();
    })
  ];
}
