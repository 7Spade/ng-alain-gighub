import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthFacade } from '../facades/auth.facade';
import { PermissionService } from '../permissions';

/**
 * Role Guard
 *
 * 基于角色的访问控制守卫（RBAC）
 * 使用 Angular 20 函数式守卫模式
 *
 * 功能：
 * - 检查用户是否拥有所需角色
 * - 支持多角色验证（OR 逻辑）
 * - 未授权时重定向到无权限页面
 *
 * @example
 * ```typescript
 * // 在路由配置中使用
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard],
 *   data: {
 *     requiredRoles: ['admin', 'super_admin'] // 需要其中一个角色
 *   }
 * }
 * ```
 *
 * @see PermissionService
 * @see AuthFacade
 * @see docs/27-完整架構流程圖.mermaid.md
 */
export const roleGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state
): Promise<boolean | UrlTree> => {
  const authFacade = inject(AuthFacade);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  // 检查是否已认证
  const isAuthenticated = await authFacade.checkAuthStatus();
  if (!isAuthenticated) {
    console.log('[RoleGuard] User not authenticated');
    return router.createUrlTree(['/passport/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // 获取所需角色
  const requiredRoles = route.data['requiredRoles'] as string[] | undefined;
  
  if (!requiredRoles || requiredRoles.length === 0) {
    console.warn('[RoleGuard] No required roles specified, allowing access');
    return true;
  }

  // 检查用户是否拥有任一所需角色
  const hasRequiredRole = await permissionService.hasAnyRole(requiredRoles);

  if (!hasRequiredRole) {
    console.log('[RoleGuard] User does not have required roles:', requiredRoles);
    
    // 重定向到无权限页面
    return router.createUrlTree(['/exception/403']);
  }

  return true;
};
