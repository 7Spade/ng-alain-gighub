import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthFacade } from '../facades/auth.facade';
import { PermissionService } from '../permissions';

/**
 * Branch Permission Guard
 *
 * 分支级别权限检查守卫
 * 使用 Angular 20 函数式守卫模式
 *
 * 功能：
 * - 检查用户对特定分支的访问权限
 * - 验证用户是否属于分支所在组织
 * - 检查用户在分支上的角色权限
 * - 支持多种权限类型（read, write, admin）
 *
 * @example
 * ```typescript
 * // 在路由配置中使用
 * {
 *   path: 'branch/:branchId/edit',
 *   component: BranchEditComponent,
 *   canActivate: [authGuard, branchPermissionGuard],
 *   data: {
 *     requiredPermission: 'write' // 需要写权限
 *   }
 * }
 * ```
 *
 * 路由参数：
 * - branchId: 分支 ID（从路由参数获取）
 * - blueprintId: 蓝图 ID（从路由参数获取，可选）
 *
 * 路由数据：
 * - requiredPermission: 所需权限类型 ('read' | 'write' | 'admin')
 *
 * @see PermissionService
 * @see AuthFacade
 * @see docs/27-完整架構流程圖.mermaid.md
 */
export const branchPermissionGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state
): Promise<boolean | UrlTree> => {
  const authFacade = inject(AuthFacade);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  // 检查是否已认证
  const isAuthenticated = await authFacade.checkAuthStatus();
  if (!isAuthenticated) {
    console.log('[BranchPermissionGuard] User not authenticated');
    return router.createUrlTree(['/passport/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // 获取分支 ID 和蓝图 ID
  const branchId = route.paramMap.get('branchId');
  const blueprintId = route.paramMap.get('blueprintId');
  
  if (!branchId) {
    console.warn('[BranchPermissionGuard] No branchId in route parameters');
    // 如果没有 branchId，可能是主分支，允许访问
    return true;
  }

  // 获取所需权限类型
  const requiredPermission = (route.data['requiredPermission'] as string) || 'read';

  // 检查用户对分支的权限
  const hasPermission = await new Promise<boolean>((resolve) => {
    permissionService.canAccessBlueprint(blueprintId || branchId, requiredPermission as any).subscribe({
      next: (result) => resolve(result),
      error: () => resolve(false)
    });
  });

  if (!hasPermission) {
    console.log(
      '[BranchPermissionGuard] User does not have permission:',
      requiredPermission,
      'for branch:',
      branchId
    );
    
    // 重定向到无权限页面
    return router.createUrlTree(['/exception/403'], {
      queryParams: {
        message: `您没有此分支的${requiredPermission}权限`
      }
    });
  }

  return true;
};
