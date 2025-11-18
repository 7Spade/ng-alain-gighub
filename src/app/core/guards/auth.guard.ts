import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthFacade } from '../facades/auth.facade';

/**
 * Authentication Guard
 *
 * 验证用户是否已认证的路由守卫
 * 使用 Angular 20 函数式守卫（Functional Guard）模式
 *
 * 功能：
 * - 检查用户是否已登录
 * - 未登录时重定向到登录页
 * - 保存原始 URL 以便登录后返回
 *
 * @example
 * ```typescript
 * // 在路由配置中使用
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 *
 * @see AuthFacade
 * @see docs/27-完整架構流程圖.mermaid.md
 */
export const authGuard: CanActivateFn = async (route, state): Promise<boolean | UrlTree> => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  // 检查认证状态
  const isAuthenticated = await authFacade.checkAuthStatus();

  if (!isAuthenticated) {
    console.log('[AuthGuard] User not authenticated, redirecting to login');
    
    // 保存原始 URL，登录后可以返回
    return router.createUrlTree(['/passport/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
