import { Component, ChangeDetectionStrategy, input, inject, effect, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { PermissionService } from '@core';

/**
 * Permission Guard Component
 *
 * 基于权限的条件渲染组件
 * 使用 Angular 20 Signal Inputs 和 OnPush 策略
 *
 * 功能：
 * - 基于权限显示/隐藏内容
 * - 支持多权限组合（AND/OR）
 * - 支持角色检查
 * - 无权限时显示替代内容
 *
 * @example
 * ```html
 * <!-- 基本使用 - 需要特定权限 -->
 * <app-permission-guard [permission]="'write'">
 *   <button nz-button>编辑</button>
 * </app-permission-guard>
 *
 * <!-- 需要多个权限（AND） -->
 * <app-permission-guard [permissions]="['write', 'admin']" [mode]="'all'">
 *   <button nz-button nzType="primary">删除</button>
 * </app-permission-guard>
 *
 * <!-- 需要任一权限（OR） -->
 * <app-permission-guard [permissions]="['write', 'admin']" [mode]="'any'">
 *   <button nz-button>修改</button>
 * </app-permission-guard>
 *
 * <!-- 基于角色 -->
 * <app-permission-guard [roles]="['admin', 'owner']">
 *   <button nz-button nzDanger>危险操作</button>
 * </app-permission-guard>
 *
 * <!-- 无权限时显示替代内容 -->
 * <app-permission-guard [permission]="'admin'">
 *   <button nz-button>管理</button>
 *   <ng-template #noPermission>
 *     <nz-alert nzType="warning" nzMessage="您没有权限执行此操作" nzShowIcon />
 *   </ng-template>
 * </app-permission-guard>
 * ```
 */
@Component({
  selector: 'app-permission-guard',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasPermissionState()) {
      <ng-content />
    } @else {
      @if (showMessage()) {
        <div class="no-permission-message">
          <span nz-icon nzType="lock" nzTheme="outline"></span>
          {{ noPermissionMessage() }}
        </div>
      }
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .no-permission-message {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        padding: 4px 8px;

        [nz-icon] {
          margin-right: 4px;
        }
      }
    `
  ]
})
export class PermissionGuardComponent {
  private permissionService = inject(PermissionService);

  /** 单个权限 */
  permission = input<string>('');

  /** 多个权限 */
  permissions = input<string[]>([]);

  /** 多个角色 */
  roles = input<string[]>([]);

  /** 权限检查模式：all(需要所有) 或 any(需要任一) */
  mode = input<'all' | 'any'>('all');

  /** 资源 ID（如 branchId, blueprintId） */
  resourceId = input<string>('');

  /** 是否显示无权限消息 */
  showMessage = input<boolean>(false);

  /** 无权限时的消息 */
  noPermissionMessage = input<string>('您没有权限查看此内容');

  // 内部状态
  hasPermissionState = signal<boolean>(false);

  constructor() {
    // 使用 effect 监听权限输入变化并检查权限
    effect(async () => {
      const hasPermission = await this.checkPermissions();
      this.hasPermissionState.set(hasPermission);
    });
  }

  /**
   * 检查权限
   */
  private async checkPermissions(): Promise<boolean> {
    // 检查角色
    if (this.roles().length > 0) {
      return await this.permissionService.hasAnyRole(this.roles());
    }

    // 检查单个权限
    if (this.permission()) {
      if (this.resourceId()) {
        return await this.permissionService.checkBranchPermission(
          this.resourceId(),
          '',
          this.permission()
        );
      }
      return await this.permissionService.hasPermission(this.permission());
    }

    // 检查多个权限
    if (this.permissions().length > 0) {
      const mode = this.mode();
      
      if (mode === 'all') {
        // 需要所有权限
        const results = await Promise.all(
          this.permissions().map(p => this.permissionService.hasPermission(p))
        );
        return results.every(r => r);
      } else {
        // 需要任一权限
        const results = await Promise.all(
          this.permissions().map(p => this.permissionService.hasPermission(p))
        );
        return results.some(r => r);
      }
    }

    // 默认有权限
    return true;
  }
}
