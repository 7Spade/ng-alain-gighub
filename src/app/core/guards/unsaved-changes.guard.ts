import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

/**
 * Component 接口，用于检测未保存的更改
 */
export interface ComponentCanDeactivate {
  /**
   * 检查是否有未保存的更改
   *
   * @returns true 表示可以离开，false 表示有未保存的更改
   */
  canDeactivate: () => boolean | Promise<boolean>;
}

/**
 * Unsaved Changes Guard
 *
 * 防止用户在有未保存更改时离开页面
 * 使用 Angular 20 函数式守卫模式
 *
 * 功能：
 * - 检测组件是否有未保存的更改
 * - 显示确认对话框
 * - 支持同步和异步检查
 *
 * 组件需实现 ComponentCanDeactivate 接口：
 * ```typescript
 * export class MyComponent implements ComponentCanDeactivate {
 *   private hasUnsavedChanges = signal(false);
 *
 *   canDeactivate(): boolean {
 *     return !this.hasUnsavedChanges();
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // 在路由配置中使用
 * {
 *   path: 'edit/:id',
 *   component: EditComponent,
 *   canDeactivate: [unsavedChangesGuard]
 * }
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
export const unsavedChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = async (component): Promise<boolean> => {
  // 如果组件没有实现 canDeactivate 方法，允许离开
  if (!component.canDeactivate) {
    return true;
  }

  // 检查是否可以离开
  const canDeactivate = await component.canDeactivate();

  if (canDeactivate) {
    return true;
  }

  // 显示确认对话框
  const modal = inject(NzModalService);

  return firstValueFrom(
    modal.confirm({
      nzTitle: '确认离开',
      nzContent: '您有未保存的更改，确定要离开此页面吗？',
      nzOkText: '离开',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => true,
      nzOnCancel: () => false
    }).afterClose
  ).then(result => result === true);
};
